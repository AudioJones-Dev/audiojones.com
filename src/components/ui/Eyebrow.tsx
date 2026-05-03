import * as React from "react";

type Tone = "gold" | "blue" | "muted";

type Props = {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
};

const toneMap: Record<Tone, string> = {
  gold: "text-aj-gold",
  blue: "text-aj-blue-bright",
  muted: "text-fg-2",
};

export function Eyebrow({ tone = "gold", className, children }: Props) {
  return (
    <span
      className={[
        "font-body font-semibold uppercase",
        "text-[12px] leading-[1.2] tracking-[0.18em]",
        toneMap[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
