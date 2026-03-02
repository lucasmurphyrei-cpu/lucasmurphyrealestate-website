export type PropertyType = "duplex" | "triplex" | "fourplex";
export type FinancingType = "conventional" | "fha" | "cash";

export interface InvestmentInputs {
  purchasePrice: number;
  downPaymentPercent: number;
  financingType: FinancingType;
  fhaUpfrontMIPPercent: number;
  downPaymentAssistance: number;
  closingCostsPercent: number;
  initialRepairs: number;
  interestRate: number;
  loanTermYears: number;
  monthlyTaxes: number;
  monthlyInsurance: number;
  monthlyMortgageInsurance: number;
}

export interface IncomeInputs {
  unit1Rent: number;
  unit2Rent: number;
  unit3Rent: number;
  unit4Rent: number;
  otherIncome: number;
  vacancyPercent: number;
}

export interface ExpenseInputs {
  maintenanceDollar: number;
  capexDollar: number;
  vacancyDollar: number;
  managementDollar: number;
  utilities: number;
  trash: number;
  lawnSnow: number;
  other: number;
}

export interface OwnerOccupiedExtras {
  currentRent: number;
  appreciationPercent: number;
  rentGrowthPercent: number;
}

export type ExpenseInputMode = "dollar" | "percent";

export interface MonthlyPrincipalRow {
  month: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
}

export interface AllUnitsExtras {
  appreciationPercent: number;
}

export type AnalysisMode = "owner-occupied" | "all-units-rented";

export interface HouseHackState {
  propertyType: PropertyType;
  mode: AnalysisMode;
  investment: InvestmentInputs;
  ownerOccupiedIncome: IncomeInputs;
  allUnitsIncome: IncomeInputs;
  ownerOccupiedExpenses: ExpenseInputs;
  allUnitsExpenses: ExpenseInputs;
  ownerOccupiedExtras: OwnerOccupiedExtras;
  allUnitsExtras: AllUnitsExtras;
}

export interface InvestmentDerived {
  downPaymentDollar: number;
  loanWithoutMIP: number;
  upfrontMIP: number;
  totalLoan: number;
  closingCostsDollar: number;
  initialInvestment: number;
  monthlyPI: number;
  annualDebtService: number;
  monthlyPITI: number;
  annualPITI: number;
}

export interface IncomeDerived {
  grossMonthlyIncome: number;
  grossAnnualIncome: number;
  vacancyDollar: number;
  effectiveMonthlyIncome: number;
  effectiveAnnualIncome: number;
}

export interface ExpensesDerived {
  additionalMonthlyExpenses: number;
  totalMonthlyExpenses: number;
  totalAnnualExpenses: number;
}

export interface OwnerOccupiedReturnsDerived {
  monthlyCashFlow: number;
  annualCashFlow: number;
  cocROI: number;
  effectiveHousingCost: number;
  houseHackSavings: number;
  annualSavings: number;
}

export interface AllUnitsReturnsDerived {
  monthlyCashFlow: number;
  annualCashFlow: number;
  cocROI: number;
  principalPaydownYear1: number;
  principalPaydownROI: number;
  annualAppreciation: number;
  combinedCFPD: number;
  combinedCFPDROI: number;
  combinedAll: number;
  combinedAllROI: number;
  grossAnnualIncome: number;
  operatingExpenses: number;
  noi: number;
  unleveragedYield: number;
}

export interface ReservesDerived {
  rentSavingsAppliedAnnual: number;
  sixMonthReservesNeeded: number;
}

export interface DerivedValues {
  investment: InvestmentDerived;
  income: IncomeDerived;
  expenses: ExpensesDerived;
  ownerOccupiedReturns: OwnerOccupiedReturnsDerived;
  allUnitsReturns: AllUnitsReturnsDerived;
  reserves: ReservesDerived;
}
