import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import type { ReservesDerived, ExpenseInputs, ExpensesDerived } from "./types";
import { formatCurrency } from "./calculations";
import ResultRow from "./ResultRow";

const EXPENSE_LABELS: { field: keyof ExpenseInputs; label: string }[] = [
  { field: "maintenanceDollar", label: "Maintenance/Repairs" },
  { field: "capexDollar", label: "CapEx" },
  { field: "vacancyDollar", label: "Vacancy Reserve" },
  { field: "managementDollar", label: "Property Management" },
  { field: "utilities", label: "Utilities" },
  { field: "trash", label: "Trash" },
  { field: "lawnSnow", label: "Lawn/Snow" },
  { field: "other", label: "Other" },
];

interface ReservesSectionProps {
  reserves: ReservesDerived;
  expenses: ExpenseInputs;
  expensesDerived: ExpensesDerived;
}

const ReservesSection = ({ reserves, expenses, expensesDerived }: ReservesSectionProps) => {
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

  const filledExpenses = EXPENSE_LABELS.filter(({ field }) => (expenses[field] as number) > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Reserves</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        <ResultRow
          label="Rent Savings Applied to Reserves (Annual)"
          value={reserves.rentSavingsAppliedAnnual}
          format="currency"
          colorCode
        />
        <div className="flex items-start justify-between gap-4 py-2.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground">6-Month Reserves Needed</span>
              <div className="relative" ref={infoRef}>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowInfo(!showInfo)}
                  className="text-muted-foreground/50 hover:text-primary transition-colors"
                  aria-label="More info about reserves"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
                {showInfo && (
                  <div className="absolute bottom-full right-0 mb-2 w-72 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-popover p-3 text-xs text-popover-foreground shadow-lg z-50">
                    <p className="leading-relaxed">
                      As a property owner, you're responsible for the major systems — roof, furnace, plumbing, appliances — and things do break over time. Tenants move out, and you may have a month or two of vacancy between leases.
                    </p>
                    <p className="leading-relaxed mt-2">
                      Having 6 months of your total monthly payment set aside gives you a safety net. You don't need to save it all at once — put aside some of the money you're saving on rent each month until you hit this target.
                    </p>
                    <p className="leading-relaxed mt-2">
                      Think of it as paying yourself first. It's not a matter of <em>if</em> something comes up, it's <em>when</em>. Being prepared means a broken water heater is an inconvenience, not a crisis.
                    </p>
                    <div className="absolute top-full right-2 -mt-px w-2 h-2 bg-popover border-b border-r border-border rotate-45" />
                  </div>
                )}
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground/50 mt-0.5 leading-snug">Emergency fund covering 6 months of PITI</p>
          </div>
          <span className="text-lg font-bold tracking-tight tabular-nums lining-nums whitespace-nowrap text-foreground">
            {formatCurrency(reserves.sixMonthReservesNeeded)}
          </span>
        </div>

        {/* Additional Monthly Expenses Recap */}
        <hr className="border-border/60 my-2" />

        <div className="pt-1 space-y-1.5">
          <ResultRow
            label="Additional Monthly Expenses"
            value={expensesDerived.additionalMonthlyExpenses}
            format="currency"
          />

          {filledExpenses.length > 0 && (
            <div className="rounded-lg bg-secondary/20 p-2.5">
              <p className="text-[10px] text-muted-foreground/70 font-medium mb-1.5">Monthly expense breakdown</p>
              <div className="space-y-1">
                {filledExpenses.map(({ field, label }) => {
                  const val = expenses[field] as number;
                  return (
                    <div key={field} className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground/60">{label}</span>
                      <span className="tabular-nums text-muted-foreground">{formatCurrency(val)}/mo</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <ResultRow
            label="Money Set-Aside For Expenses (Annually)"
            value={expensesDerived.additionalMonthlyExpenses * 12}
            format="currency"
            border={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservesSection;
