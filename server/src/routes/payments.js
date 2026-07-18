import { Router } from "express";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readCollection, writeCollection, generateId } from "../lib/store.js";

const router = Router();

function getSecretKey() {
  return process.env.PAYSTACK_SECRET_KEY;
}

/**
 * Records a completed Paystack transaction as a donation, unless it's
 * already been recorded (the client-side verify call and the webhook can
 * both fire for the same payment - this keeps it idempotent either way).
 */
async function recordPayment(data) {
  const donations = await readCollection("donations", () => []);
  const alreadyRecorded = donations.some((entry) => entry.reference === data.reference);

  if (alreadyRecorded) return donations.find((entry) => entry.reference === data.reference);

  const name = data.customer?.first_name
    ? `${data.customer.first_name} ${data.customer.last_name || ""}`.trim()
    : data.customer?.email;

  const entry = {
    id: generateId("payment"),
    createdAt: new Date().toISOString(),
    read: false,
    type: "payment",
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
  };

  donations.unshift(entry);
  await writeCollection("donations", donations);
  return entry;
}

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
    res.json({ status: "success", amount: entry.amount, reference: entry.reference });
  } catch (error) {
    console.error("[payments] verify error:", error);
    res.status(502).json({ error: "Could not reach the payment provider. Please try again." });
  }
});

/**
 * The authoritative source of truth for completed payments. Paystack calls
 * this directly (server-to-server) the moment a charge succeeds, regardless
 * of whether the donor's browser is even still open. Configure this URL in
 * your Paystack dashboard under Settings -> API Keys & Webhooks:
 *
 *   https://your-domain.com/api/payments/webhook
 *
 * Only requests with a valid Paystack signature are accepted - anyone else
 * POSTing here is rejected before anything is recorded.
 */
router.post("/webhook", async (req, res) => {
  const secretKey = getSecretKey();
  const signature = req.headers["x-paystack-signature"];

  if (!secretKey || !signature || !req.rawBody) {
    res.sendStatus(400);
    return;
  }

  const expectedSignature = createHmac("sha512", secretKey).update(req.rawBody).digest("hex");

  const sigBuf = Buffer.from(signature, "utf8");
  const expectedBuf = Buffer.from(expectedSignature, "utf8");

  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    console.warn("[payments] webhook signature mismatch - rejecting");
    res.sendStatus(401);
    return;
  }

  // Acknowledge immediately so Paystack doesn't retry; do the actual work
  // after responding since Paystack only cares about a fast 200.
  res.sendStatus(200);

  const event = req.body;

  if (event?.event === "charge.success" && event.data?.status === "success") {
    try {
      await recordPayment(event.data);
    } catch (error) {
      console.error("[payments] webhook recording error:", error);
    }
  }
});

/**
 * Public aggregate totals for a project's donations - no individual donor
 * details are exposed here, just a sum and a count, similar to a
 * crowdfunding progress bar.
 */
router.get("/project-summary/:projectId", async (req, res) => {
  const donations = await readCollection("donations", () => []);
  const projectDonations = donations.filter(
    (entry) => entry.type === "payment" && entry.projectId === req.params.projectId
  );

  const totalRaised = projectDonations.reduce((sum, entry) => sum + (entry.amount || 0), 0);

  res.json({ totalRaised, donorCount: projectDonations.length });
});

export default router;
