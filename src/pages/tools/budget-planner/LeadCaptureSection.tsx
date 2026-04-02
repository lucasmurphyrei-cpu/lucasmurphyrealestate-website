import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmailInput } from "@/components/ui/email-input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { BudgetPlannerState, BudgetDerived, BudgetTab } from "./types";
import { generateBudgetPDF } from "./pdf/generateBudgetPDF";

const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

interface Props {
  tab: BudgetTab;
  state: BudgetPlannerState;
  derived: BudgetDerived;
}

const LeadCaptureSection = ({ tab, state, derived }: Props) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"prompt" | "form" | "success">("prompt");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const userName = formData.get("name") as string;

    try {
      // Submit lead to Google Sheets (non-blocking — don't let this prevent PDF download)
      if (GOOGLE_SHEETS_URL) {
        const params = new URLSearchParams();
        params.append("name", userName);
        params.append("email", formData.get("email") as string);
        params.append("phone", (formData.get("phone") as string) || "");
        params.append("source", `budget-planner-${tab}`);
        params.append("timestamp", new Date().toISOString());

        fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", body: params }).catch(() => {});
      }

      // Generate and download PDF
      await generateBudgetPDF(state, derived, tab, userName);

      setStep("success");
      toast({ title: "Your budget is ready!", description: "Check your downloads folder for the Excel file." });
    } catch (err) {
      console.error("Excel generation failed:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again or call us at (414)-269-4909.",
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
          <p className="text-lg font-display font-bold">Your budget has been downloaded!</p>
          <p className="text-sm text-muted-foreground mt-2">
            Check your downloads folder for the Excel file. You can open it in Google Sheets or Excel to customize. We'll also reach out to help with your homeownership goals.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="lead-capture" className="border-primary/30">
      <CardHeader>
        <CardTitle className="text-lg font-display">Download Your Budget</CardTitle>
        <p className="text-xs text-muted-foreground">
          Get an Excel spreadsheet with your monthly budget, annual budget, and house affordability analysis — editable in Google Sheets or Excel.
        </p>
      </CardHeader>
      <CardContent>
        {step === "prompt" ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Want a downloadable copy of your budget?</p>
            <Button size="sm" onClick={() => setStep("form")} className="w-full">
              Yes, download my budget
            </Button>
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
                <EmailInput name="email" placeholder="john@email.com" required />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Phone (optional)</Label>
              <Input name="phone" type="tel" placeholder="(414) 555-0123" />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Generating..." : "Download My Budget"}
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
