import GuidePageTemplate from "@/components/GuidePageTemplate";
import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";

const HouseHacking = () => (
  <GuidePageTemplate
    title="House Hacking Guide"
    subtitle="How I turned $18,368 into $89,000 in equity — while paying less than my friends pay in rent."
    metaDescription="Learn how house hacking works with a real duplex example. Compare house hacking vs renting vs buying, see the CLADE wealth-building framework, and run your own numbers."
    canonicalPath="/guides/house-hacking"
  >
    {/* ── Section 1: What Is House Hacking? ── */}
    <h2>What Is House Hacking?</h2>
    <p>
      House hacking is simple: buy a small multi-family property — a duplex, triplex, or fourplex — live in one unit, and rent out the others. Your tenants cover most or all of your mortgage payment.
    </p>
    <p>
      You need a place to live anyway. House hacking turns your housing from an expense into an asset that pays you back every single month.
    </p>

    {/* ── Section 2: Who Is House Hacking For? ── */}
    <h2>Who Is House Hacking For?</h2>
    <ul>
      <li>
        <strong>Renters tired of paying someone else's mortgage.</strong> If you're spending $1,000–$1,500/month on rent with nothing to show for it, house hacking lets you build equity for less than what you're already paying.
      </li>
      <li>
        <strong>First-time buyers who want housing to work for them, not against them.</strong> House hacking means your mortgage can cost less than your current rent. That buys back time-freedom — the ability to take a job you love instead of one that just covers the bills, to travel, to put money toward life instead of housing. All while getting every benefit of homeownership.
      </li>
      <li>
        <strong>Future investors looking for the lowest-risk way in.</strong> Owner-occupied financing means lower down payments (as low as 3.5–5%), better interest rates, and a property you can manage hands-on before scaling.
      </li>
    </ul>
    <p>
      You don't need to be rich, experienced, or handy. You just need a plan — and a willingness to live next door to your tenant for a couple of years.
    </p>

    {/* ── Section 3: My Real Duplex Example ── */}
    <h2>How It Works: My Real Duplex</h2>
    <p>
      I didn't just study house hacking — I did it. Here are my actual numbers:
    </p>

    <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-border bg-secondary/40 p-6">
        <h3 className="mb-3 font-display text-lg font-semibold text-foreground">Purchase Details</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex justify-between"><span>List Price</span><span className="font-medium text-foreground">$215,000</span></li>
          <li className="flex justify-between"><span>Purchase Price</span><span className="font-medium text-foreground">$234,000</span></li>
          <li className="flex justify-between"><span>Down Payment (5%)</span><span className="font-medium text-foreground">$11,750</span></li>
          <li className="flex justify-between"><span>Total Out of Pocket</span><span className="font-medium text-foreground">$18,368</span></li>
          <li className="flex justify-between"><span>Renovation Costs</span><span className="font-medium text-foreground">$21,000</span></li>
          <li className="flex justify-between"><span>Interest Rate</span><span className="font-medium text-foreground">6.0%</span></li>
        </ul>
      </div>
      <div className="rounded-lg border border-border bg-secondary/40 p-6">
        <h3 className="mb-3 font-display text-lg font-semibold text-foreground">Monthly Breakdown</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex justify-between"><span>PITI (Mortgage)</span><span className="font-medium text-foreground">$1,890/mo</span></li>
          <li className="flex justify-between"><span>Upper Unit Rent</span><span className="font-medium text-foreground">$1,100/mo</span></li>
          <li className="flex justify-between border-t border-border pt-2"><span className="font-medium text-foreground">My Effective Cost</span><span className="font-medium text-primary">$790/mo</span></li>
          <li className="flex justify-between"><span>What Rent Would Cost</span><span className="font-medium text-foreground">$1,400/mo</span></li>
          <li className="flex justify-between border-t border-border pt-2"><span className="font-medium text-foreground">Monthly Savings vs Rent</span><span className="font-medium text-primary">$610/mo</span></li>
        </ul>
      </div>
    </div>

    <p>
      I bought a vacant duplex, renovated the upper unit, moved into the lower unit, and rented the upper for $1,100/month. My effective housing cost dropped to $790/month — $610 less than renting, and I'm building equity every month.
    </p>
    <p>
      <strong>After move-out:</strong> Both units rented (upper $1,200 + lower $1,500) = $2,700/month income against a $2,000/month mortgage. That's roughly $425/month net cash flow after reserves.
    </p>
    <p>
      Want to see what your numbers could look like?{" "}
      <Link to="/tools/house-hack-calculator">Run your own analysis with our free House Hack Calculator.</Link>
    </p>

    {/* ── Section 4: House Hacking vs. Renting vs. Buying ── */}
    <h2>House Hacking vs. Renting vs. Buying</h2>

    <div className="not-prose my-8 grid gap-4 sm:grid-cols-3">
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6">
        <h3 className="mb-1 font-display text-lg font-semibold text-foreground">Renting</h3>
        <p className="mb-3 text-xs uppercase tracking-wider text-red-400">$0 wealth built</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>$1,400/mo ($16,800/yr)</li>
          <li>Rent increases every year</li>
          <li>Zero equity, zero ownership</li>
          <li>Flexibility to move</li>
        </ul>
      </div>
      <div className="rounded-lg border border-border bg-secondary/40 p-6">
        <h3 className="mb-1 font-display text-lg font-semibold text-foreground">Single-Family Home</h3>
        <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Full payment, no offset</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>~$1,890/mo full mortgage</li>
          <li>Building equity over time</li>
          <li>No rental income to help</li>
          <li>$1,100/mo more than house hacking</li>
        </ul>
      </div>
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-6">
        <h3 className="mb-1 font-display text-lg font-semibold text-foreground">House Hacking</h3>
        <p className="mb-3 text-xs uppercase tracking-wider text-primary">Best of both worlds</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>$790/mo effective cost ($9,480/yr)</li>
          <li>Save $610/mo vs renting</li>
          <li>Save $1,100/mo vs a SFH</li>
          <li>$89K equity built in 3 years</li>
          <li>Own a rental property when you move out</li>
        </ul>
      </div>
    </div>

    {/* ── Section 5: CLADE Framework ── */}
    <h2>5 Ways a House Hack Builds Wealth</h2>
    <p>
      Monthly savings are just the beginning. A house hack builds wealth through five channels simultaneously — I call it the <strong>CLADE framework</strong>:
    </p>

    <div className="not-prose my-8 space-y-4">
      <div className="rounded-lg border border-border bg-secondary/40 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">C</span>
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">Cash Flow</h3>
            <p className="mt-1 text-sm text-muted-foreground">~$425/mo net after move-out ($2,700 rent − $2,000 mortgage − $275 reserves). That's $5,100/year in passive income.</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-secondary/40 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">L</span>
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">Leverage</h3>
            <p className="mt-1 text-sm text-muted-foreground">$18,368 out of pocket controls a $300,000+ asset. That's 16x leverage — the kind of return multiplier you can't get in the stock market.</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-secondary/40 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">A</span>
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">Appreciation</h3>
            <p className="mt-1 text-sm text-muted-foreground">~$15,000/year at 5% growth ($1,250/month added to your net worth). My property went from $234K to $300K in about 3 years.</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-secondary/40 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">D</span>
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">Depreciation</h3>
            <p className="mt-1 text-sm text-muted-foreground">Tax benefits on the rental portion — deduct mortgage interest, property depreciation, and operating expenses. Real estate is one of the most tax-advantaged investments available.</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-secondary/40 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">E</span>
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">Equity (Amortization)</h3>
            <p className="mt-1 text-sm text-muted-foreground">Tenants pay down ~$255/month (~$3,060/year) of your mortgage principal. Every payment your tenant makes increases your ownership stake.</p>
          </div>
        </div>
      </div>
    </div>

    <div className="not-prose my-8 rounded-lg border border-primary/30 bg-primary/5 p-6 text-center">
      <p className="text-lg font-medium text-foreground">
        "In 3 years, I turned $18,368 into $89,000 in equity — while paying less than my friends pay in rent."
      </p>
      <p className="mt-2 text-sm text-muted-foreground">$48,632 gained beyond my initial investment.</p>
    </div>

    {/* ── Section 6: How to Get Started ── */}
    <h2>How to Get Started</h2>
    <ol>
      <li>
        <strong>Get pre-approved.</strong> FHA (3.5% down), conventional 5% down (what I did — and in my opinion the ideal route), or VA (0% down for veterans). All work for owner-occupied multi-family up to 4 units.
      </li>
      <li>
        <strong>Find an investor-friendly Realtor.</strong> You need an agent who understands rental income, cash flow analysis, and can spot a deal that makes financial sense — not just looks nice.{" "}
        <Link to="/contact">That's what I do.</Link>
      </li>
      <li>
        <strong>Find the right duplex.</strong> Location, condition, and rental income potential are the three pillars. A great deal on paper means nothing if the area doesn't attract reliable tenants.
      </li>
      <li>
        <strong>Run the numbers.</strong> Use our{" "}
        <Link to="/tools/house-hack-calculator">House Hack Calculator</Link>{" "}
        to analyze purchase price, financing, rental income, and expenses before you make an offer.
      </li>
      <li>
        <strong>Make an offer and close.</strong> With pre-approval and solid numbers, you can move confidently.
      </li>
      <li>
        <strong>Move in, rent the other unit, and start building wealth.</strong> Congratulations — you're a homeowner and an investor.
      </li>
    </ol>

    {/* ── Section 7: Common Questions ── */}
    <h2>Common Questions</h2>
    <p>
      <strong>"Do I have to be a landlord?"</strong><br />
      Yes — but it's more manageable than you think. You live right next door, so issues get handled quickly. If self-managing isn't for you, hiring a property manager typically costs 8–10% of collected rent.
    </p>
    <p>
      <strong>"What if I can't find a tenant?"</strong><br />
      Most markets have strong rental demand and low vacancy rates. Price your unit at market rate, keep it in good condition, and you'll fill it.
    </p>
    <p>
      <strong>"What about maintenance costs?"</strong><br />
      Budget 5–10% of rent for routine maintenance. Our{" "}
      <Link to="/tools/house-hack-calculator">calculator</Link> includes this in the expense breakdown so you can plan ahead.
    </p>
    <p>
      <strong>"What about major expenses like HVAC, water heaters, or a roof?"</strong><br />
      This is why reserves matter. I saved the $610/month difference between what I would have paid in rent and my actual housing cost. That built a 6-month reserve fund specifically for big-ticket repairs. When something breaks — and it will — you're prepared.
    </p>

    {/* ── Section 8: Gamma Slide Deck ── */}
    <h2>Free Visual Guide: House Hacking 101</h2>
    <p>
      Want the full breakdown in a visual, shareable format? Check out our House Hacking 101 presentation — the same numbers and framework from this guide, designed for easy reference.
    </p>
    <div className="not-prose my-8">
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-border">
        <iframe
          src="https://gamma.app/embed/l1q0s2em3q4x5om"
          className="h-full w-full"
          style={{ border: "none" }}
          title="House Hacking 101 Presentation"
          allow="fullscreen"
        />
      </div>
    </div>

    {/* ── Section 9: Calculator CTA ── */}
    <div className="not-prose my-10 rounded-lg border border-primary/30 bg-primary/5 p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
        <Calculator className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-display text-2xl font-bold text-foreground">Run Your Own Numbers</h3>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">
        Use our free House Hack Calculator to analyze any duplex, triplex, or fourplex. Plug in the numbers and see your potential cash flow, savings, and returns.
      </p>
      <Link
        to="/tools/house-hack-calculator"
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Calculator className="h-4 w-4" />
        Open House Hack Calculator
      </Link>
    </div>
  </GuidePageTemplate>
);

export default HouseHacking;
