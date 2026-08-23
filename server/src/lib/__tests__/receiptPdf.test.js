import { test } from "node:test";
import assert from "node:assert/strict";
import zlib from "node:zlib";
import { buildReceiptPdf } from "../receiptPdf.js";

/** Counts `/Type /Page` objects (the page dictionaries, not `/Pages`). */
function pageCount(pdf) {
  return (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
}

/**
 * Recovers the visible text from a receipt PDF. pdfkit Flate-compresses its
 * content streams AND writes the text as hex-encoded glyph runs inside
 * `[<hex> kern <hex>] TJ` operators, so this inflates each stream and then
 * hex-decodes those runs. Kerning numbers between runs are dropped, which
 * is why words are reassembled without their inter-run spacing.
 */
function extractText(pdf) {
  const raw = pdf.toString("latin1");
  let content = "";
  const streams = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let m;
  while ((m = streams.exec(raw)) !== null) {
    try {
      content += zlib.inflateSync(Buffer.from(m[1], "latin1")).toString("latin1");
    } catch {
      // Not a Flate stream (e.g. the embedded logo image) - skip it.
    }
  }
  // Pull out each `[ ... ] TJ` array and keep only its hex glyph runs,
  // dropping the kerning offsets that sit between them - otherwise a
  // kerned phrase decodes as "No goods or ser -30 vices w 10 ere".
  let text = "";
  const tjArrays = /\[([^\]]*)\]\s*TJ/g;
  let tj;
  while ((tj = tjArrays.exec(content)) !== null) {
    for (const run of tj[1].match(/<([0-9a-fA-F]+)>/g) || []) {
      text += Buffer.from(run.slice(1, -1), "hex").toString("latin1");
    }
    text += "\n";
  }
  return text;
}

const BASE_ENTRY = {
  receiptNumber: "CHADI-000042",
  name: "Samuel Adonai Onanefe",
  email: "donor@example.com",
  amount: 50000,
  currency: "NGN",
  reference: "T845921036xyz",
  channel: "bank_transfer",
  paidAt: "2026-08-02T10:00:00.000Z",
  createdAt: "2026-08-02T10:00:00.000Z",
  type: "payment",
};

// The full org footer plus the default (long) gratitude letter is the
// worst case for page overflow - this is the combination that used to
// spill a single orphaned sentence onto a blank second page.
const FULL_SETTINGS = {
  fundAllocation: [{ category: "Programs & Field Work", percentage: 80 }],
  contactEmail: "info@chadiinternational.org",
  orgAddress: "Suit C13 and C14 Ammi Plaza Opposite Former Bauchi Park",
  orgPhone: "+234708 580 9222",
  orgRegistration: "1081625319",
  receiptSignatory: "Caleb Omale, Executive Director",
};

test("a one-time donation receipt fits on a single page with the full letter and org footer", async () => {
  const pdf = await buildReceiptPdf(BASE_ENTRY, FULL_SETTINGS, {});
  assert.equal(pageCount(pdf), 1);
});

test("a monthly subscription receipt fits on a single page", async () => {
  const pdf = await buildReceiptPdf({ ...BASE_ENTRY, type: "subscription", amount: 2500 }, FULL_SETTINGS, {});
  assert.equal(pageCount(pdf), 1);
});

test("a project-designated receipt fits on a single page", async () => {
  const entry = { ...BASE_ENTRY, projectId: "project_miycn", projectTitle: "Community MIYCN Campaign" };
  const project = {
    title: "Community MIYCN Campaign",
    summary: "Improving maternal, infant and young child nutrition in underserved communities.",
    location: "Gombe State",
    beneficiaries: "500+ Mothers & Children",
  };
  const pdf = await buildReceiptPdf(entry, FULL_SETTINGS, { project });
  assert.equal(pageCount(pdf), 1);
});

test("a receipt renders even with minimal data and no org settings configured", async () => {
  const pdf = await buildReceiptPdf(
    { reference: "ref_x", amount: 1000, createdAt: "2026-08-02T10:00:00.000Z", type: "payment" },
    {},
    {}
  );
  assert.equal(pageCount(pdf), 1);
  assert.ok(pdf.length > 0);
});

test("the tax-deductibility statement is always present, regardless of settings", async () => {
  const text = extractText(await buildReceiptPdf(BASE_ENTRY, {}, {}));
  assert.match(text, /No goods or services were provided/);
  assert.match(text, /tax records/);
});

test("the receipt shows the amount, receipt number and reference", async () => {
  const text = extractText(await buildReceiptPdf(BASE_ENTRY, FULL_SETTINGS, {}));
  assert.match(text, /NGN 50,000/);
  assert.match(text, /CHADI-000042/);
  assert.match(text, /T845921036xyz/);
});

test("a subscription receipt marks the amount as recurring rather than one-off", async () => {
  const text = extractText(
    await buildReceiptPdf({ ...BASE_ENTRY, type: "subscription", amount: 2500 }, FULL_SETTINGS, {})
  );
  assert.match(text, /per month/);
  assert.match(text, /monthly installment/);
});
