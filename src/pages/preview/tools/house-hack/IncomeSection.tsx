import { Info, ExternalLink } from "lucide-react";
import type { IncomeInputs, IncomeDerived, PropertyType, AnalysisMode } from "@/pages/tools/house-hack/types";
import { PROPERTY_TYPE_UNITS } from "@/pages/tools/house-hack/defaults";
import { formatCurrency } from "@/pages/tools/house-hack/calculations";
import { PreviewInputField, PreviewResultRow, SectionCard } from "./previewUi";

interface IncomeSectionProps {
  mode: AnalysisMode;
  propertyType: PropertyType;
  income: IncomeInputs;
  derived: IncomeDerived;
  onUpdate: <K extends keyof IncomeInputs>(field: K, value: IncomeInputs[K]) => void;
  highlightUnits?: boolean;
  id?: string;
}

const UNIT_FIELDS: { field: keyof IncomeInputs; label: string; unitNumber: number }[] = [
  { field: "unit1Rent", label: "Unit 1 Rent", unitNumber: 1 },
  { field: "unit2Rent", label: "Unit 2 Rent", unitNumber: 2 },
  { field: "unit3Rent", label: "Unit 3 Rent", unitNumber: 3 },
  { field: "unit4Rent", label: "Unit 4 Rent", unitNumber: 4 },
];

const IncomeSection = ({ mode, propertyType, income, derived, onUpdate, highlightUnits = false, id }: IncomeSectionProps) => {
  const unitCount = PROPERTY_TYPE_UNITS[propertyType];
  const visibleUnits = UNIT_FIELDS.slice(0, unitCount);
  const isOwnerOccupied = mode === "owner-occupied";

  return (
    <SectionCard id={id} highlight={highlightUnits}>
      <div className="mb-5">
        <div className="flex items-center gap-1.5">
          <h2 className="font-display text-xl font-semibold tracking-[-0.01em]">2. Income</h2>
          <span className="group/tip relative inline-flex align-middle">
            <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground/60 transition-colors hover:text-accent" />
            <span className="pointer-events-none absolute left-0 top-6 z-50 hidden w-72 rounded-sm border border-border bg-card p-3 text-left text-[11px] font-normal leading-relaxed text-muted-foreground shadow-[0_18px_44px_-20px_hsl(216_52%_11%/0.55)] group-hover/tip:block">
              Not sure how to estimate rent for a unit? Check out{" "}
              <a href="https://www.rentometer.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline">Rent-O-Meter</a>{" "}
              for a quick estimate based on location and unit size. Want more accurate numbers for a specific property? Reach out and I'd be happy to pull detailed rental comps for you.
            </span>
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {isOwnerOccupied
            ? `You live in Unit 1 and rent out the other ${unitCount - 1} unit${unitCount > 2 ? "s" : ""}.`
            : `All ${unitCount} units are rented out.`}
        </p>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {visibleUnits.map(({ field, label, unitNumber }, index) => {
            const isOwnerUnit = isOwnerOccupied && unitNumber === 1;
            return (
              <PreviewInputField
                key={field}
                label={label}
                value={isOwnerUnit ? 0 : (income[field] as number)}
                onChange={(v) => onUpdate(field, v)}
                prefix="$"
                useCommas
                disabled={isOwnerUnit}
                disabledLabel="Unit 1 — You Live Here"
                placeholder={isOwnerUnit ? "You live here" : "Enter rent"}
                highlight={highlightUnits && !isOwnerUnit}
                infoAlign={index % 2 === 1 ? "right" : "left"}
                info={isOwnerUnit ? undefined : "Enter the expected monthly rent for this unit. Check Zillow, Rentometer, or Craigslist for comparable rents in the area. Average rents in the Milwaukee metro: studio $700-$900, 1BR $800-$1,100, 2BR $1,000-$1,400, 3BR $1,200-$1,600."}
              />
            );
          })}
        </div>
        <a href="https://www.rentometer.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent transition-colors hover:text-foreground">
          <ExternalLink className="h-3 w-3" /> Estimate rents on Rent-O-Meter
        </a>
        <PreviewInputField
          label="Other Income"
          value={income.otherIncome}
          onChange={(v) => onUpdate("otherIncome", v)}
          prefix="$"
          useCommas
          placeholder="Enter amount"
          info="Any additional income from the property: coin laundry ($50-$150/mo), parking fees ($25-$75/space), storage rental, pet fees, late fees, etc."
        />
        <PreviewInputField
          label="Vacancy Rate"
          value={income.vacancyPercent}
          onChange={(v) => onUpdate("vacancyPercent", v)}
          suffix="%"
          step={1}
          min={0}
          info={`The percentage of time units are expected to be vacant per year. With a year-long lease signed, vacancy for that year is essentially 0%. For long-term planning, 3-5% is standard for a ${propertyType} in a strong rental market. Higher turnover areas may be 5-10%. Milwaukee metro average is around 4-6%. This is tied to the Vacancy Reserve in the Expenses section — update either one and the other follows.`}
        />

        <hr className="border-border" />

        <div>
          <PreviewResultRow label="Gross Monthly Income" value={derived.grossMonthlyIncome} format="currency" />
          <PreviewResultRow label="Gross Annual Income" value={derived.grossAnnualIncome} format="currency" />
          <div className="flex items-center justify-between border-b border-border/40 py-2.5">
            <span className="text-sm text-muted-foreground">Vacancy Set-Aside ({income.vacancyPercent}%)</span>
            <span className="text-sm tabular-nums text-red-600">−{formatCurrency(derived.vacancyDollar)}/mo</span>
          </div>
          <PreviewResultRow label="Effective Monthly Income (After Vacancy)" value={derived.effectiveMonthlyIncome} format="currency" border={false} />
        </div>
      </div>
    </SectionCard>
  );
};

export default IncomeSection;
