import countyHistory from "@/data/countyMarketHistory.json";
import muniHistory from "@/data/municipalityMarketHistory.json";

export interface SeriesPoint {
  month: string;
  value: number;
  yoy_pct: number | null;
}

interface RawPoint {
  month: string;
  value: number | null;
  yoy_pct: number | null;
}

const clean = (raw: RawPoint[] | undefined): SeriesPoint[] =>
  (raw ?? [])
    .filter((p): p is RawPoint & { value: number } => typeof p.value === "number")
    .map((p) => ({ month: p.month, value: p.value, yoy_pct: p.yoy_pct }));

export function getCountySeries(countyName: string, metric: string): SeriesPoint[] {
  const county = (countyHistory as any).counties?.[countyName];
  return clean(county?.[metric]);
}

export function getMuniSeries(muniId: string, metric: string): SeriesPoint[] {
  const muni = (muniHistory as any).municipalities?.[muniId];
  return clean(muni?.metrics?.[metric]);
}
