import * as React from "react";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "children"> & {
  label: React.ReactNode;
  hint?: string;
  invalid?: boolean;
};

export const Checkbox = React.forwardRef<HTMLInputElement, Props>(function Checkbox(
  { label, hint, invalid, id, className, required, ...rest },
  ref,
) {
  const inputId =
    id ??
    `cb-${typeof label === "string" ? label.replace(/\W+/g, "-").toLowerCase() : "anon"}`;
  return (
    <label
      htmlFor={inputId}
      className={[
        "flex items-start gap-3 cursor-pointer select-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        required={required}
        aria-invalid={invalid || undefined}
        className={[
          "mt-1 h-5 w-5 shrink-0 rounded border bg-bg-2 cursor-pointer",
          "border-[var(--line-2)] hover:border-[var(--line-3)]",
          "checked:bg-aj-blue-bright checked:border-aj-blue-bright",
          "focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)]",
          "transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)]",
          invalid ? "border-[color:var(--danger)]" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />
      <span className="flex flex-col gap-1">
        <span className="t-small text-fg-1">
          {label}
          {required && (
            <span aria-hidden className="ml-1 text-aj-orange">
              *
            </span>
          )}
        </span>
        {hint && <span className="t-small text-fg-3">{hint}</span>}
      </span>
    </label>
  );
});
