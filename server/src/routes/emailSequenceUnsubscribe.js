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
 * Public, no-auth unsubscribe link for the automated welcome email series
 * (see lib/emailSequence.js). Marks the subscriber inactive rather than
 * deleting them - unlike the newsletter unsubscribe this record is kept, so
 * a later newsletter signup or donation from the same email never silently
 * re-enrolls someone who already opted out (enrollInSequence checks for any
 * existing record, active or not). Mirrors routes/newsletterUnsubscribe.js.
 */
router.get("/:id", async (req, res) => {
  const updated = await updateCollection("sequenceSubscribers", () => [], (items) => {
    const index = items.findIndex((item) => item.id === req.params.id);
    if (index === -1 || items[index].unsubscribed) return { result: false };

    const next = [...items];
    next[index] = { ...next[index], unsubscribed: true };
    return { data: next, result: true };
  });

  res.type("html");

  if (!updated) {
    res.send(page("Already unsubscribed", "This link has already been used, or this email wasn't on our list."));
    return;
  }

  res.send(
    page("You're unsubscribed", "You won't receive any more emails in this series from CHADI International.")
  );
});

export default router;
