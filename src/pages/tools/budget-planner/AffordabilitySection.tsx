import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { AffordabilityInputs, AffordabilityDerived, PhilosophyResult, LoanTerm } from "./types";
import { formatCurrency, formatPercent, calcSavingsTimeline } from "./calculations";
import { FormattedCurrencyInput, FormattedPercentInput } from "./FormattedInput";

interface Props {
  inputs: AffordabilityInputs;
  derived: AffordabilityDerived;
  onUpdate: <K extends keyof AffordabilityInputs>(key: K, value: AffordabilityInputs[K]) => void;
}

const PHILOSOPHY_COLORS: Record<string, { border: string; bg: string; badge: string; text: string }> = {
  ramsey: { border: "border-emerald-500/30", bg: "bg-emerald-500/5", badge: "bg-emerald-500/10 text-emerald-700", text: "text-emerald-600" },
  conventional: { border: "border-blue-500/30", bg: "bg-blue-500/5", badge: "bg-blue-500/10 text-blue-700", text: "text-blue-600" },
  fha: { border: "border-amber-500/30", bg: "bg-amber-500/5", badge: "bg-amber-500/10 text-amber-700", text: "text-amber-600" },
  aggressive: { border: "border-red-500/30", bg: "bg-red-500/5", badge: "bg-red-500/10 text-red-700", text: "text-red-600" },
};

const PHILOSOPHY_TAGS: Record<string, string> = {
  ramsey: "Ultra-Conservative",
  conventional: "Recommended",
  fha: "Government Standard",
  aggressive: "Maximum Stretch",
};

function PhilosophyCard({ result, colorKey }: { result: PhilosophyResult; colorKey: string }) {
  const colors = PHILOSOPHY_COLORS[colorKey];
  const tag = PHILOSOPHY_TAGS[colorKey];
  const hasIncome = result.maxHomePrice > 0;

  return (
    <Card className={`${colors.border} ${colors.bg} transition-all hover:shadow-md`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-display">{result.label}</CardTitle>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${colors.badge}`}>
            {tag}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{result.description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Max Home Price */}
        <div className="text-center py-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Max Home Price</p>
          <p className={`mt-1 text-2xl font-bold font-display ${hasIncome ? colors.text : "text-muted-foreground"}`}>
            {hasIncome ? formatCurrency(result.maxHomePrice) : "$0.00"}
          </p>
        </div>

        {hasIncome && (
          <>
            {/* Down payment for this card */}
            <div className="flex justify-between text-xs px-1">
              <span className="text-muted-foreground">Down Payment ({formatPercent(result.downPaymentPercent)})</span>
              <span className="font-semibold">{formatCurrency(result.downPaymentAmount)}</span>
            </div>

            {/* Monthly breakdown */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Principal & Interest</span>
                <span className="font-semibold text-xs">{formatCurrency(result.monthlyPI)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Property Taxes</span>
                <span className="font-semibold text-xs">{formatCurrency(result.monthlyTaxes)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Home Insurance</span>
                <span className="font-semibold text-xs">{formatCurrency(result.monthlyInsurance)}</span>
              </div>
              {result.monthlyPMI > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs">PMI</span>
                  <span className="font-semibold text-xs">{formatCurrency(result.monthlyPMI)}</span>
                </div>
              )}
              <hr className="border-border" />
              <div className="flex justify-between">
                <span className="font-medium text-xs">Total Monthly</span>
                <span className="font-bold">{formatCurrency(result.totalMonthlyHousing)}</span>
              </div>
            </div>

            {/* DTI & loan info */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="rounded-md bg-background/60 p-2 text-center">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Front-End DTI</p>
                <p className="text-xs font-semibold">{formatPercent(result.frontEndDTI)}</p>
              </div>
              <div className="rounded-md bg-background/60 p-2 text-center">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Back-End DTI</p>
                <p className="text-xs font-semibold">{formatPercent(result.backEndDTI)}</p>
              </div>
            </div>

            {/* Loan details */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Loan Amount</span>
                <span className="font-semibold">{formatCurrency(result.maxLoanAmount)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total Interest Paid</span>
                <span className="font-semibold">{formatCurrency(result.totalInterestPaid)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total Cost Over Life</span>
                <span className="font-semibold">{formatCurrency(result.totalCostOverLife)}</span>
              </div>
            </div>

            {/* Ramsey 15yr note */}
            {colorKey === "ramsey" && (
              <p className="text-[10px] text-emerald-600 bg-emerald-500/10 rounded px-2 py-1">
                Ramsey recommends a 15-year fixed mortgage. This calculation uses 15yr regardless of your selected term.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

const DOWN_PAYMENT_PRESETS = [
  { label: "3.5%", value: 3.5, note: "FHA Minimum" },
  { label: "5%", value: 5, note: "Conv. Minimum" },
  { label: "10%", value: 10, note: "" },
  { label: "20%", value: 20, note: "No PMI" },
];

const AffordabilitySection = ({ inputs, derived, onUpdate }: Props) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [timelinePhilosophy, setTimelinePhilosophy] = useState<keyof typeof derived.philosophies>("conventional");
  const hasIncome = inputs.annualGrossIncome > 0 || inputs.annualNetIncome > 0;
  const hasDownPayment = inputs.downPaymentPercent > 0;

  return (
    <div className="space-y-6">
      {/* Down Payment — first question */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg font-display">How much are you planning to put down?</CardTitle>
          <p className="text-xs text-muted-foreground">
            Your down payment percentage directly affects your max home price, monthly payment, and whether you'll pay PMI.
            Choose a target below — all affordability numbers are based on this.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preset buttons */}
          <div className="grid grid-cols-4 gap-2">
            {DOWN_PAYMENT_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => onUpdate("downPaymentPercent", preset.value)}
                className={`rounded-lg border p-3 text-center transition-all hover:shadow-sm ${
                  inputs.downPaymentPercent === preset.value
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <p className="text-lg font-bold font-display">{preset.label}</p>
                {preset.note && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">{preset.note}</p>
                )}
              </button>
            ))}
          </div>

          {/* Custom percentage input */}
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <FormattedPercentInput
                label="Or enter a custom percentage"
                value={inputs.downPaymentPercent}
                onChange={(v) => onUpdate("downPaymentPercent", Math.min(v, 99))}
                step={0.5}
              />
            </div>
          </div>

          {hasDownPayment && (
            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
              <p className="text-xs text-muted-foreground">
                At <strong className="text-foreground">{formatPercent(inputs.downPaymentPercent)} down</strong>,
                {inputs.downPaymentPercent < 20
                  ? " you'll pay PMI (Private Mortgage Insurance) until you reach 20% equity. PMI typically costs 0.3-1.5% of the loan annually."
                  : " you won't pay PMI — that's the ideal threshold for keeping monthly costs lower."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Income */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Your Income</CardTitle>
          <p className="text-xs text-muted-foreground">
            Enter both gross and net income. Different affordability rules use different income measures.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormattedCurrencyInput
              label="Annual Gross Income"
              value={inputs.annualGrossIncome}
              onChange={(v) => onUpdate("annualGrossIncome", v)}
              helpText="Before taxes. Used by 28/36, FHA, and Aggressive rules."
            />
            <FormattedCurrencyInput
              label="Annual Net (Take-Home) Income"
              value={inputs.annualNetIncome}
              onChange={(v) => onUpdate("annualNetIncome", v)}
              helpText="After taxes. Used by Dave Ramsey's rule."
            />
          </div>

          {hasIncome && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Monthly Gross</p>
                <p className="mt-1 text-sm font-semibold">{formatCurrency(derived.monthlyGross)}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Monthly Net</p>
                <p className="mt-1 text-sm font-semibold">{formatCurrency(derived.monthlyNet)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debt */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Existing Debt</CardTitle>
          <p className="text-xs text-muted-foreground">
            Existing debt affects how much lenders will approve. This is synced from your debt payments in Steps 1 & 2.
          </p>
        </CardHeader>
        <CardContent>
          <FormattedCurrencyInput
            label="Monthly Existing Debt Payments"
            value={inputs.monthlyDebtPayments}
            onChange={(v) => onUpdate("monthlyDebtPayments", v)}
            helpText="Car payments, student loans, credit cards, etc."
          />
        </CardContent>
      </Card>

      {/* Loan Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Loan Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormattedPercentInput
              label="Interest Rate"
              value={inputs.interestRate}
              onChange={(v) => onUpdate("interestRate", v)}
              step={0.125}
              helpText="Current average is around 6.5-7%."
            />
            <div className="space-y-1">
              <Label className="text-sm">Loan Term</Label>
              <div className="flex gap-2">
                {([15, 30] as LoanTerm[]).map((term) => (
                  <Button
                    key={term}
                    variant={inputs.loanTerm === term ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUpdate("loanTerm", term)}
                    className="flex-1"
                  >
                    {term}-Year Fixed
                  </Button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Dave Ramsey's rule always uses 15-year regardless of this setting.
              </p>
            </div>
          </div>

          {/* Advanced settings */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-primary hover:underline transition-colors"
          >
            {showAdvanced ? "Hide" : "Show"} advanced settings (property tax, insurance, PMI)
          </button>

          {showAdvanced && (
            <div className="rounded-lg border border-border p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormattedPercentInput
                  label="Property Tax Rate"
                  value={inputs.propertyTaxRate}
                  onChange={(v) => onUpdate("propertyTaxRate", v)}
                  helpText="Annual % of home value."
                />
                <FormattedCurrencyInput
                  label="Home Insurance (Annual)"
                  value={inputs.homeInsuranceAnnual}
                  onChange={(v) => onUpdate("homeInsuranceAnnual", v)}
                />
                <FormattedPercentInput
                  label="PMI Rate"
                  value={inputs.pmiRate}
                  onChange={(v) => onUpdate("pmiRate", v)}
                  helpText="Applied if down payment < 20%."
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Philosophy Comparison — only shown after down payment is entered */}
      {hasDownPayment && hasIncome ? (
        <div>
          <h2 className="text-xl font-display font-bold mb-1">How Much House Can You Afford?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Four popular approaches to housing affordability — assuming <strong className="text-foreground">{formatPercent(inputs.downPaymentPercent)} down payment</strong>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PhilosophyCard result={derived.philosophies.ramsey} colorKey="ramsey" />
            <PhilosophyCard result={derived.philosophies.conventional} colorKey="conventional" />
            <PhilosophyCard result={derived.philosophies.fha} colorKey="fha" />
            <PhilosophyCard result={derived.philosophies.aggressive} colorKey="aggressive" />
          </div>
        </div>
      ) : (
        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground text-sm">
              {!hasDownPayment && !hasIncome
                ? "Enter your down payment percentage and income above to see how much house you can afford."
                : !hasDownPayment
                  ? "Choose a down payment percentage above to unlock your affordability breakdown."
                  : "Enter your income above to see how much house you can afford."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* How Far Out Are You? */}
      {hasIncome && hasDownPayment && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">How Far Out Are You?</CardTitle>
            <p className="text-xs text-muted-foreground">
              Based on your current savings and monthly saving rate, here's how long it could take to reach
              your {formatPercent(inputs.downPaymentPercent)} down payment target.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormattedCurrencyInput
                label="How much have you already saved?"
                value={inputs.downPaymentSaved}
                onChange={(v) => onUpdate("downPaymentSaved", v)}
                helpText="Cash currently saved toward your down payment."
              />
              <FormattedCurrencyInput
                label="How much can you save per month?"
                value={inputs.monthlySavingsForHome}
                onChange={(v) => onUpdate("monthlySavingsForHome", v)}
                helpText="Synced from your Monthly Savings (Downpayment) in Step 2."
              />
            </div>

            {(() => {
              const philosophyOptions = [
                { key: "conventional" as const, label: "28/36 Rule (Recommended)" },
                { key: "ramsey" as const, label: "Dave Ramsey" },
                { key: "fha" as const, label: "FHA Guidelines" },
                { key: "aggressive" as const, label: "Aggressive / Stretch" },
              ];
              const selectedPhilosophy = derived.philosophies[timelinePhilosophy];
              if (selectedPhilosophy.maxHomePrice <= 0) return null;

              const targetDP = selectedPhilosophy.downPaymentAmount;
              const remaining = Math.max(0, targetDP - inputs.downPaymentSaved);
              const monthsToGoal = inputs.monthlySavingsForHome > 0
                ? Math.ceil(remaining / inputs.monthlySavingsForHome)
                : null;

              return (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <p className="text-xs text-muted-foreground flex-1">
                      Down payment needed for a <strong className="text-foreground">{formatCurrency(selectedPhilosophy.maxHomePrice)}</strong> home at {formatPercent(inputs.downPaymentPercent)} down:
                    </p>
                    <select
                      value={timelinePhilosophy}
                      onChange={(e) => setTimelinePhilosophy(e.target.value as keyof typeof derived.philosophies)}
                      className="h-8 rounded-md border border-border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {philosophyOptions.map((opt) => (
                        <option key={opt.key} value={opt.key}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Down payment needed ({formatPercent(inputs.downPaymentPercent)})</span>
                      <span className="font-semibold">{formatCurrency(targetDP)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Already saved</span>
                      <span className="font-semibold">{formatCurrency(inputs.downPaymentSaved)}</span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Still needed</span>
                      <span className={`font-bold ${remaining <= 0 ? "text-emerald-500" : ""}`}>
                        {remaining <= 0 ? "You're there!" : formatCurrency(remaining)}
                      </span>
                    </div>
                    {remaining > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Time to goal</span>
                        <span className="font-semibold">
                          {monthsToGoal === null
                            ? "Enter monthly savings above"
                            : monthsToGoal <= 0
                              ? "Ready!"
                              : `~${monthsToGoal} month${monthsToGoal > 1 ? "s" : ""} (${(monthsToGoal / 12).toFixed(1)} yrs)`}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}

            {inputs.monthlySavingsForHome > 0 && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Tip:</strong> Even saving an extra $100-200/month can shave months off your timeline. Review your
                guilt-free spending from Step 2 — small cuts to dining out, subscriptions, or entertainment add up fast.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Unexpected Costs */}
      <Card className="border-amber-500/20 bg-amber-500/[0.02]">
        <CardHeader>
          <CardTitle className="text-lg font-display">Costs First-Time Buyers Often Forget</CardTitle>
          <p className="text-xs text-muted-foreground">
            Your down payment isn't the only upfront cost. Factor these into your savings plan so there are no surprises at closing.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {[
              { label: "Closing Costs", detail: "2-5% of purchase price. On a $300K home, that's $6,000-$15,000." },
              { label: "Home Inspection", detail: "$300-$500. Non-negotiable — this protects you from hidden problems." },
              { label: "Moving Costs", detail: "$1,000-$5,000+ depending on distance and how much help you need." },
              { label: "Immediate Repairs & Furnishing", detail: "Budget $2,000-$5,000+ for things the previous owner didn't fix and furniture for new rooms." },
              { label: "The 1% Rule (Annual Maintenance)", detail: "Set aside 1% of your home's value per year for maintenance and repairs. $300K home = $3,000/year ($250/month)." },
              { label: "Emergency Fund", detail: "Keep 3-6 months of your new mortgage payment in savings. If your mortgage is $2,000/mo, that's $6,000-$12,000." },
            ].map(({ label, detail }) => (
              <div key={label} className="rounded-md bg-background/60 p-3">
                <p className="text-xs font-semibold">{label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{detail}</p>
              </div>
            ))}
          </div>

          <div className="rounded-md bg-muted/50 p-3 space-y-1.5">
            <p className="text-xs font-semibold">Helpful Resources</p>
            <p className="text-xs text-muted-foreground">
              <Link to="/guides/first-time-home-buyers" className="text-primary hover:underline font-medium">First-Time Home Buyer's Guide</Link> — Complete walkthrough of the buying process.
            </p>
            <p className="text-xs text-muted-foreground">
              <Link to="/tools/investor-spreadsheets" className="text-primary hover:underline font-medium">CapEx Calculator for First-Time Buyers</Link> — Plan for long-term maintenance costs.
            </p>
            <p className="text-xs text-muted-foreground">
              <Link to="/tools/mortgage-calculator" className="text-primary hover:underline font-medium">Mortgage Calculator</Link> — Run different scenarios for your monthly payment.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Educational callout */}
      <Card className="border-primary/20 bg-primary/[0.03]">
        <CardContent className="py-5">
          <h3 className="font-display font-bold text-sm mb-2">Understanding DTI (Debt-to-Income Ratio)</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            <strong>Front-end DTI</strong> measures housing costs as a percentage of your gross monthly income.
            <strong> Back-end DTI</strong> includes all debt payments (housing + car loans, student loans, credit cards, etc.).
            Lenders use these ratios to determine how much you can safely borrow. Lower DTI = less financial stress and easier loan approval.
          </p>
          <div className="rounded-md bg-muted/50 p-3 space-y-1.5 text-xs">
            <p><strong>Dave Ramsey:</strong> Keep housing at 25% of take-home pay on a 15-year mortgage. Pay off debt first, save 20% down. Most conservative approach — minimizes financial stress.</p>
            <p><strong>28/36 Rule:</strong> The standard guideline most financial advisors recommend. Balances homeownership with other financial goals.</p>
            <p><strong>FHA Guidelines:</strong> Government-backed loans allow higher DTI ratios, making homeownership accessible to more buyers. Popular for first-time buyers.</p>
            <p><strong>Aggressive:</strong> Some lenders will approve higher ratios, but this leaves less room for savings, emergencies, and lifestyle. Proceed with caution.</p>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Want personalized advice? <strong>Call Lucas Murphy at (414) 458-1952</strong> to discuss your specific situation and find the right home for your budget.
          </p>
        </CardContent>
      </Card>

      {/* Inline Download CTA */}
      <Card className="border-primary/30 bg-primary/[0.04]">
        <CardContent className="py-6 text-center space-y-3">
          <h3 className="font-display font-bold text-lg">Track Your Real Spending</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
            The numbers above are only as good as the data you put in. <strong className="text-foreground">Download my free budget spreadsheet</strong> and
            track your actual spending for 2-3 months. Entering your real numbers at the end of each month helps you see exactly where your money
            goes — and where you can cut back to save faster for your home.
          </p>
          <p className="text-xs text-muted-foreground max-w-lg mx-auto">
            Knowing your monthly averages for each spending category gives you confidence when purchasing a home based on
            what <em>you</em> can afford — not just what a lender is willing to lend you.
          </p>
          <Button
            className="mt-2"
            onClick={() => {
              const el = document.getElementById("lead-capture");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Download My Free Budget Spreadsheet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffordabilitySection;
