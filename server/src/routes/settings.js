import { Router } from "express";
import { readCollection, updateCollection } from "../lib/store.js";
import { requireAdmin } from "../lib/auth.js";
import { seedSettings } from "../lib/seeds.js";

const router = Router();

router.get("/", async (req, res) => {
  const settings = await readCollection("settings", seedSettings);
  res.json(settings);
});

router.put("/", requireAdmin, async (req, res) => {
  const updated = await updateCollection("settings", seedSettings, (current) => {
    const next = { ...current, ...req.body };
    return { data: next, result: next };
  });
  res.json(updated);
});

export default router;
