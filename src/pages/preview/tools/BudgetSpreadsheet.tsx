import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, Download, MessageSquare, Play, Table2 } from "lucide-react";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import Seo from "@/components/seo/Seo";

/**
 * TODO(Lucas): drop in the real assets, then this page is finished.
 *  - SHEET_COPY_URL: your Google Sheet's "make a copy" link.
 *      Open the sheet → copy its URL → replace the trailing "/edit..." with "/copy".
 *      e.g. https://docs.google.com/spreadsheets/d/1AbCxyz.../copy
 *  - XLSX_URL: a direct download link to the .xlsx (e.g. /downloads/lucas-budget.xlsx in /public, or a Drive link).
 *  - VIDEO_EMBED_URL: the YouTube *embed* URL, e.g. https://www.youtube.com/embed/XXXXXXXXXXX
 */
const SHEET_COPY_URL = "#"; // ← replace
const XLSX_URL = "#"; // ← replace
const VIDEO_EMBED_URL = ""; // ← replace (leave empty to show the placeholder)

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0
  );

const cardCls = "rounded-sm border border-border bg-card p-6 shadow-[0_18px_44px_-32px_hsl(216_52%_11%/0.4)] sm:p-8";

// Illustrative sample only — shows how the sheet is laid out, not anyone's real numbers.
const SAMPLE = [
  { group: "Fixed costs", rows: [
    { label: "Housing (mortgage / rent)", monthly: 1800 },
    { label: "Utilities (gas, electric, water)", monthly: 260 },
    { label: "Internet & phone", monthly: 150 },
    { label: "Insurance (auto, home, life)", monthly: 320 },
    { label: "Groceries", monthly: 650 },
    { label: "Transportation (fuel, upkeep)", monthly: 300 },
    { label: "Debt payments", monthly: 350 },
    { label: "Subscriptions", monthly: 60 },
  ] },
  { group: "Lifestyle (guilt-free)", rows: [
    { label: "Dining & entertainment", monthly: 450 },
    { label: "Shopping, hobbies, gifts", monthly: 250 },
    { label: "Travel (annual trip, averaged)", monthly: 200 },
  ] },
  { group: "Savings & investing", rows: [
    { label: "Down payment / emergency fund", monthly: 600 },
    { label: "Retirement (Roth, 401k)", monthly: 400 },
  ] },
];

export default function BudgetSpreadsheet() {
  const SAMPLE_INCOME = 7100; // example monthly take-home (net)
  const sampleTotal = SAMPLE.flatMap((g) => g.rows).reduce((a, r) => a + r.monthly, 0);
  const sampleLeft = SAMPLE_INCOME - sampleTotal;
  const groupTotal = (name: string) => SAMPLE.find((g) => g.group === name)?.rows.reduce((a, r) => a + r.monthly, 0) ?? 0;
  const fixedT = groupTotal("Fixed costs");
  const lifeT = groupTotal("Lifestyle (guilt-free)");
  const saveT = groupTotal("Savings & investing");
  // Translate take-home back to a rough gross salary (~25% goes to taxes), rounded to the nearest $1k.
  const SAMPLE_GROSS_ANNUAL = Math.round((SAMPLE_INCOME * 12) / 0.75 / 1000) * 1000;

  return (
    <div className="preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <Seo
        title="My Budget Spreadsheet & How It Works | Metro Milwaukee | Lucas Murphy"
        description="See exactly how my homebuying budget works, monthly costs side by side with their yearly averages, a quick walkthrough video, and a free copy to download and use."
        canonicalPath="/preview/v1/tools/budget-spreadsheet"
        noindex
      />
      <PreviewHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a1424] pt-28 pb-16 text-white lg:pt-36 lg:pb-20">
        <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
            <Table2 className="h-4 w-4" /> My budget spreadsheet
          </p>
          <h1 className="mt-4 font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] sm:text-5xl">
            The budget I actually use, and how it works
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            A real budget isn't a one-time calculation, it's something you keep. Here's how mine is built, with every
            cost shown monthly and as a yearly average, a quick walkthrough, and a free copy you can make your own.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl space-y-12 px-6 py-16 lg:px-10 lg:py-20">
        {/* How it works */}
        <div>
          <h2 className="font-display text-2xl font-medium tracking-[-0.02em] sm:text-3xl">How my budget works</h2>
          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              I sort every dollar into three buckets: <strong className="text-foreground">fixed costs</strong> (the bills
              that show up no matter what), <strong className="text-foreground">lifestyle</strong> (the guilt-free
              spending that makes life enjoyable), and <strong className="text-foreground">savings &amp; investing</strong>
              (what builds your future). What's left after fixed costs gets split between the last two, on purpose.
            </p>
            <p>
              The trick most people miss is thinking <strong className="text-foreground">annually, then dividing by twelve</strong>.
              A once-a-year trip that costs $2,400 isn't a $0 month, it's $200 a month you should be setting aside. The same
              goes for car registration, gifts, and insurance that bills once or twice a year. Average them out and your
              monthly number finally tells the truth.
            </p>
            <p>
              Do that across the board and you land on the one number that matters: a monthly home payment you can carry
              comfortably, with room left for everything else.
            </p>
          </div>
        </div>

        {/* Monthly ↔ yearly side by side */}
        <div className={cardCls}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold">Monthly cost, with the yearly average beside it</h2>
              <p className="mt-1 text-xs text-muted-foreground">An example layout to show the structure, not real numbers. Your copy is yours to fill in.</p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-muted-foreground">Example</span>
          </div>

          {/* Income reference up top */}
          <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 rounded-sm border border-accent/30 bg-accent/[0.06] px-4 py-3">
            <span className="text-sm font-semibold text-foreground">Example take-home income</span>
            <span className="text-sm">
              <strong className="font-display text-lg text-foreground">{usd(SAMPLE_INCOME)}/mo</strong>
              <span className="ml-2 text-muted-foreground">≈ {usd(SAMPLE_GROSS_ANNUAL)}/yr salary before taxes</span>
            </span>
          </div>

          <div className="mt-3 overflow-hidden rounded-sm border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/60 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-2.5 font-semibold">Category</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Monthly</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Yearly (×12)</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE.map((g) => {
                  const groupMonthly = g.rows.reduce((a, r) => a + r.monthly, 0);
                  return (
                    <Fragment key={g.group}>
                      <tr className="border-t border-border bg-accent/[0.05]">
                        <td colSpan={3} className="px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-accent">{g.group}</td>
                      </tr>
                      {g.rows.map((r) => (
                        <tr key={r.label} className="border-t border-border">
                          <td className="px-4 py-2.5 text-foreground/80">{r.label}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums">{usd(r.monthly)}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{usd(r.monthly * 12)}</td>
                        </tr>
                      ))}
                      <tr className="border-t border-border bg-secondary/30 font-semibold">
                        <td className="px-4 py-2.5">Total {g.group.toLowerCase()}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums">{usd(groupMonthly)}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{usd(groupMonthly * 12)}</td>
                      </tr>
                    </Fragment>
                  );
                })}
                <tr className="border-t-2 border-accent/40 bg-secondary/40 font-semibold">
                  <td className="px-4 py-2.5">Take-home income</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{usd(SAMPLE_INCOME)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{usd(SAMPLE_INCOME * 12)}</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">− Fixed costs</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">−{usd(fixedT)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">−{usd(fixedT * 12)}</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">− Lifestyle</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">−{usd(lifeT)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">−{usd(lifeT * 12)}</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">− Savings &amp; investing</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">−{usd(saveT)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">−{usd(saveT * 12)}</td>
                </tr>
                <tr className="border-t-2 border-accent/40 bg-accent/[0.07] font-semibold">
                  <td className="px-4 py-3">= Left over each month</td>
                  <td className={`px-4 py-3 text-right font-display text-base font-bold tabular-nums ${sampleLeft >= 0 ? "text-accent" : "text-red-500"}`}>{usd(sampleLeft)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{usd(sampleLeft * 12)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 rounded-sm bg-secondary/50 p-4 text-xs leading-relaxed text-muted-foreground">
            That <strong className="text-foreground">left over each month</strong> is what you can put toward a higher
            house payment. If there's nothing left over (or you want to spend more on a home than you have room for),
            the money has to come from somewhere, cutting back on <strong className="text-foreground">fixed expenses</strong>,
            <strong className="text-foreground"> guilt-free spending</strong>, or <strong className="text-foreground">savings &amp; investing</strong>,
            or some combination of the three.
          </p>
        </div>

        {/* Video walkthrough */}
        <div>
          <h2 className="font-display text-2xl font-medium tracking-[-0.02em] sm:text-3xl">Watch me walk through it</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">A few minutes on how I set it up and how to make it your own.</p>
          <div className="mt-5 aspect-video w-full overflow-hidden rounded-sm border border-border bg-[#0a1424]">
            {VIDEO_EMBED_URL ? (
              <iframe
                src={VIDEO_EMBED_URL}
                title="How my budget spreadsheet works"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-white/60">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Play className="h-6 w-6" />
                </span>
                <p className="text-sm">Walkthrough video coming soon</p>
              </div>
            )}
          </div>
        </div>

        {/* Download / make a copy */}
        <div className="rounded-sm border-2 border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold">Make it yours</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Grab your own copy and start tracking. I'd suggest filling it in over one to three months so you're working
            from real numbers, then bring those into the affordability tool.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {["Pre-built categories and yearly-average formulas", "Edits save automatically in your own Google account", "Use it on your phone or computer, anytime"].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-foreground/80"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {t}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={SHEET_COPY_URL}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <Copy className="h-4 w-4" /> Make a copy (Google Sheets)
            </a>
            <a
              href={XLSX_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-sm border border-accent/50 px-6 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
            >
              <Download className="h-4 w-4" /> Download for Excel
            </a>
          </div>
        </div>

        {/* Funnel */}
        <div className="flex flex-col items-start gap-4 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">Got your numbers down?</h3>
            <p className="mt-1 text-sm text-muted-foreground">Turn them into a comfortable home payment and price range.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/preview/v1/tools/budget-planner/in-depth" className="group inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5">
              How much home can you afford? <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link to="/preview/v1/contact" className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent">
              <MessageSquare className="h-4 w-4" /> Ask a question
            </Link>
          </div>
        </div>
      </section>

      <PreviewFooter />
    </div>
  );
}
