import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { FixedCostRow, MonthlyDerived } from "./types";
import { formatCurrency, formatPercent } from "./calculations";

interface Props {
  fixedCosts: FixedCostRow[];
  derived: MonthlyDerived;
  onUpdateRow: (id: string, field: keyof FixedCostRow, value: string | number) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
}

const FixedCostsSection = ({ fixedCosts, derived, onUpdateRow, onAddRow, onRemoveRow }: Props) => {
  const labelBase = 100;
  const amountBase = 200;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">Monthly Fixed Costs</CardTitle>
        <p className="text-xs text-muted-foreground">
          Enter your actual monthly costs. Rename labels to match your situation, and add or remove rows as needed.
          Percentages are based on your net monthly income. Press Tab to move down within a column.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {fixedCosts.map((row, i) => (
            <div key={row.id} className="flex items-center gap-2">
              <Input
                tabIndex={labelBase + i}
                className="w-36 shrink-0 h-9 text-sm"
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
              <span className="w-14 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                {derived.monthlyNet > 0 ? formatPercent(derived.costPercentages[row.id] || 0) : "—"}
              </span>
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

        {/* Total row */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <span className="w-36 shrink-0 text-sm font-semibold">Total</span>
          <div className="relative flex-1">
            <span className="text-sm font-semibold">{formatCurrency(derived.totalFixedCosts)}</span>
          </div>
          <span className="w-14 shrink-0 text-right text-xs tabular-nums font-semibold">
            {derived.monthlyNet > 0 ? formatPercent(derived.actualFixedPercent) : "—"}
          </span>
          {/* Spacer matching the remove button width */}
          <div className="h-9 w-9 shrink-0" />
        </div>

        <Button variant="outline" size="sm" className="mt-3 w-full" onClick={onAddRow}>
          + Add Row
        </Button>
      </CardContent>
    </Card>
  );
};

export default FixedCostsSection;
