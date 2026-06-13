import { describe, it, expect } from "vitest";
import {
  realEstateAgent,
  webSite,
  breadcrumbList,
  place,
  dataset,
  faqPage,
  aggregateRating,
  article,
  graph,
} from "./schema";

describe("schema builders", () => {
  it("realEstateAgent has type, name, brokerage and 4 areas served", () => {
    const s = realEstateAgent();
    expect(s["@type"]).toBe("RealEstateAgent");
    expect(s.name).toBe("Lucas Murphy");
    expect(s.worksFor.name).toContain("eXp Realty");
    expect(s.areaServed).toHaveLength(4);
  });

  it("webSite includes a SearchAction potentialAction", () => {
    const s = webSite();
    expect(s["@type"]).toBe("WebSite");
    expect(s.potentialAction["@type"]).toBe("SearchAction");
  });

  it("breadcrumbList numbers positions from 1 and builds absolute item URLs", () => {
    const s = breadcrumbList([
      { name: "Market", path: "/preview/v1/market" },
      { name: "Waukesha County", path: "/preview/v1/market/waukesha-county" },
    ]);
    expect(s["@type"]).toBe("BreadcrumbList");
    expect(s.itemListElement[0].position).toBe(1);
    expect(s.itemListElement[1].item).toBe(
      "https://www.lucasmurphyrealestate.com/preview/v1/market/waukesha-county"
    );
  });

  it("place carries spatial name and state", () => {
    const s = place("Waukesha County");
    expect(s["@type"]).toBe("Place");
    expect(s.name).toBe("Waukesha County, WI");
  });

  it("dataset records temporalCoverage, spatialCoverage and source", () => {
    const s = dataset({
      name: "Waukesha County Real Estate Market Data",
      description: "Monthly median sale price and market metrics.",
      spatial: "Waukesha County, WI",
      dateModified: "2026-06-01",
      temporalCoverage: "2025-03/2026-06",
      url: "/preview/v1/market/waukesha-county",
    });
    expect(s["@type"]).toBe("Dataset");
    expect(s.spatialCoverage).toBe("Waukesha County, WI");
    expect(s.temporalCoverage).toBe("2025-03/2026-06");
    expect(s.url).toBe(
      "https://www.lucasmurphyrealestate.com/preview/v1/market/waukesha-county"
    );
  });

  it("faqPage maps Q/A pairs into Question/Answer nodes", () => {
    const s = faqPage([{ q: "What is the median price?", a: "$539,950 as of June 2026." }]);
    expect(s["@type"]).toBe("FAQPage");
    expect(s.mainEntity[0]["@type"]).toBe("Question");
    expect(s.mainEntity[0].acceptedAnswer.text).toContain("539,950");
  });

  it("aggregateRating clamps to ratingValue and reviewCount", () => {
    const s = aggregateRating({ ratingValue: 5, reviewCount: 27 });
    expect(s["@type"]).toBe("AggregateRating");
    expect(s.reviewCount).toBe(27);
  });

  it("article returns correct type, absolute url, typed author/publisher, and optional datePublished", () => {
    const withoutDate = article({
      headline: "Waukesha County Market Update",
      description: "June 2026 market snapshot.",
      url: "/guides/waukesha-market-update",
    });
    expect(withoutDate["@type"]).toBe("Article");
    expect(withoutDate.url).toMatch(/^https:\/\/www\.lucasmurphyrealestate\.com/);
    expect(withoutDate.author["@type"]).toBe("RealEstateAgent");
    expect(withoutDate.publisher["@type"]).toBe("Organization");
    expect("datePublished" in withoutDate).toBe(false);

    const withDate = article({
      headline: "Waukesha County Market Update",
      description: "June 2026 market snapshot.",
      url: "/guides/waukesha-market-update",
      datePublished: "2026-06-13",
    });
    expect(withDate.datePublished).toBe("2026-06-13");
  });

  it("graph wraps nodes in a @context/@graph envelope and preserves order", () => {
    const nodeA = { "@type": "WebSite", url: "https://example.com" };
    const nodeB = { "@type": "Organization", name: "Acme" };
    const g = graph(nodeA, nodeB);
    expect(g["@context"]).toBe("https://schema.org");
    expect(Array.isArray(g["@graph"])).toBe(true);
    expect(g["@graph"]).toHaveLength(2);
    expect(g["@graph"][0]).toBe(nodeA);
    expect(g["@graph"][1]).toBe(nodeB);
  });
});
