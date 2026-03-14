import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { FormattedCurrencyInput, FormattedPercentInput } from "./budget-planner/FormattedInput";

// ─── Types ───

type LoanType = "conventional" | "fha";
type DownPaymentMode = "percent" | "dollar";
type WisconsinCounty = "milwaukee" | "waukesha" | "washington" | "ozaukee" | "custom";
type LoanTerm = 15 | 30;

interface MortgageInputs {
  purchasePrice: number;
  downPaymentPercent: number;
  downPaymentAmount: number;
  downPaymentMode: DownPaymentMode;
  loanType: LoanType;
  county: WisconsinCounty;
  interestRate: number;
  loanTerm: LoanTerm;
  propertyTaxRate: number;
  homeInsuranceAnnual: number;
  pmiRate: number;
  hoaMonthly: number;
}

// ─── Constants ───

const COUNTY_TAX_RATES: Record<Exclude<WisconsinCounty, "custom">, { label: string; rate: number }> = {
  milwaukee: { label: "Milwaukee County", rate: 2.27 },
  waukesha: { label: "Waukesha County", rate: 1.72 },
  washington: { label: "Washington County", rate: 1.76 },
  ozaukee: { label: "Ozaukee County", rate: 1.85 },
};

const DEFAULT_INPUTS: MortgageInputs = {
  purchasePrice: 0,
  downPaymentPercent: 20,
  downPaymentAmount: 0,
  downPaymentMode: "percent",
  loanType: "conventional",
  county: "custom",
  interestRate: 6.5,
  loanTerm: 30,
  propertyTaxRate: 1.25,
  homeInsuranceAnnual: 1500,
  pmiRate: 0.5,
  hoaMonthly: 0,
};

// ─── Calculations ───

function calcMonthlyPI(loanAmount: number, annualRate: number, termYears: number): number {
  if (loanAmount <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return loanAmount / n;
  return loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function calcDerived(inputs: MortgageInputs) {
  let downPaymentAmount: number;
  let dpPercent: number;
  if (inputs.downPaymentMode === "percent") {
    dpPercent = inputs.downPaymentPercent;
    downPaymentAmount = inputs.purchasePrice * (dpPercent / 100);
  } else {
    downPaymentAmount = inputs.downPaymentAmount;
    dpPercent = inputs.purchasePrice > 0 ? (downPaymentAmount / inputs.purchasePrice) * 100 : 0;
  }

  const loanAmount = Math.max(0, inputs.purchasePrice - downPaymentAmount);

  let pmiRate = inputs.pmiRate;
  if (inputs.loanType === "fha") pmiRate = 0.55;
  const monthlyPMI = dpPercent < 20 ? (loanAmount * pmiRate / 100) / 12 : 0;

  const monthlyPI = calcMonthlyPI(loanAmount, inputs.interestRate, inputs.loanTerm);
  const monthlyTaxes = (inputs.purchasePrice * inputs.propertyTaxRate / 100) / 12;
  const monthlyInsurance = inputs.homeInsuranceAnnual / 12;
  const monthlyHOA = inputs.hoaMonthly;
  const totalMonthlyPayment = monthlyPI + monthlyTaxes + monthlyInsurance + monthlyPMI + monthlyHOA;

  const totalPayments = monthlyPI * inputs.loanTerm * 12;
  const totalInterestPaid = Math.max(0, totalPayments - loanAmount);
  const totalCostOverLife = totalPayments
    + (monthlyTaxes + monthlyInsurance + monthlyPMI + monthlyHOA) * inputs.loanTerm * 12
    + downPaymentAmount;

  return {
    loanAmount,
    downPaymentPercent: dpPercent,
    downPaymentAmount,
    monthlyPI,
    monthlyTaxes,
    monthlyInsurance,
    monthlyPMI,
    monthlyHOA,
    totalMonthlyPayment,
    totalInterestPaid,
    totalCostOverLife,
  };
}

// ─── Formatting ───

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

// ─── Component ───

const MortgageCalculator = () => {
  const [inputs, setInputs] = useState<MortgageInputs>(DEFAULT_INPUTS);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = <K extends keyof MortgageInputs>(key: K, value: MortgageInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const derived = useMemo(() => calcDerived(inputs), [inputs]);

  const hasPrice = inputs.purchasePrice > 0;

  const handleCountyChange = (county: WisconsinCounty) => {
    update("county", county);
    if (county !== "custom") {
      update("propertyTaxRate", COUNTY_TAX_RATES[county].rate);
    }
  };

  const handleLoanTypeChange = (loanType: LoanType) => {
    update("loanType", loanType);
    if (loanType === "fha") {
      update("pmiRate", 0.55);
      if (inputs.downPaymentMode === "percent" && inputs.downPaymentPercent < 3.5) {
        update("downPaymentPercent", 3.5);
      }
    } else {
      update("pmiRate", 0.5);
    }
  };

  const handleDownPaymentModeChange = (mode: DownPaymentMode) => {
    update("downPaymentMode", mode);
    if (mode === "dollar" && inputs.purchasePrice > 0) {
      update("downPaymentAmount", Math.round(inputs.purchasePrice * (inputs.downPaymentPercent / 100)));
    } else if (mode === "percent" && inputs.purchasePrice > 0) {
      update("downPaymentPercent", Math.round((inputs.downPaymentAmount / inputs.purchasePrice) * 1000) / 10);
    }
  };

  const minDown = inputs.loanType === "fha" ? 3.5 : 3;

  return (
    <main className="container px-4 sm:px-6 md:px-8 py-12 md:py-16">
      <h1 className="font-display text-3xl font-bold md:text-5xl">Mortgage Calculator</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Estimate your monthly mortgage payment with real-time calculations. Adjust down payment, loan type,
        interest rate, and local tax rates to run different scenarios.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,380px] lg:items-start">
        <div className="space-y-6">
          {/* Purchase Price & Down Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">Your Home Purchase</CardTitle>
              <p className="text-xs text-muted-foreground">
                Enter the purchase price and adjust the down payment to see how it affects your monthly payment.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormattedCurrencyInput
                label="Purchase Price"
                value={inputs.purchasePrice}
                onChange={(v) => update("purchasePrice", v)}
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
                    onChange={(v) => update("downPaymentPercent", v)}
                    helpText={inputs.purchasePrice > 0
                      ? `${formatCurrency(inputs.purchasePrice * (inputs.downPaymentPercent / 100))} down on a ${formatCurrency(inputs.purchasePrice)} home. Min ${minDown}% for ${inputs.loanType === "fha" ? "FHA" : "conventional"}.`
                      : `Enter a purchase price above. Min ${minDown}% for ${inputs.loanType === "fha" ? "FHA" : "conventional"}.`}
                  />
                ) : (
                  <FormattedCurrencyInput
                    value={inputs.downPaymentAmount}
                    onChange={(v) => update("downPaymentAmount", v)}
                    helpText={inputs.purchasePrice > 0
                      ? `${formatPercent(derived.downPaymentPercent)} of purchase price. Min ${minDown}% for ${inputs.loanType === "fha" ? "FHA" : "conventional"}.`
                      : "Enter a purchase price above."}
                  />
                )}
              </div>

              <FormattedCurrencyInput
                label="HOA / Condo Fees (Monthly)"
                value={inputs.hoaMonthly}
                onChange={(v) => update("hoaMonthly", v)}
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
                    { type: "conventional" as LoanType, label: "Conventional", desc: "3-5% min down, PMI until 20% equity" },
                    { type: "fha" as LoanType, label: "FHA", desc: "3.5% min down, MIP for life of loan" },
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
                            update("propertyTaxRate", Math.round((v / inputs.purchasePrice) * 10000) / 100);
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
                  onChange={(v) => update("interestRate", v)}
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
                        onClick={() => update("loanTerm", term)}
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
                        update("propertyTaxRate", v);
                        update("county", "custom");
                      }}
                      helpText="Annual % of home value."
                    />
                    <FormattedCurrencyInput
                      label="Home Insurance (Annual)"
                      value={inputs.homeInsuranceAnnual}
                      onChange={(v) => update("homeInsuranceAnnual", v)}
                    />
                    <FormattedPercentInput
                      label={inputs.loanType === "fha" ? "MIP Rate" : "PMI Rate"}
                      value={inputs.pmiRate}
                      onChange={(v) => update("pmiRate", v)}
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
                  <Row label="Principal & Interest" value={formatCurrency(derived.monthlyPI)} />
                  <Row label="Property Taxes" value={formatCurrency(derived.monthlyTaxes)} />
                  <Row label="Home Insurance" value={formatCurrency(derived.monthlyInsurance)} />
                  {derived.monthlyPMI > 0 && (
                    <Row label={inputs.loanType === "fha" ? "Mortgage Insurance (MIP)" : "PMI"} value={formatCurrency(derived.monthlyPMI)} />
                  )}
                  {derived.monthlyHOA > 0 && (
                    <Row label="HOA / Condo Fees" value={formatCurrency(derived.monthlyHOA)} />
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

          {/* Post-Purchase Costs */}
          <Card className="border-amber-500/20 bg-amber-500/[0.02]">
            <CardHeader>
              <CardTitle className="text-lg font-display">Costs to Plan For After Purchase</CardTitle>
              <p className="text-xs text-muted-foreground">
                Your mortgage payment is just the beginning. Budget for these ongoing and unexpected costs.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {[
                  { label: "Property Taxes Can Increase", detail: "Taxes are reassessed periodically. A $300K home at 1.25% = $3,750/yr — but this can jump after purchase." },
                  { label: "The 1% Maintenance Rule", detail: "Budget 1% of your home's value per year for maintenance and repairs. $300K home = $3,000/yr ($250/mo)." },
                  { label: "CapEx (Capital Expenditures)", detail: "Big-ticket replacements: roof ($8K-15K), HVAC ($5K-10K), water heater ($1K-3K), appliances." },
                  { label: "Emergency Fund", detail: "Keep 3-6 months of your total housing payment in an emergency fund." },
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
                  <Link to="/tools/budget-planner" className="text-primary hover:underline font-medium">Budget Planner</Link> — Full 4-step tool to understand your spending, savings, and affordability.
                </p>
                <p className="text-xs text-muted-foreground">
                  <Link to="/tools/investor-spreadsheets" className="text-primary hover:underline font-medium">CapEx Calculator</Link> — Plan for long-term capital expenditure reserves.
                </p>
                <p className="text-xs text-muted-foreground">
                  <Link to="/guides/first-time-home-buyers" className="text-primary hover:underline font-medium">First-Time Home Buyer's Guide</Link> — Complete walkthrough of the buying process.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="border-primary/20 bg-primary/[0.03]">
            <CardContent className="py-5 text-center space-y-3">
              <h3 className="font-display font-bold text-lg">Want the Full Picture?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                This calculator shows your mortgage payment — but how does it fit with your full budget?
                Use the <strong className="text-foreground">Budget Planner</strong> to understand your fixed expenses, savings rate,
                and what you can truly afford before making an offer.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link to="/tools/budget-planner">Open Budget Planner</Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Questions? <strong>Call Lucas Murphy at (414) 458-1952</strong> to discuss your situation.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ─── Sidebar ─── */}
        <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">Mortgage Summary</CardTitle>
              {hasPrice && <p className="text-xs text-muted-foreground">{inputs.loanTerm}-year fixed at {inputs.interestRate}%</p>}
            </CardHeader>
            <CardContent className="space-y-3">
              {hasPrice ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Payment</span>
                    <span className="text-lg font-bold">{formatCurrency(derived.totalMonthlyPayment)}</span>
                  </div>
                  <Row label="Principal & Interest" value={formatCurrency(derived.monthlyPI)} muted />
                  <Row label="Taxes & Insurance" value={formatCurrency(derived.monthlyTaxes + derived.monthlyInsurance)} muted />
                  {derived.monthlyPMI > 0 && <Row label="PMI" value={formatCurrency(derived.monthlyPMI)} muted />}
                  {derived.monthlyHOA > 0 && <Row label="HOA" value={formatCurrency(derived.monthlyHOA)} muted />}
                  <hr className="border-border" />
                  <Row label="Down Payment" value={`${formatPercent(derived.downPaymentPercent)} (${formatCurrency(derived.downPaymentAmount)})`} muted />
                  <Row label="Loan Amount" value={formatCurrency(derived.loanAmount)} muted />
                </>
              ) : (
                <p className="text-xs text-muted-foreground">Enter a purchase price to see your mortgage breakdown.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className={muted ? "text-muted-foreground text-xs" : "text-muted-foreground"}>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export default MortgageCalculator;
