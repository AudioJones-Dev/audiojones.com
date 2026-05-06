import * as React from "react";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

const baseClass =
  "min-h-[120px] w-full rounded-md border bg-bg-2 px-4 py-3 t-body text-fg-0 placeholder:text-fg-3 " +
  "transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)] " +
  "focus:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)] " +
  "disabled:opacity-50 disabled:pointer-events-none resize-y";

export const Textarea = React.forwardRef<HTMLTextAreaElement, Props>(
  function Textarea({ invalid, className, ...rest }, ref) {
    const borderClass = invalid
      ? "border-[color:var(--danger)]"
      : "border-[var(--line-2)] hover:border-[var(--line-3)] focus:border-aj-blue-bright";
    return (
      <textarea
        ref={ref}
        aria-invalid={invalid || undefined}
        className={[baseClass, borderClass, className].filter(Boolean).join(" ")}
        {...rest}
      />
    );
  },
);
