import { test } from "node:test";
import assert from "node:assert/strict";

process.env.AUTH_SECRET ||= "test-only-secret-do-not-use-in-production";

const { hashPassword, verifyPassword, createToken, verifyToken, requireAuth } = await import(
  "../auth.js"
);

test("verifyPassword accepts the correct password and rejects a wrong one", () => {
  const stored = hashPassword("correct-horse-battery-staple");
  assert.equal(verifyPassword("correct-horse-battery-staple", stored), true);
  assert.equal(verifyPassword("wrong-password", stored), false);
});

test("hashPassword salts each hash differently", () => {
  const a = hashPassword("same-password");
  const b = hashPassword("same-password");
  assert.notEqual(a, b);
});

test("verifyToken accepts a token created by createToken", () => {
  const token = createToken({ id: "user_1", role: "admin" });
  const payload = verifyToken(token);
  assert.equal(payload.id, "user_1");
  assert.equal(payload.role, "admin");
});

test("verifyToken rejects a tampered payload", () => {
  const token = createToken({ id: "user_1", role: "editor" });
  const [payloadB64, signature] = token.split(".");
  const forgedPayload = Buffer.from(JSON.stringify({ id: "user_1", role: "admin", exp: Date.now() + 1e9 })).toString(
    "base64url"
  );
  assert.equal(verifyToken(`${forgedPayload}.${signature}`), null);
});

test("verifyToken rejects an expired token", () => {
  const token = createToken({ id: "user_1" }, -1000);
  assert.equal(verifyToken(token), null);
});

test("verifyToken rejects garbage input", () => {
  assert.equal(verifyToken(null), null);
  assert.equal(verifyToken("not-a-token"), null);
  assert.equal(verifyToken(""), null);
});

test("requireAuth rejects requests with no bearer token", () => {
  let statusCode = null;
  let body = null;
  const req = { headers: {} };
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      body = payload;
    },
  };

  requireAuth(req, res, () => assert.fail("next() should not be called"));

  assert.equal(statusCode, 401);
  assert.deepEqual(body, { error: "Not authenticated" });
});

test("requireAuth calls next() and attaches req.user for a valid token", () => {
  const token = createToken({ id: "user_1", role: "admin" });
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = {};
  let nextCalled = false;

  requireAuth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.user.id, "user_1");
});
