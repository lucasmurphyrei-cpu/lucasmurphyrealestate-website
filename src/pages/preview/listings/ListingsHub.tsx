import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Phone, Search } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import ParallaxBand from "@/pages/preview/_shared/ParallaxBand";
import { IMG, VID, SOCIAL, heroCounties } from "@/pages/preview/_shared/tokens";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import Seo from "@/components/seo/Seo";
import JsonLd from "@/components/seo/JsonLd";
import { graph, breadcrumbList } from "@/lib/seo/schema";
import { ALL_LISTINGS_URL } from "./listingsConfig";

const GOLD = "hsl(44, 100%, 53%)";
const CALENDLY = "https://calendly.com/lucasmurphyrei";

/* County display name -> slug, e.g. "Milwaukee County" -> "milwaukee-county" */
const nameToSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function ListingsHub() {
  return (
    <>
      <Seo
        title="Search Active Listings | Metro Milwaukee Homes for Sale"
        description="Search every active home for sale across Milwaukee, Waukesha, Ozaukee, and Washington Counties. Pick a county, set your criteria, and view results on the map."
        canonicalPath="/preview/v1/listings"
        noindex
      />
      <JsonLd
        data={graph(
          breadcrumbList([
            { name: "Home", path: "/preview/v1" },
            { name: "Listings", path: "/preview/v1/listings" },
          ])
        )}
      />

      <div className="min-h-screen bg-[#0a1424] text-white">
        <PreviewHeader />

        {/* ===== Hero ===== */}
        <ParallaxBand src={IMG.skyline} overlay="bg-[#0a1424]/65" minH="min-h-[88vh]">
          <div className="max-w-3xl py-32">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4 text-sm font-semibold uppercase tracking-[0.24em]"
              style={{ color: GOLD }}
            >
              Home Search
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl font-medium leading-tight text-white sm:text-6xl lg:text-7xl"
            >
              Every active listing,{" "}
              <span className="italic" style={{ color: GOLD }}>
                across metro Milwaukee.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80"
            >
              Start with your county, narrow to a community, and set your must-haves. We'll drop you onto a live
              map of homes for sale, filtered to exactly what you want.
            </motion.p>
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
                Pick your county
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href={ALL_LISTINGS_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                <Search className="h-4 w-4" />
                Browse all homes
              </a>
            </motion.div>
          </div>
        </ParallaxBand>

        {/* ===== County cards ===== */}
        <section id="counties" className="bg-gradient-to-b from-[#0a1424] via-[#101d31] to-[#0a1424] py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-12 max-w-xl"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: GOLD }}>
                Browse by County
              </p>
              <h2 className="font-display text-3xl font-medium leading-snug text-white sm:text-4xl">
                Pick where you want to live.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/65">
                Choose a county to narrow to a community and set your search criteria.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {heroCounties.map((c, i) => {
                const slug = nameToSlug(c.name);
                return (
                  <motion.div key={c.name} custom={i} variants={fadeUp} initial="hidden" animate="show">
                    <Link
                      to={`/preview/v1/listings/${slug}`}
                      className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_20px_48px_-16px_rgba(0,0,0,0.6)]"
                    >
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={c.img}
                          alt={c.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1424]/85 via-[#0a1424]/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-4">
                          <p className="font-display text-lg font-semibold text-white">{c.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-5 py-4">
                        <span className="text-sm font-medium text-white/70">Search this county</span>
                        <ArrowUpRight className="h-4 w-4 text-white/60 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== CTA band ===== */}
        <ParallaxBand src={IMG.portSunrise} video={VID.sunset} overlay="bg-[#0a1424]/65" minH="min-h-[60vh]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: GOLD }}>
              Not sure where to start?
            </p>
            <h2 className="font-display text-4xl font-medium leading-tight text-white sm:text-5xl">
              Let's find the right home,{" "}
              <span className="italic" style={{ color: GOLD }}>
                together.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80">
              Tell me your must-haves and budget and I'll set up a custom search, then send you new listings the
              moment they hit the market.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <a
                href={CALENDLY}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-sm px-8 py-3.5 text-sm font-semibold text-[#0a1424] transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: GOLD }}
              >
                Schedule a Consultation
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href={SOCIAL.phoneHref} className="inline-flex items-center gap-2 text-sm font-semibold text-white">
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
