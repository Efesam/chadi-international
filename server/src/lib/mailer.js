import nodemailer from "nodemailer";

let cachedTransport = null;
let cachedConfigKey = null;

function getConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    user: SMTP_USER,
    pass: SMTP_PASS,
    from: SMTP_FROM || SMTP_USER,
  };
}

function getTransport(config) {
  const configKey = JSON.stringify(config);
  if (cachedTransport && cachedConfigKey === configKey) return cachedTransport;

  cachedTransport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
  });
  cachedConfigKey = configKey;
  return cachedTransport;
}

/**
 * Sends an email if SMTP_HOST/SMTP_USER/SMTP_PASS are configured; otherwise
 * logs the content to the console instead, the same "degrade gracefully in
 * dev" pattern used for the Paystack secret key. Never throws - a failed or
 * unconfigured email should never break the request that triggered it.
 */
export async function sendMail({ to, subject, html, text }) {
  const config = getConfig();

  if (!config) {
    console.log(`[mailer] SMTP not configured - would have sent to ${to}:`);
    console.log(`[mailer] Subject: ${subject}`);
    console.log(`[mailer] ${text || html}`);
    return { sent: false, reason: "not_configured" };
  }

  try {
    const transport = getTransport(config);
    await transport.sendMail({ from: config.from, to, subject, html, text });
    return { sent: true };
  } catch (error) {
    console.error("[mailer] Failed to send email:", error.message);
    return { sent: false, reason: "send_failed" };
  }
}
