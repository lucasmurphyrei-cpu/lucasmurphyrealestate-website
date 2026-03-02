import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { InvestmentInputs, InvestmentDerived, FinancingType } from "./types";
import { formatCurrency, calcCountyTax, formatCurrencyDetailed } from "./calculations";
import { FREDDIE_MAC_RATES_URL, COUNTY_TAX_RATES } from "./defaults";
import InputField from "./InputField";
import ResultRow from "./ResultRow";

interface InvestmentSectionProps {
  investment: InvestmentInputs;
  derived: InvestmentDerived;
  onUpdate: <K extends keyof InvestmentInputs>(field: K, value: InvestmentInputs[K]) => void;
  selectedCounty: string | null;
  onCountySelect: (countyKey: string, monthlyTax: number) => void;
  onTaxManualChange?: () => void;
}

const FINANCING_OPTIONS: { value: FinancingType; label: string }[] = [
  { value: "conventional", label: "Conventional" },
  { value: "fha", label: "FHA" },
  { value: "cash", label: "Cash" },
];

const InvestmentSection = ({ investment, derived, onUpdate, selectedCounty, onCountySelect, onTaxManualChange }: InvestmentSectionProps) => {
  const isCash = investment.financingType === "cash";
  const isFHA = investment.financingType === "fha";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">1. Investment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <InputField
          label="Purchase Price"
          value={investment.purchasePrice}
          onChange={(v) => onUpdate("purchasePrice", v)}
          prefix="$"
          useCommas
          info="The total purchase price of the property. For multi-unit properties in the Milwaukee metro area, duplexes typically range from $150,000-$400,000, triplexes $200,000-$500,000, and fourplexes $250,000-$600,000+."
        />

        {/* Financing Type Toggle */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Financing Type</p>
          <div className="flex flex-wrap gap-2">
            {FINANCING_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={investment.financingType === opt.value ? "default" : "outline"}
                size="sm"
                onClick={() => onUpdate("financingType", opt.value)}
                className={investment.financingType === opt.value ? "bg-primary text-primary-foreground" : ""}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {isCash && "No loan — full purchase price paid upfront."}
            {isFHA && "FHA loans require 3.5% min down. Upfront & monthly MIP applies."}
            {investment.financingType === "conventional" && "Standard financing. Typical down payment 3-20%."}
          </p>
        </div>

        {!isCash && (
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Down Payment (%)"
              value={investment.downPaymentPercent}
              onChange={(v) => onUpdate("downPaymentPercent", v)}
              suffix="%"
              step={0.5}
              min={0}
              info={isFHA
                ? "FHA loans require a minimum 3.5% down payment. Lower down payments mean higher monthly mortgage insurance."
                : "Conventional loans typically require 3-20% down. Putting less than 20% down usually requires private mortgage insurance (PMI)."
              }
            />
            <div className="flex flex-col justify-end">
              <p className="text-xs text-muted-foreground mb-1.5">Down Payment</p>
              <p className="h-10 flex items-center text-sm font-semibold tabular-nums">
                {formatCurrency(derived.downPaymentDollar)}
              </p>
            </div>
          </div>
        )}

        {isFHA && (
          <InputField
            label="FHA Upfront MIP (%)"
            value={investment.fhaUpfrontMIPPercent}
            onChange={(v) => onUpdate("fhaUpfrontMIPPercent", v)}
            suffix="%"
            step={0.25}
            info="FHA charges a one-time upfront mortgage insurance premium (MIP) of 1.75% of the loan amount. This is typically rolled into the loan balance."
          />
        )}

        {!isCash && (
          <InputField
            label="Down Payment Assistance"
            value={investment.downPaymentAssistance}
            onChange={(v) => onUpdate("downPaymentAssistance", v)}
            prefix="$"
            useCommas
            info="Many programs in Wisconsin offer DPA for first-time buyers. Common programs include WHEDA ($3,500-$10,000), City of Milwaukee DPA, and county-specific grants. Ask your lender about eligibility."
          />
        )}

        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Closing Costs (%)"
            value={investment.closingCostsPercent}
            onChange={(v) => onUpdate("closingCostsPercent", v)}
            suffix="%"
            step={0.1}
            info="Closing costs typically range from 2-5% of the purchase price. Includes lender fees, title insurance, appraisal, attorney fees, recording fees, and prepaid items (taxes/insurance escrow). Wisconsin averages about 2-3%."
          />
          <InputField
            label="Initial Repairs"
            value={investment.initialRepairs}
            onChange={(v) => onUpdate("initialRepairs", v)}
            prefix="$"
            useCommas
            info="Estimated cost for any immediate repairs or renovations needed at purchase. Get contractor bids before closing if possible. Common items: paint ($2,000-$5,000), flooring ($3,000-$8,000), appliances ($500-$2,000 each)."
          />
        </div>

        {!isCash && (
          <>
            <hr className="border-border" />

            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Interest Rate (%)"
                value={investment.interestRate}
                onChange={(v) => onUpdate("interestRate", v)}
                suffix="%"
                step={0.125}
                autoDecimalRate
                info="Your mortgage interest rate. Rates change daily based on market conditions and your credit score. Check the current rate below. Tip: just type the digits (e.g. 610 = 6.10%)."
              />
              <InputField
                label="Loan Term (Years)"
                value={investment.loanTermYears}
                onChange={(v) => onUpdate("loanTermYears", v)}
                suffix="yr"
                info="Most investment properties use a 30-year fixed mortgage for the lowest monthly payment. 15-year terms have higher payments but build equity faster and have lower rates."
              />
            </div>

            <a
              href={FREDDIE_MAC_RATES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              View current rates on Freddie Mac (PMMS)
            </a>
          </>
        )}

        <hr className="border-border" />

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Monthly Taxes"
              value={investment.monthlyTaxes}
              onChange={(v) => { onUpdate("monthlyTaxes", v); onTaxManualChange?.(); }}
              prefix="$"
              useCommas
              info="Monthly property tax estimate. Select a county from the dropdown to auto-calculate, or enter manually. Actual taxes vary by municipality — reach out to me for exact numbers on a specific property!"
            />
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="block text-xs text-muted-foreground">County Estimate</span>
              </div>
              <select
                value={selectedCounty || ""}
                onChange={(e) => {
                  const key = e.target.value;
                  if (key && key in COUNTY_TAX_RATES) {
                    const county = COUNTY_TAX_RATES[key as keyof typeof COUNTY_TAX_RATES];
                    const monthly = calcCountyTax(investment.purchasePrice, county.rate);
                    onCountySelect(key, Math.round(monthly));
                  }
                }}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select county...</option>
                {Object.entries(COUNTY_TAX_RATES).map(([key, county]) => {
                  const monthly = calcCountyTax(investment.purchasePrice, county.rate);
                  return (
                    <option key={key} value={key}>
                      {county.name} ({county.rate}%) — {formatCurrencyDetailed(monthly)}/mo
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className={`grid gap-3 ${isCash ? "grid-cols-1" : "grid-cols-2"}`}>
            <InputField
              label="Monthly Insurance"
              value={investment.monthlyInsurance}
              onChange={(v) => onUpdate("monthlyInsurance", v)}
              prefix="$"
              useCommas
              info="Homeowner's/landlord insurance. Multi-unit properties typically cost $100-$250/month depending on coverage, location, and property age. Get quotes from 2-3 insurers for the best rate."
            />
            {!isCash && (
              <InputField
                label="Mortgage Insurance"
                value={investment.monthlyMortgageInsurance}
                onChange={(v) => onUpdate("monthlyMortgageInsurance", v)}
                prefix="$"
                useCommas
                info={isFHA
                  ? "FHA monthly MIP is typically 0.55-0.85% of the loan annually (divided by 12). For most FHA loans, MIP lasts the life of the loan."
                  : "PMI is required with less than 20% down on conventional loans. Typically 0.2-1% of the loan amount annually. Can be removed once you reach 20% equity."
                }
              />
            )}
          </div>
        </div>

        <hr className="border-border" />

        {/* Summary */}
        <div className="space-y-0">
          <ResultRow label="Purchase Price" value={investment.purchasePrice} format="currency" />
          {!isCash && (
            <>
              <ResultRow label="Loan Amount" value={derived.loanWithoutMIP} format="currency" />
              {isFHA && (
                <>
                  <ResultRow label="+ Upfront MIP" value={derived.upfrontMIP} format="currency" />
                  <ResultRow label="Total Loan (with MIP)" value={derived.totalLoan} format="currency" />
                </>
              )}
            </>
          )}
          <ResultRow label="Closing Costs" value={derived.closingCostsDollar} format="currency" />
          <ResultRow
            label={isCash ? "Total Investment" : "Initial Investment (Cash Needed)"}
            value={derived.initialInvestment}
            format="currency"
            size="large"
          />
          {!isCash && (
            <>
              <ResultRow label="Monthly P&I" value={derived.monthlyPI} format="currency" />
              <ResultRow
                label="PITI (Monthly Payment)"
                value={derived.monthlyPITI}
                format="currency"
                size="large"
                border={false}
              />
            </>
          )}
          {isCash && (
            <ResultRow
              label="Monthly Costs (Taxes + Insurance)"
              value={derived.monthlyPITI}
              format="currency"
              size="large"
              border={false}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentSection;
