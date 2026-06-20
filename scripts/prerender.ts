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
const realEstateAgent = () => ({
  "@type": "RealEstateAgent",
  "@id": `${ORIGIN}/#agent`,
  name: siteConfig.agent.name,
  jobTitle: siteConfig.agent.jobTitle,
  worksFor: { "@id": `${ORIGIN}/#brokerage` },
  url: ORIGIN,
  image: `${ORIGIN}${siteConfig.defaultOgImage}`,
  email: siteConfig.email,
  telephone: siteConfig.phoneE164,
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
type Meta = { title: string; description: string; h1: string; intro: string; faq?: { q: string; a: string }[] };

const AGENT_FAQ = [
  { q: "Who is Lucas Murphy?", a: siteConfig.agent.description },
  { q: "What areas does Lucas Murphy serve?", a: "Lucas Murphy serves the Metro Milwaukee area, including Milwaukee, Waukesha, Ozaukee, and Washington counties in Wisconsin." },
  { q: "How can I contact Lucas Murphy?", a: `You can reach Lucas Murphy at ${siteConfig.phone} or ${siteConfig.email}, or schedule a consultation online.` },
];

const META: Record<string, Meta> = {
  "/": {
    title: "Lucas Murphy Real Estate | Milwaukee Metro Homes, Market Data & Guides",
    description: "Lucas Murphy, Realtor with eXp Realty, helps buyers, sellers, and investors across Milwaukee, Waukesha, Ozaukee & Washington counties with live market data, free guides, and tools.",
    h1: "Lucas Murphy — Metro Milwaukee Real Estate",
    intro: siteConfig.agent.description,
    faq: AGENT_FAQ,
  },
  "/about": {
    title: "About Lucas Murphy | Metro Milwaukee Realtor (eXp Realty)",
    description: "Meet Lucas Murphy, a licensed Realtor with the Provision Properties Core Team at eXp Realty serving buyers, sellers, and investors across metro Milwaukee, Wisconsin.",
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
  "/investing": { title: "Real Estate Investing in Metro Milwaukee | Lucas Murphy", description: "House hacking, rentals, and investment property analysis across metro Milwaukee with Realtor Lucas Murphy.", h1: "Real Estate Investing", intro: "Investment real estate guidance — including house hacking and rental analysis — across metro Milwaukee with Lucas Murphy." },
  "/guides": { title: "Free Real Estate Guides | Metro Milwaukee | Lucas Murphy", description: "Free buyer, seller, relocation, condo, and house-hacking guides for metro Milwaukee from Realtor Lucas Murphy.", h1: "Metro Milwaukee Real Estate Guides", intro: "Free, practical guides for buying, selling, relocating, and investing in metro Milwaukee from Lucas Murphy." },
  "/tools": { title: "Free Real Estate Calculators & Tools | Lucas Murphy", description: "Free mortgage, budget, CMA, seller net sheet, and house-hack calculators for metro Milwaukee buyers, sellers, and investors.", h1: "Real Estate Tools & Calculators", intro: "Free calculators to plan a budget, value a home, and analyze a deal across metro Milwaukee, from Lucas Murphy." },
  "/listings": { title: "Search Homes for Sale in Metro Milwaukee | Lucas Murphy", description: "Search active listings across Milwaukee, Waukesha, Ozaukee, and Washington counties with Realtor Lucas Murphy.", h1: "Search Metro Milwaukee Homes", intro: "Browse active homes for sale across metro Milwaukee by county and community with Lucas Murphy." },
  "/market": { title: "Metro Milwaukee Real Estate Market Data | Lucas Murphy", description: "Live real estate market data and trends for Milwaukee, Waukesha, Ozaukee, and Washington counties, by Realtor Lucas Murphy.", h1: "Metro Milwaukee Market Data", intro: "Explore current real estate market data and trends across metro Milwaukee, county by county, with Lucas Murphy." },
  "/vendors": { title: "Trusted Local Vendors | Metro Milwaukee | Lucas Murphy", description: "A vetted network of metro Milwaukee lenders, inspectors, contractors, insurance agents, and movers recommended by Lucas Murphy.", h1: "Trusted Metro Milwaukee Vendors", intro: "A vetted network of local pros — lenders, inspectors, contractors, insurance, and movers — recommended by Lucas Murphy." },
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
  const nodes: object[] = [organization(), webSite(), realEstateAgent()];
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
    `<p>${esc(siteConfig.agent.name)}, ${esc(siteConfig.agent.jobTitle)} — ${esc(siteConfig.brokerage)}. `,
    `Phone: <a href="tel:${siteConfig.phoneE164}">${esc(siteConfig.phone)}</a>. `,
    `Email: <a href="mailto:${siteConfig.email}">${esc(siteConfig.email)}</a>.</p>`,
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
