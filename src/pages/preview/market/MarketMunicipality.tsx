import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowRight,
  Phone,
  TrendingUp,
  TrendingDown,
  Minus,
  UserCheck,
  Car,
  Footprints,
  ShieldCheck,
  Heart,
  CalendarDays,
  Waves,
  Briefcase,
  Trees,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import ParallaxBand from "@/pages/preview/_shared/ParallaxBand";
import { IMG, VID, SOCIAL } from "@/pages/preview/_shared/tokens";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import StatCard from "@/pages/preview/_shared/StatCard";
import MarketTrendChart from "@/pages/preview/_shared/MarketTrendChart";
import Seo from "@/components/seo/Seo";
import JsonLd from "@/components/seo/JsonLd";
import { graph, breadcrumbList, place, dataset } from "@/lib/seo/schema";
import { countySlugToDisplay } from "@/lib/market/counties";
import { getMuniSeries } from "@/lib/market/history";
import { getSlimBySlug, getFullProfile, countySlugToKey } from "@/data/municipalityLookup";
import { getRapidStats } from "@/data/municipalityRapidStats";
import municipalityImages from "@/data/municipalityImages";
import type { MunicipalityProfile } from "@/data/neighborhoodTypes";

/* ------------------------------------------------------------------ */
/* Constants & helpers                                                  */
/* ------------------------------------------------------------------ */

const GOLD = "hsl(44, 100%, 53%)";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* Dressed-up, on-brand profile card for the navy/gold market pages.
   Elevated surface, gold icon chip + hairline, brighter body copy, hover lift. */
function ProfileCard({
  icon: Icon,
  label,
  value,
  i,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  i: number;
}) {
  if (!value) return null;
  return (
    <motion.div
      custom={i}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="group relative overflow-hidden rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10 shadow-[0_28px_60px_-32px_rgba(0,0,0,0.75)] transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.06] hover:ring-white/25"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${GOLD}66, transparent)` }}
      />
      <div
        className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-white/10"
        style={{ backgroundColor: "hsl(44 100% 53% / 0.12)" }}
      >
        <Icon className="h-5 w-5" style={{ color: GOLD }} />
      </div>
      <h4 className="font-display text-lg font-semibold leading-snug text-white">{label}</h4>
      <p className="mt-2 text-sm leading-relaxed text-white/75">{value}</p>
    </motion.div>
  );
}

function directionFor(pct: number): "up" | "down" | "flat" {
  if (pct > 0.5) return "up";
  if (pct < -0.5) return "down";
  return "flat";
}

function formatChangePct(pct: number): string {
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}% YoY`;
}

/** Format integer median price → "$630K" / "$1.2M" */
function formatPrice(price: number): string {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 100_000) return `$${Math.round(price / 1_000)}K`;
  return `$${price.toLocaleString("en-US")}`;
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function MarketMunicipality() {
  const { county = "", municipality = "" } = useParams<{
    county: string;
    municipality: string;
  }>();

  const slim = county && municipality ? getSlimBySlug(county, municipality) : undefined;
  const countyDisplay = countySlugToDisplay(county);
  const countyKey = countySlugToKey(county);

  const [full, setFull] = useState<MunicipalityProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slim) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getFullProfile(countyKey, slim.id)
      .then((p) => {
        if (!cancelled) {
          setFull(p ?? null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slim?.id]);

  /* ---- Not found ---- */
  if (!slim) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0a1424] px-6 text-center">
        <p className="font-display text-3xl font-semibold text-white">
          Community not found
        </p>
        <p className="max-w-sm text-sm text-white/60">
          We don't have a page for that community yet.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {county && (
            <Link
              to={`/preview/v1/market/${county}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
              style={{ color: GOLD }}
            >
              Back to {countyDisplay}
            </Link>
          )}
          <Link
            to="/preview/v1/market"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 underline-offset-4 hover:text-white hover:underline"
          >
            Market Home
          </Link>
        </div>
      </div>
    );
  }

  /* ---- Data ---- */
  const rapidStats = getRapidStats(slim.id);
  const heroImage = municipalityImages[slim.id]?.src ?? IMG.skyline;
  const heroAlt = municipalityImages[slim.id]?.alt ?? `${slim.display_name}, Wisconsin`;

  /* Trend chart series */
  const priceSeries = getMuniSeries(slim.id, "median_price");
  const domSeries = getMuniSeries(slim.id, "days_on_market");
  const inventorySeries = getMuniSeries(slim.id, "inventory");

  /* Build stat cards */
  type CardDef = { label: string; value: string; change?: string; direction?: "up" | "down" | "flat" };

  const statCards: CardDef[] = [];

  if (rapidStats) {
    // Lead card: median sale price
    statCards.push({
      label: "Median Sale Price",
      value: formatPrice(rapidStats.median_sale_price),
      change: `${rapidStats.data_month}`,
      direction: "flat",
    });
    // Remaining metrics from the array
    for (const m of rapidStats.metrics) {
      statCards.push({
        label: m.label,
        value: m.current_year,
        change: formatChangePct(m.change_pct),
        direction: directionFor(m.change_pct),
      });
    }
  } else {
    // Fallback: quick_snapshot values
    const qs = slim.quick_snapshot;
    statCards.push(
      { label: "Median Home Price", value: qs.median_home_price },
      { label: "Median Household Income", value: qs.median_household_income },
      { label: "Population", value: qs.population },
      { label: "Median Age", value: qs.median_age },
    );
  }

  /* Subhead: answer-first price sentence */
  const priceForSubhead = rapidStats
    ? `${formatPrice(rapidStats.median_sale_price)}${rapidStats.data_month ? ` as of ${rapidStats.data_month}` : ""}`
    : slim.quick_snapshot.median_home_price;
  const subhead = `The median sale price in ${slim.display_name} is ${priceForSubhead}.`;

  return (
    <>
      {/* ===== SEO ===== */}
      <Seo
        title={`${slim.display_name}, WI Home Prices & Market Data`}
        description={`Median sale price, market trends, and neighborhood profile for ${slim.display_name} in ${countyDisplay}, Wisconsin.`}
        canonicalPath={`/preview/v1/market/${county}/${municipality}`}
        noindex
      />
      <JsonLd
        data={graph(
          breadcrumbList([
            { name: "Home", path: "/preview/v1" },
            { name: "Market", path: "/preview/v1/market" },
            { name: countyDisplay, path: `/preview/v1/market/${county}` },
            {
              name: slim.display_name,
              path: `/preview/v1/market/${county}/${municipality}`,
            },
          ]),
          place(slim.display_name),
          dataset({
            name: `${slim.display_name} Real Estate Market Data`,
            description: `Median sale price and market metrics for ${slim.display_name}, Wisconsin.`,
            spatial: `${slim.display_name}, WI`,
            dateModified: "2026-06-01",
            temporalCoverage: "2026-05/2026-06",
            url: `/preview/v1/market/${county}/${municipality}`,
          }),
        )}
      />

      <div className="min-h-screen bg-[#0a1424]">
        {/* ===== 1. Header ===== */}
        <PreviewHeader />

        {/* ===== 2. Hero ParallaxBand ===== */}
        <ParallaxBand
          src={heroImage}
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
              <Link
                to="/preview/v1/market"
                className="transition-colors hover:text-white/80"
              >
                Market
              </Link>
              <span>/</span>
              <Link
                to={`/preview/v1/market/${county}`}
                className="transition-colors hover:text-white/80"
              >
                {countyDisplay}
              </Link>
              <span>/</span>
              <span style={{ color: GOLD }}>{slim.display_name}</span>
            </motion.div>

            {/* Gold kicker */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] [text-shadow:0_2px_16px_rgba(0,0,0,0.85)]"
              style={{ color: GOLD }}
            >
              {slim.display_name}, WI
            </motion.p>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl font-semibold leading-tight tracking-[-0.02em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.7)] sm:text-5xl lg:text-6xl"
            >
              {slim.display_name}
            </motion.h1>

            {/* Answer-first subhead */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-xl text-base font-medium leading-relaxed text-white/80 [text-shadow:0_1px_12px_rgba(0,0,0,0.7)] sm:text-lg"
            >
              {subhead}
            </motion.p>
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
            {rapidStats ? rapidStats.data_month + " Data" : "Community Overview"}
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

          {rapidStats === null && !slim.quick_snapshot.median_home_price ? (
            <motion.p
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-sm text-white/50"
            >
              Market data for {slim.display_name} is coming soon.
            </motion.p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {statCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  custom={i + 2}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <StatCard
                    label={card.label}
                    value={card.value}
                    change={card.change}
                    direction={card.direction}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* ===== 4. Trend charts ===== */}
        {(priceSeries.length > 0 || domSeries.length > 0 || inventorySeries.length > 0) && (
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
                {slim.display_name} Market Over Time
              </motion.h2>

              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {priceSeries.length > 0 && (
                  <motion.div
                    custom={2}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                  >
                    <MarketTrendChart
                      title="Median Sale Price"
                      series={priceSeries}
                      format="currency"
                    />
                  </motion.div>
                )}
                {domSeries.length > 0 && (
                  <motion.div
                    custom={3}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                  >
                    <MarketTrendChart
                      title="Days on Market"
                      series={domSeries}
                      format="days"
                    />
                  </motion.div>
                )}
                {inventorySeries.length > 0 && (
                  <motion.div
                    custom={4}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                  >
                    <MarketTrendChart
                      title="Active Inventory"
                      series={inventorySeries}
                      format="count"
                    />
                  </motion.div>
                )}
              </div>
            </section>
          </>
        )}

        {/* Sparse fallback: no history at all */}
        {priceSeries.length === 0 && domSeries.length === 0 && inventorySeries.length === 0 && (
          <>
            <div className="mx-auto h-px max-w-7xl bg-white/8" />
            <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
              <p className="text-sm text-white/50">
                Trend charts for {slim.display_name} will appear as more data becomes available.
              </p>
            </section>
          </>
        )}

        {/* ===== 5. Neighborhood profile ===== */}
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
            Neighborhood Profile
          </motion.p>
          <motion.h2
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-10 font-display text-2xl font-semibold text-white sm:text-3xl"
          >
            Living in {slim.display_name}
          </motion.h2>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 animate-pulse rounded-2xl bg-white/[0.04] ring-1 ring-white/10"
                />
              ))}
            </div>
          ) : full ? (
            <div className="space-y-12">
              <div>
                <h3
                  className="mb-5 text-sm font-semibold uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Buyer &amp; Lifestyle Fit
                </h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  {[
                    { icon: UserCheck, label: "Ideal Buyer", value: full.buyer_lifestyle_fit.ideal_buyer },
                    { icon: Car, label: "Commute to Downtown", value: full.buyer_lifestyle_fit.commute_to_downtown },
                    { icon: Footprints, label: "Walkability & Transit", value: full.buyer_lifestyle_fit.walkability_transportation },
                    { icon: ShieldCheck, label: "Crime & Safety", value: full.buyer_lifestyle_fit.crime_safety },
                  ].map((c, i) => (
                    <ProfileCard key={c.label} icon={c.icon} label={c.label} value={c.value} i={i} />
                  ))}
                </div>
              </div>
              <div>
                <h3
                  className="mb-5 text-sm font-semibold uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Amenities &amp; Community Character
                </h3>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { icon: Heart, label: "Community Vibe", value: full.amenities_character.community_vibe },
                    { icon: CalendarDays, label: "Notable Events", value: full.amenities_character.notable_events },
                    { icon: Waves, label: "Lake & Employer Proximity", value: full.amenities_character.proximity_lake_employers },
                    { icon: Briefcase, label: "Major Employers", value: full.amenities_character.major_employers },
                    { icon: Trees, label: "Parks & Attractions", value: full.amenities_character.parks_attractions },
                    { icon: UtensilsCrossed, label: "Restaurants & Dining", value: full.amenities_character.restaurants_dining },
                  ].map((c, i) => (
                    <ProfileCard key={c.label} icon={c.icon} label={c.label} value={c.value} i={i} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/50">
              Neighborhood profile details are not yet available for {slim.display_name}.
            </p>
          )}
        </section>

        {/* ===== 6. CTA Band ===== */}
        <div className="mx-auto h-px max-w-7xl bg-white/8" />

        <ParallaxBand
          src={IMG.portSunrise}
          video={VID.sunset}
          overlay="bg-[#0a1424]/65"
          minH="min-h-[60vh]"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="mb-4 text-sm font-semibold uppercase tracking-[0.22em]"
              style={{ color: GOLD }}
            >
              Ready to make a move?
            </p>
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-4xl">
              Talk through the {slim.display_name} market
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/80">
              Grab 20 minutes with me. I'll walk you through what the numbers
              mean for your specific neighborhood, price range, and timeline.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://calendly.com/lucasmurphyrei"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-sm px-8 py-3.5 text-sm font-semibold text-[#0a1424] transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: GOLD }}
              >
                Schedule a Free Call
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

        {/* ===== 7. Footer ===== */}
        <PreviewFooter />
      </div>
    </>
  );
}
