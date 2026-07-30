import crypto from "node:crypto";
import { readCollection, updateCollection } from "./store.js";

/**
 * Machine-translates CMS content (project/news/event text typed by admin
 * staff, only ever in whatever language they wrote it in) for visitors using
 * a different site language. Optional, same as Paystack/SMTP/PayPal/etc -
 * inert until GOOGLE_TRANSLATE_API_KEY is set, so the site works fine
 * without it (content just stays in its original language).
 *
 * Every translated string is cached forever, keyed on source-text hash +
 * target language, so the same sentence is never re-translated (and never
 * re-billed against the Google Cloud Translation quota) no matter how many
 * times it's requested.
 */

// The 10 non-English site languages that get machine-translated CMS content.
// "en" itself never needs translating - content is written in English by
// default - and skipping it here means en is never a cache key by mistake.
const SUPPORTED_TARGETS = new Set(["ha", "yo", "ig", "fr", "es", "ar", "zh", "ru", "pt", "de"]);

let warnedAboutMissingKey = false;

function getApiKey() {
  return process.env.GOOGLE_TRANSLATE_API_KEY || null;
}

export function isTranslationConfigured() {
  return Boolean(getApiKey());
}

function warnOnce() {
  if (warnedAboutMissingKey) return;
  warnedAboutMissingKey = true;
  console.warn(
    "[translate] GOOGLE_TRANSLATE_API_KEY is not set - CMS content (projects/news/events/etc) will be served " +
      "in its original language for every visitor, regardless of site language. Set the key to enable machine " +
      "translation (Google Cloud Console -> APIs & Services -> Cloud Translation API)."
  );
}

function hashText(text) {
  return crypto.createHash("sha1").update(text).digest("hex");
}

async function callGoogleTranslate(text, targetLang, format) {
  const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${getApiKey()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: text, target: targetLang, source: "en", format }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Google Translate request failed");
  }

  return data.data.translations[0].translatedText;
}

/**
 * Translates one string. Checked-and-set against the cache happens inside a
 * single lock on the "translationCache" collection so two near-simultaneous
 * requests for the same brand-new string can't both call (and both pay for)
 * the Google Translate API - the second one just reads what the first one
 * wrote.
 */
export async function translateText(text, targetLang, { html = false } = {}) {
  if (!text || !String(text).trim() || !SUPPORTED_TARGETS.has(targetLang)) return text;

  if (!isTranslationConfigured()) {
    warnOnce();
    return text;
  }

  const key = `${targetLang}:${hashText(text)}`;

  try {
    return await updateCollection("translationCache", () => ({}), async (cache) => {
      if (cache[key]) return { result: cache[key] };

      const translated = await callGoogleTranslate(text, targetLang, html ? "html" : "text");
      return { data: { ...cache, [key]: translated }, result: translated };
    });
  } catch (error) {
    console.error("[translate] error translating text, falling back to original:", error.message);
    return text;
  }
}

/**
 * Translates the configured fields of one CMS item for a given target
 * language. `fields` entries are either a field name (plain text) or
 * `{ name, html: true }` for rich-text fields (e.g. a news article's HTML
 * body) so the API preserves markup instead of mangling it. Fields that are
 * empty, missing, or not requested are left untouched.
 */
export async function translateItem(item, fields, targetLang) {
  if (!item || !targetLang || targetLang === "en" || !fields?.length) return item;

  const patches = await Promise.all(
    fields.map(async (field) => {
      const name = typeof field === "string" ? field : field.name;
      const html = typeof field === "object" && Boolean(field.html);
      const value = item[name];
      if (!value) return null;
      return [name, await translateText(value, targetLang, { html })];
    })
  );

  return { ...item, ...Object.fromEntries(patches.filter(Boolean)) };
}

/** Same as translateItem, applied to every item in a list. */
export async function translateItems(items, fields, targetLang) {
  if (!targetLang || targetLang === "en" || !fields?.length) return items;
  return Promise.all(items.map((item) => translateItem(item, fields, targetLang)));
}

export function isSupportedTarget(lang) {
  return SUPPORTED_TARGETS.has(lang);
}
