import { Router } from "express";
import { updateCollection } from "../lib/store.js";

const router = Router();

const PAGE_STYLE =
  "font-family: system-ui, sans-serif; max-width: 480px; margin: 15vh auto; text-align: center; color: #1f2937; padding: 0 24px;";

function page(heading, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>CHADI International</title></head>` +
    `<body style="${PAGE_STYLE}"><h1 style="color:#347928;font-size:1.5rem;">${heading}</h1>` +
    `<p style="line-height:1.6;">${body}</p></body></html>`;
}

/**
 * Public, no-auth unsubscribe link - the id here is the same opaque,
 * unguessable id every newsletter entry already gets on signup
 * (generateId), so it doubles as a safe-enough unsubscribe token without
 * needing a separate token system. Linked from every broadcast email (see
 * routes/broadcast.js). Responds with HTML, not JSON - this is a link a
 * person clicks from their email client into a browser tab, not an API call
 * a script makes.
 */
router.get("/:id", async (req, res) => {
  const removed = await updateCollection("newsletter", () => [], (items) => {
    const next = items.filter((item) => item.id !== req.params.id);
    if (next.length === items.length) return { result: false };
    return { data: next, result: true };
  });

  res.type("html");

  if (!removed) {
    res.send(
      page(
        "Already unsubscribed",
        "This link has already been used, or this email wasn't on our list."
      )
    );
    return;
  }

  res.send(page("You're unsubscribed", "You won't receive any more email updates from CHADI International."));
});

export default router;
