import { test, after } from "node:test";
import assert from "node:assert/strict";
import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { readCollection, updateCollection } from "../store.js";

// A disposable collection name, isolated from any real data - cleaned up
// after these tests run.
const TEST_COLLECTION = "__test_store_concurrency__";
const testFile = fileURLToPath(new URL(`../../../data/${TEST_COLLECTION}.json`, import.meta.url));

after(async () => {
  await rm(testFile, { force: true });
});

test("updateCollection serializes concurrent read-modify-write calls without losing any", async () => {
  await updateCollection(TEST_COLLECTION, () => [], () => ({ data: [], result: null }));

  const writes = Array.from({ length: 30 }, (_, index) =>
    updateCollection(TEST_COLLECTION, () => [], (items) => ({
      data: [...items, { id: index }],
      result: null,
    }))
  );

  await Promise.all(writes);

  const items = await readCollection(TEST_COLLECTION, () => []);
  assert.equal(items.length, 30);

  const ids = new Set(items.map((item) => item.id));
  assert.equal(ids.size, 30, "every concurrent write should be present exactly once");
});

test("updateCollection skips the write when the updater returns no data", async () => {
  await updateCollection(TEST_COLLECTION, () => [], () => ({ data: [{ id: "seed" }], result: null }));

  const result = await updateCollection(TEST_COLLECTION, () => [], (items) => {
    const found = items.find((item) => item.id === "does-not-exist");
    if (!found) return { result: null };
    return { data: [], result: found };
  });

  assert.equal(result, null);

  const items = await readCollection(TEST_COLLECTION, () => []);
  assert.deepEqual(items, [{ id: "seed" }], "collection should be unchanged");
});
