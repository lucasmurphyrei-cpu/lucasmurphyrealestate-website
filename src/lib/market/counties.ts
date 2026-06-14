import countyMarketData, { CountyMarketData } from "@/data/countyMarketData";

export const COUNTY_SLUGS = [
  "milwaukee-county",
  "waukesha-county",
  "ozaukee-county",
  "washington-county",
] as const;

export type CountySlug = (typeof COUNTY_SLUGS)[number];

export function countySlugToDisplay(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getCountySnapshot(slug: string): CountyMarketData | null {
  return countyMarketData[countySlugToDisplay(slug)] ?? null;
}
