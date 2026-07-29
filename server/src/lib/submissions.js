import { Router } from "express";
import { readCollection, updateCollection, generateId } from "./store.js";
import { requireAuth } from "./auth.js";

// A hidden field every public form includes (see Honeypot.jsx) but no real
// visitor ever sees or fills in. Real, unsophisticated spam bots that
// auto-fill every input on a form fill this too, outing themselves - a
// filled honeypot gets a normal-looking success response (so the bot has no
// signal to adapt to) but is silently dropped instead of saved. The name is
// deliberately generic/synthetic rather than something like "website" -
// common honeypot names double as browser autocomplete categories, which
// risks a password manager filling it in for a real visitor.
const HONEYPOT_FIELD = "hp_field";

/**
 * Builds a router for a public submission type (contact messages, volunteer
 * applications, newsletter signups, donation interest). Anyone can POST;
 * only authenticated admins can list, mark read, or delete entries.
 */
export function createSubmissionRouter({ name, requiredFields = [], limiter, afterCreate }) {
  const router = Router();
  const postGuard = limiter ? [limiter] : [];

  router.post("/", ...postGuard, async (req, res) => {
    const { [HONEYPOT_FIELD]: honeypot, ...body } = req.body || {};

    if (honeypot) {
      res.status(201).json({ message: "Submission received" });
      return;
    }

    const missing = requiredFields.filter((field) => !String(body?.[field] || "").trim());

    if (missing.length) {
      res.status(400).json({ error: `Missing required field: ${missing.join(", ")}` });
      return;
    }

    const entry = {
      id: generateId(name.replace(/s$/, "")),
      createdAt: new Date().toISOString(),
      read: false,
      ...body,
    };

    await updateCollection(name, () => [], (items) => ({
      data: [entry, ...items],
      result: entry,
    }));

    res.status(201).json({ message: "Submission received", data: entry });

    // Fire-and-forget: the submission is already safely saved above,
    // regardless of whether this succeeds.
    if (afterCreate) {
      Promise.resolve(afterCreate(entry)).catch((error) => {
        console.error(`[submissions:${name}] afterCreate hook failed:`, error);
      });
    }
  });

  router.get("/", requireAuth, async (req, res) => {
    const items = await readCollection(name, () => []);
    res.json(items);
  });

  router.patch("/:id", requireAuth, async (req, res) => {
    const updated = await updateCollection(name, () => [], (items) => {
      const index = items.findIndex((i) => i.id === req.params.id);
      if (index === -1) return { result: null };

      const next = [...items];
      next[index] = { ...items[index], ...req.body };
      return { data: next, result: next[index] };
    });

    if (!updated) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }

    res.json(updated);
  });

  router.delete("/:id", requireAuth, async (req, res) => {
    const deleted = await updateCollection(name, () => [], (items) => {
      const next = items.filter((i) => i.id !== req.params.id);
      if (next.length === items.length) return { result: false };
      return { data: next, result: true };
    });

    if (!deleted) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }

    res.status(204).end();
  });

  return router;
}
