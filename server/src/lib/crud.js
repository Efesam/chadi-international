import { Router } from "express";
import { readCollection, updateCollection, generateId } from "./store.js";
import { requireAuth } from "./auth.js";
import { translateItem, translateItems, isSupportedTarget } from "./translate.js";

/**
 * Builds an Express router that provides list/create/update/delete for a
 * named JSON-backed collection.
 *
 * @param {object} options
 * @param {string} options.name - collection name (also the JSON filename)
 * @param {() => any[]} options.seed - seed data used the first time the collection is read
 * @param {string[]} options.requiredFields - fields required on create
 * @param {boolean} options.publicRead - if true, GET is not behind requireAuth
 * @param {Array<string|{name: string, html?: boolean}>} options.translatableFields -
 *   fields machine-translated on GET when the client passes ?lang=<code> for
 *   one of the site's non-English languages (see lib/translate.js). Content
 *   is stored in whatever language it was written in; this only affects what
 *   a given request is served, never what's saved.
 */
export function createCrudRouter({
  name,
  seed = () => [],
  requiredFields = [],
  publicRead = true,
  translatableFields = [],
}) {
  const router = Router();
  const readGuard = publicRead ? [] : [requireAuth];

  router.get("/", ...readGuard, async (req, res) => {
    const items = await readCollection(name, seed);
    const lang = req.query.lang;

    if (translatableFields.length && isSupportedTarget(lang)) {
      res.json(await translateItems(items, translatableFields, lang));
      return;
    }

    res.json(items);
  });

  router.get("/:id", ...readGuard, async (req, res) => {
    const items = await readCollection(name, seed);
    const item = items.find((i) => i.id === req.params.id || i.slug === req.params.id);

    if (!item) {
      res.status(404).json({ error: `${name} item not found` });
      return;
    }

    const lang = req.query.lang;

    if (translatableFields.length && isSupportedTarget(lang)) {
      res.json(await translateItem(item, translatableFields, lang));
      return;
    }

    res.json(item);
  });

  router.post("/", requireAuth, async (req, res) => {
    const missing = requiredFields.filter((field) => !String(req.body?.[field] || "").trim());

    if (missing.length) {
      res.status(400).json({ error: `Missing required field: ${missing.join(", ")}` });
      return;
    }

    const item = {
      id: generateId(name.replace(/s$/, "")),
      createdAt: new Date().toISOString(),
      ...req.body,
    };

    await updateCollection(name, seed, (items) => ({
      data: [item, ...items],
      result: item,
    }));

    res.status(201).json(item);
  });

  router.put("/:id", requireAuth, async (req, res) => {
    const updated = await updateCollection(name, seed, (items) => {
      const index = items.findIndex((i) => i.id === req.params.id);
      if (index === -1) return { result: null };

      const next = [...items];
      next[index] = {
        ...items[index],
        ...req.body,
        id: items[index].id,
        updatedAt: new Date().toISOString(),
      };

      return { data: next, result: next[index] };
    });

    if (!updated) {
      res.status(404).json({ error: `${name} item not found` });
      return;
    }

    res.json(updated);
  });

  router.delete("/:id", requireAuth, async (req, res) => {
    const deleted = await updateCollection(name, seed, (items) => {
      const next = items.filter((i) => i.id !== req.params.id);
      if (next.length === items.length) return { result: false };
      return { data: next, result: true };
    });

    if (!deleted) {
      res.status(404).json({ error: `${name} item not found` });
      return;
    }

    res.status(204).end();
  });

  return router;
}
