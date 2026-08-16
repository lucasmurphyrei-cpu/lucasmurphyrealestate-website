import GuidePageTemplate from "@/components/GuidePageTemplate";
import GuideDownloadCallout from "@/components/GuideDownloadCallout";

const FirstTimeHomeBuyers = () => (
  <GuidePageTemplate
    title="Your First-Time Home Buyer Guide to Milwaukee Metro"
    subtitle="Making smart, informed decisions in Milwaukee, Ozaukee, Washington and Waukesha counties."
    metaDescription="A free first-time home buyer guide for Metro Milwaukee — what you can afford, how much cash you need, down payment assistance, the buying process, and current county market data."
    canonicalPath="/guides/first-time-home-buyers"
  >
    <GuideDownloadCallout
      href="/Your_First_Time_Home_Buyers_Guide_to_The_Milwaukee_Metro_Area.pdf"
      description="Nineteen pages, with August 2026 market data for all four counties."
    />

    <h2>The market right now</h2>
    <p>
      As of August 2026, the median sale price is <strong>$325,000</strong> in Milwaukee County,
      <strong> $525,000</strong> in Waukesha and Ozaukee, and <strong>$481,000</strong> in Washington
      County. Every county is selling above asking and inside two weeks, but inventory has loosened —
      Milwaukee is up 22% year over year — so there is more to choose from than there was a year ago.
    </p>

    <h2>How much cash you actually need</h2>
    <p>
      The biggest myth is that you need 20% down. Most first-time buyers put down 3–5%, and VA and
      USDA loans require nothing at all. Against the current Milwaukee County median, 3% down is
      $9,750 and 5% is $16,250, with closing costs typically adding another 2–4% on top. Buying below
      the median — which most first-time buyers do — brings all of that down.
    </p>

    <h2>Down payment assistance</h2>
    <p>
      WHEDA runs several assistance programs, and Milwaukee, Waukesha County and West Allis each have
      their own. Terms and availability change through the year, so it is worth checking what is open
      before you assume anything is off the table.
    </p>

    <h2>What the guide covers</h2>
    <ul>
      <li>Debt-to-income limits by loan program, and what lenders do and don't count</li>
      <li>Conventional, FHA, VA, USDA and WHEDA compared side by side</li>
      <li>The ten-step process from consultation to keys, with realistic timings</li>
      <li>Inspection and appraisal contingencies, and what each one actually protects</li>
      <li>Where first-time buyers are buying, with current medians by municipality</li>
      <li>Common inspection findings in Southeast Wisconsin, with cost ranges</li>
      <li>The full cost of ownership beyond the mortgage payment</li>
    </ul>

    <p>
      Market figures are RapidStats, August 2026, and move monthly. Ask me for a current read before
      relying on them.
    </p>
  </GuidePageTemplate>
);

export default FirstTimeHomeBuyers;
