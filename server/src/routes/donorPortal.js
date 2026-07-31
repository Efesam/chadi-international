import { Router } from "express";
import { readCollection } from "../lib/store.js";
import { createDonorLinkToken, createDonorSessionToken, verifyDonorLinkToken, requireDonorAuth } from "../lib/auth.js";
import { sendMail, isMailConfigured } from "../lib/mailer.js";
import { buildReceiptPdf } from "../lib/receiptPdf.js";
import { seedSettings } from "../lib/seeds.js";
import { formLimiter } from "../lib/rateLimit.js";
import { cancelSubscription, getProjectForEntry } from "./payments.js";

const router = Router();

async function findDonationsByEmail(email) {
  const donations = await readCollection("donations", () => []);
  const normalized = String(email || "").toLowerCase();
  return donations
    .filter((d) => (d.type === "payment" || d.type === "subscription") && d.email?.toLowerCase() === normalized)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Step 1 of the magic-link login: a donor enters their email, and - only if
 * that email actually has donations on file - gets emailed a sign-in link.
 * Always responds with the same message either way, so this endpoint can't
 * be used to check whether a given email address has ever donated.
 */
router.post("/request-link", formLimiter, async (req, res) => {
  const email = String(req.body?.email || "").trim();

  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  const donations = await findDonationsByEmail(email);
  const genericMessage = "If that email has made a donation with us, we've sent a sign-in link to it.";

  if (donations.length === 0) {
    res.json({ message: genericMessage });
    return;
  }

  if (!isMailConfigured()) {
    res.status(500).json({
      error: "Email isn't configured on the server yet, so sign-in links can't be sent. See server/.env.example.",
    });
    return;
  }

  const siteUrl = process.env.SITE_URL || "https://www.chadi-international.org";
  const linkToken = createDonorLinkToken(email);
  const link = `${siteUrl}/donor-portal/verify?token=${encodeURIComponent(linkToken)}`;

  await sendMail({
    to: email,
    subject: "Your CHADI donor portal sign-in link",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #347928;">Sign in to your donor portal</h2>
        <p style="line-height: 1.6; color: #333;">
          Click below to view your donation history, download receipts, and manage any recurring giving.
          This link expires in 15 minutes and can only be used once.
        </p>
        <p><a href="${link}" style="display:inline-block;margin-top:12px;padding:12px 24px;background:#347928;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Sign In</a></p>
        <p style="font-size:12px;color:#888;margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
    text: `Sign in to your CHADI donor portal: ${link}\n\nThis link expires in 15 minutes and can only be used once.`,
  });

  res.json({ message: genericMessage });
});

/** Step 2: exchanges a clicked magic link for a real donor session token. */
router.post("/verify", async (req, res) => {
  const email = verifyDonorLinkToken(req.body?.token);

  if (!email) {
    res.status(401).json({ error: "This sign-in link is invalid or has expired. Please request a new one." });
    return;
  }

  const token = createDonorSessionToken(email);
  res.json({ token, email });
});

/** The signed-in donor's own donation history - never anyone else's. */
router.get("/donations", requireDonorAuth, async (req, res) => {
  const donations = await findDonationsByEmail(req.donorEmail);
  res.json(donations);
});

/** Regenerates a PDF receipt on demand - only for a donation that belongs to the signed-in donor. */
router.get("/receipt/:id", requireDonorAuth, async (req, res) => {
  const donations = await readCollection("donations", () => []);
  const entry = donations.find((d) => d.id === req.params.id);

  if (!entry || entry.email?.toLowerCase() !== req.donorEmail.toLowerCase()) {
    res.status(404).json({ error: "Receipt not found" });
    return;
  }

  const [settings, project] = await Promise.all([readCollection("settings", seedSettings), getProjectForEntry(entry)]);
  const pdf = await buildReceiptPdf(entry, settings, { project });

  res.type("application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="CHADI-receipt-${entry.reference}.pdf"`);
  res.send(pdf);
});

/** Lets a signed-in donor cancel their own Hope Alive Circle subscription, no admin involved. */
router.post("/subscriptions/:id/cancel", requireDonorAuth, async (req, res) => {
  const donations = await readCollection("donations", () => []);
  const entry = donations.find((d) => d.id === req.params.id);

  if (!entry || entry.email?.toLowerCase() !== req.donorEmail.toLowerCase()) {
    res.status(404).json({ error: "Subscription not found" });
    return;
  }

  const result = await cancelSubscription(req.params.id);

  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  res.json({ status: "cancelled" });
});

export default router;
