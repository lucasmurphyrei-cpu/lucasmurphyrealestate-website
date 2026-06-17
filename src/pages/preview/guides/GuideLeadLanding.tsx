import { useState } from "react";
import { ArrowRight, Check, Clock, Download, FileText, Lock, Quote, Star, X } from "lucide-react";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import Seo from "@/components/seo/Seo";
import { useToast } from "@/hooks/use-toast";
import { GUIDE_LEADS } from "@/pages/preview/guides/guidesData";
import lucasHeadshot from "@/assets/lucas-murphy-headshot.jpeg";

const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

const fieldCls =
  "w-full rounded-sm border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/25";
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground";

function CtaButton({ label }: { label: string }) {
  return (
    <a
      href="#get-the-guide"
      className="group inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5"
    >
      {label}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  );
}

export default function GuideLeadLanding({ slug }: { slug: string }) {
  const g = GUIDE_LEADS[slug];
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
      const params = new URLSearchParams();
      params.append("name", name);
      params.append("email", (fd.get("email") as string) || "");
      params.append("phone", (fd.get("phone") as string) || "");
      params.append("guide", g.heroHeadline);
      params.append("source", `${g.comingSoon ? "guide-waitlist" : "guide"}:${g.slug}`);
      params.append("timestamp", new Date().toISOString());
      await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", body: params });
      setDone(true);
      if (g.downloadUrl) window.open(g.downloadUrl, "_blank", "noopener");
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or reach out and I'll send it over directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <Seo
        title={`${g.kicker} | Metro Milwaukee | Lucas Murphy`}
        description={g.heroSub}
        canonicalPath={`/preview/v1/guides/${g.slug}`}
        noindex
      />
      <PreviewHeader />

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-[#0a1424] pt-28 pb-20 text-white lg:pt-36 lg:pb-28">
        {g.heroVideo && (
          <>
            <style>{`@keyframes guideHeroPan{0%{transform:scale(1.06) translate3d(0,0,0)}100%{transform:scale(1.18) translate3d(-2.5%,-1.5%,0)}}`}</style>
            <video
              src={g.heroVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              onLoadedMetadata={(e) => { e.currentTarget.playbackRate = g.heroVideoRate ?? 1; }}
              className="absolute inset-0 h-full w-full object-cover [animation:guideHeroPan_32s_ease-in-out_infinite_alternate]"
            />
            {/* Legibility overlays — let the kitchen read through while keeping text crisp */}
            <div className="absolute inset-0 bg-[#0a1424]/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a1424]/95 via-[#0a1424]/35 to-[#0a1424]/95" />
          </>
        )}
        <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-10">
          <p className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
            <FileText className="h-4 w-4" /> {g.kicker}
          </p>
          {g.comingSoon && g.goLiveDate && (
            <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              <Clock className="h-3.5 w-3.5" /> Available {g.goLiveDate}
            </p>
          )}
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
            {g.heroHeadline}
          </h1>
          <p className="mt-6 text-lg font-medium text-white/80">{g.heroLede}</p>
          <p className="mt-6 text-base text-white/70">{g.heroIntro}</p>
          <ul className="mx-auto mt-5 flex max-w-xl flex-col gap-2.5 text-left sm:mt-6">
            {g.heroBullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-white/85">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" /> {b}
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-7 max-w-xl text-base text-white/70">{g.heroSub}</p>
          <div className="mt-8 flex justify-center">
            <CtaButton label={g.ctaLabel} />
          </div>
        </div>
      </section>

      {/* ===== The market has changed ===== */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center lg:py-24">
        <h2 className="font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">{g.shiftHeading}</h2>
        <p className="mt-6 text-muted-foreground">{g.shiftAssumeLede}</p>
        <ul className="mx-auto mt-4 flex max-w-xs flex-col gap-2 text-muted-foreground">
          {g.shiftAssume.map((a) => (
            <li key={a} className="flex items-center justify-center gap-2">
              <X className="h-4 w-4 text-muted-foreground/50" /> {a}
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-foreground/90">{g.shiftBody}</p>
        <div className="mt-8 flex justify-center">
          <CtaButton label="Send me the playbook" />
        </div>
      </section>

      {/* ===== Inside the playbook ===== */}
      <section className="bg-[#0a1424] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-10 lg:py-28">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="overflow-hidden rounded-sm shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
              <img src={g.cover} alt={`${g.kicker} cover`} className="aspect-[3/4] w-full object-cover" />
            </div>
            <div className="absolute -left-4 -top-4 -z-10 h-full w-full rounded-sm border border-accent/40" />
          </div>
          <div>
            <h2 className="font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">{g.insideHeading}</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/75">{g.insideLede}</p>
            <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {g.inside.map((t) => (
                <li key={t} className="flex items-start gap-3 text-white/90">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" /> {t}
                </li>
              ))}
            </ul>
            <p className="mt-8 border-l-2 border-accent pl-5 text-lg italic leading-relaxed text-white/80">
              {g.insideGoal}
            </p>
          </div>
        </div>
      </section>

      {/* ===== Most buyers feel overwhelmed ===== */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center lg:py-24">
        <h2 className="font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">{g.concernsHeading}</h2>
        <p className="mt-5 text-muted-foreground">{g.concernsLede}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {g.concerns.map((c) => (
            <div key={c} className="rounded-sm border border-border bg-secondary/40 px-6 py-5 text-left">
              <p className="font-display text-lg italic text-foreground/85">&ldquo;{c}&rdquo;</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-9 max-w-2xl text-lg leading-relaxed text-foreground/90">{g.concernsResolve}</p>
        <div className="mt-8 flex justify-center">
          <CtaButton label="Get instant access" />
        </div>
      </section>

      {/* ===== Why I created this guide (optional) — split with photo ===== */}
      {g.whyQuote && (
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="relative mx-auto w-full max-w-xs">
              <div className="overflow-hidden rounded-sm shadow-[0_30px_70px_-30px_hsl(216_52%_11%/0.5)] ring-1 ring-border">
                <img src={lucasHeadshot} alt={g.whyName ?? "Lucas Murphy"} className="aspect-[4/5] w-full object-cover" />
              </div>
              <div className="absolute -left-4 -top-4 -z-10 h-full w-full rounded-sm border border-accent/40" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">{g.whyHeading ?? "Why I created this guide"}</h2>
              <blockquote className="mt-6 border-l-2 border-accent pl-6 text-lg italic leading-relaxed text-foreground/85">
                &ldquo;{g.whyQuote}&rdquo;
              </blockquote>
              {g.whyName && <p className="mt-6 font-display text-lg font-semibold">{g.whyName}</p>}
              {g.whyCredentials?.map((c) => (
                <p key={c} className="text-sm leading-relaxed text-muted-foreground">{c}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== My journey video (optional) ===== */}
      {g.journeyVideo && (
        <section className="bg-[#0a1424] text-white">
          <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-10 lg:py-24">
            <h2 className="font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">{g.journeyHeading ?? "My journey"}</h2>
            {g.journeyBody && <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/75">{g.journeyBody}</p>}
            <div className="mt-8 aspect-video w-full overflow-hidden rounded-sm ring-1 ring-white/10 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)]">
              <iframe
                src={g.journeyVideo}
                title={g.journeyHeading ?? "My journey"}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* ===== Lead form ===== */}
      <section id="get-the-guide" className="scroll-mt-28 bg-secondary/50">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-10 lg:py-24">
          <div className="grid overflow-hidden rounded-sm bg-card shadow-[0_40px_90px_-45px_hsl(216_52%_11%/0.45)] ring-1 ring-border/70 md:grid-cols-2">
            {/* Cover side */}
            <div className="relative hidden bg-[#0a1424] md:block">
              <img src={g.cover} alt={`${g.kicker} cover`} className="absolute inset-0 h-full w-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1424] via-[#0a1424]/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">No spam</p>
                <p className="mt-2 font-display text-xl">Just helpful, local insights.</p>
              </div>
            </div>
            {/* Form side */}
            <div className="p-8 sm:p-10">
              {done ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Check className="h-7 w-7" />
                  </span>
                  <p className="mt-5 font-display text-2xl font-medium">{g.comingSoon ? "You're on the list!" : "Thank you!"}</p>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {g.comingSoon
                      ? `Your copy is reserved. I'll email it to you the moment it's ready${g.goLiveDate ? ` (around ${g.goLiveDate})` : ""}.`
                      : g.downloadUrl
                        ? "Your playbook should open in a new tab. I'll also follow up by email."
                        : "Your playbook is on the way. Check your inbox shortly for an email from me."}
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-medium tracking-[-0.01em] sm:text-3xl">{g.formHeading}</h2>
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                    <label className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
                      <input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-[hsl(44_96%_50%)]" />
                      I agree to receive the guide and occasional helpful emails from Lucas Murphy. Unsubscribe anytime.
                    </label>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-7 py-4 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Sending..." : g.ctaLabel}
                      {g.comingSoon ? <Clock className="h-4 w-4" /> : <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />}
                    </button>
                    <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                      <Lock className="h-3.5 w-3.5" /> Your information stays private.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
        <h2 className="text-center font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
          {g.testimonialsHeading}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {g.testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-sm border border-border bg-card p-7 shadow-[0_18px_44px_-30px_hsl(216_52%_11%/0.4)]">
              <Quote className="h-7 w-7 text-accent/80" />
              <div className="mt-3 flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-foreground/85">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-5 text-sm font-semibold text-muted-foreground">{t.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="bg-[#0a1424]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-10 lg:py-24">
          <h2 className="font-display text-3xl font-medium tracking-[-0.02em] text-white sm:text-4xl">{g.finalHeading}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/70">{g.finalBody}</p>
          <div className="mt-8 flex justify-center">
            <CtaButton label={g.ctaLabel} />
          </div>
        </div>
      </section>

      <PreviewFooter />
    </div>
  );
}
