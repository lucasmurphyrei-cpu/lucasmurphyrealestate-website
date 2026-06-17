import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Handshake, MessageSquare, Wallet } from "lucide-react";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import Seo from "@/components/seo/Seo";
import MoneyInput from "@/pages/preview/_shared/MoneyInput";

const RATE_TRACKER = "https://www.freddiemac.com/pmms";
// Approximate average EFFECTIVE property tax rates (% of home value / yr) for Metro Milwaukee.
// Published public estimates; they vary by municipality and reassessment, so treat as a starting point.
const TAX_RATES_URL = "https://smartasset.com/taxes/wisconsin-property-tax-calculator";
const COUNTY_TAX: { label: string; rate: number }[] = [
  { label: "Milwaukee County", rate: 2.35 },
  { label: "Waukesha County", rate: 1.45 },
  { label: "Ozaukee County", rate: 1.65 },
  { label: "Washington County", rate: 1.6 },
];
const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0
  );

const fieldCls =
  "w-full rounded-sm border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";
const labelCls = "mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground";

function piPerDollar(annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return 1 / n;
  return (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function BudgetPlanner() {
  const [income, setIncome] = useState(110000);
  const [incomeBasis, setIncomeBasis] = useState<"gross" | "net">("gross");
  const [debts, setDebts] = useState(450);
  const [down, setDown] = useState(40000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState<15 | 30>(30);
  const [taxRate, setTaxRate] = useState(1.8);

  // The 28/36 rule is gross-income based. If you enter take-home (net), estimate gross (~25% to taxes).
  const grossMonthly = incomeBasis === "gross" ? income / 12 : income / 12 / 0.75;
  // 28% front-end / 36% back-end DTI guardrails
  const maxPITI = Math.max(0, Math.min(0.28 * grossMonthly, 0.36 * grossMonthly - debts));
  const factor = piPerDollar(rate, term);

  // Solve for the max home price (taxes/insurance/PMI depend on price -> iterate)
  let price = down;
  for (let i = 0; i < 10; i++) {
    const monthlyTax = (price * (taxRate / 100)) / 12;
    const monthlyIns = (price * 0.004) / 12; // ~0.4%/yr
    const loanGuess = Math.max(0, price - down);
    const dpPct = price > 0 ? (down / price) * 100 : 100;
    const monthlyPMI = dpPct < 20 ? (loanGuess * 0.005) / 12 : 0;
    const piBudget = Math.max(0, maxPITI - monthlyTax - monthlyIns - monthlyPMI);
    const loan = factor > 0 ? piBudget / factor : 0;
    price = loan + down;
  }

  const loan = Math.max(0, price - down);
  const pi = loan * factor;
  const tax = (price * (taxRate / 100)) / 12;
  const ins = (price * 0.004) / 12;
  const dpPct = price > 0 ? (down / price) * 100 : 0;
  const pmi = dpPct < 20 ? (loan * 0.005) / 12 : 0;
  const totalPayment = pi + tax + ins + pmi;

  const rows = [
    { label: "Principal & interest", value: pi },
    { label: "Property taxes", value: tax },
    { label: "Home insurance (est.)", value: ins },
    ...(pmi > 0 ? [{ label: "PMI (under 20% down)", value: pmi }] : []),
  ];

  return (
    <div className="preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <Seo
        title="How Much Home Can You Afford? | Metro Milwaukee | Lucas Murphy"
        description="Estimate the home price your budget supports in Metro Milwaukee, based on your income, debts, and down payment."
        canonicalPath="/preview/v1/tools/budget-planner/quick"
        noindex
      />
      <PreviewHeader />

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-[#0a1424] pt-28 pb-16 lg:pt-36 lg:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
            <Wallet className="h-4 w-4" /> Buyer tool
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl">
            How much home can you afford?
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/75">
            A quick estimate of the price range your budget supports, based on standard lender guidelines.
            Adjust the numbers to see your buying power.
          </p>
        </div>
      </section>

      {/* ===== Calculator ===== */}
      <section className="mx-auto -mt-8 max-w-7xl px-6 pb-24 lg:px-10">
        <div className="grid overflow-hidden rounded-sm bg-card shadow-[0_40px_90px_-45px_hsl(216_52%_11%/0.45)] ring-1 ring-border/70 lg:grid-cols-2">
          {/* Inputs */}
          <div className="p-8 sm:p-10 lg:p-12">
            <h2 className="font-display text-2xl font-medium tracking-[-0.01em]">Your finances</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">These fields start with example numbers so you can see how it works, just edit them to match your own.</p>
            <div className="mt-8 space-y-6">
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Annual household income</span>
                  <div className="flex overflow-hidden rounded-sm border border-border text-xs">
                    {(["gross", "net"] as const).map((b) => (
                      <button key={b} type="button" onClick={() => setIncomeBasis(b)}
                        className={`px-3 py-1.5 font-semibold transition-colors ${incomeBasis === b ? "bg-accent text-accent-foreground" : "bg-white text-muted-foreground hover:text-foreground"}`}>
                        {b === "gross" ? "Gross" : "Net"}
                      </button>
                    ))}
                  </div>
                </div>
                <MoneyInput id="income" value={income} onChange={setIncome} className={fieldCls} />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {incomeBasis === "gross"
                    ? "Before taxes. The 28/36 rule lenders use is based on gross income."
                    : "Your take-home pay. We estimate gross from it (about 25% to taxes) to apply the lender rule."}
                </p>
              </div>
              <div>
                <label htmlFor="debts" className={labelCls}>Monthly debt payments</label>
                <MoneyInput id="debts" value={debts} onChange={setDebts} className={fieldCls} />
                <p className="mt-1.5 text-xs text-muted-foreground">Car loans, student loans, and minimum credit card payments.</p>
              </div>
              <div>
                <label htmlFor="down" className={labelCls}>Down payment saved</label>
                <MoneyInput id="down" value={down} onChange={setDown} className={fieldCls} />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="rate" className={labelCls}>
                    Interest rate &mdash; <span className="text-accent">{rate}%</span>
                  </label>
                  <input id="rate" type="range" min={2} max={10} step={0.125} value={rate}
                    onChange={(e) => setRate(+e.target.value)} className="w-full accent-[hsl(44_96%_50%)]" />
                </div>
                <div>
                  <span className={labelCls}>Loan term</span>
                  <div className="flex gap-2">
                    {([30, 15] as const).map((t) => (
                      <button key={t} type="button" onClick={() => setTerm(t)}
                        className={`flex-1 rounded-sm border px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                          term === t ? "border-accent bg-accent text-accent-foreground" : "border-border bg-white text-foreground hover:border-accent/60"
                        }`}>
                        {t}-yr
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="tax" className={labelCls}>Property tax rate (%)</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <select
                    aria-label="Estimate by county"
                    value={taxRate}
                    onChange={(e) => setTaxRate(+e.target.value)}
                    className={fieldCls}
                  >
                    {!COUNTY_TAX.some((c) => c.rate === taxRate) && <option value={taxRate}>Custom rate</option>}
                    {COUNTY_TAX.map((c) => (
                      <option key={c.label} value={c.rate}>{c.label} (~{c.rate}%)</option>
                    ))}
                  </select>
                  <input id="tax" type="number" min={0} step={0.01} value={taxRate}
                    onChange={(e) => setTaxRate(+e.target.value)} className={fieldCls} />
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Pick your county for a typical starting estimate, or enter your own. These are approximate county averages; actual rates vary by municipality and reassessment, so{" "}
                <a href={TAX_RATES_URL} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-0.5 font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-2 transition-colors hover:text-accent">
                  see rates by county <ExternalLink className="h-3 w-3" />
                </a>{" "}
                and confirm the exact figure for the home.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Based on the 28/36 rule lenders use. Interest rates change daily, see{" "}
                <a href={RATE_TRACKER} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-0.5 font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-2 transition-colors hover:text-accent">
                  Freddie Mac's tracker <ExternalLink className="h-3 w-3" />
                </a>{" "}
                and confirm with your lender.
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col bg-[#0a1424] p-8 text-white/80 sm:p-10 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Estimated home price</p>
            <p className="mt-3 font-display text-5xl font-semibold tracking-[-0.02em] text-white">{usd(price)}</p>
            <p className="mt-2 text-sm text-white/55">at about {usd(totalPayment)}/mo, within {usd(maxPITI)}/mo budget</p>

            <div className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm">
              {rows.map((r) => (
                <div key={r.label} className="flex items-center justify-between gap-4">
                  <span className="text-white/65">{r.label}</span>
                  <span className="tabular-nums text-white/90">{usd(r.value)}/mo</span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-base">
                <span className="font-semibold text-white">Est. monthly payment</span>
                <span className="font-display text-xl font-semibold text-accent">{usd(totalPayment)}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-sm bg-white/[0.04] p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/45">Loan amount</p>
                <p className="mt-1 font-semibold text-white">{usd(loan)}</p>
              </div>
              <div className="rounded-sm bg-white/[0.04] p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/45">Down payment</p>
                <p className="mt-1 font-semibold text-white">{usd(down)} &middot; {dpPct.toFixed(0)}%</p>
              </div>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-white/45">
              An estimate for planning only. What you actually qualify for depends on your full financial
              picture, credit, and lender. I can connect you with a trusted local lender for a real
              pre-approval.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/resources/lenders"
                className="group inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5">
                <Handshake className="h-4 w-4" /> See my preferred lenders
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/preview/v1/contact"
                className="inline-flex items-center gap-2 rounded-sm border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10">
                <MessageSquare className="h-4 w-4" /> Ask a question
              </Link>
            </div>
          </div>
        </div>

        {/* Go deeper — the in-depth 4-step version on its own page */}
        <div className="mt-12 overflow-hidden rounded-sm border border-border bg-card shadow-[0_30px_70px_-45px_hsl(216_52%_11%/0.4)]">
          <div className="grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:gap-12 lg:p-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Want to go deeper?</p>
              <h2 className="mt-3 font-display text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                Break it down step by step
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                Walk through your real budget to find a price you can truly live with, not just one a lender
                will approve.
              </p>
              <ol className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
                <li><span className="text-accent">1.</span> Fixed expenses</li>
                <li><span className="text-accent">2.</span> Spending &amp; savings</li>
                <li><span className="text-accent">3.</span> Affordability</li>
                <li><span className="text-accent">4.</span> The mortgage</li>
              </ol>
            </div>
            <Link
              to="/preview/v1/tools/budget-planner/in-depth"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Open the in-depth version
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <PreviewFooter />
    </div>
  );
}
