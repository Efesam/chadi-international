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

  assert.match(subject, /receipt/i);
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
