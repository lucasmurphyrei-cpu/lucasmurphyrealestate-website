import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { MonthlyDerived } from "./types";
import { formatCurrency, formatPercent } from "./calculations";

interface Props {
  derived: MonthlyDerived;
  onSwitchToAnnual: () => void;
}

const BudgetRuleSection = ({ derived, onSwitchToAnnual }: Props) => {
  if (derived.monthlyNet <= 0) return null;

  const remaining = derived.actualRemaining;
  const isPositive = remaining >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">Your Fixed Costs at a Glance</CardTitle>
        <p className="text-xs text-muted-foreground">
          Here's what your fixed expenses look like against your take-home pay.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary rows */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly Net Income</span>
            <span className="font-semibold">{formatCurrency(derived.monthlyNet)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Fixed Costs</span>
            <span className="font-semibold">{formatCurrency(derived.totalFixedCosts)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Fixed costs as % of income</span>
            <span className="font-medium text-muted-foreground">{formatPercent(derived.actualFixedPercent)}</span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between text-sm">
            <span className="font-medium">Left Over for Savings & Spending</span>
            <span className={`text-lg font-bold ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
              {formatCurrency(remaining)}
            </span>
          </div>
        </div>

        {/* Highlight where the remaining money goes */}
        {isPositive && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.03] p-4 space-y-1">
            <p className="text-sm font-medium text-emerald-600">
              {formatCurrency(remaining)}/mo available
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This is what you have left each month after fixed obligations. In Step 2 you'll decide how to split it between <strong className="text-foreground">savings & investing</strong> (down payment fund, retirement, etc.) and <strong className="text-foreground">guilt-free spending</strong> (dining out, entertainment, shopping, travel).
            </p>
          </div>
        )}

        {!isPositive && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/[0.03] p-4 space-y-1">
            <p className="text-sm font-medium text-red-500">
              Your fixed costs exceed your income by {formatCurrency(Math.abs(remaining))}/mo
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Before thinking about saving for a home, you'll need to reduce your fixed expenses or increase your income. Review the items above and look for anything you can cut or negotiate down.
            </p>
          </div>
        )}

        {/* CTA to Step 2 */}
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.03] p-4 space-y-2">
          <p className="text-sm font-medium">Ready for Step 2?</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Now that you know your fixed costs, it's time to look at the full picture — your <strong className="text-foreground">guilt-free spending</strong> (restaurants, entertainment, shopping) and how much you're actually saving each month.
            The gap between what you earn and what you spend is what determines how fast you can save for a home.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Don't know your exact spending? <strong className="text-foreground">Download my free budget spreadsheet</strong> using the form on this page, track your actual spending for 1–3 months, then come back with real numbers. That data is gold when planning a home purchase.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 text-xs"
            onClick={onSwitchToAnnual}
          >
            Continue to Step 2: Guilt-Free Spending & Savings →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetRuleSection;
