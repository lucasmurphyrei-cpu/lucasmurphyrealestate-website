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
    dataMonth: "August 2026",
    videoUrl: "https://youtu.be/RLk3PRhdSxo",
    stats: [
      { label: "Median Price", value: "$525,000", change: "-4.5% YoY", direction: "down" },
      { label: "Days on Market", value: "5 days", change: "0% YoY", direction: "flat" },
      { label: "Sale-to-List Ratio", value: "102.1%", change: "+0.8% YoY", direction: "up" },
      { label: "Months' Supply", value: "2.15 months", change: "+15.0% YoY", direction: "up" },
      { label: "Inventory", value: "1,108 homes", change: "+11.9% YoY", direction: "up" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },
  "Milwaukee County": {
    dataMonth: "August 2026",
    videoUrl: "https://youtu.be/99M-zlodluI",
    stats: [
      { label: "Median Price", value: "$325,000", change: "+4.8% YoY", direction: "up" },
      { label: "Days on Market", value: "7 days", change: "+16.7% YoY", direction: "up" },
      { label: "Sale-to-List Ratio", value: "101.5%", change: "-0.6% YoY", direction: "down" },
      { label: "Months' Supply", value: "1.9 months", change: "+24.4% YoY", direction: "up" },
      { label: "Inventory", value: "1,283 homes", change: "+22.0% YoY", direction: "up" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },
  "Ozaukee County": {
    dataMonth: "August 2026",
    videoUrl: "https://youtu.be/QcjUeJiWX_8",
    stats: [
      { label: "Median Price", value: "$525,000", change: "+2.4% YoY", direction: "up" },
      { label: "Days on Market", value: "5 days", change: "-28.6% YoY", direction: "down" },
      { label: "Sale-to-List Ratio", value: "101.8%", change: "+1.1% YoY", direction: "up" },
      { label: "Months' Supply", value: "1.7 months", change: "-13.1% YoY", direction: "down" },
      { label: "Inventory", value: "173 homes", change: "+8.1% YoY", direction: "up" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },
  "Washington County": {
    dataMonth: "August 2026",
    videoUrl: "https://youtu.be/ks7i46ZA-BU",
    stats: [
      { label: "Median Price", value: "$481,000", change: "+6.9% YoY", direction: "up" },
      { label: "Days on Market", value: "9 days", change: "+28.6% YoY", direction: "up" },
      { label: "Sale-to-List Ratio", value: "101.1%", change: "+0.4% YoY", direction: "up" },
      { label: "Months' Supply", value: "2.1 months", change: "-19.0% YoY", direction: "down" },
      { label: "Inventory", value: "362 homes", change: "-12.6% YoY", direction: "down" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },
};

export default countyMarketData;
