import type {
  InvestmentInputs,
  IncomeInputs,
  ExpenseInputs,
  PropertyType,
  InvestmentDerived,
  IncomeDerived,
  ExpensesDerived,
  OwnerOccupiedReturnsDerived,
  AllUnitsReturnsDerived,
  ReservesDerived,
  MonthlyPrincipalRow,
} from "./types";
import { PROPERTY_TYPE_UNITS } from "./defaults";

export function calcInvestment(inv: InvestmentInputs): InvestmentDerived {
  const isCash = inv.financingType === "cash";
  const downPaymentDollar = isCash ? inv.purchasePrice : inv.purchasePrice * (inv.downPaymentPercent / 100);
  const loanWithoutMIP = isCash ? 0 : inv.purchasePrice - downPaymentDollar;
  const upfrontMIP = inv.financingType === "fha" ? loanWithoutMIP * (inv.fhaUpfrontMIPPercent / 100) : 0;
  const totalLoan = loanWithoutMIP + upfrontMIP;

  const closingCostsDollar = inv.purchasePrice * (inv.closingCostsPercent / 100);
  const initialInvestment = isCash
    ? inv.purchasePrice + closingCostsDollar + inv.initialRepairs
    : downPaymentDollar + closingCostsDollar - inv.downPaymentAssistance + inv.initialRepairs;

  let monthlyPI = 0;
  if (!isCash && totalLoan > 0) {
    const monthlyRate = inv.interestRate / 100 / 12;
    const numPayments = inv.loanTermYears * 12;
    if (monthlyRate === 0) {
      monthlyPI = totalLoan / numPayments;
    } else {
      monthlyPI =
        (totalLoan * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    }
  }

  const annualDebtService = monthlyPI * 12;
  const monthlyMI = isCash ? 0 : inv.monthlyMortgageInsurance;
  const monthlyPITI = monthlyPI + inv.monthlyTaxes + inv.monthlyInsurance + monthlyMI;
  const annualPITI = monthlyPITI * 12;

  return {
    downPaymentDollar,
    loanWithoutMIP,
    upfrontMIP,
    totalLoan,
    closingCostsDollar,
    initialInvestment,
    monthlyPI,
    annualDebtService,
    monthlyPITI,
    annualPITI,
  };
}

export function calcIncome(income: IncomeInputs, propertyType: PropertyType): IncomeDerived {
  const unitCount = PROPERTY_TYPE_UNITS[propertyType];
  const rents = [income.unit1Rent, income.unit2Rent, income.unit3Rent, income.unit4Rent];
  const activeRents = rents.slice(0, unitCount).reduce((sum, r) => sum + r, 0);

  const grossMonthlyIncome = activeRents + income.otherIncome;
  const grossAnnualIncome = grossMonthlyIncome * 12;
  const vacancyDollar = grossMonthlyIncome * (income.vacancyPercent / 100);
  const effectiveMonthlyIncome = grossMonthlyIncome - vacancyDollar;
  const effectiveAnnualIncome = effectiveMonthlyIncome * 12;

  return { grossMonthlyIncome, grossAnnualIncome, vacancyDollar, effectiveMonthlyIncome, effectiveAnnualIncome };
}

export function calcExpenses(
  expenses: ExpenseInputs,
  monthlyPITI: number,
): ExpensesDerived {
  const additionalMonthlyExpenses =
    expenses.maintenanceDollar +
    expenses.capexDollar +
    expenses.vacancyDollar +
    expenses.managementDollar +
    expenses.utilities +
    expenses.trash +
    expenses.lawnSnow +
    expenses.other;

  const totalMonthlyExpenses = monthlyPITI + additionalMonthlyExpenses;
  const totalAnnualExpenses = totalMonthlyExpenses * 12;

  return { additionalMonthlyExpenses, totalMonthlyExpenses, totalAnnualExpenses };
}

export function calcOwnerOccupiedReturns(
  incomeDerived: IncomeDerived,
  expensesDerived: ExpensesDerived,
  initialInvestment: number,
  currentRent: number,
): OwnerOccupiedReturnsDerived {
  const monthlyCashFlow = incomeDerived.effectiveMonthlyIncome - expensesDerived.totalMonthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;
  const cocROI = initialInvestment > 0 ? (annualCashFlow / initialInvestment) * 100 : 0;
  const effectiveHousingCost = expensesDerived.totalMonthlyExpenses - incomeDerived.effectiveMonthlyIncome;
  const houseHackSavings = currentRent - effectiveHousingCost;
  const annualSavings = houseHackSavings * 12;

  return { monthlyCashFlow, annualCashFlow, cocROI, effectiveHousingCost, houseHackSavings, annualSavings };
}

export function calcAllUnitsReturns(
  incomeDerived: IncomeDerived,
  expensesDerived: ExpensesDerived,
  investmentDerived: InvestmentDerived,
  initialInvestment: number,
  purchasePrice: number,
  appreciationPercent: number,
  interestRate: number,
): AllUnitsReturnsDerived {
  const monthlyCashFlow = incomeDerived.effectiveMonthlyIncome - expensesDerived.totalMonthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;
  const cocROI = initialInvestment > 0 ? (annualCashFlow / initialInvestment) * 100 : 0;

  const principalPaydownYear1 = investmentDerived.totalLoan > 0
    ? calcYear1PrincipalPaydown(
        investmentDerived.totalLoan,
        interestRate / 100 / 12,
        investmentDerived.monthlyPI,
      )
    : 0;
  const principalPaydownROI = initialInvestment > 0 ? (principalPaydownYear1 / initialInvestment) * 100 : 0;

  const annualAppreciation = purchasePrice * (appreciationPercent / 100);

  const combinedCFPD = annualCashFlow + principalPaydownYear1;
  const combinedCFPDROI = initialInvestment > 0 ? (combinedCFPD / initialInvestment) * 100 : 0;
  const combinedAll = annualCashFlow + principalPaydownYear1 + annualAppreciation;
  const combinedAllROI = initialInvestment > 0 ? (combinedAll / initialInvestment) * 100 : 0;

  const operatingExpenses = expensesDerived.totalAnnualExpenses - investmentDerived.annualPITI;
  const grossAnnualIncome = incomeDerived.grossAnnualIncome;
  const noi = grossAnnualIncome - operatingExpenses;
  const unleveragedYield = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0;

  return {
    monthlyCashFlow,
    annualCashFlow,
    cocROI,
    principalPaydownYear1,
    principalPaydownROI,
    annualAppreciation,
    combinedCFPD,
    combinedCFPDROI,
    combinedAll,
    combinedAllROI,
    grossAnnualIncome,
    operatingExpenses,
    noi,
    unleveragedYield,
  };
}

function calcYear1PrincipalPaydown(totalLoan: number, monthlyRate: number, monthlyPI: number): number {
  if (monthlyRate === 0) return monthlyPI * 12;
  let balance = totalLoan;
  let totalPrincipal = 0;
  for (let i = 0; i < 12; i++) {
    const interestPortion = balance * monthlyRate;
    const principalPortion = monthlyPI - interestPortion;
    totalPrincipal += principalPortion;
    balance -= principalPortion;
  }
  return totalPrincipal;
}

export function calcMonthlyPrincipalSchedule(
  totalLoan: number,
  annualRate: number,
  monthlyPI: number,
): MonthlyPrincipalRow[] {
  if (totalLoan <= 0 || monthlyPI <= 0) return [];
  const monthlyRate = annualRate / 100 / 12;
  let balance = totalLoan;
  const schedule: MonthlyPrincipalRow[] = [];

  for (let i = 1; i <= 12; i++) {
    const interestPayment = monthlyRate === 0 ? 0 : balance * monthlyRate;
    const principalPayment = monthlyPI - interestPayment;
    balance -= principalPayment;
    schedule.push({ month: i, principalPayment, interestPayment, remainingBalance: balance });
  }

  return schedule;
}

export function calcReserves(
  monthlyPITI: number,
  houseHackSavings: number,
): ReservesDerived {
  const rentSavingsAppliedAnnual = Math.max(0, houseHackSavings) * 12;
  const sixMonthReservesNeeded = monthlyPITI * 6;

  return { rentSavingsAppliedAnnual, sixMonthReservesNeeded };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyDetailed(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function calcCountyTax(purchasePrice: number, ratePercent: number): number {
  return (purchasePrice * (ratePercent / 100)) / 12;
}
