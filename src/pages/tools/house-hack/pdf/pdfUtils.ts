import type { jsPDF } from "jspdf";
import { GOLD, TEXT_DARK, MARGIN, CONTENT_WIDTH, FONT_SECTION_HEADING, GREEN, RED } from "./pdfBranding";

export async function imageToBase64(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = src;
  });
}

export function addSectionHeading(doc: jsPDF, title: string, y: number): number {
  // Gold accent bar
  doc.setFillColor(...GOLD);
  doc.rect(MARGIN, y, 3, 7, "F");

  // Title text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT_SECTION_HEADING);
  doc.setTextColor(...TEXT_DARK);
  doc.text(title, MARGIN + 6, y + 5.5);

  return y + 12;
}

export function addDivider(doc: jsPDF, y: number): number {
  doc.setDrawColor(220, 225, 230);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);
  return y + 4;
}

export function colorForValue(value: number): [number, number, number] {
  if (value > 0) return GREEN;
  if (value < 0) return RED;
  return TEXT_DARK;
}

export function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > 260) {
    doc.addPage();
    return 15;
  }
  return y;
}
