import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AnnualIncome } from "./types";

const FIELDS: { key: keyof AnnualIncome; label: string }[] = [
  { key: "workIncome", label: "Income from Work" },
  { key: "miscIncome", label: "Miscellaneous Income" },
];

interface Props {
  income: AnnualIncome;
  onUpdate: <K extends keyof AnnualIncome>(key: K, value: number) => void;
}

const AnnualIncomeSection = ({ income, onUpdate }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg font-display">Monthly Income</CardTitle>
      <p className="text-xs text-muted-foreground">Enter your average monthly income from all sources.</p>
    </CardHeader>
    <CardContent className="space-y-3">
      {FIELDS.map(({ key, label }) => (
        <div key={key} className="flex items-center gap-3">
          <span className="w-44 shrink-0 text-sm text-muted-foreground">{label}</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input
              type="number"
              min={0}
              className="pl-7 h-9"
              value={income[key] || ""}
              onChange={(e) => onUpdate(key, Number(e.target.value))}
              placeholder="0"
            />
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default AnnualIncomeSection;
