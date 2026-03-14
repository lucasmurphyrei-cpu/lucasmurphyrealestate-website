import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AnnualExpenseRow } from "./types";
import { FormattedNumberInput } from "./FormattedInput";

interface Props {
  expenses: AnnualExpenseRow[];
  onUpdateRow: (id: string, field: keyof AnnualExpenseRow, value: string | number) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
}

const AnnualExpensesSection = ({ expenses, onUpdateRow, onAddRow, onRemoveRow }: Props) => {
  const labelBase = 300;
  const amountBase = 400;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">Monthly Fixed Expenses</CardTitle>
        <p className="text-xs text-muted-foreground">
          These are synced from Step 1. You can edit them here — changes will be reflected in your budget summary.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {expenses.map((row, i) => (
            <div key={row.id} className="flex items-center gap-2">
              <Input
                tabIndex={labelBase + i}
                className="w-40 shrink-0 h-9 text-sm"
                value={row.label}
                onChange={(e) => onUpdateRow(row.id, "label", e.target.value)}
                placeholder="Expense name"
              />
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <FormattedNumberInput
                  tabIndex={amountBase + i}
                  className="pl-7 h-9"
                  value={row.amount}
                  onChange={(v) => onUpdateRow(row.id, "amount", v)}
                  min={0}
                />
              </div>
              <Button
                tabIndex={-1}
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 shrink-0 text-muted-foreground hover:text-red-500"
                onClick={() => onRemoveRow(row.id)}
              >
                &times;
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" className="w-full" onClick={onAddRow}>
          + Add Row
        </Button>
      </CardContent>
    </Card>
  );
};

export default AnnualExpensesSection;
