import { useRef, useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { BudgetRow, AnnualDerived } from "./types";
import { formatCurrency } from "./calculations";

function fmtCommas(value: number): string {
  if (!value) return "";
  const parts = value.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

interface Props {
  rows: BudgetRow[];
  derived: AnnualDerived;
  onUpdateRow: (id: string, field: keyof BudgetRow, value: string | number) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
}

const GuiltFreeSection = ({ rows, derived, onUpdateRow, onAddRow, onRemoveRow }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [rawValue, setRawValue] = useState("");

  // When Tab is pressed on an amount field, jump to the next row's amount field
  const handleAmountKeyDown = useCallback((e: React.KeyboardEvent, rowIndex: number) => {
    if (e.key === "Tab" && !e.shiftKey && containerRef.current) {
      const nextIndex = rowIndex + 1;
      if (nextIndex < rows.length) {
        e.preventDefault();
        const nextAmountInput = containerRef.current.querySelector<HTMLInputElement>(
          `[data-amount-index="${nextIndex}"]`
        );
        nextAmountInput?.focus();
      }
    }
  }, [rows.length]);

  return (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg font-display">Guilt-Free Spending</CardTitle>
      <p className="text-xs text-muted-foreground">
        This is everything that <strong className="text-foreground">isn't</strong> a fixed monthly obligation — restaurants, entertainment, shopping, travel, and hobbies.
        It's called "guilt-free" because once you've covered your fixed expenses and savings, this is money you can spend without stress.
        But here's the key: <strong className="text-foreground">the less you spend here, the more you can save toward a down payment.</strong> Tracking
        these categories monthly helps you spot where small changes can make a big difference in your savings rate.
      </p>
    </CardHeader>
    <CardContent className="space-y-2">
      <div ref={containerRef} className="space-y-2">
        {rows.map((row, i) => (
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
                type="text"
                inputMode="decimal"
                data-amount-index={i}
                className="pl-7 h-9"
                value={focusedId === row.id ? rawValue : fmtCommas(row.amount)}
                onFocus={() => { setFocusedId(row.id); setRawValue(row.amount ? row.amount.toString() : ""); }}
                onBlur={() => { setFocusedId(null); }}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^[\d,]*\.?\d*$/.test(val) || val === "") {
                    setRawValue(val.replace(/,/g, ""));
                    onUpdateRow(row.id, "amount", Number(val.replace(/,/g, "")));
                  }
                }}
                onKeyDown={(e) => handleAmountKeyDown(e, i)}
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
      </div>
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
};

export default GuiltFreeSection;
