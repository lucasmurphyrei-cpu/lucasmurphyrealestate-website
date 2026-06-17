import { ExternalLink } from "lucide-react";
import type { InvestmentInputs, InvestmentDerived, FinancingType } from "@/pages/tools/house-hack/types";
import { formatCurrency, calcCountyTax, formatCurrencyDetailed } from "@/pages/tools/house-hack/calculations";
import { FREDDIE_MAC_RATES_URL, COUNTY_TAX_RATES } from "@/pages/tools/house-hack/defaults";
import { PreviewInputField, PreviewResultRow, SectionCard, SectionTitle, Pill, fieldCls, labelCls } from "./previewUi";

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
    <SectionCard>
      <SectionTitle>1. Investment</SectionTitle>
      <div className="space-y-4">
        <PreviewInputField
          label="Purchase Price"
          value={investment.purchasePrice}
          onChange={(v) => onUpdate("purchasePrice", v)}
          prefix="$"
          useCommas
          placeholder="e.g. 350,000"
          info="The total purchase price of the property. For multi-unit properties in the Milwaukee metro area, duplexes typically range from $150,000-$400,000, triplexes $200,000-$500,000, and fourplexes $250,000-$600,000+."
        />

        {/* Financing Type Toggle */}
        <div>
          <p className={labelCls}>Financing Type</p>
          <div className="flex flex-wrap gap-2">
            {FINANCING_OPTIONS.map((opt) => (
              <Pill key={opt.value} active={investment.financingType === opt.value} onClick={() => onUpdate("financingType", opt.value)}>
                {opt.label}
              </Pill>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {isCash && "No loan — full purchase price paid upfront."}
            {isFHA && "FHA loans require 3.5% min down. Upfront & monthly MIP applies."}
            {investment.financingType === "conventional" && "Standard financing. Typical down payment 3-20%."}
          </p>
        </div>

        {!isCash && (
          <div className="grid grid-cols-2 gap-3">
            <PreviewInputField
              label="Down Payment (%)"
              value={investment.downPaymentPercent}
              onChange={(v) => onUpdate("downPaymentPercent", v)}
              suffix="%"
              step={0.5}
              min={0}
              info={isFHA
                ? "FHA loans require a minimum 3.5% down payment. Lower down payments mean higher monthly mortgage insurance."
                : "Conventional loans typically require 3-20% down. Putting less than 20% down usually requires private mortgage insurance (PMI)."}
            />
            <div className="flex flex-col justify-end">
              <p className={labelCls}>Down Payment</p>
              <p className="flex h-10 items-center text-sm font-semibold tabular-nums">{formatCurrency(derived.downPaymentDollar)}</p>
            </div>
          </div>
        )}

        {isFHA && (
          <PreviewInputField
            label="FHA Upfront MIP (%)"
            value={investment.fhaUpfrontMIPPercent}
            onChange={(v) => onUpdate("fhaUpfrontMIPPercent", v)}
            suffix="%"
            step={0.25}
            info="FHA charges a one-time upfront mortgage insurance premium (MIP) of 1.75% of the loan amount. This is typically rolled into the loan balance."
          />
        )}

        {!isCash && (
          <PreviewInputField
            label="Down Payment Assistance"
            value={investment.downPaymentAssistance}
            onChange={(v) => onUpdate("downPaymentAssistance", v)}
            prefix="$"
            useCommas
            placeholder="e.g. 5,000"
            info="Many programs in Wisconsin offer DPA for first-time buyers. Common programs include WHEDA ($3,500-$10,000), City of Milwaukee DPA, and county-specific grants. Ask your lender about eligibility."
          />
        )}

        <div className="grid grid-cols-2 gap-3">
          <PreviewInputField
            label="Closing Costs (%)"
            value={investment.closingCostsPercent}
            onChange={(v) => onUpdate("closingCostsPercent", v)}
            suffix="%"
            step={0.1}
            info="Closing costs typically range from 2-5% of the purchase price. Includes lender fees, title insurance, appraisal, attorney fees, recording fees, and prepaid items (taxes/insurance escrow). Wisconsin averages about 2-3%."
          />
          <PreviewInputField
            label="Initial Repairs"
            value={investment.initialRepairs}
            onChange={(v) => onUpdate("initialRepairs", v)}
            prefix="$"
            useCommas
            infoAlign="right"
            info="Estimated cost for any immediate repairs or renovations needed at purchase. Get contractor bids before closing if possible. Common items: paint ($2,000-$5,000), flooring ($3,000-$8,000), appliances ($500-$2,000 each)."
          />
        </div>

        {!isCash && (
          <>
            <hr className="border-border" />
            <div className="grid grid-cols-2 gap-3">
              <PreviewInputField
                label="Interest Rate (%)"
                value={investment.interestRate}
                onChange={(v) => onUpdate("interestRate", v)}
                suffix="%"
                step={0.125}
                autoDecimalRate
                info="Your mortgage interest rate. Rates change daily based on market conditions and your credit score. Check the current rate below. Tip: just type the digits (e.g. 610 = 6.10%)."
              />
              <PreviewInputField
                label="Loan Term (Years)"
                value={investment.loanTermYears}
                onChange={(v) => onUpdate("loanTermYears", v)}
                suffix="yr"
                infoAlign="right"
                info="Most investment properties use a 30-year fixed mortgage for the lowest monthly payment. 15-year terms have higher payments but build equity faster and have lower rates."
              />
            </div>
            <a href={FREDDIE_MAC_RATES_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent transition-colors hover:text-foreground">
              <ExternalLink className="h-3 w-3" /> View current rates on Freddie Mac (PMMS)
            </a>
          </>
        )}

        <hr className="border-border" />

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <PreviewInputField
              label="Monthly Taxes"
              value={investment.monthlyTaxes}
              onChange={(v) => { onUpdate("monthlyTaxes", v); onTaxManualChange?.(); }}
              prefix="$"
              useCommas
              info="Monthly property tax estimate. Select a county to auto-calculate, or enter manually. Actual taxes vary by municipality — reach out to me for exact numbers on a specific property!"
            />
            <div>
              <span className={labelCls}>County Estimate</span>
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
                className={fieldCls}
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
            <PreviewInputField
              label="Monthly Insurance"
              value={investment.monthlyInsurance}
              onChange={(v) => onUpdate("monthlyInsurance", v)}
              prefix="$"
              useCommas
              info="Homeowner's/landlord insurance. Multi-unit properties typically cost $100-$250/month depending on coverage, location, and property age. Get quotes from 2-3 insurers for the best rate."
            />
            {!isCash && (
              <PreviewInputField
                label="Mortgage Insurance"
                value={investment.monthlyMortgageInsurance}
                onChange={(v) => onUpdate("monthlyMortgageInsurance", v)}
                prefix="$"
                useCommas
                infoAlign="right"
                info={isFHA
                  ? "FHA monthly MIP is typically 0.55-0.85% of the loan annually (divided by 12). For most FHA loans, MIP lasts the life of the loan."
                  : "PMI is required with less than 20% down on conventional loans. Typically 0.2-1% of the loan amount annually. Can be removed once you reach 20% equity."}
              />
            )}
          </div>
        </div>

        <hr className="border-border" />

        {/* Summary */}
        <div>
          <PreviewResultRow label="Purchase Price" value={investment.purchasePrice} format="currency" />
          {!isCash && (
            <>
              <PreviewResultRow label="Loan Amount" value={derived.loanWithoutMIP} format="currency" />
              {isFHA && (
                <>
                  <PreviewResultRow label="+ Upfront MIP" value={derived.upfrontMIP} format="currency" />
                  <PreviewResultRow label="Total Loan (with MIP)" value={derived.totalLoan} format="currency" />
                </>
              )}
            </>
          )}
          <PreviewResultRow label="Closing Costs" value={derived.closingCostsDollar} format="currency" />
          <PreviewResultRow
            label={isCash ? "Total Investment" : "Initial Investment (Cash Needed)"}
            value={derived.initialInvestment}
            format="currency"
            size="large"
          />
          {!isCash && (
            <>
              <PreviewResultRow label="Monthly P&I" value={derived.monthlyPI} format="currency" />
              <PreviewResultRow label="PITI (Monthly Payment)" value={derived.monthlyPITI} format="currency" size="large" border={false} />
            </>
          )}
          {isCash && (
            <PreviewResultRow label="Monthly Costs (Taxes + Insurance)" value={derived.monthlyPITI} format="currency" size="large" border={false} />
          )}
        </div>
      </div>
    </SectionCard>
  );
};

export default InvestmentSection;
