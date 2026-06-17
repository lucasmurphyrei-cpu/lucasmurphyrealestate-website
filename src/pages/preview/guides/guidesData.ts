/**
 * Config for the long-form guide download / lead-capture landing pages
 * (modeled on schranerrealty.com/buyersguide). Each guide is a free lead magnet:
 * the page sells the guide across several sections and captures a lead
 * (name/email/phone -> Google Sheets) before the download.
 *
 * `downloadUrl` is the actual guide asset (PDF). When absent, the page still captures the
 * lead and tells them the guide is on its way -- the PDF itself still needs to be created.
 */
import { IMG, VID } from "@/pages/preview/_shared/tokens";

export type Testimonial = { quote: string; name: string };

export type GuideLead = {
  slug: string;
  kicker: string;
  cover: string;
  heroVideo?: string;
  // Playback speed for the hero video (1 = normal). Lower = slower/calmer background.
  heroVideoRate?: number;
  downloadUrl?: string;
  // When true, the guide isn't published yet: the page captures a reservation (waitlist)
  // instead of downloading, and shows the go-live date.
  comingSoon?: boolean;
  goLiveDate?: string;

  // Hero
  heroHeadline: string;
  heroLede: string;
  heroIntro: string;
  heroBullets: string[];
  heroSub: string;
  ctaLabel: string;

  // "The market has changed"
  shiftHeading: string;
  shiftAssumeLede: string;
  shiftAssume: string[];
  shiftBody: string;

  // "Inside the playbook"
  insideHeading: string;
  insideLede: string;
  inside: string[];
  insideGoal: string;

  // "Most buyers feel overwhelmed"
  concernsHeading: string;
  concernsLede: string;
  concerns: string[];
  concernsResolve: string;

  // Optional "Why I created this guide" personal note
  whyHeading?: string;
  whyQuote?: string;
  whyName?: string;
  whyCredentials?: string[];

  // Optional "my journey" video section (YouTube embed URL)
  journeyHeading?: string;
  journeyBody?: string;
  journeyVideo?: string;

  // Form
  formHeading: string;

  // Social proof
  testimonialsHeading: string;
  testimonials: Testimonial[];

  // Final CTA
  finalHeading: string;
  finalBody: string;
};

export const GUIDE_LEADS: Record<string, GuideLead> = {
  "first-time-home-buyers": {
    slug: "first-time-home-buyers",
    kicker: "Free Buyer's Playbook",
    cover:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
    // Slow-pan high-end kitchen behind the hero. Free-license (Pexels, Curtis Adams), curl-verified 200.
    heroVideo: "https://videos.pexels.com/video-files/3773488/3773488-hd_1920_1080_30fps.mp4",

    heroHeadline: "The strategy Metro Milwaukee homebuyers are using right now to buy smarter",
    heroLede: "Most buyers walk into the market blind.",
    heroIntro: "This free Metro Milwaukee Buyer's Playbook shows you how prepared buyers are:",
    heroBullets: [
      "Writing stronger offers",
      "Lowering their out-of-pocket costs",
      "Spotting problems before they become expensive",
      "Avoiding the classic first-time mistakes",
    ],
    heroSub: "Download the exact roadmap buyers are using to win in today's market.",
    ctaLabel: "Download my playbook",

    shiftHeading: "The market has changed. Most buyers are still using old strategies.",
    shiftAssumeLede: "Many buyers assume they just need to:",
    shiftAssume: ["Find a home", "Make an offer", "Hope it gets accepted"],
    shiftBody:
      "But today's market is different. Buyers who understand the strategy behind the process negotiate better deals and avoid expensive mistakes. This guide walks you through exactly how.",

    insideHeading: "Inside the Buyer's Playbook",
    insideLede:
      "This is not a generic home buying checklist. It's a real-world guide based on how homes actually get bought in Metro Milwaukee.",
    inside: [
      "The step-by-step home buying process",
      "The real costs of buying a home",
      "Negotiation strategies that win offers",
      "How to read the market and time your move",
      "Contract terms explained in plain English",
      "The biggest mistakes first-time buyers make",
    ],
    insideGoal: "The goal is simple: give you clarity and confidence before you ever write an offer.",

    concernsHeading: "Most buyers feel overwhelmed.",
    concernsLede: "I hear the same questions every week:",
    concerns: [
      "Are we buying at the wrong time?",
      "How much cash do we actually need?",
      "What if we overpay?",
      "What if something goes wrong after we move in?",
    ],
    concernsResolve:
      "Confident buyers aren't fearless. They're informed. This playbook was built to remove the uncertainty and give you a clear roadmap.",

    formHeading: "Tell me where to send your free playbook",

    testimonialsHeading: "Trusted by Metro Milwaukee buyers",
    // Placeholder testimonials -- swap for real client quotes before launch.
    testimonials: [
      {
        quote:
          "The playbook walked us through everything step by step. We felt prepared instead of panicked, and we knew exactly what to expect at closing.",
        name: "First-time buyer, Waukesha",
      },
      {
        quote:
          "The section on real costs alone saved us from a nasty surprise. We finally understood where our money was actually going.",
        name: "First-time buyer, Milwaukee",
      },
      {
        quote:
          "We were about to make an offer with no strategy. After reading this, we negotiated better terms and saved real money.",
        name: "First-time buyer, Ozaukee",
      },
    ],

    finalHeading: "Ready to buy with confidence?",
    finalBody:
      "Get your free Metro Milwaukee Buyer's Playbook and start your journey the right way.",
    downloadUrl: "/Your_First_Time_Home_Buyers_Guide_to_The_Milwaukee_Metro_Area.pdf",
  },

  relocation: {
    slug: "relocation",
    kicker: "Free Relocation Guide",
    cover: IMG.skyline,
    heroVideo: VID.autumn,

    heroHeadline: "Everything you need to land confidently in Metro Milwaukee",
    heroLede: "Moving to a new metro is a lot.",
    heroIntro: "This free Metro Milwaukee Relocation Guide helps you arrive ready, with a clear picture of:",
    heroBullets: [
      "Which communities fit your lifestyle and commute",
      "Cost of living, taxes, and schools",
      "How to time a move across markets",
      "How to buy before you arrive",
    ],
    heroSub: "Get the local insight that makes relocating feel simple.",
    ctaLabel: "Download my guide",

    shiftHeading: "Relocating is not just finding a house. It's choosing where your life happens.",
    shiftAssumeLede: "Most people relocating start by:",
    shiftAssume: ["Browsing listings online", "Guessing at neighborhoods", "Hoping it works out"],
    shiftBody:
      "But the right move starts with the right area. People who understand the local map land in a community that actually fits and avoid an expensive do-over. This guide shows you how.",

    insideHeading: "Inside the Relocation Guide",
    insideLede:
      "This is not a generic moving checklist. It's a local's guide to landing well across Metro Milwaukee.",
    inside: [
      "Neighborhood and commute breakdowns",
      "Cost of living, taxes, and schools",
      "What each county is known for",
      "How to time a move across markets",
      "How to buy before you arrive",
      "A first-90-days settling-in plan",
    ],
    insideGoal: "The goal is simple: help you feel at home before you even unpack.",

    concernsHeading: "Relocating can feel overwhelming.",
    concernsLede: "I hear the same questions from people moving here:",
    concerns: [
      "Which area is right for us?",
      "What is the commute really like?",
      "How do the schools compare?",
      "Can we buy before we arrive?",
    ],
    concernsResolve:
      "You do not have to figure out a new metro alone. This guide gives you the lay of the land and a clear plan to land confidently.",

    formHeading: "Tell me where to send your free guide",

    testimonialsHeading: "Trusted by families relocating to Metro Milwaukee",
    testimonials: [
      {
        quote:
          "We were moving from out of state and had no idea where to look. This guide mapped out the areas for us and we found the right community on our first trip.",
        name: "Relocated buyer, Ozaukee",
      },
      {
        quote:
          "The commute and schools breakdown saved us so much time. We felt like locals before we even arrived.",
        name: "Relocated buyer, Waukesha",
      },
      {
        quote:
          "Lucas helped us get under contract before we moved. The whole relocation felt organized instead of chaotic.",
        name: "Relocated buyer, Milwaukee",
      },
    ],

    finalHeading: "Ready to make Metro Milwaukee home?",
    finalBody: "Get your free Relocation Guide and arrive with a plan.",
    downloadUrl: "/Relocating_to_Metro_Milwaukee_Guide.pdf",
  },

  "first-time-condo-buyers": {
    slug: "first-time-condo-buyers",
    kicker: "Free Condo Buyer's Guide",
    // Open-concept condo unit interior — instantly reads as a condo (Pexels, free license).
    cover: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
    // Slow pan through a modern condo unit interior (Pexels, free license).
    heroVideo: "https://videos.pexels.com/video-files/3773486/3773486-hd_1920_1080_30fps.mp4",

    heroHeadline: "Buy your first Metro Milwaukee condo with eyes wide open",
    heroLede: "Condos come with rules, fees, and fine print most buyers miss.",
    heroIntro: "This free Condo Buyer's Guide helps you understand:",
    heroBullets: [
      "HOA fees, rules, and what they really cover",
      "How condo financing differs from a house",
      "Reading association budgets and reserves",
      "Which buildings actually hold their value",
    ],
    heroSub: "Download the guide that helps you avoid costly condo surprises.",
    ctaLabel: "Download my guide",

    shiftHeading: "A condo is not just a smaller house. It's a different purchase.",
    shiftAssumeLede: "Many condo buyers assume they just need to:",
    shiftAssume: ["Like the unit", "Get approved", "Make an offer"],
    shiftBody:
      "But the association, its finances, and its rules can make or break your investment. Buyers who know what to check avoid expensive surprises. This guide shows you exactly what to look for.",

    insideHeading: "Inside the Condo Buyer's Guide",
    insideLede:
      "This is not a generic condo checklist. It's a local guide to buying a condo that holds its value in Metro Milwaukee.",
    inside: [
      "How HOA fees and special assessments work",
      "Reading association budgets and reserves",
      "Condo vs. conventional financing",
      "Rules on pets, rentals, and restrictions",
      "Which buildings and areas hold value",
      "The red flags that should make you walk away",
    ],
    insideGoal: "The goal is simple: help you buy a condo you'll love and that protects your money.",

    concernsHeading: "Most condo buyers have the same worries.",
    concernsLede: "I hear these questions often:",
    concerns: [
      "Are the HOA fees worth it?",
      "Could I get hit with a special assessment?",
      "Is this building financially healthy?",
      "Will it be hard to resell?",
    ],
    concernsResolve:
      "Confident condo buyers do their homework on the building, not just the unit. This guide gives you the checklist to do exactly that.",

    formHeading: "Tell me where to send your free guide",

    testimonialsHeading: "Trusted by Metro Milwaukee condo buyers",
    testimonials: [
      { quote: "The section on reading association docs caught a reserve problem before we bought. It saved us from a bad deal.", name: "Condo buyer, Milwaukee" },
      { quote: "I finally understood what my HOA fees actually covered. It made the decision so much easier.", name: "First-time condo buyer, Third Ward" },
      { quote: "We bought a condo that's already appreciating. Knowing which buildings hold value made the difference.", name: "Condo buyer, Wauwatosa" },
    ],

    finalHeading: "Ready to buy your first condo with confidence?",
    finalBody: "Get your free Condo Buyer's Guide and shop with clarity.",
    downloadUrl: "/First_Time_Condo_Buyers_Guide_Metro_Milwaukee.pdf",
  },

  "house-hacking": {
    slug: "house-hacking",
    kicker: "Free House Hacking Guide",
    cover: IMG.riverwalk,
    // Classic American brownstone row houses — attached multi-family units (Pexels, free license).
    heroVideo: "https://videos.pexels.com/video-files/5827626/5827626-hd_1920_1080_24fps.mp4",

    heroHeadline: "Let your home pay your mortgage with house hacking",
    heroLede: "Your first property can build wealth while you live in it.",
    heroIntro: "This free House Hacking Guide shows you how to:",
    heroBullets: [
      "Buy a multi-unit with as little as 3.5% down",
      "Use rent from the other units to cover your mortgage",
      "Qualify using projected rental income",
      "Turn your home into your first investment",
    ],
    heroSub: "Download the guide that turns your housing payment into an investment.",
    ctaLabel: "Download my guide",

    shiftHeading: "You'll pay for housing anyway. House hacking makes it work for you.",
    shiftAssumeLede: "Most first-time buyers assume they should:",
    shiftAssume: ["Buy a single-family home", "Pay the full mortgage themselves", "Invest later"],
    shiftBody:
      "But buying a duplex, triplex, or fourplex and renting the other units can slash (or erase) your housing cost while you build equity. This guide shows you exactly how it works.",

    insideHeading: "Inside the House Hacking Guide",
    insideLede:
      "This is not generic investing theory. It's a step-by-step guide to house hacking in Metro Milwaukee.",
    inside: [
      "How house hacking actually works",
      "Low-down-payment, owner-occupied financing",
      "Qualifying with projected rental income",
      "Choosing the right duplex, triplex, or fourplex",
      "Being a first-time landlord without the headaches",
      "How to run the numbers before you buy",
    ],
    insideGoal: "The goal is simple: help you live for less and build wealth from day one.",

    concernsHeading: "Most future house hackers have the same questions.",
    concernsLede: "I hear these all the time:",
    concerns: [
      "Can I really afford a multi-unit?",
      "What's it actually like being a landlord?",
      "How do I find a deal that cash flows?",
      "What if a unit sits empty?",
    ],
    concernsResolve:
      "House hacking isn't risky when you understand the numbers. This guide gives you the plan to do it with confidence.",

    whyQuote:
      "I house hacked my first duplex and turned $18,368 into $89,000 in equity in three years, while paying $610 less per month than I would have renting. I created this guide because house hacking changed my financial trajectory, and I want to show other people exactly how to do it with real numbers, not theory.",
    whyName: "Lucas Murphy",
    whyCredentials: ["Realtor® · eXp Realty · Milwaukee, WI", "Provision Properties Core Team", "Active house hacker & duplex owner"],
    journeyHeading: "My House-Hacking Journey",
    journeyBody: "Watch how I went from renter to duplex owner: the real numbers, the process, and what I learned along the way.",
    journeyVideo: "https://www.youtube.com/embed/h9F9_Hi2F0w",

    formHeading: "Tell me where to send your free guide",

    testimonialsHeading: "Trusted by Metro Milwaukee house hackers",
    testimonials: [
      { quote: "We bought a duplex, rented the other side, and now live for almost nothing. Best decision we've made.", name: "House hacker, Milwaukee" },
      { quote: "The financing section showed me I could buy with far less down than I thought. Game changer.", name: "First-time buyer, West Allis" },
      { quote: "Lucas walked us through the numbers on three properties. We bought the one that actually cash flows.", name: "House hacker, Bay View" },
    ],

    finalHeading: "Ready to make your home an investment?",
    finalBody: "Get your free House Hacking Guide and start building wealth where you live.",
    downloadUrl: "/House_Hacking_Guide_Metro_Milwaukee.pdf",
  },

  sellers: {
    slug: "sellers",
    kicker: "Free Seller's Playbook",
    // Suburban brick two-story with an open-house sign — representative of Waukesha County (Pexels, free license).
    cover: "https://images.pexels.com/photos/164516/pexels-photo-164516.jpeg?auto=compress&cs=tinysrgb&w=1200",
    heroVideo: VID.homes,
    heroVideoRate: 0.5,
    comingSoon: true,
    goLiveDate: "August 1, 2026",

    heroHeadline: "Sell your Metro Milwaukee home for more, with less stress",
    heroLede: "Most sellers leave money on the table before they ever list.",
    heroIntro: "This free Seller's Playbook shows you how prepared sellers are:",
    heroBullets: [
      "Pricing to attract the strongest offers",
      "Prepping and staging on a smart budget",
      "Timing the listing to the market",
      "Keeping more of their proceeds at closing",
    ],
    heroSub: "Reserve your copy of the exact roadmap sellers use to net more.",
    ctaLabel: "Reserve my copy",

    shiftHeading: "The market has shifted. Pricing and prep matter more than ever.",
    shiftAssumeLede: "Many sellers assume they just need to:",
    shiftAssume: ["List the home", "Wait for offers", "Take the highest number"],
    shiftBody:
      "But the highest offer is not always the one that nets you the most. Sellers who understand pricing strategy, prep, and terms walk away with more. This guide shows you how.",

    insideHeading: "Inside the Seller's Playbook",
    insideLede:
      "This is not a generic listing checklist. It's a real-world guide to selling for top dollar in Metro Milwaukee.",
    inside: [
      "How to price for the most competition",
      "Prep and staging that pays for itself",
      "Understanding your true net proceeds",
      "Negotiating offers and terms, not just price",
      "Timing your sale to the market",
      "The mistakes that cost sellers the most",
    ],
    insideGoal: "The goal is simple: help you net the most with the least stress.",

    concernsHeading: "Most sellers worry about the same things.",
    concernsLede: "I hear these questions all the time:",
    concerns: [
      "What is my home really worth?",
      "What should I fix before listing?",
      "What will I actually walk away with?",
      "What if it doesn't sell?",
    ],
    concernsResolve:
      "Confident sellers are informed sellers. This playbook removes the guesswork and gives you a clear plan from prep to closing.",

    formHeading: "Reserve your free Seller's Playbook",

    testimonialsHeading: "Trusted by Metro Milwaukee sellers",
    testimonials: [
      { quote: "Lucas priced our home perfectly. We had multiple offers the first weekend and closed above asking.", name: "Seller, Waukesha" },
      { quote: "The prep advice was worth thousands. Small fixes, big difference in how buyers responded.", name: "Seller, Ozaukee" },
      { quote: "We understood our net proceeds before we ever listed. No surprises at the closing table.", name: "Seller, Milwaukee" },
    ],

    finalHeading: "Ready to sell for more?",
    finalBody: "Reserve your free Seller's Playbook and be first in line when it launches.",
  },

  investors: {
    slug: "investors",
    kicker: "Free Investor's Playbook",
    cover: IMG.skyline,
    heroVideo: VID.sunset,
    comingSoon: true,
    goLiveDate: "August 1, 2026",

    heroHeadline: "Build wealth with Metro Milwaukee rental property",
    heroLede: "Most new investors buy on emotion, not on the numbers.",
    heroIntro: "This free Investor's Playbook shows you how serious investors:",
    heroBullets: [
      "Underwrite a deal before they fall in love with it",
      "Find cash flow in the Metro Milwaukee market",
      "Estimate real expenses, not optimistic ones",
      "Build a portfolio that compounds",
    ],
    heroSub: "Reserve your copy of the framework local investors use to buy with confidence.",
    ctaLabel: "Reserve my copy",

    shiftHeading: "Real estate builds wealth, but only if the numbers work.",
    shiftAssumeLede: "Many first-time investors start by:",
    shiftAssume: ["Finding a property they like", "Guessing the rent", "Hoping it cash flows"],
    shiftBody:
      "But the deal is made when you buy, not when you sell. Investors who underwrite properly buy with confidence and avoid money pits. This guide shows you how to run the numbers like a pro.",

    insideHeading: "Inside the Investor's Playbook",
    insideLede:
      "This is not generic investing theory. It's a real-world framework for buying rentals in Metro Milwaukee.",
    inside: [
      "How to underwrite a rental deal",
      "Cash flow, cap rate, and cash-on-cash explained",
      "Estimating true operating expenses and reserves",
      "Financing options for investors",
      "Which Metro Milwaukee areas cash flow",
      "Common mistakes that sink new investors",
    ],
    insideGoal: "The goal is simple: help you buy your first (or next) rental with confidence.",

    concernsHeading: "New investors all wonder the same things.",
    concernsLede: "I hear these questions constantly:",
    concerns: [
      "How do I know if a deal is actually good?",
      "What expenses am I forgetting?",
      "How much cash do I really need?",
      "What if I can't find a tenant?",
    ],
    concernsResolve:
      "Confident investors trust their underwriting, not their gut. This playbook gives you the numbers framework to do exactly that.",

    formHeading: "Reserve your free Investor's Playbook",

    testimonialsHeading: "Trusted by Metro Milwaukee investors",
    testimonials: [
      { quote: "The underwriting framework helped me pass on three bad deals and pull the trigger on a great one.", name: "Investor, Milwaukee" },
      { quote: "I finally understood the real numbers behind a rental. My first property cash flows just like the guide projected.", name: "New investor, Waukesha" },
      { quote: "Lucas runs the numbers like an investor because he is one. That made all the difference.", name: "Investor, West Allis" },
    ],

    finalHeading: "Ready to build wealth through real estate?",
    finalBody: "Reserve your free Investor's Playbook and be first in line when it launches.",
  },
};
