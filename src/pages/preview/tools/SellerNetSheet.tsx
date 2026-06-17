import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, Calendar, Info, MessageSquare, Printer } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RTooltip } from "recharts";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import MoneyInput from "@/pages/preview/_shared/MoneyInput";
import Seo from "@/components/seo/Seo";

const CALENDLY = "https://calendly.com/lucasmurphyrei";
const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0
  );

const fieldCls =
  "w-full rounded-sm border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";
const labelCls = "mb-2 flex items-center text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground";

function InfoTip({ text }: { text: string }) {
  return (
    <span className="group/tip relative ml-1.5 inline-flex align-middle">
      <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground/70 transition-colors hover:text-accent" />
      <span className="pointer-events-none absolute left-0 top-6 z-50 hidden w-64 rounded-sm border border-border bg-card p-3 text-left text-[11px] font-normal normal-case leading-relaxed tracking-normal text-muted-foreground shadow-[0_18px_44px_-20px_hsl(216_52%_11%/0.55)] group-hover/tip:block">
        {text}
      </span>
    </span>
  );
}

export default function SellerNetSheet() {
  const [salePrice, setSalePrice] = useState(375000);
  const [mortgage, setMortgage] = useState(220000);
  const [rate, setRate] = useState(6.5);
  const [closingDate, setClosingDate] = useState("");
  const [annualTax, setAnnualTax] = useState(6500);
  const [commissionPct, setCommissionPct] = useState(5.5);
  const [closingPct, setClosingPct] = useState(1);
  const [extras, setExtras] = useState(0);

  // Closing-date-driven prorations (only apply once a date is chosen)
  const closing = closingDate ? new Date(closingDate + "T00:00:00") : null;
  const dayOfMonth = closing ? closing.getDate() : 0;
  const dayOfYear = closing
    ? Math.floor((closing.getTime() - new Date(closing.getFullYear(), 0, 1).getTime()) / 86400000) + 1
    : 0;

  const commission = salePrice * (commissionPct / 100);
  const transferTax = salePrice * 0.003; // Wisconsin transfer fee: $3 per $1,000
  const closingCosts = salePrice * (closingPct / 100);
  const payoffInterest = (mortgage * (rate / 100 / 365)) * dayOfMonth; // per-diem interest to closing
  const taxProration = annualTax * (dayOfYear / 365); // seller credits buyer Jan 1 → closing (WI in arrears)
  const net = salePrice - mortgage - payoffInterest - commission - transferTax - closingCosts - taxProration - extras;

  // Segments map 1:1 to donut slices and the line-item legend.
  const segments = [
    { key: "net", label: "Net to you", value: Math.max(0, net), color: "hsl(44 96% 50%)" },
    { key: "mortgage", label: "Mortgage payoff", value: mortgage, color: "#3b5bdb" },
    { key: "interest", label: "Payoff interest", value: payoffInterest, color: "#5c7cfa" },
    { key: "commission", label: `Agent commission (${commissionPct}%)`, value: commission, color: "#9775fa" },
    { key: "taxes", label: "Property tax proration", value: taxProration, color: "#f06595" },
    { key: "closing", label: "Closing + transfer fees", value: transferTax + closingCosts, color: "#4dabf7" },
    { key: "concessions", label: "Repairs & concessions", value: extras, color: "#ffa94d" },
  ];
  const pieData = segments.filter((s) => s.value > 0);

  return (
    <div className="sns-page preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <style>{`
        @media print {
          header, footer, .sns-no-print { display: none !important; }
          .sns-page { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #fff !important; }
          .sns-card { box-shadow: none !important; }
          @page { margin: 0.5in; }
        }
      `}</style>
      <Seo
        title="Seller Net Sheet Calculator | Metro Milwaukee | Lucas Murphy"
        description="Estimate your take-home proceeds when selling your Metro Milwaukee home, with closing-date tax and payoff proration. A free seller net sheet calculator from Lucas Murphy."
        canonicalPath="/preview/v1/tools/seller-net-sheet"
        noindex
      />
      <PreviewHeader />

      {/* ===== Hero ===== */}
      <section className="sns-no-print relative overflow-hidden bg-[#0a1424] pt-28 pb-16 lg:pt-36 lg:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
            <Calculator className="h-4 w-4" /> Seller tool
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl">
            Seller Net Sheet
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/75">
            Estimate what you'll actually walk away with at closing. Hover the info icons for help finding each
            number, then watch your net proceeds update in real time.
          </p>
        </div>
      </section>

      {/* ===== Calculator ===== */}
      <section className="mx-auto -mt-8 max-w-7xl px-6 pb-24 lg:px-10 print:mt-0">
        {/* Print-only header */}
        <div className="mb-6 hidden border-b border-border pb-4 print:block">
          <p className="font-display text-2xl font-semibold tracking-[-0.01em]">Seller Net Sheet</p>
          <p className="mt-1 text-sm text-muted-foreground">Prepared by Lucas Murphy, eXp Realty &middot; (414) 458-1952 &middot; lucas.murphy@exprealty.com</p>
        </div>

        <div className="sns-card grid rounded-sm bg-card shadow-[0_40px_90px_-45px_hsl(216_52%_11%/0.45)] ring-1 ring-border/70 lg:grid-cols-2">
          {/* Inputs */}
          <div className="p-8 sm:p-10 lg:p-12">
            <h2 className="font-display text-2xl font-medium tracking-[-0.01em]">Your numbers</h2>
            <div className="mt-8 space-y-6">
              <div className="relative hover:z-30">
                <label htmlFor="price" className={labelCls}>
                  Estimated sale price
                  <InfoTip text="What you expect the home to sell for. Use a recent comparable sale or my CMA. If you're not sure, start with your home's current market value." />
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <MoneyInput id="price" value={salePrice} onChange={setSalePrice} className={`${fieldCls} pl-7`} />
                </div>
              </div>

              <div className="relative hover:z-30">
                <label htmlFor="mortgage" className={labelCls}>
                  Remaining mortgage balance
                  <InfoTip text="The remaining payoff on your loan(s). Check your latest mortgage statement, or call your lender for an exact payoff. Include any second mortgage or HELOC." />
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <MoneyInput id="mortgage" value={mortgage} onChange={setMortgage} className={`${fieldCls} pl-7`} />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="relative hover:z-30">
                  <label htmlFor="closingDate" className={labelCls}>
                    Closing date
                    <InfoTip text="The day the sale funds and records. It's used to split property taxes (and a few days of loan interest) fairly between you and the buyer. No date yet? Estimate 30 to 45 days out." />
                  </label>
                  <input id="closingDate" type="date" value={closingDate} onChange={(e) => setClosingDate(e.target.value)} className={fieldCls} />
                </div>
                <div className="relative hover:z-30">
                  <label htmlFor="rate" className={labelCls}>
                    Mortgage interest rate (%)
                    <InfoTip text="Your loan's rate, from your mortgage statement. It estimates the few days of interest that accrue on your payoff between your last payment and closing, so it only matters once you set a closing date. Recent loans are often 6 to 7%; older ones 3 to 4%." />
                  </label>
                  <input id="rate" type="number" min={0} step={0.125} value={rate} onChange={(e) => setRate(+e.target.value)} className={fieldCls} />
                </div>
              </div>

              <div className="relative hover:z-30">
                <label htmlFor="tax" className={labelCls}>
                  Annual property taxes
                  <InfoTip text="Your full-year property tax bill, on your tax bill or your county's online property records. In Metro Milwaukee this runs roughly 1.5 to 2.5% of value. As the seller you credit the buyer for taxes from Jan 1 to your closing date (Wisconsin pays in arrears)." />
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <MoneyInput id="tax" value={annualTax} onChange={setAnnualTax} className={`${fieldCls} pl-7`} />
                </div>
              </div>

              <div className="relative hover:z-30">
                <label htmlFor="commission" className={labelCls}>
                  Agent commission &mdash; <span className="ml-1 text-accent">{commissionPct}%</span>
                  <InfoTip text="Total real estate commission, usually split between the listing and buyer's agents. 5 to 6% is common and it's negotiable." />
                </label>
                <input id="commission" type="range" min={0} max={7} step={0.1} value={commissionPct}
                  onChange={(e) => setCommissionPct(+e.target.value)} className="w-full accent-[hsl(44_96%_50%)]" />
              </div>

              <div className="relative hover:z-30">
                <label htmlFor="closing" className={labelCls}>
                  Seller closing costs &mdash; <span className="ml-1 text-accent">{closingPct}%</span>
                  <InfoTip text="Title insurance, settlement/closing fee, recording, and any attorney or escrow charges. In Wisconsin this is often around 1% of the price. The state transfer fee ($3 per $1,000) is added separately." />
                </label>
                <input id="closing" type="range" min={0} max={3} step={0.1} value={closingPct}
                  onChange={(e) => setClosingPct(+e.target.value)} className="w-full accent-[hsl(44_96%_50%)]" />
              </div>

              <div className="relative hover:z-30">
                <label htmlFor="extras" className={labelCls}>
                  Repairs &amp; concessions
                  <InfoTip text="Anything you've agreed to credit the buyer: repair credits, a home warranty, or help toward their closing costs. Leave at 0 if none." />
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <MoneyInput id="extras" value={extras} onChange={setExtras} className={`${fieldCls} pl-7`} />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col bg-[#0a1424] p-8 text-white/80 sm:p-10 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Estimated net proceeds</p>
            <p className="mt-3 font-display text-5xl font-semibold tracking-[-0.02em] text-white">{usd(net)}</p>

            {/* Donut: where the sale price goes */}
            <div className="relative mt-6 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={72} outerRadius={98} paddingAngle={1} stroke="none">
                    {pieData.map((d) => (
                      <Cell key={d.key} fill={d.color} />
                    ))}
                  </Pie>
                  <RTooltip
                    formatter={(v: number, n: string) => [usd(v), n]}
                    contentStyle={{ background: "#0a1424", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 2, fontSize: 12 }}
                    itemStyle={{ color: "#fff" }}
                    labelStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Net to you</span>
                <span className="font-display text-2xl font-semibold text-accent">{usd(net)}</span>
                <span className="text-[10px] text-white/40">of {usd(salePrice)}</span>
              </div>
            </div>

            {/* Line items / legend */}
            <div className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-white/65">Sale price</span>
                <span className="font-semibold text-white">{usd(salePrice)}</span>
              </div>
              {segments.filter((s) => s.key !== "net").map((s) => (
                <div key={s.key} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-white/65">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
                    {s.label}
                  </span>
                  <span className="tabular-nums text-white/85">{s.value > 0 ? `-${usd(s.value)}` : usd(0)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-base">
                <span className="flex items-center gap-2 font-semibold text-white">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" /> Your estimated net
                </span>
                <span className="font-display text-xl font-semibold text-accent">{usd(net)}</span>
              </div>
            </div>

            {!closingDate && (
              <p className="mt-4 rounded-sm border border-accent/30 bg-accent/[0.08] p-3 text-xs leading-relaxed text-white/70">
                Set a <strong className="text-white">closing date</strong> to include property-tax and loan-interest proration. Until then those lines stay at $0.
              </p>
            )}

            <p className="sns-no-print mt-4 text-xs leading-relaxed text-white/45">
              An estimate for planning only. Actual proceeds depend on your exact payoff, tax proration, and final
              negotiated terms. I'll prepare a precise net sheet for your specific situation.
            </p>
            <div className="sns-no-print mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-sm border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10">
                <Printer className="h-4 w-4" /> Print
              </button>
              <Link to="/preview/v1/contact"
                className="inline-flex items-center gap-2 rounded-sm border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10">
                <MessageSquare className="h-4 w-4" /> Ask a question
              </Link>
            </div>
          </div>
        </div>

        {/* Precise net sheet CTA */}
        <div className="sns-no-print mt-6 rounded-sm border border-accent/30 bg-accent/[0.06] p-8 text-center sm:p-10">
          <h2 className="font-display text-2xl font-medium tracking-[-0.02em]">Want a number you can really plan around?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            This estimate gets you in the ballpark, but a realistic net sheet starts with a conversation. A listing
            consultation lets us talk through your goals and timeline and pair this with a true CMA, what your home is
            actually worth in today's market. Those are the pieces that dial the number in.
          </p>
          <a href={CALENDLY} target="_blank" rel="noreferrer"
            className="group mt-6 inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5">
            <Calendar className="h-4 w-4" /> Get a precise net sheet, schedule a listing consultation
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <p className="mt-3 text-xs text-muted-foreground">No obligation. Booking a consultation doesn't commit you to working with me.</p>
        </div>

        {/* Print-only footer disclaimer */}
        <div className="mt-6 hidden border-t border-border pt-4 print:block">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            This seller net sheet is an estimate for planning purposes only and is not a guarantee or an offer. Actual
            proceeds depend on your exact loan payoff, tax proration, and the final negotiated terms of your sale.
            Prepared by Lucas Murphy, eXp Realty.
          </p>
        </div>
      </section>

      <PreviewFooter />
    </div>
  );
}
