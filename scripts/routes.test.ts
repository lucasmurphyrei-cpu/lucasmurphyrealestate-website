import { describe, it, expect } from "vitest";
import { getAllRoutes, RouteEntry } from "./routes";

describe("route manifest", () => {
  it("includes core static routes", () => {
    const paths = getAllRoutes().map((r) => r.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/guides");
    expect(paths).toContain("/contact");
  });

  it("includes 4 county routes and 50+ municipality routes", () => {
    const routes = getAllRoutes();
    const counties = routes.filter((r) => /^\/areas\/[a-z-]+-county$/.test(r.path));
    const munis = routes.filter((r) => /^\/areas\/[a-z-]+-county\/.+/.test(r.path));
    expect(counties).toHaveLength(4);
    expect(munis.length).toBeGreaterThanOrEqual(50);
  });

  it("marks preview routes noindex", () => {
    const preview = getAllRoutes().find((r) => r.path === "/preview/v1");
    expect(preview?.noindex).toBe(true);
  });

  it("every route has changefreq and a priority between 0 and 1", () => {
    for (const r of getAllRoutes() as RouteEntry[]) {
      expect(r.changefreq).toBeTruthy();
      expect(r.priority).toBeGreaterThan(0);
      expect(r.priority).toBeLessThanOrEqual(1);
    }
  });
});
