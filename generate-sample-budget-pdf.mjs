/**
 * Quick script to generate sample Budget Planner PDFs for preview.
 * Run: node generate-sample-budget-pdf.mjs
 */

import { jsPDF } from "jspdf";
import fs from "fs";

const NAVY = [17, 34, 64];
const GOLD = [255, 204, 0];
const WHITE = [255, 255, 255];
const LIGHT_GRAY = [240, 242, 245];
const TEXT_DARK = [30, 41, 59];
const TEXT_MUTED = [100, 116, 139];
const GREEN = [52, 211, 153];
const RED = [248, 113, 113];
const PAGE_WIDTH = 215.9;
const MARGIN = 15;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const COL_RIGHT = PAGE_WIDTH - MARGIN;

const CONTACT = {
  name: "Lucas Murphy",
  title: "Real Estate Advisor",
  phone: "(414)-269-4909",
  email: "lucas.murphy@exprealty.com",
  calendly: "calendly.com/lucasmurphyrei",
  website: "LucasMurphy.exprealty.com",
};

function fmt(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}
function pct(n) { return `${n.toFixed(1)}%`; }

function renderHeader(doc, title, userName) {
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_WIDTH, 48, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...GOLD);
  doc.text(title, PAGE_WIDTH / 2, 22, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...WHITE);
  doc.text(`Prepared for ${userName}  |  ${new Date().toLocaleDateString()}`, PAGE_WIDTH / 2, 34, { align: "center" });
  doc.setFillColor(...GOLD);
  doc.rect(MARGIN, 48, CONTENT_WIDTH, 1.5, "F");
  return 58;
}

function sectionHeading(doc, title, y) {
  doc.setFillColor(...GOLD);
  doc.rect(MARGIN, y, 3, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...TEXT_DARK);
  doc.text(title, MARGIN + 6, y + 5.5);
  return y + 12;
}

function tableHeader(doc, cols, y) {
  doc.setFillColor(...NAVY);
  doc.rect(MARGIN, y, CONTENT_WIDTH, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...WHITE);
  cols.forEach(([text, x, align]) => doc.text(text, x, y + 5.5, { align: align || "left" }));
  return y + 10;
}

function tableRow(doc, cols, y, alt, bold) {
  if (alt) {
    doc.setFillColor(...LIGHT_GRAY);
    doc.rect(MARGIN, y - 1, CONTENT_WIDTH, 7, "F");
  }
  doc.setFont("helvetica", bold ? "bold" : "normal");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_DARK);
  cols.forEach(([text, x, align, color]) => {
    if (color) doc.setTextColor(...color);
    else doc.setTextColor(...TEXT_DARK);
    doc.text(String(text), x, y + 4, { align: align || "left" });
  });
  return y + 8;
}

function ensureSpace(doc, y, needed) {
  if (y + needed > 250) { doc.addPage(); return 15; }
  return y;
}

function renderFooter(doc) {
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    const fy = 258;
    doc.setFillColor(...NAVY);
    doc.rect(0, fy, PAGE_WIDTH, 22, "F");
    doc.setFillColor(...GOLD);
    doc.rect(0, fy, PAGE_WIDTH, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...GOLD);
    doc.text(CONTACT.name, MARGIN, fy + 7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...WHITE);
    doc.text(`${CONTACT.title}  |  ${CONTACT.phone}  |  ${CONTACT.email}`, MARGIN, fy + 12);
    doc.text(`${CONTACT.calendly}  |  ${CONTACT.website}`, MARGIN, fy + 16);
    doc.text(`Page ${i} of ${pages}`, PAGE_WIDTH - MARGIN, fy + 12, { align: "right" });
  }
}

// ─── MONTHLY ───
function genMonthly() {
  const doc = new jsPDF("portrait", "mm", "letter");
  let y = renderHeader(doc, "Monthly Cost Estimator", "John Smith");

  y = sectionHeading(doc, "Income Summary", y);
  y = tableHeader(doc, [["", MARGIN + 2], ["Amount", COL_RIGHT, "right"]], y);
  y = tableRow(doc, [["Annual Gross Salary", MARGIN + 2], [fmt(70000), COL_RIGHT, "right"]], y, false);
  y = tableRow(doc, [["Bi-Weekly Paycheck", MARGIN + 2], [fmt(2692.31), COL_RIGHT, "right"]], y, true);
  y = tableRow(doc, [["Monthly Income", MARGIN + 2], [fmt(5833.33), COL_RIGHT, "right"]], y, false);
  y += 6;

  y = sectionHeading(doc, "Monthly Fixed Costs", y);
  const mid = MARGIN + CONTENT_WIDTH * 0.55;
  y = tableHeader(doc, [["Expense", MARGIN + 2], ["Amount", mid, "right"], ["% of Income", COL_RIGHT, "right"]], y);
  const mo = 5833.33;
  const costs = [
    ["Rent / Mortgage", 1040], ["Insurance", 157], ["Groceries", 700],
    ["Internet", 45], ["Electricity", 90], ["Gas", 180],
    ["Loan Payments", 124], ["Subscriptions", 226], ["Pets", 130],
  ];
  const total = costs.reduce((s, c) => s + c[1], 0);
  costs.forEach(([name, amt], i) => {
    y = tableRow(doc, [
      [name, MARGIN + 2], [fmt(amt), mid, "right"], [pct((amt / mo) * 100), COL_RIGHT, "right"]
    ], y, i % 2 === 1);
  });
  y = tableRow(doc, [
    ["TOTAL", MARGIN + 2], [fmt(total), mid, "right"], [pct((total / mo) * 100), COL_RIGHT, "right"]
  ], y, false, true);
  y += 6;

  y = ensureSpace(doc, y, 50);
  y = sectionHeading(doc, "60/20/20 Budget Rule", y);
  const fixPct = (total / mo) * 100;
  const remPct = 100 - fixPct;
  y = tableHeader(doc, [["Category", MARGIN + 2], ["Recommended", MARGIN + 90], ["Actual", MARGIN + 125], ["Status", COL_RIGHT, "right"]], y);
  const rows = [
    ["Fixed Costs (Needs)", "60%", pct(fixPct), fixPct <= 60 ? "On Track" : "Over", fixPct <= 60 ? GREEN : RED],
    ["Savings / Investing", "20%", pct(remPct / 2), remPct / 2 >= 20 ? "On Track" : "Under", remPct / 2 >= 20 ? GREEN : RED],
    ["Guilt-Free Spending", "20%", pct(remPct / 2), remPct / 2 >= 20 ? "On Track" : "Under", remPct / 2 >= 20 ? GREEN : RED],
  ];
  rows.forEach(([cat, rec, act, status, color], i) => {
    y = tableRow(doc, [
      [cat, MARGIN + 2], [rec, MARGIN + 90], [act, MARGIN + 125], [status, COL_RIGHT, "right", color]
    ], y, i % 2 === 1);
  });
  y += 6;

  const remaining = mo - total;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_DARK);
  doc.text(`Remaining after fixed costs: ${fmt(remaining)}`, MARGIN, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...TEXT_MUTED);
  doc.text(`Split evenly: ${fmt(remaining / 2)} savings + ${fmt(remaining / 2)} guilt-free`, MARGIN, y);
  y += 10;

  y = ensureSpace(doc, y, 40);
  y = sectionHeading(doc, "Yearly Subscriptions", y);
  y = tableHeader(doc, [["Subscription", MARGIN + 2], ["Annual Cost", COL_RIGHT, "right"]], y);
  const subs = [["AAA Membership", 97], ["AMEX Annual Fee", 95], ["Capital One Annual Fee", 95], ["License Plate Renewal", 145]];
  subs.forEach(([name, cost], i) => {
    y = tableRow(doc, [[name, MARGIN + 2], [fmt(cost), COL_RIGHT, "right"]], y, i % 2 === 1);
  });
  const subTotal = subs.reduce((s, c) => s + c[1], 0);
  y = tableRow(doc, [["TOTAL", MARGIN + 2], [fmt(subTotal), COL_RIGHT, "right"]], y, false, true);
  y = tableRow(doc, [["Monthly Equivalent", MARGIN + 2], [fmt(subTotal / 12), COL_RIGHT, "right"]], y, true, true);

  renderFooter(doc);
  fs.writeFileSync("Sample-Monthly-Budget.pdf", Buffer.from(doc.output("arraybuffer")));
  console.log("✓ Sample-Monthly-Budget.pdf");
}

// ─── ANNUAL ───
function genAnnual() {
  const doc = new jsPDF("portrait", "mm", "letter");
  let y = renderHeader(doc, "Annual Budget Planner", "John Smith");
  const mid = MARGIN + CONTENT_WIDTH * 0.55;

  // Income
  y = sectionHeading(doc, "Monthly Income", y);
  y = tableHeader(doc, [["Source", MARGIN + 2], ["Monthly", mid, "right"], ["Annual", COL_RIGHT, "right"]], y);
  y = tableRow(doc, [["Income from Work", MARGIN + 2], [fmt(4500), mid, "right"], [fmt(54000), COL_RIGHT, "right"]], y, false);
  y = tableRow(doc, [["Miscellaneous", MARGIN + 2], [fmt(200), mid, "right"], [fmt(2400), COL_RIGHT, "right"]], y, true);
  y = tableRow(doc, [["TOTAL", MARGIN + 2], [fmt(4700), mid, "right"], [fmt(56400), COL_RIGHT, "right"]], y, false, true);
  y += 6;

  // Fixed Expenses
  y = sectionHeading(doc, "Fixed Expenses (50/50 Split Applied)", y);
  y = tableHeader(doc, [["Expense", MARGIN + 2], ["Monthly", COL_RIGHT, "right"]], y);
  const exps = [
    ["Mortgage / Rent", 1070], ["Electricity", 130], ["Internet", 45],
    ["Groceries", 650], ["Pet Costs", 85], ["Life Insurance", 37],
    ["Umbrella Insurance", 26], ["Car Insurance", 87], ["Gas", 180], ["Subscriptions", 72],
  ];
  const expTotal = exps.reduce((s, c) => s + c[1], 0);
  exps.forEach(([name, amt], i) => {
    y = tableRow(doc, [[name, MARGIN + 2], [fmt(amt), COL_RIGHT, "right"]], y, i % 2 === 1);
  });
  y = tableRow(doc, [["TOTAL", MARGIN + 2], [fmt(expTotal), COL_RIGHT, "right"]], y, false, true);
  y += 6;

  // Guilt-Free
  y = ensureSpace(doc, y, 50);
  y = sectionHeading(doc, "Guilt-Free Spending", y);
  y = tableHeader(doc, [["Category", MARGIN + 2], ["Monthly", COL_RIGHT, "right"]], y);
  const gf = [["Restaurants / Fast Food", 150], ["Entertainment", 75], ["Shopping", 50], ["Gifts", 30], ["Haircut", 40], ["Misc / Travel", 100]];
  const gfTotal = gf.reduce((s, c) => s + c[1], 0);
  gf.forEach(([name, amt], i) => { y = tableRow(doc, [[name, MARGIN + 2], [fmt(amt), COL_RIGHT, "right"]], y, i % 2 === 1); });
  y = tableRow(doc, [["TOTAL", MARGIN + 2], [fmt(gfTotal), COL_RIGHT, "right"]], y, false, true);
  y += 6;

  // Debt
  y = ensureSpace(doc, y, 30);
  y = sectionHeading(doc, "Debt Payments", y);
  y = tableHeader(doc, [["", MARGIN + 2], ["Monthly", COL_RIGHT, "right"]], y);
  y = tableRow(doc, [["Student Loans", MARGIN + 2], [fmt(124), COL_RIGHT, "right"]], y, false);
  y = tableRow(doc, [["Debt Repayment", MARGIN + 2], [fmt(200), COL_RIGHT, "right"]], y, true);
  y = tableRow(doc, [["TOTAL", MARGIN + 2], [fmt(324), COL_RIGHT, "right"]], y, false, true);
  y += 6;

  // Savings
  y = ensureSpace(doc, y, 30);
  y = sectionHeading(doc, "Savings & Investments", y);
  y = tableHeader(doc, [["", MARGIN + 2], ["Monthly", COL_RIGHT, "right"]], y);
  y = tableRow(doc, [["Monthly Savings", MARGIN + 2], [fmt(500), COL_RIGHT, "right"]], y, false);
  y = tableRow(doc, [["Monthly Investing", MARGIN + 2], [fmt(400), COL_RIGHT, "right"]], y, true);
  y = tableRow(doc, [["TOTAL", MARGIN + 2], [fmt(900), COL_RIGHT, "right"]], y, false, true);
  y = tableRow(doc, [["Savings Rate", MARGIN + 2], ["19.1%", COL_RIGHT, "right"]], y, true, true);
  y += 6;

  // Summary
  y = ensureSpace(doc, y, 50);
  y = sectionHeading(doc, "Monthly Budget Summary", y);
  y = tableHeader(doc, [["", MARGIN + 2], ["Amount", COL_RIGHT, "right"]], y);
  const netRemaining = 4700 - expTotal - gfTotal - 324 - 900;
  y = tableRow(doc, [["Total Income", MARGIN + 2], [fmt(4700), COL_RIGHT, "right"]], y, false);
  y = tableRow(doc, [["Fixed Expenses", MARGIN + 2], [fmt(expTotal), COL_RIGHT, "right"]], y, true);
  y = tableRow(doc, [["Guilt-Free Spending", MARGIN + 2], [fmt(gfTotal), COL_RIGHT, "right"]], y, false);
  y = tableRow(doc, [["Debt Payments", MARGIN + 2], [fmt(324), COL_RIGHT, "right"]], y, true);
  y = tableRow(doc, [["Savings & Investments", MARGIN + 2], [fmt(900), COL_RIGHT, "right"]], y, false);
  y = tableRow(doc, [["NET REMAINING", MARGIN + 2], [fmt(netRemaining), COL_RIGHT, "right", netRemaining >= 0 ? GREEN : RED]], y, true, true);
  y += 6;

  // Net Worth
  doc.addPage();
  y = 15;
  y = sectionHeading(doc, "Net Worth Snapshot", y);
  y = tableHeader(doc, [["", MARGIN + 2], ["Amount", COL_RIGHT, "right"]], y);
  const nwRows = [
    ["Real Estate", 300000, false], ["Retirement Accounts", 25000, true],
    ["Cash & Savings", 15000, false], ["Vehicle", 12000, true],
    ["Total Assets", 352000, false, true],
    ["Mortgage Balance", 220000, true], ["Student Loans", 32000, false],
    ["Other Debt", 5000, true],
    ["Total Liabilities", 257000, false, true],
    ["NET WORTH", 95000, true, true],
  ];
  nwRows.forEach(([name, amt, alt, bold], i) => {
    const color = i === nwRows.length - 1 ? GREEN : undefined;
    y = tableRow(doc, [[name, MARGIN + 2], [fmt(amt), COL_RIGHT, "right", color]], y, alt, bold);
  });

  renderFooter(doc);
  fs.writeFileSync("Sample-Annual-Budget.pdf", Buffer.from(doc.output("arraybuffer")));
  console.log("✓ Sample-Annual-Budget.pdf");
}

genMonthly();
genAnnual();
