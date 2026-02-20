import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const MortgageCalculator = () => {
  const [homePrice, setHomePrice] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [result, setResult] = useState<{ monthly: number; total: number; interest: number } | null>(null);

  const calculate = () => {
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    const monthly = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const total = monthly * numPayments;
    setResult({ monthly, total, interest: total - principal });
  };

  return (
    <main className="container py-16">
      <h1 className="font-display text-4xl font-bold md:text-5xl">Mortgage Calculator</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Estimate your monthly mortgage payment based on home price, down payment, interest rate, and loan term.</p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Loan Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Home Price ($)</Label>
              <Input type="number" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} />
            </div>
            <div>
              <Label>Down Payment ($)</Label>
              <Input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} />
            </div>
            <div>
              <Label>Interest Rate (%)</Label>
              <Input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
            </div>
            <div>
              <Label>Loan Term (years)</Label>
              <Input type="number" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} />
            </div>
            <Button onClick={calculate} className="w-full">Calculate</Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader><CardTitle>Results</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Monthly Payment</span>
                <span className="text-2xl font-bold text-primary">${result.monthly.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="font-semibold">${result.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Interest</span>
                <span className="font-semibold">${result.interest.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default MortgageCalculator;