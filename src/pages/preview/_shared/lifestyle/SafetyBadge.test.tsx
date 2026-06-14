// src/pages/preview/_shared/lifestyle/SafetyBadge.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SafetyBadge, { gradeColor } from "./SafetyBadge";

describe("SafetyBadge", () => {
  it("maps grade letter to a color", () => {
    expect(gradeColor("A")).toBe("#10b981");
    expect(gradeColor("B-")).toBe("#84cc16");
    expect(gradeColor("C-")).toBe("#f59e0b");
    expect(gradeColor("D")).toBe("#ef4444");
    expect(gradeColor("F")).toBe("#ef4444");
  });
  it("renders grade, percentile and note", () => {
    render(<SafetyBadge grade="C-" percentile={37} note="NE side is safest" />);
    expect(screen.getByText("C-")).toBeTruthy();
    expect(screen.getByText(/37th percentile/i)).toBeTruthy();
    expect(screen.getByText(/NE side is safest/i)).toBeTruthy();
  });
});
