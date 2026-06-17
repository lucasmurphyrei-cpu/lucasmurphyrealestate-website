import type {
  AnalysisMode,
  OwnerOccupiedReturnsDerived,
  AllUnitsReturnsDerived,
  AllUnitsExtras,
  OwnerOccupiedExtras,
  FinancingType,
} from "@/pages/tools/house-hack/types";
import { PreviewInputField, PreviewResultRow, SectionCard, SectionTitle } from "./previewUi";

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

const ReturnsSection = ({ mode, financingType, ownerReturns, allUnitsReturns, allUnitsExtras, onUpdateAllUnitsExtras }: ReturnsSectionProps) => {
  const isOwnerOccupied = mode === "owner-occupied";
  const isCash = financingType === "cash";

  return (
    <SectionCard>
      <SectionTitle>4. Returns</SectionTitle>
      <div className="space-y-1">
        {isOwnerOccupied ? (
          <>
            <PreviewResultRow label="Monthly Cash Flow" value={ownerReturns.monthlyCashFlow} format="currency" colorCode size="large" benchmark="How much it costs you to live here with the other unit(s) rented" />
            <PreviewResultRow label="Annual Cash Flow" value={ownerReturns.annualCashFlow} format="currency" colorCode />
            <PreviewResultRow label="Cash-on-Cash ROI" value={ownerReturns.cocROI} format="percent" colorCode border={false} />
            {ownerReturns.monthlyCashFlow < 0 && (
              <div className="mt-2 rounded-sm bg-secondary/50 p-3">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">Negative cash flow?</span> That's normal with a low down payment — it means you're paying a small amount to live in the property after rent from the other unit(s). But don't stop here. Check below to see how the full picture — rent savings, appreciation, and principal paydown — stacks up once all the wealth-building factors are included.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <PreviewResultRow label="Monthly Cash Flow" value={allUnitsReturns.monthlyCashFlow} format="currency" colorCode size="large" />
            <PreviewResultRow label="Annual Cash Flow" value={allUnitsReturns.annualCashFlow} format="currency" colorCode />
            <PreviewResultRow label="Cash-on-Cash ROI" value={allUnitsReturns.cocROI} format="percent" colorCode benchmark="Ideal: 9-15%+" />

            {!isCash && (
              <>
                <hr className="my-3 border-border" />
                <PreviewResultRow label="Principal Paydown (Year 1)" value={allUnitsReturns.principalPaydownYear1} format="currency" />
                <PreviewResultRow label="Principal Paydown ROI" value={allUnitsReturns.principalPaydownROI} format="percent" />
              </>
            )}

            <hr className="my-3 border-border" />

            <PreviewInputField
              label="Estimated Annual Appreciation (%)"
              value={allUnitsExtras.appreciationPercent}
              onChange={(v) => onUpdateAllUnitsExtras("appreciationPercent", v)}
              suffix="%"
              step={0.5}
              info="Historical average home appreciation is 3-5% annually. The Milwaukee metro has averaged 4-7% in recent years. Conservative estimate: 3%. This is used for total return calculations."
            />

            <div className="mt-3">
              <PreviewResultRow label="Annual Appreciation" value={allUnitsReturns.annualAppreciation} format="currency" />
              {!isCash && <PreviewResultRow label="Cash Flow + Principal Paydown ROI" value={allUnitsReturns.combinedCFPDROI} format="percent" colorCode />}
              <PreviewResultRow label={isCash ? "Total ROI (CF + Appreciation)" : "Total ROI (CF + PD + Appreciation)"} value={allUnitsReturns.combinedAllROI} format="percent" colorCode size="large" />

              <hr className="my-3 border-border" />

              <PreviewResultRow label="Gross Annual Income" value={allUnitsReturns.grossAnnualIncome} format="currency" />
              <PreviewResultRow label="Operating Expenses" value={allUnitsReturns.operatingExpenses} format="currency" info="Operating expenses are the day-to-day costs of running the property — maintenance, management, insurance, taxes, vacancy, and utilities. This does NOT include your mortgage payment (principal & interest). Lenders and investors look at this number to understand the true cost of ownership separate from financing." />
              <PreviewResultRow label="Net Operating Income (NOI)" value={allUnitsReturns.noi} format="currency" colorCode size="large" info="NOI = Gross Annual Income − Operating Expenses. It's the profit your property generates before any mortgage payments. This is one of the most important numbers in real estate investing — it tells you how much the property earns on its own, regardless of how you financed it." />
              <PreviewResultRow label="Cap Rate" value={allUnitsReturns.unleveragedYield} format="percent" colorCode border={false} benchmark="Ideal: 5-10%+ for investment properties" infoAlign="right" info="Cap Rate = NOI ÷ Purchase Price. Think of it as the return you'd earn if you paid all cash — no mortgage. It's the standard way investors compare properties regardless of financing. Higher cap rate = higher return (but often higher risk)." />
            </div>
          </>
        )}
      </div>
    </SectionCard>
  );
};

export default ReturnsSection;
