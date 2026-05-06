import { Eyebrow } from "@/components/ui/Eyebrow";

// ─── Data ────────────────────────────────────────────────────────────────────

const COLUMNS = [
  {
    id: "noise",
    label: "Noise",
    tone: "gold" as const,
    items: [
      "Vanity metrics that feel good but predict nothing",
      "Tool sprawl without system integration",
      "Activity volume as a proxy for progress",
      "Last-click attribution dressed as truth",
      "Dashboards optimized for presentations",
    ],
  },
  {
    id: "acceptable",
    label: "Acceptable Noise",
    tone: "muted" as const,
    items: [
      "Brand awareness campaigns without short-term conversion signal",
      "Content with long attribution windows",
      "Exploratory testing without clear hypothesis",
      "Organic reach as a supplementary channel",
    ],
  },
  {
    id: "signal",
    label: "Signal",
    tone: "blue" as const,
    items: [
      "Causal inputs that predict qualified pipeline",
      "Behavioral patterns that precede conversion",
      "Constraint data that explains stalled growth",
      "Attribution tied to revenue-generating actions",
      "Decision data with repeatable predictive power",
    ],
  },
];

// ─── Per-card visual config ───────────────────────────────────────────────────

const CARD_CONFIG = {
  noise: {
    bg: "rgba(12,9,4,0.55)",
    border: "1px solid rgba(200,169,106,0.22)",
    dotColor: "#C8A96A",
    boxShadow: undefined as string | undefined,
    animated: false,
  },
  acceptable: {
    bg: "rgba(14,18,28,0.50)",
    border: "1px solid rgba(100,116,139,0.18)",
    dotColor: "#64748B",
    boxShadow: undefined as string | undefined,
    animated: false,
  },
  signal: {
    bg: "rgba(8,12,28,0.84)",
    border: "none",
    dotColor: "#8EA2FF",
    boxShadow:
      "0 0 32px -8px rgba(59,91,255,0.18), 0 0 14px -6px rgba(255,69,0,0.06), inset 0 0 0 1px rgba(59,91,255,0.06)",
    animated: true,
  },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SignalNoiseModel() {
  return (
    <section
      id="signal-noise"
      className="relative border-t border-[var(--line-2)] bg-bg-0 py-24 sm:py-32"
      style={{ overflow: "hidden" }}
    >
      {/* ── Keyframe: aj-card rotating border (Signal card only) ── */}
      <style>{`
        @keyframes aj-snm-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .aj-snm-sweep { animation: none !important; }
        }
      `}</style>

      {/* ── Section atmosphere glows ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Gold glow — left, behind Noise card */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "-5%",
            width: "38%",
            height: "70%",
            background:
              "radial-gradient(ellipse 80% 80% at 20% 55%, rgba(200,169,106,0.07), transparent 70%)",
          }}
        />
        {/* Blue glow — right, behind Signal card */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "-5%",
            width: "38%",
            height: "70%",
            background:
              "radial-gradient(ellipse 80% 80% at 80% 55%, rgba(59,91,255,0.09), transparent 70%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Header */}
        <div className="mb-14 max-w-3xl">
          <Eyebrow>Signal vs Noise Model</Eyebrow>
          <h2 className="mt-4 t-h1 text-balance">
            Identify which noise reveals signal.
          </h2>
          <p className="mt-5 t-lead text-fg-2">
            Most businesses do not need more data. They need a system for
            separating signal from noise.
          </p>
        </div>

        {/* Filtering model label — desktop only */}
        <div
          aria-hidden
          className="mb-3 hidden items-center justify-center lg:flex"
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.20)",
            }}
          >
            Filtering Model
          </span>
        </div>

        {/* ── Cards + desktop progression connectors ── */}
        <div className="relative grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Desktop arrow connectors — positioned in the gap between cards */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-[44px] left-0 right-0 hidden lg:block"
            style={{ height: "16px", zIndex: 10 }}
          >
            {/* Noise → Acceptable */}
            <div
              style={{
                position: "absolute",
                left: "calc(33.33% - 12px)",
                width: "24px",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="10"
                viewBox="0 0 24 10"
                fill="none"
                aria-hidden
              >
                <line
                  x1="0"
                  y1="5"
                  x2="16"
                  y2="5"
                  stroke="rgba(200,169,106,0.28)"
                  strokeWidth="1"
                />
                <path
                  d="M12 1L20 5L12 9"
                  stroke="rgba(200,169,106,0.28)"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </div>
            {/* Acceptable → Signal */}
            <div
              style={{
                position: "absolute",
                left: "calc(66.67% - 12px)",
                width: "24px",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="10"
                viewBox="0 0 24 10"
                fill="none"
                aria-hidden
              >
                <line
                  x1="0"
                  y1="5"
                  x2="16"
                  y2="5"
                  stroke="rgba(59,91,255,0.32)"
                  strokeWidth="1"
                />
                <path
                  d="M12 1L20 5L12 9"
                  stroke="rgba(59,91,255,0.32)"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {COLUMNS.map((col) => {
            const cfg = CARD_CONFIG[col.id as keyof typeof CARD_CONFIG];

            return (
              <article
                key={col.id}
                className="relative flex flex-col rounded-[var(--r-card)] p-7 sm:p-8"
                style={{
                  isolation: cfg.animated ? "isolate" : undefined,
                  background: cfg.bg,
                  border: cfg.animated ? undefined : cfg.border,
                  boxShadow: cfg.boxShadow,
                }}
              >
                {/* ── Signal card: animated rotating border ── */}
                {cfg.animated && (
                  <>
                    {/* Static gradient border base */}
                    <div
                      aria-hidden
                      style={{
                        overflow: "hidden",
                        pointerEvents: "none",
                        position: "absolute",
                        zIndex: -1,
                        inset: "-1px",
                        backgroundImage:
                          "linear-gradient(135deg, rgba(255,69,0,0.43), rgba(59,91,255,0.33) 55%, rgba(200,169,106,0.25))",
                        borderRadius: "inherit",
                      }}
                    >
                      {/* Rotating sweep — 40% reduced intensity vs reference */}
                      <div
                        className="aj-snm-sweep"
                        style={{
                          pointerEvents: "none",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          width: "200%",
                          height: "9rem",
                          backgroundImage:
                            "linear-gradient(90deg, rgba(255,69,0,0) 0%, rgba(255,69,0,0.57) 28%, rgba(59,91,255,0.54) 52%, rgba(200,169,106,0.42) 68%, rgba(255,69,0,0) 100%)",
                          transformOrigin: "left center",
                          animation: "aj-snm-rotate 12s linear infinite",
                          opacity: 0.42,
                        }}
                      />
                    </div>
                    {/* Inner cover — masks the border interior */}
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: "1px",
                        zIndex: -1,
                        borderRadius: "calc(var(--r-card) - 1px)",
                        background: cfg.bg,
                      }}
                    />
                  </>
                )}

                <Eyebrow tone={col.tone}>{col.label}</Eyebrow>

                <ul className="mt-6 flex flex-1 flex-col gap-4">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 t-body text-fg-1"
                    >
                      <span
                        aria-hidden
                        className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: cfg.dotColor }}
                      />
                      <span className="t-small leading-[1.55] text-fg-1">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {/* ── Principle strip — upgraded to bordered dark pill ── */}
        <div
          className="mx-auto mt-10 max-w-2xl rounded-[var(--r-lg)] px-6 py-5 text-center"
          style={{
            background: "rgba(7,9,18,0.75)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(8px)",
            boxShadow:
              "0 0 24px -8px rgba(255,69,0,0.10), 0 0 16px -8px rgba(59,91,255,0.08)",
          }}
        >
          <p
            className="text-fg-2"
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: "17px",
              fontWeight: 500,
              lineHeight: 1.5,
              letterSpacing: "-0.01em",
            }}
          >
            The 20% noise often reveals the 80% signal —{" "}
            <span style={{ color: "#FF6A30", fontWeight: 600 }}>
              if you know how to read the system.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
