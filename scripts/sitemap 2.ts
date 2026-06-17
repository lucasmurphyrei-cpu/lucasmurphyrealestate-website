import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getAllRoutes, RouteEntry } from "./routes";
import { siteConfig } from "../src/lib/siteConfig";

export function buildSitemapXml(routes: RouteEntry[], lastmod: string): string {
  const urls = routes
    .filter((r) => !r.noindex)
    .map(
      (r) =>
        `  <url>\n    <loc>${siteConfig.url}${r.path}</loc>\n` +
        `    <lastmod>${lastmod}</lastmod><changefreq>${r.changefreq}</changefreq>\n` +
        `    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`
    )
    .join("\n");
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls +
    "\n</urlset>\n"
  );
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isMain) {
  const today = new Date().toISOString().slice(0, 10);
  const xml = buildSitemapXml(getAllRoutes(), today);
  const out = resolve(dirname(fileURLToPath(import.meta.url)), "../public/sitemap.xml");
  writeFileSync(out, xml, "utf8");
  console.log(`sitemap.xml written: ${getAllRoutes().filter((r) => !r.noindex).length} urls`);
}
