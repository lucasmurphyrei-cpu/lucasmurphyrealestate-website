import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Building2, MapPin, TrendingUp, Landmark, ArrowRight, ExternalLink, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const guides = [
  {
    icon: Home,
    label: "First-Time Home Buyers",
    to: "https://www.lucasmurphyrealestate.com/guide/first-time-homebuyer-metro-milwaukee",
    desc: "Your complete roadmap to homeownership in Metro Milwaukee — from pre-approval to closing day.",
    external: true,
    status: "available" as const,
  },
  {
    icon: Building2,
    label: "First-Time Condo Buyers",
    to: "https://www.lucasmurphyrealestate.com/guide/condominium-ownership-guide",
    desc: "Navigate condo purchasing with confidence — HOA fees, assessments, financing, and what to look for.",
    external: true,
    status: "available" as const,
  },
  {
    icon: MapPin,
    label: "Relocation Guide",
    to: "/guides/relocation",
    desc: "Moving to Milwaukee or Waukesha County? Neighborhoods, schools, cost of living, and more.",
    status: "coming_soon" as const,
  },
  {
    icon: TrendingUp,
    label: "House Hacking",
    to: "/guides/house-hacking",
    desc: "Live for free while building equity — strategies for duplexes, triplexes, and multi-family investing.",
    status: "coming_soon" as const,
  },
  {
    icon: Landmark,
    label: "Investors",
    to: "/guides/investors",
    desc: "Grow your real estate portfolio in southeastern Wisconsin — cash flow analysis, deal evaluation, and market insights.",
    status: "coming_soon" as const,
  },
];

const GuidesOverview = () => (
  <>
    <Helmet>
      <title>Buyer & Investor Guides | Lucas Murphy Real Estate</title>
      <meta
        name="description"
        content="Free in-depth real estate guides for Metro Milwaukee — first-time buyers, condo buyers, relocation, house hacking, and investors."
      />
    </Helmet>

    <section className="border-b border-border bg-secondary/30">
      <div className="container py-16 text-center md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <BookOpen className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
            Buyer & Investor Guides
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            In-depth resources to help you make confident real estate decisions in Metro Milwaukee.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="container py-16">
      <div className="grid gap-6 md:grid-cols-2">
        {guides.map((g, i) => {
          const isComingSoon = g.status === "coming_soon";
          const inner = (
            <Card className="group h-full transition-colors hover:border-primary/40">
              <CardContent className="flex h-full flex-col gap-4 p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <g.icon className="h-5 w-5 text-primary" />
                  </div>
                  {isComingSoon && (
                    <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      Coming Soon
                    </span>
                  )}
                </div>
                <h2 className="font-display text-xl font-semibold">{g.label}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{g.desc}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  {g.external ? (
                    <>
                      Read on Website <ExternalLink className="h-3.5 w-3.5" />
                    </>
                  ) : isComingSoon ? (
                    <>Preview</>
                  ) : (
                    <>
                      Read Guide <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </span>
              </CardContent>
            </Card>
          );

          if (g.external) {
            return (
              <motion.div key={g.to} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <a href={g.to} target="_blank" rel="noopener noreferrer" className="block h-full">
                  {inner}
                </a>
              </motion.div>
            );
          }

          return (
            <motion.div key={g.to} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Link to={g.to} className="block h-full">
                {inner}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  </>
);

export default GuidesOverview;
