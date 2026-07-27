import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifyHmacSignature } from "../verifySignature.js";

const secretKey = "test-secret-key";
const rawBody = Buffer.from(JSON.stringify({ event: "charge.success" }));

function sign(body, key) {
  return createHmac("sha512", key).update(body).digest("hex");
}

test("accepts a signature computed with the correct secret", () => {
  const signature = sign(rawBody, secretKey);
  assert.equal(verifyHmacSignature(rawBody, signature, secretKey), true);
});

test("rejects a signature computed with the wrong secret", () => {
  const signature = sign(rawBody, "wrong-secret");
  assert.equal(verifyHmacSignature(rawBody, signature, secretKey), false);
});

test("rejects a tampered body", () => {
  const signature = sign(rawBody, secretKey);
  const tamperedBody = Buffer.from(JSON.stringify({ event: "charge.failed" }));
  assert.equal(verifyHmacSignature(tamperedBody, signature, secretKey), false);
});

test("rejects a garbage signature of a different length", () => {
  assert.equal(verifyHmacSignature(rawBody, "not-a-real-signature", secretKey), false);
});

test("rejects when any input is missing", () => {
  const signature = sign(rawBody, secretKey);
  assert.equal(verifyHmacSignature(null, signature, secretKey), false);
  assert.equal(verifyHmacSignature(rawBody, null, secretKey), false);
  assert.equal(verifyHmacSignature(rawBody, signature, null), false);
});
