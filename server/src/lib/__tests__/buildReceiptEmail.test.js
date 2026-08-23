import { test } from "node:test";
import assert from "node:assert/strict";

process.env.AUTH_SECRET ||= "test-only-secret-do-not-use-in-production";

const { buildReceiptEmail } = await import("../../routes/payments.js");

test("buildReceiptEmail for a one-time payment mentions the amount and reference", () => {
  const { subject, text, html } = buildReceiptEmail({
    type: "payment",
    amount: 5000,
    reference: "ref_123",
    projectTitle: "Clean Water Initiative",
  });

  assert.match(subject, /changed someone's life/i);
  assert.match(text, /₦5,000/);
  assert.match(text, /Clean Water Initiative/);
  assert.match(text, /ref_123/);
  assert.match(html, /₦5,000/);
});

test("buildReceiptEmail for a subscription mentions recurring billing", () => {
  const { subject, text } = buildReceiptEmail({
    type: "subscription",
    amount: 2500,
    reference: "ref_456",
  });

  assert.match(subject, /Hope Alive Circle/);
  assert.match(text, /every month/i);
  assert.match(text, /₦2,500/);
});

test("buildReceiptEmail omits the project name when there is no project", () => {
  const { text } = buildReceiptEmail({ type: "payment", amount: 1000, reference: "ref_789" });
  assert.match(text, /donation of ₦1,000\./);
});

test("buildReceiptEmail always includes the no-goods-or-services statement, needed for tax deductibility", () => {
  const { text } = buildReceiptEmail({ type: "payment", amount: 1000, reference: "ref_789" });
  assert.match(text, /no goods or services were provided/i);
});

test("buildReceiptEmail includes the receipt number when the donation has one", () => {
  const { text } = buildReceiptEmail({
    type: "payment",
    amount: 1000,
    reference: "ref_789",
    receiptNumber: "CHADI-000042",
  });
  assert.match(text, /Receipt No\.: CHADI-000042/);
});

test("buildReceiptEmail omits the receipt number line for older donations that don't have one", () => {
  const { text } = buildReceiptEmail({ type: "payment", amount: 1000, reference: "ref_789" });
  assert.doesNotMatch(text, /Receipt No\./);
});

test("buildReceiptEmail includes a project-specific gratitude message when a project is passed", () => {
  const { text, html } = buildReceiptEmail(
    { type: "payment", amount: 5000, reference: "ref_123", projectId: "project_miycn", projectTitle: "Community MIYCN Campaign" },
    { project: { title: "Community MIYCN Campaign", summary: "Improving maternal and child nutrition." } }
  );

  assert.match(text, /Improving maternal and child nutrition/);
  assert.match(html, /Improving maternal and child nutrition/);
});

test("buildReceiptEmail includes a fund-allocation gratitude message for a general donation when settings are passed", () => {
  const { text } = buildReceiptEmail(
    { type: "payment", amount: 1000, reference: "ref_789" },
    { settings: { fundAllocation: [{ category: "Programs & Field Work", percentage: 80 }] } }
  );

  assert.match(text, /Dear there,/);
  assert.match(text, /80% of every donation goes straight to the children/);
});

test("buildReceiptEmail omits the gratitude letter entirely when no project/settings context is passed", () => {
  const { text } = buildReceiptEmail({ type: "payment", amount: 1000, reference: "ref_789" });
  assert.doesNotMatch(text, /Dear there,/);
  assert.doesNotMatch(text, /Caleb Omale/);
});
