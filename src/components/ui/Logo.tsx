/**
 * Logo — Audio Jones V2 brand mark.
 *
 * Variant system:
 *   - "icon"        → signal-yellow waveform mark only (square)
 *   - "horizontal"  → mark + divider + wordmark + descriptor
 *   - "dark"        → wordmark for dark surfaces (white text + yellow mark)
 *   - "light"       → wordmark for light surfaces (near-black text + yellow mark)
 *
 * Production swap procedure: see /LOGO-SWAP.md. When the designer
 * ships the production SVG files, drop them into /public/logo-*.svg
 * and the `productionAsset` map below routes each variant to the file.
 * Until then, this component renders the placeholder mark inline so
 * the build is unblocked and the brand reads correctly at every size.
 */

import * as React from "react";

export const SIGNAL_YELLOW = "#E8FF5A";
export const NEAR_BLACK = "#080808";
export const OFF_WHITE = "#F4F4F4";

export type LogoVariant = "dark" | "light" | "icon" | "horizontal";

type LogoProps = {
  variant?: LogoVariant;
  /** Pixel height for the rendered mark/lockup. Width auto-scales by viewBox. */
  height?: number;
  /** Optional className applied to the root <svg>. */
  className?: string;
  /** Override the accessible label. Defaults vary per variant. */
  title?: string;
  /** Hide from assistive tech (decorative use). */
  decorative?: boolean;
};

// Production SVG paths. When the designer delivers files, place them at
// these paths in /public and they will be picked up via <Image> by any
// consumer that imports `productionAsset`. The placeholder component below
// is what renders inline today.
export const productionAsset: Record<LogoVariant, string> = {
  dark: "/logo-dark.svg",
  light: "/logo-light.svg",
  icon: "/logo-icon.svg",
  horizontal: "/logo-horizontal.svg",
};

function SignalMark({
  fill = SIGNAL_YELLOW,
  x = 0,
}: {
  fill?: string;
  x?: number;
}) {
  return (
    <g fill={fill} transform={x ? `translate(${x} 0)` : undefined}>
      <rect x="22" y="60" width="14" height="58" rx="7" />
      <rect x="50" y="40" width="14" height="78" rx="7" />
      <rect x="78" y="22" width="14" height="96" rx="7" />
      <circle cx="57" cy="138" r="14" />
    </g>
  );
}

const SYNE_STACK =
  "Syne, 'Space Grotesk', ui-sans-serif, system-ui, sans-serif";
const MONO_STACK =
  "'DM Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

export function Logo({
  variant = "horizontal",
  height,
  className,
  title,
  decorative,
}: LogoProps) {
  const a11y = decorative
    ? { "aria-hidden": true as const, role: "presentation" as const }
    : { role: "img" as const, "aria-label": title ?? "Audio Jones" };

  if (variant === "icon") {
    const h = height ?? 32;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 240"
        width={(h * 200) / 240}
        height={h}
        className={className}
        {...a11y}
      >
        {!decorative && <title>{title ?? "Audio Jones — Signal Mark"}</title>}
        <g fill={SIGNAL_YELLOW}>
          <rect x="44" y="78" width="22" height="92" rx="11" />
          <rect x="89" y="44" width="22" height="126" rx="11" />
          <rect x="134" y="20" width="22" height="150" rx="11" />
          <circle cx="100" cy="208" r="22" />
        </g>
      </svg>
    );
  }

  if (variant === "dark" || variant === "light") {
    const h = height ?? 36;
    const text = variant === "dark" ? "#FFFFFF" : NEAR_BLACK;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 480 96"
        width={(h * 480) / 96}
        height={h}
        className={className}
        {...a11y}
      >
        {!decorative && <title>{title ?? "Audio Jones"}</title>}
        <g fill={SIGNAL_YELLOW}>
          <rect x="10" y="38" width="8" height="32" rx="4" />
          <rect x="26" y="26" width="8" height="44" rx="4" />
          <rect x="42" y="14" width="8" height="56" rx="4" />
          <circle cx="30" cy="82" r="8" />
        </g>
        <line
          x1="68"
          y1="20"
          x2="68"
          y2="76"
          stroke={text}
          strokeOpacity={variant === "dark" ? 0.35 : 0.25}
          strokeWidth={1}
        />
        <text
          x="84"
          y="62"
          fontFamily={SYNE_STACK}
          fontWeight={800}
          fontSize={42}
          letterSpacing={-0.9}
          fill={text}
        >
          Audio Jones
        </text>
      </svg>
    );
  }

  // "horizontal" — icon + divider + wordmark + descriptor
  const h = height ?? 48;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 720 160"
      width={(h * 720) / 160}
      height={h}
      className={className}
      {...a11y}
    >
      {!decorative && (
        <title>{title ?? "Audio Jones — Applied Intelligence Systems"}</title>
      )}
      <SignalMark />
      <line
        x1="120"
        y1="32"
        x2="120"
        y2="128"
        stroke="#E8E8E8"
        strokeOpacity={0.35}
        strokeWidth={1.5}
      />
      <text
        x="148"
        y="100"
        fontFamily={SYNE_STACK}
        fontWeight={800}
        fontSize={72}
        letterSpacing={-1.4}
        fill="#FFFFFF"
      >
        Audio Jones
      </text>
      <text
        x="150"
        y="132"
        fontFamily={MONO_STACK}
        fontWeight={500}
        fontSize={13}
        letterSpacing={3.4}
        fill={SIGNAL_YELLOW}
      >
        APPLIED INTELLIGENCE SYSTEMS
      </text>
    </svg>
  );
}

export default Logo;
