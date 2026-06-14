import { describe, it, expect } from "vitest";
import { getCountySeries, getMuniSeries, type SeriesPoint } from "./history";

describe("market history adapters", () => {
  it("returns county median_price points with nulls filtered out", () => {
    const s = getCountySeries("Waukesha County", "median_price");
    expect(Array.isArray(s)).toBe(true);
    for (const p of s as SeriesPoint[]) {
      expect(p.value).not.toBeNull();
      expect(typeof p.value).toBe("number");
      expect(p.month).toMatch(/^\d{4}-\d{2}$/);
    }
  });
  it("returns [] for an unknown county or metric", () => {
    expect(getCountySeries("Dane County", "median_price")).toEqual([]);
    expect(getCountySeries("Waukesha County", "nonexistent_metric")).toEqual([]);
  });
  it("returns muni series for a known id and [] for unknown", () => {
    const s = getMuniSeries("brookfield", "median_price");
    expect(Array.isArray(s)).toBe(true);
    expect(getMuniSeries("not-a-real-id", "median_price")).toEqual([]);
  });
});
