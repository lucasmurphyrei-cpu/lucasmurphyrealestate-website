// scripts/routes.ts
import { getAllMunicipalityRoutes } from "../src/data/municipalityLookup";

export interface RouteEntry {
  path: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
  noindex?: boolean;
}

const STATIC_ROUTES: RouteEntry[] = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/about", changefreq: "monthly", priority: 0.7 },
  { path: "/services", changefreq: "monthly", priority: 0.8 },
  { path: "/buying", changefreq: "monthly", priority: 0.7 },
  { path: "/selling", changefreq: "monthly", priority: 0.7 },
  { path: "/investing", changefreq: "monthly", priority: 0.7 },
  { path: "/contact", changefreq: "monthly", priority: 0.8 },
  { path: "/guides", changefreq: "weekly", priority: 0.9 },
  { path: "/guides/first-time-home-buyers", changefreq: "monthly", priority: 0.8 },
  { path: "/guides/relocation", changefreq: "monthly", priority: 0.7 },
  { path: "/guides/first-time-condo-buyers", changefreq: "monthly", priority: 0.7 },
  { path: "/guides/house-hacking", changefreq: "monthly", priority: 0.7 },
  { path: "/guides/sellers", changefreq: "monthly", priority: 0.7 },
  { path: "/guides/investors", changefreq: "monthly", priority: 0.7 },
  { path: "/first-time-homebuyers-guide", changefreq: "monthly", priority: 0.9 },
  { path: "/tools", changefreq: "monthly", priority: 0.8 },
  { path: "/tools/seller-net-sheet", changefreq: "monthly", priority: 0.6 },
  { path: "/tools/mortgage-calculator", changefreq: "monthly", priority: 0.7 },
  { path: "/tools/budget-planner", changefreq: "monthly", priority: 0.6 },
  { path: "/tools/budget-planner/quick", changefreq: "monthly", priority: 0.5 },
  { path: "/tools/budget-planner/in-depth", changefreq: "monthly", priority: 0.5 },
  { path: "/tools/budget-spreadsheet", changefreq: "monthly", priority: 0.6 },
  { path: "/tools/cma", changefreq: "monthly", priority: 0.6 },
  { path: "/tools/house-hack-calculator", changefreq: "monthly", priority: 0.7 },
  { path: "/tools/investor-spreadsheets", changefreq: "monthly", priority: 0.6 },
  { path: "/vendors", changefreq: "monthly", priority: 0.7 },
  { path: "/listings", changefreq: "weekly", priority: 0.8 },
  { path: "/resources/contractors", changefreq: "monthly", priority: 0.6 },
  { path: "/resources/lenders", changefreq: "monthly", priority: 0.6 },
  { path: "/resources/home-inspectors", changefreq: "monthly", priority: 0.6 },
  { path: "/resources/home-insurance", changefreq: "monthly", priority: 0.6 },
  { path: "/resources/seasonal-guide", changefreq: "monthly", priority: 0.6 },
  { path: "/resources/movers", changefreq: "monthly", priority: 0.6 },
];

const COUNTY_SLUGS = [
  "milwaukee-county",
  "waukesha-county",
  "ozaukee-county",
  "washington-county",
];

const LISTINGS_ROUTES: RouteEntry[] = COUNTY_SLUGS.map((slug) => ({
  path: `/listings/${slug}`,
  changefreq: "weekly",
  priority: 0.7,
}));

const MARKET_ROUTES: RouteEntry[] = [
  { path: "/market", changefreq: "weekly", priority: 0.9 },
  ...COUNTY_SLUGS.map((slug) => ({
    path: `/market/${slug}`,
    changefreq: "weekly" as const,
    priority: 0.8,
  })),
  ...getAllMunicipalityRoutes().map((r) => ({
    path: `/market/${r.countySlug}/${r.muniSlug}`,
    changefreq: "monthly" as const,
    priority: 0.6,
  })),
];

export function getAllRoutes(): RouteEntry[] {
  return [...STATIC_ROUTES, ...LISTINGS_ROUTES, ...MARKET_ROUTES];
}
