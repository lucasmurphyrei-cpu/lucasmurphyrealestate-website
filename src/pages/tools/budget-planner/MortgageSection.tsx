import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import type { MortgageCalcInputs, MortgageCalcDerived, LoanTerm, MortgageLoanType, WisconsinCounty, DownPaymentMode } from "./types";
import { formatCurrency, formatPercent } from "./calculations";
import { FormattedCurrencyInput, FormattedPercentInput } from "./FormattedInput";

interface Props {
  inputs: MortgageCalcInputs;
  derived: MortgageCalcDerived;
  onUpdate: <K extends keyof MortgageCalcInputs>(key: K, value: MortgageCalcInputs[K]) => void;
}

const COUNTY_TAX_RATES: Record<Exclude<WisconsinCounty, "custom">, { label: string; rate: number }> = {
  milwaukee: { label: "Milwaukee County", rate: 2.27 },
  waukesha: { label: "Waukesha County", rate: 1.72 },
  washington: { label: "Washington County", rate: 1.76 },
  ozaukee: { label: "Ozaukee County", rate: 1.85 },
};

const MortgageSection = ({ inputs, derived, onUpdate }: Props) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const hasPrice = inputs.purchasePrice > 0;

  const handleCountyChange = (county: WisconsinCounty) => {
    onUpdate("county", county);
    if (county !== "custom") {
      onUpdate("propertyTaxRate", COUNTY_TAX_RATES[county].rate);
    }
  };

  const handleLoanTypeChange = (loanType: MortgageLoanType) => {
    onUpdate("loanType", loanType);
    if (loanType === "fha") {
      onUpdate("pmiRate", 0.55);
      // FHA minimum 3.5% down
      if (inputs.downPaymentMode === "percent" && inputs.downPaymentPercent < 3.5) {
        onUpdate("downPaymentPercent", 3.5);
      }
    } else {
      onUpdate("pmiRate", 0.5);
    }
  };

  const handleDownPaymentModeChange = (mode: DownPaymentMode) => {
    onUpdate("downPaymentMode", mode);
    // Sync values when switching modes
    if (mode === "dollar" && inputs.purchasePrice > 0) {
      onUpdate("downPaymentAmount", Math.round(inputs.purchasePrice * (inputs.downPaymentPercent / 100)));
    } else if (mode === "percent" && inputs.purchasePrice > 0) {
      onUpdate("downPaymentPercent", Math.round((inputs.downPaymentAmount / inputs.purchasePrice) * 1000) / 10);
    }
  };

  const minDown = inputs.loanType === "fha" ? 3.5 : 3;

  return (
    <div className="space-y-6">
      {/* Purchase Price & Down Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Your Home Purchase</CardTitle>
          <p className="text-xs text-muted-foreground">
            Enter the purchase price of the home you're considering. Adjust down payment and loan settings to see how the mortgage fits your budget.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormattedCurrencyInput
            label="Purchase Price"
            value={inputs.purchasePrice}
            onChange={(v) => onUpdate("purchasePrice", v)}
            placeholder="300,000"
            helpText="The listing price or your target purchase price."
          />

          {/* Down Payment Mode Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Down Payment</Label>
              <div className="flex rounded-md border border-border overflow-hidden">
                {(["percent", "dollar"] as DownPaymentMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleDownPaymentModeChange(mode)}
                    className={`px-3 py-1 text-xs transition-colors ${
                      inputs.downPaymentMode === mode
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {mode === "percent" ? "%" : "$"}
                  </button>
                ))}
              </div>
            </div>
            {inputs.downPaymentMode === "percent" ? (
              <FormattedPercentInput
                value={inputs.downPaymentPercent}
                onChange={(v) => onUpdate("downPaymentPercent", v)}
                helpText={inputs.purchasePrice > 0
                  ? `${formatCurrency(inputs.purchasePrice * (inputs.downPaymentPercent / 100))} down on a ${formatCurrency(inputs.purchasePrice)} home. Min ${minDown}% for ${inputs.loanType === "fha" ? "FHA" : "conventional"}.`
                  : `Enter a purchase price above. Min ${minDown}% for ${inputs.loanType === "fha" ? "FHA" : "conventional"}.`}
              />
            ) : (
              <FormattedCurrencyInput
                value={inputs.downPaymentAmount}
                onChange={(v) => onUpdate("downPaymentAmount", v)}
                helpText={inputs.purchasePrice > 0
                  ? `${formatPercent(derived.downPaymentPercent)} of purchase price. Min ${minDown}% for ${inputs.loanType === "fha" ? "FHA" : "conventional"}.`
                  : "Synced from your savings in Step 3."}
              />
            )}
          </div>

          <FormattedCurrencyInput
            label="HOA / Condo Fees (Monthly)"
            value={inputs.hoaMonthly}
            onChange={(v) => onUpdate("hoaMonthly", v)}
            helpText="Monthly homeowners association or condo fees, if any."
          />
        </CardContent>
      </Card>

      {/* Loan Type & County */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Loan Settings</CardTitle>
          <p className="text-xs text-muted-foreground">
            Choose your loan type and county to auto-fill local tax rates and mortgage insurance.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Loan Type */}
          <div className="space-y-1">
            <Label className="text-sm">Loan Type</Label>
            <div className="flex gap-2">
              {([
                { type: "conventional" as MortgageLoanType, label: "Conventional", desc: "3-5% min down, PMI until 20% equity" },
                { type: "fha" as MortgageLoanType, label: "FHA", desc: "3.5% min down, MIP for life of loan" },
              ]).map(({ type, label, desc }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleLoanTypeChange(type)}
                  className={`flex-1 rounded-lg border p-3 text-left transition-all ${
                    inputs.loanType === type
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <span className="text-sm font-semibold">{label}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
            {inputs.loanType === "fha" && (
              <p className="text-[10px] text-amber-600 bg-amber-500/10 rounded px-2 py-1">
                FHA loans require mortgage insurance (MIP) for the life of the loan, regardless of equity. Annual MIP is typically 0.55%.
              </p>
            )}
          </div>

          {/* County Selector */}
          <div className="space-y-2">
            <Label className="text-sm">County (for property tax rate)</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.entries(COUNTY_TAX_RATES) as [Exclude<WisconsinCounty, "custom">, { label: string; rate: number }][]).map(([key, { label, rate }]) => {
                const isSelected = inputs.county === key;
                const annualTax = inputs.purchasePrice * (rate / 100);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleCountyChange(key)}
                    className={`rounded-lg border p-2 text-center transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <span className="text-xs font-medium block">{label.replace(" County", "")}</span>
                    <span className="text-[10px] text-muted-foreground block">{rate}%</span>
                    {isSelected && inputs.purchasePrice > 0 && (
                      <span className="text-[10px] font-semibold text-primary block mt-0.5">{formatCurrency(annualTax)}/yr</span>
                    )}
                  </button>
                );
              })}
            </div>
            {/* Custom tax rate row */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCountyChange("custom")}
                className={`shrink-0 rounded-lg border px-3 py-1.5 text-center transition-all ${
                  inputs.county === "custom"
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <span className="text-xs font-medium">Custom Rate</span>
              </button>
              {inputs.county === "custom" && (
                <div className="flex items-center gap-2 flex-1">
                  <FormattedCurrencyInput
                    value={inputs.purchasePrice > 0 ? Math.round(inputs.purchasePrice * (inputs.propertyTaxRate / 100)) : 0}
                    onChange={(v) => {
                      if (inputs.purchasePrice > 0) {
                        onUpdate("propertyTaxRate", Math.round((v / inputs.purchasePrice) * 10000) / 100);
                      }
                    }}
                    placeholder="Annual taxes"
                    helpText={inputs.purchasePrice > 0 ? `${formatPercent(inputs.propertyTaxRate)} of purchase price` : "Enter a purchase price first."}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Interest Rate & Loan Term */}
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
                  onChange={(v) => {
                    onUpdate("propertyTaxRate", v);
                    onUpdate("county", "custom");
                  }}
                  helpText="Annual % of home value."
                />
                <FormattedCurrencyInput
                  label="Home Insurance (Annual)"
                  value={inputs.homeInsuranceAnnual}
                  onChange={(v) => onUpdate("homeInsuranceAnnual", v)}
                />
                <FormattedPercentInput
                  label={inputs.loanType === "fha" ? "MIP Rate" : "PMI Rate"}
                  value={inputs.pmiRate}
                  onChange={(v) => onUpdate("pmiRate", v)}
                  helpText={inputs.loanType === "fha" ? "FHA annual MIP (typically 0.55%)." : "Applied if down payment < 20%."}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Breakdown */}
      {hasPrice && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Monthly Payment Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <PaymentRow label="Principal & Interest" value={derived.monthlyPI} />
              <PaymentRow label="Property Taxes" value={derived.monthlyTaxes} />
              <PaymentRow label="Home Insurance" value={derived.monthlyInsurance} />
              {derived.monthlyPMI > 0 && (
                <PaymentRow label={inputs.loanType === "fha" ? "Mortgage Insurance (MIP)" : "PMI"} value={derived.monthlyPMI} />
              )}
              {derived.monthlyHOA > 0 && (
                <PaymentRow label="HOA / Condo Fees" value={derived.monthlyHOA} />
              )}
              <hr className="border-border" />
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Total Monthly Payment</span>
                <span className="text-lg font-bold">{formatCurrency(derived.totalMonthlyPayment)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Interest</p>
                <p className="mt-1 text-sm font-semibold">{formatCurrency(derived.totalInterestPaid)}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Cost Over Life</p>
                <p className="mt-1 text-sm font-semibold">{formatCurrency(derived.totalCostOverLife)}</p>
              </div>
            </div>

            {derived.downPaymentPercent < 20 && (
              <p className="text-[10px] text-amber-600 bg-amber-500/10 rounded px-2 py-1">
                Your down payment is {formatPercent(derived.downPaymentPercent)} — below 20%.
                {inputs.loanType === "fha"
                  ? ` FHA mortgage insurance (MIP) of ${formatCurrency(derived.monthlyPMI)}/mo is required for the life of the loan.`
                  : ` PMI of ${formatCurrency(derived.monthlyPMI)}/mo is included until you reach 20% equity.`}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Current vs New Housing Comparison */}
      {hasPrice && derived.monthlyNetIncome > 0 && (
        <Card className="border-blue-500/20 bg-blue-500/[0.03]">
          <CardHeader>
            <CardTitle className="text-lg font-display">How This Fits Your Budget</CardTitle>
            <p className="text-xs text-muted-foreground">
              Your new mortgage replaces your current rent/mortgage from Step 1. Here's how the switch affects your monthly budget.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current vs New Housing */}
            <div className="rounded-lg border border-border p-4 space-y-3">
              <p className="text-xs font-semibold">Current Housing vs. New Mortgage</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Current Rent/Mortgage</p>
                  <p className="mt-1 text-lg font-bold">{formatCurrency(derived.currentRent)}</p>
                  <p className="text-[10px] text-muted-foreground">per month</p>
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">New Mortgage Payment</p>
                  <p className="mt-1 text-lg font-bold">{formatCurrency(derived.newMonthlyHousing)}</p>
                  <p className="text-[10px] text-muted-foreground">per month</p>
                </div>
              </div>
              {derived.newMonthlyHousing > derived.currentRent ? (
                <p className="text-xs text-amber-600 bg-amber-500/10 rounded px-2 py-1 text-center">
                  Your housing costs would increase by <strong>{formatCurrency(derived.newMonthlyHousing - derived.currentRent)}/mo</strong> ({formatPercent(derived.currentRent > 0 ? ((derived.newMonthlyHousing - derived.currentRent) / derived.currentRent) * 100 : 0)} more)
                </p>
              ) : derived.newMonthlyHousing < derived.currentRent ? (
                <p className="text-xs text-emerald-600 bg-emerald-500/10 rounded px-2 py-1 text-center">
                  Your housing costs would decrease by <strong>{formatCurrency(derived.currentRent - derived.newMonthlyHousing)}/mo</strong>
                </p>
              ) : null}
              {derived.currentRent === 0 && (
                <p className="text-[10px] text-muted-foreground">
                  No current rent found. Enter your rent/mortgage amount in <strong>Step 1 → Fixed Costs → "Rent / Mortgage"</strong> to see an accurate comparison.
                </p>
              )}
            </div>

            {/* Full budget breakdown */}
            <div className="space-y-2">
              <p className="text-xs font-semibold">Monthly Budget After Mortgage</p>
              <PaymentRow label="Monthly Net Income" value={derived.monthlyNetIncome} color="text-foreground" />
              <hr className="border-border" />
              <PaymentRow label="Fixed Costs (excl. current rent)" value={derived.fixedCostsExRent} negative muted />
              <PaymentRow label="New Mortgage Payment" value={derived.newMonthlyHousing} negative />
              <PaymentRow label="Existing Debt Payments" value={derived.currentDebt} negative muted />
              <hr className="border-border" />
              <div className="flex justify-between text-sm">
                <span className="font-medium">Remaining for Spending & Savings</span>
                <span className={`font-bold ${derived.remainingAfterMortgage >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {formatCurrency(derived.remainingAfterMortgage)}
                </span>
              </div>
            </div>

            {/* Impact on discretionary budget */}
            <div className="rounded-lg border border-border p-4 space-y-3">
              <p className="text-xs font-semibold">Impact on Your Discretionary Budget</p>
              <div className="space-y-2">
                <BudgetCompareRow
                  label="Guilt-Free Spending"
                  current={derived.currentGuiltFree}
                  reduction={derived.guiltFreeReduction}
                />
                <BudgetCompareRow
                  label="Savings & Investing"
                  current={derived.currentSavings}
                  reduction={derived.savingsReduction}
                />
              </div>
              {(derived.guiltFreeReduction > 0 || derived.savingsReduction > 0) && (
                <p className="text-[10px] text-amber-600">
                  With this mortgage, you may need to reduce your discretionary spending or savings to stay within budget.
                  Go back to Step 2 to adjust your guilt-free spending and see where you can cut.
                </p>
              )}
              {derived.remainingAfterMortgage < 0 && (
                <p className="text-[10px] text-red-500 font-semibold">
                  This mortgage exceeds your current income after fixed costs and debt. Consider a lower purchase price or larger down payment.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Post-Purchase Costs Reminder */}
      <Card className="border-amber-500/20 bg-amber-500/[0.02]">
        <CardHeader>
          <CardTitle className="text-lg font-display">Costs to Plan For After Purchase</CardTitle>
          <p className="text-xs text-muted-foreground">
            Your mortgage payment is just the beginning. Budget for these ongoing and unexpected costs so you're not caught off guard.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {[
              { label: "Property Taxes Can Increase", detail: "Taxes are reassessed periodically. A $300K home at 1.25% = $3,750/yr — but this can jump after purchase if the previous assessment was lower." },
              { label: "The 1% Maintenance Rule", detail: "Budget 1% of your home's value per year for maintenance and repairs. $300K home = $3,000/yr ($250/mo). Roofs, HVAC, plumbing — they all need attention." },
              { label: "CapEx (Capital Expenditures)", detail: "Big-ticket replacements: roof ($8K-15K), HVAC ($5K-10K), water heater ($1K-3K), appliances. Set aside a monthly CapEx reserve." },
              { label: "Homeowners Insurance Increases", detail: "Insurance premiums can rise 5-15% annually. Shop around every 2-3 years to keep costs in check." },
              { label: "Utilities May Increase", detail: "A larger home typically means higher electricity, gas, water, and internet costs compared to renting." },
              { label: "Emergency Fund", detail: "Keep 3-6 months of your new total housing payment in an emergency fund. If your mortgage is $2,000/mo, that's $6,000-$12,000." },
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
              <Link to="/tools/investor-spreadsheets" className="text-primary hover:underline font-medium">CapEx Calculator</Link> — Plan for long-term capital expenditure reserves.
            </p>
            <p className="text-xs text-muted-foreground">
              <Link to="/guides/first-time-home-buyers" className="text-primary hover:underline font-medium">First-Time Home Buyer's Guide</Link> — Complete walkthrough of the buying process.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Local Lenders */}
      <Card className="border-primary/20 bg-primary/[0.03]">
        <CardHeader>
          <CardTitle className="text-lg font-display">Get Pre-Approved with a Local Lender</CardTitle>
          <p className="text-xs text-muted-foreground">
            Ready to make your numbers official? Getting pre-approved with a local lender is the next step.
            These are lenders I trust and work with regularly — they know the local market and can help you
            lock in the best rate.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border border-dashed border-border p-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground font-medium">Local Lender Partners — Coming Soon</p>
            <p className="text-xs text-muted-foreground">
              Curated list of trusted local lenders with competitive rates and excellent service.
            </p>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            In the meantime, <strong>call Lucas Murphy at (414)-269-4909</strong> — I can connect you with a lender who's right for your situation.
          </p>
        </CardContent>
      </Card>

      {/* Download CTA */}
      <Card className="border-primary/30 bg-primary/[0.04]">
        <CardContent className="py-6 text-center space-y-3">
          <h3 className="font-display font-bold text-lg">Ready to Take Action?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Download your complete budget breakdown — including your mortgage scenario — as a spreadsheet you can
            edit in Google Sheets or Excel. Track your real spending for 2-3 months and come back with real numbers.
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

function PaymentRow({ label, value, negative, muted, color }: {
  label: string;
  value: number;
  negative?: boolean;
  muted?: boolean;
  color?: string;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className={muted ? "text-muted-foreground text-xs" : "text-muted-foreground"}>{label}</span>
      <span className={`font-semibold ${color || ""}`}>
        {negative ? "-" : ""}{formatCurrency(value)}
      </span>
    </div>
  );
}

function BudgetCompareRow({ label, current, reduction }: {
  label: string;
  current: number;
  reduction: number;
}) {
  const newAmount = Math.max(0, current - reduction);
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{formatCurrency(current)}</span>
        {reduction > 0 && (
          <>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="font-semibold text-amber-600">{formatCurrency(newAmount)}</span>
            <span className="text-[10px] text-red-500">(-{formatCurrency(reduction)})</span>
          </>
        )}
      </div>
    </div>
  );
}

export default MortgageSection;
