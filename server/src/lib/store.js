import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dataDir = fileURLToPath(new URL("../../data/", import.meta.url));

async function ensureDataDir() {
  await mkdir(dataDir, { recursive: true });
}

function fileFor(name) {
  return path.join(dataDir, `${name}.json`);
}

/**
 * Reads a named JSON collection from disk. If the file does not exist yet,
 * it is created and seeded with the value returned by `seedFn`.
 */
export async function readCollection(name, seedFn) {
  try {
    const raw = await readFile(fileFor(name), "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;

    const seeded = seedFn ? seedFn() : [];
    await ensureDataDir();
    await writeCollection(name, seeded);
    return seeded;
  }
}

/**
 * Writes a collection to disk atomically: the new content is written to a
 * temp file first, then moved into place with a single rename. A crash or
 * power loss mid-write can never leave the real file half-written/corrupt -
 * the rename either hasn't happened yet (old file intact) or has fully
 * happened (new file intact).
 */
export async function writeCollection(name, data) {
  await ensureDataDir();
  const target = fileFor(name);
  const tmp = `${target}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2));
  await rename(tmp, target);
}

// Serializes access per collection name so two requests editing the same
// collection at once can't race (read, read, write, write - where the
// second write silently discards the first change). Each collection gets
// its own chain, so unrelated collections (e.g. "projects" and "donations")
// never block each other.
const locks = new Map();

function withLock(name, task) {
  const tail = locks.get(name) || Promise.resolve();
  const settled = tail.then(task, task);
  // Keep the chain alive regardless of whether this turn succeeded or
  // failed, so one failed update doesn't permanently jam the queue for
  // this collection.
  locks.set(
    name,
    settled.then(
      () => {},
      () => {}
    )
  );
  return settled;
}

/**
 * The safe way to read-modify-write a collection. `updater` receives the
 * current array/object and returns `{ data, result }`: `data` (if present)
 * is written back to disk, `result` is handed back to the caller. Omit
 * `data` for a no-op update (e.g. "item not found") to skip the write.
 * The whole read+updater+write runs under this collection's lock, so it's
 * safe to call from concurrent requests.
 */
export async function updateCollection(name, seedFn, updater) {
  return withLock(name, async () => {
    const current = await readCollection(name, seedFn);
    const { data, result } = await updater(current);
    if (data !== undefined) {
      await writeCollection(name, data);
    }
    return result;
  });
}

export function generateId(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
