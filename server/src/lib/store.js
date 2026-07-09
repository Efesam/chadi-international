import { readFile, writeFile, mkdir } from "node:fs/promises";
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
    await writeFile(fileFor(name), JSON.stringify(seeded, null, 2));
    return seeded;
  }
}

export async function writeCollection(name, data) {
  await ensureDataDir();
  await writeFile(fileFor(name), JSON.stringify(data, null, 2));
}

export function generateId(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
