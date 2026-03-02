import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { PropertyType, InvestmentInputs, HouseHackState, DerivedValues } from "./types";
import { PROPERTY_TYPE_UNITS } from "./defaults";
import { formatCurrency } from "./calculations";
import { generateDealAnalysisPDF } from "./pdf/generateDealAnalysisPDF";

const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

interface LeadCaptureSectionProps {
  propertyType: PropertyType;
  investment: InvestmentInputs;
  state: HouseHackState;
  derived: DerivedValues;
}

const LeadCaptureSection = ({ propertyType, investment, state, derived }: LeadCaptureSectionProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"prompt" | "form" | "success">("prompt");
  const [isSpecific, setIsSpecific] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

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

      // Generate and download PDF
      const userName = formData.get("name") as string;
      await generateDealAnalysisPDF(state, derived, userName);

      setStep("success");
      toast({ title: "Your analysis is ready!", description: "Check your downloads folder for the PDF." });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or call us at (414) 458-1952.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <Card className="border-primary/30">
        <CardContent className="py-8 text-center">
          <p className="text-lg font-display font-bold">Your analysis has been downloaded!</p>
          <p className="text-sm text-muted-foreground mt-2">
            Check your downloads folder for the PDF. We'll also reach out to discuss your investment goals.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="text-lg font-display">Get Your Deal Analysis</CardTitle>
        <p className="text-xs text-muted-foreground">
          Want a copy of these numbers or help evaluating a specific property?
        </p>
      </CardHeader>
      <CardContent>
        {step === "prompt" ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Is this analysis for a specific property?</p>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => { setIsSpecific(true); setStep("form"); }}
              >
                Yes, a specific property
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setIsSpecific(false); setStep("form"); }}
              >
                No, just exploring
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Full Name</Label>
                <Input name="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Email</Label>
                <Input name="email" type="email" placeholder="john@email.com" required />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Phone (optional)</Label>
              <Input name="phone" type="tel" placeholder="(414) 555-0123" />
            </div>

            {isSpecific && (
              <>
                <hr className="border-border" />
                <p className="text-xs text-muted-foreground">Property details (pre-filled from calculator):</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Type: {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} ({PROPERTY_TYPE_UNITS[propertyType]} units)</p>
                  <p>Price: {formatCurrency(investment.purchasePrice)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Property Address / Location</Label>
                  <Input name="address" placeholder="123 Main St, Milwaukee, WI" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Total Bedrooms</Label>
                    <Input name="bedrooms" type="number" placeholder="e.g. 4" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Total Bathrooms</Label>
                    <Input name="bathrooms" type="number" step="0.5" placeholder="e.g. 2" />
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Generating PDF..." : "Download My Analysis"}
            </Button>
            <button
              type="button"
              onClick={() => setStep("prompt")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-center"
            >
              Go back
            </button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadCaptureSection;
