// src/pages/preview/_shared/lifestyle/LifestyleVitals.tsx
import type { LifestyleVitalsData } from "@/data/marketProfiles";
import WalkScoreGauge from "./WalkScoreGauge";
import SafetyBadge from "./SafetyBadge";
import CommuteStat from "./CommuteStat";
import IdealBuyerChips from "./IdealBuyerChips";

const tile = "rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10 shadow-[0_28px_60px_-32px_rgba(0,0,0,0.75)]";

export default function LifestyleVitals({ data }: { data: LifestyleVitalsData }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className={`${tile} flex items-center justify-center`}>
        <WalkScoreGauge value={data.walkScore.value} label={data.walkScore.label} />
      </div>
      <div className={tile}>
        <CommuteStat carMinutes={data.commute.carMinutes} routes={data.commute.routes} transitNote={data.commute.transitNote} />
      </div>
      <div className={tile}>
        <SafetyBadge grade={data.safety.grade} percentile={data.safety.percentile} note={data.safety.note} />
      </div>
      <div className={tile}>
        <IdealBuyerChips tags={data.idealBuyer.tags} summary={data.idealBuyer.summary} />
      </div>
    </div>
  );
}
