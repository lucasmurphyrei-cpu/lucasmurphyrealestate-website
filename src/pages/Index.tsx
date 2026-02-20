import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Building2, MapPin, TrendingUp, TrendingDown, Minus as MinusIcon, Hammer, Landmark, Search, Shield, ArrowRight, Clock, Percent, CalendarDays, ClipboardList, PlusCircle } from "lucide-react";
import countyMarketData from "@/data/countyMarketData";
import { motion } from "framer-motion";
import milwaukeeSkyline from "@/assets/milwaukee-skyline.jpg";
import teamBanner from "@/assets/team-banner.png";
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const guides = [
  { icon: Home, label: "First-Time Home Buyers", to: "/first-time-homebuyers-guide", desc: "Your complete roadmap to homeownership", newTab: true },
  { icon: Building2, label: "First-Time Condo Buyers", to: "/guides/first-time-condo-buyers", desc: "Navigate condo purchasing with confidence" },
  { icon: MapPin, label: "Relocation Guide", to: "/guides/relocation", desc: "Moving to Milwaukee or Waukesha County" },
  { icon: TrendingUp, label: "House Hacking", to: "/guides/house-hacking", desc: "Live for free while building equity" },
  { icon: Landmark, label: "Investors", to: "/guides/investors", desc: "Grow your real estate portfolio" },
];

const resources = [
  { icon: Hammer, label: "Contractors", to: "/resources/contractors" },
  { icon: Landmark, label: "Lenders", to: "/resources/lenders" },
  { icon: Search, label: "Home Inspectors", to: "/resources/home-inspectors" },
  { icon: Shield, label: "Home Insurance", to: "/resources/home-insurance" },
];

const statIconMap: Record<string, React.ElementType> = {
  "Median Price": Home,
  "Days on Market": Clock,
  "Sale-to-List Ratio": Percent,
  "Months' Supply": CalendarDays,
  "Inventory": ClipboardList,
  "New Listings": PlusCircle,
};

const directionIcon = (dir: "up" | "down" | "flat") => {
  if (dir === "up") return <TrendingUp className="h-3 w-3" />;
  if (dir === "down") return <TrendingDown className="h-3 w-3" />;
  return <MinusIcon className="h-3 w-3" />;
};

const directionColor = (dir: "up" | "down" | "flat") => {
  if (dir === "up") return "text-emerald-600";
  if (dir === "down") return "text-red-500";
  return "text-muted-foreground";
};

const Index = () => {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "Provision Properties Core Team — eXp Realty",
            description: "Expert real estate services in Milwaukee County and Waukesha County, Wisconsin.",
            areaServed: ["Milwaukee County, WI", "Waukesha County, WI"],
            url: window.location.origin,
          }),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img src={milwaukeeSkyline} alt="Milwaukee city skyline" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />
        </div>
        <div className="container relative py-24 text-center md:py-36">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-4xl font-display text-4xl font-bold leading-[1.1] md:text-6xl"
          >
            Lucas Murphy <span className="text-primary">Real Estate</span>
            <br />
            <span className="text-3xl md:text-5xl">Metro Milwaukee Market Insights, Guides & Strategy</span>
            <span className="mt-2 block text-base font-normal text-muted-foreground md:text-lg">(Milwaukee, Ozaukee, Washington & Waukesha Counties)</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
          >
            Everything you need to buy, sell, or invest with confidence — all in one place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Button asChild size="lg">
              <a href="https://calendly.com/lucasmurphyrei" target="_blank" rel="noopener noreferrer">Schedule a Consultation</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/guides/first-time-home-buyers">Explore Guides</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Guides */}
      <section className="container py-20">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Buyer & Investor Guides</h2>
        <p className="mt-2 text-muted-foreground">In-depth resources to help you make confident real estate decisions.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g, i) => {
            const isExternal = g.to.startsWith("http");
            const opensNewTab = "newTab" in g && g.newTab;
            const useAnchor = isExternal || opensNewTab;
            const Wrapper = useAnchor ? "a" : Link;
            const wrapperProps = useAnchor
              ? { href: g.to, target: "_blank" as const, rel: "noopener noreferrer" }
              : { to: g.to };
            return (
              <motion.div key={g.to} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Wrapper {...(wrapperProps as any)}>
                  <Card className="group h-full transition-colors hover:border-primary/40">
                    <CardContent className="flex flex-col gap-3 p-6">
                      <g.icon className="h-8 w-8 text-primary" />
                      <h3 className="font-display text-lg font-semibold">{g.label}</h3>
                      <p className="text-sm text-muted-foreground">{g.desc}</p>
                      <span className="mt-auto inline-flex items-center gap-1 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Read More <ArrowRight className="h-3 w-3" />
                      </span>
                    </CardContent>
                  </Card>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Service Areas */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container py-20">
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">Our Service Areas</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-muted-foreground">Deep local expertise across southeastern Wisconsin's most desirable communities.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              { name: "Milwaukee County", slug: "milwaukee-county", desc: "From downtown Milwaukee to the charming suburbs — we know every neighborhood." },
              { name: "Ozaukee County", slug: "ozaukee-county", desc: "Cedarburg, Mequon, Port Washington — lakeside charm and scenic beauty." },
              { name: "Waukesha County", slug: "waukesha-county", desc: "Brookfield, Wauwatosa, New Berlin and beyond — your gateway to suburban living." },
              { name: "Washington County", slug: "washington-county", desc: "West Bend, Germantown, and thriving communities north of Milwaukee." },
            ].map((area) => {
              const marketData = countyMarketData[area.name];
              return (
                <Card key={area.name} className="border-primary/20">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between">
                      <div>
                        <MapPin className="h-6 w-6 text-primary" />
                        <h3 className="mt-3 font-display text-xl font-bold">{area.name}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{area.desc}</p>
                      </div>
                    </div>

                    {marketData && (
                      <div className="mt-5">
                        <p className="text-xs font-semibold uppercase tracking-widest text-light-blue mb-3">
                          Market Snapshot — {marketData.dataMonth}
                        </p>
                        <div className="grid gap-2 grid-cols-2 lg:grid-cols-3">
                          {marketData.stats.map((stat) => {
                            const Icon = statIconMap[stat.label] ?? ClipboardList;
                            return (
                              <div
                                key={stat.label}
                                className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-background p-3"
                              >
                                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                  <Icon className="h-3.5 w-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                                  <p className="text-sm font-bold leading-tight">{stat.value}</p>
                                  {stat.change !== "—" && (
                                    <p className={`mt-0.5 flex items-center gap-1 text-xs font-medium ${directionColor(stat.direction)}`}>
                                      {directionIcon(stat.direction)}
                                      {stat.change}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <Link to={`/areas/${area.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                      View Municipalities <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="container py-20">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Trusted Resources</h2>
        <p className="mt-2 text-muted-foreground">Professionals we trust to serve you well.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {resources.map((r, i) => (
            <motion.div key={r.to} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Link to={r.to}>
                <Card className="group transition-colors hover:border-primary/40">
                  <CardContent className="flex items-center gap-4 p-6">
                    <r.icon className="h-6 w-6 text-primary" />
                    <span className="font-semibold">{r.label}</span>
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About / Team */}
      <section className="relative border-t border-border">
        <div className="absolute inset-0">
          <img src={teamBanner} alt="Provision Properties Core Team banner" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />
        </div>
        <div className="container relative py-20 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">About Our Team</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            The Provision Properties Core Team at eXp Realty brings unmatched market knowledge and a client-first approach to every transaction in Milwaukee and Waukesha County. We're committed to making your real estate goals a reality — whether you're a first-time buyer, seasoned investor, or relocating to Wisconsin.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/contact">Get In Touch</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Index;
