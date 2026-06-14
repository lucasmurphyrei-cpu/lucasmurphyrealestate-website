// src/pages/preview/_shared/lifestyle/SafetyBadge.tsx
export function gradeColor(grade: string): string {
  const letter = grade.trim().charAt(0).toUpperCase();
  if (letter === "A") return "#10b981";
  if (letter === "B") return "#84cc16";
  if (letter === "C") return "#f59e0b";
  return "#ef4444"; // D / F / anything worse
}

interface Props { grade: string; percentile?: number; note: string; }

const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export default function SafetyBadge({ grade, percentile, note }: Props) {
  const color = gradeColor(grade);
  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl font-display text-xl font-bold text-[#0a1424]"
          style={{ backgroundColor: color }}
        >
          {grade}
        </span>
        {percentile != null && (
          <span className="text-sm font-medium text-white/70">{ordinal(percentile)} percentile</span>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/70">{note}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-white/40">Safety (CrimeGrade)</p>
    </div>
  );
}
