import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AnnualExpenseRow } from "./types";

interface Props {
  expenses: AnnualExpenseRow[];
  splitWithSpouse: boolean;
  onUpdateRow: (id: string, field: keyof AnnualExpenseRow, value: string | number | boolean) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onToggleSplit: () => void;
}

const AnnualExpensesSection = ({ expenses, splitWithSpouse, onUpdateRow, onAddRow, onRemoveRow, onToggleSplit }: Props) => {
  const labelBase = 300;
  const amountBase = 400;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">Monthly Fixed Expenses</CardTitle>
        <p className="text-xs text-muted-foreground">
          Enter the full monthly amount for each expense. Rename labels or add/remove rows to fit your situation.
          Press Tab to move down within a column.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Spouse split toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none rounded-lg bg-muted/50 p-3">
          <input
            type="checkbox"
            checked={splitWithSpouse}
            onChange={onToggleSplit}
            className="h-4 w-4 rounded border-border accent-primary"
          />
          <div>
            <span className="text-sm font-medium">Split with spouse (50/50)</span>
            <p className="text-[10px] text-muted-foreground">
              Applies to items marked with the split toggle below
            </p>
          </div>
        </label>

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
                <Input
                  tabIndex={amountBase + i}
                  type="number"
                  min={0}
                  className="pl-7 h-9"
                  value={row.amount || ""}
                  onChange={(e) => onUpdateRow(row.id, "amount", Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              {/* Split eligible checkbox */}
              <label className="shrink-0 flex items-center gap-1 cursor-pointer" title="Include in 50/50 split">
                <input
                  tabIndex={-1}
                  type="checkbox"
                  checked={row.splitEligible}
                  onChange={(e) => onUpdateRow(row.id, "splitEligible", e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-border accent-primary"
                />
                <span className="text-[10px] text-muted-foreground">50%</span>
              </label>
              {/* Show effective amount when split is active */}
              {splitWithSpouse && row.splitEligible && row.amount > 0 && (
                <span className="w-16 shrink-0 text-right text-xs tabular-nums text-primary font-medium">
                  ${(row.amount / 2).toFixed(0)}/mo
                </span>
              )}
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
