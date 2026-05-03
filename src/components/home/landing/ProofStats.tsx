import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";

// ─── Asset ───────────────────────────────────────────────────────────────────

const BG =
  "/assets/Homepage/09-proof-metrics/backgrounds/proof-bg-fragmented-to-signal-desktop.png";

// ─── Metric data ─────────────────────────────────────────────────────────────

const stats = [
  {
    metric: "CAC Reduction",
    display: "↓ 37%",
    label: "Customer acquisition cost",
    accent: "#FF4500",
  },
  {
    metric: "Pipeline Growth",
    display: "↑ 28%",
    label: "Qualified pipeline per quarter",
    accent: "#C8A96A",
  },
  {
    metric: "Conversion Rate",
    display: "↑ 42%",
    label: "Lead-to-call conversion rate",
    accent: "#3B5BFF",
  },
  {
    metric: "Decision Clarity",
    display: "1 Signal Map",
    label: "One signal map, one model",
    accent: "#94A3B8",
  },
];

/**
 * Section 6 — Proof / Results.
 *
 * Layer stack (bottom → top):
 *  z:1 — Background PNG
 *  z:2 — Gradient overlay + atmospheric glows
 *  z:3 — All live content
 *
 * Chart fix:
 *  Charts live in a `relative aspect-[16/7]` wrapper so the SVG fills a
 *  fixed-ratio box. viewBox="0 0 640 280" matches 16∶7 exactly — scaling is
 *  perfectly uniform, no stretching regardless of card width.
 */
export default function ProofStats() {
  return (
    <section
      id="proof"
      className="overflow-hidden border-t border-[var(--line-2)] py-24 sm:py-32"
      style={{ position: "relative", background: "#050710" }}
    >
      {/* ── z:1 Background image ── */}
      <div
        aria-hidden
        style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}
      >
        <Image
          src={BG}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          style={{ opacity: 0.52 }}
        />
      </div>

      {/* ── z:2a Main dark overlay ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(5,7,15,0.82) 0%, rgba(5,7,15,0.62) 42%, rgba(5,7,15,0.86) 100%)",
        }}
      />

      {/* ── z:2b Orange glow — Before side ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "25%",
          left: "-8%",
          width: "55%",
          height: "65%",
          zIndex: 2,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 65% 55% at 30% 50%, rgba(255,69,0,0.09), transparent 70%)",
        }}
      />

      {/* ── z:2c Blue glow — After side ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "25%",
          right: "-8%",
          width: "55%",
          height: "65%",
          zIndex: 2,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 65% 55% at 70% 50%, rgba(59,91,255,0.09), transparent 70%)",
        }}
      />

      {/* ── z:3 Live content ── */}
      <div
        style={{ position: "relative", zIndex: 3 }}
        className="mx-auto max-w-[1280px] px-5 sm:px-8"
      >
        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <Eyebrow>Proof / Metrics</Eyebrow>
          <h2 className="mt-4 t-h1 text-balance">
            From fragmented activity to measurable signal.
          </h2>
          <p className="mt-5 t-lead text-fg-2">
            Numbers from in-flight engagements. Names withheld until publication
            consent. Audited where the engagement permits.
          </p>
        </div>

        {/* ── Attribution Layer pill — centered above cards ── */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <span
            aria-hidden
            className="h-px w-16 sm:w-24"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.12))",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              whiteSpace: "nowrap",
              padding: "5px 14px",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            Attribution Layer
          </span>
          <span
            aria-hidden
            className="h-px w-16 sm:w-24"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(255,255,255,0.12))",
            }}
          />
        </div>

        {/* ── Before / After cards ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* BEFORE */}
          <article
            aria-label="Before: Activity without leverage"
            className="flex flex-col rounded-3xl p-8 sm:p-10"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,69,0,0.08) 0%, rgba(11,15,26,0.96) 100%)",
              border: "1px solid rgba(200,169,106,0.30)",
              backdropFilter: "blur(8px)",
              minHeight: "420px",
            }}
          >
            <Eyebrow tone="muted">Before</Eyebrow>
            <h3 className="mt-3 t-h3 text-white">Activity without leverage</h3>

            {/* Chart — fixed-ratio wrapper eliminates skewing */}
            <div
              className="relative mt-6 w-full overflow-hidden rounded-xl"
              style={{
                aspectRatio: "16 / 7",
                background: "rgba(5,7,15,0.30)",
              }}
            >
              <ChaoticChart />
            </div>

            <ul className="mt-6 flex-1 space-y-2 t-small text-fg-2">
              <li>· Inconsistent pipeline with unclear drivers</li>
              <li>· Unclear attribution — last-click theatre</li>
              <li>· Disconnected tools, no operating model</li>
              <li>· Founder as the bottleneck for every decision</li>
            </ul>
          </article>

          {/* AFTER */}
          <article
            aria-label="After: Causal system, compounding outcomes"
            className="flex flex-col rounded-3xl p-8 sm:p-10"
            style={{
              background: "#F4F6FB",
              border: "1px solid rgba(59,91,255,0.18)",
              boxShadow:
                "0 0 0 1px rgba(59,91,255,0.06), 0 24px 80px rgba(59,91,255,0.10)",
              minHeight: "420px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.20em",
                textTransform: "uppercase",
                color: "#3B5BFF",
              }}
            >
              After
            </span>
            <h3 className="mt-3 t-h3" style={{ color: "#0B0F1A" }}>
              Causal system, compounding outcomes
            </h3>

            {/* Chart — fixed-ratio wrapper eliminates skewing */}
            <div
              className="relative mt-6 w-full overflow-hidden rounded-xl"
              style={{
                aspectRatio: "16 / 7",
                background:
                  "linear-gradient(180deg, rgba(59,91,255,0.08), rgba(59,91,255,0.02))",
                border: "1px solid rgba(59,91,255,0.10)",
              }}
            >
              <CleanChart />
            </div>

            <ul
              className="mt-6 flex-1 space-y-2 t-small"
              style={{ color: "rgba(11,15,26,0.60)" }}
            >
              <li>· Clearer decision inputs, revenue-linked metrics</li>
              <li>· Attribution as identification — not correlation</li>
              <li>· Systemized execution, diagnostic-ready growth loop</li>
              <li>· Founder freed from operations, focused on signal</li>
            </ul>
          </article>
        </div>

        {/* ── Metric tiles ── */}
        <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.metric}
              className="flex flex-col rounded-2xl p-6"
              style={{
                background: "rgba(10,14,28,0.72)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderTop: `2px solid ${s.accent}`,
                backdropFilter: "blur(8px)",
              }}
            >
              <dt
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: s.accent,
                }}
              >
                {s.metric}
              </dt>
              <dd
                className="mt-3 font-bold leading-none"
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "clamp(22px,3vw,38px)",
                  letterSpacing: "-0.03em",
                  color: "#FFFFFF",
                }}
              >
                {s.display}
              </dd>
              <p
                className="mt-2"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.40)",
                  lineHeight: 1.5,
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </dl>

        {/* Disclaimer */}
        <p
          className="mt-6 text-center max-w-2xl mx-auto leading-relaxed"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.04em",
          }}
        >
          Representative system outcomes. Actual results depend on
          implementation, offer, market, and operational maturity.
        </p>
      </div>
    </section>
  );
}

// ─── Charts ───────────────────────────────────────────────────────────────────
//
// Both SVGs use viewBox="0 0 640 280" (ratio 16∶7) and are placed
// `absolute inset-0 h-full w-full` inside an `aspect-[16/7]` container.
// Scaling is perfectly uniform — no distortion regardless of card width.

function ChaoticChart() {
  // 10 bars, coords in 640×280 space
  const bars = [
    { x: 10, h: 104 },
    { x: 74, h: 196 },
    { x: 138, h: 130 },
    { x: 202, h: 224 },
    { x: 266, h: 160 },
    { x: 330, h: 208 },
    { x: 394, h: 112 },
    { x: 458, h: 192 },
    { x: 522, h: 98 },
    { x: 586, h: 176 },
  ];
  const barW = 42;

  // Jagged line mapped to 640×280 coordinate space
  const line =
    "M0,187 L51,131 L102,168 L154,84 L205,187 L256,103 L307,215 L358,112 L410,178 L461,75 L512,196 L563,131 L614,159 L640,140";

  return (
    <svg
      viewBox="0 0 640 280"
      preserveAspectRatio="none"
      aria-hidden
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      {/* Bars */}
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={280 - b.h}
          width={barW}
          height={b.h}
          fill="rgba(200,169,106,0.18)"
        />
      ))}
      {/* Jagged line */}
      <path
        d={line}
        fill="none"
        stroke="#FF6A30"
        strokeWidth="3"
        strokeLinejoin="round"
        opacity="0.88"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function CleanChart() {
  // Smooth upward curve, coords in 640×280 space
  const curve =
    "M0,243 C128,215 224,178 352,131 C461,94 544,65 640,37";
  const area =
    "M0,243 C128,215 224,178 352,131 C461,94 544,65 640,37 L640,280 L0,280 Z";

  const nodes = [
    { x: 64, y: 229 },
    { x: 192, y: 192 },
    { x: 320, y: 145 },
    { x: 461, y: 94 },
    { x: 608, y: 47 },
  ];

  return (
    <svg
      viewBox="0 0 640 280"
      preserveAspectRatio="none"
      aria-hidden
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <defs>
        <linearGradient id="cleanFill2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B5BFF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#3B5BFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[70, 140, 210].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="640"
          y2={y}
          stroke="#3B5BFF"
          strokeWidth="1"
          opacity="0.14"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {/* Area fill */}
      <path d={area} fill="url(#cleanFill2)" />
      {/* Curve */}
      <path
        d={curve}
        fill="none"
        stroke="#3B5BFF"
        strokeWidth="3.5"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* Nodes */}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="7" fill="#3B5BFF" />
      ))}
    </svg>
  );
}
