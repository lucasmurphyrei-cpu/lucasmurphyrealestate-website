import type { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type {
  HouseHackState,
  DerivedValues,
  PropertyType,
  AnalysisMode,
  ExpenseInputs,
  ExpensesDerived,
} from "../types";
import { PROPERTY_TYPE_UNITS } from "../defaults";
import { formatCurrency, formatPercent } from "../calculations";
import {
  NAVY, GOLD, WHITE, LIGHT_GRAY, TEXT_DARK, TEXT_MUTED,
  MARGIN, CONTENT_WIDTH, PAGE_WIDTH, PAGE_HEIGHT,
  FONT_TITLE, FONT_SUBTITLE, FONT_BODY, FONT_SMALL, FONT_TINY,
  CONTACT,
} from "./pdfBranding";
import { addSectionHeading, addDivider, colorForValue, ensureSpace } from "./pdfUtils";

// ─── Header ────────────────────────────────────────────────

interface Logos {
  provision: string;
  exp: string;
}

export function renderHeader(
  doc: jsPDF,
  logos: Logos,
  propertyType: PropertyType,
  mode: AnalysisMode,
  userName: string,
): number {
  const headerHeight = 48;

  // Navy background
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_WIDTH, headerHeight, "F");

  // Logos
  try {
    doc.addImage(logos.provision, "PNG", MARGIN, 8, 32, 32);
  } catch { /* logo load failed, skip */ }
  try {
    doc.addImage(logos.exp, "PNG", PAGE_WIDTH - MARGIN - 28, 14, 28, 20);
  } catch { /* logo load failed, skip */ }

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT_TITLE);
  doc.setTextColor(...GOLD);
  doc.text("House Hack Deal Analysis", PAGE_WIDTH / 2, 20, { align: "center" });

  // Subtitle line
  const typeLabel = propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
  const modeLabel = mode === "owner-occupied" ? "Owner-Occupied" : "All Units Rented";
  const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(FONT_SUBTITLE);
  doc.setTextColor(...WHITE);
  doc.text(`${typeLabel}  ·  ${modeLabel}  ·  ${dateStr}`, PAGE_WIDTH / 2, 30, { align: "center" });

  // Prepared for
  doc.setFontSize(FONT_BODY);
  doc.text(`Prepared for: ${userName}`, PAGE_WIDTH / 2, 38, { align: "center" });

  // Gold accent line at bottom of header
  doc.setFillColor(...GOLD);
  doc.rect(0, headerHeight, PAGE_WIDTH, 1.5, "F");

  return headerHeight + 8;
}

// ─── Investment ────────────────────────────────────────────

export function renderInvestmentSection(
  doc: jsPDF,
  state: HouseHackState,
  derived: DerivedValues,
): number {
  let y = ensureSpace(doc, doc.internal.getCurrentPageInfo().pageNumber === 1 ? 56 : 15, 80);
  y = addSectionHeading(doc, "1. Investment Summary", y);

  const inv = state.investment;
  const d = derived.investment;
  const isCash = inv.financingType === "cash";
  const isFHA = inv.financingType === "fha";

  const rows: string[][] = [
    ["Purchase Price", formatCurrency(inv.purchasePrice)],
    ["Financing Type", inv.financingType === "conventional" ? "Conventional" : inv.financingType === "fha" ? "FHA" : "Cash"],
  ];

  if (!isCash) {
    rows.push(
      ["Down Payment", `${inv.downPaymentPercent}% (${formatCurrency(d.downPaymentDollar)})`],
      ["Interest Rate", `${inv.interestRate}%`],
      ["Loan Term", `${inv.loanTermYears} years`],
      ["Loan Amount", formatCurrency(d.loanWithoutMIP)],
    );
    if (isFHA) {
      rows.push(
        ["Upfront MIP", formatCurrency(d.upfrontMIP)],
        ["Total Loan (with MIP)", formatCurrency(d.totalLoan)],
      );
    }
  }

  if (inv.downPaymentAssistance > 0 && !isCash) {
    rows.push(["Down Payment Assistance", formatCurrency(inv.downPaymentAssistance)]);
  }

  rows.push(
    ["Closing Costs", `${inv.closingCostsPercent}% (${formatCurrency(d.closingCostsDollar)})`],
  );
  if (inv.initialRepairs > 0) {
    rows.push(["Initial Repairs", formatCurrency(inv.initialRepairs)]);
  }

  rows.push(
    ["Monthly Taxes", formatCurrency(inv.monthlyTaxes)],
    ["Monthly Insurance", formatCurrency(inv.monthlyInsurance)],
  );
  if (!isCash && inv.monthlyMortgageInsurance > 0) {
    rows.push(["Monthly Mortgage Insurance", formatCurrency(inv.monthlyMortgageInsurance)]);
  }

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    theme: "plain",
    styles: { fontSize: FONT_BODY, textColor: TEXT_DARK, cellPadding: { top: 2, bottom: 2, left: 3, right: 3 } },
    columnStyles: { 0: { fontStyle: "normal", textColor: TEXT_MUTED }, 1: { fontStyle: "bold", halign: "right" } },
    body: rows,
    alternateRowStyles: { fillColor: LIGHT_GRAY },
  });

  y = (doc as any).lastAutoTable.finalY + 4;

  // Highlight box: key metrics
  const boxRows: string[][] = [];
  boxRows.push([isCash ? "Total Investment" : "Initial Investment (Cash Needed)", formatCurrency(d.initialInvestment)]);
  if (!isCash) {
    boxRows.push(["Monthly P&I", formatCurrency(d.monthlyPI)]);
  }
  boxRows.push([isCash ? "Monthly Costs (Tax + Insurance)" : "PITI (Monthly Payment)", formatCurrency(d.monthlyPITI)]);

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    theme: "plain",
    styles: { fontSize: FONT_BODY + 1, cellPadding: { top: 3, bottom: 3, left: 4, right: 4 } },
    columnStyles: {
      0: { fontStyle: "bold", textColor: TEXT_DARK },
      1: { fontStyle: "bold", halign: "right", textColor: NAVY },
    },
    body: boxRows,
    tableLineColor: GOLD as any,
    tableLineWidth: 0.5,
    didDrawPage: () => {
      // Gold left border on the highlight box
      const tableY = y;
      const tableH = (doc as any).lastAutoTable.finalY - tableY;
      doc.setFillColor(...GOLD);
      doc.rect(MARGIN, tableY, 1.5, tableH, "F");
    },
  });

  return (doc as any).lastAutoTable.finalY + 8;
}

// ─── Income ────────────────────────────────────────────────

export function renderIncomeSection(
  doc: jsPDF,
  state: HouseHackState,
  derived: DerivedValues,
  startY: number,
): number {
  let y = ensureSpace(doc, startY, 50);
  y = addSectionHeading(doc, "2. Income", y);

  const isOwner = state.mode === "owner-occupied";
  const income = isOwner ? state.ownerOccupiedIncome : state.allUnitsIncome;
  const unitCount = PROPERTY_TYPE_UNITS[state.propertyType];
  const rents = [income.unit1Rent, income.unit2Rent, income.unit3Rent, income.unit4Rent];

  const rows: string[][] = [];
  for (let i = 0; i < unitCount; i++) {
    const unitLabel = `Unit ${i + 1}`;
    if (isOwner && i === 0) {
      rows.push([unitLabel, "You Live Here"]);
    } else {
      rows.push([unitLabel, `${formatCurrency(rents[i])}/mo`]);
    }
  }
  if (income.otherIncome > 0) {
    rows.push(["Other Income", `${formatCurrency(income.otherIncome)}/mo`]);
  }
  rows.push(["Vacancy Rate", `${income.vacancyPercent}%`]);

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    theme: "plain",
    styles: { fontSize: FONT_BODY, textColor: TEXT_DARK, cellPadding: { top: 2, bottom: 2, left: 3, right: 3 } },
    columnStyles: { 0: { textColor: TEXT_MUTED }, 1: { fontStyle: "bold", halign: "right" } },
    body: rows,
    alternateRowStyles: { fillColor: LIGHT_GRAY },
  });

  y = (doc as any).lastAutoTable.finalY + 3;
  y = addDivider(doc, y);

  // Summary
  const summaryRows: string[][] = [
    ["Gross Monthly Income", formatCurrency(derived.income.grossMonthlyIncome)],
    [`Vacancy Set-Aside (${income.vacancyPercent}%)`, `−${formatCurrency(derived.income.vacancyDollar)}/mo`],
    ["Effective Monthly Income", formatCurrency(derived.income.effectiveMonthlyIncome)],
    ["Effective Annual Income", formatCurrency(derived.income.effectiveAnnualIncome)],
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    theme: "plain",
    styles: { fontSize: FONT_BODY, textColor: TEXT_DARK, cellPadding: { top: 2, bottom: 2, left: 3, right: 3 } },
    columnStyles: { 0: { textColor: TEXT_MUTED }, 1: { fontStyle: "bold", halign: "right" } },
    body: summaryRows,
  });

  return (doc as any).lastAutoTable.finalY + 8;
}

// ─── Expenses ──────────────────────────────────────────────

export function renderExpensesSection(
  doc: jsPDF,
  state: HouseHackState,
  derived: DerivedValues,
  startY: number,
): number {
  let y = ensureSpace(doc, startY, 60);
  y = addSectionHeading(doc, "3. Expenses", y);

  const expenses = state.mode === "owner-occupied" ? state.ownerOccupiedExpenses : state.allUnitsExpenses;
  const monthlyPITI = derived.investment.monthlyPITI;

  const expenseItems: [string, number][] = [
    ["Maintenance/Repairs", expenses.maintenanceDollar],
    ["CapEx", expenses.capexDollar],
    ["Vacancy Reserve", expenses.vacancyDollar],
    ["Property Management", expenses.managementDollar],
    ["Utilities", expenses.utilities],
    ["Trash", expenses.trash],
    ["Lawn/Snow", expenses.lawnSnow],
    ["Other", expenses.other],
  ];

  const filledItems = expenseItems.filter(([, v]) => v > 0);

  const rows: string[][] = filledItems.map(([label, val]) => [label, `${formatCurrency(val)}/mo`]);

  if (rows.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      theme: "plain",
      styles: { fontSize: FONT_BODY, textColor: TEXT_DARK, cellPadding: { top: 2, bottom: 2, left: 3, right: 3 } },
      columnStyles: { 0: { textColor: TEXT_MUTED }, 1: { fontStyle: "bold", halign: "right" } },
      body: rows,
      alternateRowStyles: { fillColor: LIGHT_GRAY },
    });
    y = (doc as any).lastAutoTable.finalY + 3;
  }

  y = addDivider(doc, y);

  const summaryRows: string[][] = [
    ["Additional Monthly Expenses", formatCurrency(derived.expenses.additionalMonthlyExpenses)],
    ["PITI (Monthly Payment)", formatCurrency(monthlyPITI)],
    ["Total Monthly Expenses", formatCurrency(derived.expenses.totalMonthlyExpenses)],
    ["Total Annual Expenses", formatCurrency(derived.expenses.totalAnnualExpenses)],
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    theme: "plain",
    styles: { fontSize: FONT_BODY, textColor: TEXT_DARK, cellPadding: { top: 2, bottom: 2, left: 3, right: 3 } },
    columnStyles: { 0: { textColor: TEXT_MUTED }, 1: { fontStyle: "bold", halign: "right" } },
    body: summaryRows,
    didParseCell: (data: any) => {
      // Bold the total row
      if (data.row.index === 2 && data.column.index === 1) {
        data.cell.styles.textColor = NAVY;
        data.cell.styles.fontSize = FONT_BODY + 1;
      }
    },
  });

  return (doc as any).lastAutoTable.finalY + 8;
}

// ─── Returns ───────────────────────────────────────────────

export function renderReturnsSection(
  doc: jsPDF,
  state: HouseHackState,
  derived: DerivedValues,
  startY: number,
): number {
  let y = ensureSpace(doc, startY, 70);
  y = addSectionHeading(doc, "4. Returns", y);

  const isOwner = state.mode === "owner-occupied";
  const isCash = state.investment.financingType === "cash";

  if (isOwner) {
    const r = derived.ownerOccupiedReturns;
    const rows: [string, string, [number, number, number]][] = [
      ["Monthly Cash Flow", formatCurrency(r.monthlyCashFlow), colorForValue(r.monthlyCashFlow)],
      ["Annual Cash Flow", formatCurrency(r.annualCashFlow), colorForValue(r.annualCashFlow)],
      ["Cash-on-Cash ROI", formatPercent(r.cocROI), colorForValue(r.cocROI)],
      ["Effective Housing Cost", `${formatCurrency(r.effectiveHousingCost)}/mo`, TEXT_DARK],
      ["House Hack Savings", `${formatCurrency(r.houseHackSavings)}/mo`, colorForValue(r.houseHackSavings)],
      ["Annual Savings vs. Renting", formatCurrency(r.annualSavings), colorForValue(r.annualSavings)],
    ];

    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      theme: "plain",
      styles: { fontSize: FONT_BODY, cellPadding: { top: 2.5, bottom: 2.5, left: 3, right: 3 } },
      columnStyles: { 0: { textColor: TEXT_MUTED }, 1: { fontStyle: "bold", halign: "right" } },
      body: rows.map(([label, val]) => [label, val]),
      didParseCell: (data: any) => {
        if (data.column.index === 1) {
          data.cell.styles.textColor = rows[data.row.index]?.[2] || TEXT_DARK;
        }
      },
    });
  } else {
    const r = derived.allUnitsReturns;
    const rows: [string, string, [number, number, number]][] = [
      ["Monthly Cash Flow", formatCurrency(r.monthlyCashFlow), colorForValue(r.monthlyCashFlow)],
      ["Annual Cash Flow", formatCurrency(r.annualCashFlow), colorForValue(r.annualCashFlow)],
      ["Cash-on-Cash ROI", formatPercent(r.cocROI), colorForValue(r.cocROI)],
    ];

    if (!isCash) {
      rows.push(
        ["Principal Paydown (Year 1)", formatCurrency(r.principalPaydownYear1), TEXT_DARK],
        ["Principal Paydown ROI", formatPercent(r.principalPaydownROI), TEXT_DARK],
      );
    }

    rows.push(
      ["Annual Appreciation", formatCurrency(r.annualAppreciation), TEXT_DARK],
      [isCash ? "Total ROI (CF + Appreciation)" : "Total ROI (CF + PD + Appreciation)", formatPercent(r.combinedAllROI), colorForValue(r.combinedAllROI)],
    );

    // NOI section
    rows.push(
      ["", ""],
      ["Gross Annual Income", formatCurrency(r.grossAnnualIncome), TEXT_DARK],
      ["Operating Expenses", formatCurrency(r.operatingExpenses), TEXT_DARK],
      ["Net Operating Income (NOI)", formatCurrency(r.noi), colorForValue(r.noi)],
      ["Cap Rate", formatPercent(r.unleveragedYield), colorForValue(r.unleveragedYield)],
    );

    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      theme: "plain",
      styles: { fontSize: FONT_BODY, cellPadding: { top: 2.5, bottom: 2.5, left: 3, right: 3 } },
      columnStyles: { 0: { textColor: TEXT_MUTED }, 1: { fontStyle: "bold", halign: "right" } },
      body: rows.map(([label, val]) => [label, val]),
      didParseCell: (data: any) => {
        if (data.column.index === 1) {
          data.cell.styles.textColor = rows[data.row.index]?.[2] || TEXT_DARK;
        }
      },
    });
  }

  return (doc as any).lastAutoTable.finalY + 8;
}

// ─── Reserves ──────────────────────────────────────────────

export function renderReservesSection(
  doc: jsPDF,
  state: HouseHackState,
  derived: DerivedValues,
  startY: number,
): number {
  let y = ensureSpace(doc, startY, 50);
  y = addSectionHeading(doc, "5. Reserves", y);

  const expenses = state.ownerOccupiedExpenses;
  const expenseItems: [string, number][] = [
    ["Maintenance/Repairs", expenses.maintenanceDollar],
    ["CapEx", expenses.capexDollar],
    ["Vacancy Reserve", expenses.vacancyDollar],
    ["Property Management", expenses.managementDollar],
    ["Utilities", expenses.utilities],
    ["Trash", expenses.trash],
    ["Lawn/Snow", expenses.lawnSnow],
    ["Other", expenses.other],
  ];
  const filledExpenses = expenseItems.filter(([, v]) => v > 0);

  const rows: string[][] = [
    ["Rent Savings Applied to Reserves (Annual)", formatCurrency(derived.reserves.rentSavingsAppliedAnnual)],
    ["6-Month Reserves Needed", formatCurrency(derived.reserves.sixMonthReservesNeeded)],
    ["Additional Monthly Expenses", formatCurrency(derived.expenses.additionalMonthlyExpenses)],
    ["Money Set-Aside For Expenses (Annually)", formatCurrency(derived.expenses.additionalMonthlyExpenses * 12)],
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    theme: "plain",
    styles: { fontSize: FONT_BODY, textColor: TEXT_DARK, cellPadding: { top: 2, bottom: 2, left: 3, right: 3 } },
    columnStyles: { 0: { textColor: TEXT_MUTED }, 1: { fontStyle: "bold", halign: "right" } },
    body: rows,
  });

  y = (doc as any).lastAutoTable.finalY + 3;

  // Expense breakdown
  if (filledExpenses.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(FONT_SMALL);
    doc.setTextColor(...TEXT_MUTED);
    doc.text("Monthly expense breakdown:", MARGIN, y + 3);
    y += 6;

    const breakdownRows = filledExpenses.map(([label, val]) => [label, `${formatCurrency(val)}/mo`]);

    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN + 4, right: MARGIN },
      theme: "plain",
      styles: { fontSize: FONT_SMALL, textColor: TEXT_MUTED, cellPadding: { top: 1, bottom: 1, left: 2, right: 2 } },
      columnStyles: { 1: { halign: "right" } },
      body: breakdownRows,
    });
    y = (doc as any).lastAutoTable.finalY;
  }

  return y + 8;
}

// ─── Contact Footer ────────────────────────────────────────

export function renderContactFooter(doc: jsPDF): void {
  const footerHeight = 32;
  const footerY = PAGE_HEIGHT - footerHeight;

  // Navy background
  doc.setFillColor(...NAVY);
  doc.rect(0, footerY, PAGE_WIDTH, footerHeight, "F");

  // Gold accent line
  doc.setFillColor(...GOLD);
  doc.rect(0, footerY, PAGE_WIDTH, 1, "F");

  const centerX = PAGE_WIDTH / 2;
  let ty = footerY + 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT_BODY + 1);
  doc.setTextColor(...GOLD);
  doc.text(`${CONTACT.name}  ·  ${CONTACT.title}`, centerX, ty, { align: "center" });

  ty += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(FONT_BODY);
  doc.setTextColor(...WHITE);
  doc.text(`${CONTACT.phone}  ·  ${CONTACT.email}`, centerX, ty, { align: "center" });

  ty += 5;
  doc.setFontSize(FONT_SMALL);
  doc.text(`Schedule a consultation: ${CONTACT.calendly}`, centerX, ty, { align: "center" });

  ty += 5;
  doc.setFontSize(FONT_TINY);
  doc.setTextColor(150, 160, 175);
  doc.text(
    "This analysis is for informational purposes only and does not constitute financial or investment advice.",
    centerX,
    ty,
    { align: "center" },
  );
}
