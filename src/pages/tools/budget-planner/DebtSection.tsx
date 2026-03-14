import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { BudgetRow } from "./types";
import { formatCurrency } from "./calculations";
import { FormattedCurrencyInput } from "./FormattedInput";

interface Props {
  rows: BudgetRow[];
  onUpdateRow: (id: string, field: keyof BudgetRow, value: string | number) => void;
}

const DebtSection = ({ rows, onUpdateRow }: Props) => {
  const total = rows.reduce((s, r) => s + r.amount, 0);
  const firstRow = rows[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">Debt Repayment</CardTitle>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Enter your total monthly debt payments. Common examples include <strong className="text-foreground">student loans, car payments, personal loans, credit card minimums, medical debt,</strong> and <strong className="text-foreground">buy-now-pay-later plans</strong>.
          If you entered debt payments in Step 1, that amount has been carried over here automatically.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {firstRow && (
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Total Monthly Debt Payments</Label>
            <FormattedCurrencyInput
              value={firstRow.amount}
              onChange={(v) => onUpdateRow(firstRow.id, "amount", v)}
            />
          </div>
        )}
        {total > 0 && (
          <div className="rounded-lg bg-muted/50 p-3 flex justify-between text-sm">
            <span className="text-muted-foreground">Debt / mo</span>
            <span className="font-semibold">{formatCurrency(total)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DebtSection;
