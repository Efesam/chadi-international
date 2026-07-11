import { Router } from "express";
import { readCollection, writeCollection, generateId } from "./store.js";
import { requireAuth } from "./auth.js";

/**
 * Builds a router for a public submission type (contact messages, volunteer
 * applications, newsletter signups, donation interest). Anyone can POST;
 * only authenticated admins can list, mark read, or delete entries.
 */
export function createSubmissionRouter({ name, requiredFields = [], limiter }) {
  const router = Router();
  const postGuard = limiter ? [limiter] : [];

  router.post("/", ...postGuard, async (req, res) => {
    const missing = requiredFields.filter((field) => !String(req.body?.[field] || "").trim());

    if (missing.length) {
      res.status(400).json({ error: `Missing required field: ${missing.join(", ")}` });
      return;
    }

    const items = await readCollection(name, () => []);
    const entry = {
      id: generateId(name.replace(/s$/, "")),
      createdAt: new Date().toISOString(),
      read: false,
      ...req.body,
    };

    items.unshift(entry);
    await writeCollection(name, items);
    res.status(201).json({ message: "Submission received", data: entry });
  });

  router.get("/", requireAuth, async (req, res) => {
    const items = await readCollection(name, () => []);
    res.json(items);
  });

  router.patch("/:id", requireAuth, async (req, res) => {
    const items = await readCollection(name, () => []);
    const index = items.findIndex((i) => i.id === req.params.id);

    if (index === -1) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }

    items[index] = { ...items[index], ...req.body };
    await writeCollection(name, items);
    res.json(items[index]);
  });

  router.delete("/:id", requireAuth, async (req, res) => {
    const items = await readCollection(name, () => []);
    const next = items.filter((i) => i.id !== req.params.id);

    if (next.length === items.length) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }

    await writeCollection(name, next);
    res.status(204).end();
  });

  return router;
}
