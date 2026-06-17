import { useState } from "react";
import { Award, Check, Clock, Home, MapPin, ShieldCheck } from "lucide-react";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import Seo from "@/components/seo/Seo";
import { useToast } from "@/hooks/use-toast";

const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

const fieldCls =
  "w-full rounded-sm border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/25";
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground";

const INCLUDED = [
  "Your true home value, built from recent comparable sales near you",
  "A pricing strategy built around your timeline, goals, and the home itself",
  "What buyers are actually paying, not a Zestimate guess",
  "How your home's condition and updates change the number",
];

export default function CMA() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.target as HTMLFormElement);
    const name = `${(fd.get("firstName") as string) || ""} ${(fd.get("lastName") as string) || ""}`.trim();
    try {
      if (!GOOGLE_SHEETS_URL) throw new Error("Form endpoint not configured");
      // Mirror the live CMA form's payload exactly (name/email/phone/message/timestamp),
      // since that's the shape the Google Apps Script builds the lead email from.
      const p = new URLSearchParams();
      p.append("name", name);
      p.append("email", (fd.get("email") as string) || "");
      p.append("phone", (fd.get("phone") as string) || "");
      p.append("message", `[CMA REQUEST]\nProperty: ${(fd.get("propertyAddress") as string) || ""}`);
      p.append("timestamp", new Date().toISOString());
      await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", body: p });
      setDone(true);
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or reach out and I'll get your valuation started.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <Seo
        title="Free Home Valuation | What's My Home Worth | Lucas Murphy"
        description="Find out what your Metro Milwaukee home is really worth, plus a pricing strategy built around your timeline and goals to net the most money. Not just a Zestimate."
        canonicalPath="/tools/cma"
      />
      <PreviewHeader />

      <section className="relative overflow-hidden bg-[#0a1424] pt-28 pb-16 text-white lg:pt-36 lg:pb-20">
        <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
            <Home className="h-4 w-4" /> Free home valuation
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] sm:text-5xl">
            Find out what your home is worth, and how to sell it for top dollar
          </h1>
          <p className="mt-4 max-w-xl text-lg font-medium text-accent">Not just a Zestimate.</p>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-white/75">
            Get your true home value plus a pricing strategy built around your timeline, your goals, and what today's market is actually doing, so you net the most on your terms.
          </p>
        </div>
      </section>

      {/* Pitch + form */}
      <section className="mx-auto -mt-8 max-w-7xl px-6 pb-24 lg:px-10">
        <div className="grid overflow-hidden rounded-sm bg-card shadow-[0_40px_90px_-45px_hsl(216_52%_11%/0.45)] ring-1 ring-border/70 lg:grid-cols-2">
          {/* Pitch panel */}
          <div className="flex flex-col bg-[#0a1424] p-8 text-white/85 sm:p-10 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">What you'll get</p>
            <ul className="mt-4 space-y-3">
              {INCLUDED.map((t) => (
                <li key={t} className="flex items-start gap-3 text-white/85">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" /> {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/60">
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-accent" /> Your CMA in 1-3 business days</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" /> No pressure, just real insights</span>
            </div>

            <div className="mt-8 rounded-sm border border-white/12 bg-white/[0.03] p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <Award className="h-4 w-4 text-accent" /> PSA, Pricing Strategy Advisor
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                This certification reflects additional education I've taken beyond getting my real estate license,
                specific to pricing homes accurately. Running the numbers based on what the market data is saying is
                what I love doing!
              </p>
            </div>
          </div>

          {/* Form panel */}
          <div className="p-6 text-foreground sm:p-8 lg:p-10">
            {done ? (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Check className="h-7 w-7" />
                </span>
                <p className="mt-5 font-display text-2xl font-medium">Request received.</p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  I'll prepare your home value and selling strategy and get it back to you within 1-3 business days.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <p className="font-display text-xl font-semibold">What's your home worth?</p>
                  <p className="mt-1 text-sm text-muted-foreground">Start with your address. Once you hit "Get my home value," I'll have your CMA back to you in 1-3 business days.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="propertyAddress" className={labelCls}>Property address <span className="text-accent">&bull;</span></label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
                      <input id="propertyAddress" name="propertyAddress" required placeholder="123 Main St, Milwaukee, WI 53202" className={`${fieldCls} pl-9`} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className={labelCls}>First name <span className="text-accent">&bull;</span></label>
                      <input id="firstName" name="firstName" required placeholder="Jordan" className={fieldCls} />
                    </div>
                    <div>
                      <label htmlFor="lastName" className={labelCls}>Last name</label>
                      <input id="lastName" name="lastName" placeholder="Smith" className={fieldCls} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className={labelCls}>Email <span className="text-accent">&bull;</span></label>
                    <input id="email" name="email" type="email" required placeholder="you@example.com" className={fieldCls} />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelCls}>Phone <span className="text-accent">&bull;</span></label>
                    <input id="phone" name="phone" type="tel" required placeholder="(414) 555-0123" className={fieldCls} />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-7 py-4 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Sending..." : "Get my home value"}
                  </button>
                  <p className="text-center text-xs text-muted-foreground">No obligation. No pressure to sell.</p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Why not a Zestimate */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-20">
        <h2 className="text-center font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
          Why not just check Zillow?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground">
          Automated estimates do not walk through your home, see your updates, or know what buyers are paying on
          your street this month. A real valuation does.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { title: "Local, recent comps", body: "Built from homes like yours that actually sold nearby, not a national algorithm." },
            { title: "Your home's real condition", body: "Updates, finishes, and layout that an online estimate can't see, factored in." },
            { title: "A plan to net more", body: "Pricing and prep strategy built around your timeline and goals to net the most, not just a number." },
          ].map((c) => (
            <div key={c.title} className="rounded-sm border border-border bg-card p-7 shadow-[0_18px_44px_-30px_hsl(216_52%_11%/0.4)]">
              <h3 className="font-display text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <PreviewFooter />
    </div>
  );
}
