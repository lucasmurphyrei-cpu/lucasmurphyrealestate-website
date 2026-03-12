import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { IncomeSettings, MonthlyDerived, PayFrequency, FilingStatus } from "./types";
import { formatCurrency, formatPercent, PAY_FREQUENCY_LABELS, estimateEffectiveRate } from "./calculations";

const FREQUENCY_OPTIONS: PayFrequency[] = ["weekly", "biweekly", "semimonthly", "monthly"];

const TAX_BRACKET_OPTIONS = [
  { label: "Auto-estimate for me", value: null },
  { label: "10%", value: 10 },
  { label: "12%", value: 12 },
  { label: "22%", value: 22 },
  { label: "24%", value: 24 },
  { label: "32%", value: 32 },
  { label: "35%", value: 35 },
  { label: "37%", value: 37 },
];

interface Props {
  income: IncomeSettings;
  derived: MonthlyDerived;
  onUpdate: <K extends keyof IncomeSettings>(key: K, value: IncomeSettings[K]) => void;
}

const MonthlyIncomeSection = ({ income, derived, onUpdate }: Props) => {
  const hasIncome = derived.annualGross > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">Income</CardTitle>
        <p className="text-xs text-muted-foreground">Enter your income using either your annual salary or a typical paycheck amount.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input mode toggle */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={income.inputMode === "annual" ? "default" : "outline"}
            size="sm"
            onClick={() => onUpdate("inputMode", "annual")}
          >
            Annual Salary
          </Button>
          <Button
            variant={income.inputMode === "paycheck-gross" ? "default" : "outline"}
            size="sm"
            onClick={() => onUpdate("inputMode", "paycheck-gross")}
          >
            Paycheck (Gross)
          </Button>
          <Button
            variant={income.inputMode === "paycheck-net" ? "default" : "outline"}
            size="sm"
            onClick={() => onUpdate("inputMode", "paycheck-net")}
          >
            Paycheck (Net / Take-Home)
          </Button>
        </div>

        {/* Pay frequency (paycheck modes only) */}
        {income.inputMode !== "annual" && (
          <div className="space-y-1">
            <Label className="text-sm">How often are you paid?</Label>
            <div className="flex flex-wrap gap-2">
              {FREQUENCY_OPTIONS.map((freq) => (
                <Button
                  key={freq}
                  variant={income.payFrequency === freq ? "default" : "outline"}
                  size="sm"
                  onClick={() => onUpdate("payFrequency", freq)}
                  className="text-xs"
                >
                  {PAY_FREQUENCY_LABELS[freq]}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Amount input */}
        <div className="space-y-1">
          <Label className="text-sm">
            {income.inputMode === "annual"
              ? "Annual Gross Salary"
              : income.inputMode === "paycheck-gross"
                ? `Gross Pay per ${PAY_FREQUENCY_LABELS[income.payFrequency]} Paycheck`
                : `Take-Home (Net) Pay per ${PAY_FREQUENCY_LABELS[income.payFrequency]} Paycheck`}
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input
              type="number"
              min={0}
              className="pl-7"
              value={
                income.inputMode === "annual"
                  ? income.annualAmount || ""
                  : income.inputMode === "paycheck-gross"
                    ? income.grossPaycheckAmount || ""
                    : income.netPaycheckAmount || ""
              }
              onChange={(e) => {
                const val = Number(e.target.value);
                if (income.inputMode === "annual") onUpdate("annualAmount", val);
                else if (income.inputMode === "paycheck-gross") onUpdate("grossPaycheckAmount", val);
                else onUpdate("netPaycheckAmount", val);
              }}
              placeholder="0"
            />
          </div>
        </div>

        {/* Advanced tax settings — hidden in net mode since tax is already factored in */}
        {income.inputMode !== "paycheck-net" && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onUpdate("showAdvancedTax", !income.showAdvancedTax)}
            className="text-xs text-primary hover:underline transition-colors"
          >
            {income.showAdvancedTax ? "Hide" : "Show"} tax settings (optional)
          </button>

          {income.showAdvancedTax && (
            <div className="rounded-lg border border-border p-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                For a more accurate take-home estimate, tell us your filing status. We'll use 2025 federal tax brackets + FICA to estimate your effective rate.
              </p>

              <div className="space-y-1">
                <Label className="text-xs">Filing Status</Label>
                <div className="flex gap-2">
                  {(["single", "married"] as FilingStatus[]).map((s) => (
                    <Button
                      key={s}
                      variant={income.filingStatus === s ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        onUpdate("filingStatus", s);
                        onUpdate("taxBracketOverride", null);
                      }}
                      className="text-xs capitalize"
                    >
                      {s === "married" ? "Married Filing Jointly" : "Single"}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Tax Rate</Label>
                <select
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm"
                  value={income.taxBracketOverride === null ? "auto" : String(income.taxBracketOverride)}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdate("taxBracketOverride", val === "auto" ? null : Number(val));
                  }}
                >
                  {TAX_BRACKET_OPTIONS.map((opt) => (
                    <option key={opt.label} value={opt.value === null ? "auto" : opt.value}>
                      {opt.value === null
                        ? `Auto-estimate (~${formatPercent(estimateEffectiveRate(derived.annualGross, income.filingStatus))})`
                        : opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-foreground">
                  {income.taxBracketOverride !== null
                    ? "Using your manual override."
                    : "Estimated effective rate includes federal income tax + 7.65% FICA. Does not include state tax."}
                </p>
              </div>
            </div>
          )}
        </div>
        )}

        {income.inputMode === "paycheck-net" && (
          <p className="text-xs text-muted-foreground">
            Since you entered your take-home pay, we'll estimate your gross income and tax rate automatically.
          </p>
        )}

        {/* Income breakdown display */}
        {hasIncome && (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Annual Gross</p>
                <p className="mt-1 text-sm font-semibold">{formatCurrency(derived.annualGross)}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Est. Tax Rate</p>
                <p className="mt-1 text-sm font-semibold">{formatPercent(derived.effectiveTaxRate)}</p>
              </div>
            </div>
            <div className={`grid gap-3 ${income.inputMode === "annual" ? "grid-cols-2" : "grid-cols-3"}`}>
              {income.inputMode !== "annual" && (
                <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {PAY_FREQUENCY_LABELS[income.payFrequency]} Net
                  </p>
                  <p className="mt-1 text-sm font-semibold">{formatCurrency(derived.paycheckNet)}</p>
                </div>
              )}
              <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Monthly Net</p>
                <p className="mt-1 text-sm font-semibold">{formatCurrency(derived.monthlyNet)}</p>
              </div>
              <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Annual Net</p>
                <p className="mt-1 text-sm font-semibold">{formatCurrency(derived.annualNet)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyIncomeSection;
