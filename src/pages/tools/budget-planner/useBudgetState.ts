import { useState, useMemo, useCallback, useEffect } from "react";
import type {
  BudgetPlannerState,
  BudgetDerived,
  BudgetTab,
  IncomeSettings,
  FixedCostRow,
  YearlySubscription,
  AnnualIncome,
  AnnualExpenseRow,
  BudgetRow,
  NetWorthAssets,
  NetWorthLiabilities,
  AffordabilityInputs,
} from "./types";
import { DEFAULT_STATE } from "./defaults";
import type { MortgageCalcInputs } from "./types";
import { calcMonthly, calcAnnual, calcAffordability, calcMortgage } from "./calculations";

export function useBudgetState() {
  const [state, setState] = useState<BudgetPlannerState>(DEFAULT_STATE);

  const setTab = useCallback((tab: BudgetTab) => setState((p) => ({ ...p, tab })), []);

  // ─── Monthly: Income updaters ───

  const updateIncome = useCallback(<K extends keyof IncomeSettings>(key: K, value: IncomeSettings[K]) =>
    setState((p) => ({
      ...p,
      monthly: { ...p.monthly, income: { ...p.monthly.income, [key]: value } },
    })), []);

  const updateSavingsTarget = useCallback((percent: number) =>
    setState((p) => ({
      ...p,
      monthly: { ...p.monthly, savingsTargetPercent: Math.max(0, Math.min(40, percent)) },
    })), []);

  // ─── Monthly: Fixed cost row updaters ───

  const updateFixedCostRow = useCallback((id: string, field: keyof FixedCostRow, value: string | number) =>
    setState((p) => ({
      ...p,
      monthly: {
        ...p.monthly,
        fixedCosts: p.monthly.fixedCosts.map((r) =>
          r.id === id ? { ...r, [field]: value } : r
        ),
      },
    })), []);

  const addFixedCostRow = useCallback(() =>
    setState((p) => ({
      ...p,
      monthly: {
        ...p.monthly,
        fixedCosts: [...p.monthly.fixedCosts, { id: crypto.randomUUID(), label: "", amount: 0 }],
      },
    })), []);

  const removeFixedCostRow = useCallback((id: string) =>
    setState((p) => ({
      ...p,
      monthly: {
        ...p.monthly,
        fixedCosts: p.monthly.fixedCosts.filter((r) => r.id !== id),
      },
    })), []);

  // ─── Monthly: Subscriptions ───

  const addSubscription = useCallback((sub: YearlySubscription) =>
    setState((p) => ({
      ...p,
      monthly: { ...p.monthly, yearlySubscriptions: [...p.monthly.yearlySubscriptions, sub] },
    })), []);

  const removeSubscription = useCallback((id: string) =>
    setState((p) => ({
      ...p,
      monthly: { ...p.monthly, yearlySubscriptions: p.monthly.yearlySubscriptions.filter((s) => s.id !== id) },
    })), []);

  const updateSubscription = useCallback((id: string, field: "name" | "cost", value: string | number) =>
    setState((p) => ({
      ...p,
      monthly: {
        ...p.monthly,
        yearlySubscriptions: p.monthly.yearlySubscriptions.map((s) =>
          s.id === id ? { ...s, [field]: value } : s
        ),
      },
    })), []);

  // ─── Annual updaters ───

  const updateAnnualIncome = useCallback(<K extends keyof AnnualIncome>(key: K, value: number) =>
    setState((p) => ({
      ...p,
      annual: { ...p.annual, income: { ...p.annual.income, [key]: value } },
    })), []);

  // Annual expenses: dynamic rows
  const updateAnnualExpenseRow = useCallback((id: string, field: keyof AnnualExpenseRow, value: string | number) =>
    setState((p) => ({
      ...p,
      annual: {
        ...p.annual,
        fixedExpenses: p.annual.fixedExpenses.map((r) =>
          r.id === id ? { ...r, [field]: value } : r
        ),
      },
    })), []);

  const addAnnualExpenseRow = useCallback(() =>
    setState((p) => ({
      ...p,
      annual: {
        ...p.annual,
        fixedExpenses: [...p.annual.fixedExpenses, { id: crypto.randomUUID(), label: "", amount: 0 }],
      },
    })), []);

  const removeAnnualExpenseRow = useCallback((id: string) =>
    setState((p) => ({
      ...p,
      annual: {
        ...p.annual,
        fixedExpenses: p.annual.fixedExpenses.filter((r) => r.id !== id),
      },
    })), []);

  // ─── Generic row CRUD for guilt-free, debt, savings ───

  type RowSection = "guiltFree" | "debt" | "savings";

  const updateRow = useCallback((section: RowSection, id: string, field: keyof BudgetRow, value: string | number) =>
    setState((p) => ({
      ...p,
      annual: {
        ...p.annual,
        [section]: (p.annual[section] as BudgetRow[]).map((r) =>
          r.id === id ? { ...r, [field]: value } : r
        ),
      },
    })), []);

  const addRow = useCallback((section: RowSection) =>
    setState((p) => ({
      ...p,
      annual: {
        ...p.annual,
        [section]: [...(p.annual[section] as BudgetRow[]), { id: crypto.randomUUID(), label: "", amount: 0 }],
      },
    })), []);

  const removeRow = useCallback((section: RowSection, id: string) =>
    setState((p) => ({
      ...p,
      annual: {
        ...p.annual,
        [section]: (p.annual[section] as BudgetRow[]).filter((r) => r.id !== id),
      },
    })), []);

  // Convenience wrappers
  const updateGuiltFreeRow = useCallback((id: string, field: keyof BudgetRow, value: string | number) => updateRow("guiltFree", id, field, value), [updateRow]);
  const addGuiltFreeRow = useCallback(() => addRow("guiltFree"), [addRow]);
  const removeGuiltFreeRow = useCallback((id: string) => removeRow("guiltFree", id), [removeRow]);

  const updateDebtRow = useCallback((id: string, field: keyof BudgetRow, value: string | number) => updateRow("debt", id, field, value), [updateRow]);

  const updateSavingsRow = useCallback((id: string, field: keyof BudgetRow, value: string | number) => updateRow("savings", id, field, value), [updateRow]);
  const addSavingsRow = useCallback(() => addRow("savings"), [addRow]);
  const removeSavingsRow = useCallback((id: string) => removeRow("savings", id), [removeRow]);

  const toggleNetWorth = useCallback(() =>
    setState((p) => ({
      ...p,
      annual: { ...p.annual, showNetWorth: !p.annual.showNetWorth },
    })), []);

  const updateAsset = useCallback(<K extends keyof NetWorthAssets>(key: K, value: number) =>
    setState((p) => ({
      ...p,
      annual: { ...p.annual, assets: { ...p.annual.assets, [key]: value } },
    })), []);

  const updateLiability = useCallback(<K extends keyof NetWorthLiabilities>(key: K, value: number) =>
    setState((p) => ({
      ...p,
      annual: { ...p.annual, liabilities: { ...p.annual.liabilities, [key]: value } },
    })), []);

  // ─── Affordability updaters ───

  const updateAffordability = useCallback(<K extends keyof AffordabilityInputs>(key: K, value: AffordabilityInputs[K]) =>
    setState((p) => ({
      ...p,
      affordability: { ...p.affordability, [key]: value },
    })), []);

  // ─── Mortgage Calculator updaters ───

  const updateMortgageCalc = useCallback(<K extends keyof MortgageCalcInputs>(key: K, value: MortgageCalcInputs[K]) =>
    setState((p) => ({
      ...p,
      mortgageCalc: { ...p.mortgageCalc, [key]: value },
    })), []);

  // ─── Auto-sync: Tab 1 → Tab 2 ───
  // When Step 1 income or fixed costs change, push them into Step 2 automatically.

  useEffect(() => {
    setState((p) => {
      const md = calcMonthly(p.monthly);
      if (md.monthlyNet <= 0) return p; // no income yet — keep Tab 2 defaults

      const workIncome = Math.round(md.monthlyNet * 100) / 100;

      // Sync debt from the loanPayments row
      const debtRow = p.monthly.fixedCosts.find((r) => r.id === "loanPayments");
      const debtAmount = debtRow?.amount || 0;

      // Sync fixed expenses (excluding debt — it has its own section)
      const hasFixedData = p.monthly.fixedCosts.some((r) => r.amount > 0);
      const fixedExpenses: AnnualExpenseRow[] | undefined = hasFixedData
        ? p.monthly.fixedCosts
            .filter((r) => r.id !== "loanPayments" && (r.label || r.amount > 0))
            .map((r) => ({ id: r.id, label: r.label, amount: r.amount }))
        : undefined;

      return {
        ...p,
        annual: {
          ...p.annual,
          income: { ...p.annual.income, workIncome },
          ...(fixedExpenses && fixedExpenses.length > 0 ? { fixedExpenses } : {}),
          debt: [{ id: "debtRepayment", label: "Debt Repayment", amount: debtAmount }],
        },
      };
    });
  }, [state.monthly.income, state.monthly.fixedCosts]);

  // ─── Auto-sync: Tab 1 + Tab 2 → Tab 3 ───
  // Push income, debt, and savings into the affordability calculator.

  useEffect(() => {
    setState((p) => {
      const md = calcMonthly(p.monthly);
      if (md.annualGross <= 0) return p; // no income yet

      const ad = calcAnnual(p.annual);
      // Only the "Monthly Savings (Downpayment)" row feeds into the affordability timeline
      const downpaymentRow = p.annual.savings.find((r) => r.id === "monthlySavings");
      const monthlySavingsForHome = downpaymentRow?.amount || 0;

      return {
        ...p,
        affordability: {
          ...p.affordability,
          annualGrossIncome: Math.round(md.annualGross * 100) / 100,
          annualNetIncome: Math.round(md.annualNet * 100) / 100,
          monthlyDebtPayments: ad.totalDebt,
          monthlySavingsForHome,
        },
      };
    });
  }, [state.monthly.income, state.annual.debt, state.annual.savings]);

  // ─── Auto-sync: Steps 1-3 → Step 4 ───
  // Push down payment saved, loan settings, and budget data into mortgage calculator.

  useEffect(() => {
    setState((p) => {
      // Sync down payment percent from Step 3 → Step 4
      // Only sync dollar amount if user hasn't manually overridden it via dollar mode
      const dpUpdates = p.mortgageCalc.downPaymentMode === "dollar"
        ? { downPaymentPercent: p.affordability.downPaymentPercent }
        : { downPaymentPercent: p.affordability.downPaymentPercent, downPaymentAmount: p.affordability.downPaymentSaved };
      return {
        ...p,
        mortgageCalc: {
          ...p.mortgageCalc,
          ...dpUpdates,
          interestRate: p.affordability.interestRate,
          loanTerm: p.affordability.loanTerm,
          propertyTaxRate: p.affordability.propertyTaxRate,
          homeInsuranceAnnual: p.affordability.homeInsuranceAnnual,
          pmiRate: p.affordability.pmiRate,
        },
      };
    });
  }, [state.affordability.downPaymentPercent, state.affordability.downPaymentSaved, state.affordability.interestRate, state.affordability.loanTerm, state.affordability.propertyTaxRate, state.affordability.homeInsuranceAnnual, state.affordability.pmiRate]);

  // ─── Derived ───

  const derived = useMemo<BudgetDerived>(() => {
    const monthly = calcMonthly(state.monthly);
    const annual = calcAnnual(state.annual);
    const affordability = calcAffordability(state.affordability);
    // Find current rent from Step 1 fixed costs (the "Rent / Mortgage" row)
    const rentRow = state.monthly.fixedCosts.find((r) => r.id === "rent");
    const currentRent = rentRow?.amount || 0;
    const mortgageCalc = calcMortgage(
      state.mortgageCalc,
      monthly.monthlyNet,
      annual.totalFixedExpenses,
      annual.totalGuiltFree,
      annual.totalSavings,
      annual.totalDebt,
      currentRent,
    );
    return { monthly, annual, affordability, mortgageCalc };
  }, [state.monthly, state.annual, state.affordability, state.mortgageCalc]);

  return {
    state,
    derived,
    setTab,
    // monthly income
    updateIncome,
    updateSavingsTarget,
    // monthly fixed costs
    updateFixedCostRow,
    addFixedCostRow,
    removeFixedCostRow,
    // monthly subscriptions
    addSubscription,
    removeSubscription,
    updateSubscription,
    // annual
    updateAnnualIncome,
    updateAnnualExpenseRow,
    addAnnualExpenseRow,
    removeAnnualExpenseRow,
    updateGuiltFreeRow,
    addGuiltFreeRow,
    removeGuiltFreeRow,
    updateDebtRow,
    updateSavingsRow,
    addSavingsRow,
    removeSavingsRow,
    toggleNetWorth,
    updateAsset,
    updateLiability,
    // affordability
    updateAffordability,
    // mortgage calculator
    updateMortgageCalc,
  };
}
