// Optional sync of newsletter signups to Mailchimp, so an org that already
// sends its newsletter through Mailchimp doesn't have to also manage a
// second, separate subscriber list. Entirely opt-in - both env vars unset
// (the default) means this quietly does nothing, same pattern as every
// other optional integration in this project (Paystack, Sentry, Plausible,
// Cloudinary, PayPal).
function getConfig() {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  if (!apiKey || !audienceId) return null;

  // Mailchimp API keys are always "<key>-<datacenter>", e.g. "abc123-us21" -
  // the datacenter is also the API's subdomain.
  const datacenter = apiKey.split("-").pop();
  return { apiKey, audienceId, datacenter };
}

export function isMailchimpConfigured() {
  return Boolean(getConfig());
}

/**
 * Adds (or re-subscribes) an email to the configured Mailchimp audience.
 * Best-effort by design - callers should treat failures as non-fatal, since
 * the subscriber is already safely recorded in this site's own newsletter
 * collection regardless of whether the Mailchimp sync succeeds.
 */
export async function subscribeToMailchimp(email) {
  const config = getConfig();
  if (!config || !email) return { synced: false, reason: "not_configured" };

  const url = `https://${config.datacenter}.api.mailchimp.com/3.0/lists/${config.audienceId}/members`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`anystring:${config.apiKey}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email_address: email, status: "subscribed" }),
  });

  if (response.ok) return { synced: true };

  const result = await response.json().catch(() => ({}));
  // "Member Exists" (400) just means they're already subscribed - not a
  // real failure from this site's point of view.
  if (result.title === "Member Exists") return { synced: true };

  console.error("[mailchimp] sync failed:", result.detail || response.statusText);
  return { synced: false, reason: result.detail || "request_failed" };
}
