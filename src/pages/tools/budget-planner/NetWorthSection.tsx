import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { NetWorthAssets, NetWorthLiabilities, AnnualDerived } from "./types";
import { formatCurrency } from "./calculations";

const ASSET_FIELDS: { key: keyof NetWorthAssets; label: string }[] = [
  { key: "realEstate", label: "Real Estate (Market Value)" },
  { key: "retirement", label: "Retirement Accounts" },
  { key: "cashSavings", label: "Cash & Savings" },
  { key: "vehicle", label: "Vehicle Value" },
];

const LIABILITY_FIELDS: { key: keyof NetWorthLiabilities; label: string }[] = [
  { key: "mortgage", label: "Mortgage Balance" },
  { key: "studentLoans", label: "Student Loans" },
  { key: "otherDebt", label: "Other Debt" },
];

interface Props {
  showNetWorth: boolean;
  assets: NetWorthAssets;
  liabilities: NetWorthLiabilities;
  derived: AnnualDerived;
  onToggle: () => void;
  onUpdateAsset: <K extends keyof NetWorthAssets>(key: K, value: number) => void;
  onUpdateLiability: <K extends keyof NetWorthLiabilities>(key: K, value: number) => void;
}

const NetWorthSection = ({ showNetWorth, assets, liabilities, derived, onToggle, onUpdateAsset, onUpdateLiability }: Props) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div>
        <CardTitle className="text-lg font-display">Net Worth Tracker</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">Optional — track your overall financial position.</p>
      </div>
      <Button variant="outline" size="sm" onClick={onToggle}>
        {showNetWorth ? "Hide" : "Show"}
      </Button>
    </CardHeader>

    {showNetWorth && (
      <CardContent className="space-y-5">
        {/* Assets */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Assets</h4>
          <div className="space-y-3">
            {ASSET_FIELDS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="w-48 shrink-0 text-sm text-muted-foreground">{label}</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input
                    type="number"
                    min={0}
                    className="pl-7 h-9"
                    value={assets[key] || ""}
                    onChange={(e) => onUpdateAsset(key, Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Liabilities */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Liabilities</h4>
          <div className="space-y-3">
            {LIABILITY_FIELDS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="w-48 shrink-0 text-sm text-muted-foreground">{label}</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input
                    type="number"
                    min={0}
                    className="pl-7 h-9"
                    value={liabilities[key] || ""}
                    onChange={(e) => onUpdateLiability(key, Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-lg border border-border p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Assets</span>
            <span className="font-semibold">{formatCurrency(derived.totalAssets)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Liabilities</span>
            <span className="font-semibold text-red-400">{formatCurrency(derived.totalLiabilities)}</span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Net Worth</span>
            <span className={`text-lg font-bold ${derived.netWorth >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              {formatCurrency(derived.netWorth)}
            </span>
          </div>
        </div>
      </CardContent>
    )}
  </Card>
);

export default NetWorthSection;
