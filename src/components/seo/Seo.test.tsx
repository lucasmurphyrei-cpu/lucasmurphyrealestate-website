import { describe, it, expect } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import Seo from "./Seo";

const renderSeo = (props: React.ComponentProps<typeof Seo>) =>
  render(
    <HelmetProvider>
      <Seo {...props} />
    </HelmetProvider>
  );

describe("Seo", () => {
  it("sets the title and self-referential canonical", async () => {
    renderSeo({ title: "Waukesha County Market", canonicalPath: "/areas/waukesha-county" });
    await waitFor(() =>
      expect(document.title).toBe("Waukesha County Market | Lucas Murphy Real Estate")
    );
    const canon = document.querySelector('link[rel="canonical"]');
    expect(canon?.getAttribute("href")).toBe(
      "https://www.lucasmurphyrealestate.com/areas/waukesha-county"
    );
  });

  it("emits robots noindex when noindex is set", async () => {
    renderSeo({ title: "Preview", canonicalPath: "/preview/v1", noindex: true });
    await waitFor(() => {
      const robots = document.querySelector('meta[name="robots"]');
      expect(robots?.getAttribute("content")).toBe("noindex, nofollow");
    });
  });
});
