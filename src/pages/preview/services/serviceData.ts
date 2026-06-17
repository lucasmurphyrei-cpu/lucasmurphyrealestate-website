/**
 * Config for the three transaction-type landing pages (Buying / Selling / Investing).
 * Each card on the PreviewV1 homepage links here; its image becomes the hero banner.
 * Link targets point at the EXISTING live guide/tool/resource pages for now (light theme);
 * the market links stay in the preview world. Copy is a rough first draft — refine with Lucas.
 */

export type ServiceSlug = "buying" | "selling" | "investing";

export type ServiceLink = { title: string; desc?: string; href: string; external?: boolean };
export type ProcessStep = { title: string; body: string };

export type ServiceConfig = {
  slug: ServiceSlug;
  kicker: string;
  title: string;
  heroImg: string;
  lead: string;
  processTitle: string;
  process: ProcessStep[];
  guides: ServiceLink[];
  tools: ServiceLink[];
  resources: ServiceLink[];
  marketBlurb: string;
};

export const SERVICES: Record<ServiceSlug, ServiceConfig> = {
  buying: {
    slug: "buying",
    kicker: "For Buyers",
    title: "Buying a Home",
    heroImg:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lead:
      "From your first pre-approval conversation to keys in hand, I guide you through finding the right neighborhood, writing an offer that wins, and closing with confidence. You will always know what comes next and why.",
    processTitle: "How I help you buy",
    process: [
      {
        title: "Get pre-approved",
        body: "We start with a quick conversation and connect you with a trusted local lender, so you know your real budget and shop with confidence.",
      },
      {
        title: "Find the right area",
        body: "I help you weigh neighborhoods, commute, schools, and resale using real market data instead of guesswork.",
      },
      {
        title: "Tour and evaluate",
        body: "We see homes together and I flag what matters: condition, hidden costs, and whether the numbers actually make sense for you.",
      },
      {
        title: "Write a winning offer",
        body: "I structure an offer that competes without overpaying, backed by local comps and a clear negotiation strategy.",
      },
      {
        title: "Inspect, negotiate, close",
        body: "From inspection through the closing table, I negotiate repairs and keep every deadline on track so there are no surprises.",
      },
    ],
    guides: [
      { title: "First-Time Home Buyers", desc: "The full Metro Milwaukee starter playbook.", href: "/guides/first-time-home-buyers" },
      { title: "First-Time Condo Buyers", desc: "What is different about buying a condo.", href: "/guides/first-time-condo-buyers" },
      { title: "Relocating to Metro Milwaukee", desc: "Moving to the area from out of town.", href: "/guides/relocation" },
    ],
    tools: [
      { title: "Mortgage Calculator", desc: "Estimate your monthly payment.", href: "/tools/mortgage-calculator" },
      { title: "How Much Home Can You Afford?", desc: "Budget planner that works backward from your life.", href: "/tools/budget-planner" },
      { title: "Budget Spreadsheet", desc: "Map your full cost of ownership.", href: "/tools/budget-spreadsheet" },
    ],
    resources: [
      { title: "Lenders", href: "/resources/lenders" },
      { title: "Home Inspectors", href: "/resources/home-inspectors" },
      { title: "Home Insurance", href: "/resources/home-insurance" },
      { title: "Contractors", href: "/resources/contractors" },
      { title: "Movers", href: "/resources/movers" },
    ],
    marketBlurb:
      "Know an area before you offer. Dig into median prices, days on market, and the feel of every county and municipality.",
  },

  selling: {
    slug: "selling",
    kicker: "For Sellers",
    title: "Selling Your Home",
    heroImg:
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lead:
      "I price your home on real local data, market it so the right buyers actually see it, and negotiate hard to net you more. A clear plan, honest expectations, and a partner who sweats every detail from listing photos to the closing table.",
    processTitle: "How I help you sell",
    process: [
      {
        title: "Price on real data",
        body: "I build a comparative market analysis from recent local sales so we list at a number that draws buyers and protects your equity.",
      },
      {
        title: "Prep and stage",
        body: "I tell you exactly what is worth doing and what is not, then bring in my trusted contractors, cleaners, and stagers.",
      },
      {
        title: "Market it right",
        body: "Professional photography and targeted marketing put your home in front of the buyers who are actually searching for it.",
      },
      {
        title: "Negotiate every term",
        body: "I negotiate price, contingencies, and timeline to net you more, not just a fast close.",
      },
      {
        title: "Close with confidence",
        body: "I manage inspections, the appraisal, and paperwork so closing day is smooth and on schedule.",
      },
    ],
    guides: [
      { title: "Seller's Guide", desc: "Everything that goes into a strong sale.", href: "/guides/sellers" },
      { title: "Seasonal Home Guide", desc: "Keep your home market-ready year round.", href: "/resources/seasonal-guide" },
    ],
    tools: [
      { title: "Free CMA", desc: "A real valuation of what your home is worth today.", href: "/tools/cma" },
      { title: "Seller Net Sheet", desc: "Estimate your take-home proceeds at closing.", href: "/tools/seller-net-sheet" },
      { title: "Mortgage Calculator", desc: "Plan the payment on your next home.", href: "/tools/mortgage-calculator" },
    ],
    resources: [
      { title: "Contractors", href: "/resources/contractors" },
      { title: "Home Inspectors", href: "/resources/home-inspectors" },
      { title: "Movers", href: "/resources/movers" },
    ],
    marketBlurb:
      "Pricing starts with the data. See what is selling, and for how much, across your county and municipality.",
  },

  investing: {
    slug: "investing",
    kicker: "For Investors",
    title: "Investing & House Hacking",
    heroImg:
      "https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lead:
      "I came up house hacking, so I speak this language fluently. Whether it is your first duplex or your fiftieth door, we run the real numbers together, pressure test the deal, and find properties that actually cash flow.",
    processTitle: "How I help you invest",
    process: [
      {
        title: "Define your strategy",
        body: "Cash flow, appreciation, or house hacking your way into your first place. We get clear on the goal first.",
      },
      {
        title: "Run the real numbers",
        body: "We pressure test each deal with actual rents, expenses, and financing, not pro forma fantasy.",
      },
      {
        title: "Find the right doors",
        body: "I source on-market and off-market properties across Metro Milwaukee that fit your buy box.",
      },
      {
        title: "House hack the smart way",
        body: "I came up house hacking, so I will show you how to let a tenant cover most of your mortgage.",
      },
      {
        title: "Scale your portfolio",
        body: "From your first duplex to your fiftieth door, I help you build a repeatable system that compounds.",
      },
    ],
    guides: [
      { title: "Investor's Guide", desc: "How I underwrite and find deals locally.", href: "/guides/investors" },
      { title: "House Hacking Guide", desc: "Live for less and build equity at once.", href: "/guides/house-hacking" },
    ],
    tools: [
      { title: "House Hack Calculator", desc: "See if a duplex covers your mortgage.", href: "/tools/house-hack-calculator" },
      { title: "Investor Spreadsheets", desc: "Underwrite deals like a pro.", href: "/tools/investor-spreadsheets" },
      { title: "Mortgage Calculator", desc: "Model financing on any property.", href: "/tools/mortgage-calculator" },
    ],
    resources: [
      { title: "Lenders", href: "/resources/lenders" },
      { title: "Contractors", href: "/resources/contractors" },
      { title: "Home Inspectors", href: "/resources/home-inspectors" },
    ],
    marketBlurb:
      "Good deals start with good data. Compare prices and trends across every Metro Milwaukee submarket.",
  },
};
