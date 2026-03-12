import { useState, useMemo, useCallback } from "react";
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
} from "./types";
import { DEFAULT_STATE } from "./defaults";
import { calcMonthly, calcAnnual } from "./calculations";

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
  const updateAnnualExpenseRow = useCallback((id: string, field: keyof AnnualExpenseRow, value: string | number | boolean) =>
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
        fixedExpenses: [...p.annual.fixedExpenses, { id: crypto.randomUUID(), label: "", amount: 0, splitEligible: false }],
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

  const toggleSplit = useCallback(() =>
    setState((p) => ({
      ...p,
      annual: { ...p.annual, splitWithSpouse: !p.annual.splitWithSpouse },
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
  const addDebtRow = useCallback(() => addRow("debt"), [addRow]);
  const removeDebtRow = useCallback((id: string) => removeRow("debt", id), [removeRow]);

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

  // ─── Import from Monthly → Annual ───

  const importFromMonthly = useCallback(() => {
    setState((p) => {
      const md = calcMonthly(p.monthly);
      // Map monthly net income → work income
      const workIncome = Math.round(md.monthlyNet * 100) / 100;
      // Map fixed cost rows → annual expense rows (new ids to avoid collisions)
      const fixedExpenses: AnnualExpenseRow[] = p.monthly.fixedCosts
        .filter((r) => r.label || r.amount > 0)
        .map((r) => ({
          id: crypto.randomUUID(),
          label: r.label,
          amount: r.amount,
          splitEligible: false,
        }));
      return {
        ...p,
        annual: {
          ...p.annual,
          income: { ...p.annual.income, workIncome },
          fixedExpenses: fixedExpenses.length > 0 ? fixedExpenses : p.annual.fixedExpenses,
        },
      };
    });
  }, []);

  // ─── Derived ───

  const derived = useMemo<BudgetDerived>(() => ({
    monthly: calcMonthly(state.monthly),
    annual: calcAnnual(state.annual),
  }), [state.monthly, state.annual]);

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
    toggleSplit,
    updateGuiltFreeRow,
    addGuiltFreeRow,
    removeGuiltFreeRow,
    updateDebtRow,
    addDebtRow,
    removeDebtRow,
    updateSavingsRow,
    addSavingsRow,
    removeSavingsRow,
    toggleNetWorth,
    updateAsset,
    updateLiability,
    importFromMonthly,
  };
}
