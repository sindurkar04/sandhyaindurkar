import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE_URL = "https://sandhyaindurkar.com";

const STATIC_ENTRIES = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/math-applied", priority: 0.9, changeFrequency: "weekly" },
  { path: "/learning-through-food", priority: 0.9, changeFrequency: "weekly" },
  { path: "/learning-through-food/rasmalai", priority: 0.7, changeFrequency: "monthly" },
  { path: "/learning-through-food/rasmalai-cake", priority: 0.7, changeFrequency: "monthly" },
  { path: "/learning-through-food/akki-rotti", priority: 0.7, changeFrequency: "monthly" },
  { path: "/learning-through-food/malai-kofta", priority: 0.7, changeFrequency: "monthly" },
  { path: "/learning-through-food/milk-burfi", priority: 0.7, changeFrequency: "monthly" },
];

const postsSource = readFileSync(
  join(process.cwd(), "src/lib/math-applied-posts.ts"),
  "utf8",
);
const mathPaths = [...postsSource.matchAll(/href: "(\/math-applied\/[^"]+)"/g)].map((m) => m[1]);

const entries = [
  ...STATIC_ENTRIES,
  ...mathPaths.map((path) => ({ path, priority: 0.8, changeFrequency: "monthly" })),
];

const iso = new Date().toISOString();
const urls = entries
  .map(
    (entry) => `<url>
<loc>${SITE_URL}${entry.path}</loc>
<lastmod>${iso}</lastmod>
<changefreq>${entry.changeFrequency}</changefreq>
<priority>${entry.priority}</priority>
</url>`,
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const outputPath = join(process.cwd(), "public", "sitemap.xml");
writeFileSync(outputPath, xml, "utf8");
console.log(`Wrote ${outputPath} (${entries.length} URLs)`);
