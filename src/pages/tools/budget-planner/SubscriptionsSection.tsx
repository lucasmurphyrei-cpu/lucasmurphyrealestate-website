import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { YearlySubscription, MonthlyDerived } from "./types";
import { formatCurrency } from "./calculations";
import { FormattedNumberInput } from "./FormattedInput";

interface Props {
  subscriptions: YearlySubscription[];
  derived: MonthlyDerived;
  onAdd: (sub: YearlySubscription) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: "name" | "cost", value: string | number) => void;
}

const SubscriptionsSection = ({ subscriptions, derived, onAdd, onRemove, onUpdate }: Props) => {
  const handleAddRow = () => {
    onAdd({ id: crypto.randomUUID(), name: "", cost: 0 });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">Yearly Subscriptions</CardTitle>
        <p className="text-xs text-muted-foreground">
          Track annual subscriptions and recurring costs separately so they don't catch you off guard.
          Common ones people miss: credit card annual fees, car registration/title, professional memberships,
          Amazon Prime, gym contracts, software licenses, AAA, identity theft protection, and annual insurance premiums.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {subscriptions.map((sub) => (
          <div key={sub.id}>
            <div className="flex items-center gap-2">
              <Input
                className="flex-1 h-9"
                value={sub.name}
                onChange={(e) => onUpdate(sub.id, "name", e.target.value)}
                placeholder="Subscription name"
              />
              <div className="relative w-28">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <FormattedNumberInput
                  className="pl-7 h-9"
                  value={sub.cost}
                  onChange={(v) => onUpdate(sub.id, "cost", v)}
                  min={0}
                />
              </div>
              <Button
                tabIndex={-1}
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 text-muted-foreground hover:text-red-500"
                onClick={() => onRemove(sub.id)}
              >
                &times;
              </Button>
            </div>
            {sub.cost > 0 && (
              <p className="text-[10px] text-muted-foreground text-right pr-11 -mt-0.5">
                {formatCurrency(sub.cost / 12)}/mo
              </p>
            )}
          </div>
        ))}

        <Button variant="outline" size="sm" className="w-full" onClick={handleAddRow}>
          + Add Row
        </Button>

        {subscriptions.length > 0 && (
          <div className="mt-3 rounded-lg bg-muted/50 p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total / yr</span>
              <span className="font-semibold">{formatCurrency(derived.yearlySubsTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monthly equivalent</span>
              <span className="font-semibold text-primary">{formatCurrency(derived.yearlySubsMonthly)}/mo</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionsSection;
