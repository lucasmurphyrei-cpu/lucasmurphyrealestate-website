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
  stats: MarketStat[];
}

const countyMarketData: Record<string, CountyMarketData> = {
  "Waukesha County": {
    dataMonth: "January 2026",
    stats: [
      { label: "Median Price", value: "$519,900", change: "+4.0% YoY", direction: "up" },
      { label: "Days on Market", value: "37 days", change: "+5.7% YoY", direction: "up" },
      { label: "Sale-to-List Ratio", value: "97.9%", change: "+0.3% YoY", direction: "up" },
      { label: "Months' Supply", value: "2.9 months", change: "+16.5% YoY", direction: "up" },
      { label: "Inventory", value: "451 homes", change: "+3.2% YoY", direction: "up" },
      { label: "New Listings", value: "264", change: "+10.9% YoY", direction: "up" },
    ],
  },

  "Milwaukee County": {
    dataMonth: "January 2026",
    stats: [
      { label: "Median Price", value: "$282,000", change: "+10.6% YoY", direction: "up" },
      { label: "Days on Market", value: "31 days", change: "-6.1% YoY", direction: "down" },
      { label: "Sale-to-List Ratio", value: "97.2%", change: "-0.4% YoY", direction: "down" },
      { label: "Months' Supply", value: "2.8 months", change: "+25.1% YoY", direction: "up" },
      { label: "Inventory", value: "809 homes", change: "-1.0% YoY", direction: "down" },
      { label: "New Listings", value: "512", change: "-1.5% YoY", direction: "down" },
    ],
  },

  "Ozaukee County": {
    dataMonth: "January 2026",
    stats: [
      { label: "Median Price", value: "—", change: "—", direction: "flat" },
      { label: "Days on Market", value: "—", change: "—", direction: "flat" },
      { label: "Sale-to-List Ratio", value: "—", change: "—", direction: "flat" },
      { label: "Months' Supply", value: "—", change: "—", direction: "flat" },
      { label: "Inventory", value: "—", change: "—", direction: "flat" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },

  "Washington County": {
    dataMonth: "January 2026",
    stats: [
      { label: "Median Price", value: "—", change: "—", direction: "flat" },
      { label: "Days on Market", value: "—", change: "—", direction: "flat" },
      { label: "Sale-to-List Ratio", value: "—", change: "—", direction: "flat" },
      { label: "Months' Supply", value: "—", change: "—", direction: "flat" },
      { label: "Inventory", value: "—", change: "—", direction: "flat" },
      { label: "New Listings", value: "—", change: "—", direction: "flat" },
    ],
  },
};

export default countyMarketData;
