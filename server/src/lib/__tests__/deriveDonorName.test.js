import { test } from "node:test";
import assert from "node:assert/strict";

process.env.AUTH_SECRET ||= "test-only-secret-do-not-use-in-production";

const { deriveDonorName } = await import("../../routes/payments.js");

test("deriveDonorName uses the name the donor typed into the Donate form (Paystack metadata), even when a customer profile exists", () => {
  const name = deriveDonorName({
    metadata: { name: "Amaka Okafor" },
    customer: { first_name: "Some", last_name: "Other Name", email: "amaka@example.com" },
  });
  assert.equal(name, "Amaka Okafor");
});

test("deriveDonorName falls back to Paystack's saved customer profile name when no metadata name was sent", () => {
  const name = deriveDonorName({
    metadata: {},
    customer: { first_name: "Amaka", last_name: "Okafor", email: "amaka@example.com" },
  });
  assert.equal(name, "Amaka Okafor");
});

test("deriveDonorName falls back to the email as a last resort", () => {
  const name = deriveDonorName({
    metadata: {},
    customer: { email: "amaka@example.com" },
  });
  assert.equal(name, "amaka@example.com");
});

test("deriveDonorName handles a completely missing metadata object", () => {
  const name = deriveDonorName({
    customer: { first_name: "Amaka", last_name: "Okafor" },
  });
  assert.equal(name, "Amaka Okafor");
});
