import { Router } from "express";
import { readCollection } from "../lib/store.js";
import { seedNews } from "../lib/seeds.js";

const router = Router();

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * A standard RSS 2.0 feed of the latest news articles, for feed readers and
 * aggregators. The site's own domain isn't decided yet (see sitemap.xml's
 * generator) - SITE_URL falls back to a placeholder the same way that does.
 */
router.get("/", async (req, res) => {
  const siteUrl = process.env.SITE_URL || "https://www.chadi-international.org";
  const articles = (await readCollection("news", seedNews))
    .slice()
    .sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0))
    .slice(0, 30);

  const items = articles
    .map((article) => {
      const link = `${siteUrl}/news/${article.slug}`;
      const pubDate = article.date ? new Date(article.date).toUTCString() : new Date(article.createdAt).toUTCString();
      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid>${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(article.excerpt)}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>CHADI International - Latest News</title>
    <link>${escapeXml(siteUrl)}/news</link>
    <description>Program milestones, field activities and community stories from CHADI International.</description>${items}
  </channel>
</rss>
`;

  res.type("application/rss+xml").send(xml);
});

export default router;
