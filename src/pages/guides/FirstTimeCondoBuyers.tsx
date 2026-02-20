import GuidePageTemplate from "@/components/GuidePageTemplate";
import { Link } from "react-router-dom";

const FirstTimeCondoBuyers = () => (
  <GuidePageTemplate
    title="First-Time Condo Buyers Guide"
    subtitle="A complete walkthrough for purchasing your first condominium in the Milwaukee metro area."
  >
    <h2>Why Consider a Condo?</h2>
    <p>
      Condos offer an affordable entry point into homeownership, especially in desirable Milwaukee neighborhoods. Lower maintenance, shared amenities, and prime locations make condos ideal for young professionals, downsizers, and investors alike.
    </p>

    <h2>Understanding HOA Fees & Rules</h2>
    <p>
      Every condo comes with a Homeowners Association. HOA fees cover maintenance, insurance on common areas, and amenities. We'll help you review HOA financials, reserve funds, and rules so there are no surprises.
    </p>

    <h2>Condo vs. Townhouse vs. Single-Family</h2>
    <p>
      Not sure which is right for you? Condos typically offer the lowest maintenance burden, while townhouses provide more space and privacy. We'll walk you through the trade-offs based on your lifestyle and budget.
    </p>

    <h2>Financing a Condo</h2>
    <p>
      Condo financing has unique requirements. Not all buildings are FHA- or VA-approved, which affects your loan options. Our <Link to="/resources/lenders">trusted lenders</Link> specialize in condo financing and can guide you through the process.
    </p>

    <h2>What to Look for During Showings</h2>
    <ul>
      <li>Building condition — look at common areas, parking, and exterior</li>
      <li>Noise levels and neighbor proximity</li>
      <li>Storage space, laundry, and parking availability</li>
      <li>Pending assessments or special assessments</li>
    </ul>

    <h2>Milwaukee Condo Market Insights</h2>
    <p>
      From the historic Third Ward to the shores of Lake Michigan, Milwaukee's condo market offers incredible variety. Prices range from accessible starter units to luxury lakefront residences. We know which buildings hold value and which to avoid.
    </p>
  </GuidePageTemplate>
);

export default FirstTimeCondoBuyers;
