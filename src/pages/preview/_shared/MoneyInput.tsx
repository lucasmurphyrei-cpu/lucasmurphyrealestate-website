/**
 * Text input that shows whole-dollar numbers with thousands separators (e.g. 375,000)
 * while reporting a plain number to onChange. Use for larger dollar fields so they're
 * easy to read while typing.
 */
export default function MoneyInput({
  id,
  value,
  onChange,
  placeholder,
  className,
  onKeyDown,
}: {
  id?: string;
  value: number;
  onChange: (n: number) => void;
  placeholder?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={value ? value.toLocaleString("en-US") : ""}
      onChange={(e) => {
        const digits = e.target.value.replace(/[^0-9]/g, "");
        onChange(digits ? parseInt(digits, 10) : 0);
      }}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={className}
    />
  );
}
