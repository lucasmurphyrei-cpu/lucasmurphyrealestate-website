// src/data/marketProfiles.test.ts
import { describe, it, expect } from "vitest";
import { getMarketProfile } from "./marketProfiles";

describe("getMarketProfile", () => {
  it("returns null for a municipality with no overlay entry", () => {
    expect(getMarketProfile("nonexistent-id")).toBeNull();
  });
});
