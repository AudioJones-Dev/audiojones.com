import type { ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type SignalCardVariant = "signal" | "system" | "ledger" | "noise";

export type MetricBlock = {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
};

export type ChartBar = {
  heightPct: number; // 0–100
  accent?: "orange" | "blue" | "gold" | "muted";
};

export interface SignalDataCardProps {
  /** Card variant drives accent color emphasis */
  variant?: SignalCardVariant;
  /** Optional icon node rendered in the header badge */
  icon?: ReactNode;
  title: string;
  statusLabel?: string;
  metrics?: MetricBlock[];
  chartBars?: ChartBar[];
  footerLabel?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  ctaHref?: string;
  className?: string;
}

// ─── Variant tokens ───────────────────────────────────────────────────────────

const VARIANT_CONFIG: Record<
  SignalCardVariant,
  {
    borderGradient: string;
    iconGradient: string;
    iconGlow: string;
    statusBg: string;
    statusBorder: string;
    statusText: string;
    statusDot: string;
    ctaBorder: string;
    ctaBg: string;
    ctaText: string;
    ctaHoverGlow: string;
    hoverShadow: string;
    borderOpacity: string;
    blurOpacity: string;
  }
> = {
  signal: {
    borderGradient:
      "linear-gradient(135deg, #FF4500 0%, #3B5BFF 60%, #C8A96A 100%)",
    iconGradient: "linear-gradient(135deg, #FF4500, #3B5BFF)",
    iconGlow: "0 0 18px rgba(255,69,0,0.22)",
    statusBg: "rgba(255,69,0,0.10)",
    statusBorder: "rgba(255,69,0,0.30)",
    statusText: "#FF6A30",
    statusDot: "#FF4500",
    ctaBorder: "rgba(255,69,0,0.40)",
    ctaBg: "rgba(255,69,0,0.10)",
    ctaText: "#FF6A30",
    ctaHoverGlow: "0 0 20px rgba(255,69,0,0.24)",
    hoverShadow: "0 0 40px rgba(255,69,0,0.14)",
    borderOpacity: "0.22",
    blurOpacity: "0.22",
  },
  system: {
    borderGradient:
      "linear-gradient(135deg, #3B5BFF 0%, #C8A96A 60%, #FF4500 100%)",
    iconGradient: "linear-gradient(135deg, #3B5BFF, #0088CC)",
    iconGlow: "0 0 18px rgba(59,91,255,0.22)",
    statusBg: "rgba(59,91,255,0.10)",
    statusBorder: "rgba(59,91,255,0.30)",
    statusText: "#8EA2FF",
    statusDot: "#3B5BFF",
    ctaBorder: "rgba(59,91,255,0.40)",
    ctaBg: "rgba(59,91,255,0.10)",
    ctaText: "#8EA2FF",
    ctaHoverGlow: "0 0 20px rgba(59,91,255,0.24)",
    hoverShadow: "0 0 40px rgba(59,91,255,0.14)",
    borderOpacity: "0.22",
    blurOpacity: "0.22",
  },
  ledger: {
    borderGradient:
      "linear-gradient(135deg, #C8A96A 0%, #FF4500 60%, #3B5BFF 100%)",
    iconGradient: "linear-gradient(135deg, #C8A96A, #A07840)",
    iconGlow: "0 0 18px rgba(200,169,106,0.22)",
    statusBg: "rgba(200,169,106,0.10)",
    statusBorder: "rgba(200,169,106,0.30)",
    statusText: "#D4B87A",
    statusDot: "#C8A96A",
    ctaBorder: "rgba(200,169,106,0.40)",
    ctaBg: "rgba(200,169,106,0.10)",
    ctaText: "#D4B87A",
    ctaHoverGlow: "0 0 20px rgba(200,169,106,0.24)",
    hoverShadow: "0 0 40px rgba(200,169,106,0.12)",
    borderOpacity: "0.20",
    blurOpacity: "0.18",
  },
  noise: {
    borderGradient:
      "linear-gradient(135deg, rgba(255,69,0,0.35) 0%, rgba(59,91,255,0.25) 60%, rgba(200,169,106,0.20) 100%)",
    iconGradient: "linear-gradient(135deg, #1a1a2e, #2a2a3e)",
    iconGlow: "none",
    statusBg: "rgba(255,255,255,0.04)",
    statusBorder: "rgba(255,255,255,0.08)",
    statusText: "#64748B",
    statusDot: "#475569",
    ctaBorder: "rgba(255,255,255,0.08)",
    ctaBg: "rgba(255,255,255,0.03)",
    ctaText: "#64748B",
    ctaHoverGlow: "none",
    hoverShadow: "0 0 20px rgba(0,0,0,0.3)",
    borderOpacity: "0.12",
    blurOpacity: "0.10",
  },
};

const ACCENT_COLORS: Record<
  NonNullable<ChartBar["accent"]>,
  { bar: string; bg: string }
> = {
  orange: { bar: "#FF4500", bg: "rgba(255,69,0,0.18)" },
  blue: { bar: "#3B5BFF", bg: "rgba(59,91,255,0.18)" },
  gold: { bar: "#C8A96A", bg: "rgba(200,169,106,0.18)" },
  muted: { bar: "#334155", bg: "rgba(51,65,85,0.18)" },
};

// ─── Default icon (signal trend) ─────────────────────────────────────────────

function DefaultIcon() {
  return (
    <svg
      className="h-4 w-4 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SignalDataCard({
  variant = "signal",
  icon,
  title,
  statusLabel,
  metrics = [],
  chartBars = [],
  footerLabel,
  ctaLabel,
  onCtaClick,
  ctaHref,
  className = "",
}: SignalDataCardProps) {
  const cfg = VARIANT_CONFIG[variant];

  return (
    <div
      className={`group relative flex w-full flex-col rounded-2xl bg-[#05070F] p-4 shadow-2xl transition-all duration-300 hover:scale-[1.015] ${className}`}
      style={{
        transitionProperty: "transform, box-shadow",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = cfg.hoverShadow;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "";
      }}
    >
      {/* Gradient glow border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          background: cfg.borderGradient,
          opacity: cfg.borderOpacity,
          filter: "blur(1px)",
        }}
      />
      {/* Hard border ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: cfg.borderGradient,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
          opacity: Number(cfg.borderOpacity) + 0.1,
        }}
      />

      {/* Inner card surface */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-px rounded-[15px]"
        style={{ background: "#0B0F1A" }}
      />

      {/* Content */}
      <div className="relative flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Icon badge */}
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: cfg.iconGradient,
                boxShadow: cfg.iconGlow,
              }}
            >
              {icon ?? <DefaultIcon />}
            </div>
            <h3
              className="text-sm font-semibold text-[#E5E7EB]"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              {title}
            </h3>
          </div>

          {statusLabel && (
            <span
              className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
              style={{
                background: cfg.statusBg,
                border: `1px solid ${cfg.statusBorder}`,
                color: cfg.statusText,
                fontFamily: "var(--font-body)",
              }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: cfg.statusDot }}
              />
              {statusLabel}
            </span>
          )}
        </div>

        {/* Metrics row */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((m, i) => (
              <div
                key={i}
                className="rounded-xl p-3"
                style={{
                  background: "rgba(16,24,39,0.70)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p
                  className="text-xs font-medium text-[#94A3B8]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {m.label}
                </p>
                <p
                  className="mt-0.5 text-lg font-semibold text-white"
                  style={{ fontFamily: "var(--font-headline)" }}
                >
                  {m.value}
                </p>
                {m.delta && (
                  <span
                    className="text-xs font-medium"
                    style={{
                      fontFamily: "var(--font-body)",
                      color:
                        m.deltaPositive === false
                          ? "#FF4500"
                          : m.deltaPositive === true
                          ? "#22C55E"
                          : cfg.statusText,
                    }}
                  >
                    {m.delta}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Mini chart */}
        {chartBars.length > 0 && (
          <div
            className="h-24 w-full overflow-hidden rounded-xl p-3"
            style={{
              background: "rgba(16,24,39,0.70)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="flex h-full w-full items-end justify-between gap-1"
              aria-hidden
            >
              {chartBars.map((bar, i) => {
                const accent = ACCENT_COLORS[bar.accent ?? "blue"];
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${Math.max(10, bar.heightPct)}%`,
                      background: accent.bg,
                      position: "relative",
                    }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-sm"
                      style={{
                        height: "80%",
                        background: accent.bar,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        {(footerLabel || ctaLabel) && (
          <div className="flex items-center justify-between">
            {footerLabel && (
              <span
                className="text-xs font-medium text-[#94A3B8]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {footerLabel}
              </span>
            )}
            {ctaLabel &&
              (ctaHref ? (
                <a
                  href={ctaHref}
                  className="flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-bold transition-all duration-300"
                  style={{
                    border: `1px solid ${cfg.ctaBorder}`,
                    background: cfg.ctaBg,
                    color: cfg.ctaText,
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                      cfg.ctaHoverGlow;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "";
                  }}
                >
                  {ctaLabel}
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onCtaClick}
                  className="flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-bold transition-all duration-300"
                  style={{
                    border: `1px solid ${cfg.ctaBorder}`,
                    background: cfg.ctaBg,
                    color: cfg.ctaText,
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      cfg.ctaHoverGlow;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
                  }}
                >
                  {ctaLabel}
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
