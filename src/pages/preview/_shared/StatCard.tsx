interface Props {
  label: string;
  value: string;
  change?: string;
  direction?: "up" | "down" | "flat";
}

const pillStyle: Record<string, string> = {
  up: "bg-emerald-500/15 text-emerald-400",
  down: "bg-red-500/15 text-red-400",
  flat: "bg-white/10 text-white/50",
};

export default function StatCard({ label, value, change, direction = "flat" }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/50">{label}</p>
      <p className="font-display text-2xl font-semibold leading-tight text-white">{value}</p>
      {change && (
        <span
          className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${pillStyle[direction]}`}
        >
          {change}
        </span>
      )}
    </div>
  );
}
