import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Calendar, Check, Compass, MessageSquare } from "lucide-react";
import ParallaxBand from "@/pages/preview/_shared/ParallaxBand";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import { IMG } from "@/pages/preview/_shared/tokens";
import Seo from "@/components/seo/Seo";

const CALENDLY = "https://calendly.com/lucasmurphyrei";

/* Guide visuals are temporary free-license stand-ins — swap for real guide covers / Lucas's photos. */
type Guide = {
  title: string;
  blurb: string;
  inside: string[];
  href: string;
  external?: boolean;
  cta: string;
  img: string;
};

const GUIDES: Guide[] = [
  {
    title: "First-Time Home Buyers Guide",
    blurb: "A step-by-step walk through buying your first home in Metro Milwaukee with clarity and confidence.",
    inside: [
      "How to get pre-approved",
      "What to expect in today's market",
      "Common mistakes to avoid",
      "How to win in competitive situations",
    ],
    href: "/preview/v1/guides/first-time-home-buyers",
    cta: "Get the guide",
    img: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Seller's Guide",
    blurb: "How to price, prepare, and market your home to net the most in the Metro Milwaukee market.",
    inside: [
      "Pricing strategy that protects your equity",
      "How to prep and stage your home",
      "Marketing that reaches serious buyers",
      "How to avoid leaving money on the table",
    ],
    href: "/preview/v1/guides/sellers",
    cta: "Reserve a copy",
    img: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Relocation Guide",
    blurb: "Everything you need to land confidently when you're moving to Metro Milwaukee from out of town.",
    inside: [
      "Neighborhood and commute breakdowns",
      "Cost of living and schools",
      "Timing your move",
      "Buying before you arrive",
    ],
    href: "/preview/v1/guides/relocation",
    cta: "Get the guide",
    img: IMG.skyline,
  },
  {
    title: "First-Time Condo Buyers Guide",
    blurb: "Condos come with their own rules. Here's what makes buying one different, explained simply.",
    inside: [
      "HOA documents and bylaws explained",
      "Special assessments and reserves",
      "How condo financing works",
      "What's different from buying a house",
    ],
    href: "/preview/v1/guides/first-time-condo-buyers",
    cta: "Get the guide",
    img: IMG.thirdWard,
  },
  {
    title: "Investor's Guide",
    blurb: "How I underwrite deals and find cash-flowing properties across Metro Milwaukee.",
    inside: [
      "Underwriting a deal the right way",
      "Finding properties that cash flow",
      "Financing options for investors",
      "Building a repeatable system",
    ],
    href: "/preview/v1/guides/investors",
    cta: "Reserve a copy",
    img: "https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "House Hacking Guide",
    blurb: "Live for less and build equity at the same time by letting a tenant help cover your mortgage.",
    inside: [
      "How house hacking actually works",
      "Choosing the right duplex",
      "Owner-occupied financing",
      "Living for less while building wealth",
    ],
    href: "/preview/v1/guides/house-hacking",
    cta: "Get the guide",
    img: IMG.riverwalk,
  },
];

const TOOLS = [
  { title: "Mortgage Calculator", href: "/preview/v1/tools/mortgage-calculator" },
  { title: "How Much Home Can You Afford?", href: "/preview/v1/tools/budget-planner" },
  { title: "Free CMA", href: "/preview/v1/tools/cma" },
  { title: "House Hack Calculator", href: "/preview/v1/tools/house-hack-calculator" },
  { title: "Investor Spreadsheets", href: "/preview/v1/tools/investor-spreadsheets" },
];

function GuideCta({ guide, className }: { guide: Guide; className: string }) {
  return guide.external ? (
    <a href={guide.href} target="_blank" rel="noreferrer" className={className}>
      {guide.cta} <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  ) : (
    <Link to={guide.href} className={className}>
      {guide.cta} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

export default function PreviewGuides() {
  return (
    <div className="preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <Seo
        title="Guides & Resources | Metro Milwaukee Real Estate | Lucas Murphy"
        description="Free guides and tools to help you buy, sell, relocate, and invest in Metro Milwaukee real estate. Explore Lucas Murphy's resource center."
        canonicalPath="/preview/v1/guides"
        noindex
      />
      <PreviewHeader />

      {/* ===== Hero ===== */}
      <ParallaxBand
        src={IMG.riverwalk}
        align="end"
        objectPosition="center 40%"
        minH="min-h-[60vh]"
        overlay="bg-[linear-gradient(to_bottom,rgba(10,20,36,0.35)_0%,rgba(10,20,36,0.5)_45%,rgba(10,20,36,0.92)_100%)]"
      >
        <div className="max-w-2xl pb-6">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-accent">Resource Center</p>
          <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
            Guides for every move in Metro Milwaukee
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            Free, no-pressure guides and tools to help you buy, sell, relocate, and invest with confidence.
            Start wherever you are.
          </p>
        </div>
      </ParallaxBand>

      {/* ===== Featured resource ===== */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="overflow-hidden rounded-sm bg-[#0a1424] text-white shadow-[0_40px_90px_-45px_hsl(216_52%_11%/0.5)] ring-1 ring-white/10 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-8 sm:p-10 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Featured resource</p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
              Find the right area, without the guesswork
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Explore Metro Milwaukee by the numbers and take the neighborhood quiz to see which communities
              fit your lifestyle, commute, and budget.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/80">
              {[
                "Median prices and trends by county",
                "Walkability, safety, and commute at a glance",
                "A neighborhood quiz matched to your priorities",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {t}
                </li>
              ))}
            </ul>
            <Link
              to="/preview/v1/market"
              className="group mt-8 inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <Compass className="h-4 w-4" /> Explore the market hub
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="relative hidden min-h-[320px] lg:block">
            <img src={IMG.artMuseum} alt="Metro Milwaukee" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1424] via-[#0a1424]/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* ===== Numbered guide rows ===== */}
      <section className="mx-auto max-w-7xl px-6 pb-8 lg:px-10">
        <div className="space-y-16 lg:space-y-24">
          {GUIDES.map((g, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={g.title} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                {/* Visual */}
                <div className={`relative ${flip ? "lg:order-2" : ""}`}>
                  <div className="overflow-hidden rounded-sm shadow-[0_30px_70px_-40px_hsl(216_52%_11%/0.5)] ring-1 ring-border">
                    <img src={g.img} alt={g.title} className="aspect-[4/3] w-full object-cover" />
                  </div>
                  <span className="absolute -left-3 -top-5 font-display text-6xl font-semibold text-accent/90 lg:-left-5 lg:text-7xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Content */}
                <div className={flip ? "lg:order-1" : ""}>
                  <h3 className="font-display text-2xl font-medium tracking-[-0.01em] sm:text-3xl">{g.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{g.blurb}</p>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/70">What's inside</p>
                  <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {g.inside.map((t) => (
                      <li key={t} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {t}
                      </li>
                    ))}
                  </ul>
                  <GuideCta
                    guide={g}
                    className="group mt-7 inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-[0_12px_26px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ===== Tools strip ===== */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Free tools</p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
            Run the numbers yourself
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {TOOLS.map((t) => (
              <Link
                key={t.title}
                to={t.href}
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent"
              >
                {t.title}
                <ArrowUpRight className="h-3.5 w-3.5 text-accent" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="bg-[#0a1424]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-10 lg:py-24">
          <h2 className="font-display text-3xl font-medium tracking-[-0.02em] text-white sm:text-4xl">
            Not sure which guide is right for you?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/70">
            Tell me where you are and I'll point you to the right starting place. No pressure, just honest guidance.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-sm bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <Calendar className="h-4 w-4" /> Schedule a consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <Link
              to="/preview/v1/contact"
              className="inline-flex items-center gap-2 rounded-sm border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              <MessageSquare className="h-4 w-4" /> Send a message
            </Link>
          </div>
        </div>
      </section>

      <PreviewFooter />
    </div>
  );
}
