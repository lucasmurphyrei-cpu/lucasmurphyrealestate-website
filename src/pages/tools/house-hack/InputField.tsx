import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
  className?: string;
  info?: string;
  disabled?: boolean;
  disabledLabel?: string;
  useCommas?: boolean;
  placeholder?: string;
  autoDecimalRate?: boolean;
  highlight?: boolean;
  infoAlign?: "left" | "right";
}

const InputField = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  min,
  className,
  info,
  disabled = false,
  disabledLabel,
  useCommas = false,
  placeholder,
  autoDecimalRate = false,
  highlight = false,
  infoAlign = "left",
}: InputFieldProps) => {
  const [showInfo, setShowInfo] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  // For comma-formatted inputs, use a text input with formatting
  const [displayValue, setDisplayValue] = useState(() =>
    useCommas && value ? value.toLocaleString("en-US") : "",
  );
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(useCommas && value ? value.toLocaleString("en-US") : "");
    }
  }, [value, useCommas, isFocused]);

  // Close info tooltip on outside click
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

  const handleCommaChange = (raw: string) => {
    const stripped = raw.replace(/,/g, "");
    const num = Number(stripped);
    if (!isNaN(num)) {
      onChange(num);
      setDisplayValue(stripped);
    }
  };

  const handleCommaBlur = () => {
    setIsFocused(false);
    setDisplayValue(value ? value.toLocaleString("en-US") : "");
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Label className="block text-xs text-muted-foreground">{disabled && disabledLabel ? disabledLabel : label}</Label>
        {info && (
          <div className="relative" ref={infoRef}>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowInfo(!showInfo)}
              className="text-muted-foreground/50 hover:text-primary transition-colors"
              aria-label="More info"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
            {showInfo && (
              <div className={`absolute bottom-full mb-2 w-64 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-popover p-3 text-xs text-popover-foreground shadow-lg z-50 ${infoAlign === "right" ? "right-0 md:right-auto md:left-1/2 md:-translate-x-1/2" : "left-0 md:left-1/2 md:-translate-x-1/2"}`}>
                <div className="whitespace-pre-line">{info}</div>
                <div className={`absolute top-full -mt-px w-2 h-2 bg-popover border-b border-r border-border rotate-45 ${infoAlign === "right" ? "right-2 md:right-auto md:left-1/2 md:-translate-x-1/2" : "left-2 md:left-1/2 md:-translate-x-1/2"}`} />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>
        )}
        {useCommas ? (
          <Input
            type="text"
            inputMode="numeric"
            value={isFocused ? displayValue : (value ? value.toLocaleString("en-US") : "")}
            onChange={(e) => handleCommaChange(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setDisplayValue(value ? String(value) : "");
            }}
            onBlur={handleCommaBlur}
            onDoubleClick={(e) => (e.target as HTMLInputElement).select()}
            disabled={disabled}
            placeholder={placeholder || ""}
            className={`${prefix ? "pl-7" : ""} ${suffix ? "pr-8" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${highlight ? "ring-2 ring-primary" : ""}`}
          />
        ) : (
          <Input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(Number(e.target.value) || 0)}
            onBlur={autoDecimalRate ? () => {
              if (value >= 20) onChange(Math.round((value / 100) * 100) / 100);
            } : undefined}
            onDoubleClick={(e) => (e.target as HTMLInputElement).select()}
            step={step}
            min={min}
            disabled={disabled}
            placeholder={placeholder || ""}
            className={`${prefix ? "pl-7" : ""} ${suffix ? "pr-8" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${highlight ? "ring-2 ring-primary" : ""}`}
          />
        )}
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>
        )}
      </div>
    </div>
  );
};

export default InputField;
