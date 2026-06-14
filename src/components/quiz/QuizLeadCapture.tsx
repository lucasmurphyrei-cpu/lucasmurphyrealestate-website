import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmailInput } from "@/components/ui/email-input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;
const GOLD = "hsl(44,100%,53%)";

interface QuizLeadCaptureProps {
  crmTags: string;
  topMatch: string;
  onSubmitted: () => void;
  onSkip: () => void;
  theme?: "light" | "dark";
}

const QuizLeadCapture = ({
  crmTags,
  topMatch,
  onSubmitted,
  onSkip,
  theme = "light",
}: QuizLeadCaptureProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const isDark = theme === "dark";

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
      params.append("source", "neighborhood-quiz");
      params.append("crm_tags", crmTags);
      params.append("top_match", topMatch);
      params.append("timestamp", new Date().toISOString());

      await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        body: params,
      });

      toast({
        title: "Results ready!",
        description: "We'll be in touch to help you find the perfect neighborhood.",
      });
      onSubmitted();
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or call us at (414)-269-4909.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h3 className={`font-display text-xl font-bold mb-2 text-center ${isDark ? "text-white" : ""}`}>
        Almost there!
      </h3>
      <p className={`text-sm text-center mb-6 ${isDark ? "text-white/60" : "text-muted-foreground"}`}>
        Enter your info to see your personalized results and get neighborhood insights sent to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quiz-name" className={isDark ? "text-white/80" : ""}>Full Name</Label>
          <Input
            id="quiz-name"
            name="name"
            placeholder="Jane Doe"
            required
            className={isDark ? "bg-white/[0.07] border-white/15 text-white placeholder:text-white/30 focus-visible:ring-[hsl(44,100%,53%)] focus-visible:border-[hsl(44,100%,53%)]" : ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quiz-email" className={isDark ? "text-white/80" : ""}>Email</Label>
          <EmailInput
            id="quiz-email"
            name="email"
            placeholder="jane@example.com"
            required
            className={isDark ? "bg-white/[0.07] border-white/15 text-white placeholder:text-white/30 focus-visible:ring-[hsl(44,100%,53%)] focus-visible:border-[hsl(44,100%,53%)]" : ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quiz-phone" className={isDark ? "text-white/80" : ""}>Phone (optional)</Label>
          <Input
            id="quiz-phone"
            name="phone"
            type="tel"
            placeholder="(414) 555-0123"
            className={isDark ? "bg-white/[0.07] border-white/15 text-white placeholder:text-white/30 focus-visible:ring-[hsl(44,100%,53%)] focus-visible:border-[hsl(44,100%,53%)]" : ""}
          />
        </div>
        {isDark ? (
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm py-3 text-sm font-semibold text-[#0a1424] transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: GOLD }}
          >
            {loading ? "Submitting..." : "See My Results"}
          </button>
        ) : (
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "See My Results"}
          </Button>
        )}
      </form>
      <button
        type="button"
        onClick={onSkip}
        className={`mt-3 block w-full text-center text-sm transition-colors ${
          isDark
            ? "text-white/40 hover:text-white/70"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        Skip and see results
      </button>
    </div>
  );
};

export default QuizLeadCapture;
