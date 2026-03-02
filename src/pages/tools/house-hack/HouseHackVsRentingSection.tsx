import { useState, useMemo, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ArrowRight, Info } from "lucide-react";
import type {
  OwnerOccupiedReturnsDerived,
  OwnerOccupiedExtras,
  InvestmentDerived,
  FinancingType,
} from "./types";
import { calcMonthlyPrincipalSchedule, formatCurrency, formatCurrencyDetailed } from "./calculations";
import InputField from "./InputField";
import ResultRow from "./ResultRow";

interface HouseHackVsRentingSectionProps {
  ownerReturns: OwnerOccupiedReturnsDerived;
  ownerExtras: OwnerOccupiedExtras;
  onUpdateOwnerExtras: (field: "currentRent" | "appreciationPercent" | "rentGrowthPercent", value: number) => void;
  purchasePrice: number;
  investmentDerived: InvestmentDerived;
  interestRate: number;
  financingType: FinancingType;
  effectiveMonthlyIncome: number;
  onSwitchToAllUnits: () => void;
}

interface YearProjection {
  year: number;
  // Per-year figures (shown in the table)
  yearRent: number;
  yearHackCost: number;
  yearRentSaved: number;
  yearEquity: number;
  yearAdvantage: number;
  // Cumulative totals (for the breakdown)
  cumulativeRent: number;
  cumulativeHousingCost: number;
  rentSaved: number;
  totalAppreciation: number;
  totalPrincipalPaydown: number;
  totalEquityBuilt: number;
  netAdvantage: number;
}

const MILESTONE_YEARS = [1, 2, 3, 5, 10];

const HouseHackVsRentingSection = ({
  ownerReturns,
  ownerExtras,
  onUpdateOwnerExtras,
  purchasePrice,
  investmentDerived,
  interestRate,
  financingType,
  effectiveMonthlyIncome,
  onSwitchToAllUnits,
}: HouseHackVsRentingSectionProps) => {
  const [showMonthlyBreakdown, setShowMonthlyBreakdown] = useState(false);
  const [showProjection, setShowProjection] = useState(true);
  const [showAdvantageInfo, setShowAdvantageInfo] = useState(false);
  const [showHackCostInfo, setShowHackCostInfo] = useState(false);
  const advantageInfoRef = useRef<HTMLDivElement>(null);
  const hackCostInfoRef = useRef<HTMLDivElement>(null);
  const isCash = financingType === "cash";

  useEffect(() => {
    if (!showAdvantageInfo && !showHackCostInfo) return;
    const handler = (e: MouseEvent) => {
      if (showAdvantageInfo && advantageInfoRef.current && !advantageInfoRef.current.contains(e.target as Node)) {
        setShowAdvantageInfo(false);
      }
      if (showHackCostInfo && hackCostInfoRef.current && !hackCostInfoRef.current.contains(e.target as Node)) {
        setShowHackCostInfo(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showAdvantageInfo, showHackCostInfo]);

  const annualAppreciation = purchasePrice * (ownerExtras.appreciationPercent / 100);

  const principalSchedule = useMemo(() => {
    if (isCash) return [];
    return calcMonthlyPrincipalSchedule(
      investmentDerived.totalLoan,
      interestRate,
      investmentDerived.monthlyPI,
    );
  }, [isCash, investmentDerived.totalLoan, interestRate, investmentDerived.monthlyPI]);

  const yearOnePrincipalPaydown = principalSchedule.reduce((sum, row) => sum + row.principalPayment, 0);

  // Multi-year projection
  const projections = useMemo<YearProjection[]>(() => {
    const g = ownerExtras.rentGrowthPercent / 100;
    const appRate = ownerExtras.appreciationPercent / 100;
    const monthlyRate = interestRate / 100 / 12;

    // Fixed monthly cost = total expenses (stays constant with fixed-rate mortgage)
    // effectiveHousingCost = totalExpenses - effectiveIncome
    // So totalExpenses = effectiveHousingCost + effectiveIncome
    const fixedMonthlyCost = ownerReturns.effectiveHousingCost + effectiveMonthlyIncome;

    // Pre-compute per-year data for all years up to max milestone
    const maxYear = MILESTONE_YEARS[MILESTONE_YEARS.length - 1];
    const yearlyRent: number[] = [];
    const yearlyHackCost: number[] = [];
    const yearlyAppreciation: number[] = [];
    const yearlyPrincipal: number[] = [];

    // Per-year rent and hack cost
    for (let y = 0; y < maxYear; y++) {
      yearlyRent.push(ownerExtras.currentRent * Math.pow(1 + g, y) * 12);
      const yearTenantIncome = effectiveMonthlyIncome * Math.pow(1 + g, y);
      const yearMonthlyCost = fixedMonthlyCost - yearTenantIncome;
      yearlyHackCost.push(Math.max(0, yearMonthlyCost) * 12);
    }

    // Per-year appreciation
    for (let y = 0; y < maxYear; y++) {
      const prevValue = purchasePrice * Math.pow(1 + appRate, y);
      yearlyAppreciation.push(prevValue * appRate);
    }

    // Per-year principal paydown
    if (!isCash && investmentDerived.totalLoan > 0 && investmentDerived.monthlyPI > 0) {
      let balance = investmentDerived.totalLoan;
      for (let y = 0; y < maxYear; y++) {
        let yearPD = 0;
        for (let m = 0; m < 12; m++) {
          if (balance <= 0) break;
          const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;
          const principal = investmentDerived.monthlyPI - interest;
          yearPD += principal;
          balance -= principal;
        }
        yearlyPrincipal.push(yearPD);
      }
    } else {
      for (let y = 0; y < maxYear; y++) yearlyPrincipal.push(0);
    }

    return MILESTONE_YEARS.map((targetYear) => {
      // Per-year figures (for the specific year)
      const yIdx = targetYear - 1;
      const yearRent = yearlyRent[yIdx] || 0;
      const yearHackCost = yearlyHackCost[yIdx] || 0;
      const yearRentSaved = yearRent - yearHackCost;
      const yearEquity = (yearlyAppreciation[yIdx] || 0) + (yearlyPrincipal[yIdx] || 0);
      const yearAdvantage = yearRentSaved + yearEquity;

      // Cumulative totals
      let cumulativeRent = 0;
      let cumulativeHousingCost = 0;
      let totalAppreciation = 0;
      let totalPrincipalPaydown = 0;
      for (let y = 0; y < targetYear; y++) {
        cumulativeRent += yearlyRent[y] || 0;
        cumulativeHousingCost += yearlyHackCost[y] || 0;
        totalAppreciation += yearlyAppreciation[y] || 0;
        totalPrincipalPaydown += yearlyPrincipal[y] || 0;
      }

      const rentSaved = cumulativeRent - cumulativeHousingCost;
      const totalEquityBuilt = totalAppreciation + totalPrincipalPaydown;
      const netAdvantage = rentSaved + totalEquityBuilt;

      return {
        year: targetYear,
        yearRent, yearHackCost, yearRentSaved, yearEquity, yearAdvantage,
        cumulativeRent, cumulativeHousingCost, rentSaved,
        totalAppreciation, totalPrincipalPaydown, totalEquityBuilt, netAdvantage,
      };
    });
  }, [
    ownerExtras.currentRent, ownerExtras.rentGrowthPercent, ownerExtras.appreciationPercent,
    effectiveMonthlyIncome, investmentDerived, interestRate, purchasePrice, isCash,
    ownerReturns.effectiveHousingCost,
  ]);

  const year1 = projections[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">5. House-Hacking vs. Renting</CardTitle>
        <p className="text-xs text-muted-foreground">
          Compare your house hack to renting — including the wealth-building benefits renters miss.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Rent Input */}
        <InputField
          label="Your Current Rent / Housing Cost"
          value={ownerExtras.currentRent}
          onChange={(v) => onUpdateOwnerExtras("currentRent", v)}
          prefix="$"
          useCommas
          placeholder="Enter your current rent"
          info="Enter what you currently pay per month for rent/housing. This is used to calculate how much you'd save by house hacking compared to your current situation."
        />

        {/* Savings Comparison */}
        <div className="space-y-0">
          <ResultRow
            label="Your Effective Housing Cost"
            value={ownerReturns.effectiveHousingCost}
            format="currency"
            colorCode
            size="large"
            benchmark="What you actually pay per month after rental income"
          />
          <ResultRow
            label="Monthly Savings vs. Renting"
            value={ownerReturns.houseHackSavings}
            format="currency"
            colorCode
          />
          <ResultRow
            label="Annual Savings vs. Renting"
            value={ownerReturns.annualSavings}
            format="currency"
            colorCode
          />
        </div>

        <hr className="border-border" />

        {/* Appreciation */}
        <InputField
          label="Estimated Annual Appreciation (%)"
          value={ownerExtras.appreciationPercent}
          onChange={(v) => onUpdateOwnerExtras("appreciationPercent", v)}
          suffix="%"
          step={0.5}
          info="Historical average home appreciation is 3-5% annually. The Milwaukee metro has averaged 4-7% in recent years. Conservative estimate: 3%. This represents the increase in your property's value each year — equity you build just by owning."
        />
        <ResultRow
          label="Estimated Year 1 Appreciation"
          value={annualAppreciation}
          format="currency"
          benchmark="Projected increase in your property's value"
        />

        {/* Principal Paydown */}
        {!isCash && (
          <>
            <hr className="border-border" />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Principal Paydown (Year 1)</p>
                <button
                  type="button"
                  onClick={() => setShowMonthlyBreakdown(!showMonthlyBreakdown)}
                  className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  {showMonthlyBreakdown ? "Hide" : "Show"} Monthly
                  {showMonthlyBreakdown ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>

              <ResultRow
                label="Year 1 Total Principal Paydown"
                value={yearOnePrincipalPaydown}
                format="currency"
                size="large"
                benchmark="Equity built from mortgage payments — renters get $0 of this"
              />
              <ResultRow
                label="Avg. Monthly Principal Paydown"
                value={yearOnePrincipalPaydown / 12}
                format="currency"
              />

              {showMonthlyBreakdown && principalSchedule.length > 0 && (
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-secondary/50">
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Mo.</th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground">Principal</th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground">Interest</th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {principalSchedule.map((row) => (
                        <tr key={row.month} className="border-t border-border/60">
                          <td className="px-3 py-1.5 text-muted-foreground tabular-nums">{row.month}</td>
                          <td className="px-3 py-1.5 text-right text-emerald-400 font-medium tabular-nums">
                            {formatCurrencyDetailed(row.principalPayment)}
                          </td>
                          <td className="px-3 py-1.5 text-right text-muted-foreground tabular-nums">
                            {formatCurrencyDetailed(row.interestPayment)}
                          </td>
                          <td className="px-3 py-1.5 text-right text-muted-foreground tabular-nums">
                            {formatCurrency(row.remainingBalance)}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t border-border bg-secondary/30 font-medium">
                        <td className="px-3 py-2">Total</td>
                        <td className="px-3 py-2 text-right text-emerald-400 tabular-nums">
                          {formatCurrencyDetailed(yearOnePrincipalPaydown)}
                        </td>
                        <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">
                          {formatCurrencyDetailed(principalSchedule.reduce((s, r) => s + r.interestPayment, 0))}
                        </td>
                        <td className="px-3 py-2" />
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <div className="rounded-lg bg-secondary/30 p-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="text-primary font-bold">i</span>{" "}
                  Every mortgage payment builds equity in your property. Even if your monthly cash flow
                  is slightly negative, you're still building wealth through principal paydown. Renters pay
                  their landlord's mortgage — as an owner, you pay your own.
                </p>
              </div>
            </div>
          </>
        )}

        <hr className="border-border" />

        {/* Year 1 Summary */}
        {ownerExtras.currentRent > 0 && year1 && (
          <>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
              <p className="text-sm font-semibold">Year 1 Summary: Renting vs. House-Hacking</p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="font-medium text-red-400">Renting</p>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total paid</span>
                    <span className="tabular-nums font-medium text-red-400">{formatCurrency(year1.cumulativeRent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Equity built</span>
                    <span className="tabular-nums font-medium text-muted-foreground">$0</span>
                  </div>
                  <div className="flex justify-between border-t border-border/60 pt-2">
                    <span className="text-muted-foreground">Net position</span>
                    <span className="tabular-nums font-semibold text-red-400">-{formatCurrency(year1.cumulativeRent)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-emerald-400">House-Hacking</p>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total paid</span>
                    <span className="tabular-nums font-medium">{formatCurrency(year1.cumulativeHousingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Equity built</span>
                    <span className="tabular-nums font-medium text-emerald-400">+{formatCurrency(year1.totalEquityBuilt)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/60 pt-2">
                    <span className="text-muted-foreground">Net position</span>
                    <span className="tabular-nums font-semibold text-emerald-400">
                      +{formatCurrency(year1.totalEquityBuilt - year1.cumulativeHousingCost)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-t border-border/60 pt-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">Year 1 Advantage</span>
                    <div className="relative" ref={advantageInfoRef}>
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowAdvantageInfo(!showAdvantageInfo)}
                        className="text-muted-foreground/50 hover:text-primary transition-colors"
                        aria-label="More info about Year 1 Advantage"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                      {showAdvantageInfo && (
                        <div className="absolute bottom-full left-0 md:left-1/2 md:-translate-x-1/2 mb-2 w-64 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-popover p-3 text-xs text-popover-foreground shadow-lg z-50">
                          <p className="leading-relaxed">
                            This advantage does not include the upfront costs of purchasing the property (down payment, closing costs) or money spent on initial repairs. It represents how much better off you are compared to renting over this period — factoring in rent savings, appreciation, and principal paydown.
                          </p>
                          <div className="absolute top-full left-2 md:left-1/2 md:-translate-x-1/2 -mt-px w-2 h-2 bg-popover border-b border-r border-border rotate-45" />
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-lg font-bold tracking-tight tabular-nums text-emerald-400">
                    +{formatCurrency(year1.netAdvantage)}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-border" />
          </>
        )}

        {/* Multi-Year Projection */}
        {ownerExtras.currentRent > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Long-Term Wealth Projection</p>
              <button
                type="button"
                onClick={() => setShowProjection(!showProjection)}
                className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                {showProjection ? "Hide" : "Show"}
                {showProjection ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Annual Rent Growth (%)"
                value={ownerExtras.rentGrowthPercent}
                onChange={(v) => onUpdateOwnerExtras("rentGrowthPercent", v)}
                suffix="%"
                step={0.5}
                info="Average rent growth nationally is 3-5% per year. This rate applies equally to what a renter would pay AND what your tenants pay — so your rental income grows over time while your fixed mortgage stays the same."
              />
              <InputField
                label="Annual Appreciation (%)"
                value={ownerExtras.appreciationPercent}
                onChange={(v) => onUpdateOwnerExtras("appreciationPercent", v)}
                suffix="%"
                step={0.5}
                infoAlign="right"
                info="Historical average home appreciation is 3-5% annually. The Milwaukee metro has averaged 4-7% in recent years. Conservative estimate: 3%. This is synced with the appreciation input above."
              />
            </div>

            {showProjection && (
              <>
                <div className="rounded-lg border border-border overflow-hidden overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-secondary/50">
                        <th className="px-1.5 py-2 text-left font-medium text-muted-foreground">Year</th>
                        <th className="px-1.5 py-2 text-right font-medium text-muted-foreground">Rent Paid</th>
                        <th className="px-1.5 py-2 text-right font-medium text-muted-foreground">
                          <div className="flex items-center justify-end gap-1">
                            <span>House-Hack Cost</span>
                            <div className="relative" ref={hackCostInfoRef}>
                              <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowHackCostInfo(!showHackCostInfo)}
                                className="text-muted-foreground/50 hover:text-primary transition-colors"
                              >
                                <Info className="h-3 w-3" />
                              </button>
                              {showHackCostInfo && (
                                <div className="absolute bottom-full right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 mb-2 w-56 rounded-lg border border-border bg-popover p-2.5 text-xs text-popover-foreground shadow-lg z-50 text-left font-normal">
                                  <p className="leading-relaxed">
                                    Assumes a fixed-rate mortgage. Does not account for potential increases in property taxes, insurance, or other variable costs over time.
                                  </p>
                                  <div className="absolute top-full right-2 md:right-auto md:left-1/2 md:-translate-x-1/2 -mt-px w-2 h-2 bg-popover border-b border-r border-border rotate-45" />
                                </div>
                              )}
                            </div>
                          </div>
                        </th>
                        <th className="px-1.5 py-2 text-right font-medium text-muted-foreground">Rent Saved</th>
                        <th className="px-0.5 py-2 text-center font-medium text-muted-foreground/40">+</th>
                        <th className="px-1.5 py-2 text-right font-medium text-muted-foreground">Equity</th>
                        <th className="px-0.5 py-2 text-center font-medium text-muted-foreground/40">=</th>
                        <th className="px-1.5 py-2 text-right font-medium text-emerald-400">Advantage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projections.map((p) => (
                        <tr key={p.year} className="border-t border-border/60">
                          <td className="px-1.5 py-2 font-medium tabular-nums">{p.year}yr</td>
                          <td className="px-1.5 py-2 text-right text-red-400 tabular-nums">{formatCurrency(p.yearRent)}</td>
                          <td className="px-1.5 py-2 text-right text-muted-foreground tabular-nums">{formatCurrency(p.yearHackCost)}</td>
                          <td className="px-1.5 py-2 text-right text-emerald-400/80 tabular-nums">{formatCurrency(p.yearRentSaved)}</td>
                          <td className="px-0.5 py-2 text-center text-muted-foreground/30">+</td>
                          <td className="px-1.5 py-2 text-right text-emerald-400/80 tabular-nums">{formatCurrency(p.yearEquity)}</td>
                          <td className="px-0.5 py-2 text-center text-muted-foreground/30">=</td>
                          <td className="px-1.5 py-2 text-right font-semibold text-emerald-400 tabular-nums">+{formatCurrency(p.yearAdvantage)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cumulative Breakdown */}
                {(() => {
                  const last = projections[projections.length - 1];
                  if (!last) return null;
                  return (
                    <div className="rounded-lg border border-border/60 bg-secondary/20 p-3 space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground">{last.year}-Year Total Advantage Breakdown</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Rent Saved</span>
                          <span className="tabular-nums font-medium text-emerald-400">{formatCurrency(last.rentSaved)}</span>
                        </div>
                        <div className="flex justify-between items-center pl-2">
                          <span className="text-muted-foreground/60 text-[10px]">+</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Appreciation Gains</span>
                          <span className="tabular-nums font-medium text-emerald-400">{formatCurrency(last.totalAppreciation)}</span>
                        </div>
                        <div className="flex justify-between items-center pl-2">
                          <span className="text-muted-foreground/60 text-[10px]">+</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Principal Paydown</span>
                          <span className="tabular-nums font-medium text-emerald-400">{formatCurrency(last.totalPrincipalPaydown)}</span>
                        </div>
                        <div className="border-t border-border/60 pt-1.5 mt-1.5 flex justify-between items-center">
                          <span className="font-medium">= Total {last.year}-Year Advantage</span>
                          <span className="tabular-nums font-bold text-emerald-400">+{formatCurrency(last.netAdvantage)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="rounded-lg bg-secondary/30 p-3 space-y-2">
                  <p className="text-xs font-medium text-foreground">Why it keeps getting better</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground">Rent keeps rising.</span>{" "}
                    At {ownerExtras.rentGrowthPercent}% annual growth, a ${ownerExtras.currentRent.toLocaleString()}/mo rent
                    becomes ${Math.round(ownerExtras.currentRent * Math.pow(1 + ownerExtras.rentGrowthPercent / 100, 10)).toLocaleString()}/mo in 10 years.
                    Your mortgage payment? It stays the same.
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground">Appreciation compounds.</span>{" "}
                    Like a savings account, your home value grows on last year's higher value — not the original price.
                    At {ownerExtras.appreciationPercent}%, a {formatCurrency(purchasePrice)} property is
                    worth {formatCurrency(purchasePrice * Math.pow(1 + ownerExtras.appreciationPercent / 100, 10))} in 10 years.
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground">Principal paydown accelerates.</span>{" "}
                    With each payment, more goes to principal and less to interest. In the early years most
                    of your payment is interest, but it shifts over time — building equity faster the longer you own.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        <hr className="border-border" />

        {/* Investment Comparison */}
        {investmentDerived.initialInvestment > 0 && year1 && (
          <>
            <div className="space-y-3">
              <p className="text-sm font-semibold">How Does This Compare?</p>
              <p className="text-xs text-muted-foreground">
                If you invested {formatCurrency(investmentDerived.initialInvestment)} (your initial investment) elsewhere instead:
              </p>
              {(() => {
                const initial = investmentDerived.initialInvestment;
                const houseHackTotalReturn = (ownerReturns.annualSavings + annualAppreciation + yearOnePrincipalPaydown);
                const houseHackROI = initial > 0 ? (houseHackTotalReturn / initial) * 100 : 0;
                const sp500Rate = 10;
                const btcRate = 30;
                const sp500Return = initial * (sp500Rate / 100);
                const btcReturn = initial * (btcRate / 100);

                return (
                  <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-secondary/50">
                          <th className="px-3 py-2 text-left font-medium text-muted-foreground">Investment</th>
                          <th className="px-3 py-2 text-right font-medium text-muted-foreground">Avg. Annual Return</th>
                          <th className="px-3 py-2 text-right font-medium text-muted-foreground">Year 1 Gain</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-border/60 bg-emerald-500/5">
                          <td className="px-3 py-2 font-medium text-emerald-400">House Hack</td>
                          <td className="px-3 py-2 text-right font-semibold text-emerald-400 tabular-nums">{houseHackROI.toFixed(1)}%</td>
                          <td className="px-3 py-2 text-right font-semibold text-emerald-400 tabular-nums">{formatCurrency(houseHackTotalReturn)}</td>
                        </tr>
                        <tr className="border-t border-border/60">
                          <td className="px-3 py-2 font-medium text-muted-foreground">S&P 500</td>
                          <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">{sp500Rate}%</td>
                          <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">{formatCurrency(sp500Return)}</td>
                        </tr>
                        <tr className="border-t border-border/60">
                          <td className="px-3 py-2 font-medium text-muted-foreground">Bitcoin (10yr avg)</td>
                          <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">{btcRate}%</td>
                          <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">{formatCurrency(btcReturn)}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="px-3 py-2 bg-secondary/30 border-t border-border/60">
                      <p className="text-[10px] text-muted-foreground/70">
                        S&P 500 based on historical average (~10%). Bitcoin based on 10-year annualized average (~30%). Past performance does not guarantee future results. House hack return includes rent savings, appreciation, and principal paydown.
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            <hr className="border-border" />
          </>
        )}

        {/* Tax Benefits Note */}
        <div className="rounded-lg bg-secondary/30 p-3 space-y-1.5">
          <p className="text-xs font-medium">Note: Tax Benefits</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            As a house hack owner, you may also benefit from mortgage interest deductions,
            property tax deductions, depreciation on the rental portion, and deducting operating expenses.
            These tax advantages can further improve your effective returns. Consult a tax professional
            for specifics on your situation.
          </p>
        </div>

        <hr className="border-border" />

        {/* Concluding Note */}
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2">
          <p className="text-sm font-semibold text-center">You need a place to live — why not make it an investment?</p>
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Everyone pays for housing. The difference is whether that money builds wealth for you or your landlord.
            A house hack lets you live for less (or free), build equity through appreciation and principal paydown,
            and set yourself up with a cash-flowing rental when you're ready to move on. It's not just a home — it's your first investment property.
          </p>
        </div>

        <hr className="border-border" />

        {/* CTA to switch to All Units Rented */}
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center space-y-2">
          <p className="text-sm font-medium">What happens when you move out?</p>
          <p className="text-xs text-muted-foreground">
            See how this property stacks up as a true rental property with all units generating income.
          </p>
          <Button size="sm" className="mt-2" onClick={onSwitchToAllUnits}>
            View All Units Rented Out
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HouseHackVsRentingSection;
