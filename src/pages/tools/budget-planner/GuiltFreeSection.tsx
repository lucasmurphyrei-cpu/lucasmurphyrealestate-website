import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { BudgetRow, AnnualDerived } from "./types";
import { formatCurrency } from "./calculations";

interface Props {
  rows: BudgetRow[];
  derived: AnnualDerived;
  onUpdateRow: (id: string, field: keyof BudgetRow, value: string | number) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
}

const GuiltFreeSection = ({ rows, derived, onUpdateRow, onAddRow, onRemoveRow }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg font-display">Guilt-Free Spending</CardTitle>
      <p className="text-xs text-muted-foreground">Monthly discretionary spending — the fun stuff. Rename labels or add/remove rows to fit your situation.</p>
    </CardHeader>
    <CardContent className="space-y-2">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-2">
          <Input
            className="w-44 shrink-0 h-9 text-sm"
            value={row.label}
            onChange={(e) => onUpdateRow(row.id, "label", e.target.value)}
            placeholder="Category name"
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
      {derived.totalGuiltFree > 0 && (
        <div className="mt-2 rounded-lg bg-muted/50 p-3 flex justify-between text-sm">
          <span className="text-muted-foreground">Total / mo</span>
          <span className="font-semibold">{formatCurrency(derived.totalGuiltFree)}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

export default GuiltFreeSection;
