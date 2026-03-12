import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { BudgetRow } from "./types";
import { formatCurrency } from "./calculations";

interface Props {
  rows: BudgetRow[];
  onUpdateRow: (id: string, field: keyof BudgetRow, value: string | number) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
}

const DebtSection = ({ rows, onUpdateRow, onAddRow, onRemoveRow }: Props) => {
  const total = rows.reduce((s, r) => s + r.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">Debt Payments</CardTitle>
        <p className="text-xs text-muted-foreground">Monthly payments toward loans and debt payoff. Rename labels or add/remove rows as needed.</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center gap-2">
            <Input
              className="w-44 shrink-0 h-9 text-sm"
              value={row.label}
              onChange={(e) => onUpdateRow(row.id, "label", e.target.value)}
              placeholder="Payment name"
            />
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                min={0}
                className="pl-7 h-9"
                value={row.amount || ""}
                onChange={(e) => onUpdateRow(row.id, "amount", Number(e.target.value))}
                placeholder="0"
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
        <Button variant="outline" size="sm" className="w-full" onClick={onAddRow}>
          + Add Row
        </Button>
        {total > 0 && (
          <div className="mt-2 rounded-lg bg-muted/50 p-3 flex justify-between text-sm">
            <span className="text-muted-foreground">Total / mo</span>
            <span className="font-semibold">{formatCurrency(total)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DebtSection;
