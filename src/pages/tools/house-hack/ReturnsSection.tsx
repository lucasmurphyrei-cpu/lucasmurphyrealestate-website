import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  AnalysisMode,
  OwnerOccupiedReturnsDerived,
  AllUnitsReturnsDerived,
  AllUnitsExtras,
  OwnerOccupiedExtras,
  FinancingType,
} from "./types";
import InputField from "./InputField";
import ResultRow from "./ResultRow";

interface ReturnsSectionProps {
  mode: AnalysisMode;
  financingType: FinancingType;
  ownerReturns: OwnerOccupiedReturnsDerived;
  allUnitsReturns: AllUnitsReturnsDerived;
  ownerExtras: OwnerOccupiedExtras;
  allUnitsExtras: AllUnitsExtras;
  onUpdateOwnerExtras: (field: "currentRent" | "appreciationPercent" | "rentGrowthPercent", value: number) => void;
  onUpdateAllUnitsExtras: (field: "appreciationPercent", value: number) => void;
}

const ReturnsSection = ({
  mode,
  financingType,
  ownerReturns,
  allUnitsReturns,
  ownerExtras,
  allUnitsExtras,
  onUpdateOwnerExtras,
  onUpdateAllUnitsExtras,
}: ReturnsSectionProps) => {
  const isOwnerOccupied = mode === "owner-occupied";
  const isCash = financingType === "cash";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">4. Returns</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {isOwnerOccupied ? (
          <>
            <ResultRow
              label="Monthly Cash Flow"
              value={ownerReturns.monthlyCashFlow}
              format="currency"
              colorCode
              size="large"
              benchmark="How much it costs you to live here with the other unit(s) rented"
            />
            <ResultRow
              label="Annual Cash Flow"
              value={ownerReturns.annualCashFlow}
              format="currency"
              colorCode
            />
            <ResultRow
              label="Cash-on-Cash ROI"
              value={ownerReturns.cocROI}
              format="percent"
              colorCode
              border={false}
            />

            {ownerReturns.monthlyCashFlow < 0 && (
              <div className="rounded-lg bg-secondary/30 p-3 mt-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">Negative cash flow?</span>{" "}
                  That's normal with a low down payment — it means you're paying a small amount to live
                  in the property after rent from the other unit(s). But don't stop here. Check below to
                  see how the full picture — rent savings, appreciation, and principal paydown — stacks up
                  once all the wealth-building factors are included.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <ResultRow
              label="Monthly Cash Flow"
              value={allUnitsReturns.monthlyCashFlow}
              format="currency"
              colorCode
              size="large"
            />
            <ResultRow
              label="Annual Cash Flow"
              value={allUnitsReturns.annualCashFlow}
              format="currency"
              colorCode
            />
            <ResultRow
              label="Cash-on-Cash ROI"
              value={allUnitsReturns.cocROI}
              format="percent"
              colorCode
              benchmark="Ideal: 9-15%+"
            />

            {!isCash && (
              <>
                <hr className="border-border my-3" />

                <ResultRow
                  label="Principal Paydown (Year 1)"
                  value={allUnitsReturns.principalPaydownYear1}
                  format="currency"
                />
                <ResultRow
                  label="Principal Paydown ROI"
                  value={allUnitsReturns.principalPaydownROI}
                  format="percent"
                />
              </>
            )}

            <hr className="border-border my-3" />

            <InputField
              label="Estimated Annual Appreciation (%)"
              value={allUnitsExtras.appreciationPercent}
              onChange={(v) => onUpdateAllUnitsExtras("appreciationPercent", v)}
              suffix="%"
              step={0.5}
              info="Historical average home appreciation is 3-5% annually. The Milwaukee metro has averaged 4-7% in recent years. Conservative estimate: 3%. This is used for total return calculations."
            />

            <div className="mt-3 space-y-0">
              <ResultRow
                label="Annual Appreciation"
                value={allUnitsReturns.annualAppreciation}
                format="currency"
              />
              {!isCash && (
                <ResultRow
                  label="Cash Flow + Principal Paydown ROI"
                  value={allUnitsReturns.combinedCFPDROI}
                  format="percent"
                  colorCode
                />
              )}
              <ResultRow
                label={isCash ? "Total ROI (CF + Appreciation)" : "Total ROI (CF + PD + Appreciation)"}
                value={allUnitsReturns.combinedAllROI}
                format="percent"
                colorCode
                size="large"
              />

              <hr className="border-border my-3" />

              <ResultRow
                label="Gross Annual Income"
                value={allUnitsReturns.grossAnnualIncome}
                format="currency"
              />
              <ResultRow
                label="Operating Expenses"
                value={allUnitsReturns.operatingExpenses}
                format="currency"
                info="Operating expenses are the day-to-day costs of running the property — maintenance, management, insurance, taxes, vacancy, and utilities. This does NOT include your mortgage payment (principal & interest). Lenders and investors look at this number to understand the true cost of ownership separate from financing."
              />
              <ResultRow
                label="Net Operating Income (NOI)"
                value={allUnitsReturns.noi}
                format="currency"
                colorCode
                size="large"
                info="NOI = Gross Annual Income − Operating Expenses. It's the profit your property generates before any mortgage payments. This is one of the most important numbers in real estate investing — it tells you how much the property earns on its own, regardless of how you financed it. A positive NOI means the property makes money; a higher NOI means a stronger investment."
              />
              <ResultRow
                label="Cap Rate"
                value={allUnitsReturns.unleveragedYield}
                format="percent"
                colorCode
                border={false}
                benchmark="Ideal: 5-10%+ for investment properties"
                info="Cap Rate = NOI ÷ Purchase Price. Think of it as the return you'd earn if you paid all cash — no mortgage. It's the standard way investors compare properties regardless of financing. A 7% cap rate means the property generates 7 cents of profit for every dollar of value. Higher cap rate = higher return (but often higher risk). Lower cap rate = lower return (but often in stronger, more stable markets)."
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReturnsSection;
