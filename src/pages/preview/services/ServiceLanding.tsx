import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Calendar, Compass, MessageSquare, Wrench } from "lucide-react";
import ParallaxBand from "@/pages/preview/_shared/ParallaxBand";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import { IMG } from "@/pages/preview/_shared/tokens";
import Seo from "@/components/seo/Seo";
import { SERVICES, type ServiceLink, type ServiceSlug } from "@/pages/preview/services/serviceData";

const CALENDLY = "https://calendly.com/lucasmurphyrei";

function LinkCard({ item }: { item: ServiceLink }) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold leading-tight text-foreground">{item.title}</h3>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      {item.desc && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>}
    </>
  );
  const cls =
    "group block rounded-sm border border-border bg-card p-6 shadow-[0_18px_44px_-30px_hsl(216_52%_11%/0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_28px_60px_-32px_hsl(216_52%_11%/0.5)]";
  return item.external ? (
    <a href={item.href} target="_blank" rel="noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link to={item.href} className={cls}>
      {inner}
    </Link>
  );
}

export default function ServiceLanding({ service }: { service: ServiceSlug }) {
  const cfg = SERVICES[service];

  return (
    <div className="preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <Seo
        title={`${cfg.title} in Metro Milwaukee | Lucas Murphy`}
        description={cfg.lead}
        canonicalPath={`/preview/v1/${cfg.slug}`}
        noindex
      />
      <PreviewHeader />

      {/* ===== Hero — the card image becomes the banner ===== */}
      <ParallaxBand
        src={cfg.heroImg}
        align="end"
        objectPosition="center 42%"
        minH="min-h-screen"
        overlay="bg-[linear-gradient(to_bottom,rgba(10,20,36,0.3)_0%,rgba(10,20,36,0.4)_45%,rgba(10,20,36,0.9)_100%)]"
      >
        <div className="max-w-2xl pb-14">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.24em] text-accent">{cfg.kicker}</p>
          <h1 className="font-display text-5xl font-medium leading-[1.06] tracking-[-0.02em] text-white sm:text-6xl lg:text-7xl">
            {cfg.title}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/75">{cfg.lead}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <Calendar className="h-4 w-4" /> Schedule a consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <Link
              to="/preview/v1/contact"
              className="inline-flex items-center gap-2 rounded-sm border border-white/30 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              <MessageSquare className="h-4 w-4" /> Send a message
            </Link>
          </div>
        </div>
      </ParallaxBand>

      {/* ===== Process ===== */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">The process</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
          {cfg.processTitle}
        </h2>
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {cfg.process.map((step, i) => (
            <div key={step.title} className="flex gap-5">
              <span className="font-display text-3xl font-semibold tabular-nums text-accent/90">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="border-l border-border pl-5">
                <h3 className="font-display text-lg font-semibold leading-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Guides ===== */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                <Compass className="h-4 w-4" /> Guides
              </p>
              <h2 className="mt-3 font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                Get up to speed
              </h2>
            </div>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cfg.guides.map((g) => (
              <LinkCard key={g.title} item={g} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Tools ===== */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
          <Wrench className="h-4 w-4" /> Tools
        </p>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
          Run the numbers
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cfg.tools.map((t) => (
            <LinkCard key={t.title} item={t} />
          ))}
        </div>
      </section>

      {/* ===== Trusted network / resources ===== */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Your trusted network</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
            The people I trust, ready when you need them
          </h2>
          <div className="mt-9 flex flex-wrap gap-3">
            {cfg.resources.map((r) => (
              <Link
                key={r.title}
                to={r.href}
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent"
              >
                {r.title}
                <ArrowUpRight className="h-3.5 w-3.5 text-accent" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Know the market band ===== */}
      <ParallaxBand
        src={IMG.skyline}
        align="center"
        objectPosition="center 40%"
        minH="min-h-[52vh]"
        overlay="bg-[linear-gradient(to_right,rgba(10,20,36,0.92)_0%,rgba(10,20,36,0.7)_55%,rgba(10,20,36,0.4)_100%)]"
      >
        <div className="max-w-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-accent">Know the market</p>
          <h2 className="font-display text-3xl font-medium leading-tight tracking-[-0.02em] text-white sm:text-4xl">
            Local data for every move
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/75">{cfg.marketBlurb}</p>
          <Link
            to="/preview/v1/market"
            className="group mt-7 inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Explore the market hub
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </ParallaxBand>

      {/* ===== Final CTA ===== */}
      <section className="bg-[#0a1424]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-10 lg:py-24">
          <h2 className="font-display text-3xl font-medium tracking-[-0.02em] text-white sm:text-4xl">
            Let's talk through your next step
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/70">
            No pressure, just honest guidance. Tell me where you are and I'll help you map the path forward.
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
