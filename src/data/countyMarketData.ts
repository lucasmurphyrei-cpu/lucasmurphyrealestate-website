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
    dataMonth: "July 2026",
    videoUrl: "https://youtu.be/whiCnNo1QjE",
    stats: [
      { label: "Median Price", value: "$550,000", change: "+2.8% YoY", direction: "up" },
      { label: "Days on Market", value: "5 days", change: "0% YoY", direction: "flat" },
      { label: "Sale-to-List Ratio", value: "102.3%", change: "+0.3% YoY", direction: "up" },
      { label: "Months' Supply", value: "1.95 months", change: "+5.4% YoY", direction: "up" },
      { label: "Inventory", value: "1,086 homes", change: "+6.9% YoY", direction: "up" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },
  "Milwaukee County": {
    dataMonth: "July 2026",
    videoUrl: "https://youtu.be/n8fUNLKKq4s",
    stats: [
      { label: "Median Price", value: "$325,000", change: "+4.8% YoY", direction: "up" },
      { label: "Days on Market", value: "6 days", change: "+20.0% YoY", direction: "up" },
      { label: "Sale-to-List Ratio", value: "102.2%", change: "+0.2% YoY", direction: "up" },
      { label: "Months' Supply", value: "1.6 months", change: "+3.9% YoY", direction: "up" },
      { label: "Inventory", value: "1,183 homes", change: "+12.5% YoY", direction: "up" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },
  "Ozaukee County": {
    dataMonth: "July 2026",
    videoUrl: "https://youtu.be/MKfWW9HWgpI",
    stats: [
      { label: "Median Price", value: "$577,500", change: "+3.9% YoY", direction: "up" },
      { label: "Days on Market", value: "4 days", change: "-42.9% YoY", direction: "down" },
      { label: "Sale-to-List Ratio", value: "101.4%", change: "0% YoY", direction: "flat" },
      { label: "Months' Supply", value: "1.9 months", change: "+22.6% YoY", direction: "up" },
      { label: "Inventory", value: "188 homes", change: "+19.0% YoY", direction: "up" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },
  "Washington County": {
    dataMonth: "July 2026",
    videoUrl: "https://youtu.be/gyVZC7zS2Xs",
    stats: [
      { label: "Median Price", value: "$475,000", change: "+3.3% YoY", direction: "up" },
      { label: "Days on Market", value: "6 days", change: "0% YoY", direction: "flat" },
      { label: "Sale-to-List Ratio", value: "101.9%", change: "+0.7% YoY", direction: "up" },
      { label: "Months' Supply", value: "1.8 months", change: "-3.9% YoY", direction: "down" },
      { label: "Inventory", value: "242 homes", change: "-3.2% YoY", direction: "down" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },
};

export default countyMarketData;
