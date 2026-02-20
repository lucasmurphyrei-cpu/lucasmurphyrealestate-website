import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Housing (Mortgage/Rent)", default: 0 },
  { name: "Utilities", default: 0 },
  { name: "Insurance", default: 0 },
  { name: "Property Taxes", default: 0 },
  { name: "HOA Fees", default: 0 },
  { name: "Maintenance/Repairs", default: 0 },
  { name: "Groceries", default: 0 },
  { name: "Transportation", default: 0 },
  { name: "Savings", default: 0 },
  { name: "Other", default: 0 },
];

const BudgetSpreadsheet = () => {
  const [income, setIncome] = useState(5000);
  const [expenses, setExpenses] = useState<Record<string, number>>(
    Object.fromEntries(categories.map((c) => [c.name, c.default]))
  );

  const totalExpenses = Object.values(expenses).reduce((a, b) => a + b, 0);
  const remaining = income - totalExpenses;

  return (
    <main className="container py-16">
      <h1 className="font-display text-4xl font-bold md:text-5xl">Budget Spreadsheet</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Plan your monthly homeownership budget. Enter your income and estimated expenses to see how much you can comfortably afford.</p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Monthly Income & Expenses</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Monthly Take-Home Income ($)</Label>
              <Input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
            </div>
            <hr className="border-border" />
            {categories.map((cat) => (
              <div key={cat.name}>
                <Label>{cat.name} ($)</Label>
                <Input
                  type="number"
                  value={expenses[cat.name]}
                  onChange={(e) => setExpenses((prev) => ({ ...prev, [cat.name]: Number(e.target.value) }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Monthly Income</span>
              <span className="font-semibold">${income.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Total Expenses</span>
              <span className="font-semibold">${totalExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Remaining</span>
              <span className={`text-2xl font-bold ${remaining >= 0 ? "text-green-500" : "text-red-500"}`}>
                ${remaining.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default BudgetSpreadsheet;