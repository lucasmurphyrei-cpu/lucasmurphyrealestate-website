import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ClipboardList, Download, DollarSign, ReceiptText, TrendingUp } from "lucide-react";
import ParallaxBand from "@/pages/preview/_shared/ParallaxBand";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import { IMG } from "@/pages/preview/_shared/tokens";
import Seo from "@/components/seo/Seo";

type Sheet = { icon: typeof TrendingUp; label: string; desc: string; href: string; download?: boolean; cta: string };

const SHEETS: Sheet[] = [
  {
    icon: TrendingUp,
    label: "BRRRR Calculator",
    desc: "Analyze Buy, Rehab, Rent, Refinance, Repeat deals. Estimate cash-on-cash return, equity, and refinance proceeds.",
    href: "/tools/Provision_Properties_BRRRR_Calculator.xlsx",
    download: true,
    cta: "Download .xlsx",
  },
  {
    icon: DollarSign,
    label: "Flip Calculator",
    desc: "Project fix and flip profits with purchase, rehab, and selling cost breakdowns, plus built-in stress testing.",
    href: "/tools/Provision_Properties_Flip_Calculator.xlsx",
    download: true,
    cta: "Download .xlsx",
  },
  {
    icon: ClipboardList,
    label: "Rehab Budget Tracker",
    desc: "Track renovation budgets across 22 categories and 179 line items, comparing estimates to actuals automatically.",
    href: "/tools/Provision_Properties_Rehab_Budget.xlsx",
    download: true,
    cta: "Download .xlsx",
  },
  {
    icon: ReceiptText,
    label: "CapEx Reserve Calculator",
    desc: "A 13-item capital expenditure planner. Budget for roofing, HVAC, and appliances before they surprise you.",
    href: "/tools/Provision_Properties_CapEx_First_Time_Home_Buyers.xlsx",
    download: true,
    cta: "Download .xlsx",
  },
  {
    icon: ReceiptText,
    label: "House Hack Calculator",
    desc: "Run a multi-unit deal: true cost of living, cash flow, and cash-on-cash return, right in your browser.",
    href: "/tools/house-hack-calculator",
    cta: "Open the calculator",
  },
  {
    icon: ReceiptText,
    label: "Seller Net Sheet",
    desc: "Estimate your net proceeds after commissions, closing costs, and payoffs.",
    href: "/tools/seller-net-sheet",
    cta: "Open the tool",
  },
];

export default function InvestorSpreadsheets() {
  return (
    <div className="preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <Seo
        title="Investor Spreadsheets | Metro Milwaukee | Lucas Murphy"
        description="Free Provision Properties Excel tools: BRRRR calculator, flip analysis, rehab budget tracker, CapEx planner, and more."
        canonicalPath="/tools/investor-spreadsheets"
      />
      <PreviewHeader />

      <ParallaxBand
        src={IMG.thirdWard}
        align="end"
        objectPosition="center 42%"
        minH="min-h-[52vh]"
        overlay="bg-[linear-gradient(to_bottom,rgba(10,20,36,0.4)_0%,rgba(10,20,36,0.55)_45%,rgba(10,20,36,0.92)_100%)]"
      >
        <div className="max-w-2xl pb-6">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-accent">Investor Tools</p>
          <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl">
            Underwrite deals like a pro
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            Free, Provision Properties branded spreadsheets and calculators to analyze rentals, flips, and
            rehabs across Metro Milwaukee.
          </p>
        </div>
      </ParallaxBand>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SHEETS.map((s) => {
            const inner = (
              <>
                <s.icon className="h-7 w-7 text-accent" />
                <h3 className="mt-4 font-display text-lg font-semibold leading-tight text-foreground">{s.label}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
                  {s.download ? <Download className="h-4 w-4 text-accent" /> : null}
                  {s.cta}
                  {s.download ? null : <ArrowUpRight className="h-4 w-4 text-accent" />}
                </span>
              </>
            );
            const cls =
              "group flex flex-col rounded-sm border border-border bg-card p-6 shadow-[0_18px_44px_-30px_hsl(216_52%_11%/0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_28px_60px_-32px_hsl(216_52%_11%/0.5)]";
            return s.download ? (
              <a key={s.label} href={s.href} download className={cls}>{inner}</a>
            ) : (
              <Link key={s.label} to={s.href} className={cls}>{inner}</Link>
            );
          })}
        </div>
      </section>

      <section className="bg-[#0a1424]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-10 lg:py-24">
          <h2 className="font-display text-3xl font-medium tracking-[-0.02em] text-white sm:text-4xl">
            Have a deal you want a second set of eyes on?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/70">
            I came up house hacking and underwrite deals every week. Send me the numbers and I'll pressure test them with you.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="https://calendly.com/lucasmurphyrei" target="_blank" rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-sm bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5">
              Schedule a consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <Link to="/contact"
              className="inline-flex items-center gap-2 rounded-sm border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10">
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <PreviewFooter />
    </div>
  );
}
