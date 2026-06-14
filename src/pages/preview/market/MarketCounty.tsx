import { useParams, Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Phone, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import ParallaxBand from "@/pages/preview/_shared/ParallaxBand";
import { IMG, VID, SOCIAL, heroCounties } from "@/pages/preview/_shared/tokens";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import StatCard from "@/pages/preview/_shared/StatCard";
import MarketTrendChart from "@/pages/preview/_shared/MarketTrendChart";
import NeighborhoodQuizSection from "@/components/quiz/NeighborhoodQuizSection";
import Seo from "@/components/seo/Seo";
import JsonLd from "@/components/seo/JsonLd";
import { graph, breadcrumbList, place, dataset } from "@/lib/seo/schema";
import { countySlugToDisplay, getCountySnapshot } from "@/lib/market/counties";
import { getCountySeries } from "@/lib/market/history";
import { countySlugToKey, getAllMunicipalityRoutes } from "@/data/municipalityLookup";
import municipalityImages from "@/data/municipalityImages";
import { getRapidStats } from "@/data/municipalityRapidStats";

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

const GOLD = "hsl(44, 100%, 53%)";

function directionIcon(dir: "up" | "down" | "flat") {
  if (dir === "up") return <TrendingUp className="h-3.5 w-3.5" />;
  if (dir === "down") return <TrendingDown className="h-3.5 w-3.5" />;
  return <Minus className="h-3 w-3" />;
}

/** Format a median_sale_price integer (e.g. 539950) as "$540K" or "$312.6K" */
function formatMiniPrice(price: number): string {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 100_000) return `$${Math.round(price / 1_000)}K`;
  return `$${price.toLocaleString("en-US")}`;
}

/* Animation variants */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const cardFade = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.05 + i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ------------------------------------------------------------------ */
/* Municipality directory card                                          */
/* ------------------------------------------------------------------ */
interface MuniCardProps {
  id: string;
  displayName: string;
  countySlug: string;
  muniSlug: string;
  index: number;
}

function MuniCard({ id, displayName, countySlug, muniSlug, index }: MuniCardProps) {
  const imgEntry = municipalityImages[id];
  const rapid = getRapidStats(id);
  const price = rapid?.median_sale_price ? formatMiniPrice(rapid.median_sale_price) : null;

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={cardFade}
    >
      <Link
        to={`/preview/v1/market/${countySlug}/${muniSlug}`}
        className="group block rounded-xl overflow-hidden border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_12px_36px_-12px_rgba(0,0,0,0.6)]"
      >
        {/* Image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={imgEntry?.src ?? `https://placehold.co/400x240/0a1424/ffffff?text=${encodeURIComponent(displayName)}`}
            alt={imgEntry?.alt ?? displayName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1424]/80 via-[#0a1424]/10 to-transparent" />
          {price && (
            <div
              className="absolute bottom-3 right-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-[#0a1424]"
              style={{ backgroundColor: GOLD }}
            >
              {price}
            </div>
          )}
        </div>

        {/* Name + arrow */}
        <div className="flex items-center justify-between px-4 py-3">
          <p className="font-display text-sm font-semibold text-white leading-snug group-hover:text-white">
            {displayName}
          </p>
          <ArrowUpRight
            className="h-4 w-4 flex-shrink-0 text-white/40 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            style={{ color: GOLD }}
          />
        </div>
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Main page                                                            */
/* ------------------------------------------------------------------ */
export default function MarketCounty() {
  const { county = "" } = useParams<{ county: string }>();
  const display = countySlugToDisplay(county);
  const snapshot = getCountySnapshot(county);
  const countyKey = countySlugToKey(county);

  /* ---- Not found state ---- */
  if (!snapshot) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0a1424] px-6 text-center">
        <p className="font-display text-3xl font-semibold text-white">County not found</p>
        <p className="max-w-sm text-white/60">
          We don't have market data for "{display}" yet. Check back soon or browse our available counties.
        </p>
        <Link
          to="/preview/v1/market"
          className="inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold text-[#0a1424] transition-transform duration-300 hover:-translate-y-0.5"
          style={{ backgroundColor: GOLD }}
        >
          Browse Counties <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  /* ---- Derived data ---- */
  const heroImg = heroCounties.find((h) => h.name === display)?.img ?? IMG.skyline;

  const medStat = snapshot.stats.find((s) => s.label === "Median Price");
  const heroSubhead = medStat
    ? `The median sale price in ${display} is ${medStat.value} as of ${snapshot.dataMonth}, ${medStat.direction === "flat" ? "unchanged" : medStat.change} from a year ago.`
    : `Live market data for ${display}, Wisconsin — updated ${snapshot.dataMonth}.`;

  const priceSeries = getCountySeries(display, "median_price");
  const domSeries = getCountySeries(display, "days_on_market");
  const inventorySeries = getCountySeries(display, "inventory");

  const muniRoutes = getAllMunicipalityRoutes().filter((r) => r.countySlug === county);

  return (
    <>
      {/* ===== SEO ===== */}
      <Seo
        title={`${display} Real Estate Market`}
        description={`Median home price, days on market, and market trends for ${display}, Wisconsin, updated ${snapshot.dataMonth}.`}
        canonicalPath={`/preview/v1/market/${county}`}
        noindex
      />
      <JsonLd
        data={graph(
          breadcrumbList([
            { name: "Home", path: "/preview/v1" },
            { name: "Market", path: "/preview/v1/market" },
            { name: display, path: `/preview/v1/market/${county}` },
          ]),
          place(display),
          dataset({
            name: `${display} Real Estate Market Data`,
            description: `Monthly median sale price, days on market, sale-to-list, inventory and supply for ${display}, Wisconsin.`,
            spatial: `${display}, WI`,
            dateModified: "2026-06-01",
            temporalCoverage: "2025-03/2026-06",
            url: `/preview/v1/market/${county}`,
          })
        )}
      />

      <div className="min-h-screen bg-[#0a1424]">
        {/* ===== 1. Header ===== */}
        <PreviewHeader />

        {/* ===== 2. Hero ParallaxBand ===== */}
        <ParallaxBand
          src={heroImg}
          overlay="bg-gradient-to-r from-[#0a1424]/95 via-[#0a1424]/80 to-[#0a1424]/40"
          minH="min-h-[72vh]"
        >
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/50"
            >
              <Link to="/preview/v1/market" className="transition-colors hover:text-white/80">Market</Link>
              <span>/</span>
              <span style={{ color: GOLD }}>{display}</span>
            </motion.div>

            {/* Gold kicker */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] [text-shadow:0_2px_16px_rgba(0,0,0,0.85)]"
              style={{ color: GOLD }}
            >
              {display}
            </motion.p>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl font-semibold leading-tight tracking-[-0.02em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.7)] sm:text-5xl lg:text-6xl"
            >
              Real Estate Market
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.7)]"
            >
              {heroSubhead}
            </motion.p>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.30, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href="https://calendly.com/lucasmurphyrei"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-sm px-7 py-3 text-sm font-semibold text-[#0a1424] transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: GOLD }}
              >
                Schedule a Consultation
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              {snapshot.videoUrl && (
                <a
                  href={snapshot.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  <ExternalLink className="h-4 w-4" style={{ color: GOLD }} />
                  Watch the {snapshot.dataMonth} market update
                </a>
              )}
            </motion.div>
          </div>
        </ParallaxBand>

        {/* ===== 3. Snapshot stat cards ===== */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <motion.p
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/40"
          >
            {snapshot.dataMonth} Data
          </motion.p>
          <motion.h2
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8 font-display text-2xl font-semibold text-white sm:text-3xl"
          >
            Market Snapshot
          </motion.h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {snapshot.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
              >
                <StatCard
                  label={stat.label}
                  value={stat.value}
                  change={stat.change !== "—" ? stat.change : undefined}
                  direction={stat.direction}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== Divider ===== */}
        <div className="mx-auto h-px max-w-7xl bg-white/8" />

        {/* ===== 4. Trend charts ===== */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <motion.p
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/40"
          >
            Historical Trends
          </motion.p>
          <motion.h2
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8 font-display text-2xl font-semibold text-white sm:text-3xl"
          >
            Market Trends
          </motion.h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Median Price", series: priceSeries, format: "currency" as const },
              { title: "Days on Market", series: domSeries, format: "days" as const },
              { title: "Inventory", series: inventorySeries, format: "count" as const },
            ].map(({ title, series, format }, i) => (
              <motion.div
                key={title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
              >
                <MarketTrendChart title={title} series={series} format={format} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== Divider ===== */}
        <div className="mx-auto h-px max-w-7xl bg-white/8" />

        {/* ===== 5. Neighborhood quiz ===== */}
        <section className="bg-background py-16">
          <div className="mx-auto max-w-5xl px-6">
            <NeighborhoodQuizSection mode="county" contextCounty={countyKey} />
          </div>
        </section>

        {/* ===== 6. Municipality directory ===== */}
        {muniRoutes.length > 0 && (
          <>
            <div className="mx-auto h-px max-w-7xl bg-white/8" />

            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
              <motion.p
                custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/40"
              >
                Browse by Community
              </motion.p>
              <motion.h2
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="mb-8 font-display text-2xl font-semibold text-white sm:text-3xl"
              >
                Explore {display} Communities
              </motion.h2>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {muniRoutes.map((r, i) => (
                  <MuniCard
                    key={`${r.countySlug}/${r.muniSlug}`}
                    id={r.id}
                    displayName={r.displayName}
                    countySlug={r.countySlug}
                    muniSlug={r.muniSlug}
                    index={i}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {/* ===== Divider ===== */}
        <div className="mx-auto h-px max-w-7xl bg-white/8" />

        {/* ===== 7. CTA band ===== */}
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

        {/* ===== 8. Footer ===== */}
        <PreviewFooter />
      </div>
    </>
  );
}
