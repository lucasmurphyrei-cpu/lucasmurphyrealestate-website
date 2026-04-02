import * as React from "react";
import Mailcheck from "mailcheck";
import { Input } from "@/components/ui/input";

type EmailInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  /** Extra classes forwarded to the wrapping div */
  wrapperClassName?: string;
};

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  ({ wrapperClassName, onBlur, ...props }, ref) => {
    const [suggestion, setSuggestion] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      },
      [ref],
    );

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const value = e.target.value.trim();
      if (!value) {
        setSuggestion(null);
        onBlur?.(e);
        return;
      }

      Mailcheck.run({
        email: value,
        suggested: (s: { full: string }) => setSuggestion(s.full),
        empty: () => setSuggestion(null),
      });

      onBlur?.(e);
    };

    const applySuggestion = () => {
      if (!suggestion || !inputRef.current) return;
      // Update the input value natively so React controlled/uncontrolled forms both work
      const nativeSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;
      nativeSetter?.call(inputRef.current, suggestion);
      inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
      setSuggestion(null);
    };

    return (
      <div className={wrapperClassName}>
        <Input ref={mergedRef} type="email" onBlur={handleBlur} {...props} />
        {suggestion && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Did you mean{" "}
            <button
              type="button"
              onClick={applySuggestion}
              className="font-semibold text-primary underline underline-offset-2 transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {suggestion}
            </button>
            ?
          </p>
        )}
      </div>
    );
  },
);

EmailInput.displayName = "EmailInput";

export { EmailInput };
