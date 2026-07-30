import { Router } from "express";
import { readCollection, updateCollection, generateId } from "../lib/store.js";
import { verifyHmacSignature } from "../lib/verifySignature.js";
import { createPlan, disableSubscription, listTransactions, createRefund } from "../lib/paystackApi.js";
import { createOrder as createPaypalOrder, captureOrder as capturePaypalOrder } from "../lib/paypalApi.js";
import { requireAuth, requireAdmin } from "../lib/auth.js";
import { formLimiter } from "../lib/rateLimit.js";
import { sendMail } from "../lib/mailer.js";
import { buildReceiptPdf } from "../lib/receiptPdf.js";
import { seedSettings } from "../lib/seeds.js";

const router = Router();

// Matches the literal placeholder value shipped in .env.example
// (PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxx) - catches the case where someone
// copies .env.example to .env but never actually replaces this one value.
// Without this check, that key is treated as "configured", so the Paystack
// popup opens fine (driven by the real public key) and donors are genuinely
// charged, but every verify call fails Paystack's own auth check - the donor
// sees a confusing "payment went through but we could not confirm it"
// message, and there's no obvious signal pointing back at the real cause.
const PLACEHOLDER_SECRET_KEY_PATTERN = /xxxx/i;
let warnedAboutPlaceholderKey = false;

function getSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;

  if (key && PLACEHOLDER_SECRET_KEY_PATTERN.test(key)) {
    if (!warnedAboutPlaceholderKey) {
      console.warn(
        "[payments] PAYSTACK_SECRET_KEY still looks like the example placeholder from .env.example - " +
          "treating Paystack as unconfigured until you set your real secret key (Paystack dashboard -> " +
          "Settings -> API Keys & Webhooks). Donations will otherwise appear to succeed for the donor " +
          "but silently fail to verify on the server."
      );
      warnedAboutPlaceholderKey = true;
    }
    return null;
  }

  return key;
}

/**
 * PayPal is entirely optional, same as Paystack - unset by default, every
 * PayPal route below returns a clear "not configured" error until both of
 * these are set. Intended as a second option for international/diaspora
 * donors who'd rather not pay by card through Paystack.
 */
function getPaypalCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  return clientId && clientSecret ? { clientId, clientSecret } : null;
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

  // The Paystack "create plan" call happens inside the lock on purpose: two
  // donors picking the same amount at the same moment must not both miss
  // the "existing" check and each create a duplicate plan on Paystack.
  return updateCollection("plans", () => [], async (plans) => {
    const existing = plans.find((p) => p.amount === amount && p.interval === "monthly");
    if (existing) return { result: existing.planCode };

    const result = await createPlan(secretKey, {
      name: `Hope Alive Circle - ₦${amount.toLocaleString()}/month`,
      amountKobo: Math.round(amount * 100),
      interval: "monthly",
    });

    const planCode = result.data.plan_code;
    const next = [...plans, { amount, interval: "monthly", planCode, createdAt: new Date().toISOString() }];
    return { data: next, result: planCode };
  });
}

export function buildReceiptEmail(entry) {
  const isSubscription = entry.type === "subscription";
  const amount = `₦${Number(entry.amount || 0).toLocaleString()}`;
  const projectLine = entry.projectTitle ? ` for ${entry.projectTitle}` : "";

  const subject = isSubscription
    ? "Welcome to Hope Alive Circle - payment received"
    : "Your CHADI International donation receipt";

  const heading = isSubscription ? "Thank you for joining Hope Alive Circle!" : "Thank you for your donation!";

  const siteUrl = process.env.SITE_URL || "https://www.chadi-international.org";
  const portalLine = `View your donation history or download a receipt anytime at ${siteUrl}/donor-portal.`;
  const receiptNumberLine = entry.receiptNumber ? `Receipt No.: ${entry.receiptNumber}` : null;
  const noGoodsLine =
    "No goods or services were provided in exchange for this contribution. Please retain this receipt for your tax records.";

  const bodyLines = [
    isSubscription
      ? `We've received your first monthly payment of ${amount}${projectLine}.`
      : `We've received your donation of ${amount}${projectLine}.`,
    ...(isSubscription
      ? [
          `Your card will be charged ${amount} automatically every month. You can cancel anytime from your donor portal. This receipt covers this month's installment only.`,
        ]
      : []),
    `Reference: ${entry.reference}`,
    receiptNumberLine,
    noGoodsLine,
    portalLine,
  ].filter(Boolean);

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
 * Assigns the next number in a single, gapless, monotonically-increasing
 * sequence used for donation receipts (e.g. "CHADI-000042") - a Paystack/PayPal
 * transaction reference is unique but isn't a formal sequential receipt
 * number, which some auditors and tax authorities specifically expect.
 * Only ever called once per donation, at the moment it's first recorded (see
 * recordPayment/recordPaypalPayment below), so re-downloading the same
 * receipt later always returns the same number.
 */
async function nextReceiptNumber() {
  const n = await updateCollection("receiptCounter", () => ({ next: 1 }), (counter) => {
    const current = counter.next || 1;
    return { data: { next: current + 1 }, result: current };
  });
  return `CHADI-${String(n).padStart(6, "0")}`;
}

/**
 * The donor's typed name only ever arrives via the metadata we ourselves
 * attach when opening the Paystack popup (see DonateModal.jsx), so it's
 * checked first. Paystack's own customer.first_name/last_name are populated
 * from a saved Paystack customer profile, which a first-time donor doesn't
 * have - relying on those alone (the previous behavior) silently fell back
 * to the donor's email address as their "name" on every receipt.
 */
export function deriveDonorName(data) {
  return (
    data.metadata?.name ||
    (data.customer?.first_name
      ? `${data.customer.first_name} ${data.customer.last_name || ""}`.trim()
      : data.customer?.email)
  );
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
  // The idempotency check (has this reference already been recorded?) and
  // the insert must happen as one atomic unit - the client-side verify call
  // and the webhook can both fire for the same payment at nearly the same
  // moment, and both must not pass the check and both insert an entry.
  const { entry, isNew } = await updateCollection("donations", () => [], async (donations) => {
    const existing = donations.find((d) => d.reference === data.reference);
    if (existing) return { result: { entry: existing, isNew: false } };

    const name = deriveDonorName(data);

    const planCode = extractPlanCode(data);

    const newEntry = {
      id: generateId("payment"),
      receiptNumber: await nextReceiptNumber(),
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

    return { data: [newEntry, ...donations], result: { entry: newEntry, isNew: true } };
  });

  // Best-effort, fire-and-forget - a slow or failing receipt email should
  // never delay the donor's on-screen confirmation or the webhook response.
  // Only send once, for the request that actually created the entry.
  if (isNew && entry.email) {
    const { subject, html, text } = buildReceiptEmail(entry);

    // Best-effort here too: if the PDF fails to render for any reason, the
    // donor should still get their plain email receipt rather than nothing.
    readCollection("settings", seedSettings)
      .then((settings) => buildReceiptPdf(entry, settings))
      .then((pdf) =>
        sendMail({
          to: entry.email,
          subject,
          html,
          text,
          attachments: [{ filename: `CHADI-receipt-${entry.reference}.pdf`, content: pdf }],
        })
      )
      .catch((error) => {
        console.error("[payments] receipt PDF/email error, sending without attachment:", error);
        sendMail({ to: entry.email, subject, html, text }).catch((sendError) => {
          console.error("[payments] receipt email error:", sendError);
        });
      });
  }

  return entry;
}

/**
 * Records a captured PayPal order as a donation. PayPal only supports
 * one-time payments here (no recurring plan, unlike Hope Alive Circle's
 * Paystack subscriptions) - donors wanting monthly giving use Paystack.
 * Mirrors recordPayment's shape/idempotency/receipt logic above, kept
 * separate rather than merged so each gateway's own field-normalizing stays
 * easy to follow and the well-tested Paystack path stays untouched.
 */
async function recordPaypalPayment(capture, metadata = {}) {
  const paypalCapture = capture.purchase_units?.[0]?.payments?.captures?.[0];
  if (!paypalCapture || paypalCapture.status !== "COMPLETED") {
    throw new Error("PayPal payment was not completed");
  }

  const payer = capture.payer || {};
  const name = payer.name ? `${payer.name.given_name || ""} ${payer.name.surname || ""}`.trim() : payer.email_address;

  const { entry, isNew } = await updateCollection("donations", () => [], async (donations) => {
    const existing = donations.find((d) => d.reference === paypalCapture.id);
    if (existing) return { result: { entry: existing, isNew: false } };

    const newEntry = {
      id: generateId("payment"),
      receiptNumber: await nextReceiptNumber(),
      createdAt: new Date().toISOString(),
      read: false,
      type: "payment",
      name,
      email: payer.email_address,
      amount: Number(paypalCapture.amount?.value || 0),
      currency: paypalCapture.amount?.currency_code,
      reference: paypalCapture.id,
      channel: "paypal",
      paidAt: paypalCapture.create_time,
      projectId: metadata.projectId || null,
      projectTitle: metadata.projectTitle || null,
    };

    return { data: [newEntry, ...donations], result: { entry: newEntry, isNew: true } };
  });

  if (isNew && entry.email) {
    const { subject, html, text } = buildReceiptEmail(entry);

    readCollection("settings", seedSettings)
      .then((settings) => buildReceiptPdf(entry, settings))
      .then((pdf) =>
        sendMail({
          to: entry.email,
          subject,
          html,
          text,
          attachments: [{ filename: `CHADI-receipt-${entry.reference}.pdf`, content: pdf }],
        })
      )
      .catch((error) => {
        console.error("[payments] PayPal receipt PDF/email error, sending without attachment:", error);
        sendMail({ to: entry.email, subject, html, text }).catch((sendError) => {
          console.error("[payments] PayPal receipt email error:", sendError);
        });
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
  await updateCollection("donations", () => [], (donations) => {
    const index = donations.findIndex(
      (d) =>
        d.type === "subscription" &&
        d.subscriptionStatus === "pending" &&
        d.email === data.customer?.email &&
        d.planCode === data.plan?.plan_code
    );
    if (index === -1) return { result: null };

    const next = [...donations];
    next[index] = {
      ...next[index],
      subscriptionCode: data.subscription_code,
      emailToken: data.email_token,
      subscriptionStatus: "active",
    };
    return { data: next, result: next[index] };
  });
}

/** Marks a subscription inactive when Paystack reports it disabled or non-renewing (e.g. a card finally failed for good). */
async function markSubscriptionInactive(data) {
  await updateCollection("donations", () => [], (donations) => {
    const index = donations.findIndex((d) => d.subscriptionCode === data.subscription_code);
    if (index === -1) return { result: null };

    const next = [...donations];
    next[index] = { ...next[index], subscriptionStatus: "cancelled" };
    return { data: next, result: next[index] };
  });
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
 * Bulk version of /project-summary/:projectId - one round trip for every
 * project's totals at once, so the admin Projects list can show Raised per
 * project without firing a separate request for each row. Admin-only since
 * it's the only caller; the public per-project endpoint above already
 * exposes the same totals one at a time for the public project page.
 */
router.get("/project-summaries", requireAdmin, async (req, res) => {
  const donations = await readCollection("donations", () => []);
  const summaries = {};

  for (const entry of donations) {
    if ((entry.type !== "payment" && entry.type !== "subscription") || !entry.projectId) continue;
    const summary = summaries[entry.projectId] || { totalRaised: 0, donorCount: 0 };
    summary.totalRaised += entry.amount || 0;
    summary.donorCount += 1;
    summaries[entry.projectId] = summary;
  }

  res.json(summaries);
});

/**
 * Cancels a Hope Alive Circle subscription by donation id. Shared by the
 * admin cancel route below and the donor portal's self-service cancel
 * (routes/donorPortal.js) - callers are responsible for their own
 * authorization check (is this actually an admin, or actually this donor's
 * own subscription?) before calling this; it doesn't check that itself.
 * Returns `{ ok: true, entry }` on success, or `{ ok: false, status, error }`
 * with an HTTP status code and message the caller can pass straight through.
 */
export async function cancelSubscription(donationId) {
  const secretKey = getSecretKey();
  if (!secretKey) {
    return { ok: false, status: 500, error: "Payments are not configured on the server" };
  }

  const entry = (await readCollection("donations", () => [])).find((d) => d.id === donationId);

  if (!entry || entry.type !== "subscription") {
    return { ok: false, status: 404, error: "Subscription not found" };
  }

  if (entry.subscriptionStatus === "cancelled") {
    return { ok: true, entry };
  }

  if (!entry.subscriptionCode || !entry.emailToken) {
    return {
      ok: false,
      status: 400,
      error: "This subscription hasn't finished activating on Paystack's side yet. Try again in a moment.",
    };
  }

  try {
    await disableSubscription(secretKey, { code: entry.subscriptionCode, token: entry.emailToken });

    const updated = await updateCollection("donations", () => [], (donations) => {
      const index = donations.findIndex((d) => d.id === donationId);
      if (index === -1) return { result: null };

      const next = [...donations];
      next[index] = { ...next[index], subscriptionStatus: "cancelled" };
      return { data: next, result: next[index] };
    });

    return { ok: true, entry: updated };
  } catch (error) {
    console.error("[payments] cancel subscription error:", error);
    return { ok: false, status: 502, error: error.message || "Could not cancel the subscription. Please try again." };
  }
}

/**
 * Lets an admin cancel a donor's Hope Alive Circle subscription (e.g. at
 * the donor's request). Requires the subscription to already be linked to
 * a Paystack subscription code, which happens shortly after the first
 * charge via the subscription.create webhook above.
 */
router.post("/subscriptions/:id/cancel", requireAuth, async (req, res) => {
  const result = await cancelSubscription(req.params.id);

  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  res.json({ status: "cancelled" });
});

/**
 * Compares Paystack's own transaction history against local donations, for
 * catching anything the webhook (and the client's own best-effort verify
 * call) both missed - a brief outage, or a misconfigured secret key like the
 * placeholder-key incident this was built to catch faster. Read-only: it
 * never records anything itself, so staff can review each one before
 * deciding to import it below.
 */
router.get("/reconcile", requireAdmin, async (req, res) => {
  const secretKey = getSecretKey();
  if (!secretKey) {
    res.status(500).json({ error: "Payments are not configured on the server" });
    return;
  }

  try {
    const donations = await readCollection("donations", () => []);
    const knownReferences = new Set(donations.map((d) => d.reference));

    const result = await listTransactions(secretKey, { perPage: 100, status: "success" });
    const missing = (result.data || [])
      .filter((txn) => txn.status === "success" && !knownReferences.has(txn.reference))
      .map((txn) => ({
        reference: txn.reference,
        amount: txn.amount / 100,
        currency: txn.currency,
        email: txn.customer?.email,
        paidAt: txn.paid_at,
        channel: txn.channel,
      }));

    res.json({ checked: (result.data || []).length, missing });
  } catch (error) {
    console.error("[payments] reconcile error:", error);
    res.status(502).json({ error: error.message || "Could not reach Paystack. Please try again." });
  }
});

/** Records one specific transaction that /reconcile found on Paystack but not locally. */
router.post("/reconcile/import", requireAdmin, async (req, res) => {
  const secretKey = getSecretKey();
  if (!secretKey) {
    res.status(500).json({ error: "Payments are not configured on the server" });
    return;
  }

  const { reference } = req.body || {};
  if (!reference) {
    res.status(400).json({ error: "A transaction reference is required" });
    return;
  }

  try {
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );
    const result = await verifyResponse.json();

    if (!verifyResponse.ok || !result.status || result.data?.status !== "success") {
      res.status(400).json({ error: "Paystack does not confirm this transaction as successful" });
      return;
    }

    const entry = await recordPayment(result.data);
    res.json({ status: "success", entry });
  } catch (error) {
    console.error("[payments] reconcile import error:", error);
    res.status(502).json({ error: error.message || "Could not import this transaction. Please try again." });
  }
});

/**
 * Issues a full refund for a completed donation via Paystack. Admin-only -
 * unlike cancelling a subscription (which only stops future charges), this
 * reverses real money already collected. Marks the donation `refunded: true`
 * locally so staff see it at a glance without checking Paystack's dashboard.
 */
router.post("/donations/:id/refund", requireAdmin, async (req, res) => {
  const secretKey = getSecretKey();
  if (!secretKey) {
    res.status(500).json({ error: "Payments are not configured on the server" });
    return;
  }

  const donations = await readCollection("donations", () => []);
  const entry = donations.find((d) => d.id === req.params.id);

  if (!entry || (entry.type !== "payment" && entry.type !== "subscription")) {
    res.status(404).json({ error: "Donation not found" });
    return;
  }

  if (entry.refunded) {
    res.status(400).json({ error: "This donation has already been refunded" });
    return;
  }

  try {
    await createRefund(secretKey, { reference: entry.reference });

    const updated = await updateCollection("donations", () => [], (list) => {
      const index = list.findIndex((d) => d.id === req.params.id);
      if (index === -1) return { result: null };

      const next = [...list];
      next[index] = { ...next[index], refunded: true, refundedAt: new Date().toISOString() };
      return { data: next, result: next[index] };
    });

    res.json({ status: "refunded", entry: updated });
  } catch (error) {
    console.error("[payments] refund error:", error);
    res.status(502).json({ error: error.message || "Could not process the refund. Please try again." });
  }
});

/**
 * Lets a donor download their own receipt right after paying, before they
 * have a donor portal session (see routes/donorPortal.js for the
 * authenticated, account-wide equivalent used later). The transaction
 * reference is the capability here - Paystack references are high-entropy
 * and only ever disclosed to the paying donor's own browser, the same trust
 * model an order-confirmation download link uses.
 */
router.get("/receipt/:reference", async (req, res) => {
  const donations = await readCollection("donations", () => []);
  const entry = donations.find((d) => d.reference === req.params.reference);

  if (!entry) {
    res.status(404).json({ error: "Receipt not found" });
    return;
  }

  const settings = await readCollection("settings", seedSettings);
  const pdf = await buildReceiptPdf(entry, settings);

  res.type("application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="CHADI-receipt-${entry.reference}.pdf"`);
  res.send(pdf);
});

/** Tells the client whether to even show the "Pay with PayPal" option. */
router.get("/paypal/status", (req, res) => {
  res.json({ configured: Boolean(getPaypalCredentials()) });
});

/**
 * Called by the donor's browser once they've picked an amount, before
 * PayPal's checkout is shown - creates the order PayPal's popup then asks
 * the donor to approve.
 */
router.post("/paypal/create-order", formLimiter, async (req, res) => {
  const credentials = getPaypalCredentials();
  if (!credentials) {
    res.status(500).json({ error: "PayPal isn't configured on this site yet." });
    return;
  }

  const amount = Number(req.body?.amount);
  if (!amount || amount <= 0) {
    res.status(400).json({ error: "A valid amount is required" });
    return;
  }

  try {
    const order = await createPaypalOrder(credentials.clientId, credentials.clientSecret, {
      amount,
      currency: req.body?.currency || "USD",
      description: req.body?.projectTitle ? `Donation - ${req.body.projectTitle}` : "Donation to CHADI International",
    });
    res.json({ orderId: order.id });
  } catch (error) {
    console.error("[payments] paypal create-order error:", error);
    res.status(502).json({ error: error.message || "Could not start the PayPal checkout. Please try again." });
  }
});

/** Called once the donor approves the payment in the PayPal popup - actually completes the charge. */
router.post("/paypal/capture-order", async (req, res) => {
  const credentials = getPaypalCredentials();
  if (!credentials) {
    res.status(500).json({ error: "PayPal isn't configured on this site yet." });
    return;
  }

  const { orderId, projectId, projectTitle } = req.body || {};
  if (!orderId) {
    res.status(400).json({ error: "An order id is required" });
    return;
  }

  try {
    const capture = await capturePaypalOrder(credentials.clientId, credentials.clientSecret, orderId);
    const entry = await recordPaypalPayment(capture, { projectId, projectTitle });
    res.json({ status: "success", amount: entry.amount, reference: entry.reference });
  } catch (error) {
    console.error("[payments] paypal capture-order error:", error);
    res.status(502).json({ error: error.message || "Could not complete the PayPal payment. Please try again." });
  }
});

export default router;
