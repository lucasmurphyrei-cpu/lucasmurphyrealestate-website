import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormattedNumberInput } from "./FormattedInput";
import { Button } from "@/components/ui/button";
import type { BudgetRow, AnnualDerived } from "./types";
import { formatCurrency, formatPercent } from "./calculations";

interface Props {
  rows: BudgetRow[];
  derived: AnnualDerived;
  downPaymentSaved: number;
  onUpdateDownPaymentSaved: (value: number) => void;
  onUpdateRow: (id: string, field: keyof BudgetRow, value: string | number) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
}

const SavingsSection = ({ rows, derived, downPaymentSaved, onUpdateDownPaymentSaved, onUpdateRow, onAddRow, onRemoveRow }: Props) => {
  // Available for savings = income minus fixed expenses, guilt-free, and debt
  const availableForSavings = derived.totalMonthlyIncome - derived.totalFixedExpenses - derived.totalGuiltFree - derived.totalDebt;

  // Find the index where Monthly Investing starts (insert "saved" field after monthlySavings)
  const savingsRowIndex = rows.findIndex((r) => r.id === "monthlySavings");
  const investingRowIndex = rows.findIndex((r) => r.id === "monthlyInvesting");

  return (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg font-display">Savings & Investments</CardTitle>
      <p className="text-xs text-muted-foreground">
        Your savings rate is the single biggest factor in how quickly you can buy a home. A 20% savings rate means
        you're keeping $1 out of every $5 — most financial advisors consider this the minimum healthy target. The
        higher your savings rate, the faster you'll reach your down payment goal and the more confident you'll feel
        when making an offer.
      </p>
      {availableForSavings > 0 && (
        <div className="mt-2 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.03] p-3">
          <p className="text-xs text-muted-foreground">
            After fixed expenses, guilt-free spending, and debt, you have <strong className="text-emerald-600">{formatCurrency(availableForSavings)}/mo</strong> remaining.
            Decide how to allocate it below — put it all toward a down payment, split between savings and investing, or whatever fits your goals.
          </p>
        </div>
      )}
    </CardHeader>
    <CardContent className="space-y-2">
      {rows.map((row, i) => (
        <React.Fragment key={row.id}>
          <div className="flex items-center gap-2">
            <Input
              className="flex-1 min-w-0 h-9 text-sm"
              value={row.label}
              onChange={(e) => onUpdateRow(row.id, "label", e.target.value)}
              placeholder="Savings category"
            />
            <div className="relative w-24 shrink-0">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <FormattedNumberInput
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
          {/* Insert "How much saved" field right after Monthly Savings (Downpayment) */}
          {row.id === "monthlySavings" && (
            <div className="ml-1 pl-3 border-l-2 border-emerald-500/20 space-y-1.5 py-1">
              <label className="text-xs text-muted-foreground font-medium">
                How much do you currently have saved for a down payment?
              </label>
              <div className="relative max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <FormattedNumberInput
                  className="pl-7 h-9"
                  value={downPaymentSaved}
                  onChange={onUpdateDownPaymentSaved}
                  min={0}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">This feeds into Step 3's "How Far Out Are You?" timeline.</p>
            </div>
          )}
          {/* Add investing examples hint before Monthly Investing row */}
          {i === investingRowIndex - 1 && investingRowIndex > 0 && (
            <p className="text-[10px] text-muted-foreground pl-1 pt-1">
              Investing examples: Roth IRA, 401(k) contributions, brokerage / index funds, stocks, etc.
            </p>
          )}
        </React.Fragment>
      ))}
      <Button variant="outline" size="sm" className="w-full" onClick={onAddRow}>
        + Add Row
      </Button>
      {derived.totalSavings > 0 && (
        <div className="mt-2 rounded-lg bg-muted/50 p-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total / mo</span>
            <span className="font-semibold">{formatCurrency(derived.totalSavings)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Savings rate</span>
            <span className={`font-medium ${derived.savingsRate >= 20 ? "text-emerald-500" : "text-amber-500"}`}>
              {formatPercent(derived.savingsRate)}
            </span>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
  );
};

export default SavingsSection;
