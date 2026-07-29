import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createSubmissionRouter } from "../submissions.js";
import { readCollection } from "../store.js";

const TEST_COLLECTION = "__test_submissions__";
const testFile = fileURLToPath(new URL(`../../../data/${TEST_COLLECTION}.json`, import.meta.url));

let server;
let baseUrl;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use("/api/test", createSubmissionRouter({ name: TEST_COLLECTION, requiredFields: ["email"] }));

  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await rm(testFile, { force: true });
});

test("a normal submission (empty honeypot) is saved", async () => {
  const response = await fetch(`${baseUrl}/api/test`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "real-visitor@example.com", hp_field: "" }),
  });

  assert.equal(response.status, 201);
  const body = await response.json();
  assert.equal(body.data.email, "real-visitor@example.com");
});

test("a submission with the honeypot filled in looks successful but is silently dropped", async () => {
  const response = await fetch(`${baseUrl}/api/test`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "bot@spam.example", hp_field: "http://spam-link.example" }),
  });

  assert.equal(response.status, 201);
  const body = await response.json();
  assert.equal(body.data, undefined, "bot response should not echo back a saved entry");

  const items = await readCollection(TEST_COLLECTION, () => []);
  assert.equal(
    items.some((item) => item.email === "bot@spam.example"),
    false,
    "the honeypot-triggered submission should never be saved"
  );
});

test("the honeypot field itself is never persisted on a real submission", async () => {
  const response = await fetch(`${baseUrl}/api/test`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "clean@example.com", hp_field: "" }),
  });

  const body = await response.json();
  assert.equal("hp_field" in body.data, false);
});
