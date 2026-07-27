import express from "express";
import helmet from "helmet";
import { createCrudRouter } from "./lib/crud.js";
import { createSubmissionRouter } from "./lib/submissions.js";
import { readCollection } from "./lib/store.js";
import { requireAuth } from "./lib/auth.js";
import {
  seedProjects,
  seedEvents,
  seedTeam,
  seedGallery,
  seedPartners,
  seedStories,
  seedSettings,
  seedNews,
} from "./lib/seeds.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import settingsRouter from "./routes/settings.js";
import paymentsRouter from "./routes/payments.js";
import broadcastRouter from "./routes/broadcast.js";
import uploadsRouter from "./routes/uploads.js";
import { uploadsDir } from "./lib/upload.js";
import { apiLimiter, formLimiter } from "./lib/rateLimit.js";

const port = Number(process.env.PORT || 4000);
const app = express();

// Sets a range of standard HTTP security headers (clickjacking protection,
// MIME-sniffing protection, etc.). Safe defaults for a JSON-only API - no
// HTML is served here, so helmet's content-security-policy defaults don't
// need any adjustment. crossOriginResourcePolicy is relaxed to "cross-origin"
// on purpose: this API is meant to be called from the client running on a
// different origin/port, which helmet's same-origin default would block.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  express.json({
    limit: "1mb",
    // Keep the raw bytes around too - Paystack's webhook signature is
    // computed over the exact raw body, not the re-serialized JSON.
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Manual CORS. Set ALLOWED_ORIGINS (comma-separated) to your real production
// domain(s) once you have one - only those origins get the header then.
// Left unset, every origin is allowed, which is fine for local development
// but should be tightened before going live.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;

  if (allowedOrigins.length === 0) {
    res.header("Access-Control-Allow-Origin", "*");
  } else if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.header("Access-Control-Allow-Origin", requestOrigin);
    res.header("Vary", "Origin");
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "chadi-api" });
});

// Baseline abuse protection across the whole API. The stricter per-endpoint
// limiters below (formLimiter, authLimiter) layer on top of this for the
// most sensitive routes.
app.use("/api", apiLimiter);

// CMS-managed collections. GET is public (the marketing site reads from
// these); POST/PUT/DELETE require an authenticated admin session.
app.use("/api/news", createCrudRouter({ name: "news", seed: seedNews, requiredFields: ["title"] }));
app.use("/api/projects", createCrudRouter({ name: "projects", seed: seedProjects, requiredFields: ["title"] }));
app.use("/api/events", createCrudRouter({ name: "events", seed: seedEvents, requiredFields: ["title", "date"] }));
app.use("/api/team", createCrudRouter({ name: "team", seed: seedTeam, requiredFields: ["name", "role"] }));
app.use("/api/gallery", createCrudRouter({ name: "gallery", seed: seedGallery, requiredFields: ["title", "image"] }));
app.use("/api/partners", createCrudRouter({ name: "partners", seed: seedPartners, requiredFields: ["name"] }));
app.use("/api/stories", createCrudRouter({ name: "stories", seed: seedStories, requiredFields: ["title"] }));

// Site-wide settings (stats shown on the home page, contact info, socials).
app.use("/api/settings", settingsRouter);
// Kept for backwards compatibility with the old static /api/stats route.
app.get("/api/stats", async (req, res) => {
  const settings = await readCollection("settings", seedSettings);
  res.json(settings.stats);
});

// Public form submissions. Anyone can POST; only admins can list/manage them.
app.use("/api/contact", createSubmissionRouter({ name: "contacts", requiredFields: ["name", "email", "subject", "message"], limiter: formLimiter }));
app.use("/api/volunteers", createSubmissionRouter({ name: "volunteers", requiredFields: ["name", "email", "area"], limiter: formLimiter }));
app.use("/api/newsletter", createSubmissionRouter({ name: "newsletter", requiredFields: ["email"], limiter: formLimiter }));
app.use("/api/donations", createSubmissionRouter({ name: "donations", requiredFields: ["name", "email", "interest"], limiter: formLimiter }));

// Admin-triggered update emails to newsletter subscribers (new/updated project or news announcements).
app.use("/api/broadcast", broadcastRouter);

// Auth + admin user management.
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

// Paystack payment verification (donations made via the Donate page).
app.use("/api/payments", paymentsRouter);

// Image uploads for the admin dashboard - authenticated users upload here,
// then everyone (including the public site) can load the file back by URL.
app.use("/api/uploads", uploadsRouter);
app.use("/uploads", express.static(uploadsDir));

// Aggregate counts for the dashboard overview page.
app.get("/api/admin/summary", requireAuth, async (req, res) => {
  const [contacts, volunteers, newsletter, donations, projects, events, team, gallery, partners, stories] =
    await Promise.all([
      readCollection("contacts", () => []),
      readCollection("volunteers", () => []),
      readCollection("newsletter", () => []),
      readCollection("donations", () => []),
      readCollection("projects", seedProjects),
      readCollection("events", seedEvents),
      readCollection("team", seedTeam),
      readCollection("gallery", seedGallery),
      readCollection("partners", seedPartners),
      readCollection("stories", seedStories),
    ]);

  const completedPayments = donations.filter((d) => d.type === "payment" || d.type === "subscription");
  const totalRaised = completedPayments.reduce((sum, d) => sum + (d.amount || 0), 0);
  const activeSubscriptions = donations.filter(
    (d) => d.type === "subscription" && d.subscriptionStatus !== "cancelled"
  ).length;

  res.json({
    messages: contacts.length,
    unreadMessages: contacts.filter((c) => !c.read).length,
    volunteers: volunteers.length,
    newsletterSubscribers: newsletter.length,
    donationInterests: donations.filter((d) => d.type !== "payment" && d.type !== "subscription").length,
    completedPayments: completedPayments.length,
    totalRaised,
    activeSubscriptions,
    projects: projects.length,
    events: events.length,
    team: team.length,
    gallery: gallery.length,
    partners: partners.length,
    stories: stories.length,
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: error.message || "Server error" });
});

app.listen(port, () => {
  console.log(`CHADI API running on http://127.0.0.1:${port}`);
});
