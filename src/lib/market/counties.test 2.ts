import { describe, it, expect } from "vitest";
import { COUNTY_SLUGS, countySlugToDisplay, getCountySnapshot } from "./counties";

describe("market counties", () => {
  it("maps the 4 county slugs to display names", () => {
    expect(COUNTY_SLUGS).toHaveLength(4);
    expect(countySlugToDisplay("waukesha-county")).toBe("Waukesha County");
    expect(countySlugToDisplay("milwaukee-county")).toBe("Milwaukee County");
  });
  it("returns snapshot stats for a known county", () => {
    const snap = getCountySnapshot("waukesha-county");
    expect(snap?.dataMonth).toBe("June 2026");
    expect(snap?.stats.find((s) => s.label === "Median Price")?.value).toBe("$539,950");
  });
  it("returns null for an unknown county slug", () => {
    expect(getCountySnapshot("dane-county")).toBeNull();
  });
});
