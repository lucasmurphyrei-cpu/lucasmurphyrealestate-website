import { jsPDF } from "jspdf";
import "jspdf-autotable";
import type { HouseHackState, DerivedValues } from "../types";
import provisionLogoUrl from "@/assets/provision-logo.png";
import expLogoUrl from "@/assets/exp-logo.png";
import { imageToBase64 } from "./pdfUtils";
import {
  renderHeader,
  renderInvestmentSection,
  renderIncomeSection,
  renderExpensesSection,
  renderReturnsSection,
  renderReservesSection,
  renderContactFooter,
} from "./pdfSections";

export async function generateDealAnalysisPDF(
  state: HouseHackState,
  derived: DerivedValues,
  userName: string,
): Promise<void> {
  const doc = new jsPDF("portrait", "mm", "letter");

  // Load logos (parallel)
  const [provisionLogo, expLogo] = await Promise.all([
    imageToBase64(provisionLogoUrl).catch(() => ""),
    imageToBase64(expLogoUrl).catch(() => ""),
  ]);

  // Page 1: Header
  let y = renderHeader(doc, { provision: provisionLogo, exp: expLogo }, state.propertyType, state.mode, userName);

  // Investment
  y = renderInvestmentSection(doc, state, derived);

  // Income
  y = renderIncomeSection(doc, state, derived, y);

  // Expenses
  y = renderExpensesSection(doc, state, derived, y);

  // Returns
  y = renderReturnsSection(doc, state, derived, y);

  // Reserves (owner-occupied only)
  if (state.mode === "owner-occupied") {
    y = renderReservesSection(doc, state, derived, y);
  }

  // Contact footer on last page
  renderContactFooter(doc);

  // Download
  const dateStr = new Date().toISOString().slice(0, 10);
  const modeLabel = state.mode === "owner-occupied" ? "Owner-Occupied" : "All-Units-Rented";
  const filename = `House-Hack-Analysis-${state.propertyType}-${modeLabel}-${dateStr}.pdf`;
  doc.save(filename);
}
