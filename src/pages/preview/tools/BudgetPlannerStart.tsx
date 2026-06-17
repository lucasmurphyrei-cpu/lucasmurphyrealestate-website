import { Link } from "react-router-dom";
import { ArrowRight, Check, Clock, Gauge, Home, Target } from "lucide-react";
import PreviewHeader from "@/pages/preview/_shared/PreviewHeader";
import PreviewFooter from "@/pages/preview/_shared/PreviewFooter";
import Seo from "@/components/seo/Seo";

const cardCls =
  "group relative flex flex-col rounded-sm border border-border bg-card p-7 shadow-[0_18px_44px_-30px_hsl(216_52%_11%/0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_30px_60px_-30px_hsl(216_52%_11%/0.5)] sm:p-9";

export default function BudgetPlannerStart() {
  return (
    <div className="preview-v1 min-h-screen bg-background font-body text-foreground antialiased">
      <Seo
        title="How Much Home Can You Afford? | Metro Milwaukee | Lucas Murphy"
        description="Two ways to find out how much home you can afford: a quick ballpark estimate, or an in-depth walkthrough that builds your real budget into a true comfortable monthly payment range."
        canonicalPath="/preview/v1/tools/budget-planner"
        noindex
      />
      <PreviewHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a1424] pt-28 pb-16 text-white lg:pt-36 lg:pb-20">
        <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <p className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
            <Home className="h-4 w-4" /> Affordability
          </p>
          <h1 className="mt-4 font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] sm:text-5xl">
            How much home can you afford?
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            There are two ways to find out. Grab a fast ballpark in a couple of minutes, or go deep and walk away
            with a true comfortable monthly payment range you can take house hunting.
          </p>
        </div>
      </section>

      {/* Choices */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick */}
          <div className={cardCls}>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/12 text-accent">
              <Gauge className="h-6 w-6" />
            </span>
            <div className="mt-5 flex items-center gap-2">
              <h2 className="font-display text-2xl font-semibold tracking-[-0.01em]">Quick estimate</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"><Clock className="h-3 w-3" /> ~2 min</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A fast ballpark using your income, debts, and down payment. Perfect when you just want a number to
              start the conversation.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {["No budget required", "Income, debts, down payment, rate", "Instant home price + monthly payment"].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-foreground/80">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {t}
                </li>
              ))}
            </ul>
            <Link
              to="/preview/v1/tools/budget-planner/quick"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-accent/50 px-6 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              Start the quick estimate <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* In-depth */}
          <div className={`${cardCls} !border-accent/40 ring-1 ring-accent/20`}>
            <span className="absolute right-5 top-5 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-foreground">Most accurate</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/12 text-accent">
              <Target className="h-6 w-6" />
            </span>
            <div className="mt-5 flex items-center gap-2">
              <h2 className="font-display text-2xl font-semibold tracking-[-0.01em]">In-depth &amp; accurate</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"><Clock className="h-3 w-3" /> ~10-15 min</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A guided, four-step walkthrough that builds your real budget into a <strong className="text-foreground">true comfortable monthly payment range</strong>, the single most important number before you tour a home.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {[
                "Works from your actual spending and savings",
                "Finds the payment that won't leave you house poor",
                "No budget yet? It walks you through building one, and hands you mine",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-foreground/80">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {t}
                </li>
              ))}
            </ul>
            <Link
              to="/preview/v1/tools/budget-planner/in-depth"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_14px_30px_-12px_hsl(44_96%_50%/0.75)] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              Start the in-depth version <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Want to prep first?{" "}
              <Link to="/preview/v1/tools/budget-spreadsheet" className="font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-2 transition-colors hover:text-accent">
                Grab my budget spreadsheet
              </Link>
            </p>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          Not sure which to pick? Start quick for a gut check, then come back and run the in-depth version when you're
          getting serious about looking, that's the number you'll actually shop with.
        </p>
      </section>

      <PreviewFooter />
    </div>
  );
}
