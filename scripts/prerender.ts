// scripts/prerender.ts
// Browser-free static SEO generator. For every route we bake the correct
// <title>/description/canonical/OG tags, a JSON-LD entity graph (Organization +
// WebSite + RealEstateAgent, plus per-page BreadcrumbList/FAQ), and a crawlable
// content block into dist/<route>/index.html.
//
// Why not headless Chrome: Vercel's build image can't launch Chromium, so the
// old puppeteer prerender always silently failed and shipped an empty SPA shell
// that AI crawlers (GPTBot, PerplexityBot, Bing) — which don't run JS — saw as
// blank. This runs in pure Node (tsx), so it works on Vercel.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getAllRoutes } from "./routes";
import { siteConfig, sameAsProfiles } from "../src/lib/siteConfig";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(root, "dist");
const ORIGIN = siteConfig.url;

/* ----------------------------- helpers ----------------------------- */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const title = (slug: string) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bWi\b/, "WI");
const abs = (path: string) => `${ORIGIN}${path === "/" ? "" : path}`;

/* ----------------------------- JSON-LD ----------------------------- */
const organization = () => ({ "@type": "Organization", "@id": `${ORIGIN}/#brokerage`, name: siteConfig.brokerage, url: ORIGIN });
const webSite = () => ({
  "@type": "WebSite",
  "@id": `${ORIGIN}/#website`,
  name: siteConfig.name,
  url: ORIGIN,
  publisher: { "@id": `${ORIGIN}/#agent` },
  potentialAction: { "@type": "SearchAction", target: `${ORIGIN}/?q={search_term_string}`, "query-input": "required name=search_term_string" },
});
// The HUMAN (Person) — the entity AI engines must disambiguate from other "Lucas Murphy"s.
const person = () => ({
  "@type": "Person",
  "@id": `${ORIGIN}/#person`,
  name: siteConfig.agent.name,
  jobTitle: `${siteConfig.agent.jobTitle}, ${siteConfig.brokerage}`,
  worksFor: { "@id": `${ORIGIN}/#brokerage` },
  url: ORIGIN,
  image: `${ORIGIN}${siteConfig.defaultOgImage}`,
  email: siteConfig.email,
  telephone: siteConfig.phoneE164,
  address: { "@type": "PostalAddress", addressLocality: siteConfig.locality, addressRegion: siteConfig.region, addressCountry: "US" },
  knowsAbout: [...siteConfig.agent.knowsAbout],
  sameAs: sameAsProfiles,
  description: siteConfig.agent.description,
});
// The PRACTICE (RealEstateAgent is a LocalBusiness subtype) — linked back to the Person.
const realEstateAgent = () => ({
  "@type": "RealEstateAgent",
  "@id": `${ORIGIN}/#agent`,
  name: `${siteConfig.agent.name} - ${siteConfig.brokerage}`,
  url: ORIGIN,
  image: `${ORIGIN}${siteConfig.defaultOgImage}`,
  email: siteConfig.email,
  telephone: siteConfig.phoneE164,
  employee: { "@id": `${ORIGIN}/#person` },
  parentOrganization: { "@id": `${ORIGIN}/#brokerage` },
  address: { "@type": "PostalAddress", addressLocality: siteConfig.locality, addressRegion: siteConfig.region, addressCountry: "US" },
  areaServed: siteConfig.counties.map((c) => ({ "@type": "AdministrativeArea", name: `${c} County, Wisconsin` })),
  knowsAbout: [...siteConfig.agent.knowsAbout],
  sameAs: sameAsProfiles,
  description: siteConfig.agent.description,
});
const breadcrumb = (path: string) => {
  const parts = path.split("/").filter(Boolean);
  const items = [{ name: "Home", item: ORIGIN }];
  let acc = "";
  for (const p of parts) { acc += `/${p}`; items.push({ name: title(p), item: abs(acc) }); }
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.item })),
  };
};
const faqPage = (qas: { q: string; a: string }[]) => ({
  "@type": "FAQPage",
  mainEntity: qas.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

/* ----------------------------- per-route copy ----------------------------- */
type Meta = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  faq?: { q: string; a: string }[];
  /**
   * PDFs the page exists to hand out. The React page renders the download
   * buttons, but crawlers that do not run JS would never see the assets at all,
   * so guide routes repeat them here as plain anchors. A list because a page can
   * offer both an ungated sheet and the gated guide it leads into.
   */
  pdf?: { href: string; label: string }[];
};

const AGENT_FAQ = [
  { q: "Who is Lucas Murphy?", a: siteConfig.agent.description },
  { q: "What areas does Lucas Murphy serve?", a: "Lucas Murphy serves the Metro Milwaukee area, including Milwaukee, Waukesha, Ozaukee, and Washington counties in Wisconsin." },
  { q: "How can I contact Lucas Murphy?", a: `You can reach Lucas Murphy at ${siteConfig.phone} or ${siteConfig.email}, or schedule a consultation online.` },
];

const META: Record<string, Meta> = {
  "/": {
    title: "Lucas Murphy Real Estate | Milwaukee Metro Homes, Market Data & Guides",
    description: "Lucas Murphy, Realtor with eXp Realty, helps buyers, sellers, and investors across Milwaukee, Waukesha, Ozaukee & Washington counties with live market data, free guides, and tools.",
    h1: "Lucas Murphy - Metro Milwaukee Real Estate",
    intro: siteConfig.agent.description,
    faq: AGENT_FAQ,
  },
  "/about": {
    title: "About Lucas Murphy | Metro Milwaukee Realtor (eXp Realty)",
    description: "Meet Lucas Murphy, a licensed Realtor with eXp Realty serving buyers, sellers, and investors across metro Milwaukee, Wisconsin.",
    h1: "About Lucas Murphy",
    intro: siteConfig.agent.description,
    faq: AGENT_FAQ,
  },
  "/contact": {
    title: "Contact Lucas Murphy | Metro Milwaukee Realtor",
    description: `Get in touch with Lucas Murphy, Realtor with eXp Realty in metro Milwaukee. Call ${siteConfig.phone} or email ${siteConfig.email}.`,
    h1: "Contact Lucas Murphy",
    intro: `Reach Lucas Murphy at ${siteConfig.phone} or ${siteConfig.email}, serving Milwaukee, Waukesha, Ozaukee, and Washington counties.`,
  },
  "/services": { title: "Real Estate Services | Lucas Murphy, Metro Milwaukee", description: "Buyer representation, home selling, and investment guidance across metro Milwaukee from Lucas Murphy, eXp Realty.", h1: "Real Estate Services", intro: "Lucas Murphy offers buyer representation, listing/selling services, and investment guidance across Milwaukee, Waukesha, Ozaukee, and Washington counties." },
  "/buying": { title: "Buying a Home in Metro Milwaukee | Lucas Murphy", description: "A clear, modern path to buying a home in Milwaukee, Waukesha, Ozaukee, or Washington county with Realtor Lucas Murphy.", h1: "Buying a Home in Metro Milwaukee", intro: "Guidance for home buyers across metro Milwaukee, from first-time buyers to investors, with Lucas Murphy of eXp Realty." },
  "/selling": { title: "Selling Your Home in Metro Milwaukee | Lucas Murphy", description: "Sell your metro Milwaukee home with a data-driven pricing strategy and full-service marketing from Lucas Murphy, eXp Realty.", h1: "Selling Your Home", intro: "Home selling services across Milwaukee, Waukesha, Ozaukee, and Washington counties with Realtor Lucas Murphy." },
  "/investing": { title: "Real Estate Investing in Metro Milwaukee | Lucas Murphy", description: "House hacking, rentals, and investment property analysis across metro Milwaukee with Realtor Lucas Murphy.", h1: "Real Estate Investing", intro: "Investment real estate guidance across metro Milwaukee with Lucas Murphy, including house hacking and rental analysis." },
  "/guides": { title: "Free Real Estate Guides | Metro Milwaukee | Lucas Murphy", description: "Free buyer, seller, relocation, condo, and house-hacking guides for metro Milwaukee from Realtor Lucas Murphy.", h1: "Metro Milwaukee Real Estate Guides", intro: "Free, practical guides for buying, selling, relocating, and investing in metro Milwaukee from Lucas Murphy." },
  "/tools": { title: "Free Real Estate Calculators & Tools | Lucas Murphy", description: "Free mortgage, budget, CMA, seller net sheet, and house-hack calculators for metro Milwaukee buyers, sellers, and investors.", h1: "Real Estate Tools & Calculators", intro: "Free calculators to plan a budget, value a home, and analyze a deal across metro Milwaukee, from Lucas Murphy." },
  "/listings": { title: "Search Homes for Sale in Metro Milwaukee | Lucas Murphy", description: "Search active listings across Milwaukee, Waukesha, Ozaukee, and Washington counties with Realtor Lucas Murphy.", h1: "Search Metro Milwaukee Homes", intro: "Browse active homes for sale across metro Milwaukee by county and community with Lucas Murphy." },
  "/market": { title: "Metro Milwaukee Real Estate Market Data | Lucas Murphy", description: "Live real estate market data and trends for Milwaukee, Waukesha, Ozaukee, and Washington counties, by Realtor Lucas Murphy.", h1: "Metro Milwaukee Market Data", intro: "Explore current real estate market data and trends across metro Milwaukee, county by county, with Lucas Murphy." },
  "/resources/seasonal-guide": {
    title: "Seasonal Home Maintenance Guide | Wisconsin | Lucas Murphy",
    description: "A free season-by-season home maintenance checklist built for Wisconsin winters. What to do each quarter to protect your home's value and avoid the repairs that surprise sellers.",
    h1: "Seasonal Home Maintenance Guide",
    intro: "A season-by-season checklist for Wisconsin homeowners. What to inspect, service and winterize each quarter so small problems never become the expensive ones a buyer's inspector finds.",
    pdf: [{ href: "/Seasonal-Home-Maintenance-Guide.pdf", label: "Download the Seasonal Home Maintenance Guide" }],
  },
  "/vendors": { title: "Trusted Local Vendors | Metro Milwaukee | Lucas Murphy", description: "A vetted network of metro Milwaukee lenders, inspectors, contractors, insurance agents, and movers recommended by Lucas Murphy.", h1: "Trusted Metro Milwaukee Vendors", intro: "A vetted network of local pros recommended by Lucas Murphy: lenders, inspectors, contractors, insurance, and movers." },
  "/guides/first-time-condo-buyers": {
    title: "First-Time Condo Buyer Guide | Metro Milwaukee | Lucas Murphy",
    description: "A free first-time condo buyer guide for Metro Milwaukee. HOA fees, reserves and special assessments, condo financing, and how to read the documents before your review period ends.",
    h1: "First-Time Condo Buyer Guide",
    intro: "What the monthly fee actually covers, how to read the reserve study and budget, why condo financing differs from a single-family loan, and the questions to ask before the document review period closes.",
    pdf: [{ href: "/First_Time_Condo_Buyers_Guide_Metro_Milwaukee.pdf", label: "Download the First-Time Condo Buyer Guide" }],
    faq: [
      { q: "What do condo association fees cover in Milwaukee?", a: "Typically the building exterior, roof, common areas, master insurance, snow and lawn care, and a contribution to reserves. Water, heat and parking vary by association, so compare what is included before comparing two fees against each other." },
      { q: "What is a special assessment?", a: "A one-time charge levied on owners when the association needs money the reserve fund does not cover, such as a roof, parking deck or elevator. A thin reserve fund is the leading predictor of one, which is why the reserve study matters more than the fee itself." },
      { q: "Is it harder to get a mortgage on a condo?", a: "It can be. The lender underwrites the association as well as you: owner-occupancy ratio, budget, reserves, litigation and the share of units owned by any single entity. A project that fails review can require a larger down payment or a different loan product." },
    ],
  },
  "/guides/first-time-home-buyers": {
    pdf: [{ href: "/Your_First_Time_Home_Buyers_Guide_to_The_Milwaukee_Metro_Area.pdf", label: "Download the First-Time Home Buyer Guide" }],
    title: "First-Time Home Buyer Guide | Metro Milwaukee | Lucas Murphy",
    description: "A free first-time home buyer guide for Metro Milwaukee. What you can afford, how much cash you actually need, down payment assistance, and current county market data.",
    h1: "Your First-Time Home Buyer Guide to Milwaukee Metro",
    intro: "What you can afford, how much cash you need, which loan programs fit, and what the Milwaukee, Waukesha, Ozaukee and Washington county markets are doing right now.",
    faq: [
      { q: "How much do I need for a down payment in Milwaukee?", a: "Most first-time buyers put down 3-5%, not 20%. Against Milwaukee County's August 2026 median of $325,000, 3% down is $9,750 and 5% is $16,250, with closing costs typically adding another 2-4%. VA and USDA loans require no down payment at all." },
      { q: "What is the median home price in Metro Milwaukee?", a: "As of August 2026: $325,000 in Milwaukee County, $525,000 in Waukesha and Ozaukee counties, and $481,000 in Washington County. Every county is currently selling above asking price and within about two weeks." },
      { q: "What credit score do I need to buy a house in Wisconsin?", a: "FHA loans accept scores from 580, conventional from 620, and WHEDA programs from 620-640. VA loans have no set minimum. A higher score improves your rate rather than deciding whether you qualify at all." },
    ],
  },
  "/guides/relocation": {
    pdf: [{ href: "/Relocating_to_Metro_Milwaukee_Guide.pdf", label: "Download the Move to Milwaukee relocation guide" }],
    title: "Move to Milwaukee | Relocation Guide | Lucas Murphy",
    description: "A free relocation guide for Metro Milwaukee. Cost of living against Chicago, neighbourhoods and medians, schools, the job market, and buying from out of state.",
    h1: "Move to Milwaukee",
    intro: "Cost of living against Chicago, neighbourhood-by-neighbourhood medians, schools, employers, and a six-step plan built for buyers purchasing from out of state.",
    faq: [
      { q: "Is Milwaukee cheaper than Chicago?", a: "Yes. Milwaukee runs roughly 27.8% cheaper overall and 47% cheaper on rent, with homes at about $179 per square foot against Chicago's $338. A $400,000 home in Milwaukee would cost roughly $700,000 in Chicago for comparable features and location." },
      { q: "What are the best neighbourhoods to move to in Milwaukee?", a: "It depends on what you're after. As of August 2026, Wauwatosa's median is $427,500, Shorewood $590,000 and Brookfield $550,000. Bay View and the East Side sit within the City of Milwaukee, whose median is $252,000." },
      { q: "Can I buy a home in Milwaukee from out of state?", a: "Yes. Video walkthroughs, remote inspection coordination and electronic closing make it routine. Many out-of-state buyers combine virtual touring with a single discovery weekend to confirm a shortlist." },
    ],
  },
  // Explicit entry so this does not fall through to the generic /guides/<slug>
  // template, which described nothing specific and gave the PDF no crawlable
  // anchor. Every figure below comes from the guide itself, which sources each
  // one to a closing statement, a lease, a servicer statement or a market
  // source, so the answers stay true to the document they are advertising.
  "/guides/house-hacking": {
    pdf: [{ href: "/House_Hacking_Guide_Metro_Milwaukee.pdf", label: "Download the House Hacking Guide" }],
    title: "House Hacking Guide | Metro Milwaukee | Lucas Murphy",
    description: "A free house hacking guide for Metro Milwaukee. Buying a duplex with 3.5% down, qualifying on rental income, the real cash to close, and what a Milwaukee duplex actually cash flows.",
    h1: "House Hacking Guide",
    intro: "One Milwaukee duplex, every figure sourced to a closing statement, a lease or a servicer statement: the financing, the cash it took to get in, where the duplexes are, the landlord rules, and what the building really cash flows.",
    faq: [
      { q: "What is house hacking?", a: "You buy a building with two to four units, live in one of them, and lease the rest, so somebody else's rent covers part of your payment. Because you live there you can use the loan programs meant for a home rather than the ones meant for an investment, which is where most of the advantage comes from. Your tenant does not pay your mortgage. They pay a large part of it." },
      { q: "How much do you need down to buy a duplex you live in?", a: "Less than most people expect, but the down payment is not the whole number. FHA is 3.5% down on one to four units, conventional 5%, and VA 0% for eligible veterans. Lenders will usually also let part of the expected rent count toward your income: roughly three quarters of the lease rent on a unit that is already leased, or the appraiser's market rent opinion on one sitting empty. On my own $234,000 Milwaukee duplex in May 2022 the down payment was $11,750, but total cash to close was $18,368 once lender, title and escrow costs were in, and about $8,977 of that left my account before closing day for earnest money, the inspection and the appraisal." },
      { q: "Does a duplex in Milwaukee actually cash flow?", a: "Thinly, once you are honest about set-asides. With both units of my duplex leased at $2,600 a month against a $2,050 payment, holding back the conventional 15% of gross rent for vacancy and repairs leaves about $160 a month. That is $1,920 a year, and a single vacant month costs $1,500, so roughly 1.3 months of vacancy erases the entire year. Cash flow is thin on a duplex, and anyone telling you otherwise is selling something." },
    ],
  },
  // Explicit entry so this does not fall through to the generic /guides/<slug>
  // template, which titled it "Sellers Guide" and described nothing specific.
  "/guides/sellers": {
    pdf: [
      { href: "/Seller_Prep_Which_Projects_Pay_You_Back.pdf", label: "Download the free one-pager: Which Projects Pay You Back" },
      { href: "/What_to_Fix_Before_You_List_Seller_Guide.pdf", label: "Download What to Fix Before You List" },
    ],
    title: "What to Fix Before You List | Seller's Guide | Lucas Murphy",
    description: "Which pre-listing projects actually pay you back in metro Milwaukee. Cost-vs-value figures for Milwaukee specifically, what lenders require, and what Wisconsin's condition report means for repairs you choose not to make.",
    h1: "What to Fix Before You List",
    intro: "A seller's guide to what pays, what breaks even, and what to leave alone, with Milwaukee cost-vs-value figures, the repairs lenders and insurers actually require, and how Wisconsin's condition report treats a defect you disclose but do not fix.",
    faq: [
      { q: "What should I fix before selling my house?", a: "Fix anything a lender or insurer will stop the sale over: a roof with under two years of life left, defective paint on a pre-1978 home, no working heat source, exposed wiring, a wet basement, or non-functioning plumbing. After that, the highest-return work is the cheapest: decluttering, deep cleaning, paint, and basic lawn care." },
      { q: "Do home improvements pay for themselves when you sell?", a: "Usually not in full. In the Milwaukee cost-vs-value figures, small exterior work such as a garage door or entry door returns more than it cost, while large interior projects like a full kitchen gut or a primary suite addition return roughly a third to a half of what they cost." },
      { q: "Is it better to refresh a kitchen or gut it before selling?", a: "Refreshing generally wins. In the same 200-square-foot kitchen, keeping the cabinet boxes and replacing doors, fronts, counters and hardware recoups near or above its cost, while gutting the room costs roughly three times as much and recoups about half." },
      { q: "Do I have to repair a defect I disclose in Wisconsin?", a: "No. Wisconsin's Chapter 709 requires a seller to disclose what they know; it does not require repairs. A disclosed but unrepaired defect is an ordinary outcome under the statute. Whether a particular item counts as a defect is a question for you and your attorney. A real estate licensee is barred from giving that opinion." },
    ],
  },
};

function metaFor(path: string): Meta {
  if (META[path]) return META[path];
  // /guides/<slug>
  if (path.startsWith("/guides/")) {
    const name = title(path.split("/").pop()!);
    return { title: `${name} Guide | Metro Milwaukee | Lucas Murphy`, description: `A free ${name.toLowerCase()} guide for metro Milwaukee from Realtor Lucas Murphy, eXp Realty.`, h1: `${name} Guide`, intro: `A practical ${name.toLowerCase()} guide for the Milwaukee, Waukesha, Ozaukee, and Washington county area from Lucas Murphy.` };
  }
  // /market/<county>[/<muni>]
  if (path.startsWith("/market/")) {
    const segs = path.split("/").filter(Boolean).slice(1).map(title);
    const place = segs.join(", ");
    return { title: `${place} Real Estate Market | Lucas Murphy`, description: `Current real estate market data and trends for ${place}, Wisconsin, from Realtor Lucas Murphy.`, h1: `${place} Market Data`, intro: `Real estate market data and trends for ${place} in metro Milwaukee, with Lucas Murphy.` };
  }
  // /listings/<county>
  if (path.startsWith("/listings/")) {
    const place = title(path.split("/").pop()!);
    return { title: `Homes for Sale in ${place} | Lucas Murphy`, description: `Search active listings in ${place}, Wisconsin with Realtor Lucas Murphy.`, h1: `Homes for Sale in ${place}`, intro: `Browse active homes for sale in ${place} with Lucas Murphy.` };
  }
  // /tools/<slug>, /resources/<slug>, fallback
  const name = title(path.split("/").pop()!);
  return { title: `${name} | Lucas Murphy Real Estate`, description: `${name} for metro Milwaukee buyers, sellers, and investors from Realtor Lucas Murphy.`, h1: name, intro: `${name} for the Milwaukee, Waukesha, Ozaukee, and Washington county area, from Lucas Murphy.` };
}

/* ----------------------------- render ----------------------------- */
function jsonLd(path: string, meta: Meta): string {
  const nodes: object[] = [organization(), webSite(), person(), realEstateAgent()];
  if (path !== "/") nodes.push(breadcrumb(path));
  if (meta.faq) nodes.push(faqPage(meta.faq));
  const doc = { "@context": "https://schema.org", "@graph": nodes };
  return `<script type="application/ld+json">${JSON.stringify(doc)}</script>`;
}

function contentBlock(path: string, meta: Meta): string {
  const links = [
    ["/", "Home"], ["/about", "About Lucas Murphy"], ["/market", "Market data"],
    ["/listings", "Search homes"], ["/guides", "Guides"], ["/tools", "Tools"],
    ["/vendors", "Trusted vendors"], ["/contact", "Contact"],
  ].map(([href, label]) => `<a href="${href}">${esc(label)}</a>`).join(" · ");
  const faqHtml = meta.faq
    ? `<section><h2>Frequently asked questions</h2>${meta.faq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}</section>`
    : "";
  return [
    `<div id="seo-fallback">`,
    `<h1>${esc(meta.h1)}</h1>`,
    `<p>${esc(meta.intro)}</p>`,
    `<p>${esc(siteConfig.agent.name)}, ${esc(siteConfig.agent.jobTitle)} - ${esc(siteConfig.brokerage)}. `,
    `Phone: <a href="tel:${siteConfig.phoneE164}">${esc(siteConfig.phone)}</a>. `,
    `Email: <a href="mailto:${siteConfig.email}">${esc(siteConfig.email)}</a>.</p>`,
    ...(meta.pdf ?? []).map(
      (f) => `<p><a href="${f.href}" download>${esc(f.label)}</a> (PDF)</p>`,
    ),
    faqHtml,
    `<nav>${links}</nav>`,
    `</div>`,
  ].join("");
}

function buildHtml(template: string, path: string): string {
  const meta = metaFor(path);
  const canonical = abs(path);
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(meta.title)}</title>`);
  html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${esc(meta.description)}" />`);
  html = html.replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${canonical}">`);
  html = html.replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${esc(meta.title)}">`);
  html = html.replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${esc(meta.description)}">`);
  html = html.replace(/<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${esc(meta.title)}">`);
  html = html.replace(/<meta name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${esc(meta.description)}">`);
  // canonical + JSON-LD before </head>
  html = html.replace(/<\/head>/i, `    <link rel="canonical" href="${canonical}" />\n    ${jsonLd(path, meta)}\n  </head>`);
  // crawlable content inside #root (React replaces it on mount via createRoot)
  html = html.replace(/<div id="root">\s*<\/div>/i, `<div id="root">${contentBlock(path, meta)}</div>`);
  return html;
}

/* ----------------------------- run ----------------------------- */
const indexPath = resolve(distDir, "index.html");
if (!existsSync(indexPath)) {
  console.warn("seo-prerender: dist/index.html not found, skipping");
  process.exit(0);
}
const template = readFileSync(indexPath, "utf8");
const routes = getAllRoutes().filter((r) => !r.noindex);
let count = 0;
for (const route of routes) {
  const html = buildHtml(template, route.path);
  const outDir = resolve(distDir, route.path === "/" ? "." : `.${route.path}`);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), html, "utf8");
  count++;
}
console.log(`seo-prerender: wrote ${count} static HTML pages with meta + JSON-LD + crawlable content`);
