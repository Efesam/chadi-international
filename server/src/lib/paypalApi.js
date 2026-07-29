// Thin wrapper around PayPal's REST API (Orders v2), mirroring paystackApi.js's
// shape. Only used if PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET are set - see
// getPaypalCredentials() in routes/payments.js.
const PAYPAL_BASE =
  process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

/** Exchanges the client id/secret for a short-lived OAuth access token. */
async function getAccessToken(clientId, clientSecret) {
  const response = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error_description || "Could not authenticate with PayPal");

  return result.access_token;
}

async function paypalRequest(clientId, clientSecret, path, options = {}) {
  const accessToken = await getAccessToken(clientId, clientSecret);

  const response = await fetch(`${PAYPAL_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || `PayPal request to ${path} failed`);

  return result;
}

/** Creates a PayPal order for a one-time donation. Amount is in whole currency units (e.g. USD dollars, not cents). */
export function createOrder(clientId, clientSecret, { amount, currency = "USD", description }) {
  return paypalRequest(clientId, clientSecret, "/v2/checkout/orders", {
    method: "POST",
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: currency, value: Number(amount).toFixed(2) },
          description,
        },
      ],
    }),
  });
}

/** Captures a previously-created and donor-approved order, completing the payment. */
export function captureOrder(clientId, clientSecret, orderId) {
  return paypalRequest(clientId, clientSecret, `/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
  });
}
