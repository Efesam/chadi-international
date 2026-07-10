import { Router } from "express";
import { readCollection, writeCollection, generateId } from "../lib/store.js";

const router = Router();

// Read lazily (not at import time) so tests / restarts pick up env changes
// without needing a process reload in dev.
function getSecretKey() {
  return process.env.PAYSTACK_SECRET_KEY;
}

/**
 * Verifies a Paystack transaction reference directly with Paystack's API
 * using the secret key, and only then records it as a completed donation.
 * The client never gets to assert "this payment succeeded" on its own -
 * only Paystack's own server-to-server response is trusted.
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

    const { data } = result;

    const donations = await readCollection("donations", () => []);
    const alreadyRecorded = donations.some((entry) => entry.reference === data.reference);

    if (!alreadyRecorded) {
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
      };

      donations.unshift(entry);
      await writeCollection("donations", donations);
    }

    res.json({ status: "success", amount: data.amount / 100, reference: data.reference });
  } catch (error) {
    console.error("[payments] verify error:", error);
    res.status(502).json({ error: "Could not reach the payment provider. Please try again." });
  }
});

export default router;
