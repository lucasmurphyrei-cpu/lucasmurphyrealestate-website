import { useState } from "react";
import { DollarSign, Percent } from "lucide-react";
import type { ExpenseInputs, ExpensesDerived, AnalysisMode, ExpenseInputMode } from "@/pages/tools/house-hack/types";
import { formatCurrency } from "@/pages/tools/house-hack/calculations";
import { PreviewInputField, PreviewResultRow, SectionCard, SectionTitle } from "./previewUi";

interface ExpensesSectionProps {
  mode: AnalysisMode;
  expenses: ExpenseInputs;
  derived: ExpensesDerived;
  monthlyPITI: number;
  purchasePrice: number;
  grossMonthlyIncome: number;
  incomeVacancyPercent: number;
  onVacancyReserveChange: (dollar: number) => void;
  onUpdate: <K extends keyof ExpenseInputs>(field: K, value: ExpenseInputs[K]) => void;
}

const EXPENSE_FIELDS: { field: keyof ExpenseInputs; label: string; info: string }[] = [
  { field: "maintenanceDollar", label: "Maintenance/Repairs", info: "Budget for ongoing maintenance and minor repairs. Rule of thumb: 1-2% of property value per year, divided by 12. For a $300K property that's $250-$500/mo." },
  { field: "capexDollar", label: "CapEx", info: "Reserve for major replacements: roof ($8K-$15K every 20-30yr), furnace ($3K-$6K every 15-20yr), water heater ($1K-$2K every 10yr). Typical: $50-$200/mo per unit." },
  { field: "vacancyDollar", label: "Vacancy Reserve", info: "The monthly dollar value of your vacancy allowance. This mirrors the Vacancy Rate in the Income section (edit either and the other follows). It's already counted there as reduced income, so it is NOT added again to your expenses — no double counting." },
  { field: "managementDollar", label: "Property Management", info: "Professional management costs 8-12% of gross rent. Self-managing saves this cost but requires your time. Many house hackers self-manage." },
];

const UTILITY_FIELDS: { field: keyof ExpenseInputs; label: string; info: string }[] = [
  { field: "utilities", label: "Utilities", info: "Water/sewer, gas, electric, internet you pay as owner. Typical: $170-$380/mo combined. Some can be billed to tenants." },
  { field: "trash", label: "Trash", info: "Trash pickup. Typically $20-$50/mo. Some municipalities include it in property taxes." },
  { field: "lawnSnow", label: "Lawn/Snow", info: "Lawn care and snow removal. DIY or professional ($50-$100/mo avg if outsourced year-round)." },
  { field: "other", label: "Other", info: "Pest control, common area supplies, advertising, legal/accounting, etc." },
];

function dollarToPercentPV(dollar: number, purchasePrice: number): number {
  if (purchasePrice <= 0) return 0;
  return (dollar * 12 / purchasePrice) * 100;
}
function percentToDollarPV(pct: number, purchasePrice: number): number {
  return (purchasePrice * (pct / 100)) / 12;
}
function dollarToPercentRent(dollar: number, grossMonthly: number): number {
  if (grossMonthly <= 0) return 0;
  return (dollar / grossMonthly) * 100;
}
function percentToDollarRent(pct: number, grossMonthly: number): number {
  return grossMonthly * (pct / 100);
}

const ExpensesSection = ({ mode, expenses, derived, monthlyPITI, purchasePrice, grossMonthlyIncome, incomeVacancyPercent, onVacancyReserveChange, onUpdate }: ExpensesSectionProps) => {
  const isOwnerOccupied = mode === "owner-occupied";
  const [inputMode, setInputMode] = useState<ExpenseInputMode>("dollar");

  const renderField = ({ field, label, info }: { field: keyof ExpenseInputs; label: string; info: string }, index: number) => {
    const isVacancyMirror = field === "vacancyDollar";
    const isRentBased = field === "managementDollar" || field === "vacancyDollar";
    const align = index % 2 === 1 ? ("right" as const) : ("left" as const);
    // Vacancy Reserve mirrors the Income vacancy rate and is NOT stored as an expense (counted once on income).
    const dollarValue = isVacancyMirror ? Math.round((grossMonthlyIncome * incomeVacancyPercent) / 100) : (expenses[field] as number);
    const setDollar = (d: number) => (isVacancyMirror ? onVacancyReserveChange(d) : onUpdate(field, d));
    const note = isVacancyMirror ? (
      <p className="ml-0.5 mt-1 text-[10px] leading-snug text-muted-foreground/60">Mirrors your Vacancy Rate in Income — counted once there, not added to expenses.</p>
    ) : null;

    if (inputMode === "percent") {
      const pctValue = isRentBased ? dollarToPercentRent(dollarValue, grossMonthlyIncome) : dollarToPercentPV(dollarValue, purchasePrice);
      const pctHint = isRentBased
        ? "% mode: percentage of gross monthly rent."
        : "% mode: percentage of property value per year, shown as monthly cost.";
      return (
        <div key={field}>
          <PreviewInputField
            label={label}
            value={Math.round(pctValue * 100) / 100}
            onChange={(v) => {
              const dollar = isRentBased ? Math.round(percentToDollarRent(v, grossMonthlyIncome)) : Math.round(percentToDollarPV(v, purchasePrice));
              setDollar(dollar);
            }}
            suffix="%"
            step={0.1}
            min={0}
            placeholder="Enter %"
            info={info + "\n\n" + pctHint}
            infoAlign={align}
          />
          {dollarValue > 0 && <p className="ml-0.5 mt-0.5 text-[10px] text-muted-foreground/60">({formatCurrency(dollarValue)}/mo)</p>}
          {note}
        </div>
      );
    }

    return (
      <div key={field}>
        <PreviewInputField
          label={label}
          value={dollarValue}
          onChange={setDollar}
          prefix="$"
          useCommas
          placeholder="Enter amount"
          info={info}
          infoAlign={align}
        />
        {note}
      </div>
    );
  };

  const renderDollarField = ({ field, label, info }: { field: keyof ExpenseInputs; label: string; info: string }, index: number) => (
    <PreviewInputField
      key={field}
      label={label}
      value={expenses[field] as number}
      onChange={(v) => onUpdate(field, v)}
      prefix="$"
      useCommas
      placeholder="Enter amount"
      info={info}
      infoAlign={index % 2 === 1 ? "right" : "left"}
    />
  );

  return (
    <SectionCard>
      <div className="mb-5 flex items-start justify-between gap-3">
        <SectionTitle sub={isOwnerOccupied ? "Monthly costs while you live in the property." : "Monthly costs as a full rental property."}>
          3. Expenses
        </SectionTitle>
        <div className="flex shrink-0 items-center overflow-hidden rounded-sm border border-border">
          <button type="button" onClick={() => setInputMode("dollar")} className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium transition-colors ${inputMode === "dollar" ? "bg-accent text-accent-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}>
            <DollarSign className="h-3 w-3" />
          </button>
          <button type="button" onClick={() => setInputMode("percent")} className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium transition-colors ${inputMode === "percent" ? "bg-accent text-accent-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}>
            <Percent className="h-3 w-3" />
          </button>
        </div>
      </div>
      {inputMode === "percent" && (
        <p className="-mt-3 mb-3 text-[10px] text-accent">Maintenance/CapEx: % of property value (annualized). Management/Vacancy: % of gross monthly rent.</p>
      )}

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">{EXPENSE_FIELDS.map(renderField)}</div>
        <hr className="border-border" />
        <div className="grid grid-cols-2 gap-3">{UTILITY_FIELDS.map(renderDollarField)}</div>
        <hr className="border-border" />
        <div>
          <PreviewResultRow label="Additional Monthly Expenses" value={derived.additionalMonthlyExpenses} format="currency" />
          <PreviewResultRow label="PITI (Monthly Payment)" value={monthlyPITI} format="currency" />
          <PreviewResultRow label="Total Monthly Expenses" value={derived.totalMonthlyExpenses} format="currency" size="large" />
          <PreviewResultRow label="Total Annual Expenses" value={derived.totalAnnualExpenses} format="currency" border={false} />
        </div>
      </div>
    </SectionCard>
  );
};

export default ExpensesSection;
