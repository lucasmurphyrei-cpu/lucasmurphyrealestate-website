import { useState, useEffect, useCallback } from "react";
import { Building2 } from "lucide-react";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import Seo from "@/components/seo/Seo";
import { useHouseHackState } from "@/pages/tools/house-hack/useHouseHackState";
import type { PropertyType, AnalysisMode } from "@/pages/tools/house-hack/types";
import { Pill } from "./house-hack/previewUi";
import InvestmentSection from "./house-hack/InvestmentSection";
import IncomeSection from "./house-hack/IncomeSection";
import ExpensesSection from "./house-hack/ExpensesSection";
import ReturnsSection from "./house-hack/ReturnsSection";
import ReservesSection from "./house-hack/ReservesSection";
import HouseHackVsRentingSection from "./house-hack/HouseHackVsRentingSection";
import PropertySearchSection from "./house-hack/PropertySearchSection";
import LeadCaptureSection from "./house-hack/LeadCaptureSection";
import FeedbackSection from "./house-hack/FeedbackSection";

const PROPERTY_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: "duplex", label: "Duplex (2 Units)" },
  { value: "triplex", label: "Triplex (3 Units)" },
  { value: "fourplex", label: "Fourplex (4 Units)" },
];

const MODE_OPTIONS: { value: AnalysisMode; label: string }[] = [
  { value: "owner-occupied", label: "Living In One Unit" },
  { value: "all-units-rented", label: "All Units Rented Out" },
];

export default function HouseHackCalculator() {
  const {
    state,
    setPropertyType,
    setMode,
    updateInvestment,
    updateOwnerIncome,
    updateAllUnitsIncome,
    updateOwnerExpenses,
    updateAllUnitsExpenses,
    updateOwnerExtras,
    updateAllUnitsExtras,
    derived,
  } = useHouseHackState();

  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [pendingScrollToIncome, setPendingScrollToIncome] = useState(false);
  const [highlightUnits, setHighlightUnits] = useState(false);

  const handleCountySelect = useCallback((countyKey: string, monthlyTax: number) => {
    setSelectedCounty(countyKey);
    updateInvestment("monthlyTaxes", monthlyTax);
  }, [updateInvestment]);

  const handleTaxManualChange = useCallback(() => setSelectedCounty(null), []);

  const handleSwitchToAllUnits = useCallback(() => {
    setMode("all-units-rented");
    setPendingScrollToIncome(true);
    setHighlightUnits(true);
  }, [setMode]);

  useEffect(() => {
    if (pendingScrollToIncome) {
      const timer = setTimeout(() => {
        document.getElementById("all-units-income-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
        setPendingScrollToIncome(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pendingScrollToIncome]);

  useEffect(() => {
    if (highlightUnits) {
      const timer = setTimeout(() => setHighlightUnits(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightUnits]);

  const isOwner = state.mode === "owner-occupied";

  // Vacancy is counted ONCE, on the income side (calcIncome reduces effective income by the
  // vacancy %). The Expenses "Vacancy Reserve" is a synced mirror of that rate and is NOT added
  // to the expense total (state.*.expenses.vacancyDollar stays 0).
  const grossMonthly = derived.income.grossMonthlyIncome;
  const incomeUpdate = isOwner ? updateOwnerIncome : updateAllUnitsIncome;
  const expensesUpdate = isOwner ? updateOwnerExpenses : updateAllUnitsExpenses;
  const incomeVacancyPercent = isOwner ? state.ownerOccupiedIncome.vacancyPercent : state.allUnitsIncome.vacancyPercent;
  const onVacancyReserveChange = (dollar: number) =>
    incomeUpdate("vacancyPercent", grossMonthly > 0 ? Math.round((dollar / grossMonthly) * 10000) / 100 : 0);

  const sidebar = (
    <div className="space-y-6 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
      <PropertySearchSection propertyType={state.propertyType} purchasePrice={state.investment.purchasePrice} />
      <LeadCaptureSection propertyType={state.propertyType} investment={state.investment} state={state} derived={derived} />
      <FeedbackSection />
    </div>
  );

  return (
    <div className="preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <Seo
        title="House Hack Calculator | Metro Milwaukee | Lucas Murphy"
        description="Analyze a multi-unit house hack: your true cost of living, cash flow, cash-on-cash return, and long-term wealth versus renting in Metro Milwaukee."
        canonicalPath="/preview/v1/tools/house-hack-calculator"
        noindex
      />
      <PreviewHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a1424] pt-28 pb-16 text-white lg:pt-36 lg:pb-20">
        <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
            <Building2 className="h-4 w-4" /> Investor tool
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] sm:text-5xl">
            House Hack Deal Analysis
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/75">
            Analyze a multi-unit property to see your true housing cost, cash flow, and investment returns. Enter your
            deal numbers below — results update in real time.
          </p>
          <p className="mt-3 text-sm text-white/60">
            New to house hacking?{" "}
            <a href="https://www.lucasmurphyrealestate.com/guide/house-hacking-guide" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline-offset-4 hover:underline">
              Read the House Hacking Guide
            </a>{" "}
            to learn the strategy behind the numbers.
          </p>
        </div>
      </section>

      {/* Controls + calculator */}
      <section className="mx-auto mt-10 max-w-7xl px-6 pb-24 lg:px-10">
        <div className="rounded-sm border border-border bg-card p-6 shadow-[0_40px_90px_-45px_hsl(216_52%_11%/0.45)] ring-1 ring-border/70 sm:p-7">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Property type</p>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_OPTIONS.map((opt) => (
              <Pill key={opt.value} active={state.propertyType === opt.value} onClick={() => setPropertyType(opt.value)}>{opt.label}</Pill>
            ))}
          </div>

          <p className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Analysis mode</p>
          <div className="inline-flex w-full max-w-md overflow-hidden rounded-sm border border-border">
            {MODE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setMode(opt.value)}
                className={`flex-1 px-4 py-2.5 text-sm font-semibold transition-colors ${state.mode === opt.value ? "bg-accent text-accent-foreground" : "bg-white text-muted-foreground hover:text-foreground"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,380px]">
          {/* Main column */}
          <div className="space-y-6">
            <InvestmentSection
              investment={state.investment}
              derived={derived.investment}
              onUpdate={updateInvestment}
              selectedCounty={selectedCounty}
              onCountySelect={handleCountySelect}
              onTaxManualChange={handleTaxManualChange}
            />
            {isOwner ? (
              <IncomeSection mode="owner-occupied" propertyType={state.propertyType} income={state.ownerOccupiedIncome} derived={derived.income} onUpdate={incomeUpdate} />
            ) : (
              <IncomeSection id="all-units-income-section" mode="all-units-rented" propertyType={state.propertyType} income={state.allUnitsIncome} derived={derived.income} onUpdate={incomeUpdate} highlightUnits={highlightUnits} />
            )}
            <ExpensesSection
              mode={state.mode}
              expenses={isOwner ? state.ownerOccupiedExpenses : state.allUnitsExpenses}
              derived={derived.expenses}
              monthlyPITI={derived.investment.monthlyPITI}
              purchasePrice={state.investment.purchasePrice}
              grossMonthlyIncome={derived.income.grossMonthlyIncome}
              incomeVacancyPercent={incomeVacancyPercent}
              onVacancyReserveChange={onVacancyReserveChange}
              onUpdate={expensesUpdate}
            />
            <ReturnsSection
              mode={state.mode}
              financingType={state.investment.financingType}
              ownerReturns={derived.ownerOccupiedReturns}
              allUnitsReturns={derived.allUnitsReturns}
              ownerExtras={state.ownerOccupiedExtras}
              allUnitsExtras={state.allUnitsExtras}
              onUpdateOwnerExtras={updateOwnerExtras}
              onUpdateAllUnitsExtras={updateAllUnitsExtras}
            />
            {isOwner && (
              <>
                <HouseHackVsRentingSection
                  ownerReturns={derived.ownerOccupiedReturns}
                  ownerExtras={state.ownerOccupiedExtras}
                  onUpdateOwnerExtras={updateOwnerExtras}
                  purchasePrice={state.investment.purchasePrice}
                  investmentDerived={derived.investment}
                  interestRate={state.investment.interestRate}
                  financingType={state.investment.financingType}
                  effectiveMonthlyIncome={derived.income.effectiveMonthlyIncome}
                  onSwitchToAllUnits={handleSwitchToAllUnits}
                />
                <ReservesSection reserves={derived.reserves} expenses={state.ownerOccupiedExpenses} expensesDerived={derived.expenses} />
              </>
            )}
          </div>

          {/* Sidebar */}
          {sidebar}
        </div>
      </section>

      <PreviewFooter />
    </div>
  );
}
