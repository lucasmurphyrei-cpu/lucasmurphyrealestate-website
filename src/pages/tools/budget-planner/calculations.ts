import type {
  MonthlyEstimatorState,
  MonthlyDerived,
  IncomeSettings,
  PayFrequency,
  FilingStatus,
  AnnualBudgetState,
  AnnualDerived,
} from "./types";

// ─── Tax brackets (2025 federal) ───

interface Bracket { min: number; max: number; rate: number }

const SINGLE_BRACKETS: Bracket[] = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

const MARRIED_BRACKETS: Bracket[] = [
  { min: 0, max: 23200, rate: 0.10 },
  { min: 23200, max: 94300, rate: 0.12 },
  { min: 94300, max: 201050, rate: 0.22 },
  { min: 201050, max: 383900, rate: 0.24 },
  { min: 383900, max: 487450, rate: 0.32 },
  { min: 487450, max: 731200, rate: 0.35 },
  { min: 731200, max: Infinity, rate: 0.37 },
];

const STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 14600,
  married: 29200,
};

function estimateFederalTax(annualGross: number, status: FilingStatus): number {
  const brackets = status === "single" ? SINGLE_BRACKETS : MARRIED_BRACKETS;
  const taxableIncome = Math.max(0, annualGross - STANDARD_DEDUCTION[status]);
  let tax = 0;
  for (const b of brackets) {
    if (taxableIncome <= b.min) break;
    const taxable = Math.min(taxableIncome, b.max) - b.min;
    tax += taxable * b.rate;
  }
  // Add ~7.65% FICA (Social Security + Medicare)
  const fica = annualGross * 0.0765;
  return tax + fica;
}

export function estimateEffectiveRate(annualGross: number, status: FilingStatus): number {
  if (annualGross <= 0) return 0;
  return (estimateFederalTax(annualGross, status) / annualGross) * 100;
}

// Pay frequency → paychecks per year
const PAYCHECKS_PER_YEAR: Record<PayFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
};

export const PAY_FREQUENCY_LABELS: Record<PayFrequency, string> = {
  weekly: "Weekly",
  biweekly: "Bi-Weekly",
  semimonthly: "Semi-Monthly",
  monthly: "Monthly",
};

// ─── Monthly calculations ───

// When user enters net pay, we reverse-engineer gross using an iterative approach
// since tax is progressive and we can't simply divide by (1 - rate).
function estimateGrossFromNet(annualNet: number, status: FilingStatus): number {
  if (annualNet <= 0) return 0;
  // Start with a rough guess: net / 0.75 (assume ~25% effective rate)
  let gross = annualNet / 0.75;
  for (let i = 0; i < 20; i++) {
    const tax = estimateFederalTax(gross, status);
    const computedNet = gross - tax;
    const diff = annualNet - computedNet;
    if (Math.abs(diff) < 1) break;
    gross += diff;
  }
  return Math.max(0, gross);
}

function getActiveAmount(income: IncomeSettings): number {
  switch (income.inputMode) {
    case "annual": return income.annualAmount;
    case "paycheck-gross": return income.grossPaycheckAmount;
    case "paycheck-net": return income.netPaycheckAmount;
  }
}

function calcAnnualGross(income: IncomeSettings): number {
  const amount = getActiveAmount(income);
  if (income.inputMode === "annual") return amount;
  if (income.inputMode === "paycheck-gross") {
    return amount * PAYCHECKS_PER_YEAR[income.payFrequency];
  }
  return 0; // paycheck-net handled specially in calcMonthly
}

export function calcMonthly(state: MonthlyEstimatorState): MonthlyDerived {
  const { income, fixedCosts, yearlySubscriptions } = state;

  const paychecksPerYear = PAYCHECKS_PER_YEAR[income.payFrequency];
  const filingStatus = income.showAdvancedTax ? income.filingStatus : "single" as FilingStatus;

  let annualGross: number;
  let effectiveTaxRate: number;
  let annualNet: number;

  if (income.inputMode === "paycheck-net") {
    // User entered net paycheck — reverse-engineer gross
    annualNet = income.netPaycheckAmount * paychecksPerYear;
    annualGross = estimateGrossFromNet(annualNet, filingStatus);
    effectiveTaxRate = annualGross > 0 ? ((annualGross - annualNet) / annualGross) * 100 : 0;
  } else {
    annualGross = calcAnnualGross(income);

    if (income.showAdvancedTax && income.taxBracketOverride !== null) {
      effectiveTaxRate = income.taxBracketOverride;
    } else {
      effectiveTaxRate = estimateEffectiveRate(annualGross, filingStatus);
    }

    annualNet = annualGross * (1 - effectiveTaxRate / 100);
  }

  const monthlyGross = annualGross / 12;
  const monthlyNet = annualNet / 12;
  const paycheckGross = annualGross / paychecksPerYear;
  const paycheckNet = annualNet / paychecksPerYear;

  const totalFixedCosts = fixedCosts.reduce((sum, row) => sum + row.amount, 0);

  const costPercentages: Record<string, number> = {};
  for (const row of fixedCosts) {
    costPercentages[row.id] = monthlyNet > 0 ? (row.amount / monthlyNet) * 100 : 0;
  }

  const idealFixed = monthlyNet * 0.6;
  const idealSavings = monthlyNet * 0.2;
  const idealWants = monthlyNet * 0.2;

  const actualFixedPercent = monthlyNet > 0 ? (totalFixedCosts / monthlyNet) * 100 : 0;
  const actualRemaining = monthlyNet - totalFixedCosts;
  const actualRemainingPercent = monthlyNet > 0 ? (actualRemaining / monthlyNet) * 100 : 0;

  const yearlySubsTotal = yearlySubscriptions.reduce((sum, s) => sum + s.cost, 0);
  const yearlySubsMonthly = yearlySubsTotal / 12;

  return {
    annualGross,
    effectiveTaxRate,
    annualNet,
    monthlyGross,
    monthlyNet,
    paycheckGross,
    paycheckNet,
    totalFixedCosts,
    costPercentages,
    idealFixed,
    idealSavings,
    idealWants,
    actualFixedPercent,
    actualRemaining,
    actualRemainingPercent,
    yearlySubsTotal,
    yearlySubsMonthly,
  };
}

// ─── Annual calculations ───

export function calcAnnual(state: AnnualBudgetState): AnnualDerived {
  const { income, fixedExpenses, splitWithSpouse, guiltFree, debt, savings, assets, liabilities } = state;

  const totalMonthlyIncome = income.workIncome + income.miscIncome;
  const totalAnnualIncome = totalMonthlyIncome * 12;

  let totalFixedExpenses = 0;
  let totalFixedExpensesFull = 0;
  for (const row of fixedExpenses) {
    totalFixedExpensesFull += row.amount;
    if (splitWithSpouse && row.splitEligible) {
      totalFixedExpenses += row.amount / 2;
    } else {
      totalFixedExpenses += row.amount;
    }
  }

  const totalGuiltFree = guiltFree.reduce((s, r) => s + r.amount, 0);
  const totalDebt = debt.reduce((s, r) => s + r.amount, 0);
  const totalSavings = savings.reduce((s, r) => s + r.amount, 0);

  const totalMonthlyOutflow = totalFixedExpenses + totalGuiltFree + totalDebt + totalSavings;
  const netMonthly = totalMonthlyIncome - totalMonthlyOutflow;
  const savingsRate = totalMonthlyIncome > 0 ? (totalSavings / totalMonthlyIncome) * 100 : 0;

  const totalAssets = assets.realEstate + assets.retirement + assets.cashSavings + assets.vehicle;
  const totalLiabilities = liabilities.mortgage + liabilities.studentLoans + liabilities.otherDebt;
  const netWorth = totalAssets - totalLiabilities;

  return {
    totalMonthlyIncome,
    totalAnnualIncome,
    totalFixedExpenses,
    totalFixedExpensesFull,
    totalGuiltFree,
    totalDebt,
    totalSavings,
    totalMonthlyOutflow,
    netMonthly,
    savingsRate,
    totalAssets,
    totalLiabilities,
    netWorth,
  };
}

// ─── Formatting helpers ───

export function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
