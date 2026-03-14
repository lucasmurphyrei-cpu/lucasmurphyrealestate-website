import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Formats a number with commas for display (e.g., 300000 → "300,000").
 * Returns empty string for 0/NaN so placeholder shows.
 */
function formatWithCommas(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (!num && num !== 0) return "";
  if (num === 0) return "";
  // Handle decimals properly
  const parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

/** Strips commas from a string and parses as number. */
function parseFormatted(value: string): number {
  const stripped = value.replace(/,/g, "");
  const num = parseFloat(stripped);
  return isNaN(num) ? 0 : num;
}

// ─── Currency Input with comma formatting ───

interface CurrencyInputProps {
  label?: string;
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
  helpText?: string;
  className?: string;
  tabIndex?: number;
}

export function FormattedCurrencyInput({ label, value, onChange, placeholder, helpText, className, tabIndex }: CurrencyInputProps) {
  const [focused, setFocused] = useState(false);
  const [rawValue, setRawValue] = useState("");

  const handleFocus = useCallback(() => {
    setFocused(true);
    setRawValue(value ? value.toString() : "");
  }, [value]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    const parsed = parseFormatted(rawValue);
    onChange(parsed);
  }, [rawValue, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow digits, commas, decimal point, and empty
    if (/^[\d,]*\.?\d*$/.test(val) || val === "") {
      setRawValue(val.replace(/,/g, ""));
      const parsed = parseFormatted(val);
      onChange(parsed);
    }
  }, [onChange]);

  const displayValue = focused ? rawValue : formatWithCommas(value);

  const input = (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
      <Input
        type="text"
        inputMode="decimal"
        className={`pl-7 ${className || ""}`}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder || "0"}
        tabIndex={tabIndex}
      />
    </div>
  );

  if (!label && !helpText) return input;

  return (
    <div className="space-y-1">
      {label && <Label className="text-sm">{label}</Label>}
      {input}
      {helpText && <p className="text-[10px] text-muted-foreground">{helpText}</p>}
    </div>
  );
}

// ─── Bare number input with commas (no $ prefix) ───

interface FormattedNumberInputProps {
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
  className?: string;
  tabIndex?: number;
  min?: number;
}

export function FormattedNumberInput({ value, onChange, placeholder, className, tabIndex, min }: FormattedNumberInputProps) {
  const [focused, setFocused] = useState(false);
  const [rawValue, setRawValue] = useState("");

  const handleFocus = useCallback(() => {
    setFocused(true);
    setRawValue(value ? value.toString() : "");
  }, [value]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    let parsed = parseFormatted(rawValue);
    if (min !== undefined && parsed < min) parsed = min;
    onChange(parsed);
  }, [rawValue, onChange, min]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[\d,]*\.?\d*$/.test(val) || val === "") {
      setRawValue(val.replace(/,/g, ""));
      const parsed = parseFormatted(val);
      onChange(parsed);
    }
  }, [onChange]);

  const displayValue = focused ? rawValue : formatWithCommas(value);

  return (
    <Input
      type="text"
      inputMode="decimal"
      className={className}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder || "0"}
      tabIndex={tabIndex}
    />
  );
}

// ─── Percent Input ───

interface PercentInputProps {
  label?: string;
  value: number;
  onChange: (v: number) => void;
  helpText?: string;
  step?: number;
}

export function FormattedPercentInput({ label, value, onChange, helpText, step }: PercentInputProps) {
  return (
    <div className="space-y-1">
      {label && <Label className="text-sm">{label}</Label>}
      <div className="relative">
        <Input
          type="number"
          min={0}
          max={100}
          step={step || 0.1}
          className="pr-7"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="0"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
      </div>
      {helpText && <p className="text-[10px] text-muted-foreground">{helpText}</p>}
    </div>
  );
}
