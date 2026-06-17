import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Handshake, Home, MessageSquare } from "lucide-react";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import Seo from "@/components/seo/Seo";
import MoneyInput from "@/pages/preview/_shared/MoneyInput";

const CALENDLY = "https://calendly.com/lucasmurphyrei";
const RATE_TRACKER = "https://www.freddiemac.com/pmms";
const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0
  );

const fieldCls =
  "w-full rounded-sm border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";
const labelCls = "mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground";
const tagCls = "text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground";

function Toggle<T extends string>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="flex overflow-hidden rounded-sm border border-border text-xs">
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`px-3 py-1.5 font-semibold transition-colors ${
            value === v ? "bg-accent text-accent-foreground" : "bg-white text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function monthlyPI(loan: number, annualRate: number, years: number) {
  if (loan <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return loan / n;
  return (loan * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
}

export default function MortgageCalculator() {
  const [price, setPrice] = useState(375000);
  const [downMode, setDownMode] = useState<"percent" | "dollar">("percent");
  const [downPct, setDownPct] = useState(20);
  const [downDollar, setDownDollar] = useState(75000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState<15 | 30>(30);
  const [taxAnnual, setTaxAnnual] = useState(6750);
  const [insMode, setInsMode] = useState<"estimate" | "exact">("estimate");
  const [insExact, setInsExact] = useState(1800);
  const [hoaOn, setHoaOn] = useState(false);
  const [hoa, setHoa] = useState(250);

  const switchDownMode = (m: "percent" | "dollar") => {
    if (m === downMode) return;
    if (m === "dollar") setDownDollar(Math.round(price * (downPct / 100)));
    else if (price > 0) setDownPct(Math.round((downDollar / price) * 1000) / 10);
    setDownMode(m);
  };

  const downAmount = downMode === "percent" ? price * (downPct / 100) : downDollar;
  const downPctEff = price > 0 ? (downAmount / price) * 100 : 0;
  const loan = Math.max(0, price - downAmount);
  const pi = monthlyPI(loan, rate, term);
  const tax = taxAnnual / 12;
  const estIns = Math.round(price * 0.004); // ~0.4% of home value / yr
  const insAnnual = insMode === "estimate" ? estIns : insExact;
  const ins = insAnnual / 12;
  const pmi = downPctEff < 20 ? (loan * 0.005) / 12 : 0;
  const hoaMonthly = hoaOn ? hoa : 0;
  const total = pi + tax + ins + pmi + hoaMonthly;

  const rows = [
    { label: "Principal & interest", value: pi },
    { label: "Property taxes", value: tax },
    { label: "Home insurance", value: ins },
    ...(pmi > 0 ? [{ label: "PMI (under 20% down)", value: pmi }] : []),
    ...(hoaMonthly > 0 ? [{ label: "HOA / condo fees", value: hoaMonthly }] : []),
  ];

  return (
    <div className="preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <Seo
        title="Mortgage Calculator | Metro Milwaukee | Lucas Murphy"
        description="Estimate your monthly mortgage payment for a Metro Milwaukee home. A clean, free mortgage calculator from Lucas Murphy."
        canonicalPath="/tools/mortgage-calculator"
      />
      <PreviewHeader />

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-[#0a1424] pt-28 pb-16 lg:pt-36 lg:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
            <Home className="h-4 w-4" /> Buyer tool
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl">
            Mortgage Calculator
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/75">
            Estimate your full monthly payment. Adjust the price, down payment, rate, taxes, and insurance to
            see it update in real time.
          </p>
        </div>
      </section>

      {/* ===== Calculator ===== */}
      <section className="mx-auto -mt-8 max-w-7xl px-6 pb-24 lg:px-10">
        <div className="grid overflow-hidden rounded-sm bg-card shadow-[0_40px_90px_-45px_hsl(216_52%_11%/0.45)] ring-1 ring-border/70 lg:grid-cols-2">
          {/* Inputs */}
          <div className="p-8 sm:p-10 lg:p-12">
            <h2 className="font-display text-2xl font-medium tracking-[-0.01em]">Your numbers</h2>
            <div className="mt-8 space-y-6">
              {/* Purchase price */}
              <div>
                <label htmlFor="price" className={labelCls}>Purchase price</label>
                <MoneyInput id="price" value={price} onChange={setPrice} className={fieldCls} />
              </div>

              {/* Down payment — % or $ */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className={tagCls}>Down payment</span>
                  <Toggle value={downMode} onChange={switchDownMode} options={[["percent", "%"], ["dollar", "$"]]} />
                </div>
                {downMode === "percent" ? (
                  <>
                    <input type="range" min={0} max={50} step={1} value={downPct}
                      onChange={(e) => setDownPct(+e.target.value)} className="w-full accent-[hsl(44_96%_50%)]" />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      <span className="font-semibold text-accent">{downPct}%</span> &middot; {usd(downAmount)} down
                    </p>
                  </>
                ) : (
                  <>
                    <MoneyInput value={downDollar} onChange={setDownDollar} className={fieldCls} />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {usd(downAmount)} &middot; <span className="font-semibold text-accent">{downPctEff.toFixed(1)}%</span> down
                    </p>
                  </>
                )}
              </div>

              {/* Interest rate + tracker link */}
              <div>
                <label htmlFor="rate" className={labelCls}>
                  Interest rate &mdash; <span className="text-accent">{rate}%</span>
                </label>
                <input id="rate" type="range" min={2} max={10} step={0.125} value={rate}
                  onChange={(e) => setRate(+e.target.value)} className="w-full accent-[hsl(44_96%_50%)]" />
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Rates change daily. See current averages on{" "}
                  <a href={RATE_TRACKER} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-0.5 font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-2 transition-colors hover:text-accent">
                    Freddie Mac's rate tracker <ExternalLink className="h-3 w-3" />
                  </a>
                  , then confirm your exact rate with your lender.
                </p>
              </div>

              {/* Loan term + property taxes */}
              <div className="grid gap-6 sm:grid-cols-2">
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
                <div>
                  <label htmlFor="tax" className={labelCls}>Property taxes (annual)</label>
                  <MoneyInput id="tax" value={taxAnnual} onChange={setTaxAnnual} className={fieldCls} />
                  <p className="mt-1.5 text-xs text-muted-foreground">From the listing or assessor. {usd(tax)}/mo.</p>
                </div>
              </div>

              {/* Home insurance — estimate or exact */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className={tagCls}>Home insurance (annual)</span>
                  <Toggle value={insMode} onChange={setInsMode} options={[["estimate", "Estimate"], ["exact", "Exact"]]} />
                </div>
                {insMode === "estimate" ? (
                  <div className="rounded-sm border border-border bg-secondary/40 px-4 py-3">
                    <p className="text-sm">
                      <span className="font-semibold text-foreground">{usd(estIns)}</span>
                      <span className="text-muted-foreground"> /yr estimated &middot; {usd(estIns / 12)}/mo</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Roughly 0.4% of the home price. Switch to Exact if you have a quote.</p>
                  </div>
                ) : (
                  <MoneyInput value={insExact} onChange={setInsExact} placeholder="Your annual premium" className={fieldCls} />
                )}
              </div>

              {/* HOA — yes/no */}
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className={tagCls}>HOA / condo fees</span>
                  <Toggle value={hoaOn ? "yes" : "no"} onChange={(v) => setHoaOn(v === "yes")} options={[["no", "No"], ["yes", "Yes"]]} />
                </div>
                {hoaOn && (
                  <MoneyInput value={hoa} onChange={setHoa} placeholder="Monthly HOA / condo fee" className={`${fieldCls} mt-3`} />
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col bg-[#0a1424] p-8 text-white/80 sm:p-10 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Estimated monthly payment</p>
            <p className="mt-3 font-display text-5xl font-semibold tracking-[-0.02em] text-white">{usd(total)}</p>

            <div className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm">
              {rows.map((r) => (
                <div key={r.label} className="flex items-center justify-between gap-4">
                  <span className="text-white/65">{r.label}</span>
                  <span className="tabular-nums text-white/90">{usd(r.value)}/mo</span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-base">
                <span className="font-semibold text-white">Total monthly</span>
                <span className="font-display text-xl font-semibold text-accent">{usd(total)}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-sm bg-white/[0.04] p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/45">Loan amount</p>
                <p className="mt-1 font-semibold text-white">{usd(loan)}</p>
              </div>
              <div className="rounded-sm bg-white/[0.04] p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/45">Down payment</p>
                <p className="mt-1 font-semibold text-white">{usd(downAmount)}</p>
              </div>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-white/45">
              An estimate for planning only. Your actual rate, taxes, and insurance depend on the property,
              your lender, and your credit. I can connect you with a trusted local lender for real numbers.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/resources/lenders"
                className="group inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5">
                <Handshake className="h-4 w-4" /> See my preferred lenders
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/contact"
                className="inline-flex items-center gap-2 rounded-sm border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10">
                <MessageSquare className="h-4 w-4" /> Ask a question
              </Link>
            </div>
          </div>
        </div>

        {/* Cross-link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Want the full picture?{" "}
          <Link to="/tools/budget-planner" className="font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent">
            See how much home you can afford
          </Link>
          .
        </p>
      </section>

      <PreviewFooter />
    </div>
  );
}
