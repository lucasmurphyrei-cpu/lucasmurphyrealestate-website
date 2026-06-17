import { Info } from "lucide-react";
import MoneyInput from "@/pages/preview/_shared/MoneyInput";
import { formatCurrency, formatPercent } from "@/pages/tools/house-hack/calculations";

/* Shared navy/gold preview primitives for the House Hack Calculator. */

export const cardCls =
  "rounded-sm border border-border bg-card p-6 shadow-[0_18px_44px_-32px_hsl(216_52%_11%/0.4)] sm:p-7";
export const fieldCls =
  "h-10 w-full rounded-sm border border-border bg-white px-4 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";
export const labelCls =
  "mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground";

export function InfoTip({ text, align = "left" }: { text: string; align?: "left" | "right" }) {
  return (
    <span className="group/tip relative inline-flex align-middle">
      <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground/60 transition-colors hover:text-accent" />
      <span
        className={`pointer-events-none absolute top-6 z-50 hidden w-64 whitespace-pre-line rounded-sm border border-border bg-card p-3 text-left text-[11px] font-normal normal-case leading-relaxed tracking-normal text-muted-foreground shadow-[0_18px_44px_-20px_hsl(216_52%_11%/0.55)] group-hover/tip:block ${
          align === "right" ? "right-0" : "left-0"
        }`}
      >
        {text}
      </span>
    </span>
  );
}

interface PreviewInputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
  info?: string;
  disabled?: boolean;
  disabledLabel?: string;
  useCommas?: boolean;
  placeholder?: string;
  autoDecimalRate?: boolean;
  highlight?: boolean;
  infoAlign?: "left" | "right";
  id?: string;
}

export function PreviewInputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  min,
  info,
  disabled = false,
  disabledLabel,
  useCommas = false,
  placeholder,
  autoDecimalRate = false,
  highlight = false,
  infoAlign = "left",
  id,
}: PreviewInputFieldProps) {
  const ring = highlight ? "!border-accent ring-2 ring-accent/40" : "";
  const pad = `${prefix ? "pl-7" : ""} ${suffix ? "pr-8" : ""}`;

  return (
    <div>
      <label className={labelCls}>
        {disabled && disabledLabel ? disabledLabel : label}
        {info && <InfoTip text={info} align={infoAlign} />}
      </label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>
        )}
        {disabled ? (
          <input type="text" disabled value="" placeholder={placeholder} className={`${fieldCls} ${pad} cursor-not-allowed opacity-50`} />
        ) : useCommas ? (
          <MoneyInput id={id} value={value} onChange={onChange} placeholder={placeholder} className={`${fieldCls} ${pad} ${ring}`} />
        ) : (
          <input
            id={id}
            type="number"
            value={value || ""}
            step={step}
            min={min}
            placeholder={placeholder}
            onChange={(e) => onChange(Number(e.target.value) || 0)}
            onBlur={autoDecimalRate ? () => { if (value >= 20) onChange(Math.round(value) / 100); } : undefined}
            onDoubleClick={(e) => (e.target as HTMLInputElement).select()}
            className={`${fieldCls} ${pad} ${ring}`}
          />
        )}
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>
        )}
      </div>
    </div>
  );
}

interface PreviewResultRowProps {
  label: string;
  value: number;
  format: "currency" | "percent" | "number";
  colorCode?: boolean;
  benchmark?: string;
  size?: "default" | "large";
  border?: boolean;
  info?: string;
  infoAlign?: "left" | "right";
}

export function PreviewResultRow({
  label,
  value,
  format,
  colorCode = false,
  benchmark,
  size = "default",
  border = true,
  info,
  infoAlign = "left",
}: PreviewResultRowProps) {
  const display =
    format === "currency"
      ? formatCurrency(value)
      : format === "percent"
        ? formatPercent(value)
        : value.toLocaleString("en-US", { maximumFractionDigits: 0 });

  const colorClass = colorCode
    ? value > 0
      ? "text-emerald-600"
      : value < 0
        ? "text-red-600"
        : "text-foreground"
    : "text-foreground";

  return (
    <div className={`flex items-start justify-between gap-4 py-2.5 ${border ? "border-b border-border/60" : ""}`}>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm leading-tight text-muted-foreground">{label}</span>
          {info && <InfoTip text={info} align={infoAlign} />}
        </div>
        {benchmark && <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground/60">{benchmark}</p>}
      </div>
      <span className={`${size === "large" ? "text-lg font-bold tracking-tight" : "text-sm font-semibold"} ${colorClass} whitespace-nowrap tabular-nums`}>
        {display}
      </span>
    </div>
  );
}

/* Small reusable section card header */
export function SectionCard({ id, highlight, children }: { id?: string; highlight?: boolean; children: React.ReactNode }) {
  return (
    <div id={id} className={`${cardCls} ${highlight ? "ring-2 ring-accent transition-shadow" : "transition-shadow"}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="font-display text-xl font-semibold tracking-[-0.01em]">{children}</h2>
      {sub && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{sub}</p>}
    </div>
  );
}

/* Pill toggle button (property type, financing, mode) */
export function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-sm border px-4 py-2 text-sm font-semibold transition-all ${
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-white text-muted-foreground hover:border-accent/50 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
