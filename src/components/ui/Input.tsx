import * as React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

const baseClass =
  "h-11 w-full rounded-md border bg-bg-2 px-4 t-body text-fg-0 placeholder:text-fg-3 " +
  "transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)] " +
  "focus:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)] " +
  "disabled:opacity-50 disabled:pointer-events-none";

export const Input = React.forwardRef<HTMLInputElement, Props>(function Input(
  { invalid, className, ...rest },
  ref,
) {
  const borderClass = invalid
    ? "border-[color:var(--danger)]"
    : "border-[var(--line-2)] hover:border-[var(--line-3)] focus:border-aj-blue-bright";
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={[baseClass, borderClass, className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
});
