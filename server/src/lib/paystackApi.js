const PAYSTACK_BASE = "https://api.paystack.co";

async function paystackRequest(secretKey, path, options = {}) {
  const response = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.status === false) {
    throw new Error(result.message || `Paystack request to ${path} failed`);
  }

  return result;
}

/** Creates a Paystack billing Plan (used to start a recurring subscription). */
export function createPlan(secretKey, { name, amountKobo, interval }) {
  return paystackRequest(secretKey, "/plan", {
    method: "POST",
    body: JSON.stringify({ name, amount: amountKobo, interval }),
  });
}

/** Cancels an active subscription. `token` is the subscription's email_token, from the subscription.create webhook. */
export function disableSubscription(secretKey, { code, token }) {
  return paystackRequest(secretKey, "/subscription/disable", {
    method: "POST",
    body: JSON.stringify({ code, token }),
  });
}

/** Lists Paystack's own transaction history - used to reconcile against local records (see /payments/reconcile). */
export function listTransactions(secretKey, { perPage = 100, page = 1, status } = {}) {
  const params = new URLSearchParams({ perPage: String(perPage), page: String(page) });
  if (status) params.set("status", status);
  return paystackRequest(secretKey, `/transaction?${params.toString()}`);
}

/** Issues a refund for a completed transaction. `amountKobo` omitted means a full refund. */
export function createRefund(secretKey, { reference, amountKobo }) {
  const body = { transaction: reference };
  if (amountKobo) body.amount = amountKobo;

  return paystackRequest(secretKey, "/refund", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
