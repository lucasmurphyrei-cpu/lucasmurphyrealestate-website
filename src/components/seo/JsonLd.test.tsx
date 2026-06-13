import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import JsonLd from "./JsonLd";
import { graph, realEstateAgent } from "@/lib/seo/schema";

describe("JsonLd", () => {
  it("renders a schema.org script with the agent name", () => {
    const { container } = render(<JsonLd data={graph(realEstateAgent())} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    const json = JSON.parse(script!.textContent || "{}");
    expect(json["@context"]).toBe("https://schema.org");
    expect(json["@graph"][0].name).toBe("Lucas Murphy");
  });
});
