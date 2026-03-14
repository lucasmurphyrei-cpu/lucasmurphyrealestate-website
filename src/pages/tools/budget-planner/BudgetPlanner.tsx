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
// NetWorthSection removed — will be its own standalone tool page

// Affordability
import AffordabilitySection from "./AffordabilitySection";

// Mortgage Calculator
import MortgageSection from "./MortgageSection";

// Shared
import LeadCaptureSection from "./LeadCaptureSection";
import StepIntro from "./StepIntro";

const BudgetPlanner = () => {
  const {
    state,
    derived,
    setTab,
    updateIncome,
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
    updateGuiltFreeRow,
    addGuiltFreeRow,
    removeGuiltFreeRow,
    updateDebtRow,
    updateSavingsRow,
    addSavingsRow,
    removeSavingsRow,
    updateAffordability,
    updateMortgageCalc,
  } = useBudgetState();

  return (
    <main className="container px-4 sm:px-6 md:px-8 py-12 md:py-16">
      <h1 className="font-display text-3xl font-bold md:text-5xl">How Much Home Can You Afford?</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Follow these 4 steps to understand your expenses, savings rate, purchasing power, and real monthly cost.
        Enter your numbers below — everything updates in real time.
      </p>

      <Tabs
        value={state.tab}
        onValueChange={(v) => setTab(v as BudgetTab)}
        className="mt-8"
      >
        <TabsList className="w-full max-w-3xl">
          <TabsTrigger
            value="monthly"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <span className="hidden sm:inline">Step 1: Fixed Expenses</span>
            <span className="sm:hidden">Step 1</span>
          </TabsTrigger>
          <TabsTrigger
            value="annual"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <span className="hidden sm:inline">Step 2: Spending & Savings</span>
            <span className="sm:hidden">Step 2</span>
          </TabsTrigger>
          <TabsTrigger
            value="affordability"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <span className="hidden sm:inline">Step 3: Affordability</span>
            <span className="sm:hidden">Step 3</span>
          </TabsTrigger>
          <TabsTrigger
            value="mortgage"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <span className="hidden sm:inline">Step 4: Mortgage</span>
            <span className="sm:hidden">Step 4</span>
          </TabsTrigger>
        </TabsList>

        {/* ─── Monthly Tab ─── */}
        <TabsContent value="monthly" className="overflow-visible">
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,380px] lg:items-start">
            <div className="space-y-6">
              <StepIntro step={1} title="Know Your Fixed Expenses">
                <p>
                  Fixed costs are the foundation of any budget. Knowing exactly what you owe each month — rent, utilities, insurance, debt payments — is the first step to understanding how much house you can afford.
                </p>
                <p>
                  Enter your income and fixed expenses below. Once you're done, move to Step 2 to understand your discretionary spending and savings rate.
                </p>
              </StepIntro>
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
                onSwitchToAnnual={() => { setTab("annual"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
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
              <StepIntro step={2} title="Guilt-Free Spending & How Much Can You Save">
                <p>
                  Now that you know your fixed costs, it's time to look at the full picture. Your <strong className="text-foreground">guilt-free spending</strong> — restaurants, entertainment, shopping, travel — is where most people overspend without realizing it.
                </p>
                <p>
                  The gap between your income and total spending is your <strong className="text-foreground">savings rate</strong>. That number determines how fast you can save for a down payment and how much house you can comfortably afford.
                </p>
              </StepIntro>
              {/* Sync note */}
              {derived.monthly.monthlyNet > 0 && (
                <div className="rounded-lg border border-primary/20 bg-primary/[0.03] px-4 py-3">
                  <p className="text-xs text-muted-foreground">
                    Your income ({formatCurrency(derived.monthly.monthlyNet)}/mo) and fixed expenses are synced from Step 1. Changes in Step 1 will update here automatically.
                  </p>
                </div>
              )}
              <AnnualIncomeSection
                income={state.annual.income}
                onUpdate={updateAnnualIncome}
              />
              <AnnualExpensesSection
                expenses={state.annual.fixedExpenses}
                onUpdateRow={updateAnnualExpenseRow}
                onAddRow={addAnnualExpenseRow}
                onRemoveRow={removeAnnualExpenseRow}
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
              />
              <SavingsSection
                rows={state.annual.savings}
                derived={derived.annual}
                downPaymentSaved={state.affordability.downPaymentSaved}
                onUpdateDownPaymentSaved={(v) => updateAffordability("downPaymentSaved", v)}
                onUpdateRow={updateSavingsRow}
                onAddRow={addSavingsRow}
                onRemoveRow={removeSavingsRow}
              />
              {/* CTA to Step 3 */}
              <Card className="border-emerald-500/20 bg-emerald-500/[0.03]">
                <CardContent className="py-5 space-y-2">
                  <p className="text-sm font-medium">Ready for Step 3?</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Now that you know your full spending picture and savings rate, see how much home you can actually afford under different lending philosophies — and how long it'll take to get there.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={() => { setTab("affordability"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  >
                    Continue to Step 3: How Much Home Can You Afford →
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1 space-y-6">
              <AnnualSummaryCard derived={derived.annual} />
              <LeadCaptureSection tab={state.tab} state={state} derived={derived} />
            </div>
          </div>
        </TabsContent>

        {/* ─── Affordability Tab ─── */}
        <TabsContent value="affordability" className="overflow-visible">
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,380px] lg:items-start">
            <div className="space-y-6">
              <StepIntro step={3} title="See How Much Home You Can Afford">
                <p>
                  Based on your income, debt, and savings from Steps 1 and 2, see your purchasing power under 4 different lending philosophies. The goal: <strong className="text-foreground">buy based on what you can comfortably afford, not what a lender will approve you for.</strong>
                </p>
                <p>
                  We'll also show you how long it'll take to save for your down payment and the unexpected costs first-time buyers often forget.
                </p>
              </StepIntro>
              {/* Sync note */}
              {derived.monthly.monthlyNet > 0 && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.03] px-4 py-3">
                  <p className="text-xs text-muted-foreground">
                    Income, debt, and savings are synced from Steps 1 & 2. Changes there will update here automatically.
                  </p>
                </div>
              )}
              <AffordabilitySection
                inputs={state.affordability}
                derived={derived.affordability}
                onUpdate={updateAffordability}
              />
              {/* CTA to Step 4 */}
              {derived.affordability.philosophies.conventional.maxHomePrice > 0 && (
                <Card className="border-primary/20 bg-primary/[0.03]">
                  <CardContent className="py-5 space-y-2">
                    <p className="text-sm font-medium">Found a home you like?</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Plug in a specific purchase price in Step 4 to see exactly how the mortgage fits your budget — and what you'll have left for savings and guilt-free spending.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 text-xs"
                      onClick={() => { setTab("mortgage"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    >
                      Continue to Step 4: Mortgage Calculator →
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1 space-y-6">
              <AffordabilitySummaryCard derived={derived.affordability} loanTerm={state.affordability.loanTerm} interestRate={state.affordability.interestRate} />
              <LeadCaptureSection tab={state.tab} state={state} derived={derived} />
            </div>
          </div>
        </TabsContent>

        {/* ─── Mortgage Calculator Tab ─── */}
        <TabsContent value="mortgage" className="overflow-visible">
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,380px] lg:items-start">
            <div className="space-y-6">
              <StepIntro step={4} title="Run Your Mortgage Scenario">
                <p>
                  You know what you can afford — now plug in a specific home price and see exactly how the mortgage fits your monthly budget. Adjust the down payment, interest rate, and taxes to run different scenarios.
                </p>
                <p>
                  This calculator shows you the <strong className="text-foreground">full picture</strong>: your monthly payment breakdown, how your savings and guilt-free spending change, and the hidden costs to plan for after closing.
                </p>
              </StepIntro>
              {/* Sync note */}
              {derived.monthly.monthlyNet > 0 && (
                <div className="rounded-lg border border-primary/20 bg-primary/[0.03] px-4 py-3">
                  <p className="text-xs text-muted-foreground">
                    Down payment, loan settings, and budget data are synced from Steps 1-3. Changes there will update here automatically.
                  </p>
                </div>
              )}
              <MortgageSection
                inputs={state.mortgageCalc}
                derived={derived.mortgageCalc}
                onUpdate={updateMortgageCalc}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1 space-y-6">
              <MortgageSummaryCard derived={derived.mortgageCalc} loanTerm={state.mortgageCalc.loanTerm} interestRate={state.mortgageCalc.interestRate} />
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

function AffordabilitySummaryCard({ derived, loanTerm, interestRate }: { derived: ReturnType<typeof import("./calculations").calcAffordability>; loanTerm: number; interestRate: number }) {
  const p = derived.philosophies;
  const hasData = p.conventional.maxHomePrice > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">Affordability Summary</CardTitle>
        <p className="text-xs text-muted-foreground">{loanTerm}-year fixed at {interestRate}%</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Row label="Dave Ramsey (15yr)" value={hasData ? formatCurrency(p.ramsey.maxHomePrice) : "$0.00"} muted />
        <Row
          label="28/36 Rule"
          value={hasData ? formatCurrency(p.conventional.maxHomePrice) : "$0.00"}
          bold
          color={hasData ? "text-blue-600" : undefined}
        />
        <Row label="FHA Guidelines" value={hasData ? formatCurrency(p.fha.maxHomePrice) : "$0.00"} muted />
        <Row label="Aggressive" value={hasData ? formatCurrency(p.aggressive.maxHomePrice) : "$0.00"} muted />
        {hasData && (
          <>
            <hr className="border-border" />
            <p className="text-[10px] text-muted-foreground">
              The 28/36 Rule (highlighted) is the most commonly recommended guideline for sustainable homeownership.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function MortgageSummaryCard({ derived, loanTerm, interestRate }: { derived: ReturnType<typeof import("./calculations").calcMortgage>; loanTerm: number; interestRate: number }) {
  const hasData = derived.totalMonthlyPayment > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">Mortgage Summary</CardTitle>
        {hasData && <p className="text-xs text-muted-foreground">{loanTerm}-year fixed at {interestRate}%</p>}
      </CardHeader>
      <CardContent className="space-y-3">
        {hasData ? (
          <>
            <Row
              label="Monthly Payment"
              value={formatCurrency(derived.totalMonthlyPayment)}
              bold
            />
            <Row label="Principal & Interest" value={formatCurrency(derived.monthlyPI)} muted />
            <Row label="Taxes & Insurance" value={formatCurrency(derived.monthlyTaxes + derived.monthlyInsurance)} muted />
            {derived.monthlyPMI > 0 && <Row label="PMI" value={formatCurrency(derived.monthlyPMI)} muted />}
            {derived.monthlyHOA > 0 && <Row label="HOA" value={formatCurrency(derived.monthlyHOA)} muted />}
            <hr className="border-border" />
            <Row
              label="Remaining Budget"
              value={formatCurrency(derived.remainingAfterMortgage)}
              bold
              color={derived.remainingAfterMortgage >= 0 ? "text-emerald-500" : "text-red-500"}
            />
            <Row label="Down Payment" value={`${formatPercent(derived.downPaymentPercent)}`} muted />
          </>
        ) : (
          <p className="text-xs text-muted-foreground">Enter a purchase price to see your mortgage breakdown.</p>
        )}
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
