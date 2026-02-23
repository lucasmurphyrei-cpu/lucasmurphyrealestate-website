import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

interface QuizLeadCaptureProps {
  crmTags: string;
  topMatch: string;
  onSubmitted: () => void;
  onSkip: () => void;
}

const QuizLeadCapture = ({
  crmTags,
  topMatch,
  onSubmitted,
  onSkip,
}: QuizLeadCaptureProps) => {
  const { toast } = useToast();
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
        description: "Please try again or call us at (414) 458-1952.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h3 className="font-display text-xl font-bold mb-2 text-center">
        Almost there!
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Enter your info to see your personalized results and get neighborhood insights sent to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quiz-name">Full Name</Label>
          <Input
            id="quiz-name"
            name="name"
            placeholder="Jane Doe"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quiz-email">Email</Label>
          <Input
            id="quiz-email"
            name="email"
            type="email"
            placeholder="jane@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quiz-phone">Phone (optional)</Label>
          <Input
            id="quiz-phone"
            name="phone"
            type="tel"
            placeholder="(414) 555-0123"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "See My Results"}
        </Button>
      </form>
      <button
        type="button"
        onClick={onSkip}
        className="mt-3 block w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        Skip and see results
      </button>
    </div>
  );
};

export default QuizLeadCapture;
