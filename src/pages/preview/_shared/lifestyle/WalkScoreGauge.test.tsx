// src/pages/preview/_shared/lifestyle/WalkScoreGauge.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WalkScoreGauge, { gaugeFraction } from "./WalkScoreGauge";

describe("WalkScoreGauge", () => {
  it("clamps the fraction to 0..1", () => {
    expect(gaugeFraction(60)).toBeCloseTo(0.6);
    expect(gaugeFraction(-5)).toBe(0);
    expect(gaugeFraction(140)).toBe(1);
  });
  it("renders the value and label", () => {
    render(<WalkScoreGauge value={60} label="Somewhat Walkable" />);
    expect(screen.getByText("60")).toBeTruthy();
    expect(screen.getByText("Somewhat Walkable")).toBeTruthy();
  });
});
