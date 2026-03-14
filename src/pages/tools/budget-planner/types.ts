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

// ─── House Affordability ───

export type LoanTerm = 15 | 30;

export interface AffordabilityInputs {
  annualGrossIncome: number;
  annualNetIncome: number;
  monthlyDebtPayments: number;
  downPaymentPercent: number;
  downPaymentSaved: number;
  interestRate: number;
  loanTerm: LoanTerm;
  propertyTaxRate: number;
  homeInsuranceAnnual: number;
  pmiRate: number;
  monthlySavingsForHome: number;
}

export interface PhilosophyResult {
  label: string;
  description: string;
  maxMonthlyPayment: number;
  maxLoanAmount: number;
  maxHomePrice: number;
  downPaymentAmount: number;
  downPaymentPercent: number;
  monthlyPI: number;
  monthlyTaxes: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  totalMonthlyHousing: number;
  totalCostOverLife: number;
  totalInterestPaid: number;
  frontEndDTI: number;
  backEndDTI: number;
}

export interface AffordabilityDerived {
  monthlyGross: number;
  monthlyNet: number;
  philosophies: {
    ramsey: PhilosophyResult;
    conventional: PhilosophyResult;
    fha: PhilosophyResult;
    aggressive: PhilosophyResult;
  };
}

// ─── Mortgage Calculator (Step 4) ───

export type MortgageLoanType = "conventional" | "fha";
export type DownPaymentMode = "percent" | "dollar";
export type WisconsinCounty = "milwaukee" | "waukesha" | "washington" | "ozaukee" | "custom";

export interface MortgageCalcInputs {
  purchasePrice: number;
  downPaymentAmount: number;
  downPaymentPercent: number;
  downPaymentMode: DownPaymentMode;
  loanType: MortgageLoanType;
  county: WisconsinCounty;
  interestRate: number;
  loanTerm: LoanTerm;
  propertyTaxRate: number;
  homeInsuranceAnnual: number;
  pmiRate: number;
  hoaMonthly: number;
}

export interface MortgageCalcDerived {
  loanAmount: number;
  downPaymentPercent: number;
  monthlyPI: number;
  monthlyTaxes: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  monthlyHOA: number;
  totalMonthlyPayment: number;
  totalInterestPaid: number;
  totalCostOverLife: number;
  // Budget impact (from Steps 1-2)
  monthlyNetIncome: number;
  currentFixedCosts: number;
  currentRent: number;
  fixedCostsExRent: number;
  currentGuiltFree: number;
  currentSavings: number;
  currentDebt: number;
  newMonthlyHousing: number;
  remainingAfterMortgage: number;
  guiltFreeReduction: number;
  savingsReduction: number;
}

// ─── Combined ───

export type BudgetTab = "monthly" | "annual" | "affordability" | "mortgage";

export interface BudgetPlannerState {
  tab: BudgetTab;
  monthly: MonthlyEstimatorState;
  annual: AnnualBudgetState;
  affordability: AffordabilityInputs;
  mortgageCalc: MortgageCalcInputs;
}

export interface BudgetDerived {
  monthly: MonthlyDerived;
  annual: AnnualDerived;
  affordability: AffordabilityDerived;
  mortgageCalc: MortgageCalcDerived;
}
