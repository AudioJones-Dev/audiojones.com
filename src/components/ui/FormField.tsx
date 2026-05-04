import * as React from "react";

type Props = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function FormField({
  id,
  label,
  hint,
  error,
  required,
  children,
  className,
}: Props) {
  return (
    <div className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}>
      <label
        htmlFor={id}
        className="t-small font-medium text-fg-1"
      >
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-aj-orange">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="t-small text-[color:var(--danger)]"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="t-small text-fg-3">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
