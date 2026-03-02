import { useState, useMemo } from "react";
import type {
  HouseHackState,
  PropertyType,
  AnalysisMode,
  InvestmentInputs,
  IncomeInputs,
  ExpenseInputs,
  DerivedValues,
} from "./types";
import { DEFAULT_STATE } from "./defaults";
import {
  calcInvestment,
  calcIncome,
  calcExpenses,
  calcOwnerOccupiedReturns,
  calcAllUnitsReturns,
  calcReserves,
} from "./calculations";

export function useHouseHackState() {
  const [state, setState] = useState<HouseHackState>(DEFAULT_STATE);

  const setPropertyType = (propertyType: PropertyType) =>
    setState((prev) => ({ ...prev, propertyType }));

  const setMode = (mode: AnalysisMode) =>
    setState((prev) => ({ ...prev, mode }));

  const updateInvestment = <K extends keyof InvestmentInputs>(field: K, value: InvestmentInputs[K]) =>
    setState((prev) => ({
      ...prev,
      investment: { ...prev.investment, [field]: value },
    }));

  const updateOwnerIncome = <K extends keyof IncomeInputs>(field: K, value: IncomeInputs[K]) =>
    setState((prev) => ({
      ...prev,
      ownerOccupiedIncome: { ...prev.ownerOccupiedIncome, [field]: value },
    }));

  const updateAllUnitsIncome = <K extends keyof IncomeInputs>(field: K, value: IncomeInputs[K]) =>
    setState((prev) => ({
      ...prev,
      allUnitsIncome: { ...prev.allUnitsIncome, [field]: value },
    }));

  const updateOwnerExpenses = <K extends keyof ExpenseInputs>(field: K, value: ExpenseInputs[K]) =>
    setState((prev) => ({
      ...prev,
      ownerOccupiedExpenses: { ...prev.ownerOccupiedExpenses, [field]: value },
    }));

  const updateAllUnitsExpenses = <K extends keyof ExpenseInputs>(field: K, value: ExpenseInputs[K]) =>
    setState((prev) => ({
      ...prev,
      allUnitsExpenses: { ...prev.allUnitsExpenses, [field]: value },
    }));

  const updateOwnerExtras = (field: "currentRent" | "appreciationPercent" | "rentGrowthPercent", value: number) =>
    setState((prev) => ({
      ...prev,
      ownerOccupiedExtras: { ...prev.ownerOccupiedExtras, [field]: value },
    }));

  const updateAllUnitsExtras = (field: "appreciationPercent", value: number) =>
    setState((prev) => ({
      ...prev,
      allUnitsExtras: { ...prev.allUnitsExtras, [field]: value },
    }));

  const derived = useMemo<DerivedValues>(() => {
    const investmentDerived = calcInvestment(state.investment);

    const ownerIncomeDerived = calcIncome(state.ownerOccupiedIncome, state.propertyType);
    const allUnitsIncomeDerived = calcIncome(state.allUnitsIncome, state.propertyType);

    const ownerExpensesDerived = calcExpenses(state.ownerOccupiedExpenses, investmentDerived.monthlyPITI);
    const allUnitsExpensesDerived = calcExpenses(state.allUnitsExpenses, investmentDerived.monthlyPITI);

    const ownerReturns = calcOwnerOccupiedReturns(
      ownerIncomeDerived,
      ownerExpensesDerived,
      investmentDerived.initialInvestment,
      state.ownerOccupiedExtras.currentRent,
    );

    const allUnitsReturns = calcAllUnitsReturns(
      allUnitsIncomeDerived,
      allUnitsExpensesDerived,
      investmentDerived,
      investmentDerived.initialInvestment,
      state.investment.purchasePrice,
      state.allUnitsExtras.appreciationPercent,
      state.investment.interestRate,
    );

    const reservesDerived = calcReserves(
      investmentDerived.monthlyPITI,
      ownerReturns.houseHackSavings,
    );

    const currentIncome = state.mode === "owner-occupied" ? ownerIncomeDerived : allUnitsIncomeDerived;
    const currentExpenses = state.mode === "owner-occupied" ? ownerExpensesDerived : allUnitsExpensesDerived;

    return {
      investment: investmentDerived,
      income: currentIncome,
      expenses: currentExpenses,
      ownerOccupiedReturns: ownerReturns,
      allUnitsReturns: allUnitsReturns,
      reserves: reservesDerived,
    };
  }, [state]);

  return {
    state,
    setPropertyType,
    setMode,
    updateInvestment,
    updateOwnerIncome,
    updateAllUnitsIncome,
    updateOwnerExpenses,
    updateAllUnitsExpenses,
    updateOwnerExtras,
    updateAllUnitsExtras,
    derived,
  };
}
