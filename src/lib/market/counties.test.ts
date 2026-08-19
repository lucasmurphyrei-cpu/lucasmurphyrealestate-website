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
    // dataMonth and the median both advance every time RapidStats lands, so pinning
    // literals here guaranteed a failing suite within weeks of every refresh. Assert
    // the SHAPE instead: a real month-year, and a formatted dollar figure.
    expect(snap?.dataMonth).toMatch(/^[A-Z][a-z]+ 20\d{2}$/);
    const median = snap?.stats.find((s) => s.label === "Median Price")?.value;
    expect(median).toMatch(/^\$[\d,]+$/);
  });
  it("returns null for an unknown county slug", () => {
    expect(getCountySnapshot("dane-county")).toBeNull();
  });
});
