import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Calculator, Calendar, Handshake } from "lucide-react";
import ParallaxBand from "@/pages/preview/_shared/ParallaxBand";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import { IMG } from "@/pages/preview/_shared/tokens";
import Seo from "@/components/seo/Seo";

const CALENDLY = "https://calendly.com/lucasmurphyrei";

type Item = { title: string; desc: string; href: string };
type Group = { label: string; items: Item[] };
type Config = { kicker: string; title: string; subtitle: string; heroImg: string; items?: Item[]; groups?: Group[] };

const CONFIGS: Record<"tools" | "vendors", Config> = {
  tools: {
    kicker: "Free Tools",
    title: "Run the numbers yourself",
    subtitle:
      "Free calculators and worksheets to plan your budget, value your home, and pressure test a deal before you ever sign anything.",
    heroImg: IMG.riverwalk,
    groups: [
      {
        label: "For Buyers",
        items: [
          { title: "Mortgage Calculator", desc: "Estimate your monthly payment, taxes, and insurance.", href: "/preview/v1/tools/mortgage-calculator" },
          { title: "How Much Home Can You Afford?", desc: "A budget planner that works backward from your life.", href: "/preview/v1/tools/budget-planner" },
          { title: "Budget Spreadsheet", desc: "Map your full cost of ownership in one place.", href: "/preview/v1/tools/budget-spreadsheet" },
        ],
      },
      {
        label: "For Sellers",
        items: [
          { title: "Free CMA", desc: "A real valuation of what your home is worth today.", href: "/preview/v1/tools/cma" },
          { title: "Seller Net Sheet", desc: "Estimate your take-home proceeds at closing.", href: "/preview/v1/tools/seller-net-sheet" },
        ],
      },
      {
        label: "For Investors",
        items: [
          { title: "House Hack Calculator", desc: "See if a duplex can cover your mortgage.", href: "/preview/v1/tools/house-hack-calculator" },
          { title: "Investor Spreadsheets", desc: "Underwrite deals like a pro.", href: "/preview/v1/tools/investor-spreadsheets" },
        ],
      },
    ],
  },
  vendors: {
    kicker: "Trusted Vendors",
    title: "The people I trust, ready when you need them",
    subtitle:
      "A vetted network of local pros across Metro Milwaukee, from lenders and inspectors to contractors and movers, so you are never figuring it out alone.",
    heroImg: IMG.thirdWard,
    items: [
      { title: "Lenders", desc: "Local lenders who close on time and communicate.", href: "/resources/lenders" },
      { title: "Home Inspectors", desc: "Thorough inspectors who tell it straight.", href: "/resources/home-inspectors" },
      { title: "Home Insurance", desc: "Coverage that fits your home and budget.", href: "/resources/home-insurance" },
      { title: "Contractors", desc: "Trades for repairs, updates, and prep work.", href: "/resources/contractors" },
      { title: "Movers", desc: "Reliable movers for your big day.", href: "/resources/movers" },
      { title: "Seasonal Home Guide", desc: "Keep your home in shape year round.", href: "/resources/seasonal-guide" },
    ],
  },
};

function ResourceCard({ it }: { it: Item }) {
  return (
    <Link
      to={it.href}
      className="group block rounded-sm border border-border bg-card p-6 shadow-[0_18px_44px_-30px_hsl(216_52%_11%/0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_28px_60px_-32px_hsl(216_52%_11%/0.5)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold leading-tight text-foreground">{it.title}</h3>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
    </Link>
  );
}

export default function ResourceListing({ variant }: { variant: "tools" | "vendors" }) {
  const cfg = CONFIGS[variant];
  const Icon = variant === "tools" ? Calculator : Handshake;

  return (
    <div className="preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <Seo
        title={`${cfg.kicker} | Metro Milwaukee | Lucas Murphy`}
        description={cfg.subtitle}
        canonicalPath={`/preview/v1/${variant}`}
        noindex
      />
      <PreviewHeader />

      {/* ===== Hero ===== */}
      <ParallaxBand
        src={cfg.heroImg}
        align="end"
        objectPosition="center 42%"
        minH="min-h-[52vh]"
        overlay="bg-[linear-gradient(to_bottom,rgba(10,20,36,0.4)_0%,rgba(10,20,36,0.55)_45%,rgba(10,20,36,0.92)_100%)]"
      >
        <div className="max-w-2xl pb-6">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
            <Icon className="h-4 w-4" /> {cfg.kicker}
          </p>
          <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl">
            {cfg.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">{cfg.subtitle}</p>
        </div>
      </ParallaxBand>

      {/* ===== Listing ===== */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        {cfg.groups ? (
          <div className="space-y-14 lg:space-y-16">
            {cfg.groups.map((g) => (
              <div key={g.label}>
                <div className="flex items-center gap-4 border-b border-border pb-4">
                  <h2 className="font-display text-2xl font-medium tracking-[-0.01em] sm:text-3xl">{g.label}</h2>
                  <span className="h-px flex-1 bg-gradient-to-r from-accent/40 to-transparent" />
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {g.items.map((it) => (
                    <ResourceCard key={it.title} it={it} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(cfg.items ?? []).map((it) => (
              <ResourceCard key={it.title} it={it} />
            ))}
          </div>
        )}
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-[#0a1424]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-10 lg:py-24">
          <h2 className="font-display text-3xl font-medium tracking-[-0.02em] text-white sm:text-4xl">
            Need a recommendation?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/70">
            Tell me what you're working on and I'll point you to the right tool or pro for the job.
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
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <PreviewFooter />
    </div>
  );
}
