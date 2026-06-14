import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SeriesPoint } from "@/lib/market/history";

type Fmt = "currency" | "days" | "percent" | "count";

const fmt = (v: number, f: Fmt) =>
  f === "currency"
    ? `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
    : f === "percent"
    ? `${v}%`
    : f === "days"
    ? `${v}d`
    : `${v.toLocaleString("en-US")}`;

// Gold: hsl(44, 100%, 53%) — used inline because CSS vars don't resolve in SVG attributes
const GOLD = "hsl(44, 100%, 53%)";

interface Props {
  title: string;
  series: SeriesPoint[];
  format: Fmt;
}

export default function MarketTrendChart({ title, series, format }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/70">{title}</p>
      {series.length < 2 ? (
        <p className="py-8 text-center text-sm text-white/55">Limited history for this area.</p>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={series} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="mtc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GOLD} stopOpacity={0.5} />
                <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(v) => fmt(Number(v), format)}
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={56}
            />
            <Tooltip
              formatter={(v) => fmt(Number(v), format)}
              contentStyle={{
                background: "#0a1424",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8,
                color: "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={GOLD}
              strokeWidth={2}
              fill="url(#mtc)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
