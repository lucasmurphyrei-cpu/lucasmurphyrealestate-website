import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBudgetState } from "./useBudgetState";
import { formatCurrency, formatPercent, PAY_FREQUENCY_LABELS } from "./calculations";
import type { BudgetTab } from "./types";

// Monthly components
import MonthlyIncomeSection from "./MonthlyIncomeSection";
import FixedCostsSection from "./FixedCostsSection";
import SubscriptionsSection from "./SubscriptionsSection";
import BudgetRuleSection from "./BudgetRuleSection";
import WhyFixedCostsSection from "./WhyFixedCostsSection";

// Annual components
import AnnualIncomeSection from "./AnnualIncomeSection";
import AnnualExpensesSection from "./AnnualExpensesSection";
import GuiltFreeSection from "./GuiltFreeSection";
import DebtSection from "./DebtSection";
import SavingsSection from "./SavingsSection";
import NetWorthSection from "./NetWorthSection";

// Shared
import LeadCaptureSection from "./LeadCaptureSection";

const BudgetPlanner = () => {
  const {
    state,
    derived,
    setTab,
    updateIncome,
    updateSavingsTarget,
    updateFixedCostRow,
    addFixedCostRow,
    removeFixedCostRow,
    addSubscription,
    removeSubscription,
    updateSubscription,
    updateAnnualIncome,
    updateAnnualExpenseRow,
    addAnnualExpenseRow,
    removeAnnualExpenseRow,
    toggleSplit,
    updateGuiltFreeRow,
    addGuiltFreeRow,
    removeGuiltFreeRow,
    updateDebtRow,
    addDebtRow,
    removeDebtRow,
    updateSavingsRow,
    addSavingsRow,
    removeSavingsRow,
    toggleNetWorth,
    updateAsset,
    updateLiability,
    importFromMonthly,
  } = useBudgetState();

  return (
    <main className="container px-4 sm:px-6 md:px-8 py-12 md:py-16 overflow-x-hidden">
      <h1 className="font-display text-3xl font-bold md:text-5xl">Budget Planner</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Map out your monthly costs or build a full annual budget.
        Enter your numbers below — everything updates in real time.
      </p>

      <Tabs
        value={state.tab}
        onValueChange={(v) => setTab(v as BudgetTab)}
        className="mt-8"
      >
        <TabsList className="w-full max-w-md">
          <TabsTrigger
            value="monthly"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Monthly Cost Estimator
          </TabsTrigger>
          <TabsTrigger
            value="annual"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Annual Budget Planner
          </TabsTrigger>
        </TabsList>

        {/* ─── Monthly Tab ─── */}
        <TabsContent value="monthly" className="overflow-visible">
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,380px] lg:items-start">
            <div className="space-y-6">
              <MonthlyIncomeSection
                income={state.monthly.income}
                derived={derived.monthly}
                onUpdate={updateIncome}
              />
              <FixedCostsSection
                fixedCosts={state.monthly.fixedCosts}
                derived={derived.monthly}
                onUpdateRow={updateFixedCostRow}
                onAddRow={addFixedCostRow}
                onRemoveRow={removeFixedCostRow}
              />
              <SubscriptionsSection
                subscriptions={state.monthly.yearlySubscriptions}
                derived={derived.monthly}
                onAdd={addSubscription}
                onRemove={removeSubscription}
                onUpdate={updateSubscription}
              />
              <BudgetRuleSection
                derived={derived.monthly}
                savingsTargetPercent={state.monthly.savingsTargetPercent}
                onSavingsTargetChange={updateSavingsTarget}
                onSwitchToAnnual={() => setTab("annual")}
              />
              <WhyFixedCostsSection />
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1 space-y-6">
              <MonthlySummaryCard derived={derived.monthly} payFrequency={state.monthly.income.payFrequency} />
              <LeadCaptureSection tab={state.tab} state={state} derived={derived} />
            </div>
          </div>
        </TabsContent>

        {/* ─── Annual Tab ─── */}
        <TabsContent value="annual" className="overflow-visible">
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,380px] lg:items-start">
            <div className="space-y-6">
              {/* Import from Monthly */}
              {derived.monthly.monthlyNet > 0 && (
                <div className="rounded-lg border border-primary/20 bg-primary/[0.03] p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Import from Monthly Cost Estimator</p>
                    <p className="text-xs text-muted-foreground">
                      Pull in your monthly net income ({formatCurrency(derived.monthly.monthlyNet)}) and fixed costs to get a head start.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0" onClick={importFromMonthly}>
                    Import Data
                  </Button>
                </div>
              )}
              <AnnualIncomeSection
                income={state.annual.income}
                onUpdate={updateAnnualIncome}
              />
              <AnnualExpensesSection
                expenses={state.annual.fixedExpenses}
                splitWithSpouse={state.annual.splitWithSpouse}
                onUpdateRow={updateAnnualExpenseRow}
                onAddRow={addAnnualExpenseRow}
                onRemoveRow={removeAnnualExpenseRow}
                onToggleSplit={toggleSplit}
              />
              <GuiltFreeSection
                rows={state.annual.guiltFree}
                derived={derived.annual}
                onUpdateRow={updateGuiltFreeRow}
                onAddRow={addGuiltFreeRow}
                onRemoveRow={removeGuiltFreeRow}
              />
              <DebtSection
                rows={state.annual.debt}
                onUpdateRow={updateDebtRow}
                onAddRow={addDebtRow}
                onRemoveRow={removeDebtRow}
              />
              <SavingsSection
                rows={state.annual.savings}
                derived={derived.annual}
                onUpdateRow={updateSavingsRow}
                onAddRow={addSavingsRow}
                onRemoveRow={removeSavingsRow}
              />
              <NetWorthSection
                showNetWorth={state.annual.showNetWorth}
                assets={state.annual.assets}
                liabilities={state.annual.liabilities}
                derived={derived.annual}
                onToggle={toggleNetWorth}
                onUpdateAsset={updateAsset}
                onUpdateLiability={updateLiability}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1 space-y-6">
              <AnnualSummaryCard derived={derived.annual} />
              <LeadCaptureSection tab={state.tab} state={state} derived={derived} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

// ─── Summary sidebar cards ───

function MonthlySummaryCard({ derived, payFrequency }: { derived: ReturnType<typeof import("./calculations").calcMonthly>; payFrequency: import("./types").PayFrequency }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">Monthly Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Row label="Monthly Net Income" value={formatCurrency(derived.monthlyNet)} />
        <Row label={`${PAY_FREQUENCY_LABELS[payFrequency]} Net`} value={formatCurrency(derived.paycheckNet)} muted />
        <Row label="Est. Tax Rate" value={formatPercent(derived.effectiveTaxRate)} muted />
        <hr className="border-border" />
        <Row label="Total Fixed Costs" value={formatCurrency(derived.totalFixedCosts)} />
        <Row label="Fixed Cost %" value={formatPercent(derived.actualFixedPercent)} muted />
        <hr className="border-border" />
        <Row
          label="Remaining"
          value={formatCurrency(derived.actualRemaining)}
          bold
          color={derived.actualRemaining >= 0 ? "text-emerald-500" : "text-red-500"}
        />
        {derived.yearlySubsTotal > 0 && (
          <>
            <hr className="border-border" />
            <Row label="Yearly Subs (monthly)" value={formatCurrency(derived.yearlySubsMonthly)} muted />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function AnnualSummaryCard({ derived }: { derived: ReturnType<typeof import("./calculations").calcAnnual> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">Budget Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Row label="Monthly Income" value={formatCurrency(derived.totalMonthlyIncome)} />
        <Row label="Fixed Expenses" value={formatCurrency(derived.totalFixedExpenses)} />
        <Row label="Guilt-Free" value={formatCurrency(derived.totalGuiltFree)} />
        <Row label="Debt Payments" value={formatCurrency(derived.totalDebt)} />
        <Row label="Savings & Investing" value={formatCurrency(derived.totalSavings)} />
        <hr className="border-border" />
        <Row
          label="Net Remaining"
          value={formatCurrency(derived.netMonthly)}
          bold
          color={derived.netMonthly >= 0 ? "text-emerald-500" : "text-red-500"}
        />
        <Row
          label="Savings Rate"
          value={formatPercent(derived.savingsRate)}
          muted
          color={derived.savingsRate >= 20 ? "text-emerald-500" : "text-amber-500"}
        />
      </CardContent>
    </Card>
  );
}

function Row({ label, value, bold, muted, color }: { label: string; value: string; bold?: boolean; muted?: boolean; color?: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className={muted ? "text-muted-foreground text-xs" : "text-muted-foreground"}>{label}</span>
      <span className={`${bold ? "text-lg font-bold" : "font-semibold"} ${color || ""}`}>{value}</span>
    </div>
  );
}

export default BudgetPlanner;
