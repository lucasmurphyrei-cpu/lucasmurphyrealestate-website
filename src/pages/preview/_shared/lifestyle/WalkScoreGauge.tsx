// src/pages/preview/_shared/lifestyle/WalkScoreGauge.tsx
const GOLD = "hsl(44, 100%, 53%)";

export function gaugeFraction(value: number): number {
  return Math.max(0, Math.min(100, value)) / 100;
}

interface Props { value: number; label: string; }

export default function WalkScoreGauge({ value, label }: Props) {
  // Semicircle: radius 52, circumference of the half-arc = PI * r
  const r = 52;
  const half = Math.PI * r;
  const dash = gaugeFraction(value) * half;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 70" className="w-40" role="img" aria-label={`Walk Score ${value} out of 100`}>
        <path d="M8 64 A52 52 0 0 1 112 64" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M8 64 A52 52 0 0 1 112 64"
          fill="none"
          stroke={GOLD}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${half}`}
        />
        <text x="60" y="56" textAnchor="middle" className="font-display" fontSize="26" fill="#fff" fontWeight="600">
          {value}
        </text>
      </svg>
      <p className="mt-1 text-sm font-medium text-white/75">{label}</p>
      <p className="text-xs uppercase tracking-wide text-white/40">Walk Score</p>
    </div>
  );
}
