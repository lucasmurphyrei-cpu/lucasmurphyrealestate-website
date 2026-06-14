// src/pages/preview/_shared/lifestyle/IdealBuyerChips.tsx
const GOLD = "hsl(44, 100%, 53%)";

interface Props { tags: string[]; summary: string; }

export default function IdealBuyerChips({ tags, summary }: Props) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{ color: GOLD, border: `1px solid ${GOLD}55`, backgroundColor: "hsl(44 100% 53% / 0.08)" }}
          >
            {t}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/70">{summary}</p>
      <p className="mt-2 text-xs uppercase tracking-wide text-white/40">Ideal Buyer</p>
    </div>
  );
}
