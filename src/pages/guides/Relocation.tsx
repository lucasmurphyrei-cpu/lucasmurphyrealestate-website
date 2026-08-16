import GuidePageTemplate from "@/components/GuidePageTemplate";
import GuideDownloadCallout from "@/components/GuideDownloadCallout";

const Relocation = () => (
  <GuidePageTemplate
    title="Move to Milwaukee"
    subtitle="Your step-by-step resource for moving, living and buying a home in Metro Milwaukee."
    metaDescription="A free relocation guide for Metro Milwaukee — cost of living against Chicago, neighbourhoods, schools, the job market, and current housing data for buyers moving from out of state."
    canonicalPath="/guides/relocation"
  >
    <GuideDownloadCallout
      href="/Relocating_to_Metro_Milwaukee_Guide.pdf"
      description="Fourteen pages, with August 2026 market data and a Chicago cost-of-living comparison."
    />

    <h2>Why people move here</h2>
    <p>
      Milwaukee runs roughly <strong>27.8% cheaper</strong> than Chicago overall and <strong>47%
      cheaper</strong> on rent, with homes at $179 a square foot against Chicago's $338. A $400,000
      home here would cost around $700,000 there for comparable features and location. Redfin counted
      a net inflow of 1,762 people a year from Chicago alone.
    </p>

    <h2>Where to look</h2>
    <p>
      As of August 2026, Wauwatosa's median is <strong>$427,500</strong>, Shorewood
      <strong> $590,000</strong> and Brookfield <strong>$550,000</strong>. Bay View and the East Side
      sit inside the City of Milwaukee, whose median is <strong>$252,000</strong> — though pricing
      within the city varies widely by pocket, so ask me for a read on the specific area you're
      considering.
    </p>

    <h2>Buying from out of state</h2>
    <p>
      You do not need to be here to make progress. The guide sets out a six-step plan built for
      remote buyers — discovery call, neighbourhood match, video walkthroughs, offer and negotiation,
      inspection and closing, then help settling in once you arrive.
    </p>

    <h2>What the guide covers</h2>
    <ul>
      <li>A full Milwaukee-versus-Chicago cost of living breakdown</li>
      <li>Neighbourhood profiles with current medians and who each one suits</li>
      <li>Public districts and private school options</li>
      <li>Current housing market data for the City of Milwaukee</li>
      <li>The major employers across healthcare, technology, manufacturing and education</li>
      <li>Down payment assistance, tax benefits and utility setup</li>
      <li>A vetted local network — lenders, inspectors, title, movers and trades</li>
    </ul>

    <p>
      Market figures are RapidStats, August 2026, and move monthly. Ask me for a current read before
      relying on them.
    </p>
  </GuidePageTemplate>
);

export default Relocation;
