import express from "express";
import { programs, news } from "./data.js";
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
} from "./lib/seeds.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import settingsRouter from "./routes/settings.js";
import paymentsRouter from "./routes/payments.js";

const port = Number(process.env.PORT || 4000);
const app = express();

app.use(express.json({ limit: "1mb" }));

// Manual CORS so the client can be served from any origin during development.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
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

// Static reference content - not managed by the CMS.
app.get("/api/programs", (req, res) => res.json(programs));
app.get("/api/news", (req, res) => res.json(news));

// CMS-managed collections. GET is public (the marketing site reads from
// these); POST/PUT/DELETE require an authenticated admin session.
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
app.use("/api/contact", createSubmissionRouter({ name: "contacts", requiredFields: ["name", "email", "subject", "message"] }));
app.use("/api/volunteers", createSubmissionRouter({ name: "volunteers", requiredFields: ["name", "email", "area"] }));
app.use("/api/newsletter", createSubmissionRouter({ name: "newsletter", requiredFields: ["email"] }));
app.use("/api/donations", createSubmissionRouter({ name: "donations", requiredFields: ["name", "email", "interest"] }));

// Auth + admin user management.
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

// Paystack payment verification (donations made via the Donate page).
app.use("/api/payments", paymentsRouter);

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

  const completedPayments = donations.filter((d) => d.type === "payment");
  const totalRaised = completedPayments.reduce((sum, d) => sum + (d.amount || 0), 0);

  res.json({
    messages: contacts.length,
    unreadMessages: contacts.filter((c) => !c.read).length,
    volunteers: volunteers.length,
    newsletterSubscribers: newsletter.length,
    donationInterests: donations.filter((d) => d.type !== "payment").length,
    completedPayments: completedPayments.length,
    totalRaised,
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
