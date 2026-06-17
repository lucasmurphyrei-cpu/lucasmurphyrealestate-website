import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Facebook,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
  Star,
  Youtube,
} from "lucide-react";
import ParallaxBand from "@/pages/preview/_shared/ParallaxBand";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import { IMG, SOCIAL } from "@/pages/preview/_shared/tokens";
import Seo from "@/components/seo/Seo";
import { useToast } from "@/hooks/use-toast";

const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;
const CALENDLY = "https://calendly.com/lucasmurphyrei";
const EMAIL = "lucas.murphy@exprealty.com";

const METHODS = [
  { id: "Phone call", label: "Phone call", icon: Phone },
  { id: "Text", label: "Text", icon: MessageSquareText },
  { id: "Email", label: "Email", icon: Mail },
];

const TIMES = ["Morning", "Midday", "Afternoon", "Evening"];

const fieldCls =
  "w-full rounded-sm border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/25";
const labelCls =
  "mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground";

export default function PreviewContact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("Phone call");
  const [bestTime, setBestTime] = useState("Morning");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);

    try {
      if (!GOOGLE_SHEETS_URL) throw new Error("Form endpoint not configured");
      const params = new URLSearchParams();
      params.append("name", (fd.get("name") as string) || "");
      params.append("email", (fd.get("email") as string) || "");
      params.append("phone", (fd.get("phone") as string) || "");
      params.append("preferredMethod", method);
      params.append("bestTime", method === "Phone call" ? bestTime : "");
      params.append("message", (fd.get("message") as string) || "");
      params.append("timestamp", new Date().toISOString());

      await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", body: params });
      toast({ title: "Message sent.", description: "I'll get back to you within one business day." });
      form.reset();
      setMethod("Phone call");
      setBestTime("Morning");
    } catch {
      toast({
        title: "Something went wrong",
        description: `Please try again or call me directly at ${SOCIAL.phone}.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <Seo
        title="Contact Lucas Murphy | Metro Milwaukee Real Estate"
        description="Get in touch with Lucas Murphy and the Provision Properties Core Team at eXp Realty. Tell me how you'd like to connect and I'll reach out within one business day."
        canonicalPath="/preview/v1/contact"
        noindex
      />
      <PreviewHeader />

      {/* ===== Hero ===== */}
      <ParallaxBand
        src={IMG.skyline}
        align="end"
        objectPosition="center 38%"
        minH="min-h-[62vh]"
        overlay="bg-[linear-gradient(to_bottom,rgba(10,20,36,0.35)_0%,rgba(10,20,36,0.45)_45%,rgba(10,20,36,0.92)_100%)]"
      >
        <div className="max-w-2xl pb-6">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-accent">Get in touch</p>
          <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
            Let's find your place in Metro Milwaukee.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            Whether you're buying your first home, selling, or weighing an investment, tell me a little about
            your goals and how you'd like to connect. I'll take it from there.
          </p>
        </div>
      </ParallaxBand>

      {/* ===== Contact card (overlaps the hero) ===== */}
      <section className="relative z-10 mx-auto -mt-16 max-w-7xl px-6 pb-24 lg:-mt-24 lg:px-10">
        <div className="grid overflow-hidden rounded-sm bg-card shadow-[0_40px_90px_-45px_hsl(216_52%_11%/0.45)] ring-1 ring-border/70 lg:grid-cols-[1.12fr_0.88fr]">
          {/* Form */}
          <div className="p-8 sm:p-10 lg:p-12">
            <h2 className="font-display text-2xl font-medium tracking-[-0.01em] sm:text-3xl">Send a message</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Fields marked with a dot are required. No spam, ever.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelCls}>
                    Full name <span className="text-accent">&bull;</span>
                  </label>
                  <input id="name" name="name" required placeholder="Jordan Smith" className={fieldCls} />
                </div>
                <div>
                  <label htmlFor="phone" className={labelCls}>
                    Phone <span className="text-accent">&bull;</span>
                  </label>
                  <input id="phone" name="phone" type="tel" required placeholder="(414) 555-0123" className={fieldCls} />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={labelCls}>
                  Email <span className="text-accent">&bull;</span>
                </label>
                <input id="email" name="email" type="email" required placeholder="you@example.com" className={fieldCls} />
              </div>

              {/* Preferred contact method */}
              <div>
                <span className={labelCls}>How would you like me to reach you?</span>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {METHODS.map((m) => {
                    const active = method === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMethod(m.id)}
                        aria-pressed={active}
                        className={`flex items-center justify-center gap-2 rounded-sm border px-3 py-3 text-sm font-medium transition-all duration-200 ${
                          active
                            ? "border-accent bg-accent text-accent-foreground shadow-[0_10px_22px_-12px_hsl(44_96%_50%/0.8)]"
                            : "border-border bg-white text-foreground hover:-translate-y-0.5 hover:border-accent/60"
                        }`}
                      >
                        <m.icon className="h-4 w-4" /> {m.label}
                      </button>
                    );
                  })}
                </div>

                {/* Best time to call — only when phone is chosen */}
                <AnimatePresence initial={false}>
                  {method === "Phone call" && (
                    <motion.div
                      key="besttime"
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 rounded-sm border border-border bg-secondary/60 p-4">
                        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          <Clock className="h-4 w-4 text-accent" /> Best time to call
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {TIMES.map((t) => {
                            const active = bestTime === t;
                            return (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setBestTime(t)}
                                aria-pressed={active}
                                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                                  active
                                    ? "border-accent bg-accent text-accent-foreground"
                                    : "border-border bg-white text-foreground hover:border-accent/60"
                                }`}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label htmlFor="message" className={labelCls}>
                  What can I help with? <span className="text-accent">&bull;</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about your timeline, the areas you're considering, and what matters most."
                  className={`${fieldCls} resize-y`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-7 py-4 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send message"}
                <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>

          {/* Info panel */}
          <div className="relative bg-[#0a1424] p-8 text-white/75 sm:p-10 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Reach me directly</p>
            <h2 className="mt-3 font-display text-2xl font-medium text-white">Lucas Murphy</h2>
            <p className="mt-1 text-sm text-white/60">eXp Realty &middot; Provision Properties Core Team</p>

            <div className="mt-8 space-y-5">
              <a href={SOCIAL.phoneHref} className="group flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-accent/15 text-accent">
                  <Phone className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/50">Call</span>
                  <span className="text-white transition-colors group-hover:text-accent">{SOCIAL.phone}</span>
                </span>
              </a>
              <a href={`sms:+14144581952`} className="group flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-accent/15 text-accent">
                  <MessageSquareText className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/50">Text</span>
                  <span className="text-white transition-colors group-hover:text-accent">{SOCIAL.phone}</span>
                </span>
              </a>
              <a href={`mailto:${EMAIL}`} className="group flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-accent/15 text-accent">
                  <Mail className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/50">Email</span>
                  <span className="break-all text-white transition-colors group-hover:text-accent">{EMAIL}</span>
                </span>
              </a>
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-accent/15 text-accent">
                  <MapPin className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/50">Service area</span>
                  <span className="text-white/85">Milwaukee, Waukesha, Ozaukee &amp; Washington Counties</span>
                </span>
              </div>
            </div>

            <a
              href={CALENDLY}
              target="_blank"
              rel="noreferrer"
              className="group mt-9 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-14px_hsl(44_96%_50%/0.8)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <Calendar className="h-4 w-4" /> Schedule a consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <div className="mt-9 border-t border-white/10 pt-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">What to expect</p>
              <ul className="mt-4 space-y-3 text-sm text-white/75">
                {[
                  "A reply within one business day.",
                  "No pressure, just honest guidance.",
                  "A clear plan for your next step.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-7">
              <a
                href={SOCIAL.google}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-white/75 transition-colors hover:text-accent"
              >
                <span className="flex items-center gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </span>
                <span className="font-semibold text-white">5.0</span> on Google
              </a>
              <div className="flex items-center gap-2.5">
                <a
                  href={SOCIAL.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/85 transition-all duration-300 hover:border-accent hover:text-accent"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href={SOCIAL.youtube}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/85 transition-all duration-300 hover:border-accent hover:text-accent"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PreviewFooter />
    </div>
  );
}
