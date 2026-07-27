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
