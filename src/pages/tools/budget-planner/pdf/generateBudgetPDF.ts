import { jsPDF } from "jspdf";
import "jspdf-autotable";
import type { BudgetPlannerState, BudgetDerived, BudgetTab } from "../types";
import provisionLogoUrl from "@/assets/provision-logo.png";
import expLogoUrl from "@/assets/exp-logo.png";
import { imageToBase64, addSectionHeading, ensureSpace } from "../../house-hack/pdf/pdfUtils";
import {
  NAVY, GOLD, WHITE, LIGHT_GRAY, TEXT_DARK, TEXT_MUTED, GREEN, RED,
  MARGIN, CONTENT_WIDTH, PAGE_WIDTH,
  FONT_TITLE, FONT_SUBTITLE, FONT_BODY, FONT_SMALL, FONT_TINY,
  CONTACT,
} from "../../house-hack/pdf/pdfBranding";
import { formatCurrency, formatPercent } from "../calculations";

// Extend jsPDF with autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: Record<string, unknown>) => void;
    lastAutoTable: { finalY: number };
  }
}

export async function generateBudgetPDF(
  state: BudgetPlannerState,
  derived: BudgetDerived,
  tab: BudgetTab,
  userName: string,
): Promise<void> {
  const doc = new jsPDF("portrait", "mm", "letter");

  // Load logos
  const [provisionLogo, expLogo] = await Promise.all([
    imageToBase64(provisionLogoUrl).catch(() => ""),
    imageToBase64(expLogoUrl).catch(() => ""),
  ]);

  // ─── Header ───
  let y = renderHeader(doc, { provision: provisionLogo, exp: expLogo }, tab, userName);

  if (tab === "monthly") {
    y = renderMonthlyContent(doc, state, derived, y);
  } else {
    y = renderAnnualContent(doc, state, derived, y);
  }

  // Footer on last page
  renderContactFooter(doc);

  const dateStr = new Date().toISOString().slice(0, 10);
  const label = tab === "monthly" ? "Monthly-Budget" : "Annual-Budget";
  doc.save(`${label}-${dateStr}.pdf`);
}

// ─── Header ───

function renderHeader(
  doc: jsPDF,
  logos: { provision: string; exp: string },
  tab: BudgetTab,
  userName: string,
): number {
  // Navy banner
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_WIDTH, 48, "F");

  // Logos
  if (logos.provision) doc.addImage(logos.provision, "PNG", MARGIN, 8, 32, 32);
  if (logos.exp) doc.addImage(logos.exp, "PNG", PAGE_WIDTH - MARGIN - 32, 10, 32, 28);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT_TITLE);
  doc.setTextColor(...GOLD);
  const title = tab === "monthly" ? "Monthly Cost Estimator" : "Annual Budget Planner";
  doc.text(title, PAGE_WIDTH / 2, 22, { align: "center" });

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(FONT_SUBTITLE);
  doc.setTextColor(...WHITE);
  doc.text(`Prepared for ${userName}  |  ${new Date().toLocaleDateString()}`, PAGE_WIDTH / 2, 34, { align: "center" });

  // Gold accent line
  doc.setFillColor(...GOLD);
  doc.rect(MARGIN, 48, CONTENT_WIDTH, 1.5, "F");

  return 58;
}

// ─── Monthly Content ───

function renderMonthlyContent(doc: jsPDF, state: BudgetPlannerState, derived: BudgetDerived, startY: number): number {
  const m = state.monthly;
  const d = derived.monthly;
  let y = startY;

  // Income summary
  y = addSectionHeading(doc, "Income Summary", y);

  doc.autoTable({
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [["", "Amount"]],
    body: [
      ["Annual Gross", formatCurrency(d.annualGross)],
      ["Est. Tax Rate", formatPercent(d.effectiveTaxRate)],
      ["Annual Net", formatCurrency(d.annualNet)],
      ["Monthly Net", formatCurrency(d.monthlyNet)],
    ],
    styles: { fontSize: FONT_BODY, cellPadding: 3, textColor: TEXT_DARK },
    headStyles: { fillColor: NAVY, textColor: WHITE, fontStyle: "bold" },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
  });
  y = doc.lastAutoTable.finalY + 8;

  // Fixed costs
  y = ensureSpace(doc, y, 60);
  y = addSectionHeading(doc, "Monthly Fixed Costs", y);

  const costRows = m.fixedCosts
    .filter((row) => row.label || row.amount > 0)
    .map((row) => [
      row.label || "Unnamed",
      formatCurrency(row.amount),
      d.monthlyNet > 0 ? formatPercent(d.costPercentages[row.id] || 0) : "—",
    ]);
  costRows.push(["TOTAL", formatCurrency(d.totalFixedCosts), formatPercent(d.actualFixedPercent)]);

  doc.autoTable({
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [["Expense", "Amount", "% of Income"]],
    body: costRows,
    styles: { fontSize: FONT_BODY, cellPadding: 3, textColor: TEXT_DARK },
    headStyles: { fillColor: NAVY, textColor: WHITE, fontStyle: "bold" },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    didParseCell: (data: { row: { index: number }; section: string; cell: { styles: Record<string, unknown> } }) => {
      if (data.section === "body" && data.row.index === costRows.length - 1) {
        data.cell.styles.fontStyle = "bold";
      }
    },
  });
  y = doc.lastAutoTable.finalY + 8;

  // Budget Rule
  y = ensureSpace(doc, y, 40);
  y = addSectionHeading(doc, "60/20/20 Budget Rule", y);

  doc.autoTable({
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [["Category", "Recommended", "Actual", "Status"]],
    body: [
      ["Fixed Costs (Needs)", "60%", formatPercent(d.actualFixedPercent), d.actualFixedPercent <= 60 ? "On Track" : "Over"],
      ["Savings / Investing", "20%", formatPercent(d.actualRemainingPercent / 2), d.actualRemainingPercent / 2 >= 20 ? "On Track" : "Under"],
      ["Guilt-Free Spending", "20%", formatPercent(d.actualRemainingPercent / 2), d.actualRemainingPercent / 2 >= 20 ? "On Track" : "Under"],
    ],
    styles: { fontSize: FONT_BODY, cellPadding: 3, textColor: TEXT_DARK },
    headStyles: { fillColor: NAVY, textColor: WHITE, fontStyle: "bold" },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    didParseCell: (data: { column: { index: number }; section: string; cell: { styles: Record<string, unknown>; text: string[] } }) => {
      if (data.section === "body" && data.column.index === 3) {
        data.cell.styles.textColor = data.cell.text[0] === "On Track" ? GREEN : RED;
        data.cell.styles.fontStyle = "bold";
      }
    },
  });
  y = doc.lastAutoTable.finalY + 8;

  // Remaining summary
  y = ensureSpace(doc, y, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT_BODY);
  doc.setTextColor(...TEXT_DARK);
  doc.text(`Remaining after fixed costs: ${formatCurrency(d.actualRemaining)}`, MARGIN, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(FONT_SMALL);
  doc.setTextColor(...TEXT_MUTED);
  doc.text(`Split evenly: ${formatCurrency(d.actualRemaining / 2)} savings + ${formatCurrency(d.actualRemaining / 2)} guilt-free`, MARGIN, y);
  y += 10;

  // Yearly subscriptions
  if (m.yearlySubscriptions.length > 0) {
    y = ensureSpace(doc, y, 40);
    y = addSectionHeading(doc, "Yearly Subscriptions", y);

    const subRows = m.yearlySubscriptions.map((s) => [s.name, formatCurrency(s.cost)]);
    subRows.push(["TOTAL", formatCurrency(d.yearlySubsTotal)]);
    subRows.push(["Monthly Equivalent", formatCurrency(d.yearlySubsMonthly)]);

    doc.autoTable({
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      head: [["Subscription", "Annual Cost"]],
      body: subRows,
      styles: { fontSize: FONT_BODY, cellPadding: 3, textColor: TEXT_DARK },
      headStyles: { fillColor: NAVY, textColor: WHITE, fontStyle: "bold" },
      alternateRowStyles: { fillColor: LIGHT_GRAY },
      didParseCell: (data: { row: { index: number }; section: string; cell: { styles: Record<string, unknown> } }) => {
        if (data.section === "body" && data.row.index >= subRows.length - 2) {
          data.cell.styles.fontStyle = "bold";
        }
      },
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  return y;
}

// ─── Annual Content ───

function renderAnnualContent(doc: jsPDF, state: BudgetPlannerState, derived: BudgetDerived, startY: number): number {
  const a = state.annual;
  const d = derived.annual;
  let y = startY;

  // Income
  y = addSectionHeading(doc, "Monthly Income", y);
  doc.autoTable({
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [["Source", "Monthly", "Annual"]],
    body: [
      ["Income from Work", formatCurrency(a.income.workIncome), formatCurrency(a.income.workIncome * 12)],
      ["Miscellaneous", formatCurrency(a.income.miscIncome), formatCurrency(a.income.miscIncome * 12)],
      ["TOTAL", formatCurrency(d.totalMonthlyIncome), formatCurrency(d.totalAnnualIncome)],
    ],
    styles: { fontSize: FONT_BODY, cellPadding: 3, textColor: TEXT_DARK },
    headStyles: { fillColor: NAVY, textColor: WHITE, fontStyle: "bold" },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    didParseCell: (data: { row: { index: number }; section: string; cell: { styles: Record<string, unknown> } }) => {
      if (data.section === "body" && data.row.index === 2) data.cell.styles.fontStyle = "bold";
    },
  });
  y = doc.lastAutoTable.finalY + 8;

  // Fixed expenses
  y = ensureSpace(doc, y, 60);
  y = addSectionHeading(doc, `Fixed Expenses${a.splitWithSpouse ? " (50/50 Split Applied)" : ""}`, y);

  const expRows = a.fixedExpenses
    .filter((row) => row.label || row.amount > 0)
    .map((row) => {
      const effective = a.splitWithSpouse && row.splitEligible ? row.amount / 2 : row.amount;
      return [row.label || "Unnamed", formatCurrency(effective)];
    });
  expRows.push(["TOTAL", formatCurrency(d.totalFixedExpenses)]);

  doc.autoTable({
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [["Expense", "Monthly"]],
    body: expRows,
    styles: { fontSize: FONT_BODY, cellPadding: 3, textColor: TEXT_DARK },
    headStyles: { fillColor: NAVY, textColor: WHITE, fontStyle: "bold" },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    didParseCell: (data: { row: { index: number }; section: string; cell: { styles: Record<string, unknown> } }) => {
      if (data.section === "body" && data.row.index === expRows.length - 1) data.cell.styles.fontStyle = "bold";
    },
  });
  y = doc.lastAutoTable.finalY + 8;

  // Guilt-free spending
  y = ensureSpace(doc, y, 40);
  y = addSectionHeading(doc, "Guilt-Free Spending", y);

  const gfRows = a.guiltFree
    .filter((row) => row.label || row.amount > 0)
    .map((row) => [row.label || "Unnamed", formatCurrency(row.amount)]);
  gfRows.push(["TOTAL", formatCurrency(d.totalGuiltFree)]);

  doc.autoTable({
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [["Category", "Monthly"]],
    body: gfRows,
    styles: { fontSize: FONT_BODY, cellPadding: 3, textColor: TEXT_DARK },
    headStyles: { fillColor: NAVY, textColor: WHITE, fontStyle: "bold" },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    didParseCell: (data: { row: { index: number }; section: string; cell: { styles: Record<string, unknown> } }) => {
      if (data.section === "body" && data.row.index === gfRows.length - 1) data.cell.styles.fontStyle = "bold";
    },
  });
  y = doc.lastAutoTable.finalY + 8;

  // Debt payments
  y = ensureSpace(doc, y, 30);
  y = addSectionHeading(doc, "Debt Payments", y);

  const debtRows = a.debt
    .filter((row) => row.label || row.amount > 0)
    .map((row) => [row.label || "Unnamed", formatCurrency(row.amount)]);
  debtRows.push(["TOTAL", formatCurrency(d.totalDebt)]);

  doc.autoTable({
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [["", "Monthly"]],
    body: debtRows,
    styles: { fontSize: FONT_BODY, cellPadding: 3, textColor: TEXT_DARK },
    headStyles: { fillColor: NAVY, textColor: WHITE, fontStyle: "bold" },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    didParseCell: (data: { row: { index: number }; section: string; cell: { styles: Record<string, unknown> } }) => {
      if (data.section === "body" && data.row.index === debtRows.length - 1) data.cell.styles.fontStyle = "bold";
    },
  });
  y = doc.lastAutoTable.finalY + 8;

  // Savings
  y = ensureSpace(doc, y, 30);
  y = addSectionHeading(doc, "Savings & Investments", y);

  const savingsRows = a.savings
    .filter((row) => row.label || row.amount > 0)
    .map((row) => [row.label || "Unnamed", formatCurrency(row.amount)]);
  savingsRows.push(["TOTAL", formatCurrency(d.totalSavings)]);
  savingsRows.push(["Savings Rate", formatPercent(d.savingsRate)]);

  doc.autoTable({
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [["", "Monthly"]],
    body: savingsRows,
    styles: { fontSize: FONT_BODY, cellPadding: 3, textColor: TEXT_DARK },
    headStyles: { fillColor: NAVY, textColor: WHITE, fontStyle: "bold" },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    didParseCell: (data: { row: { index: number }; section: string; cell: { styles: Record<string, unknown> } }) => {
      if (data.section === "body" && data.row.index >= savingsRows.length - 2) data.cell.styles.fontStyle = "bold";
    },
  });
  y = doc.lastAutoTable.finalY + 8;

  // Budget summary
  y = ensureSpace(doc, y, 40);
  y = addSectionHeading(doc, "Monthly Budget Summary", y);
  doc.autoTable({
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [["", "Amount"]],
    body: [
      ["Total Income", formatCurrency(d.totalMonthlyIncome)],
      ["Fixed Expenses", formatCurrency(d.totalFixedExpenses)],
      ["Guilt-Free Spending", formatCurrency(d.totalGuiltFree)],
      ["Debt Payments", formatCurrency(d.totalDebt)],
      ["Savings & Investments", formatCurrency(d.totalSavings)],
      ["NET REMAINING", formatCurrency(d.netMonthly)],
    ],
    styles: { fontSize: FONT_BODY, cellPadding: 3, textColor: TEXT_DARK },
    headStyles: { fillColor: NAVY, textColor: WHITE, fontStyle: "bold" },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    didParseCell: (data: { row: { index: number }; section: string; cell: { styles: Record<string, unknown> } }) => {
      if (data.section === "body" && data.row.index === 5) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.textColor = d.netMonthly >= 0 ? GREEN : RED;
      }
    },
  });
  y = doc.lastAutoTable.finalY + 8;

  // Net worth (if user filled it in)
  if (a.showNetWorth && (d.totalAssets > 0 || d.totalLiabilities > 0)) {
    y = ensureSpace(doc, y, 40);
    y = addSectionHeading(doc, "Net Worth Snapshot", y);
    doc.autoTable({
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      head: [["", "Amount"]],
      body: [
        ["Real Estate", formatCurrency(a.assets.realEstate)],
        ["Retirement Accounts", formatCurrency(a.assets.retirement)],
        ["Cash & Savings", formatCurrency(a.assets.cashSavings)],
        ["Vehicle", formatCurrency(a.assets.vehicle)],
        ["Total Assets", formatCurrency(d.totalAssets)],
        ["Mortgage Balance", formatCurrency(a.liabilities.mortgage)],
        ["Student Loans", formatCurrency(a.liabilities.studentLoans)],
        ["Other Debt", formatCurrency(a.liabilities.otherDebt)],
        ["Total Liabilities", formatCurrency(d.totalLiabilities)],
        ["NET WORTH", formatCurrency(d.netWorth)],
      ],
      styles: { fontSize: FONT_BODY, cellPadding: 3, textColor: TEXT_DARK },
      headStyles: { fillColor: NAVY, textColor: WHITE, fontStyle: "bold" },
      alternateRowStyles: { fillColor: LIGHT_GRAY },
      didParseCell: (data: { row: { index: number }; section: string; cell: { styles: Record<string, unknown> } }) => {
        if (data.section === "body" && (data.row.index === 4 || data.row.index === 8 || data.row.index === 9)) {
          data.cell.styles.fontStyle = "bold";
        }
        if (data.section === "body" && data.row.index === 9) {
          data.cell.styles.textColor = d.netWorth >= 0 ? GREEN : RED;
        }
      },
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  return y;
}

// ─── Contact Footer ───

function renderContactFooter(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Navy footer band
    const footerY = 258;
    doc.setFillColor(...NAVY);
    doc.rect(0, footerY, PAGE_WIDTH, 22, "F");

    // Gold accent
    doc.setFillColor(...GOLD);
    doc.rect(0, footerY, PAGE_WIDTH, 1, "F");

    // Contact info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(FONT_SMALL);
    doc.setTextColor(...GOLD);
    doc.text(CONTACT.name, MARGIN, footerY + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(FONT_TINY);
    doc.setTextColor(...WHITE);
    doc.text(
      `${CONTACT.title}  |  ${CONTACT.phone}  |  ${CONTACT.email}`,
      MARGIN,
      footerY + 12,
    );
    doc.text(
      `${CONTACT.calendly}  |  ${CONTACT.website}`,
      MARGIN,
      footerY + 16,
    );

    // Budget planner link
    doc.setFontSize(FONT_TINY);
    doc.setTextColor(...GOLD);
    doc.text(
      "Use the interactive budget planner: lucasmurphyrealestate.com/tools/budget-planner",
      PAGE_WIDTH - MARGIN,
      footerY + 16,
      { align: "right" },
    );

    // Page number
    doc.setFontSize(FONT_TINY);
    doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN, footerY + 12, { align: "right" });
  }
}
