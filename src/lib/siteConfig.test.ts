import { describe, it, expect } from "vitest";
import { siteConfig, absoluteUrl } from "./siteConfig";

describe("siteConfig", () => {
  it("has a SITE_URL with no trailing slash", () => {
    expect(siteConfig.url).toBe("https://www.lucasmurphyrealestate.com");
    expect(siteConfig.url.endsWith("/")).toBe(false);
  });

  it("serves four Wisconsin counties", () => {
    expect(siteConfig.counties).toHaveLength(4);
    expect(siteConfig.counties).toContain("Waukesha");
  });

  it("absoluteUrl joins a path onto the site URL exactly once", () => {
    expect(absoluteUrl("/areas/waukesha-county")).toBe(
      "https://www.lucasmurphyrealestate.com/areas/waukesha-county"
    );
    expect(absoluteUrl("/")).toBe("https://www.lucasmurphyrealestate.com/");
  });
});
