import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileSpreadsheet,
  Home,
  TrendingUp,
  DollarSign,
  Wrench,
  Calculator,
  ClipboardList,
  ReceiptText,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import lucasHeadshot from "@/assets/lucas-murphy-headshot.jpeg";
import provisionLogo from "@/assets/provision-logo.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

type Spreadsheet = {
  icon: typeof Home;
  label: string;
  file: string | null;
  desc: string;
  status: "available" | "coming_soon";
};

const firstTimeBuyerTools: Spreadsheet[] = [
  {
    icon: Calculator,
    label: "CapEx Reserve Calculator",
    file: "Provision_Properties_CapEx_First_Time_Home_Buyers.xlsx",
    desc: "A simplified 13-item capital expenditure planner — budget for major repairs and replacements like roofing, HVAC, and appliances before they surprise you.",
    status: "available",
  },
];

const investorTools: Spreadsheet[] = [
  {
    icon: TrendingUp,
    label: "BRRRR Calculator",
    file: "Provision_Properties_BRRRR_Calculator.xlsx",
    desc: "Analyze Buy, Rehab, Rent, Refinance, Repeat deals — estimate cash-on-cash return, equity position, and refinance proceeds for rental investment properties.",
    status: "available",
  },
  {
    icon: DollarSign,
    label: "Flip Calculator",
    file: "Provision_Properties_Flip_Calculator.xlsx",
    desc: "Project fix & flip profits with detailed purchase, rehab, and selling cost breakdowns. Includes tax estimation and built-in stress testing for conservative underwriting.",
    status: "available",
  },
  {
    icon: ClipboardList,
    label: "Rehab Budget Tracker",
    file: "Provision_Properties_Rehab_Budget.xlsx",
    desc: "Track renovation budgets across 22 categories and 179 line items. Compare estimates to actuals with automatic variance calculations to keep projects on budget.",
    status: "available",
  },
];

const sellerTools: Spreadsheet[] = [
  {
    icon: ReceiptText,
    label: "Seller Net Sheet",
    file: null,
    desc: "Estimate your net proceeds after commissions, closing costs, and payoffs — so you know exactly what you'll walk away with.",
    status: "coming_soon",
  },
];

function SpreadsheetCard({ s, i }: { s: Spreadsheet; i: number }) {
  const isComingSoon = s.status === "coming_soon";

  return (
    <motion.div
      custom={i}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
    >
      <Card className="group flex h-full flex-col transition-colors hover:border-primary/40">
        <CardContent className="flex h-full flex-col gap-4 p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            {isComingSoon && (
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                Coming Soon
              </span>
            )}
          </div>
          <h3 className="font-display text-xl font-semibold">{s.label}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {s.desc}
          </p>
          {!isComingSoon && s.file && (
            <Button asChild className="mt-auto w-full gap-2">
              <a href={`/tools/${s.file}`} download>
                <Download className="h-4 w-4" />
                Download Spreadsheet
              </a>
            </Button>
          )}
          {isComingSoon && (
            <span className="mt-auto text-sm font-medium text-muted-foreground">
              Available soon
            </span>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CategorySection({
  icon: Icon,
  title,
  tools,
  startIndex,
}: {
  icon: typeof Home;
  title: string;
  tools: Spreadsheet[];
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
        {tools.map((s, i) => (
          <SpreadsheetCard key={s.label} s={s} i={startIndex + i} />
        ))}
      </div>
    </div>
  );
}

const InvestorSpreadsheets = () => (
  <>
    <Helmet>
      <title>
        Free Real Estate Spreadsheets | Lucas Murphy Real Estate
      </title>
      <meta
        name="description"
        content="Free Provision Properties branded Excel tools — BRRRR calculator, flip analysis, rehab budget tracker, CapEx planner, and seller net sheet for Metro Milwaukee real estate."
      />
      <link rel="canonical" href="https://www.lucasmurphyrealestate.com/tools/investor-spreadsheets" />
    </Helmet>

    <section className="border-b border-border bg-secondary/30">
      <div className="container py-16 text-center md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FileSpreadsheet className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
            Real Estate Spreadsheets
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Free Excel tools to analyze deals, track budgets, and plan for the
            unexpected. Download, plug in your numbers, and decide with
            confidence.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="container py-16">
      <CategorySection
        icon={Home}
        title="First-Time Home Buyers"
        tools={firstTimeBuyerTools}
        startIndex={0}
      />
      <CategorySection
        icon={TrendingUp}
        title="Investors"
        tools={investorTools}
        startIndex={firstTimeBuyerTools.length}
      />
      <CategorySection
        icon={Wrench}
        title="Sellers"
        tools={sellerTools}
        startIndex={firstTimeBuyerTools.length + investorTools.length}
      />
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
          {/* Headshot */}
          <div className="flex-shrink-0">
            <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-primary/30">
              <img
                src={lucasHeadshot}
                alt="Lucas Murphy, Realtor"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-display text-2xl font-bold">Lucas Murphy</h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Realtor® — eXp Realty | Provision Properties Core Team
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Have questions about a deal or need help running your numbers? I
              work with investors and first-time buyers across Metro Milwaukee
              every day — reach out anytime.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="tel:4142694909"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4 text-primary" />
                (414)-269-4909
              </a>
              <a
                href="mailto:lucas.murphy@exprealty.com"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4 text-primary" />
                lucas.murphy@exprealty.com
              </a>
              <a
                href="https://calendly.com/lucasmurphyrei"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
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

          {/* Logo */}
          <div className="flex-shrink-0 self-center md:self-start">
            <img
              src={provisionLogo}
              alt="Provision Properties Core Team logo"
              className="h-32 w-auto md:h-40"
            />
          </div>
        </motion.div>
      </div>
    </section>
  </>
);

export default InvestorSpreadsheets;
