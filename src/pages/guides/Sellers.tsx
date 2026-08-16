import GuidePageTemplate from "@/components/GuidePageTemplate";
import { Download } from "lucide-react";

const Sellers = () => (
  <GuidePageTemplate
    title="What to Fix Before You List"
    subtitle="A seller's guide to what pays, what breaks even, and what to leave alone."
    metaDescription="Which pre-listing projects actually pay you back in Metro Milwaukee — cost-vs-value figures for Milwaukee specifically, what lenders require, and what Wisconsin's condition report means for repairs you choose not to make."
    canonicalPath="/guides/sellers"
  >
    {/* Download callout — same pattern as the seasonal maintenance guide. */}
    <div className="mb-12 flex flex-col items-start gap-4 rounded-sm border border-accent/30 bg-accent/[0.06] p-5 not-prose sm:flex-row sm:items-center sm:gap-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-accent/12 text-accent">
        <Download className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="font-display text-lg font-semibold">Download the full guide</p>
        <p className="text-sm text-muted-foreground">
          Twenty pages, including the Milwaukee cost-vs-value figures and the Wisconsin disclosure section.
        </p>
      </div>
      <a
        href="/What_to_Fix_Before_You_List_Seller_Guide.pdf"
        download
        className="group inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5"
      >
        <Download className="h-4 w-4" /> Download PDF
      </a>
    </div>

    <h2>Cost and value are two different things</h2>
    <p>
      What a project costs you is set by materials and labour. What it adds is set by what a buyer will pay for the
      finished house — and a buyer is not reimbursing your invoice. They are comparing your house to the one down the
      street. That gap is the whole subject of this guide.
    </p>

    <h2>Four groups, in this order</h2>
    <p>
      <strong>Fix it.</strong> The question is not what you get back, it is whether the sale closes at all. A roof with
      under two years of life left, defective paint on a pre-1978 home, no working heat, exposed wiring, a wet basement,
      non-functioning plumbing. These are lender and insurer requirements, not investment decisions.
    </p>
    <p>
      <strong>Cheap wins.</strong> Small money, disproportionate effect. Declutter, deep clean, paint, tidy the yard, get
      proper photographs. This is where the measurable return is concentrated, and most of it is measured in hundreds
      rather than thousands.
    </p>
    <p>
      <strong>Judgment calls.</strong> Roof, windows, flooring, a kitchen refresh. Genuinely depends on your house, your
      price band, and how fast the market is moving the week you list.
    </p>
    <p>
      <strong>Leave it.</strong> Big, expensive, taste-driven work that returns somewhere between a quarter and half of
      what it costs. Price it in instead. Most sellers reach straight for this group.
    </p>

    <h2>The most useful comparison in the guide</h2>
    <p>
      Take one 200-square-foot kitchen. Keep the cabinet boxes and replace the doors, drawer fronts, counters and
      hardware, and it recoups near or above what it cost. Gut the same room to new semi-custom cabinets and an island,
      and you spend roughly three times as much to recoup about half.
    </p>
    <p>Same kitchen. Same buyer. The refresh wins.</p>

    <h2>Five things you can do yourself</h2>
    <p>No contractor, no permit, no quotes:</p>
    <ul>
      <li>
        <strong>Paint</strong> — the thing agents name most often when asked what a seller should do first
      </li>
      <li>
        <strong>Declutter</strong> — the most common seller mistake, and the only one here that can cost nothing
      </li>
      <li>
        <strong>Deep clean</strong> — the second most common mistake
      </li>
      <li>
        <strong>Lawn and beds</strong> — basic lawn care returns more of its cost than anything the REALTORS®
        association has measured
      </li>
      <li>
        <strong>Light fixtures and hardware</strong> — dated fixtures date the room
      </li>
    </ul>

    <h2>Wisconsin: disclosure is required, repair is not</h2>
    <p>
      Chapter 709 requires you to disclose what you know. Nothing in it requires you to fix anything. The statute treats
      a disclosed-but-unrepaired defect as an ordinary outcome, which is what makes this an economic question rather
      than a fearful one.
    </p>
    <p>
      The guide covers the parts sellers most often get wrong: that a shortcut repair done without permits becomes a
      permanent written disclosure, that handing the completed report to a buyer before they write removes a
      walk-away right they would otherwise have, and that a pre-listing inspection creates knowledge you then have to
      disclose.
    </p>
    <p>
      Whether a particular item on your home counts as a defect is a question for you and your attorney — the condition
      report itself bars a real estate licensee from giving that opinion.
    </p>

    <p>
      <em>
        Cost and resale figures throughout are the Milwaukee market entries from the Remodeling / JLC Cost vs. Value
        report, which is restated annually and moves materially between editions — read them as an indication of which
        work tends to pay rather than a promise about any one house. General information for sellers; not legal, tax or
        engineering advice, and not an appraisal.
      </em>
    </p>
  </GuidePageTemplate>
);

export default Sellers;
