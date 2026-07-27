import { Router } from "express";
import { readCollection, writeCollection, generateId } from "../lib/store.js";
import { verifyHmacSignature } from "../lib/verifySignature.js";
import { createPlan, disableSubscription } from "../lib/paystackApi.js";
import { requireAuth } from "../lib/auth.js";
import { formLimiter } from "../lib/rateLimit.js";
import { sendMail } from "../lib/mailer.js";

const router = Router();

function getSecretKey() {
  return process.env.PAYSTACK_SECRET_KEY;
}

/**
 * A transaction verify/webhook payload carries the plan code under slightly
 * different shapes across Paystack API versions (a bare string, or a nested
 * object) - this normalizes either into just the code, or null for a
 * one-time (non-subscription) charge.
 */
export function extractPlanCode(data) {
  if (data.plan_object?.plan_code) return data.plan_object.plan_code;
  if (typeof data.plan === "string" && data.plan) return data.plan;
  if (data.plan?.plan_code) return data.plan.plan_code;
  return null;
}

/**
 * Finds or creates a reusable Paystack Plan for a given monthly amount, so
 * repeat donors picking the same amount share one plan instead of a new one
 * being created every time. Plan codes are cached locally in plans.json.
 */
async function getOrCreateMonthlyPlan(amount) {
  const secretKey = getSecretKey();
  if (!secretKey) {
    throw new Error("Payments are not configured on the server (missing PAYSTACK_SECRET_KEY)");
  }

  const plans = await readCollection("plans", () => []);
  const existing = plans.find((p) => p.amount === amount && p.interval === "monthly");
  if (existing) return existing.planCode;

  const result = await createPlan(secretKey, {
    name: `Hope Alive Circle - ₦${amount.toLocaleString()}/month`,
    amountKobo: Math.round(amount * 100),
    interval: "monthly",
  });

  const planCode = result.data.plan_code;
  plans.push({ amount, interval: "monthly", planCode, createdAt: new Date().toISOString() });
  await writeCollection("plans", plans);
  return planCode;
}

export function buildReceiptEmail(entry) {
  const isSubscription = entry.type === "subscription";
  const amount = `₦${Number(entry.amount || 0).toLocaleString()}`;
  const projectLine = entry.projectTitle ? ` for ${entry.projectTitle}` : "";

  const subject = isSubscription
    ? "Welcome to Hope Alive Circle - payment received"
    : "Your CHADI International donation receipt";

  const heading = isSubscription ? "Thank you for joining Hope Alive Circle!" : "Thank you for your donation!";

  const bodyLines = isSubscription
    ? [
        `We've received your first monthly payment of ${amount}${projectLine}.`,
        `Your card will be charged ${amount} automatically every month. You can cancel anytime by contacting us.`,
        `Reference: ${entry.reference}`,
      ]
    : [`We've received your donation of ${amount}${projectLine}.`, `Reference: ${entry.reference}`];

  const text = `${heading}\n\n${bodyLines.join("\n")}\n\nCHADI International`;
  const html = `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #347928;">${heading}</h2>
      ${bodyLines.map((line) => `<p style="line-height:1.6;color:#333;">${line}</p>`).join("")}
      <hr style="margin-top:32px;border:none;border-top:1px solid #eee;" />
      <p style="font-size:12px;color:#888;">CHADI International &middot; This is an automated receipt.</p>
    </div>
  `;

  return { subject, html, text };
}

/**
 * Records a completed Paystack transaction as a donation, unless it's
 * already been recorded (the client-side verify call and the webhook can
 * both fire for the same payment - this keeps it idempotent either way).
 * A transaction initialized against a plan (Hope Alive Circle's monthly
 * giving) is recorded as type "subscription" instead of "payment"; both
 * represent a real completed charge, just a recurring vs one-off one.
 */
async function recordPayment(data) {
  const donations = await readCollection("donations", () => []);
  const alreadyRecorded = donations.some((entry) => entry.reference === data.reference);

  if (alreadyRecorded) return donations.find((entry) => entry.reference === data.reference);

  const name = data.customer?.first_name
    ? `${data.customer.first_name} ${data.customer.last_name || ""}`.trim()
    : data.customer?.email;

  const planCode = extractPlanCode(data);

  const entry = {
    id: generateId("payment"),
    createdAt: new Date().toISOString(),
    read: false,
    type: planCode ? "subscription" : "payment",
    name,
    email: data.customer?.email,
    amount: data.amount / 100,
    currency: data.currency,
    reference: data.reference,
    channel: data.channel,
    paidAt: data.paid_at,
    // Set when someone donates from a specific project's page, via
    // Paystack's metadata field - lets us track and show per-project totals.
    projectId: data.metadata?.projectId || null,
    projectTitle: data.metadata?.projectTitle || null,
    // Subscription-only fields. subscriptionCode/emailToken arrive later via
    // the subscription.create webhook (see below) - Paystack creates the
    // actual subscription record slightly after the first charge succeeds.
    ...(planCode
      ? { interval: "monthly", planCode, subscriptionStatus: "pending", subscriptionCode: null, emailToken: null }
      : {}),
  };

  donations.unshift(entry);
  await writeCollection("donations", donations);

  // Best-effort, fire-and-forget - a slow or failing receipt email should
  // never delay the donor's on-screen confirmation or the webhook response.
  if (entry.email) {
    const { subject, html, text } = buildReceiptEmail(entry);
    sendMail({ to: entry.email, subject, html, text }).catch((error) => {
      console.error("[payments] receipt email error:", error);
    });
  }

  return entry;
}

/**
 * Links a newly-created Paystack subscription (fired shortly after the
 * first charge of a plan-based transaction succeeds) back to the donation
 * entry recordPayment already created for that same charge.
 */
async function attachSubscriptionInfo(data) {
  const donations = await readCollection("donations", () => []);
  const entry = donations.find(
    (d) =>
      d.type === "subscription" &&
      d.subscriptionStatus === "pending" &&
      d.email === data.customer?.email &&
      d.planCode === data.plan?.plan_code
  );
  if (!entry) return;

  entry.subscriptionCode = data.subscription_code;
  entry.emailToken = data.email_token;
  entry.subscriptionStatus = "active";
  await writeCollection("donations", donations);
}

/** Marks a subscription inactive when Paystack reports it disabled or non-renewing (e.g. a card finally failed for good). */
async function markSubscriptionInactive(data) {
  const donations = await readCollection("donations", () => []);
  const entry = donations.find((d) => d.subscriptionCode === data.subscription_code);
  if (!entry) return;

  entry.subscriptionStatus = "cancelled";
  await writeCollection("donations", donations);
}

/**
 * Called by the donor's browser before opening the Paystack popup for a
 * monthly ("Hope Alive Circle") donation, so the popup can be initialized
 * against a plan (which is what makes Paystack bill the card automatically
 * every month afterwards) instead of a one-off amount.
 */
router.post("/plan", formLimiter, async (req, res) => {
  const amount = Number(req.body?.amount);

  if (!amount || amount < 100) {
    res.status(400).json({ error: "A valid amount is required" });
    return;
  }

  try {
    const planCode = await getOrCreateMonthlyPlan(amount);
    res.json({ planCode });
  } catch (error) {
    console.error("[payments] plan error:", error);
    res.status(502).json({ error: error.message || "Could not set up the monthly plan. Please try again." });
  }
});

/**
 * Called by the donor's own browser right after the Paystack popup closes,
 * so we can show them an immediate on-screen confirmation. This is a
 * best-effort UX nicety, NOT the authoritative record - see /webhook below
 * for that. If the browser closes before this fires, the webhook still
 * catches the payment.
 */
router.post("/verify", async (req, res) => {
  const { reference } = req.body || {};
  const secretKey = getSecretKey();

  if (!reference) {
    res.status(400).json({ error: "Transaction reference is required" });
    return;
  }

  if (!secretKey) {
    res.status(500).json({
      error: "Payment verification is not configured on the server (missing PAYSTACK_SECRET_KEY)",
    });
    return;
  }

  try {
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );

    const result = await verifyResponse.json();

    if (!verifyResponse.ok || !result.status || result.data?.status !== "success") {
      res.status(400).json({ error: "Payment could not be verified" });
      return;
    }

    const entry = await recordPayment(result.data);
    res.json({ status: "success", amount: entry.amount, reference: entry.reference, type: entry.type });
  } catch (error) {
    console.error("[payments] verify error:", error);
    res.status(502).json({ error: "Could not reach the payment provider. Please try again." });
  }
});

/**
 * The authoritative source of truth for completed payments, and for
 * subscription lifecycle events. Paystack calls this directly
 * (server-to-server), regardless of whether the donor's browser is even
 * still open. Configure this URL in your Paystack dashboard under
 * Settings -> API Keys & Webhooks:
 *
 *   https://your-domain.com/api/payments/webhook
 *
 * Only requests with a valid Paystack signature are accepted - anyone else
 * POSTing here is rejected before anything is recorded. Once a donor joins
 * Hope Alive Circle, Paystack automatically re-charges their card every
 * month and fires a new charge.success here each time - no action needed
 * on our side beyond recording it, same as a one-time payment.
 */
router.post("/webhook", async (req, res) => {
  const secretKey = getSecretKey();
  const signature = req.headers["x-paystack-signature"];

  if (!secretKey || !signature || !req.rawBody) {
    res.sendStatus(400);
    return;
  }

  if (!verifyHmacSignature(req.rawBody, signature, secretKey)) {
    console.warn("[payments] webhook signature mismatch - rejecting");
    res.sendStatus(401);
    return;
  }

  // Acknowledge immediately so Paystack doesn't retry; do the actual work
  // after responding since Paystack only cares about a fast 200.
  res.sendStatus(200);

  const event = req.body;

  try {
    if (event?.event === "charge.success" && event.data?.status === "success") {
      await recordPayment(event.data);
    } else if (event?.event === "subscription.create") {
      await attachSubscriptionInfo(event.data);
    } else if (event?.event === "subscription.disable" || event?.event === "subscription.not_renew") {
      await markSubscriptionInactive(event.data);
    }
  } catch (error) {
    console.error("[payments] webhook recording error:", error);
  }
});

/**
 * Public aggregate totals for a project's donations - no individual donor
 * details are exposed here, just a sum and a count, similar to a
 * crowdfunding progress bar. Includes both one-time payments and Hope Alive
 * Circle subscription charges.
 */
router.get("/project-summary/:projectId", async (req, res) => {
  const donations = await readCollection("donations", () => []);
  const projectDonations = donations.filter(
    (entry) =>
      (entry.type === "payment" || entry.type === "subscription") && entry.projectId === req.params.projectId
  );

  const totalRaised = projectDonations.reduce((sum, entry) => sum + (entry.amount || 0), 0);

  res.json({ totalRaised, donorCount: projectDonations.length });
});

/**
 * Lets an admin cancel a donor's Hope Alive Circle subscription (e.g. at
 * the donor's request). Requires the subscription to already be linked to
 * a Paystack subscription code, which happens shortly after the first
 * charge via the subscription.create webhook above.
 */
router.post("/subscriptions/:id/cancel", requireAuth, async (req, res) => {
  const secretKey = getSecretKey();
  if (!secretKey) {
    res.status(500).json({ error: "Payments are not configured on the server" });
    return;
  }

  const donations = await readCollection("donations", () => []);
  const entry = donations.find((d) => d.id === req.params.id);

  if (!entry || entry.type !== "subscription") {
    res.status(404).json({ error: "Subscription not found" });
    return;
  }

  if (entry.subscriptionStatus === "cancelled") {
    res.json({ status: "cancelled" });
    return;
  }

  if (!entry.subscriptionCode || !entry.emailToken) {
    res.status(400).json({
      error: "This subscription hasn't finished activating on Paystack's side yet. Try again in a moment.",
    });
    return;
  }

  try {
    await disableSubscription(secretKey, { code: entry.subscriptionCode, token: entry.emailToken });
    entry.subscriptionStatus = "cancelled";
    await writeCollection("donations", donations);
    res.json({ status: "cancelled" });
  } catch (error) {
    console.error("[payments] cancel subscription error:", error);
    res.status(502).json({ error: error.message || "Could not cancel the subscription. Please try again." });
  }
});

export default router;
