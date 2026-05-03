import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";

// ─── Asset ───────────────────────────────────────────────────────────────────

const BG =
  "/assets/Homepage/09-proof-metrics/backgrounds/proof-bg-fragmented-to-signal-desktop.png";

// ─── Metric data ─────────────────────────────────────────────────────────────

const stats = [
  { metric: "CAC Reduction",   direction: "↓", value: "37%",    label: "Customer acquisition cost",      accent: "#FF4500" },
  { metric: "Pipeline Growth", direction: "↑", value: "28%",    label: "Qualified pipeline per quarter", accent: "#C8A96A" },
  { metric: "Conversion Rate", direction: "↑", value: "42%",    label: "Lead-to-call conversion rate",   accent: "#3B5BFF" },
  { metric: "Decision Clarity",direction: "↑", value: "1 map",  label: "One signal map, one model",      accent: "#94A3B8" },
];

/**
 * Section 6 — Proof / Results.
 * Before/after comparison. The "after" panel uses the opt-in light surface
 * to make the clarity narrative visible at a glance.
 *
 * Layer stack (bottom → top):
 *  1 — Background PNG (positive z:1, no negative-z ambiguity)
 *  2 — Gradient overlay + atmospheric glows (z:2)
 *  3 — All live content (z:3)
 */
export default function ProofStats() {
  return (
    <section
      id="proof"
      className="overflow-hidden border-t border-[var(--line-2)] py-24 sm:py-32"
      style={{ position: "relative", background: "#050710" }}
    >
      {/* ── Layer 1: Background image ── */}
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

      {/* ── Layer 2a: Main dark overlay ── */}
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

      {/* ── Layer 2b: Orange glow — Before card area (left) ── */}
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

      {/* ── Layer 2c: Blue glow — After card area (right) ── */}
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

      {/* ── Layer 3: All live content ── */}
      <div
        style={{ position: "relative", zIndex: 3 }}
        className="mx-auto max-w-[1280px] px-5 sm:px-8"
      >
        {/* Header */}
        <div className="mb-14 max-w-3xl">
          <Eyebrow>Proof / Metrics</Eyebrow>
          <h2 className="mt-4 t-h1 text-balance">
            From fragmented activity to measurable signal.
          </h2>
          <p className="mt-5 t-lead text-fg-2">
            Numbers from in-flight engagements. Names withheld until publication
            consent. Audited where the engagement permits.
          </p>
        </div>

        {/* ── Before / After cards ── */}
        <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* BEFORE */}
          <article
            className="rounded-[var(--r-card)] p-8 sm:p-10"
            aria-label="Before"
            style={{
              background: "rgba(14,10,8,0.82)",
              border: "1px solid rgba(200,169,106,0.30)",
              backdropFilter: "blur(8px)",
              boxShadow: "inset 0 0 40px rgba(255,69,0,0.04)",
            }}
          >
            <Eyebrow tone="muted">Before</Eyebrow>
            <h3 className="mt-3 t-h3">Activity without leverage</h3>
            <ChaoticChart className="mt-6 h-40 w-full" />
            <ul className="mt-6 space-y-2 t-small text-fg-2">
              <li>· Inconsistent pipeline with unclear drivers</li>
              <li>· Unclear attribution — last-click theatre</li>
              <li>· Disconnected tools, no operating model</li>
              <li>· Founder as the bottleneck for every decision</li>
            </ul>
          </article>

          {/* Desktop connector between cards */}
          <div
            aria-hidden
            className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
            style={{ zIndex: 4 }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "8px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.30)",
                whiteSpace: "nowrap",
              }}
            >
              Attribution Layer
            </span>
            <div
              style={{
                width: "1px",
                height: "28px",
                background:
                  "linear-gradient(180deg, rgba(59,91,255,0.5), rgba(200,169,106,0.5))",
              }}
            />
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
              <path d="M0 5 L14 5 M10 1 L14 5 L10 9" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* AFTER */}
          <article
            data-surface="light"
            aria-label="After"
            className="rounded-[var(--r-card)] p-8 sm:p-10"
            style={{
              background: "rgba(246,248,252,0.97)",
              border: "1px solid rgba(59,91,255,0.18)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 0 1px rgba(59,91,255,0.08), 0 8px 32px rgba(59,91,255,0.06)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#3B5BFF",
              }}
            >
              After
            </span>
            <h3
              className="mt-3 t-h3"
              style={{ color: "#0B0F1A" }}
            >
              Causal system, compounding outcomes
            </h3>
            <CleanChart className="mt-6 h-40 w-full" />
            <ul
              className="mt-6 space-y-2 t-small"
              style={{ color: "rgba(11,15,26,0.62)" }}
            >
              <li>· Clearer decision inputs, revenue-linked metrics</li>
              <li>· Attribution as identification — not correlation</li>
              <li>· Systemized execution, diagnostic-ready growth loop</li>
              <li>· Founder freed from operations, focused on signal</li>
            </ul>
          </article>
        </div>

        {/* ── Metric tiles ── */}
        <dl className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.metric}
              className="rounded-[var(--r-card)] p-7"
              style={{
                background: "rgba(10,14,28,0.72)",
                border: `1px solid rgba(255,255,255,0.08)`,
                borderLeft: `2px solid ${s.accent}`,
                backdropFilter: "blur(8px)",
              }}
            >
              <dt
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: s.accent,
                }}
              >
                {s.metric}
              </dt>
              <dd
                className="mt-3 font-bold"
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "clamp(28px,3.6vw,42px)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  color: "#FFFFFF",
                }}
              >
                {s.direction}&thinsp;{s.value}
              </dd>
              <p
                className="mt-2"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.45)",
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
            color: "rgba(255,255,255,0.28)",
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

// ─── Inline charts ────────────────────────────────────────────────────────────

function ChaoticChart({ className }: { className?: string }) {
  const path =
    "M0,40 L8,28 L16,36 L24,18 L32,40 L40,22 L48,46 L56,24 L64,38 L72,16 L80,42 L88,28 L96,34 L100,30";
  return (
    <svg viewBox="0 0 100 60" preserveAspectRatio="none" className={className} aria-hidden>
      <path
        d={path}
        fill="none"
        stroke="#FF6A30"
        strokeWidth="0.7"
        opacity="0.85"
      />
      {[12, 28, 18, 36, 24, 32, 16, 30, 14, 26].map((h, i) => (
        <rect
          key={i}
          x={i * 10 + 1}
          y={60 - h}
          width="3"
          height={h}
          fill="rgba(200,169,106,0.22)"
        />
      ))}
    </svg>
  );
}

function CleanChart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 60" preserveAspectRatio="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="cleanFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B5BFF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#3B5BFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[15, 30, 45].map((y) => (
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#3B5BFF" strokeWidth="0.3" opacity="0.18" />
      ))}
      <path d="M0,52 C20,46 35,38 55,28 C72,20 85,14 100,8 L100,60 L0,60 Z" fill="url(#cleanFill)" />
      <path
        d="M0,52 C20,46 35,38 55,28 C72,20 85,14 100,8"
        fill="none"
        stroke="#3B5BFF"
        strokeWidth="1.2"
      />
      {[
        { x: 10, y: 49 },
        { x: 30, y: 41 },
        { x: 50, y: 31 },
        { x: 72, y: 20 },
        { x: 95, y: 10 },
      ].map((m, i) => (
        <circle key={i} cx={m.x} cy={m.y} r="1.8" fill="#3B5BFF" />
      ))}
    </svg>
  );
}
