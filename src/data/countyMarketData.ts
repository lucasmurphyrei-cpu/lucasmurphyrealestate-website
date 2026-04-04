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
    dataMonth: "April 2026",
    videoUrl: "https://youtu.be/VaXvDL6OgMU",
    stats: [
      { label: "Median Price", value: "$507,473", change: "+1.5% YoY", direction: "up" },
      { label: "Days on Market", value: "6 days", change: "0% YoY", direction: "flat" },
      { label: "Sale-to-List Ratio", value: "101.6%", change: "+2.3% YoY", direction: "up" },
      { label: "Months' Supply", value: "2.43 months", change: "+15.6% YoY", direction: "up" },
      { label: "Inventory", value: "807 homes", change: "+24.2% YoY", direction: "up" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },
  "Milwaukee County": {
    dataMonth: "April 2026",
    videoUrl: "https://youtu.be/ZjBwg5Kt23w",
    stats: [
      { label: "Median Price", value: "$300,000", change: "+14.3% YoY", direction: "up" },
      { label: "Days on Market", value: "7 days", change: "-22.2% YoY", direction: "down" },
      { label: "Sale-to-List Ratio", value: "101.0%", change: "+1.1% YoY", direction: "up" },
      { label: "Months' Supply", value: "2.0 months", change: "+4.9% YoY", direction: "up" },
      { label: "Inventory", value: "950 homes", change: "+12.6% YoY", direction: "up" },
      { label: "New Listings", value: "754", change: "+20.8% YoY", direction: "up" },
    ],
  },
  "Ozaukee County": {
    dataMonth: "April 2026",
    videoUrl: "https://youtu.be/9XolZYyJHuE",
    stats: [
      { label: "Median Price", value: "$506,000", change: "+83.3% YoY", direction: "up" },
      { label: "Days on Market", value: "7 days", change: "+40.0% YoY", direction: "up" },
      { label: "Sale-to-List Ratio", value: "102.0%", change: "+0.7% YoY", direction: "up" },
      { label: "Months' Supply", value: "2.0 months", change: "-9.1% YoY", direction: "down" },
      { label: "Inventory", value: "180 homes", change: "+5.9% YoY", direction: "up" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },
  "Washington County": {
    dataMonth: "April 2026",
    videoUrl: "https://youtu.be/Li9HgRgckW4",
    stats: [
      { label: "Median Price", value: "$455,000", change: "-2.6% YoY", direction: "down" },
      { label: "Days on Market", value: "11 days", change: "-21.4% YoY", direction: "down" },
      { label: "Sale-to-List Ratio", value: "99.7%", change: "-0.3% YoY", direction: "down" },
      { label: "Months' Supply", value: "2.8 months", change: "-3.4% YoY", direction: "down" },
      { label: "Inventory", value: "204 homes", change: "+15.3% YoY", direction: "up" },
      { label: "New Listings", value: "125", change: "+20.2% YoY", direction: "up" },
    ],
  },
};

export default countyMarketData;
