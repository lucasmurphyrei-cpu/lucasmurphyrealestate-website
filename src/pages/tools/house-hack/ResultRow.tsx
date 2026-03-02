import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
import { formatCurrency, formatPercent } from "./calculations";

interface ResultRowProps {
  label: string;
  value: number;
  format: "currency" | "percent" | "number";
  colorCode?: boolean;
  benchmark?: string;
  size?: "default" | "large";
  border?: boolean;
  info?: string;
}

const ResultRow = ({
  label,
  value,
  format,
  colorCode = false,
  benchmark,
  size = "default",
  border = true,
  info,
}: ResultRowProps) => {
  const [showInfo, setShowInfo] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showInfo) return;
    const handler = (e: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setShowInfo(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showInfo]);

  let displayValue: string;
  if (format === "currency") {
    displayValue = formatCurrency(value);
  } else if (format === "percent") {
    displayValue = formatPercent(value);
  } else {
    displayValue = value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }

  const colorClass = colorCode
    ? value > 0
      ? "text-emerald-400"
      : value < 0
        ? "text-red-400"
        : "text-foreground"
    : "text-foreground";

  const isLarge = size === "large";

  return (
    <div className={`flex items-start justify-between gap-4 py-2.5 ${border ? "border-b border-border/60" : ""}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground leading-tight">{label}</span>
          {info && (
            <div className="relative" ref={infoRef}>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowInfo(!showInfo)}
                className="text-muted-foreground/50 hover:text-primary transition-colors"
                aria-label={`More info about ${label}`}
              >
                <Info className="h-3.5 w-3.5" />
              </button>
              {showInfo && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-popover p-3 text-xs text-popover-foreground shadow-lg z-50">
                  <div className="whitespace-pre-line leading-relaxed">{info}</div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-popover border-b border-r border-border rotate-45" />
                </div>
              )}
            </div>
          )}
        </div>
        {benchmark && <p className="text-[11px] text-muted-foreground/50 mt-0.5 leading-snug">{benchmark}</p>}
      </div>
      <span
        className={`${
          isLarge ? "text-lg font-bold tracking-tight" : "text-sm font-semibold"
        } ${colorClass} tabular-nums lining-nums whitespace-nowrap`}
      >
        {displayValue}
      </span>
    </div>
  );
};

export default ResultRow;
