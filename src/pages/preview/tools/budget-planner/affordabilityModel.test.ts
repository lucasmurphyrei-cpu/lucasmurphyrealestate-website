import { describe, it, expect } from "vitest";
import {
  bucketSavings,
  paymentRange,
  solveAllInPrice,
  cashPicture,
  rateSensitivity,
  isProtectedByDefault,
  type SavingsLine,
  type AllInInputs,
} from "./affordabilityModel";

describe("bucketSavings", () => {
  const rows: SavingsLine[] = [
    { label: "Monthly Savings (Downpayment)", amount: 600, protectedFlag: false, isDownPayment: true },
    { label: "Roth IRA", amount: 500, protectedFlag: true, isDownPayment: false },
    { label: "Brokerage investing", amount: 400, protectedFlag: false, isDownPayment: false },
  ];
  it("splits protected vs flexible and exposes down-payment savings", () => {
    const b = bucketSavings(rows);
    expect(b.protectedTotal).toBe(500);
    expect(b.flexibleTotal).toBe(1000); // DP 600 + brokerage 400
    expect(b.downPaymentSavings).toBe(600);
  });
  it("default protected heuristic catches retirement/emergency labels", () => {
    expect(isProtectedByDefault("Roth IRA")).toBe(true);
    expect(isProtectedByDefault("401(k) match")).toBe(true);
    expect(isProtectedByDefault("Emergency fund")).toBe(true);
    expect(isProtectedByDefault("Brokerage investing")).toBe(false);
    expect(isProtectedByDefault("Monthly Savings (Downpayment)")).toBe(false);
  });
});

describe("paymentRange", () => {
  const base = {
    monthlyNet: 6000,
    monthlyGross: 8000,
    debts: 300,
    fixedTotal: 2500,
    subsMonthly: 100,
    gfTotal: 600,
    protectedTotal: 500,
    flexibleTotal: 1000,
    downPaymentSavings: 600,
    rentMortgage: 1800,
  };
  it("caps to the 28/36 ceiling when budget exceeds it", () => {
    const r = paymentRange(base);
    // lenderMax = min(0.28*8000, 0.36*8000-300) = min(2240, 2580) = 2240
    expect(r.lenderMaxPayment).toBe(2240);
    expect(r.conservativePayment).toBe(2240);
    expect(r.stretchPayment).toBe(2240);
    expect(r.tuned(0)).toBe(2240);
  });
  it("conservative keeps savings; stretch redirects DP + flexible when under the ceiling", () => {
    // gross high enough that the 28/36 ceiling (0.28*20000=5600) is above the stretch number
    const r = paymentRange({ ...base, monthlyGross: 20000 });
    // leftover = 6000-2500-100-600-500-1000 = 1300
    expect(r.leftover).toBe(1300);
    expect(r.conservativePayment).toBe(3100); // 1300 + 1800
    expect(r.stretchPayment).toBe(4700); // + 600 + 1000
    expect(r.tuned(0.5)).toBe(4200); // + 600 + 500
    expect(r.comfortableVsApprovedGapAt(0)).toBeGreaterThan(0);
  });
});

describe("solveAllInPrice", () => {
  const inputs: AllInInputs = {
    targetPayment: 2400,
    downAmount: 50000,
    rate: 6.5,
    term: 30,
    taxRatePct: 1.8,
    homeInsAnnual: 1800,
    pmiRatePct: 0.5,
    hoaMonthly: 0,
    maintenancePctPerYear: 1.0,
  };
  it("backs into a price whose all-in monthly ≈ target", () => {
    const r = solveAllInPrice(inputs);
    expect(r.price).toBeGreaterThan(50000);
    expect(Math.abs(r.allInPayment - 2400)).toBeLessThan(15);
    expect(r.maintenanceMonthly).toBeCloseTo((r.price * 0.01) / 12, 0);
    expect(r.downPctResolved).toBeCloseTo((50000 / r.price) * 100, 0);
    expect(r.pmiApplies).toBe(r.downPctResolved < 20);
  });
  it("turning maintenance off (0%) supports a higher price for the same payment", () => {
    const withMaint = solveAllInPrice(inputs);
    const noMaint = solveAllInPrice({ ...inputs, maintenancePctPerYear: 0 });
    expect(noMaint.price).toBeGreaterThan(withMaint.price);
    expect(noMaint.maintenanceMonthly).toBe(0);
  });
});

describe("cashPicture + rateSensitivity", () => {
  it("computes closing, reserves, and months of reserve", () => {
    const c = cashPicture({ price: 350000, downAmount: 50000, closingPct: 3, capitalAvailable: 65000, allInPayment: 2400 });
    expect(c.cashToClose).toBeCloseTo(60500, 0); // 50000 + 10500
    expect(c.reservesAfter).toBeCloseTo(4500, 0);
    expect(c.reserveMonths).toBeCloseTo(4500 / 2400, 1);
  });
  it("price drops when rate rises, rises when rate falls", () => {
    const s = rateSensitivity(
      {
        targetPayment: 2400,
        downAmount: 50000,
        rate: 6.5,
        term: 30,
        taxRatePct: 1.8,
        homeInsAnnual: 1800,
        pmiRatePct: 0.5,
        hoaMonthly: 0,
        maintenancePctPerYear: 1.0,
      },
      1.0
    );
    expect(s.up.price).toBeLessThan(s.base.price);
    expect(s.down.price).toBeGreaterThan(s.base.price);
  });
});
