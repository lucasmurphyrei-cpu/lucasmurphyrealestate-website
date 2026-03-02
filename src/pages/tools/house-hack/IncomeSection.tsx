import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ExternalLink } from "lucide-react";
import type { IncomeInputs, IncomeDerived, PropertyType, AnalysisMode } from "./types";
import { PROPERTY_TYPE_UNITS } from "./defaults";
import { formatCurrency } from "./calculations";
import InputField from "./InputField";
import ResultRow from "./ResultRow";

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

  const [showInfo, setShowInfo] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showInfo) return;
    const handler = (e: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setShowInfo(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showInfo]);

  return (
    <Card id={id} className={highlightUnits ? "ring-2 ring-primary transition-shadow" : "transition-shadow"}>
      <CardHeader>
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-lg">2. Income</CardTitle>
          <div className="relative" ref={infoRef}>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowInfo(!showInfo)}
              className="text-muted-foreground/50 hover:text-primary transition-colors"
              aria-label="More info about income"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
            {showInfo && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-popover p-3 text-xs text-popover-foreground shadow-lg z-50">
                <p className="leading-relaxed">
                  Not sure how to estimate rent for a unit? Check out <a href="https://www.rentometer.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline">Rent-O-Meter</a> for a quick estimate based on location and unit size.
                </p>
                <p className="leading-relaxed mt-2">
                  Want more accurate numbers for a specific property? Reach out to me and I'd be happy to pull detailed rental comps for you.
                </p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-popover border-b border-r border-border rotate-45" />
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {isOwnerOccupied
            ? `You live in Unit 1 and rent out the other ${unitCount - 1} unit${unitCount > 2 ? "s" : ""}.`
            : `All ${unitCount} units are rented out.`}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {visibleUnits.map(({ field, label, unitNumber }) => {
            const isOwnerUnit = isOwnerOccupied && unitNumber === 1;
            return (
              <InputField
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
                info={
                  isOwnerUnit
                    ? undefined
                    : "Enter the expected monthly rent for this unit. Check Zillow, Rentometer, or Craigslist for comparable rents in the area. Average rents in the Milwaukee metro: studio $700-$900, 1BR $800-$1,100, 2BR $1,000-$1,400, 3BR $1,200-$1,600."
                }
              />
            );
          })}
        </div>
        <a
          href="https://www.rentometer.com"
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          Estimate rents on Rent-O-Meter
        </a>
        <InputField
          label="Other Income"
          value={income.otherIncome}
          onChange={(v) => onUpdate("otherIncome", v)}
          prefix="$"
          useCommas
          placeholder="Enter amount"
          info="Any additional income from the property: coin laundry ($50-$150/mo), parking fees ($25-$75/space), storage rental, pet fees, late fees, etc."
        />
        <InputField
          label="Vacancy Rate"
          value={income.vacancyPercent}
          onChange={(v) => onUpdate("vacancyPercent", v)}
          suffix="%"
          step={1}
          min={0}
          info={`The percentage of time units are expected to be vacant per year. With a year-long lease signed, vacancy for that year is essentially 0%. For long-term planning, 3-5% is standard for a ${propertyType} in a strong rental market. Higher turnover areas may be 5-10%. Milwaukee metro average is around 4-6%.`}
        />

        <hr className="border-border" />

        <div className="space-y-0">
          <ResultRow label="Gross Monthly Income" value={derived.grossMonthlyIncome} format="currency" />
          <ResultRow label="Gross Annual Income" value={derived.grossAnnualIncome} format="currency" />
          <div className="flex items-center justify-between py-2.5 border-b border-border/40">
            <span className="text-sm text-muted-foreground">
              Vacancy Set-Aside ({income.vacancyPercent}%)
            </span>
            <span className="text-sm tabular-nums lining-nums tracking-tight text-red-400">
              −{formatCurrency(derived.vacancyDollar)}/mo
            </span>
          </div>
          <ResultRow
            label="Effective Monthly Income (After Vacancy)"
            value={derived.effectiveMonthlyIncome}
            format="currency"
            border={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeSection;
