// ─── Monthly Cost Estimator ───

export type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";
export type FilingStatus = "single" | "married";

export interface IncomeSettings {
  inputMode: "annual" | "paycheck-gross" | "paycheck-net";
  annualAmount: number;        // annual salary
  grossPaycheckAmount: number; // gross per paycheck
  netPaycheckAmount: number;   // net per paycheck
  payFrequency: PayFrequency;
  showAdvancedTax: boolean;
  filingStatus: FilingStatus;
  taxBracketOverride: number | null; // null = auto-estimate
}

export interface FixedCostRow {
  id: string;
  label: string;
  amount: number;
}

export interface YearlySubscription {
  id: string;
  name: string;
  cost: number;
}

export interface MonthlyEstimatorState {
  income: IncomeSettings;
  fixedCosts: FixedCostRow[];
  yearlySubscriptions: YearlySubscription[];
  savingsTargetPercent: number; // of total income, default 20 — wants = 40 - this
}

export interface MonthlyDerived {
  annualGross: number;
  effectiveTaxRate: number;
  annualNet: number;
  monthlyGross: number;
  monthlyNet: number;
  paycheckGross: number;
  paycheckNet: number;
  totalFixedCosts: number;
  costPercentages: Record<string, number>; // keyed by row id
  idealFixed: number;
  idealSavings: number;
  idealWants: number;
  actualFixedPercent: number;
  actualRemaining: number;
  actualRemainingPercent: number;
  yearlySubsTotal: number;
  yearlySubsMonthly: number;
}

// ─── Annual Budget Planner ───

export interface AnnualIncome {
  workIncome: number;
  miscIncome: number;
}

export interface AnnualExpenseRow {
  id: string;
  label: string;
  amount: number;
  splitEligible: boolean; // can be split 50/50
}

/** Generic row used for guilt-free, debt, and savings sections */
export interface BudgetRow {
  id: string;
  label: string;
  amount: number;
}

export interface NetWorthAssets {
  realEstate: number;
  retirement: number;
  cashSavings: number;
  vehicle: number;
}

export interface NetWorthLiabilities {
  mortgage: number;
  studentLoans: number;
  otherDebt: number;
}

export interface AnnualBudgetState {
  income: AnnualIncome;
  fixedExpenses: AnnualExpenseRow[];
  splitWithSpouse: boolean;
  guiltFree: BudgetRow[];
  debt: BudgetRow[];
  savings: BudgetRow[];
  showNetWorth: boolean;
  assets: NetWorthAssets;
  liabilities: NetWorthLiabilities;
}

export interface AnnualDerived {
  totalMonthlyIncome: number;
  totalAnnualIncome: number;
  totalFixedExpenses: number;
  totalFixedExpensesFull: number;
  totalGuiltFree: number;
  totalDebt: number;
  totalSavings: number;
  totalMonthlyOutflow: number;
  netMonthly: number;
  savingsRate: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

// ─── Combined ───

export type BudgetTab = "monthly" | "annual";

export interface BudgetPlannerState {
  tab: BudgetTab;
  monthly: MonthlyEstimatorState;
  annual: AnnualBudgetState;
}

export interface BudgetDerived {
  monthly: MonthlyDerived;
  annual: AnnualDerived;
}
