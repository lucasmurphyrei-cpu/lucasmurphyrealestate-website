import { TrendingUp, TrendingDown, Minus, Home, Clock, DollarSign, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { RealEstateTrends, ApiData } from "@/data/neighborhoodTypes";

interface RealEstateTrendsCardProps {
  trends: RealEstateTrends;
  apiData: ApiData;
}

function yoyDirection(yoy: number | null): "up" | "down" | "flat" {
  if (yoy === null || yoy === 0) return "flat";
  return yoy > 0 ? "up" : "down";
}

function formatYoY(yoy: number | null): string {
  if (yoy === null) return "N/A";
  const sign = yoy > 0 ? "+" : "";
  return `${sign}${yoy.toFixed(1)}% YoY`;
}

function formatPrice(val: number | null): string {
  if (val === null) return "N/A";
  return `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function formatDays(val: number | null): string {
  if (val === null) return "N/A";
  return `${val} days`;
}

function formatPpsf(val: number | null): string {
  if (val === null) return "N/A";
  return `$${Math.round(val)}/sqft`;
}

const directionIcon = (dir: "up" | "down" | "flat") => {
  if (dir === "up") return <TrendingUp className="h-4 w-4" />;
  if (dir === "down") return <TrendingDown className="h-4 w-4" />;
  return <Minus className="h-4 w-4" />;
};

const directionColor = (dir: "up" | "down" | "flat") => {
  if (dir === "up") return "text-emerald-600";
  if (dir === "down") return "text-red-500";
  return "text-muted-foreground";
};

const RealEstateTrendsCard = ({ trends, apiData }: RealEstateTrendsCardProps) => {
  const { redfin } = apiData;

  const items = [
    {
      label: "Median Sale Price",
      icon: Home,
      value: formatPrice(redfin.median_sale_price),
      change: formatYoY(redfin.median_sale_price_yoy),
      direction: yoyDirection(redfin.median_sale_price_yoy),
    },
    {
      label: "Days on Market",
      icon: Clock,
      value: formatDays(redfin.median_dom),
      change: redfin.median_dom_yoy !== null ? `${redfin.median_dom_yoy > 0 ? "+" : ""}${redfin.median_dom_yoy} days YoY` : "N/A",
      direction: redfin.median_dom_yoy !== null ? (redfin.median_dom_yoy < 0 ? "up" as const : redfin.median_dom_yoy > 0 ? "down" as const : "flat" as const) : "flat" as const,
    },
    {
      label: "Price per Sq Ft",
      icon: DollarSign,
      value: formatPpsf(redfin.median_ppsf),
      change: formatYoY(redfin.median_ppsf_yoy),
      direction: yoyDirection(redfin.median_ppsf_yoy),
    },
    {
      label: "Market Competitiveness",
      icon: BarChart3,
      value: redfin.sale_to_list !== null ? `${(redfin.sale_to_list * 100).toFixed(1)}% sale-to-list` : "N/A",
      change: redfin.homes_sold !== null ? `${redfin.homes_sold} homes sold` : "",
      direction: "flat" as const,
    },
  ];

  return (
    <section className="mb-10">
      <h2 className="font-display text-2xl font-bold mb-1">Real Estate Trends</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Data from Redfin, period ending {redfin.latest_period}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(({ label, icon: Icon, value, change, direction }) => (
          <Card key={label}>
            <CardContent className="flex items-start gap-3 p-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 text-lg font-bold">{value}</p>
                {change && (
                  <div className={`mt-1 flex items-center gap-1 text-xs ${directionColor(direction)}`}>
                    {directionIcon(direction)}
                    <span>{change}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground italic">
        {trends.market_competitiveness}
      </p>
    </section>
  );
};

export default RealEstateTrendsCard;
