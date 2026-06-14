import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MarketTrendChart from "./MarketTrendChart";

describe("MarketTrendChart", () => {
  it("shows a limited-history note when fewer than 2 points", () => {
    render(
      <MarketTrendChart
        title="Median Price"
        series={[{ month: "2026-06", value: 500000, yoy_pct: 1 }]}
        format="currency"
      />
    );
    expect(screen.getByText(/limited history/i)).toBeTruthy();
  });
  it("renders the chart title when enough points", () => {
    render(
      <MarketTrendChart
        title="Median Price"
        series={[
          { month: "2026-05", value: 480000, yoy_pct: 1 },
          { month: "2026-06", value: 500000, yoy_pct: 2 },
        ]}
        format="currency"
      />
    );
    expect(screen.getByText("Median Price")).toBeTruthy();
  });
});
