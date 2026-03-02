import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquarePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

const FeedbackSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      if (!GOOGLE_SHEETS_URL) throw new Error("Form endpoint not configured");

      const params = new URLSearchParams();
      params.append("source", "house-hack-feedback");
      params.append("name", (formData.get("name") as string) || "Anonymous");
      params.append("message", formData.get("feedback") as string);
      params.append("timestamp", new Date().toISOString());

      await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", body: params });

      setSubmitted(true);
      toast({ title: "Thanks for the feedback!", description: "We appreciate you helping us improve." });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or email lucas.murphy@exprealty.com.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-border/60">
        <CardContent className="py-6 text-center">
          <p className="text-sm font-medium">Thanks for your feedback!</p>
          <p className="text-xs text-muted-foreground mt-1">
            We're always looking to make this tool more useful.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <MessageSquarePlus className="h-5 w-5 text-primary" />
          Feedback
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          What's this calculator missing? Is there a feature you'd like to see added to help make it more useful for you?
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Name (optional)</Label>
            <Input name="name" placeholder="John Doe" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Your feedback</Label>
            <textarea
              name="feedback"
              required
              rows={3}
              placeholder="e.g. It would be great to see a comparison of different down payment amounts side by side..."
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <Button type="submit" variant="outline" className="w-full" size="sm" disabled={loading}>
            {loading ? "Sending..." : "Submit Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackSection;
