import { Router } from "express";
import { readCollection } from "../lib/store.js";
import { requireAuth } from "../lib/auth.js";
import { sendMail, isMailConfigured } from "../lib/mailer.js";

const router = Router();

/**
 * Lets an admin send an update email to every newsletter subscriber - e.g.
 * "New project launched" or "News update" - from the Projects/News admin
 * pages. Each subscriber gets their own individually-addressed email (never
 * BCC'd together), sent through the same SMTP config as donation receipts
 * and password resets; if SMTP isn't configured, sendMail no-ops per
 * recipient and this reports 0 sent instead of erroring.
 */
router.post("/", requireAuth, async (req, res) => {
  const { subject, heading, message, ctaText, ctaUrl } = req.body || {};

  if (!String(subject || "").trim() || !String(message || "").trim()) {
    res.status(400).json({ error: "Subject and message are required" });
    return;
  }

  if (!isMailConfigured()) {
    res.status(500).json({
      error: "Email isn't configured on the server yet (missing SMTP_HOST/SMTP_USER/SMTP_PASS). See server/.env.example.",
    });
    return;
  }

  const subscribers = await readCollection("newsletter", () => []);

  if (subscribers.length === 0) {
    res.json({ sent: 0, failed: 0, total: 0 });
    return;
  }

  const apiUrl = process.env.API_URL || `http://127.0.0.1:${process.env.PORT || 4000}`;
  const messageHtml = String(message).replace(/\n/g, "<br>");

  let sent = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
    if (!subscriber.email) continue;

    // Every subscriber gets their own link, keyed to their own entry - one
    // click removes only them, no token system needed beyond the id they
    // were already assigned at signup.
    const unsubscribeUrl = `${apiUrl}/api/newsletter/unsubscribe/${subscriber.id}`;

    const html = `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #347928;">${heading || subject}</h2>
        <p style="line-height: 1.6; color: #333;">${messageHtml}</p>
        ${
          ctaUrl
            ? `<p><a href="${ctaUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#347928;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">${
                ctaText || "Learn more"
              }</a></p>`
            : ""
        }
        <hr style="margin-top:32px;border:none;border-top:1px solid #eee;" />
        <p style="font-size:12px;color:#888;">
          You're receiving this because you subscribed to updates from CHADI International.
          <a href="${unsubscribeUrl}" style="color:#888;">Unsubscribe</a>
        </p>
      </div>
    `;

    const result = await sendMail({
      to: subscriber.email,
      subject,
      html,
      text: `${heading || subject}\n\n${message}${
        ctaUrl ? `\n\n${ctaText || "Learn more"}: ${ctaUrl}` : ""
      }\n\nUnsubscribe: ${unsubscribeUrl}`,
    });

    if (result.sent) sent += 1;
    else failed += 1;
  }

  res.json({ sent, failed, total: subscribers.length });
});

export default router;
