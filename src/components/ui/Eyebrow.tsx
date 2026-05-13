import * as React from "react";

type Tone = "signal" | "blue" | "muted" | "gold";

type Props = {
  tone?: Tone;
  /**
   * Render the signal accent line (28px horizontal yellow tick, §04)
   * preceding the eyebrow text. Always paired with DM Mono labels.
   */
  withLine?: boolean;
  className?: string;
  children: React.ReactNode;
};

// V2 (§07): all eyebrows use DM Mono, uppercase, 10–12px @ 0.16em tracking.
// Signal yellow is the default tone; `blue` for data/system context;
// `muted` for de-emphasized labels. `gold` is preserved as an alias for
// legacy call sites and now resolves to signal yellow.
const toneMap: Record<Tone, string> = {
  signal: "text-signal-yellow",
  blue: "text-accent-blue",
  muted: "text-text-muted",
  gold: "text-signal-yellow",
};

export function Eyebrow({
  tone = "signal",
  withLine = false,
  className,
  children,
}: Props) {
  return (
    <span
      className={[
        "inline-flex items-center",
        "font-mono font-medium uppercase",
        "text-[10px] leading-[1.2] tracking-[0.16em]",
        toneMap[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {withLine ? (
        <span
          aria-hidden="true"
          className="mr-3 inline-block h-[2px] w-7 bg-signal-yellow"
        />
      ) : null}
      {children}
    </span>
  );
}
