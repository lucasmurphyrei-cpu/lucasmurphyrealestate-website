import { TrendingUp, TrendingDown, Minus, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { RapidStatsMunicipality } from "@/data/neighborhoodTypes";

interface RapidStatsTableProps {
  data: RapidStatsMunicipality | null;
  municipalityName: string;
}

const RapidStatsTable = ({ data, municipalityName }: RapidStatsTableProps) => {
  if (!data) {
    return (
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold mb-4">Real Estate Trends</h2>
        <Card className="border-dashed border-border/80">
          <CardContent className="flex items-center gap-4 p-8">
            <div className="rounded-lg bg-primary/10 p-3">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Coming Soon</p>
              <p className="mt-1 text-sm text-muted-foreground">
                RapidStats market data for {municipalityName} is coming soon. Check back in April 2026.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="font-display text-2xl font-bold mb-1">Real Estate Trends — {data.data_month}</h2>
      <p className="text-sm text-muted-foreground mb-4">
        RapidStats Monthly Local Market
      </p>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Metric</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">{data.prior_year_label}</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">{data.current_year_label}</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">+/−</th>
                </tr>
              </thead>
              <tbody>
                {data.metrics.map((metric, i) => {
                  const isPositive = metric.change_pct > 0;
                  const isNegative = metric.change_pct < 0;
                  const colorClass = isPositive
                    ? "text-emerald-600"
                    : isNegative
                      ? "text-red-500"
                      : "text-muted-foreground";
                  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
                  const sign = isPositive ? "+" : "";

                  return (
                    <tr
                      key={metric.label}
                      className={`border-b border-border/60 ${i % 2 === 1 ? "bg-secondary/20" : ""}`}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{metric.label}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{metric.prior_year}</td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">{metric.current_year}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex items-center gap-1 font-medium ${colorClass}`}>
                          <Icon className="h-3.5 w-3.5" />
                          {sign}{metric.change_pct.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <p className="mt-2 text-xs text-muted-foreground italic">
        Data as of {data.data_as_of}. Source: Metro MLS via RapidStats. Single Family Residence only.
      </p>
    </section>
  );
};

export default RapidStatsTable;
