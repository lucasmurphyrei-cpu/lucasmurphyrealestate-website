import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useHouseHackState } from "./house-hack/useHouseHackState";
import type { PropertyType, AnalysisMode } from "./house-hack/types";
import InvestmentSection from "./house-hack/InvestmentSection";
import IncomeSection from "./house-hack/IncomeSection";
import ExpensesSection from "./house-hack/ExpensesSection";
import ReturnsSection from "./house-hack/ReturnsSection";
import ReservesSection from "./house-hack/ReservesSection";
import HouseHackVsRentingSection from "./house-hack/HouseHackVsRentingSection";
import LeadCaptureSection from "./house-hack/LeadCaptureSection";
import PropertySearchSection from "./house-hack/PropertySearchSection";
import FeedbackSection from "./house-hack/FeedbackSection";

const PROPERTY_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: "duplex", label: "Duplex (2 Units)" },
  { value: "triplex", label: "Triplex (3 Units)" },
  { value: "fourplex", label: "Fourplex (4 Units)" },
];

const HouseHackCalculator = () => {
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

  // Tax Calculator county selection state
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

  // Scroll-to-income + highlight state
  const [pendingScrollToIncome, setPendingScrollToIncome] = useState(false);
  const [highlightUnits, setHighlightUnits] = useState(false);

  const handleCountySelect = useCallback((countyKey: string, monthlyTax: number) => {
    setSelectedCounty(countyKey);
    updateInvestment("monthlyTaxes", monthlyTax);
  }, [updateInvestment]);

  const handleTaxManualChange = useCallback(() => {
    setSelectedCounty(null);
  }, []);

  const handleSwitchToAllUnits = useCallback(() => {
    setMode("all-units-rented");
    setPendingScrollToIncome(true);
    setHighlightUnits(true);
  }, [setMode]);

  // Scroll to income section after tab switch renders
  useEffect(() => {
    if (pendingScrollToIncome) {
      const timer = setTimeout(() => {
        document.getElementById("all-units-income-section")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        setPendingScrollToIncome(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pendingScrollToIncome]);

  // Auto-clear highlight after 3 seconds
  useEffect(() => {
    if (highlightUnits) {
      const timer = setTimeout(() => setHighlightUnits(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightUnits]);

  return (
    <main className="container py-12 md:py-16">
      <h1 className="font-display text-3xl font-bold md:text-5xl">House Hack Deal Analysis</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Analyze a multi-unit property to see your true housing cost, cash flow, and investment returns.
        Enter your deal numbers below — results update in real time.
      </p>

      {/* Property Type Selector */}
      <div className="mt-8 flex flex-wrap gap-2">
        {PROPERTY_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={state.propertyType === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => setPropertyType(opt.value)}
            className={
              state.propertyType === opt.value
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : ""
            }
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* Analysis Mode Tabs */}
      <Tabs
        value={state.mode}
        onValueChange={(v) => setMode(v as AnalysisMode)}
        className="mt-6"
      >
        <TabsList className="w-full max-w-md">
          <TabsTrigger
            value="owner-occupied"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Living In One Unit
          </TabsTrigger>
          <TabsTrigger
            value="all-units-rented"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All Units Rented Out
          </TabsTrigger>
        </TabsList>

        <TabsContent value="owner-occupied">
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,380px]">
            {/* Main Column — all steps stacked */}
            <div className="space-y-6">
              <InvestmentSection
                investment={state.investment}
                derived={derived.investment}
                onUpdate={updateInvestment}
                selectedCounty={selectedCounty}
                onCountySelect={handleCountySelect}
                onTaxManualChange={handleTaxManualChange}
              />
              <IncomeSection
                mode="owner-occupied"
                propertyType={state.propertyType}
                income={state.ownerOccupiedIncome}
                derived={derived.income}
                onUpdate={updateOwnerIncome}
              />
              <ExpensesSection
                mode="owner-occupied"
                expenses={state.ownerOccupiedExpenses}
                derived={derived.expenses}
                monthlyPITI={derived.investment.monthlyPITI}
                purchasePrice={state.investment.purchasePrice}
                grossMonthlyIncome={derived.income.grossMonthlyIncome}
                onUpdate={updateOwnerExpenses}
              />
              <ReturnsSection
                mode="owner-occupied"
                financingType={state.investment.financingType}
                ownerReturns={derived.ownerOccupiedReturns}
                allUnitsReturns={derived.allUnitsReturns}
                ownerExtras={state.ownerOccupiedExtras}
                allUnitsExtras={state.allUnitsExtras}
                onUpdateOwnerExtras={updateOwnerExtras}
                onUpdateAllUnitsExtras={updateAllUnitsExtras}
              />
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
              <ReservesSection
                reserves={derived.reserves}
                expenses={state.ownerOccupiedExpenses}
                expensesDerived={derived.expenses}
              />
            </div>

            {/* Sidebar — sticky, independently scrollable */}
            <div className="lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1 space-y-6">
              <PropertySearchSection
                propertyType={state.propertyType}
                purchasePrice={state.investment.purchasePrice}
              />
              <LeadCaptureSection
                propertyType={state.propertyType}
                investment={state.investment}
                state={state}
                derived={derived}
              />
              <FeedbackSection />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="all-units-rented">
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,380px]">
            {/* Main Column — all steps stacked */}
            <div className="space-y-6">
              <InvestmentSection
                investment={state.investment}
                derived={derived.investment}
                onUpdate={updateInvestment}
                selectedCounty={selectedCounty}
                onCountySelect={handleCountySelect}
                onTaxManualChange={handleTaxManualChange}
              />
              <IncomeSection
                id="all-units-income-section"
                mode="all-units-rented"
                propertyType={state.propertyType}
                income={state.allUnitsIncome}
                derived={derived.income}
                onUpdate={updateAllUnitsIncome}
                highlightUnits={highlightUnits}
              />
              <ExpensesSection
                mode="all-units-rented"
                expenses={state.allUnitsExpenses}
                derived={derived.expenses}
                monthlyPITI={derived.investment.monthlyPITI}
                purchasePrice={state.investment.purchasePrice}
                grossMonthlyIncome={derived.income.grossMonthlyIncome}
                onUpdate={updateAllUnitsExpenses}
              />
              <ReturnsSection
                mode="all-units-rented"
                financingType={state.investment.financingType}
                ownerReturns={derived.ownerOccupiedReturns}
                allUnitsReturns={derived.allUnitsReturns}
                ownerExtras={state.ownerOccupiedExtras}
                allUnitsExtras={state.allUnitsExtras}
                onUpdateOwnerExtras={updateOwnerExtras}
                onUpdateAllUnitsExtras={updateAllUnitsExtras}
              />
            </div>

            {/* Sidebar — sticky, independently scrollable */}
            <div className="lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1 space-y-6">
              <PropertySearchSection
                propertyType={state.propertyType}
                purchasePrice={state.investment.purchasePrice}
              />
              <LeadCaptureSection
                propertyType={state.propertyType}
                investment={state.investment}
                state={state}
                derived={derived}
              />
              <FeedbackSection />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default HouseHackCalculator;
