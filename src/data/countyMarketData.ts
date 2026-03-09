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
    dataMonth: "March 2026",
    videoUrl: "https://youtu.be/ihRhS0viuG4",
    stats: [
      { label: "Median Price", value: "$476,000", change: "+3.5% YoY", direction: "up" },
      { label: "Days on Market", value: "14 days", change: "+40.0% YoY", direction: "up" },
      { label: "Sale-to-List Ratio", value: "99.3%", change: "-0.2% YoY", direction: "down" },
      { label: "Months' Supply", value: "2.9 months", change: "+16.0% YoY", direction: "up" },
      { label: "Inventory", value: "731 homes", change: "+17.5% YoY", direction: "up" },
      { label: "New Listings", value: "278", change: "+22.5% YoY", direction: "up" },
    ],
  },
  "Milwaukee County": {
    dataMonth: "March 2026",
    videoUrl: "https://youtu.be/c7Vn4WqsLqU",
    stats: [
      { label: "Median Price", value: "$290,000", change: "+6.1% YoY", direction: "up" },
      { label: "Days on Market", value: "15 days", change: "+66.7% YoY", direction: "up" },
      { label: "Sale-to-List Ratio", value: "98.9%", change: "+1.0% YoY", direction: "up" },
      { label: "Months' Supply", value: "2.5 months", change: "+12.3% YoY", direction: "up" },
      { label: "Inventory", value: "881 homes", change: "+6.0% YoY", direction: "up" },
      { label: "New Listings", value: "606", change: "+17.3% YoY", direction: "up" },
    ],
  },
  "Ozaukee County": {
    dataMonth: "March 2026",
    videoUrl: "https://youtu.be/py1_oN8EufM",
    stats: [
      { label: "Median Price", value: "$490,000", change: "+2.0% YoY", direction: "up" },
      { label: "Days on Market", value: "16 days", change: "+100.0% YoY", direction: "up" },
      { label: "Sale-to-List Ratio", value: "99.2%", change: "0% YoY", direction: "flat" },
      { label: "Months' Supply", value: "2.93 months", change: "-15.8% YoY", direction: "down" },
      { label: "Inventory", value: "179 homes", change: "+2.9% YoY", direction: "up" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },
  "Washington County": {
    dataMonth: "March 2026",
    videoUrl: "https://youtu.be/42wD7lrU7pM",
    stats: [
      { label: "Median Price", value: "$430,000", change: "+2.4% YoY", direction: "up" },
      { label: "Days on Market", value: "24 days", change: "+4.3% YoY", direction: "up" },
      { label: "Sale-to-List Ratio", value: "98.2%", change: "-0.2% YoY", direction: "down" },
      { label: "Months' Supply", value: "4.3 months", change: "+59.3% YoY", direction: "up" },
      { label: "Inventory", value: "175 homes", change: "+10.8% YoY", direction: "up" },
      { label: "New Listings", value: "88", change: "+12.8% YoY", direction: "up" },
    ],
  },
};

export default countyMarketData;
