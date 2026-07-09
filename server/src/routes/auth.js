import { Router } from "express";
import {
  findUserByEmail,
  verifyPassword,
  createToken,
  requireAuth,
  publicUser,
  createPasswordResetToken,
  resetPasswordWithToken,
  getUsers,
} from "../lib/auth.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const user = await findUserByEmail(email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = createToken({ sub: user.id, email: user.email, role: user.role });
  res.json({ token, user: publicUser(user) });
});

router.get("/me", requireAuth, async (req, res) => {
  const users = await getUsers();
  const user = users.find((u) => u.id === req.user.sub);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({ user: publicUser(user) });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body || {};

  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  const token = await createPasswordResetToken(email);

  // No email/SMTP provider is configured, so the reset link is logged to the
  // server console (and returned in the response) instead of actually being
  // emailed. Wire up a real provider (e.g. Resend, Postmark, nodemailer+SMTP)
  // before relying on this in production.
  if (token) {
    const resetUrl = `${req.headers.origin || "http://localhost:5173"}/admin/reset-password?token=${token}`;
    console.log(`[auth] Password reset requested for ${email}: ${resetUrl}`);
  }

  // Always respond the same way whether or not the email exists, so this
  // endpoint can't be used to discover which emails have accounts.
  res.json({
    message: "If that email exists, a reset link has been generated.",
    ...(token && process.env.NODE_ENV !== "production" ? { devResetToken: token } : {}),
  });
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body || {};

  if (!token || !password) {
    res.status(400).json({ error: "Token and new password are required" });
    return;
  }

  if (String(password).length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  const success = await resetPasswordWithToken(token, password);

  if (!success) {
    res.status(400).json({ error: "This reset link is invalid or has expired" });
    return;
  }

  res.json({ message: "Password updated. You can now log in." });
});

export default router;
