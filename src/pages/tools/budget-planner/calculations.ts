import type {
  MonthlyEstimatorState,
  MonthlyDerived,
  IncomeSettings,
  PayFrequency,
  FilingStatus,
  AnnualBudgetState,
  AnnualDerived,
  AffordabilityInputs,
  AffordabilityDerived,
  PhilosophyResult,
  MortgageCalcInputs,
  MortgageCalcDerived,
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
  const { income, fixedExpenses, guiltFree, debt, savings, assets, liabilities } = state;

  const totalMonthlyIncome = income.workIncome + income.miscIncome;
  const totalAnnualIncome = totalMonthlyIncome * 12;

  const totalFixedExpenses = fixedExpenses.reduce((s, r) => s + r.amount, 0);

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

// ─── Affordability calculations ───

/** Monthly principal + interest payment for a given loan amount */
function calcMonthlyPI(loanAmount: number, annualRate: number, termYears: number): number {
  if (loanAmount <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return loanAmount / n;
  return loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/** Max loan amount for a given max monthly P&I payment */
function calcMaxLoan(maxMonthlyPI: number, annualRate: number, termYears: number): number {
  if (maxMonthlyPI <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return maxMonthlyPI * n;
  return maxMonthlyPI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
}

/**
 * Iteratively solve for max home price given a max total housing budget.
 * Property tax and PMI depend on home price, creating a circular dependency.
 * Uses downPaymentPercent to compute down payment as a % of the resulting home price.
 * piOnly = true means the budget covers only P&I (Ramsey approach).
 */
function solveMaxHomePrice(
  maxHousingBudget: number,
  inputs: AffordabilityInputs,
  termOverride?: number,
  piOnly = false,
): { homePrice: number; loanAmount: number; monthlyPI: number; monthlyTaxes: number; monthlyInsurance: number; monthlyPMI: number; downPaymentAmount: number } {
  const term = termOverride ?? inputs.loanTerm;
  const monthlyInsurance = inputs.homeInsuranceAnnual / 12;
  const dpFraction = Math.min(inputs.downPaymentPercent, 99) / 100; // e.g. 20% → 0.20
  const loanFraction = 1 - dpFraction; // portion financed

  if (maxHousingBudget <= 0 || loanFraction <= 0) {
    return { homePrice: 0, loanAmount: 0, monthlyPI: 0, monthlyTaxes: 0, monthlyInsurance: 0, monthlyPMI: 0, downPaymentAmount: 0 };
  }

  if (piOnly) {
    // Ramsey: budget is for P&I only. Taxes/insurance/PMI are additional.
    const maxLoan = calcMaxLoan(maxHousingBudget, inputs.interestRate, term);
    const homePrice = maxLoan / loanFraction;
    const loanAmount = homePrice * loanFraction;
    const downPaymentAmount = homePrice * dpFraction;
    const monthlyPI = calcMonthlyPI(loanAmount, inputs.interestRate, term);
    const monthlyTaxes = (homePrice * inputs.propertyTaxRate / 100) / 12;
    const monthlyPMI = dpFraction < 0.2 ? (loanAmount * inputs.pmiRate / 100) / 12 : 0;
    return { homePrice: Math.max(0, homePrice), loanAmount: Math.max(0, loanAmount), monthlyPI, monthlyTaxes, monthlyInsurance, monthlyPMI, downPaymentAmount };
  }

  // Iterative solver: budget must cover P&I + taxes + insurance + PMI
  let homePrice = 0;
  for (let i = 0; i < 20; i++) {
    const monthlyTaxes = (homePrice * inputs.propertyTaxRate / 100) / 12;
    const loanAmount = homePrice * loanFraction;
    const monthlyPMI = dpFraction < 0.2 ? (loanAmount * inputs.pmiRate / 100) / 12 : 0;

    const availableForPI = maxHousingBudget - monthlyTaxes - monthlyInsurance - monthlyPMI;
    if (availableForPI <= 0) {
      homePrice = 0;
      break;
    }

    const maxLoan = calcMaxLoan(availableForPI, inputs.interestRate, term);
    const newHomePrice = maxLoan / loanFraction;

    if (Math.abs(newHomePrice - homePrice) < 1) {
      homePrice = newHomePrice;
      break;
    }
    homePrice = newHomePrice;
  }

  homePrice = Math.max(0, homePrice);
  const loanAmount = homePrice * loanFraction;
  const downPaymentAmount = homePrice * dpFraction;
  const monthlyPI = calcMonthlyPI(loanAmount, inputs.interestRate, term);
  const monthlyTaxes = (homePrice * inputs.propertyTaxRate / 100) / 12;
  const monthlyPMI = dpFraction < 0.2 ? (loanAmount * inputs.pmiRate / 100) / 12 : 0;

  return { homePrice, loanAmount, monthlyPI, monthlyTaxes, monthlyInsurance, monthlyPMI, downPaymentAmount };
}

function buildPhilosophy(
  label: string,
  description: string,
  maxBudget: number,
  inputs: AffordabilityInputs,
  monthlyGross: number,
  termOverride?: number,
  piOnly = false,
): PhilosophyResult {
  const term = termOverride ?? inputs.loanTerm;
  const result = solveMaxHomePrice(maxBudget, inputs, term, piOnly);
  const totalMonthlyHousing = result.monthlyPI + result.monthlyTaxes + result.monthlyInsurance + result.monthlyPMI;
  const totalPayments = result.monthlyPI * term * 12;
  const totalInterestPaid = totalPayments - result.loanAmount;
  const totalCostOverLife = totalPayments + (result.monthlyTaxes + result.monthlyInsurance + result.monthlyPMI) * term * 12 + result.downPaymentAmount;
  const frontEndDTI = monthlyGross > 0 ? (totalMonthlyHousing / monthlyGross) * 100 : 0;
  const backEndDTI = monthlyGross > 0 ? ((totalMonthlyHousing + inputs.monthlyDebtPayments) / monthlyGross) * 100 : 0;

  return {
    label,
    description,
    maxMonthlyPayment: maxBudget,
    maxLoanAmount: result.loanAmount,
    maxHomePrice: result.homePrice,
    downPaymentAmount: result.downPaymentAmount,
    downPaymentPercent: inputs.downPaymentPercent,
    monthlyPI: result.monthlyPI,
    monthlyTaxes: result.monthlyTaxes,
    monthlyInsurance: result.monthlyInsurance,
    monthlyPMI: result.monthlyPMI,
    totalMonthlyHousing,
    totalCostOverLife: Math.max(0, totalCostOverLife),
    totalInterestPaid: Math.max(0, totalInterestPaid),
    frontEndDTI,
    backEndDTI,
  };
}

export function calcAffordability(inputs: AffordabilityInputs): AffordabilityDerived {
  const monthlyGross = inputs.annualGrossIncome / 12;
  const monthlyNet = inputs.annualNetIncome / 12;
  const debt = inputs.monthlyDebtPayments;

  // Dave Ramsey: 25% of take-home on P&I, 15-year fixed
  const ramseyBudget = monthlyNet * 0.25;
  const ramsey = buildPhilosophy(
    "Dave Ramsey",
    "25% of take-home pay, 15-year fixed mortgage only",
    ramseyBudget, inputs, monthlyGross, 15, true,
  );

  // 28/36 Rule: min(28% gross front-end, 36% gross - debt back-end)
  const convFront = monthlyGross * 0.28;
  const convBack = monthlyGross * 0.36 - debt;
  const conventional = buildPhilosophy(
    "28/36 Rule",
    "28% of gross income on housing, 36% max total debt",
    Math.min(convFront, convBack), inputs, monthlyGross,
  );

  // FHA: min(31% front-end, 43% back-end)
  const fhaFront = monthlyGross * 0.31;
  const fhaBack = monthlyGross * 0.43 - debt;
  const fha = buildPhilosophy(
    "FHA Guidelines",
    "31% of gross income on housing, 43% max total debt",
    Math.min(fhaFront, fhaBack), inputs, monthlyGross,
  );

  // Aggressive: min(35% front-end, 50% back-end)
  const aggFront = monthlyGross * 0.35;
  const aggBack = monthlyGross * 0.50 - debt;
  const aggressive = buildPhilosophy(
    "Aggressive / Stretch",
    "35% of gross income on housing, 50% max total debt",
    Math.min(aggFront, aggBack), inputs, monthlyGross,
  );

  return {
    monthlyGross,
    monthlyNet,
    philosophies: { ramsey, conventional, fha, aggressive },
  };
}

// ─── Mortgage Calculator (Step 4) ───

export function calcMortgage(
  inputs: MortgageCalcInputs,
  monthlyNetIncome: number,
  currentFixedCosts: number,
  currentGuiltFree: number,
  currentSavings: number,
  currentDebt: number,
  currentRent: number,
): MortgageCalcDerived {
  // Resolve down payment based on mode
  let downPaymentAmount: number;
  let dpPercent: number;
  if (inputs.downPaymentMode === "percent") {
    dpPercent = inputs.downPaymentPercent;
    downPaymentAmount = inputs.purchasePrice * (dpPercent / 100);
  } else {
    downPaymentAmount = inputs.downPaymentAmount;
    dpPercent = inputs.purchasePrice > 0 ? (downPaymentAmount / inputs.purchasePrice) * 100 : 0;
  }

  const loanAmount = Math.max(0, inputs.purchasePrice - downPaymentAmount);

  // PMI logic: FHA uses MIP (0.55% annual for most), conventional uses user-set PMI if <20% down
  let pmiRate = inputs.pmiRate;
  if (inputs.loanType === "fha") {
    pmiRate = 0.55; // FHA annual MIP for most loan amounts
  }
  const monthlyPMI = dpPercent < 20 ? (loanAmount * pmiRate / 100) / 12 : 0;

  const monthlyPI = calcMonthlyPI(loanAmount, inputs.interestRate, inputs.loanTerm);
  const monthlyTaxes = (inputs.purchasePrice * inputs.propertyTaxRate / 100) / 12;
  const monthlyInsurance = inputs.homeInsuranceAnnual / 12;
  const monthlyHOA = inputs.hoaMonthly;
  const totalMonthlyPayment = monthlyPI + monthlyTaxes + monthlyInsurance + monthlyPMI + monthlyHOA;

  const totalPayments = monthlyPI * inputs.loanTerm * 12;
  const totalInterestPaid = Math.max(0, totalPayments - loanAmount);
  const totalCostOverLife = totalPayments
    + (monthlyTaxes + monthlyInsurance + monthlyPMI + monthlyHOA) * inputs.loanTerm * 12
    + downPaymentAmount;

  // Budget impact: replace current rent with new mortgage (not double-counted)
  const fixedCostsExRent = currentFixedCosts - currentRent;
  const newMonthlyHousing = totalMonthlyPayment;
  // What's left after fixed costs (minus old rent) + new mortgage + debt
  const remainingAfterMortgage = monthlyNetIncome - fixedCostsExRent - newMonthlyHousing - currentDebt;
  // How much guilt-free and savings would need to shrink
  const currentDiscretionary = currentGuiltFree + currentSavings;
  const guiltFreeReduction = remainingAfterMortgage < currentDiscretionary
    ? Math.max(0, currentGuiltFree - Math.max(0, remainingAfterMortgage - currentSavings))
    : 0;
  const savingsReduction = remainingAfterMortgage < currentSavings
    ? Math.max(0, currentSavings - remainingAfterMortgage)
    : 0;

  return {
    loanAmount,
    downPaymentPercent: dpPercent,
    monthlyPI,
    monthlyTaxes,
    monthlyInsurance,
    monthlyPMI,
    monthlyHOA,
    totalMonthlyPayment,
    totalInterestPaid,
    totalCostOverLife,
    monthlyNetIncome,
    currentFixedCosts,
    currentRent,
    fixedCostsExRent,
    currentGuiltFree,
    currentSavings,
    currentDebt,
    newMonthlyHousing,
    remainingAfterMortgage,
    guiltFreeReduction,
    savingsReduction,
  };
}

// ─── Savings timeline ───

export interface DownPaymentMilestone {
  label: string;
  percent: number;
  amountNeeded: number;
  alreadySaved: number;
  remaining: number;
  monthsToGo: number | null; // null = already reached or no savings rate
}

export function calcSavingsTimeline(
  targetHomePrice: number,
  downPaymentSaved: number,
  monthlySavings: number,
): DownPaymentMilestone[] {
  const thresholds = [
    { label: "3.5% (FHA Minimum)", percent: 3.5 },
    { label: "5% (Conventional Min)", percent: 5 },
    { label: "10%", percent: 10 },
    { label: "20% (No PMI)", percent: 20 },
  ];

  return thresholds.map(({ label, percent }) => {
    const amountNeeded = targetHomePrice * (percent / 100);
    const remaining = Math.max(0, amountNeeded - downPaymentSaved);
    let monthsToGo: number | null = null;

    if (remaining <= 0) {
      monthsToGo = 0;
    } else if (monthlySavings > 0) {
      monthsToGo = Math.ceil(remaining / monthlySavings);
    }

    return { label, percent, amountNeeded, alreadySaved: downPaymentSaved, remaining, monthsToGo };
  });
}

// ─── Formatting helpers ───

export function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
