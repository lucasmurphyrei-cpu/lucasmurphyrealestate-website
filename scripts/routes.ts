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
  { path: "/contact", changefreq: "monthly", priority: 0.8 },
  { path: "/guides", changefreq: "weekly", priority: 0.9 },
  { path: "/guides/first-time-home-buyers", changefreq: "monthly", priority: 0.8 },
  { path: "/guides/first-time-condo-buyers", changefreq: "monthly", priority: 0.7 },
  { path: "/guides/relocation", changefreq: "monthly", priority: 0.7 },
  { path: "/guides/investors", changefreq: "monthly", priority: 0.7 },
  { path: "/guides/sellers", changefreq: "monthly", priority: 0.7 },
  { path: "/first-time-homebuyers-guide", changefreq: "monthly", priority: 0.9 },
  { path: "/resources/contractors", changefreq: "monthly", priority: 0.6 },
  { path: "/resources/lenders", changefreq: "monthly", priority: 0.6 },
  { path: "/resources/home-inspectors", changefreq: "monthly", priority: 0.6 },
  { path: "/resources/home-insurance", changefreq: "monthly", priority: 0.6 },
  { path: "/resources/seasonal-guide", changefreq: "monthly", priority: 0.6 },
  { path: "/resources/movers", changefreq: "monthly", priority: 0.6 },
  { path: "/tools/mortgage-calculator", changefreq: "monthly", priority: 0.7 },
  { path: "/tools/budget-spreadsheet", changefreq: "monthly", priority: 0.6 },
  { path: "/tools/budget-planner", changefreq: "monthly", priority: 0.6 },
  { path: "/tools/house-hack-calculator", changefreq: "monthly", priority: 0.7 },
  { path: "/tools/investor-spreadsheets", changefreq: "monthly", priority: 0.6 },
  { path: "/tools/cma", changefreq: "monthly", priority: 0.6 },
];

const COUNTY_SLUGS = [
  "milwaukee-county",
  "waukesha-county",
  "ozaukee-county",
  "washington-county",
];

const COUNTY_ROUTES: RouteEntry[] = COUNTY_SLUGS.map((slug) => ({
  path: `/areas/${slug}`,
  changefreq: "weekly",
  priority: 0.8,
}));

const MUNICIPALITY_ROUTES: RouteEntry[] = getAllMunicipalityRoutes().map((r) => ({
  path: `/areas/${r.countySlug}/${r.muniSlug}`,
  changefreq: "monthly",
  priority: 0.6,
}));

// Preview routes: prerendered for QA but excluded from the sitemap (noindex).
const PREVIEW_ROUTES: RouteEntry[] = [
  { path: "/preview/v1", changefreq: "monthly", priority: 0.1, noindex: true },
  { path: "/preview/v2", changefreq: "monthly", priority: 0.1, noindex: true },
];

export function getAllRoutes(): RouteEntry[] {
  return [...STATIC_ROUTES, ...COUNTY_ROUTES, ...MUNICIPALITY_ROUTES, ...PREVIEW_ROUTES];
}
