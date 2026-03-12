import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { YearlySubscription, MonthlyDerived } from "./types";
import { formatCurrency } from "./calculations";

interface Props {
  subscriptions: YearlySubscription[];
  derived: MonthlyDerived;
  onAdd: (sub: YearlySubscription) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: "name" | "cost", value: string | number) => void;
}

const SubscriptionsSection = ({ subscriptions, derived, onAdd, onRemove, onUpdate }: Props) => {
  const [newName, setNewName] = useState("");
  const [newCost, setNewCost] = useState("");

  const handleAdd = () => {
    if (!newName.trim() || !newCost) return;
    onAdd({ id: crypto.randomUUID(), name: newName.trim(), cost: Number(newCost) });
    setNewName("");
    setNewCost("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">Yearly Subscriptions</CardTitle>
        <p className="text-xs text-muted-foreground">Track annual subscriptions separately so they don't catch you off guard.</p>
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
                <Input
                  type="number"
                  min={0}
                  className="pl-7 h-9"
                  value={sub.cost || ""}
                  onChange={(e) => onUpdate(sub.id, "cost", Number(e.target.value))}
                />
              </div>
              <Button
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

        {/* Add new row */}
        <div>
          <div className="flex items-center gap-2 pt-1">
            <Input
              className="flex-1 h-9"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New subscription"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <div className="relative w-28">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                min={0}
                className="pl-7 h-9"
                value={newCost}
                onChange={(e) => setNewCost(e.target.value)}
                placeholder="0"
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9" onClick={handleAdd}>
              Add
            </Button>
          </div>
          {Number(newCost) > 0 && (
            <p className="text-[10px] text-muted-foreground text-right pr-16 -mt-0.5">
              {formatCurrency(Number(newCost) / 12)}/mo
            </p>
          )}
        </div>

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
