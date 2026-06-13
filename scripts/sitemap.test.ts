import { describe, it, expect } from "vitest";
import { buildSitemapXml } from "./sitemap";

const routes = [
  { path: "/", changefreq: "weekly" as const, priority: 1.0 },
  { path: "/preview/v1", changefreq: "monthly" as const, priority: 0.1, noindex: true },
];

describe("buildSitemapXml", () => {
  it("emits valid XML with the absolute homepage URL", () => {
    const xml = buildSitemapXml(routes, "2026-06-13");
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain("<loc>https://www.lucasmurphyrealestate.com/</loc>");
    expect(xml).toContain("<lastmod>2026-06-13</lastmod>");
  });

  it("excludes noindex routes", () => {
    const xml = buildSitemapXml(routes, "2026-06-13");
    expect(xml).not.toContain("/preview/v1");
    expect((xml.match(/<url>/g) || []).length).toBe(1);
  });
});
