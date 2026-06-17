import { useState } from "react";
import type { PropertyType, InvestmentInputs, HouseHackState, DerivedValues } from "@/pages/tools/house-hack/types";
import { PROPERTY_TYPE_UNITS } from "@/pages/tools/house-hack/defaults";
import { formatCurrency } from "@/pages/tools/house-hack/calculations";
import { generateDealAnalysisPDF } from "@/pages/tools/house-hack/pdf/generateDealAnalysisPDF";
import { cardCls, fieldCls, labelCls, Pill } from "./previewUi";

const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

interface LeadCaptureSectionProps {
  propertyType: PropertyType;
  investment: InvestmentInputs;
  state: HouseHackState;
  derived: DerivedValues;
}

const primaryBtn = "w-full rounded-sm bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60";

const LeadCaptureSection = ({ propertyType, investment, state, derived }: LeadCaptureSectionProps) => {
  const [step, setStep] = useState<"prompt" | "form" | "success">("prompt");
  const [isSpecific, setIsSpecific] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    try {
      if (!GOOGLE_SHEETS_URL) throw new Error("Form endpoint not configured");
      const params = new URLSearchParams();
      params.append("name", formData.get("name") as string);
      params.append("email", formData.get("email") as string);
      params.append("phone", (formData.get("phone") as string) || "");
      params.append("source", "house-hack-calculator");
      params.append("property_type", propertyType);
      params.append("purchase_price", String(investment.purchasePrice));
      params.append("financing_type", investment.financingType);
      if (isSpecific) {
        params.append("property_address", (formData.get("address") as string) || "");
        params.append("bedrooms", (formData.get("bedrooms") as string) || "");
        params.append("bathrooms", (formData.get("bathrooms") as string) || "");
      }
      params.append("timestamp", new Date().toISOString());
      await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", body: params });

      const userName = formData.get("name") as string;
      await generateDealAnalysisPDF(state, derived, userName);
      setStep("success");
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className={`${cardCls} border-accent/40 py-8 text-center`}>
        <p className="font-display text-lg font-bold">Your analysis has been downloaded!</p>
        <p className="mt-2 text-sm text-muted-foreground">Check your downloads folder for the PDF. We'll also reach out to discuss your investment goals.</p>
      </div>
    );
  }

  return (
    <div className={`${cardCls} border-accent/40`}>
      <div className="mb-4">
        <h3 className="font-display text-lg font-semibold">Get Your Deal Analysis</h3>
        <p className="mt-1 text-xs text-muted-foreground">Want a copy of these numbers or help evaluating a specific property?</p>
      </div>
      {step === "prompt" ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Is this analysis for a specific property?</p>
          <div className="flex flex-wrap gap-2">
            <Pill active onClick={() => { setIsSpecific(true); setStep("form"); }}>Yes, a specific property</Pill>
            <Pill active={false} onClick={() => { setIsSpecific(false); setStep("form"); }}>No, just exploring</Pill>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Full Name</label>
              <input name="name" placeholder="John Doe" required className={fieldCls} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input name="email" type="email" placeholder="john@email.com" required className={fieldCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input name="phone" type="tel" required placeholder="(414) 555-0123" className={fieldCls} />
          </div>

          {isSpecific && (
            <>
              <hr className="border-border" />
              <p className="text-xs text-muted-foreground">Property details (pre-filled from calculator):</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Type: {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} ({PROPERTY_TYPE_UNITS[propertyType]} units)</p>
                <p>Price: {formatCurrency(investment.purchasePrice)}</p>
              </div>
              <div>
                <label className={labelCls}>Property Address / Location</label>
                <input name="address" placeholder="123 Main St, Milwaukee, WI" className={fieldCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Total Bedrooms</label>
                  <input name="bedrooms" type="number" placeholder="e.g. 4" className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>Total Bathrooms</label>
                  <input name="bathrooms" type="number" step="0.5" placeholder="e.g. 2" className={fieldCls} />
                </div>
              </div>
            </>
          )}

          {error && <p className="text-xs text-red-600">Something went wrong. Please try again or call (414)-458-1952.</p>}
          <button type="submit" disabled={loading} className={primaryBtn}>{loading ? "Generating PDF..." : "Download My Analysis"}</button>
          <button type="button" onClick={() => setStep("prompt")} className="w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground">Go back</button>
        </form>
      )}
    </div>
  );
};

export default LeadCaptureSection;
