// src/pages/preview/_shared/amenities/MoreToExplore.tsx
export default function MoreToExplore({ items }: { items: { name: string; category: string }[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/50">More to explore</h4>
      <div className="flex flex-wrap gap-2.5">
        {items.map((it) => (
          <span key={it.name} className="rounded-xl bg-white/[0.04] px-3.5 py-2 text-sm text-white/80 ring-1 ring-white/10">
            {it.name} <span className="text-white/40">· {it.category}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
