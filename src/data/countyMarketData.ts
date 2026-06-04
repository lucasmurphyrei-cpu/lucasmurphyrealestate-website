/**
 * County market stats pulled from RapidStats monthly reports.
 *
 * To update: replace the values after running your monthly
 * automation workflow (automate_monthly_report.py).
 * Each county key matches the county `name` prop in the page components.
 */

export interface MarketStat {
  label: string;
  value: string;
  change: string; // e.g. "+4.0% YoY"
  direction: "up" | "down" | "flat";
}

export interface CountyMarketData {
  dataMonth: string; // e.g. "January 2026"
  videoUrl?: string; // YouTube market update video for the month
  stats: MarketStat[];
}

const countyMarketData: Record<string, CountyMarketData> = {
  "Waukesha County": {
    dataMonth: "June 2026",
    videoUrl: "https://youtu.be/10i3cLQh15U",
    stats: [
      { label: "Median Price", value: "$539,950", change: "-0.9% YoY", direction: "down" },
      { label: "Days on Market", value: "5 days", change: "0% YoY", direction: "flat" },
      { label: "Sale-to-List Ratio", value: "102.4%", change: "+0.5% YoY", direction: "up" },
      { label: "Months' Supply", value: "1.9 months", change: "0% YoY", direction: "flat" },
      { label: "Inventory", value: "755 homes", change: "+0.5% YoY", direction: "up" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },
  "Milwaukee County": {
    dataMonth: "June 2026",
    videoUrl: "https://youtu.be/IKy18NigCmw",
    stats: [
      { label: "Median Price", value: "$312,600", change: "+5.1% YoY", direction: "up" },
      { label: "Days on Market", value: "5 days", change: "0% YoY", direction: "flat" },
      { label: "Sale-to-List Ratio", value: "102.5%", change: "+0.1% YoY", direction: "up" },
      { label: "Months' Supply", value: "1.8 months", change: "+20.0% YoY", direction: "up" },
      { label: "Inventory", value: "1,181 homes", change: "+17.5% YoY", direction: "up" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },
  "Ozaukee County": {
    dataMonth: "June 2026",
    stats: [
      { label: "Median Price", value: "$555,000", change: "+20.7% YoY", direction: "up" },
      { label: "Days on Market", value: "5 days", change: "-37.5% YoY", direction: "down" },
      { label: "Sale-to-List Ratio", value: "102.1%", change: "+1.0% YoY", direction: "up" },
      { label: "Months' Supply", value: "2.0 months", change: "-13.0% YoY", direction: "down" },
      { label: "Inventory", value: "171 homes", change: "-6.6% YoY", direction: "down" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },
  "Washington County": {
    dataMonth: "June 2026",
    videoUrl: "https://youtu.be/CEilODd7ooY",
    stats: [
      { label: "Median Price", value: "$481,000", change: "+10.6% YoY", direction: "up" },
      { label: "Days on Market", value: "5 days", change: "-37.5% YoY", direction: "down" },
      { label: "Sale-to-List Ratio", value: "100.5%", change: "-0.1% YoY", direction: "down" },
      { label: "Months' Supply", value: "2.09 months", change: "-3.2% YoY", direction: "down" },
      { label: "Inventory", value: "377 homes", change: "+5.6% YoY", direction: "up" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },
};

export default countyMarketData;
