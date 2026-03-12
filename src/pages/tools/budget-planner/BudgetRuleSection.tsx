import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { MonthlyDerived } from "./types";
import { formatCurrency, formatPercent } from "./calculations";

interface Props {
  derived: MonthlyDerived;
  savingsTargetPercent: number;
  onSavingsTargetChange: (percent: number) => void;
  onSwitchToAnnual: () => void;
}

/** Fixed costs bar — 100% filled green if under 60%, overflows red if over */
const FixedBar = ({
  actualPercent,
  dollarAmount,
}: {
  actualPercent: number;
  dollarAmount: number;
}) => {
  const target = 60;
  const meetsThreshold = actualPercent <= target;
  // Under 60% = fully filled green. Over 60% = bar scales to show how far over.
  const fillWidth = meetsThreshold ? 100 : Math.min((target / actualPercent) * 100, 100);
  const overflowWidth = meetsThreshold ? 0 : 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Fixed Costs (Needs)</span>
        <span className={`text-sm font-semibold tabular-nums ${meetsThreshold ? "text-emerald-500" : "text-red-500"}`}>
          {formatCurrency(dollarAmount)}
        </span>
      </div>
      <div className="relative h-5 rounded-full bg-muted/50 overflow-hidden">
        {meetsThreshold ? (
          <div
            className="absolute top-0 h-full rounded-full transition-all duration-300"
            style={{ width: `${fillWidth}%`, backgroundColor: "rgb(52 211 153)" }}
          />
        ) : (
          <div
            className="absolute top-0 h-full rounded-full transition-all duration-300"
            style={{ width: `${overflowWidth}%`, backgroundColor: "rgb(248 113 113)" }}
          />
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">
          {formatPercent(actualPercent)} of income — target: ≤ {formatPercent(target)}
        </p>
        <span className={`text-[10px] font-medium ${meetsThreshold ? "text-emerald-500" : "text-red-500"}`}>
          {meetsThreshold ? "On Track" : "Over"}
        </span>
      </div>
    </div>
  );
};

/** Savings / Wants bar — bar width scales to targetPercent/40 of the track,
 *  then fills green/red based on whether the available $ meets the target */
const SplitBar = ({
  label,
  targetPercent,
  availableDollar,
  targetDollar,
}: {
  label: string;
  targetPercent: number;
  availableDollar: number;
  targetDollar: number;
}) => {
  const meetsThreshold = availableDollar >= targetDollar - 0.01;
  // Bar width = proportion of the 40% total (1% = 2.5% of bar, 20% = 50%, 39% = 97.5%)
  const barMaxWidth = (targetPercent / 40) * 100;
  // Fill within that bar based on how much of the target is met
  const fillRatio = targetDollar > 0 ? Math.min(availableDollar / targetDollar, 1) : 0;
  const fillWidth = barMaxWidth * fillRatio;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className={`text-sm font-semibold tabular-nums ${meetsThreshold ? "text-emerald-500" : "text-red-500"}`}>
          {formatCurrency(availableDollar)}
        </span>
      </div>
      <div className="relative h-5 rounded-full bg-muted/50 overflow-hidden">
        {/* Target marker showing the max extent for this category */}
        <div
          className="absolute top-0 h-full border-r-2 border-dashed border-foreground/30"
          style={{ width: `${barMaxWidth}%` }}
        />
        {/* Filled portion */}
        <div
          className="absolute top-0 h-full rounded-full transition-all duration-300"
          style={{
            width: `${fillWidth}%`,
            backgroundColor: meetsThreshold ? "rgb(52 211 153)" : "rgb(248 113 113)",
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">
          {formatCurrency(availableDollar)} of {formatCurrency(targetDollar)} target ({formatPercent(targetPercent)})
        </p>
        <span className={`text-[10px] font-medium ${meetsThreshold ? "text-emerald-500" : "text-red-500"}`}>
          {meetsThreshold ? "On Track" : "Under"}
        </span>
      </div>
    </div>
  );
};

const BudgetRuleSection = ({ derived, savingsTargetPercent, onSavingsTargetChange, onSwitchToAnnual }: Props) => {
  if (derived.monthlyNet <= 0) return null;

  const wantsTargetPercent = 40 - savingsTargetPercent;

  // Target dollar amounts based on monthly net income
  const savingsTarget = derived.monthlyNet * (savingsTargetPercent / 100);
  const wantsTarget = derived.monthlyNet * (wantsTargetPercent / 100);

  // Available = remaining after fixed costs, split proportionally by target ratio
  const remaining = Math.max(0, derived.actualRemaining);
  const totalSplitPercent = savingsTargetPercent + wantsTargetPercent;
  const savingsAvailable = totalSplitPercent > 0
    ? remaining * (savingsTargetPercent / totalSplitPercent)
    : 0;
  const wantsAvailable = totalSplitPercent > 0
    ? remaining * (wantsTargetPercent / totalSplitPercent)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">60 / 20 / 20 Budget Rule</CardTitle>
        <p className="text-xs text-muted-foreground">
          A common guideline: 60% needs, 20% savings, 20% wants. Adjust the savings/wants split below to match your goals.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <FixedBar
          actualPercent={derived.actualFixedPercent}
          dollarAmount={derived.totalFixedCosts}
        />

        {/* Adjustable split — placed between fixed costs bar and the split bars */}
        <div className="rounded-lg border border-border p-4 space-y-3">
          <Label className="text-xs font-medium">Customize your savings / wants split</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Savings %</Label>
              <Input
                type="number"
                min={0}
                max={40}
                value={savingsTargetPercent}
                onChange={(e) => onSavingsTargetChange(Number(e.target.value))}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Guilt-Free %</Label>
              <Input
                type="number"
                min={0}
                max={40}
                value={wantsTargetPercent}
                onChange={(e) => onSavingsTargetChange(40 - Number(e.target.value))}
                className="h-8 text-sm"
              />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Savings + Guilt-Free = 40% of income. Adjusting one auto-updates the other.
          </p>
        </div>

        <SplitBar
          label="Savings & Investing"
          targetPercent={savingsTargetPercent}
          availableDollar={savingsAvailable}
          targetDollar={savingsTarget}
        />
        <SplitBar
          label="Guilt-Free Spending"
          targetPercent={wantsTargetPercent}
          availableDollar={wantsAvailable}
          targetDollar={wantsTarget}
        />

        {/* Remaining summary */}
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Remaining after fixed costs</span>
            <span className={`font-semibold ${derived.actualRemaining >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              {formatCurrency(derived.actualRemaining)}
            </span>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Target split: {formatCurrency(savingsTarget)} savings + {formatCurrency(wantsTarget)} guilt-free
          </p>
        </div>

        {/* CTA to Annual Budget Planner */}
        <div className="rounded-lg border border-primary/20 bg-primary/[0.03] p-4 space-y-2">
          <p className="text-sm font-medium">Want to see how you actually stack up?</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Head over to the <strong className="text-foreground">Annual Budget Planner</strong> tab to input your real savings, guilt-free spending, and debt payments — then see exactly how your budget compares to the 60/20/20 rule.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Haven't tracked your spending yet? <strong className="text-foreground">Download my free budget spreadsheet</strong> using the form on this page, track your spending for 1–3 months to see what you actually spend in each category, then come back and fill out the Annual Budget Planner with real numbers.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 text-xs"
            onClick={onSwitchToAnnual}
          >
            Go to Annual Budget Planner →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetRuleSection;
