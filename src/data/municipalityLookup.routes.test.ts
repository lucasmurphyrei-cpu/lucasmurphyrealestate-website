import { describe, it, expect } from "vitest";
import { getAllMunicipalityRoutes, getSlimBySlug } from "./municipalityLookup";

describe("getAllMunicipalityRoutes", () => {
  it("returns one route per municipality with resolvable slugs", () => {
    const routes = getAllMunicipalityRoutes();

    // Must have at least 50 routes
    expect(routes.length).toBeGreaterThanOrEqual(50);

    // One route per unique id — no duplicate municipalities
    const uniqueIds = new Set(routes.map((r) => r.id));
    expect(uniqueIds.size).toBe(routes.length);

    for (const r of routes) {
      // County slug must end in "-county"
      expect(r.countySlug).toMatch(/-county$/);

      // muni slug must not contain a "/" (would produce an unreachable two-segment URL)
      expect(r.muniSlug).not.toContain("/");

      // Every route must still resolve through the lookup map
      expect(getSlimBySlug(r.countySlug, r.muniSlug)).toBeTruthy();
    }
  });
});
