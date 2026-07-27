import { test } from "node:test";
import assert from "node:assert/strict";

process.env.AUTH_SECRET ||= "test-only-secret-do-not-use-in-production";

const { extractPlanCode } = await import("../../routes/payments.js");

test("extractPlanCode reads a nested plan_object", () => {
  assert.equal(extractPlanCode({ plan_object: { plan_code: "PLN_abc" } }), "PLN_abc");
});

test("extractPlanCode reads a bare plan code string", () => {
  assert.equal(extractPlanCode({ plan: "PLN_xyz" }), "PLN_xyz");
});

test("extractPlanCode reads a nested plan object", () => {
  assert.equal(extractPlanCode({ plan: { plan_code: "PLN_def" } }), "PLN_def");
});

test("extractPlanCode returns null for a one-time charge with no plan", () => {
  assert.equal(extractPlanCode({}), null);
  assert.equal(extractPlanCode({ plan: "" }), null);
  assert.equal(extractPlanCode({ plan: null }), null);
});
