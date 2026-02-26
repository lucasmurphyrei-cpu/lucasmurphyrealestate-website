import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, Flower2, Sun, Leaf, Snowflake, CheckCircle2, Download } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
};

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

const SeasonalGuide = () => (
  <>
    <Helmet>
      <title>Seasonal Home Maintenance Guide | Lucas Murphy Real Estate</title>
      <meta
        name="description"
        content="A seasonal home maintenance checklist for first-time homeowners in Metro Milwaukee — spring, summer, fall, and winter tasks to protect your investment."
      />
    </Helmet>

    <article className="container max-w-3xl py-16">
      <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <header className="mb-12">
        <CalendarDays className="h-10 w-10 text-primary" />
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
          Seasonal Home Maintenance Guide
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Owning a home in southeastern Wisconsin means dealing with everything from spring floods to sub-zero winters. This season-by-season checklist will help you stay ahead of costly repairs and keep your home in top shape year-round.
        </p>
      </header>

      <div className="mb-10 flex items-center gap-4 rounded-lg border border-primary/20 bg-primary/5 p-5">
        <Download className="h-6 w-6 shrink-0 text-primary" />
        <div className="flex-1">
          <p className="font-semibold text-foreground">Download the Full Guide</p>
          <p className="text-sm text-muted-foreground">Save or print this seasonal checklist as a PDF to keep handy at home.</p>
        </div>
        <Button asChild size="sm">
          <a href="/Seasonal-Home-Maintenance-Guide.pdf" download>Download PDF</a>
        </Button>
      </div>

      <div className="space-y-8">
        {seasons.map((season, i) => (
          <motion.div key={season.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <season.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold">{season.name}</h2>
                    <p className="text-sm text-muted-foreground">{season.months}</p>
                  </div>
                </div>
                <p className="mb-6 text-muted-foreground">{season.intro}</p>
                <ul className="space-y-3">
                  {season.tasks.map((task) => (
                    <li key={task} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{task}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="mb-1 text-sm font-semibold text-primary">Pro Tip</p>
                  <p className="text-sm text-muted-foreground">{season.proTip}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 rounded-lg border border-border bg-secondary/50 p-8 text-center">
        <h3 className="font-display text-2xl font-bold">Questions About Your New Home?</h3>
        <p className="mt-2 text-muted-foreground">
          Whether you're buying your first home or just moved in, our team is here to help you feel confident as a homeowner.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/contact">Schedule a Consultation</Link>
        </Button>
      </div>
    </article>
  </>
);

export default SeasonalGuide;
