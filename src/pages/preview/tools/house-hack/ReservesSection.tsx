import type { ReservesDerived, ExpenseInputs, ExpensesDerived } from "@/pages/tools/house-hack/types";
import { formatCurrency } from "@/pages/tools/house-hack/calculations";
import { PreviewResultRow, SectionCard, SectionTitle, InfoTip } from "./previewUi";

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
  const filledExpenses = EXPENSE_LABELS.filter(({ field }) => (expenses[field] as number) > 0);

  return (
    <SectionCard>
      <SectionTitle>Reserves</SectionTitle>
      <div>
        <PreviewResultRow label="Rent Savings Applied to Reserves (Annual)" value={reserves.rentSavingsAppliedAnnual} format="currency" colorCode />
        <div className="flex items-start justify-between gap-4 py-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground">6-Month Reserves Needed</span>
              <InfoTip text="As a property owner, you're responsible for the major systems — roof, furnace, plumbing, appliances — and things break over time. Tenants move out, and you may have a month or two of vacancy between leases. Having 6 months of your total monthly payment set aside gives you a safety net. Build it from the money you're saving on rent each month. It's not a matter of if something comes up, it's when." />
            </div>
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground/60">Emergency fund covering 6 months of PITI</p>
          </div>
          <span className="whitespace-nowrap text-lg font-bold tracking-tight tabular-nums text-foreground">{formatCurrency(reserves.sixMonthReservesNeeded)}</span>
        </div>

        <hr className="my-2 border-border/60" />

        <div className="space-y-1.5 pt-1">
          <PreviewResultRow label="Additional Monthly Expenses" value={expensesDerived.additionalMonthlyExpenses} format="currency" />
          {filledExpenses.length > 0 && (
            <div className="rounded-sm bg-secondary/40 p-2.5">
              <p className="mb-1.5 text-[10px] font-medium text-muted-foreground/70">Monthly expense breakdown</p>
              <div className="space-y-1">
                {filledExpenses.map(({ field, label }) => (
                  <div key={field} className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground/70">{label}</span>
                    <span className="tabular-nums text-muted-foreground">{formatCurrency(expenses[field] as number)}/mo</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <PreviewResultRow label="Money Set-Aside For Expenses (Annually)" value={expensesDerived.additionalMonthlyExpenses * 12} format="currency" border={false} />
        </div>
      </div>
    </SectionCard>
  );
};

export default ReservesSection;
