import {
  Home,
  Clock,
  Percent,
  CalendarDays,
  ClipboardList,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import type { CountyMarketData } from "@/data/countyMarketData";

const iconMap: Record<string, React.ElementType> = {
  "Median Price": Home,
  "Days on Market": Clock,
  "Sale-to-List Ratio": Percent,
  "Months' Supply": CalendarDays,
  "Inventory": ClipboardList,
  "New Listings": PlusCircle,
};

const directionIcon = (dir: "up" | "down" | "flat") => {
  if (dir === "up") return <TrendingUp className="h-3.5 w-3.5" />;
  if (dir === "down") return <TrendingDown className="h-3.5 w-3.5" />;
  return <Minus className="h-3.5 w-3.5" />;
};

const directionColor = (dir: "up" | "down" | "flat") => {
  if (dir === "up") return "text-emerald-600";
  if (dir === "down") return "text-red-500";
  return "text-muted-foreground";
};

interface MarketSnapshotProps {
  countyName: string;
  data: CountyMarketData;
}

const MarketSnapshot = ({ countyName, data }: MarketSnapshotProps) => {
  return (
    <div className="mt-10 rounded-xl border border-border bg-card p-6 md:p-8">
      <div className="flex flex-col gap-1 mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-light-blue">
          Market Snapshot
        </p>
        <h3 className="font-display text-xl font-bold md:text-2xl">
          {countyName} — {data.dataMonth} Data
        </h3>
        <p className="text-sm text-muted-foreground">
          Key stats from the latest RapidStats MLS report.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {data.stats.map((stat) => {
          const Icon = iconMap[stat.label] ?? ClipboardList;
          return (
            <div
              key={stat.label}
              className="flex items-start gap-3 rounded-lg border border-border/60 bg-background p-4"
            >
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-bold leading-tight">{stat.value}</p>
                {stat.change !== "—" && (
                  <p className={`mt-0.5 flex items-center gap-1 text-xs font-medium ${directionColor(stat.direction)}`}>
                    {directionIcon(stat.direction)}
                    {stat.change}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketSnapshot;
