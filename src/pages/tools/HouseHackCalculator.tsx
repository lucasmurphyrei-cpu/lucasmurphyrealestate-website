import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const HouseHackCalculator = () => {
  const [purchasePrice, setPurchasePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(20000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [rentalIncome, setRentalIncome] = useState(2000);
  const [taxes, setTaxes] = useState(400);
  const [insurance, setInsurance] = useState(150);
  const [maintenance, setMaintenance] = useState(200);
  const [result, setResult] = useState<{ mortgage: number; totalCost: number; netCost: number; cashFlow: number } | null>(null);

  const calculate = () => {
    const principal = purchasePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    const mortgage = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalCost = mortgage + taxes + insurance + maintenance;
    const netCost = totalCost - rentalIncome;
    setResult({ mortgage, totalCost, netCost, cashFlow: -netCost });
  };

  return (
    <main className="container py-16">
      <h1 className="font-display text-4xl font-bold md:text-5xl">House Hack Calculator</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">See how much you can offset your housing costs by renting out part of your property. Enter your numbers to calculate your effective monthly cost.</p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Property Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Purchase Price ($)</Label>
              <Input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} />
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
            <hr className="border-border" />
            <div>
              <Label>Expected Monthly Rental Income ($)</Label>
              <Input type="number" value={rentalIncome} onChange={(e) => setRentalIncome(Number(e.target.value))} />
            </div>
            <div>
              <Label>Monthly Property Taxes ($)</Label>
              <Input type="number" value={taxes} onChange={(e) => setTaxes(Number(e.target.value))} />
            </div>
            <div>
              <Label>Monthly Insurance ($)</Label>
              <Input type="number" value={insurance} onChange={(e) => setInsurance(Number(e.target.value))} />
            </div>
            <div>
              <Label>Monthly Maintenance ($)</Label>
              <Input type="number" value={maintenance} onChange={(e) => setMaintenance(Number(e.target.value))} />
            </div>
            <Button onClick={calculate} className="w-full">Calculate</Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="h-fit">
            <CardHeader><CardTitle>Results</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Mortgage Payment</span>
                <span className="font-semibold">${result.mortgage.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Total Monthly Costs</span>
                <span className="font-semibold">${result.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Rental Income Offset</span>
                <span className="font-semibold text-green-500">-${rentalIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your Effective Cost</span>
                <span className={`text-2xl font-bold ${result.netCost <= 0 ? "text-green-500" : "text-primary"}`}>
                  ${result.netCost.toFixed(2)}
                </span>
              </div>
              {result.cashFlow > 0 && (
                <p className="mt-2 text-sm text-green-500 font-medium">🎉 You're cash-flow positive! You'd earn ${result.cashFlow.toFixed(2)}/mo.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default HouseHackCalculator;