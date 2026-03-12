import type { MonthlyEstimatorState, AnnualBudgetState, BudgetPlannerState, FixedCostRow, AnnualExpenseRow, BudgetRow } from "./types";

export const DEFAULT_FIXED_COSTS: FixedCostRow[] = [
  { id: "rent", label: "Rent / Mortgage", amount: 0 },
  { id: "insurance", label: "Insurance", amount: 0 },
  { id: "groceries", label: "Groceries", amount: 0 },
  { id: "internet", label: "Internet", amount: 0 },
  { id: "electricity", label: "Electricity", amount: 0 },
  { id: "gas", label: "Gas", amount: 0 },
  { id: "loanPayments", label: "Debt Payments", amount: 0 },
  { id: "subscriptions", label: "Subscriptions", amount: 0 },
  { id: "pets", label: "Pets", amount: 0 },
];

export const DEFAULT_ANNUAL_EXPENSES: AnnualExpenseRow[] = [
  { id: "mortgage", label: "Mortgage / Rent", amount: 0, splitEligible: true },
  { id: "electricity", label: "Electricity", amount: 0, splitEligible: true },
  { id: "internet", label: "Internet", amount: 0, splitEligible: true },
  { id: "groceries", label: "Groceries", amount: 0, splitEligible: true },
  { id: "petCosts", label: "Pets", amount: 0, splitEligible: true },
  { id: "healthInsurance", label: "Health Insurance", amount: 0, splitEligible: false },
  { id: "carInsurance", label: "Car Insurance", amount: 0, splitEligible: false },
  { id: "gas", label: "Gas", amount: 0, splitEligible: false },
  { id: "subscriptions", label: "Subscriptions", amount: 0, splitEligible: false },
];

export const DEFAULT_MONTHLY: MonthlyEstimatorState = {
  income: {
    inputMode: "annual",
    annualAmount: 0,
    grossPaycheckAmount: 0,
    netPaycheckAmount: 0,
    payFrequency: "biweekly",
    showAdvancedTax: false,
    filingStatus: "single",
    taxBracketOverride: null,
  },
  fixedCosts: DEFAULT_FIXED_COSTS,
  yearlySubscriptions: [],
  savingsTargetPercent: 20,
};

export const DEFAULT_ANNUAL: AnnualBudgetState = {
  income: { workIncome: 0, miscIncome: 0 },
  fixedExpenses: DEFAULT_ANNUAL_EXPENSES,
  splitWithSpouse: false,
  guiltFree: [
    { id: "restaurants", label: "Restaurants / Fast Food", amount: 0 },
    { id: "entertainment", label: "Entertainment", amount: 0 },
    { id: "shopping", label: "Shopping", amount: 0 },
    { id: "gifts", label: "Gifts", amount: 0 },
    { id: "miscTravel", label: "Misc / Travel", amount: 0 },
  ] as BudgetRow[],
  debt: [
    { id: "studentLoans", label: "Student Loans", amount: 0 },
    { id: "debtRepayment", label: "Debt Repayment", amount: 0 },
  ] as BudgetRow[],
  savings: [
    { id: "monthlySavings", label: "Monthly Savings", amount: 0 },
    { id: "monthlyInvesting", label: "Monthly Investing", amount: 0 },
  ] as BudgetRow[],
  showNetWorth: false,
  assets: { realEstate: 0, retirement: 0, cashSavings: 0, vehicle: 0 },
  liabilities: { mortgage: 0, studentLoans: 0, otherDebt: 0 },
};

export const DEFAULT_STATE: BudgetPlannerState = {
  tab: "monthly",
  monthly: DEFAULT_MONTHLY,
  annual: DEFAULT_ANNUAL,
};
