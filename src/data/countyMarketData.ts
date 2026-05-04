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
    dataMonth: "May 2026",
    videoUrl: "https://youtu.be/gTxZ4Gb5aqQ",
    stats: [
      { label: "Median Price", value: "$520,000", change: "+6.1% YoY", direction: "up" },
      { label: "Days on Market", value: "5 days", change: "0% YoY", direction: "flat" },
      { label: "Sale-to-List Ratio", value: "101.4%", change: "-0.4% YoY", direction: "down" },
      { label: "Months' Supply", value: "2.2 months", change: "+7.2% YoY", direction: "up" },
      { label: "Inventory", value: "901 homes", change: "+16.6% YoY", direction: "up" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },
  "Milwaukee County": {
    dataMonth: "May 2026",
    videoUrl: "https://youtu.be/Ad6EU98kr7U",
    stats: [
      { label: "Median Price", value: "$305,000", change: "+1.7% YoY", direction: "up" },
      { label: "Days on Market", value: "6 days", change: "0% YoY", direction: "flat" },
      { label: "Sale-to-List Ratio", value: "100.7%", change: "-1.0% YoY", direction: "down" },
      { label: "Months' Supply", value: "2.0 months", change: "+25.0% YoY", direction: "up" },
      { label: "Inventory", value: "1,126 homes", change: "+27.2% YoY", direction: "up" },
      { label: "New Listings", value: "928", change: "+25.6% YoY", direction: "up" },
    ],
  },
  "Ozaukee County": {
    dataMonth: "May 2026",
    videoUrl: "https://youtu.be/4qsFuyPwcec",
    stats: [
      { label: "Median Price", value: "$600,000", change: "+16.5% YoY", direction: "up" },
      { label: "Days on Market", value: "5 days", change: "-16.7% YoY", direction: "down" },
      { label: "Sale-to-List Ratio", value: "101.7%", change: "+1.0% YoY", direction: "up" },
      { label: "Months' Supply", value: "2.2 months", change: "-15.4% YoY", direction: "down" },
      { label: "Inventory", value: "160 homes", change: "+2.6% YoY", direction: "up" },
      { label: "New Listings", value: "115", change: "+23.7% YoY", direction: "up" },
    ],
  },
  "Washington County": {
    dataMonth: "May 2026",
    videoUrl: "https://youtu.be/mU-3_xR3rGo",
    stats: [
      { label: "Median Price", value: "$485,000", change: "+19.1% YoY", direction: "up" },
      { label: "Days on Market", value: "20 days", change: "+300.0% YoY", direction: "up" },
      { label: "Sale-to-List Ratio", value: "101.0%", change: "+0.6% YoY", direction: "up" },
      { label: "Months' Supply", value: "2.7 months", change: "+42.1% YoY", direction: "up" },
      { label: "Inventory", value: "239 homes", change: "+27.8% YoY", direction: "up" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },
};

export default countyMarketData;
