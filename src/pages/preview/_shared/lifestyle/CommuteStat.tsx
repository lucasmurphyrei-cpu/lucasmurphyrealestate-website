// src/pages/preview/_shared/lifestyle/CommuteStat.tsx
import { Car, Bus } from "lucide-react";
const GOLD = "hsl(44, 100%, 53%)";

interface Props { carMinutes: string; routes: string[]; transitNote?: string; }

export default function CommuteStat({ carMinutes, routes, transitNote }: Props) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <Car className="h-5 w-5" style={{ color: GOLD }} />
        <span className="font-display text-2xl font-semibold text-white">{carMinutes}</span>
        <span className="text-sm text-white/60">to downtown</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {routes.map((r) => (
          <span key={r} className="rounded-full border border-white/15 px-2.5 py-1 text-xs font-medium text-white/70">
            {r}
          </span>
        ))}
      </div>
      {transitNote && (
        <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-white/60">
          <Bus className="mt-0.5 h-4 w-4 shrink-0 text-white/40" /> {transitNote}
        </p>
      )}
      <p className="mt-2 text-xs uppercase tracking-wide text-white/40">Commute</p>
    </div>
  );
}
