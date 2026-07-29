// Generates public/sitemap.xml before each build. Runs as a plain Node
// script (see package.json's "build" script) rather than reading through the
// API, since the data files are readable directly on disk in this monorepo
// and CI doesn't have a running API server to call.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const clientDir = fileURLToPath(new URL("..", import.meta.url));
const dataDir = path.join(clientDir, "..", "server", "data");

const SITE_URL = process.env.VITE_SITE_URL || "https://www.chadi-international.org";

const STATIC_ROUTES = [
  "/",
  "/about",
  "/projects",
  "/news",
  "/team",
  "/events",
  "/gallery",
  "/stories",
  "/partners",
  "/resources",
  "/faq",
  "/careers",
  "/get-involved",
  "/volunteer",
  "/donate",
  "/contact",
  "/transparency",
  "/governance",
  "/privacy",
  "/terms",
];

async function readSlugs(fileName) {
  try {
    const raw = await readFile(path.join(dataDir, fileName), "utf8");
    const items = JSON.parse(raw);
    return items.map((item) => item.slug).filter(Boolean);
  } catch {
    // Data file doesn't exist yet (fresh install, server never run) - just
    // ship the static routes instead of failing the build over it.
    return [];
  }
}

async function generateSitemap() {
  const [projectSlugs, newsSlugs] = await Promise.all([
    readSlugs("projects.json"),
    readSlugs("news.json"),
  ]);

  const urls = [
    ...STATIC_ROUTES,
    ...projectSlugs.map((slug) => `/projects/${slug}`),
    ...newsSlugs.map((slug) => `/news/${slug}`),
  ];

  const body = urls
    .map((route) => `  <url><loc>${SITE_URL}${route}</loc></url>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  const outPath = path.join(clientDir, "public", "sitemap.xml");
  await writeFile(outPath, xml);
  console.log(`[sitemap] wrote ${urls.length} URLs to ${outPath} (${projectSlugs.length} projects, ${newsSlugs.length} news articles)`);
}

generateSitemap();
