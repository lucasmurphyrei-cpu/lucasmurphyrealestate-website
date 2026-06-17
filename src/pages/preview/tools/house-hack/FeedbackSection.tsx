import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { cardCls, fieldCls, labelCls } from "./previewUi";

const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

const FeedbackSection = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
      params.append("source", "house-hack-feedback");
      params.append("name", (formData.get("name") as string) || "Anonymous");
      params.append("message", formData.get("feedback") as string);
      params.append("timestamp", new Date().toISOString());
      await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", body: params });
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`${cardCls} text-center`}>
        <p className="text-sm font-medium">Thanks for your feedback!</p>
        <p className="mt-1 text-xs text-muted-foreground">We're always looking to make this tool more useful.</p>
      </div>
    );
  }

  return (
    <div className={cardCls}>
      <div className="mb-3">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
          <MessageSquarePlus className="h-5 w-5 text-accent" /> Feedback
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">What's this calculator missing? Is there a feature you'd like to see added to help make it more useful for you?</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className={labelCls}>Name (optional)</label>
          <input name="name" placeholder="John Doe" className={fieldCls} />
        </div>
        <div>
          <label className={labelCls}>Your feedback</label>
          <textarea name="feedback" required rows={3} placeholder="e.g. It would be great to see a comparison of different down payment amounts side by side..." className="w-full resize-none rounded-sm border border-border bg-white px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-accent focus:ring-2 focus:ring-accent/25" />
        </div>
        {error && <p className="text-xs text-red-600">Something went wrong. Please try again or email lucas.murphy@exprealty.com.</p>}
        <button type="submit" disabled={loading} className="w-full rounded-sm border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-60">
          {loading ? "Sending..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackSection;
