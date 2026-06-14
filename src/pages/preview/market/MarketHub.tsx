import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Phone, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import ParallaxBand from "@/pages/preview/_shared/ParallaxBand";
import { IMG, VID, SOCIAL, heroCounties } from "@/pages/preview/_shared/tokens";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import MarketTrendChart from "@/pages/preview/_shared/MarketTrendChart";
import Seo from "@/components/seo/Seo";
import JsonLd from "@/components/seo/JsonLd";
import { graph, breadcrumbList } from "@/lib/seo/schema";
import { COUNTY_SLUGS, countySlugToDisplay, getCountySnapshot } from "@/lib/market/counties";
import { getCountySeries } from "@/lib/market/history";

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

// Gold used in pill highlights
const GOLD = "hsl(44, 100%, 53%)";

function directionIcon(dir: "up" | "down" | "flat") {
  if (dir === "up") return <TrendingUp className="h-3.5 w-3.5" />;
  if (dir === "down") return <TrendingDown className="h-3.5 w-3.5" />;
  return <Minus className="h-3 w-3" />;
}

const pillCls: Record<string, string> = {
  up: "bg-emerald-500/15 text-emerald-400",
  down: "bg-red-500/15 text-red-400",
  flat: "bg-white/10 text-white/50",
};

/* Match heroCounties entry by county display name ("/Milwaukee County" → heroCounties[0]) */
function heroImgForSlug(slug: string): string {
  const display = countySlugToDisplay(slug); // e.g. "Milwaukee County"
  const match = heroCounties.find((h) => h.name === display);
  return match?.img ?? IMG.skyline;
}

/* Build subhead copy from live data */
function buildSubhead(): string {
  const snapshots = COUNTY_SLUGS.map((slug) => ({
    name: countySlugToDisplay(slug),
    snap: getCountySnapshot(slug),
  }));
  const withPrices = snapshots
    .map(({ name, snap }) => {
      const medStat = snap?.stats.find((s) => s.label === "Median Price");
      return { name, value: medStat?.value ?? null };
    })
    .filter((x): x is { name: string; value: string } => x.value !== null);

  if (withPrices.length < 2) {
    return "Real-time market data across Milwaukee, Waukesha, Ozaukee, and Washington Counties.";
  }

  // Parse dollar amounts to sort
  const parsed = withPrices
    .map(({ name, value }) => ({ name, raw: parseInt(value.replace(/[^0-9]/g, ""), 10), value }))
    .sort((a, b) => a.raw - b.raw);

  const lowest = parsed[0];
  const highest = parsed[parsed.length - 1];
  const dataMonth =
    getCountySnapshot(COUNTY_SLUGS[0])?.dataMonth ?? "June 2026";

  return `As of ${dataMonth}, median sale prices across metro Milwaukee run from ${lowest.value} in ${lowest.name} to ${highest.value} in ${highest.name}.`;
}

/* Animation variants */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ------------------------------------------------------------------ */
/* County card                                                          */
/* ------------------------------------------------------------------ */
interface CountyCardProps {
  slug: string;
  index: number;
}

function CountyCard({ slug, index }: CountyCardProps) {
  const display = countySlugToDisplay(slug);
  const snap = getCountySnapshot(slug);
  const img = heroImgForSlug(slug);
  const series = getCountySeries(display, "median_price");

  const medStat = snap?.stats.find((s) => s.label === "Median Price");
  const domStat = snap?.stats.find((s) => s.label === "Days on Market");

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="show"
    >
      <Link
        to={`/preview/v1/market/${slug}`}
        className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_20px_48px_-16px_rgba(0,0,0,0.6)]"
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={img}
            alt={display}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1424]/80 via-[#0a1424]/20 to-transparent" />
          {/* County name overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="font-display text-lg font-semibold text-white">{display}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="px-5 pb-4 pt-4">
          <div className="mb-4 flex flex-wrap items-start gap-3">
            {medStat && (
              <div className="flex-1 min-w-[120px]">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/45 mb-1">
                  Median Price
                </p>
                <p className="font-display text-xl font-semibold text-white leading-tight">
                  {medStat.value}
                </p>
                <span
                  className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${pillCls[medStat.direction]}`}
                >
                  {directionIcon(medStat.direction)}
                  {medStat.change}
                </span>
              </div>
            )}
            {domStat && (
              <div className="flex-1 min-w-[100px]">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/45 mb-1">
                  Days on Market
                </p>
                <p className="font-display text-xl font-semibold text-white leading-tight">
                  {domStat.value}
                </p>
                <span
                  className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${pillCls[domStat.direction]}`}
                >
                  {directionIcon(domStat.direction)}
                  {domStat.change}
                </span>
              </div>
            )}
          </div>

          {/* Sparkline chart */}
          {series.length >= 2 && (
            <MarketTrendChart
              title="Median price trend"
              series={series}
              format="currency"
            />
          )}

          {/* View county link */}
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-white/60 transition-colors group-hover:text-white">
            View {display} <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function MarketHub() {
  const subhead = buildSubhead();

  return (
    <>
      <Seo
        title="Metro Milwaukee Real Estate Market"
        description="Median home prices, days on market, and trends across Milwaukee, Waukesha, Ozaukee, and Washington Counties, updated monthly."
        canonicalPath="/preview/v1/market"
        noindex
      />
      <JsonLd
        data={graph(
          breadcrumbList([
            { name: "Home", path: "/preview/v1" },
            { name: "Market", path: "/preview/v1/market" },
          ])
        )}
      />

      <div className="min-h-screen bg-[#0a1424] text-white">
        <PreviewHeader />

        {/* ===== Hero ===== */}
        <ParallaxBand
          src={IMG.skyline}
          overlay="bg-[#0a1424]/65"
          minH="min-h-screen"
        >
          <div className="max-w-3xl py-32">
            {/* Gold kicker */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4 text-sm font-semibold uppercase tracking-[0.24em]"
              style={{ color: GOLD }}
            >
              Metro Milwaukee Market
            </motion.p>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl font-medium leading-tight text-white sm:text-6xl lg:text-7xl"
            >
              Know the market,{" "}
              <span className="italic" style={{ color: GOLD }}>
                block by block.
              </span>
            </motion.h1>

            {/* Subhead with live data */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80"
            >
              {subhead}
            </motion.p>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href="#counties"
                className="group inline-flex items-center gap-2 rounded-sm px-7 py-3 text-sm font-semibold text-[#0a1424] transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: GOLD }}
              >
                Explore counties
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="https://calendly.com/lucasmurphyrei"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                Schedule a market conversation
              </a>
            </motion.div>
          </div>
        </ParallaxBand>

        {/* ===== County cards ===== */}
        <section id="counties" className="bg-[#0a1424] py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="mb-12 max-w-xl"
            >
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.22em]"
                style={{ color: GOLD }}
              >
                Four Counties
              </p>
              <h2 className="font-display text-3xl font-medium leading-snug text-white sm:text-4xl">
                Pick your county to dig deeper.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/65">
                Monthly stats, price trend charts, and municipality-level breakdowns for every corner of metro Milwaukee.
              </p>
            </motion.div>

            {/* 4-column grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {COUNTY_SLUGS.map((slug, i) => (
                <CountyCard key={slug} slug={slug} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ===== Thin divider band ===== */}
        <div className="h-px bg-white/8 mx-auto max-w-7xl" />

        {/* ===== Get started CTA ===== */}
        <ParallaxBand
          src={IMG.portSunrise}
          video={VID.sunset}
          overlay="bg-[#0a1424]/65"
          minH="min-h-[60vh]"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="mb-4 text-sm font-semibold uppercase tracking-[0.24em]"
              style={{ color: GOLD }}
            >
              Let's Talk Market
            </p>
            <h2 className="font-display text-4xl font-medium leading-tight text-white sm:text-5xl">
              Data is only half the story.{" "}
              <span className="italic" style={{ color: GOLD }}>
                Let's talk.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80">
              Grab 20 minutes with me. I'll walk you through what the numbers mean for your specific neighborhood, price range, and timeline.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://calendly.com/lucasmurphyrei"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-sm px-8 py-3.5 text-sm font-semibold text-[#0a1424] transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: GOLD }}
              >
                Schedule a Consultation
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href={SOCIAL.phoneHref}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white"
              >
                <Phone className="h-4 w-4" style={{ color: GOLD }} />
                {SOCIAL.phone}
              </a>
            </div>
          </div>
        </ParallaxBand>

        <PreviewFooter />
      </div>
    </>
  );
}
