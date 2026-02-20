import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/landing/HeroSection";
import LearnSection from "@/components/landing/LearnSection";
import FearsSection from "@/components/landing/FearsSection";
import AuthoritySection from "@/components/landing/AuthoritySection";
import BonusSection from "@/components/landing/BonusSection";
import AudienceSection from "@/components/landing/AudienceSection";
import MarketDataSection from "@/components/landing/MarketDataSection";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import LandingFooter from "@/components/landing/Footer";
import StickyCTA from "@/components/landing/StickyCTA";

const FirstTimeHomeBuyersGuide = () => {
  return (
    <div className="landing-page font-sans">
      <Helmet>
        <title>Free First-Time Home Buyer Guide | Milwaukee Metro 2026 | Lucas Murphy Real Estate</title>
        <meta
          name="description"
          content="Download the complete 2026 first-time home buyer guide for Milwaukee, Waukesha, Ozaukee &amp; Washington County. Learn about down payment assistance, affordability, closing costs, and step-by-step buying timelines from a local Milwaukee Realtor."
        />
        <meta
          name="keywords"
          content="first time home buyer Milwaukee, Milwaukee home buyer guide, buying a house in Milwaukee, Milwaukee real estate, Waukesha County homes, Ozaukee County real estate, Washington County homes, down payment assistance Wisconsin, Milwaukee metro housing market 2026, first time buyer guide Wisconsin, Lucas Murphy realtor, eXp Realty Milwaukee"
        />
        <link rel="canonical" href="https://www.lucasmurphyrealestate.com/first-time-homebuyers-guide" />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Free First-Time Home Buyer Guide | Milwaukee Metro 2026" />
        <meta
          property="og:description"
          content="Everything you need to know before buying your first home in Milwaukee Metro — including down payment assistance, real affordability numbers, and local market insight."
        />
        <meta property="og:url" content="https://www.lucasmurphyrealestate.com/first-time-homebuyers-guide" />
        <meta property="og:site_name" content="Lucas Murphy Real Estate" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free First-Time Home Buyer Guide | Milwaukee Metro 2026" />
        <meta
          name="twitter:description"
          content="Download the complete first-time home buyer guide for Milwaukee Metro. Down payment assistance, affordability numbers, and local market insight."
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "The Complete First-Time Home Buyer Guide to Milwaukee Metro (2026 Edition)",
            description:
              "Everything you need to know before buying your first home in Milwaukee, Waukesha, Ozaukee, or Washington County — including down payment assistance, real affordability numbers, and local market insight.",
            author: {
              "@type": "RealEstateAgent",
              name: "Lucas Murphy",
              jobTitle: "Realtor®",
              worksFor: {
                "@type": "RealEstateAgent",
                name: "Provision Properties Core Team — eXp Realty",
              },
              areaServed: [
                "Milwaukee County, WI",
                "Waukesha County, WI",
                "Ozaukee County, WI",
                "Washington County, WI",
              ],
              email: "Lucas.Murphy@exprealty.com",
              url: "https://LucasMurphy.exprealty.com",
            },
            publisher: {
              "@type": "Organization",
              name: "Lucas Murphy Real Estate",
              url: "https://www.lucasmurphyrealestate.com",
            },
            datePublished: "2026-01-15",
            dateModified: "2026-02-19",
            mainEntityOfPage: "https://www.lucasmurphyrealestate.com/first-time-homebuyers-guide",
          })}
        </script>

        {/* FAQ Structured Data for Google/AI */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Do I need 20% down to buy a home in Milwaukee?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. Most first-time buyers in Milwaukee put down 3–5%. There are also several assistance programs that can help cover your down payment entirely.",
                },
              },
              {
                "@type": "Question",
                name: "What credit score do I need to buy a house in Milwaukee?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Many loan programs accept scores as low as 620. FHA loans can work with even lower scores. Your rate improves as your score goes up, but you don't need perfect credit to buy.",
                },
              },
              {
                "@type": "Question",
                name: "What are closing costs in Milwaukee Metro?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Closing costs in Milwaukee Metro typically run 2–4% of the purchase price. Some of these can be negotiated with the seller or covered through assistance programs.",
                },
              },
              {
                "@type": "Question",
                name: "How long does it take to buy a home in Milwaukee?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "From accepted offer to keys in hand, most transactions close in 25–45 days.",
                },
              },
              {
                "@type": "Question",
                name: "Should I wait for interest rates to drop before buying?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Timing the market is nearly impossible. Buying when you're financially ready — and refinancing later if rates drop — is usually a stronger strategy than waiting.",
                },
              },
            ],
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-background text-foreground">
        <HeroSection />
        <LearnSection />
        <FearsSection />
        <AuthoritySection />
        <BonusSection />
        <AudienceSection />
        <MarketDataSection />
        <FAQSection />
        <FinalCTASection />
        <LandingFooter />
        <StickyCTA />
      </main>
    </div>
  );
};

export default FirstTimeHomeBuyersGuide;
