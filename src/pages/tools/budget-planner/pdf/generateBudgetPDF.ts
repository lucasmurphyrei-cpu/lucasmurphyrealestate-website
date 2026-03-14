import type ExcelJS from "exceljs";
import type { BudgetPlannerState, BudgetDerived, BudgetTab } from "../types";

// ─── Brand colors ───
const NAVY = "1B2A4A";
const GOLD = "C9A96E";
const WHITE = "FFFFFF";
const LIGHT_BG = "F0EDE8";
const GREEN = "16A34A";
const RED = "DC2626";
const TEXT_DARK = "1A1A1A";

// ─── Reusable styles ───
const CURRENCY_FMT = '"$"#,##0.00';
const PERCENT_FMT = "0.0%";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function navyFill(): ExcelJS.FillPattern {
  return { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
}
function goldFill(): ExcelJS.FillPattern {
  return { type: "pattern", pattern: "solid", fgColor: { argb: GOLD } };
}
function lightFill(): ExcelJS.FillPattern {
  return { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_BG } };
}

function thinBorder(): Partial<ExcelJS.Borders> {
  const side: Partial<ExcelJS.Border> = { style: "thin", color: { argb: "D0D0D0" } };
  return { top: side, bottom: side, left: side, right: side };
}

/** Style a header row (navy bg, white/gold text) */
function styleHeaderRow(row: ExcelJS.Row, cols: number, goldText = false) {
  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber <= cols) {
      cell.fill = navyFill();
      cell.font = { bold: true, color: { argb: goldText ? GOLD : WHITE }, size: 11 };
      cell.border = thinBorder();
      cell.alignment = { horizontal: "center", vertical: "middle" };
    }
  });
}

/** Style a section title row (gold bg, navy text) */
function styleSectionTitle(row: ExcelJS.Row, cols: number) {
  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber <= cols) {
      cell.fill = goldFill();
      cell.font = { bold: true, color: { argb: NAVY }, size: 12 };
      cell.alignment = { horizontal: "left", vertical: "middle" };
    }
  });
}

/** Style a total row (light bg, bold) */
function styleTotalRow(row: ExcelJS.Row, cols: number) {
  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber <= cols) {
      cell.fill = lightFill();
      cell.font = { bold: true, color: { argb: TEXT_DARK }, size: 11 };
      cell.border = thinBorder();
    }
  });
}

/** Style a data row with alternating background */
function styleDataRow(row: ExcelJS.Row, cols: number, alt: boolean) {
  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber <= cols) {
      if (alt) cell.fill = lightFill();
      cell.border = thinBorder();
      cell.font = { color: { argb: TEXT_DARK }, size: 10 };
    }
  });
}

/** Get Excel column letter from 1-based index */
function colLetter(c: number): string {
  let s = "";
  let n = c;
  while (n > 0) {
    n--;
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26);
  }
  return s;
}

// ═══════════════════════════════════════════════════
// Main export function
// ═══════════════════════════════════════════════════

export async function generateBudgetPDF(
  state: BudgetPlannerState,
  derived: BudgetDerived,
  _tab: BudgetTab,
  userName: string,
): Promise<void> {
  // Lazy-load heavy dependencies so they don't bloat the initial bundle
  const [{ default: ExcelJSLib }, { saveAs }] = await Promise.all([
    import("exceljs"),
    import("file-saver"),
  ]);

  const wb = new ExcelJSLib.Workbook();
  wb.creator = "Lucas Murphy | eXp Realty";
  wb.created = new Date();

  buildMonthlySheet(wb, state, derived, userName);
  buildAnnualSheet(wb, state, derived, userName);
  buildAffordabilitySheet(wb, state, derived, userName);

  const buf = await wb.xlsx.writeBuffer();
  const dateStr = new Date().toISOString().slice(0, 10);
  saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    `Budget-Planner-${userName.replace(/\s+/g, "-")}-${dateStr}.xlsx`);
}

// ═══════════════════════════════════════════════════
// TAB 1: Monthly Cost Estimator
// ═══════════════════════════════════════════════════

function buildMonthlySheet(wb: ExcelJS.Workbook, state: BudgetPlannerState, derived: BudgetDerived, userName: string) {
  const ws = wb.addWorksheet("Monthly Cost Estimator", {
    views: [{ showGridLines: true }],
  });
  const m = state.monthly;
  const d = derived.monthly;

  // Column widths: A=32, B=16, C=14, D=32, E=18, F=26, G=18
  ws.columns = [
    { width: 32 }, { width: 16 }, { width: 14 },
    { width: 32 }, { width: 18 }, { width: 26 }, { width: 18 },
  ];

  let r = 1;

  // ─── Title banner ───
  ws.mergeCells(r, 1, r, 7);
  const titleCell = ws.getCell(r, 1);
  titleCell.value = `Monthly Cost Estimator — ${userName}`;
  titleCell.fill = navyFill();
  titleCell.font = { bold: true, color: { argb: GOLD }, size: 16 };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(r).height = 30;
  r++;

  // Subtitle
  ws.mergeCells(r, 1, r, 7);
  const subCell = ws.getCell(r, 1);
  subCell.value = `Prepared ${new Date().toLocaleDateString()} | Lucas Murphy, eXp Realty | (414)-269-4909`;
  subCell.fill = navyFill();
  subCell.font = { color: { argb: WHITE }, size: 10 };
  subCell.alignment = { horizontal: "center", vertical: "middle" };
  r++;

  // Gold accent line
  ws.mergeCells(r, 1, r, 7);
  ws.getCell(r, 1).fill = goldFill();
  ws.getRow(r).height = 4;
  r++;
  r++; // spacer

  // ─── Income block (A-B) + Budget Rule (D-G) side by side ───
  const incStart = r;

  // Income header
  const incHeaderRow = ws.getRow(r);
  ws.getCell(r, 1).value = "Income Summary";
  ws.getCell(r, 1).font = { bold: true, color: { argb: NAVY }, size: 12 };
  ws.getCell(r, 3).value = "";
  // Budget rule header
  ws.getCell(r, 4).value = "Budget (Ideal)";
  ws.getCell(r, 4).font = { bold: true, color: { argb: WHITE }, size: 11 };
  ws.getCell(r, 4).fill = navyFill();
  ws.getCell(r, 5).fill = navyFill();
  ws.getCell(r, 6).value = "Budget (Actual)";
  ws.getCell(r, 6).font = { bold: true, color: { argb: WHITE }, size: 11 };
  ws.getCell(r, 6).fill = navyFill();
  ws.getCell(r, 7).fill = navyFill();
  r++;

  // Income rows
  const incomeRows: [string, number | { formula: string }, string?][] = [
    ["Annual Gross Salary", d.annualGross],
    ["Paycheck (Net)", d.paycheckNet],
    ["Monthly Net Income", d.monthlyNet],
    ["Annual Net Income", d.annualNet],
    ["Est. Tax Rate", d.effectiveTaxRate / 100],
  ];

  // We'll fill in the Budget Actual column G values AFTER the fixed costs table
  // is built, so we can reference the total cell with a formula.
  // For now, store the row numbers where budget rule rows will go.
  const budgetRuleStartRow = r;

  // Budget rule ideal rows (D-E only for now)
  const idealRows: [string, number][] = [
    ["Monthly Fixed Costs (60%)", d.idealFixed],
    ["Savings/Investing (20%)", d.idealSavings],
    ["Guilt-Free Spending (20%)", d.idealWants],
  ];
  const actualLabels = ["Monthly Fixed Costs", "Savings/Investing", "Guilt-Free Spending", "Total Left Over"];

  for (let i = 0; i < Math.max(incomeRows.length, Math.max(idealRows.length, actualLabels.length)); i++) {
    const alt = i % 2 === 1;

    // Income side (A-B)
    if (i < incomeRows.length) {
      const [label, val] = incomeRows[i];
      ws.getCell(r, 1).value = label;
      ws.getCell(r, 1).font = { color: { argb: TEXT_DARK }, size: 10 };
      ws.getCell(r, 1).border = thinBorder();
      if (alt) ws.getCell(r, 1).fill = lightFill();

      const fmt = label.includes("Tax Rate") ? PERCENT_FMT : CURRENCY_FMT;
      ws.getCell(r, 2).value = val as number;
      ws.getCell(r, 2).numFmt = fmt;
      ws.getCell(r, 2).font = { bold: true, color: { argb: TEXT_DARK }, size: 10 };
      ws.getCell(r, 2).border = thinBorder();
      ws.getCell(r, 2).alignment = { horizontal: "right" };
      if (alt) ws.getCell(r, 2).fill = lightFill();
    }

    // Budget rule ideal side (D-E)
    if (i < idealRows.length) {
      const [idealLabel, idealVal] = idealRows[i];
      ws.getCell(r, 4).value = idealLabel;
      ws.getCell(r, 4).font = { color: { argb: TEXT_DARK }, size: 10 };
      ws.getCell(r, 4).border = thinBorder();
      ws.getCell(r, 5).value = idealVal;
      ws.getCell(r, 5).numFmt = CURRENCY_FMT;
      ws.getCell(r, 5).font = { bold: true, color: { argb: TEXT_DARK }, size: 10 };
      ws.getCell(r, 5).border = thinBorder();
      ws.getCell(r, 5).alignment = { horizontal: "right" };
    }

    // Budget rule actual labels (F) — values (G) filled after fixed costs table
    if (i < actualLabels.length) {
      ws.getCell(r, 6).value = actualLabels[i];
      ws.getCell(r, 6).font = { color: { argb: TEXT_DARK }, size: 10 };
      ws.getCell(r, 6).border = thinBorder();
      // G column placeholder — will be set with formulas below
      ws.getCell(r, 7).numFmt = CURRENCY_FMT;
      ws.getCell(r, 7).border = thinBorder();
      ws.getCell(r, 7).alignment = { horizontal: "right" };
    }

    r++;
  }

  r++; // spacer

  // ─── Fixed Costs table (A-C) ───
  ws.getCell(r, 1).value = "Monthly Fixed Costs";
  ws.getCell(r, 1).fill = navyFill();
  ws.getCell(r, 1).font = { bold: true, color: { argb: WHITE }, size: 11 };
  ws.getCell(r, 1).border = thinBorder();
  ws.getCell(r, 2).value = "Amount";
  ws.getCell(r, 2).fill = navyFill();
  ws.getCell(r, 2).font = { bold: true, color: { argb: WHITE }, size: 11 };
  ws.getCell(r, 2).border = thinBorder();
  ws.getCell(r, 2).alignment = { horizontal: "right" };
  ws.getCell(r, 3).value = "% of Income";
  ws.getCell(r, 3).fill = navyFill();
  ws.getCell(r, 3).font = { bold: true, color: { argb: WHITE }, size: 11 };
  ws.getCell(r, 3).border = thinBorder();
  ws.getCell(r, 3).alignment = { horizontal: "right" };
  r++;

  const fixedDataStart = r;
  const activeFixedCosts = m.fixedCosts.filter((row) => row.label || row.amount > 0);
  const monthlyNetRow = incStart + 3; // row where "Monthly Net Income" value is

  for (let i = 0; i < activeFixedCosts.length; i++) {
    const row = activeFixedCosts[i];
    const alt = i % 2 === 1;

    ws.getCell(r, 1).value = row.label || "Unnamed";
    ws.getCell(r, 1).font = { color: { argb: TEXT_DARK }, size: 10 };
    ws.getCell(r, 1).border = thinBorder();
    if (alt) ws.getCell(r, 1).fill = lightFill();

    ws.getCell(r, 2).value = row.amount;
    ws.getCell(r, 2).numFmt = CURRENCY_FMT;
    ws.getCell(r, 2).border = thinBorder();
    ws.getCell(r, 2).alignment = { horizontal: "right" };
    if (alt) ws.getCell(r, 2).fill = lightFill();

    // % formula: this cell / monthly net income cell
    const pctFormula = d.monthlyNet > 0
      ? { formula: `B${r}/B$${monthlyNetRow}` }
      : 0;
    ws.getCell(r, 3).value = pctFormula as unknown as number;
    ws.getCell(r, 3).numFmt = PERCENT_FMT;
    ws.getCell(r, 3).border = thinBorder();
    ws.getCell(r, 3).alignment = { horizontal: "right" };
    if (alt) ws.getCell(r, 3).fill = lightFill();

    r++;
  }

  const fixedDataEnd = r - 1;

  // Fixed costs TOTAL row with SUM formula
  ws.getCell(r, 1).value = "Total:";
  ws.getCell(r, 2).value = { formula: `SUM(B${fixedDataStart}:B${fixedDataEnd})` } as unknown as number;
  ws.getCell(r, 2).numFmt = CURRENCY_FMT;
  ws.getCell(r, 3).value = { formula: `B${r}/B$${monthlyNetRow}` } as unknown as number;
  ws.getCell(r, 3).numFmt = PERCENT_FMT;
  styleTotalRow(ws.getRow(r), 3);
  ws.getCell(r, 3).alignment = { horizontal: "right" };
  ws.getCell(r, 2).alignment = { horizontal: "right" };
  const fixedTotalRow = r;
  r++;

  // ─── Now fill in Budget Actual (column G) with formulas referencing the fixed costs total ───
  // Row 0: Monthly Fixed Costs = reference the Total cell B{fixedTotalRow}
  const actualFixedRow = budgetRuleStartRow;
  ws.getCell(actualFixedRow, 7).value = { formula: `B${fixedTotalRow}` } as unknown as number;
  ws.getCell(actualFixedRow, 7).font = { bold: true, color: { argb: TEXT_DARK }, size: 10 };

  // Row 1: Savings/Investing = (Monthly Net - Fixed Costs) / 2
  ws.getCell(actualFixedRow + 1, 7).value = { formula: `(B$${monthlyNetRow}-B${fixedTotalRow})/2` } as unknown as number;
  ws.getCell(actualFixedRow + 1, 7).font = { bold: true, color: { argb: GREEN }, size: 10 };

  // Row 2: Guilt-Free Spending = same formula
  ws.getCell(actualFixedRow + 2, 7).value = { formula: `(B$${monthlyNetRow}-B${fixedTotalRow})/2` } as unknown as number;
  ws.getCell(actualFixedRow + 2, 7).font = { bold: true, color: { argb: GREEN }, size: 10 };

  // Row 3: Total Left Over = Monthly Net - Fixed Costs
  ws.getCell(actualFixedRow + 3, 7).value = { formula: `B$${monthlyNetRow}-B${fixedTotalRow}` } as unknown as number;
  ws.getCell(actualFixedRow + 3, 7).font = { bold: true, color: { argb: d.actualRemaining >= 0 ? GREEN : RED }, size: 10 };

  r += 3;

  // ─── Footer ───
  ws.mergeCells(r, 1, r, 7);
  ws.getCell(r, 1).value = "Lucas Murphy  |  eXp Realty  |  (414)-269-4909  |  lucas.murphy@exprealty.com";
  ws.getCell(r, 1).font = { color: { argb: GOLD }, size: 10, bold: true };
  ws.getCell(r, 1).fill = navyFill();
  ws.getCell(r, 1).alignment = { horizontal: "center" };
  r++;
  ws.mergeCells(r, 1, r, 7);
  ws.getCell(r, 1).value = "lucasmurphyrealestate.com/tools/budget-planner";
  ws.getCell(r, 1).font = { color: { argb: WHITE }, size: 9 };
  ws.getCell(r, 1).fill = navyFill();
  ws.getCell(r, 1).alignment = { horizontal: "center" };
}

// ═══════════════════════════════════════════════════
// TAB 2: Annual Budget (month-by-month grid A-N)
// ═══════════════════════════════════════════════════

function buildAnnualSheet(wb: ExcelJS.Workbook, state: BudgetPlannerState, derived: BudgetDerived, userName: string) {
  const ws = wb.addWorksheet(`${new Date().getFullYear()} Budget`, {
    views: [{ showGridLines: true }],
  });
  const a = state.annual;
  const d = derived.annual;
  const year = new Date().getFullYear();
  const totalCols = 15; // A(1) + Jan-Dec(2-13) + YTD(14) + Avg(15)

  // Column widths
  ws.columns = [
    { width: 30 },
    ...Array(12).fill(null).map(() => ({ width: 14 })),
    { width: 16 },
    { width: 16 },
  ];

  let r = 1;

  // ─── Title banner ───
  ws.mergeCells(r, 1, r, totalCols);
  const titleCell = ws.getCell(r, 1);
  titleCell.value = `${year} Budget — ${userName}`;
  titleCell.fill = navyFill();
  titleCell.font = { bold: true, color: { argb: GOLD }, size: 16 };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(r).height = 30;
  r++;

  ws.mergeCells(r, 1, r, totalCols);
  ws.getCell(r, 1).value = `Prepared ${new Date().toLocaleDateString()} | Lucas Murphy, eXp Realty | (414)-269-4909`;
  ws.getCell(r, 1).fill = navyFill();
  ws.getCell(r, 1).font = { color: { argb: WHITE }, size: 10 };
  ws.getCell(r, 1).alignment = { horizontal: "center" };
  r++;

  // Gold accent
  ws.mergeCells(r, 1, r, totalCols);
  ws.getCell(r, 1).fill = goldFill();
  ws.getRow(r).height = 4;
  r++;

  // ─── Column headers ───
  ws.getCell(r, 1).value = "Category";
  for (let i = 0; i < 12; i++) {
    ws.getCell(r, i + 2).value = MONTHS[i];
  }
  ws.getCell(r, 14).value = "YTD TOTAL";
  ws.getCell(r, 15).value = "MONTHLY AVG";
  styleHeaderRow(ws.getRow(r), totalCols, true);
  r++;

  // ─── Helper: add a data row with monthly values + SUM/AVG formulas ───
  function addMonthlyRow(label: string, monthlyAmount: number, rowIdx: number, alt: boolean): number {
    ws.getCell(rowIdx, 1).value = label;
    for (let i = 0; i < 12; i++) {
      // Only populate if non-zero — empty cells won't skew averages
      if (monthlyAmount !== 0) {
        ws.getCell(rowIdx, i + 2).value = monthlyAmount;
      }
      ws.getCell(rowIdx, i + 2).numFmt = CURRENCY_FMT;
      ws.getCell(rowIdx, i + 2).alignment = { horizontal: "right" };
    }
    // YTD = SUM of B:M
    ws.getCell(rowIdx, 14).value = { formula: `SUM(B${rowIdx}:M${rowIdx})` } as unknown as number;
    ws.getCell(rowIdx, 14).numFmt = CURRENCY_FMT;
    ws.getCell(rowIdx, 14).alignment = { horizontal: "right" };
    // Monthly Avg = AVERAGEIF (only non-zero months)
    ws.getCell(rowIdx, 15).value = { formula: `IFERROR(AVERAGEIF(B${rowIdx}:M${rowIdx},"<>0"),0)` } as unknown as number;
    ws.getCell(rowIdx, 15).numFmt = CURRENCY_FMT;
    ws.getCell(rowIdx, 15).alignment = { horizontal: "right" };
    styleDataRow(ws.getRow(rowIdx), totalCols, alt);
    return rowIdx + 1;
  }

  // ─── Helper: add a category separator row (gold bg, navy text) ───
  function addCategoryHeader(label: string, rowIdx: number): number {
    ws.getCell(rowIdx, 1).value = label;
    for (let c = 1; c <= totalCols; c++) {
      ws.getCell(rowIdx, c).fill = goldFill();
      ws.getCell(rowIdx, c).font = { bold: true, color: { argb: NAVY }, size: 11 };
      ws.getCell(rowIdx, c).border = thinBorder();
    }
    return rowIdx + 1;
  }

  // ─── Helper: add a SUM total row for a range ───
  function addSumRow(label: string, startRow: number, endRow: number, rowIdx: number): number {
    ws.getCell(rowIdx, 1).value = label;
    for (let c = 2; c <= 13; c++) {
      const cl = colLetter(c);
      ws.getCell(rowIdx, c).value = { formula: `SUM(${cl}${startRow}:${cl}${endRow})` } as unknown as number;
      ws.getCell(rowIdx, c).numFmt = CURRENCY_FMT;
      ws.getCell(rowIdx, c).alignment = { horizontal: "right" };
    }
    ws.getCell(rowIdx, 14).value = { formula: `SUM(B${rowIdx}:M${rowIdx})` } as unknown as number;
    ws.getCell(rowIdx, 14).numFmt = CURRENCY_FMT;
    ws.getCell(rowIdx, 14).alignment = { horizontal: "right" };
    ws.getCell(rowIdx, 15).value = { formula: `IFERROR(AVERAGEIF(B${rowIdx}:M${rowIdx},"<>0"),0)` } as unknown as number;
    ws.getCell(rowIdx, 15).numFmt = CURRENCY_FMT;
    ws.getCell(rowIdx, 15).alignment = { horizontal: "right" };
    styleTotalRow(ws.getRow(rowIdx), totalCols);
    return rowIdx + 1;
  }

  let altFlag = false;

  // ═══ INCOME ═══
  r = addCategoryHeader("Income", r);
  const incomeStartRow = r;
  r = addMonthlyRow("Income (work)", a.income.workIncome, r, altFlag); altFlag = !altFlag;
  r = addMonthlyRow("Misc.", a.income.miscIncome, r, altFlag); altFlag = !altFlag;
  const incomeEndRow = r - 1;
  const totalIncomeRow = r;
  r = addSumRow("Total Income", incomeStartRow, incomeEndRow, r);

  // ═══ MONTHLY FIXED EXPENSES ═══
  altFlag = false;
  r = addCategoryHeader("Monthly Fixed Expenses", r);
  const expenseStartRow = r;
  for (const row of a.fixedExpenses) {
    if (!row.label && row.amount === 0) continue;
    r = addMonthlyRow(row.label || "Unnamed", row.amount, r, altFlag); altFlag = !altFlag;
  }
  const expenseEndRow = r - 1;
  const totalExpensesRow = r;
  r = addSumRow("Total Fixed Expenses", expenseStartRow, expenseEndRow, r);

  // ═══ GUILT-FREE SPENDING ═══
  altFlag = false;
  r = addCategoryHeader("Guilt-Free Spending", r);
  const gfStartRow = r;
  for (const row of a.guiltFree) {
    if (!row.label && row.amount === 0) continue;
    r = addMonthlyRow(row.label || "Unnamed", row.amount, r, altFlag); altFlag = !altFlag;
  }
  const gfEndRow = r - 1;
  const totalGfRow = r;
  r = addSumRow("Total Guilt-Free", gfStartRow, gfEndRow, r);

  // ═══ DEBT PAYMENTS ═══
  altFlag = false;
  r = addCategoryHeader("Debt Payments", r);
  const debtStartRow = r;
  for (const row of a.debt) {
    if (!row.label && row.amount === 0) continue;
    r = addMonthlyRow(row.label || "Unnamed", row.amount, r, altFlag); altFlag = !altFlag;
  }
  const debtEndRow = r - 1;
  const totalDebtRow = r;
  r = addSumRow("Total Debt", debtStartRow, debtEndRow, r);

  r++; // spacer

  // ═══ SUMMARY ═══
  r = addCategoryHeader("Summary", r);

  // Total Income (reference)
  ws.getCell(r, 1).value = "Total Income";
  for (let c = 2; c <= 13; c++) {
    const cl = colLetter(c);
    ws.getCell(r, c).value = { formula: `${cl}${totalIncomeRow}` } as unknown as number;
    ws.getCell(r, c).numFmt = CURRENCY_FMT;
    ws.getCell(r, c).alignment = { horizontal: "right" };
  }
  ws.getCell(r, 14).value = { formula: `SUM(B${r}:M${r})` } as unknown as number;
  ws.getCell(r, 14).numFmt = CURRENCY_FMT;
  ws.getCell(r, 14).alignment = { horizontal: "right" };
  ws.getCell(r, 15).value = { formula: `IFERROR(AVERAGEIF(B${r}:M${r},"<>0"),0)` } as unknown as number;
  ws.getCell(r, 15).numFmt = CURRENCY_FMT;
  ws.getCell(r, 15).alignment = { horizontal: "right" };
  styleTotalRow(ws.getRow(r), totalCols);
  r++;

  // Total Expenses (Fixed + Guilt-Free + Debt)
  ws.getCell(r, 1).value = "Total Expenses";
  for (let c = 2; c <= 13; c++) {
    const cl = colLetter(c);
    ws.getCell(r, c).value = { formula: `${cl}${totalExpensesRow}+${cl}${totalGfRow}+${cl}${totalDebtRow}` } as unknown as number;
    ws.getCell(r, c).numFmt = CURRENCY_FMT;
    ws.getCell(r, c).alignment = { horizontal: "right" };
  }
  ws.getCell(r, 14).value = { formula: `SUM(B${r}:M${r})` } as unknown as number;
  ws.getCell(r, 14).numFmt = CURRENCY_FMT;
  ws.getCell(r, 14).alignment = { horizontal: "right" };
  ws.getCell(r, 15).value = { formula: `IFERROR(AVERAGEIF(B${r}:M${r},"<>0"),0)` } as unknown as number;
  ws.getCell(r, 15).numFmt = CURRENCY_FMT;
  ws.getCell(r, 15).alignment = { horizontal: "right" };
  styleDataRow(ws.getRow(r), totalCols, false);
  const totalAllExpensesRow = r;
  r++;

  // Balance = Income - All Expenses
  ws.getCell(r, 1).value = "Balance";
  for (let c = 2; c <= 13; c++) {
    const cl = colLetter(c);
    ws.getCell(r, c).value = { formula: `${cl}${totalIncomeRow}-${cl}${totalAllExpensesRow}` } as unknown as number;
    ws.getCell(r, c).numFmt = CURRENCY_FMT;
    ws.getCell(r, c).alignment = { horizontal: "right" };
  }
  ws.getCell(r, 14).value = { formula: `SUM(B${r}:M${r})` } as unknown as number;
  ws.getCell(r, 14).numFmt = CURRENCY_FMT;
  ws.getCell(r, 14).alignment = { horizontal: "right" };
  ws.getCell(r, 15).value = { formula: `IFERROR(AVERAGEIF(B${r}:M${r},"<>0"),0)` } as unknown as number;
  ws.getCell(r, 15).numFmt = CURRENCY_FMT;
  ws.getCell(r, 15).alignment = { horizontal: "right" };
  // Style balance with navy bg — default to green font, conditional formatting handles red
  for (let c = 1; c <= totalCols; c++) {
    ws.getCell(r, c).fill = navyFill();
    ws.getCell(r, c).font = { bold: true, color: { argb: GREEN }, size: 11 };
    ws.getCell(r, c).border = thinBorder();
  }
  ws.getCell(r, 1).font = { bold: true, color: { argb: GOLD }, size: 11 };

  // Add conditional formatting: red text when balance < 0, green when >= 0
  const balRangeRef = `B${r}:${colLetter(totalCols)}${r}`;
  ws.addConditionalFormatting({
    ref: balRangeRef,
    rules: [
      {
        type: "cellIs",
        operator: "lessThan",
        priority: 1,
        formulae: [0],
        style: { font: { color: { argb: "FF" + RED }, bold: true } },
      },
      {
        type: "cellIs",
        operator: "greaterThanOrEqual",
        priority: 2,
        formulae: [0],
        style: { font: { color: { argb: "FF" + GREEN }, bold: true } },
      },
    ],
  });
  r += 3;

  // ═══════════════════════════════════
  // SAVINGS & INVESTMENTS
  // ═══════════════════════════════════
  ws.mergeCells(r, 1, r, totalCols);
  ws.getCell(r, 1).value = `${year} Savings/Investments`;
  styleSectionTitle(ws.getRow(r), totalCols);
  ws.getRow(r).height = 24;
  r++;

  // Headers
  ws.getCell(r, 1).value = "Category";
  for (let i = 0; i < 12; i++) {
    ws.getCell(r, i + 2).value = MONTHS[i];
  }
  ws.getCell(r, 14).value = "YTD TOTAL";
  ws.getCell(r, 15).value = "MONTHLY AVG";
  styleHeaderRow(ws.getRow(r), totalCols);
  r++;

  altFlag = false;
  const savingsStartRow = r;
  for (const row of a.savings) {
    if (!row.label && row.amount === 0) continue;
    r = addMonthlyRow(row.label || "Unnamed", row.amount, r, altFlag); altFlag = !altFlag;
  }
  const savingsEndRow = r - 1;

  // Amount Invested (SUM)
  ws.getCell(r, 1).value = "Amount Invested";
  for (let c = 2; c <= 13; c++) {
    const cl = colLetter(c);
    ws.getCell(r, c).value = { formula: `SUM(${cl}${savingsStartRow}:${cl}${savingsEndRow})` } as unknown as number;
    ws.getCell(r, c).numFmt = CURRENCY_FMT;
    ws.getCell(r, c).alignment = { horizontal: "right" };
  }
  ws.getCell(r, 14).value = { formula: `SUM(B${r}:M${r})` } as unknown as number;
  ws.getCell(r, 14).numFmt = CURRENCY_FMT;
  ws.getCell(r, 14).alignment = { horizontal: "right" };
  ws.getCell(r, 15).value = { formula: `IFERROR(AVERAGEIF(B${r}:M${r},"<>0"),0)` } as unknown as number;
  ws.getCell(r, 15).numFmt = CURRENCY_FMT;
  ws.getCell(r, 15).alignment = { horizontal: "right" };
  styleTotalRow(ws.getRow(r), totalCols);
  r += 3;

  // ═══════════════════════════════════
  // NET WORTH
  // ═══════════════════════════════════
  if (a.showNetWorth) {
    ws.mergeCells(r, 1, r, 5);
    ws.getCell(r, 1).value = "Net Worth";
    styleSectionTitle(ws.getRow(r), 5);
    ws.getRow(r).height = 24;
    r++;

    // Quarterly headers
    ws.getCell(r, 1).value = "";
    ws.getCell(r, 2).value = `Q1 (${MONTH_SHORT[0]}.)`;
    ws.getCell(r, 3).value = `Q2 (${MONTH_SHORT[3]}.)`;
    ws.getCell(r, 4).value = `Q3 (${MONTH_SHORT[6]}.)`;
    ws.getCell(r, 5).value = `Q4 (${MONTH_SHORT[10]}.)`;
    styleHeaderRow(ws.getRow(r), 5);
    r++;

    // Assets header
    ws.getCell(r, 1).value = "Assets";
    ws.getCell(r, 1).font = { bold: true, color: { argb: NAVY }, size: 11 };
    r++;

    const assetItems: [string, number][] = [
      ["Real Estate", a.assets.realEstate],
      ["Retirement (Roth IRA, etc.)", a.assets.retirement],
      ["Cash/Savings", a.assets.cashSavings],
      ["Vehicle", a.assets.vehicle],
    ];
    const assetStartRow = r;
    for (let i = 0; i < assetItems.length; i++) {
      ws.getCell(r, 1).value = assetItems[i][0];
      ws.getCell(r, 1).font = { color: { argb: TEXT_DARK }, size: 10 };
      ws.getCell(r, 1).border = thinBorder();
      ws.getCell(r, 2).value = assetItems[i][1];
      ws.getCell(r, 2).numFmt = CURRENCY_FMT;
      ws.getCell(r, 2).border = thinBorder();
      ws.getCell(r, 2).alignment = { horizontal: "right" };
      if (i % 2 === 1) { ws.getCell(r, 1).fill = lightFill(); ws.getCell(r, 2).fill = lightFill(); }
      r++;
    }
    const assetEndRow = r - 1;

    // Total Assets with formula
    ws.getCell(r, 1).value = "Total Assets";
    ws.getCell(r, 2).value = { formula: `SUM(B${assetStartRow}:B${assetEndRow})` } as unknown as number;
    ws.getCell(r, 2).numFmt = CURRENCY_FMT;
    ws.getCell(r, 2).alignment = { horizontal: "right" };
    styleTotalRow(ws.getRow(r), 2);
    const totalAssetsRow = r;
    r += 2;

    // Liabilities header
    ws.getCell(r, 1).value = "Liabilities";
    ws.getCell(r, 1).font = { bold: true, color: { argb: NAVY }, size: 11 };
    r++;

    const liabilityItems: [string, number][] = [
      ["Mortgage", a.liabilities.mortgage],
      ["Student Loans", a.liabilities.studentLoans],
      ["Other Debt", a.liabilities.otherDebt],
    ];
    const liabStartRow = r;
    for (let i = 0; i < liabilityItems.length; i++) {
      ws.getCell(r, 1).value = liabilityItems[i][0];
      ws.getCell(r, 1).font = { color: { argb: TEXT_DARK }, size: 10 };
      ws.getCell(r, 1).border = thinBorder();
      ws.getCell(r, 2).value = liabilityItems[i][1];
      ws.getCell(r, 2).numFmt = CURRENCY_FMT;
      ws.getCell(r, 2).border = thinBorder();
      ws.getCell(r, 2).alignment = { horizontal: "right" };
      if (i % 2 === 1) { ws.getCell(r, 1).fill = lightFill(); ws.getCell(r, 2).fill = lightFill(); }
      r++;
    }
    const liabEndRow = r - 1;

    // Total Liabilities
    ws.getCell(r, 1).value = "Total Liabilities";
    ws.getCell(r, 2).value = { formula: `SUM(B${liabStartRow}:B${liabEndRow})` } as unknown as number;
    ws.getCell(r, 2).numFmt = CURRENCY_FMT;
    ws.getCell(r, 2).alignment = { horizontal: "right" };
    styleTotalRow(ws.getRow(r), 2);
    const totalLiabRow = r;
    r += 2;

    // NET WORTH = Assets - Liabilities
    ws.getCell(r, 1).value = "NET WORTH";
    ws.getCell(r, 1).fill = navyFill();
    ws.getCell(r, 1).font = { bold: true, color: { argb: GOLD }, size: 12 };
    ws.getCell(r, 1).border = thinBorder();
    ws.getCell(r, 2).value = { formula: `B${totalAssetsRow}-B${totalLiabRow}` } as unknown as number;
    ws.getCell(r, 2).numFmt = CURRENCY_FMT;
    ws.getCell(r, 2).fill = navyFill();
    ws.getCell(r, 2).font = { bold: true, color: { argb: d.netWorth >= 0 ? GREEN : RED }, size: 12 };
    ws.getCell(r, 2).border = thinBorder();
    ws.getCell(r, 2).alignment = { horizontal: "right" };
    r++;
  }

  r += 2;

  // ─── Footer ───
  ws.mergeCells(r, 1, r, totalCols);
  ws.getCell(r, 1).value = "Lucas Murphy  |  eXp Realty  |  (414)-269-4909  |  lucas.murphy@exprealty.com";
  ws.getCell(r, 1).font = { color: { argb: GOLD }, size: 10, bold: true };
  ws.getCell(r, 1).fill = navyFill();
  ws.getCell(r, 1).alignment = { horizontal: "center" };
  r++;
  ws.mergeCells(r, 1, r, totalCols);
  ws.getCell(r, 1).value = "lucasmurphyrealestate.com/tools/budget-planner";
  ws.getCell(r, 1).font = { color: { argb: WHITE }, size: 9 };
  ws.getCell(r, 1).fill = navyFill();
  ws.getCell(r, 1).alignment = { horizontal: "center" };
}

// ═══════════════════════════════════════════════════
// TAB 3: House Affordability
// ═══════════════════════════════════════════════════

function buildAffordabilitySheet(wb: ExcelJS.Workbook, state: BudgetPlannerState, derived: BudgetDerived, userName: string) {
  const ws = wb.addWorksheet("House Affordability", {
    views: [{ showGridLines: true }],
  });
  const inputs = state.affordability;
  const d = derived.affordability;
  const totalCols = 7;

  ws.columns = [
    { width: 30 }, { width: 18 }, { width: 18 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 18 },
  ];

  let r = 1;

  // ─── Title banner ───
  ws.mergeCells(r, 1, r, totalCols);
  const titleCell = ws.getCell(r, 1);
  titleCell.value = `House Affordability Analysis — ${userName}`;
  titleCell.fill = navyFill();
  titleCell.font = { bold: true, color: { argb: GOLD }, size: 16 };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(r).height = 30;
  r++;

  ws.mergeCells(r, 1, r, totalCols);
  ws.getCell(r, 1).value = `Prepared ${new Date().toLocaleDateString()} | Lucas Murphy, eXp Realty | (414)-269-4909`;
  ws.getCell(r, 1).fill = navyFill();
  ws.getCell(r, 1).font = { color: { argb: WHITE }, size: 10 };
  ws.getCell(r, 1).alignment = { horizontal: "center", vertical: "middle" };
  r++;

  ws.mergeCells(r, 1, r, totalCols);
  ws.getCell(r, 1).fill = goldFill();
  ws.getRow(r).height = 4;
  r++;
  r++;

  // ─── Inputs section ───
  ws.getCell(r, 1).value = "Your Financial Inputs";
  ws.getCell(r, 1).fill = navyFill();
  ws.getCell(r, 1).font = { bold: true, color: { argb: WHITE }, size: 11 };
  ws.getCell(r, 1).border = thinBorder();
  ws.getCell(r, 2).fill = navyFill();
  ws.getCell(r, 2).border = thinBorder();
  r++;

  const inputRows: [string, number, string][] = [
    ["Annual Gross Income", inputs.annualGrossIncome, CURRENCY_FMT],
    ["Annual Net (Take-Home) Income", inputs.annualNetIncome, CURRENCY_FMT],
    ["Monthly Gross Income", d.monthlyGross, CURRENCY_FMT],
    ["Monthly Net Income", d.monthlyNet, CURRENCY_FMT],
    ["Monthly Existing Debt", inputs.monthlyDebtPayments, CURRENCY_FMT],
    ["Down Payment Saved", inputs.downPaymentSaved, CURRENCY_FMT],
    ["Interest Rate", inputs.interestRate / 100, PERCENT_FMT],
    ["Loan Term (years)", inputs.loanTerm, "0"],
    ["Property Tax Rate", inputs.propertyTaxRate / 100, PERCENT_FMT],
    ["Home Insurance (annual)", inputs.homeInsuranceAnnual, CURRENCY_FMT],
    ["PMI Rate", inputs.pmiRate / 100, PERCENT_FMT],
  ];

  for (let i = 0; i < inputRows.length; i++) {
    const [label, val, fmt] = inputRows[i];
    ws.getCell(r, 1).value = label;
    ws.getCell(r, 1).font = { color: { argb: TEXT_DARK }, size: 10 };
    ws.getCell(r, 1).border = thinBorder();
    ws.getCell(r, 2).value = val;
    ws.getCell(r, 2).numFmt = fmt;
    ws.getCell(r, 2).font = { bold: true, color: { argb: TEXT_DARK }, size: 10 };
    ws.getCell(r, 2).border = thinBorder();
    ws.getCell(r, 2).alignment = { horizontal: "right" };
    if (i % 2 === 1) {
      ws.getCell(r, 1).fill = lightFill();
      ws.getCell(r, 2).fill = lightFill();
    }
    r++;
  }

  r += 2;

  // ─── Comparison table ───
  ws.getCell(r, 1).value = "Affordability Comparison";
  for (let c = 1; c <= totalCols; c++) {
    ws.getCell(r, c).fill = goldFill();
    ws.getCell(r, c).font = { bold: true, color: { argb: NAVY }, size: 12 };
    ws.getCell(r, c).border = thinBorder();
  }
  r++;

  const compHeaders = ["Philosophy", "Max Home Price", "Monthly P&I", "Monthly Taxes", "Monthly Insurance", "Monthly PMI", "Total Monthly"];
  for (let c = 0; c < compHeaders.length; c++) {
    ws.getCell(r, c + 1).value = compHeaders[c];
  }
  styleHeaderRow(ws.getRow(r), totalCols, true);
  r++;

  const philosophies = [
    { result: d.philosophies.ramsey, note: " (15yr fixed)" },
    { result: d.philosophies.conventional, note: "" },
    { result: d.philosophies.fha, note: "" },
    { result: d.philosophies.aggressive, note: "" },
  ];

  for (let i = 0; i < philosophies.length; i++) {
    const { result, note } = philosophies[i];
    const alt = i % 2 === 1;

    ws.getCell(r, 1).value = result.label + note;
    ws.getCell(r, 2).value = result.maxHomePrice;
    ws.getCell(r, 2).numFmt = CURRENCY_FMT;
    ws.getCell(r, 3).value = result.monthlyPI;
    ws.getCell(r, 3).numFmt = CURRENCY_FMT;
    ws.getCell(r, 4).value = result.monthlyTaxes;
    ws.getCell(r, 4).numFmt = CURRENCY_FMT;
    ws.getCell(r, 5).value = result.monthlyInsurance;
    ws.getCell(r, 5).numFmt = CURRENCY_FMT;
    ws.getCell(r, 6).value = result.monthlyPMI;
    ws.getCell(r, 6).numFmt = CURRENCY_FMT;
    ws.getCell(r, 7).value = result.totalMonthlyHousing;
    ws.getCell(r, 7).numFmt = CURRENCY_FMT;

    for (let c = 1; c <= totalCols; c++) {
      ws.getCell(r, c).border = thinBorder();
      ws.getCell(r, c).alignment = c > 1 ? { horizontal: "right" } : {};
      ws.getCell(r, c).font = { color: { argb: TEXT_DARK }, size: 10 };
      if (alt) ws.getCell(r, c).fill = lightFill();
    }
    r++;
  }

  r += 2;

  // ─── Detailed breakdown ───
  ws.getCell(r, 1).value = "Detailed Breakdown";
  for (let c = 1; c <= 5; c++) {
    ws.getCell(r, c).fill = goldFill();
    ws.getCell(r, c).font = { bold: true, color: { argb: NAVY }, size: 12 };
    ws.getCell(r, c).border = thinBorder();
  }
  r++;

  const detailHeaders = ["Philosophy", "Loan Amount", "Total Interest", "Front-End DTI", "Back-End DTI"];
  for (let c = 0; c < detailHeaders.length; c++) {
    ws.getCell(r, c + 1).value = detailHeaders[c];
  }
  styleHeaderRow(ws.getRow(r), 5, true);
  r++;

  for (let i = 0; i < philosophies.length; i++) {
    const { result, note } = philosophies[i];
    const alt = i % 2 === 1;

    ws.getCell(r, 1).value = result.label + note;
    ws.getCell(r, 2).value = result.maxLoanAmount;
    ws.getCell(r, 2).numFmt = CURRENCY_FMT;
    ws.getCell(r, 3).value = result.totalInterestPaid;
    ws.getCell(r, 3).numFmt = CURRENCY_FMT;
    ws.getCell(r, 4).value = result.frontEndDTI / 100;
    ws.getCell(r, 4).numFmt = PERCENT_FMT;
    ws.getCell(r, 5).value = result.backEndDTI / 100;
    ws.getCell(r, 5).numFmt = PERCENT_FMT;

    for (let c = 1; c <= 5; c++) {
      ws.getCell(r, c).border = thinBorder();
      ws.getCell(r, c).alignment = c > 1 ? { horizontal: "right" } : {};
      ws.getCell(r, c).font = { color: { argb: TEXT_DARK }, size: 10 };
      if (alt) ws.getCell(r, c).fill = lightFill();
    }
    r++;
  }

  r += 2;

  // ─── Philosophy explanations ───
  ws.mergeCells(r, 1, r, totalCols);
  ws.getCell(r, 1).value = "About These Affordability Rules";
  ws.getCell(r, 1).fill = goldFill();
  ws.getCell(r, 1).font = { bold: true, color: { argb: NAVY }, size: 12 };
  r++;

  const explanations: [string, string][] = [
    ["Dave Ramsey", "Max 25% of take-home pay on P&I only, 15-year fixed. The most conservative approach — eliminates debt stress and builds equity fast."],
    ["28/36 Rule", "Max 28% of gross on housing, 36% total debt. The standard guideline recommended by most financial advisors."],
    ["FHA Guidelines", "Max 31% front-end, 43% back-end DTI. Government-backed — makes homeownership accessible for first-time buyers."],
    ["Aggressive / Stretch", "Max 35% front-end, 50% back-end DTI. Some lenders approve this, but leaves less room for savings and emergencies."],
  ];

  for (let i = 0; i < explanations.length; i++) {
    const [name, desc] = explanations[i];
    ws.getCell(r, 1).value = name;
    ws.getCell(r, 1).font = { bold: true, color: { argb: NAVY }, size: 10 };
    ws.getCell(r, 1).border = thinBorder();
    ws.mergeCells(r, 2, r, totalCols);
    ws.getCell(r, 2).value = desc;
    ws.getCell(r, 2).font = { color: { argb: TEXT_DARK }, size: 10 };
    ws.getCell(r, 2).border = thinBorder();
    ws.getCell(r, 2).alignment = { wrapText: true };
    if (i % 2 === 1) {
      ws.getCell(r, 1).fill = lightFill();
      ws.getCell(r, 2).fill = lightFill();
    }
    ws.getRow(r).height = 30;
    r++;
  }

  r += 2;

  // ─── Footer ───
  ws.mergeCells(r, 1, r, totalCols);
  ws.getCell(r, 1).value = "Lucas Murphy  |  eXp Realty  |  (414)-269-4909  |  lucas.murphy@exprealty.com";
  ws.getCell(r, 1).font = { color: { argb: GOLD }, size: 10, bold: true };
  ws.getCell(r, 1).fill = navyFill();
  ws.getCell(r, 1).alignment = { horizontal: "center" };
  r++;
  ws.mergeCells(r, 1, r, totalCols);
  ws.getCell(r, 1).value = "lucasmurphyrealestate.com/tools/budget-planner";
  ws.getCell(r, 1).font = { color: { argb: WHITE }, size: 9 };
  ws.getCell(r, 1).fill = navyFill();
  ws.getCell(r, 1).alignment = { horizontal: "center" };
}
