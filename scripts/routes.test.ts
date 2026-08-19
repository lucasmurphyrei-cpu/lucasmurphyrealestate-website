import { describe, it, expect } from "vitest";
import { getAllRoutes, RouteEntry } from "./routes";

// These tests were asserting a route shape that no longer exists: /areas/<county>
// and /preview/v1/market/..., plus a `noindex` flag that has since been removed from
// RouteEntry. They had been failing for long enough that a red suite was normal, which
// is the real cost — a genuine regression had nowhere to show up. Rewritten against the
// manifest the code actually produces.

describe("route manifest", () => {
  it("includes core static routes", () => {
    const paths = getAllRoutes().map((r) => r.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/guides");
    expect(paths).toContain("/contact");
  });

  it("includes the market hub, 4 county pages and 50+ municipality pages", () => {
    const routes = getAllRoutes();
    const counties = routes.filter((r) => /^\/market\/[a-z-]+-county$/.test(r.path));
    const munis = routes.filter((r) => /^\/market\/[a-z-]+-county\/.+/.test(r.path));
    expect(routes.map((r) => r.path)).toContain("/market");
    expect(counties).toHaveLength(4);
    expect(munis.length).toBeGreaterThanOrEqual(50);
  });

  it("gives every county a listings page", () => {
    const listings = getAllRoutes().filter((r) => /^\/listings\/[a-z-]+-county$/.test(r.path));
    expect(listings).toHaveLength(4);
  });

  it("never puts a preview route in the manifest", () => {
    // The manifest feeds sitemap.xml and llms.txt. Preview pages are work in progress
    // and must not be advertised to a crawler; keeping them out entirely is stronger
    // than marking them noindex, which is what this used to assert.
    const leaked = getAllRoutes().filter((r) => r.path.startsWith("/preview"));
    expect(leaked).toEqual([]);
  });

  it("every route has changefreq and a priority between 0 and 1", () => {
    for (const r of getAllRoutes() as RouteEntry[]) {
      expect(r.changefreq).toBeTruthy();
      expect(r.priority).toBeGreaterThan(0);
      expect(r.priority).toBeLessThanOrEqual(1);
    }
  });

  it("has no duplicate paths", () => {
    const paths = getAllRoutes().map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});
