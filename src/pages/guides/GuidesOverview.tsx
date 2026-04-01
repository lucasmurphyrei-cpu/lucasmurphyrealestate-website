import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building2, MapPin, TrendingUp, Landmark, DollarSign, ArrowRight, ExternalLink, BookOpen, ShoppingBag, LineChart, Phone, Mail, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import lucasHeadshot from "@/assets/lucas-murphy-headshot.jpeg";
import provisionLogo from "@/assets/provision-logo.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

type Guide = {
  icon: typeof Home;
  label: string;
  to: string;
  desc: string;
  external?: boolean;
  status: "available" | "coming_soon";
};

const buyerGuides: Guide[] = [
  {
    icon: Home,
    label: "First-Time Home Buyers",
    to: "https://www.lucasmurphyrealestate.com/guide/first-time-homebuyer-metro-milwaukee",
    desc: "Your complete roadmap to homeownership in Metro Milwaukee — from pre-approval to closing day.",
    external: true,
    status: "available",
  },
  {
    icon: Building2,
    label: "First-Time Condo Buyers",
    to: "https://www.lucasmurphyrealestate.com/guide/condominium-ownership-guide",
    desc: "Navigate condo purchasing with confidence — HOA fees, assessments, financing, and what to look for.",
    external: true,
    status: "available",
  },
  {
    icon: MapPin,
    label: "Relocation Guide",
    to: "https://www.lucasmurphyrealestate.com/guide/relocation-guide-metro-milwaukee",
    desc: "Moving to Milwaukee or Waukesha County? Neighborhoods, schools, cost of living, and more.",
    external: true,
    status: "available",
  },
];

const investorGuides: Guide[] = [
  {
    icon: TrendingUp,
    label: "House Hacking",
    to: "https://www.lucasmurphyrealestate.com/guide/house-hacking-guide",
    desc: "Live for free while building equity — strategies for duplexes, triplexes, and multi-family investing.",
    external: true,
    status: "available",
  },
  {
    icon: Landmark,
    label: "Investors",
    to: "/guides/investors",
    desc: "Grow your real estate portfolio in southeastern Wisconsin — cash flow analysis, deal evaluation, and market insights.",
    status: "coming_soon",
  },
];

const sellerGuides: Guide[] = [
  {
    icon: DollarSign,
    label: "Seller's Guide",
    to: "/guides/sellers",
    desc: "Everything you need to know about listing, pricing, staging, and selling your home in Metro Milwaukee.",
    status: "coming_soon",
  },
];

function GuideCard({ g, i }: { g: Guide; i: number }) {
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
        <h3 className="font-display text-xl font-semibold">{g.label}</h3>
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
}

function CategorySection({
  icon: Icon,
  title,
  guides,
  startIndex,
}: {
  icon: typeof Home;
  title: string;
  guides: Guide[];
  startIndex: number;
}) {
  return (
    <div className="mb-14 last:mb-0">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4.5 w-4.5 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold">{title}</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {guides.map((g, i) => (
          <GuideCard key={g.to} g={g} i={startIndex + i} />
        ))}
      </div>
    </div>
  );
}

const GuidesOverview = () => (
  <>
    <Helmet>
      <title>Buyer, Investor & Seller Guides | Lucas Murphy Real Estate</title>
      <meta
        name="description"
        content="Free in-depth real estate guides for Metro Milwaukee — first-time buyers, condo buyers, relocation, house hacking, investors, and sellers."
      />
      <link rel="canonical" href="https://www.lucasmurphyrealestate.com/guides" />
    </Helmet>

    <section className="border-b border-border bg-secondary/30">
      <div className="container py-16 text-center md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <BookOpen className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
            Real Estate Guides
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            In-depth resources to help you make confident real estate decisions in Metro Milwaukee.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="container py-16">
      <CategorySection icon={ShoppingBag} title="Buyer Guides" guides={buyerGuides} startIndex={0} />
      <CategorySection icon={LineChart} title="Investor Guides" guides={investorGuides} startIndex={buyerGuides.length} />
      <CategorySection icon={DollarSign} title="Seller Guides" guides={sellerGuides} startIndex={buyerGuides.length + investorGuides.length} />
    </section>

    {/* Branding / Contact CTA */}
    <section className="border-t border-border bg-secondary/30">
      <div className="container py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-10 md:flex-row md:items-start"
        >
          <div className="flex-shrink-0">
            <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-primary/30">
              <img src={lucasHeadshot} alt="Lucas Murphy, Realtor" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="font-display text-2xl font-bold">Lucas Murphy</h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Realtor® — eXp Realty | Provision Properties Core Team
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Have questions about buying, selling, or investing in Metro Milwaukee? I'd love to help — reach out anytime.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="tel:4142694909" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                <Phone className="h-4 w-4 text-primary" />
                (414)-269-4909
              </a>
              <a href="mailto:lucas.murphy@exprealty.com" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                <Mail className="h-4 w-4 text-primary" />
                lucas.murphy@exprealty.com
              </a>
              <a href="https://calendly.com/lucasmurphyrei" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                <Calendar className="h-4 w-4 text-primary" />
                Schedule a Consultation
              </a>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button asChild>
                <Link to="/contact" className="gap-2">
                  Get In Touch <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Browse All Resources</Link>
              </Button>
            </div>
          </div>

          <div className="flex-shrink-0 self-center md:self-start">
            <img src={provisionLogo} alt="Provision Properties Core Team logo" className="h-32 w-auto md:h-40" />
          </div>
        </motion.div>
      </div>
    </section>
  </>
);

export default GuidesOverview;
