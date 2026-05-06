import * as React from "react";

type Option = { value: string; label: string };

type Props = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  options: ReadonlyArray<Option>;
  invalid?: boolean;
  placeholder?: string;
};

const baseClass =
  "h-11 w-full rounded-md border bg-bg-2 px-4 pr-10 t-body text-fg-0 " +
  "transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)] " +
  "focus:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)] " +
  "disabled:opacity-50 disabled:pointer-events-none " +
  "appearance-none bg-no-repeat bg-right";

export const Select = React.forwardRef<HTMLSelectElement, Props>(function Select(
  { options, invalid, className, placeholder, value, defaultValue, ...rest },
  ref,
) {
  const borderClass = invalid
    ? "border-[color:var(--danger)]"
    : "border-[var(--line-2)] hover:border-[var(--line-3)] focus:border-aj-blue-bright";

  // Inline chevron via background-image (avoids a separate icon import)
  const chevron = {
    backgroundImage:
      'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'><path d=\'M1 1L6 6L11 1\' stroke=\'%2394A3B8\' stroke-width=\'1.5\' fill=\'none\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/></svg>")',
    backgroundPosition: "right 14px center",
    backgroundSize: "12px 8px",
  } as const;

  // Pass value OR defaultValue, never both. Passing both put the native
  // select into a controlled/uncontrolled limbo that desynced state from
  // the DOM on mobile Safari (selections registered visually but never
  // reached parent state — Step 1 of the ROI calculator wouldn't advance
  // because validation kept reading empty fields).
  const isControlled = value !== undefined;
  const valueProps = isControlled
    ? { value }
    : { defaultValue: defaultValue ?? (placeholder ? "" : undefined) };

  return (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={[baseClass, borderClass, className].filter(Boolean).join(" ")}
      style={chevron}
      {...valueProps}
      {...rest}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
});
