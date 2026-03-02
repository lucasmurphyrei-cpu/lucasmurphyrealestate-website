import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Percent } from "lucide-react";
import type { ExpenseInputs, ExpensesDerived, AnalysisMode, ExpenseInputMode } from "./types";
import InputField from "./InputField";
import ResultRow from "./ResultRow";
import { formatCurrency } from "./calculations";

interface ExpensesSectionProps {
  mode: AnalysisMode;
  expenses: ExpenseInputs;
  derived: ExpensesDerived;
  monthlyPITI: number;
  purchasePrice: number;
  grossMonthlyIncome: number;
  onUpdate: <K extends keyof ExpenseInputs>(field: K, value: ExpenseInputs[K]) => void;
}

const EXPENSE_FIELDS: { field: keyof ExpenseInputs; label: string; info: string }[] = [
  {
    field: "maintenanceDollar",
    label: "Maintenance/Repairs",
    info: "Budget for ongoing maintenance and minor repairs. Rule of thumb: 1-2% of property value per year, divided by 12. For a $300K property that's $250-$500/mo.",
  },
  {
    field: "capexDollar",
    label: "CapEx",
    info: "Reserve for major replacements: roof ($8K-$15K every 20-30yr), furnace ($3K-$6K every 15-20yr), water heater ($1K-$2K every 10yr). Typical: $50-$200/mo per unit.",
  },
  {
    field: "vacancyDollar",
    label: "Vacancy Reserve",
    info: "Monthly dollar amount set aside for vacancy periods. Typical: $50-$150/mo. If you already set a vacancy % in Income, you can leave this at $0.",
  },
  {
    field: "managementDollar",
    label: "Property Management",
    info: "Professional management costs 8-12% of gross rent. Self-managing saves this cost but requires your time. Many house hackers self-manage.",
  },
];

const UTILITY_FIELDS: { field: keyof ExpenseInputs; label: string; info: string }[] = [
  {
    field: "utilities",
    label: "Utilities",
    info: "Water/sewer, gas, electric, internet you pay as owner. Typical: $170-$380/mo combined. Some can be billed to tenants.",
  },
  {
    field: "trash",
    label: "Trash",
    info: "Trash pickup. Typically $20-$50/mo. Some municipalities include it in property taxes.",
  },
  {
    field: "lawnSnow",
    label: "Lawn/Snow",
    info: "Lawn care and snow removal. DIY or professional ($50-$100/mo avg if outsourced year-round).",
  },
  {
    field: "other",
    label: "Other",
    info: "Pest control, common area supplies, advertising, legal/accounting, etc.",
  },
];

// Property value based (maintenance, capex): annual % → monthly $
function dollarToPercentPV(dollar: number, purchasePrice: number): number {
  if (purchasePrice <= 0) return 0;
  return (dollar * 12 / purchasePrice) * 100;
}
function percentToDollarPV(pct: number, purchasePrice: number): number {
  return (purchasePrice * (pct / 100)) / 12;
}

// Gross rent based (management, vacancy): monthly % → monthly $
function dollarToPercentRent(dollar: number, grossMonthly: number): number {
  if (grossMonthly <= 0) return 0;
  return (dollar / grossMonthly) * 100;
}
function percentToDollarRent(pct: number, grossMonthly: number): number {
  return grossMonthly * (pct / 100);
}

const ExpensesSection = ({ mode, expenses, derived, monthlyPITI, purchasePrice, grossMonthlyIncome, onUpdate }: ExpensesSectionProps) => {
  const isOwnerOccupied = mode === "owner-occupied";
  const [inputMode, setInputMode] = useState<ExpenseInputMode>("dollar");

  const renderField = ({ field, label, info }: { field: keyof ExpenseInputs; label: string; info: string }) => {
    const dollarValue = expenses[field] as number;
    const isRentBased = field === "managementDollar" || field === "vacancyDollar";

    if (inputMode === "percent") {
      const pctValue = isRentBased
        ? dollarToPercentRent(dollarValue, grossMonthlyIncome)
        : dollarToPercentPV(dollarValue, purchasePrice);

      const pctHint = isRentBased
        ? "% mode: percentage of gross monthly rent."
        : "% mode: percentage of property value per year, shown as monthly cost.";

      return (
        <div key={field}>
          <InputField
            label={label}
            value={Math.round(pctValue * 100) / 100}
            onChange={(v) => {
              const dollar = isRentBased
                ? Math.round(percentToDollarRent(v, grossMonthlyIncome))
                : Math.round(percentToDollarPV(v, purchasePrice));
              onUpdate(field, dollar);
            }}
            suffix="%"
            step={0.1}
            min={0}
            placeholder="Enter %"
            info={info + "\n\n" + pctHint}
          />
          {dollarValue > 0 && (
            <p className="text-[10px] text-muted-foreground/60 mt-0.5 ml-0.5">
              ({formatCurrency(dollarValue)}/mo)
            </p>
          )}
        </div>
      );
    }

    return (
      <InputField
        key={field}
        label={label}
        value={dollarValue}
        onChange={(v) => onUpdate(field, v)}
        prefix="$"
        useCommas
        placeholder="Enter amount"
        info={info}
      />
    );
  };

  const renderDollarField = ({ field, label, info }: { field: keyof ExpenseInputs; label: string; info: string }) => (
    <InputField
      key={field}
      label={label}
      value={expenses[field] as number}
      onChange={(v) => onUpdate(field, v)}
      prefix="$"
      useCommas
      placeholder="Enter amount"
      info={info}
    />
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg">3. Expenses</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {isOwnerOccupied
                ? "Monthly costs while you live in the property."
                : "Monthly costs as a full rental property."}
            </p>
          </div>
          <div className="flex items-center rounded-md border border-border overflow-hidden shrink-0">
            <button
              type="button"
              onClick={() => setInputMode("dollar")}
              className={`px-2.5 py-1.5 text-xs font-medium flex items-center gap-1 transition-colors ${
                inputMode === "dollar"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <DollarSign className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => setInputMode("percent")}
              className={`px-2.5 py-1.5 text-xs font-medium flex items-center gap-1 transition-colors ${
                inputMode === "percent"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Percent className="h-3 w-3" />
            </button>
          </div>
        </div>
        {inputMode === "percent" && (
          <p className="text-[10px] text-primary/70 mt-1.5">
            Maintenance/CapEx: % of property value (annualized). Management/Vacancy: % of gross monthly rent.
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {EXPENSE_FIELDS.map(renderField)}
        </div>

        <hr className="border-border" />

        <div className="grid grid-cols-2 gap-3">
          {UTILITY_FIELDS.map(renderDollarField)}
        </div>

        <hr className="border-border" />

        <div className="space-y-0">
          <ResultRow label="Additional Monthly Expenses" value={derived.additionalMonthlyExpenses} format="currency" />
          <ResultRow label="PITI (Monthly Payment)" value={monthlyPITI} format="currency" />
          <ResultRow label="Total Monthly Expenses" value={derived.totalMonthlyExpenses} format="currency" size="large" />
          <ResultRow label="Total Annual Expenses" value={derived.totalAnnualExpenses} format="currency" border={false} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesSection;
