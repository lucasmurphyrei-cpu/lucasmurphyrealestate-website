import { describe, it, expect } from "vitest";
import { getAllMunicipalityRoutes, getSlimBySlug } from "./municipalityLookup";

describe("getAllMunicipalityRoutes", () => {
  it("returns one route per municipality with resolvable slugs", () => {
    const routes = getAllMunicipalityRoutes();
    expect(routes.length).toBeGreaterThanOrEqual(50);
    for (const r of routes) {
      expect(r.countySlug).toMatch(/-county$/);
      expect(getSlimBySlug(r.countySlug, r.muniSlug)).toBeTruthy();
    }
  });
});
