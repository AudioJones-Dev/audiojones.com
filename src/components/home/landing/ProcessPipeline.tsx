import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";

// ─── Step data ────────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: "01",
    label: "Diagnose",
    desc: "Find the real constraint. Map the existing system — surface noise, gaps, and false signals before touching tools.",
    accent: "#C8A96A",
    border: "rgba(200,169,106,0.28)",
    bg: "linear-gradient(160deg, rgba(200,169,106,0.06) 0%, rgba(11,15,26,0.96) 100%)",
    glow: "0 0 28px -10px rgba(200,169,106,0.18), inset 0 0 0 1px rgba(200,169,106,0.04)",
    nodeColor: "#C8A96A",
    nodeBg: "rgba(200,169,106,0.12)",
    active: false,
  },
  {
    n: "02",
    label: "Attribute",
    desc: "Identify what is actually creating outcomes. Apply M.A.P. Filter every metric through meaningful, actionable, profitable.",
    accent: "#3B5BFF",
    border: "rgba(59,91,255,0.45)",
    bg: "linear-gradient(160deg, rgba(59,91,255,0.09) 0%, rgba(11,15,26,0.96) 100%)",
    glow: "0 0 40px -10px rgba(59,91,255,0.28), 0 0 16px -6px rgba(255,69,0,0.06), inset 0 0 0 1px rgba(59,91,255,0.08)",
    nodeColor: "#8EA2FF",
    nodeBg: "rgba(59,91,255,0.16)",
    active: true,
  },
  {
    n: "03",
    label: "Design",
    desc: "Build the system around the signal. Architect the operating model — signal → process → output → feedback.",
    accent: "#94A3B8",
    border: "rgba(148,163,184,0.22)",
    bg: "linear-gradient(160deg, rgba(148,163,184,0.05) 0%, rgba(11,15,26,0.96) 100%)",
    glow: "0 0 28px -10px rgba(148,163,184,0.12), inset 0 0 0 1px rgba(148,163,184,0.03)",
    nodeColor: "#94A3B8",
    nodeBg: "rgba(148,163,184,0.10)",
    active: false,
  },
  {
    n: "04",
    label: "Deploy",
    desc: "Turn the system into repeatable execution. Instrument everything. Compound the loop.",
    accent: "#FF4500",
    border: "rgba(255,69,0,0.32)",
    bg: "linear-gradient(160deg, rgba(255,69,0,0.07) 0%, rgba(11,15,26,0.96) 100%)",
    glow: "0 0 28px -10px rgba(255,69,0,0.20), inset 0 0 0 1px rgba(255,69,0,0.04)",
    nodeColor: "#FF6A30",
    nodeBg: "rgba(255,69,0,0.12)",
    active: false,
  },
] as const;

// ─── Process Rail SVG — desktop only ─────────────────────────────────────────
// Four nodes connected by a dashed rail with directional chevrons between them.

function ProcessRail() {
  // Node X positions (percent of 100% width container, mirrored in SVG)
  // Rail runs at y=20 in a 500×40 viewBox
  const nodeXs = [62, 187, 313, 438] as const;
  const cy = 20;
  const r = 5;

  const NODES = STEPS.map((s, i) => ({
    cx: nodeXs[i],
    cy,
    r,
    color: s.nodeColor,
    nodeBg: s.nodeBg,
    active: s.active,
  }));

  // Midpoints for chevron arrows between nodes
  const MID_XS = [
    (nodeXs[0] + nodeXs[1]) / 2,
    (nodeXs[1] + nodeXs[2]) / 2,
    (nodeXs[2] + nodeXs[3]) / 2,
  ] as const;

  return (
    <svg
      viewBox="0 0 500 40"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "40px", overflow: "visible" }}
    >
      <defs>
        {/* Rail gradient: gold → blue → steel → orange */}
        <linearGradient id="pp-rail-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C8A96A" stopOpacity="0.30" />
          <stop offset="33%" stopColor="#3B5BFF" stopOpacity="0.50" />
          <stop offset="66%" stopColor="#94A3B8" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#FF4500" stopOpacity="0.38" />
        </linearGradient>

        {/* Glow filter for Attribute node */}
        <filter id="pp-node-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Rail line */}
      <line
        x1={nodeXs[0]}
        y1={cy}
        x2={nodeXs[3]}
        y2={cy}
        stroke="url(#pp-rail-gradient)"
        strokeWidth="1"
        strokeDasharray="4 3"
      />

      {/* Chevron arrows between nodes */}
      {MID_XS.map((mx, i) => (
        <g key={i} transform={`translate(${mx}, ${cy})`}>
          <path
            d="M-3 -3.5 L1 0 L-3 3.5"
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}

      {/* Node circles */}
      {NODES.map((n, i) => (
        <g key={i} filter={n.active ? "url(#pp-node-glow)" : undefined}>
          {/* Outer ring (active only) */}
          {n.active && (
            <circle
              cx={n.cx}
              cy={n.cy}
              r={n.r + 4.5}
              fill="none"
              stroke={n.color}
              strokeWidth="0.5"
              strokeOpacity="0.30"
            />
          )}
          {/* Node fill */}
          <circle cx={n.cx} cy={n.cy} r={n.r} fill={n.nodeBg} />
          {/* Node border */}
          <circle
            cx={n.cx}
            cy={n.cy}
            r={n.r}
            fill="none"
            stroke={n.color}
            strokeWidth={n.active ? "1.5" : "1"}
            strokeOpacity={n.active ? 0.9 : 0.6}
          />
          {/* Inner dot */}
          <circle cx={n.cx} cy={n.cy} r={n.active ? 2.5 : 1.8} fill={n.color} />
        </g>
      ))}
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProcessPipeline() {
  return (
    <section
      id="process"
      className="relative border-t border-[var(--line-2)] bg-bg-0 py-24 sm:py-32"
      style={{ overflow: "hidden" }}
    >
      {/* ── Atmospheric glows ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Orange glow — upper right */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: "45%",
            height: "70%",
            background:
              "radial-gradient(ellipse 70% 60% at 85% 20%, rgba(255,69,0,0.07), transparent 65%)",
          }}
        />
        {/* Blue glow — center, along card rail */}
        <div
          style={{
            position: "absolute",
            top: "35%",
            left: "15%",
            width: "70%",
            height: "60%",
            background:
              "radial-gradient(ellipse 80% 50% at 50% 55%, rgba(59,91,255,0.07), transparent 70%)",
          }}
        />
        {/* Gold warmth — lower left, Diagnose anchor */}
        <div
          style={{
            position: "absolute",
            bottom: "0%",
            left: "-5%",
            width: "35%",
            height: "55%",
            background:
              "radial-gradient(ellipse 60% 50% at 15% 80%, rgba(200,169,106,0.05), transparent 65%)",
          }}
        />
      </div>

      {/* ── Decorative SVG infographic — desktop/tablet, behind cards ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden sm:block"
        style={{ zIndex: 0 }}
      >
        <Image
          src="/assets/Homepage/09-process-pipeline/diagrams/process-infographic-reference.svg"
          alt=""
          fill
          className="object-contain object-center"
          style={{ opacity: 0.045 }}
          sizes="100vw"
        />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8" style={{ zIndex: 1 }}>
        {/* ── Header ── */}
        <div className="mb-14 max-w-3xl">
          <Eyebrow>The Process</Eyebrow>

          {/* Signal-path rule */}
          <div
            aria-hidden
            className="mt-5 mb-5"
            style={{
              width: "48px",
              height: "1.5px",
              background: "linear-gradient(to right, #FF4500, rgba(255,69,0,0))",
              boxShadow: "0 0 6px 1px rgba(255,69,0,0.25)",
            }}
          />

          <h2 className="t-h1 text-balance">
            Diagnose. Design. Deploy.
          </h2>
          <p className="mt-5 t-lead text-fg-2">
            Four steps. No tool list. Each phase builds on the last until the
            loop is causal and the system compounds on its own.
          </p>
        </div>

        {/* ── Desktop process rail — hidden below lg ── */}
        <div className="mb-6 hidden lg:block">
          {/* Phase labels above the rail */}
          <div
            className="mb-2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1rem",
            }}
          >
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: s.accent,
                    opacity: s.active ? 1 : 0.6,
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          {/* The SVG rail */}
          <ProcessRail />
        </div>

        {/* ── Cards grid ── */}
        <ol
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
          style={{ position: "relative" }}
        >
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              className="relative flex flex-col rounded-[var(--r-card)] p-7"
              style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                boxShadow: s.glow,
              }}
            >
              {/* Top accent line */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  left: "12%",
                  right: "12%",
                  height: "1px",
                  background: `linear-gradient(90deg, transparent, ${s.accent}${s.active ? "CC" : "55"}, transparent)`,
                }}
              />

              {/* Phase number + active indicator */}
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    color: s.accent,
                    opacity: s.active ? 1 : 0.75,
                  }}
                >
                  {s.n}
                </span>

                {s.active ? (
                  /* Active signal dot with pulse ring */
                  <div aria-label="Active phase" style={{ position: "relative", width: "8px", height: "8px" }}>
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: "-4px",
                        borderRadius: "50%",
                        border: "1px solid rgba(59,91,255,0.25)",
                      }}
                    />
                    <span
                      style={{
                        display: "block",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#3B5BFF",
                        boxShadow: "0 0 10px 2px rgba(59,91,255,0.50)",
                      }}
                    />
                  </div>
                ) : (
                  <span
                    aria-hidden
                    style={{
                      display: "block",
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: s.accent,
                      opacity: 0.35,
                    }}
                  />
                )}
              </div>

              {/* Phase label */}
              <h3
                className="mt-4"
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "18px",
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: "#E5E7EB",
                }}
              >
                {s.label}
              </h3>

              {/* Description */}
              <p
                className="mt-3 flex-1"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  lineHeight: 1.65,
                  color: "#94A3B8",
                }}
              >
                {s.desc}
              </p>

              {/* Desktop connector arrow — between cards, not on last */}
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden
                  className="absolute -right-[13px] top-1/2 hidden -translate-y-1/2 lg:flex"
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: "rgba(7, 9, 18, 0.9)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                    <path
                      d="M2 5H8M8 5L5.5 2.5M8 5L5.5 7.5"
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              {/* Mobile/tablet vertical connector — between stacked cards, not on last */}
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden
                  className="flex lg:hidden justify-center mt-0 pt-4"
                  style={{
                    position: "absolute",
                    bottom: "-20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 2,
                  }}
                >
                  <svg width="10" height="20" viewBox="0 0 10 20" fill="none" aria-hidden>
                    <line
                      x1="5" y1="0" x2="5" y2="14"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <path
                      d="M2.5 11L5 14.5L7.5 11"
                      fill="none"
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </li>
          ))}
        </ol>

        {/* ── Principle strip ── */}
        <div
          className="mx-auto mt-14 max-w-2xl rounded-[var(--r-lg)] px-6 py-5 text-center"
          style={{
            background: "rgba(7,9,18,0.75)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(8px)",
            boxShadow:
              "0 0 24px -8px rgba(59,91,255,0.10), 0 0 16px -8px rgba(255,69,0,0.08)",
          }}
        >
          <p
            className="text-fg-2"
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: 1.55,
              letterSpacing: "-0.01em",
            }}
          >
            The system is not built in phases.{" "}
            <span style={{ color: "#FF6A30", fontWeight: 600 }}>
              It is built in sequence — and it compounds.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
