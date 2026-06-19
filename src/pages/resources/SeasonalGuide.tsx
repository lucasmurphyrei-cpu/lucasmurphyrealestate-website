import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Download, Flower2, Leaf, Snowflake, Sun } from "lucide-react";
import ParallaxBand from "@/pages/preview/_shared/ParallaxBand";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import { IMG } from "@/pages/preview/_shared/tokens";
import Seo from "@/components/seo/Seo";

const CALENDLY = "https://calendly.com/lucasmurphyrei";

interface Season {
  icon: React.ElementType;
  name: string;
  months: string;
  intro: string;
  tasks: string[];
  proTip: string;
}

const seasons: Season[] = [
  {
    icon: Flower2,
    name: "Spring",
    months: "March – May",
    intro: "As the snow melts, it's time to assess winter damage and prep your home for warmer months.",
    tasks: [
      "Inspect your roof for missing or lifted shingles and signs of ice dam damage",
      "Clean gutters and downspouts — clear any debris that accumulated over winter",
      "Schedule an AC tune-up before the first hot day",
      "Check your basement for moisture or water intrusion from snowmelt",
      "Test your sump pump by pouring a bucket of water into the pit",
      "Walk the foundation perimeter and note any new cracks from freeze-thaw cycles",
      "Reseed bare lawn patches and apply pre-emergent crabgrass treatment",
      "Inspect caulking and weatherstripping around windows and doors — replace what's worn",
      "Service your lawn mower and outdoor power equipment",
    ],
    proTip:
      "Wisconsin's freeze-thaw cycle is brutal on foundations. Any new crack wider than ¼ inch deserves a call to a foundation specialist — catching it early can save thousands.",
  },
  {
    icon: Sun,
    name: "Summer",
    months: "June – August",
    intro: "Warm weather is perfect for tackling exterior projects and preventive maintenance.",
    tasks: [
      "Clean your dryer vent hose — lint buildup is a leading cause of house fires",
      "Power-wash siding, decks, and walkways",
      "Check window and door screens for tears and replace as needed",
      "Trim trees and shrubs — keep at least 12 inches of clearance from the house",
      "Inspect your deck or porch for loose boards, popped nails, and early rot",
      "Stain or seal the deck if water no longer beads on the surface",
      "Check exterior paint for peeling or blistering and touch up as needed",
      "Test all smoke and carbon monoxide detectors — replace batteries",
      "Flush your water heater to remove sediment buildup",
    ],
    proTip:
      "Milwaukee summers bring severe thunderstorms. Trim any branches within 10 feet of your roofline or power lines before storm season peaks in July.",
  },
  {
    icon: Leaf,
    name: "Fall",
    months: "September – November",
    intro: "Fall is your last chance to winterize before temperatures plummet. Don't skip these.",
    tasks: [
      "Clean gutters thoroughly after the leaves have dropped",
      "Disconnect, drain, and store all garden hoses",
      "Shut off exterior hose bibs at the interior shutoff valve and drain the lines",
      "Schedule a furnace inspection and replace the filter",
      "Reverse ceiling fans to clockwise — this pushes warm air back down",
      "Seal gaps around pipes, vents, and utility entrances to keep mice out",
      "Aerate and overseed your lawn, then apply fall fertilizer",
      "Insulate exposed pipes in the garage, basement, and crawl spaces",
      "Stock up on winter supplies: ice melt, snow shovels, and a roof rake",
    ],
    proTip:
      "Shut off your exterior water at the interior shutoff valve — not just the outdoor spigot. Even \"frost-free\" hose bibs can burst if a hose is left connected.",
  },
  {
    icon: Snowflake,
    name: "Winter",
    months: "December – February",
    intro: "Wisconsin winters are no joke. Stay on top of these tasks to protect your investment.",
    tasks: [
      "Keep gutters clear of ice — use a roof rake if ice dams start forming",
      "Monitor your attic for frost or moisture buildup (a sign of poor ventilation)",
      "Check and replace your furnace filter monthly during heavy-use season",
      "Prevent frozen pipes: let faucets drip on sub-zero nights and open cabinet doors",
      "Clear snow away from your furnace exhaust and intake vents outside",
      "Keep sidewalks and driveway clear of ice — it's a municipal code requirement in Milwaukee",
      "Inspect weatherstripping on exterior doors — warm air loss drives up heating bills",
      "Test your garage door auto-reverse safety feature",
      "Watch for condensation on windows — it may indicate high humidity or seal failure",
    ],
    proTip:
      "Wisconsin winters regularly hit −10°F or colder. If you leave for vacation, never set your thermostat below 55°F. A burst pipe can cause $10,000+ in damage.",
  },
];

export default function SeasonalGuide() {
  return (
    <div className="preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <Seo
        title="Seasonal Home Maintenance Guide | Metro Milwaukee | Lucas Murphy Real Estate"
        description="A season-by-season home maintenance checklist for Metro Milwaukee homeowners — spring, summer, fall, and winter tasks to protect your investment."
        canonicalPath="/resources/seasonal-guide"
      />
      <PreviewHeader />

      {/* ===== Hero ===== */}
      <ParallaxBand
        src={IMG.holyHill}
        align="end"
        objectPosition="center 42%"
        minH="min-h-[52vh]"
        overlay="bg-[linear-gradient(to_bottom,rgba(10,20,36,0.42)_0%,rgba(10,20,36,0.58)_45%,rgba(10,20,36,0.92)_100%)]"
      >
        <div className="max-w-2xl pb-6">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
            <CalendarDays className="h-4 w-4" /> Seasonal Home Guide
          </p>
          <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl">
            Keep your home in shape, season by season
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            Owning a home in southeastern Wisconsin means everything from spring floods to sub-zero
            winters. This season-by-season checklist helps you stay ahead of costly repairs all year.
          </p>
        </div>
      </ParallaxBand>

      {/* ===== Content ===== */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-24">
        <Link
          to="/vendors"
          className="group mb-10 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" /> Back to all vendors
        </Link>

        {/* Download callout */}
        <div className="mb-12 flex flex-col items-start gap-4 rounded-sm border border-accent/30 bg-accent/[0.06] p-5 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-accent/12 text-accent">
            <Download className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-display text-lg font-semibold">Download the full guide</p>
            <p className="text-sm text-muted-foreground">Save or print this seasonal checklist as a PDF to keep handy at home.</p>
          </div>
          <a
            href="/Seasonal-Home-Maintenance-Guide.pdf"
            download
            className="group inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" /> Download PDF
          </a>
        </div>

        <div className="space-y-8">
          {seasons.map((season, i) => (
            <motion.div
              key={season.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.08, 0.24) }}
              className="overflow-hidden rounded-sm border border-border bg-card shadow-[0_18px_44px_-30px_hsl(216_52%_11%/0.45)]"
            >
              <div className="flex items-center gap-3 border-b border-border bg-secondary/30 px-6 py-5 sm:px-8">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-accent/12 text-accent">
                  <season.icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-[-0.01em]">{season.name}</h2>
                  <p className="text-sm text-muted-foreground">{season.months}</p>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <p className="leading-relaxed text-muted-foreground">{season.intro}</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {season.tasks.map((task) => (
                    <li key={task} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-sm leading-relaxed text-muted-foreground">{task}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-sm border-l-2 border-accent bg-accent/[0.06] p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">Pro tip</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{season.proTip}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-[#0a1424]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-10 lg:py-24">
          <h2 className="font-display text-3xl font-medium tracking-[-0.02em] text-white sm:text-4xl">
            Questions about your new home?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/70">
            Whether you're buying your first home or just moved in, I'm here to help you feel confident as a homeowner.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-sm bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Schedule a consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <Link
              to="/contact"
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
