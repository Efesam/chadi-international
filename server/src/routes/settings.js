import { Router } from "express";
import { readCollection, writeCollection } from "../lib/store.js";
import { requireAdmin } from "../lib/auth.js";
import { seedSettings } from "../lib/seeds.js";

const router = Router();

router.get("/", async (req, res) => {
  const settings = await readCollection("settings", seedSettings);
  res.json(settings);
});

router.put("/", requireAdmin, async (req, res) => {
  const current = await readCollection("settings", seedSettings);
  const updated = { ...current, ...req.body };
  await writeCollection("settings", updated);
  res.json(updated);
});

export default router;
