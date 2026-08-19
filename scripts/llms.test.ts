import { describe, it, expect } from "vitest";
import { buildLlmsTxt } from "./llms";

describe("buildLlmsTxt", () => {
  it("starts with an H1 brand heading and lists the service area", () => {
    const txt = buildLlmsTxt();
    expect(txt.startsWith("# Lucas Murphy Real Estate")).toBe(true);
    expect(txt).toContain("Waukesha");
    expect(txt).toContain("Milwaukee");
  });

  it("links key indexable pages with absolute URLs and excludes noindex routes", () => {
    const txt = buildLlmsTxt();
    expect(txt).toContain("https://www.lucasmurphyrealestate.com/guides");
    expect(txt).not.toContain("/preview/v1");
  });
});
