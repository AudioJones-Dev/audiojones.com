import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";

// ─── Asset ───────────────────────────────────────────────────────────────────

const BG =
  "/assets/Homepage/07-applied-intelligence-systems/backgrounds/applied-intelligence-systems-background.png";

// ─── Stage data ──────────────────────────────────────────────────────────────

type Stage = {
  n: string;
  label: string;
  desc: string;
  bullets: readonly string[];
  accent: string;
  border: string;
  cardBg: string;
  dotColor: string;
  glow?: string;
};

const STAGES: Stage[] = [
  {
    n: "01",
    label: "Input",
    desc: "Raw data enters the system.",
    bullets: [
      "Customer behavior signals",
      "Sales conversation patterns",
      "Attribution & founder intuition",
    ],
    accent: "#C8A96A",
    border: "rgba(200,169,106,0.22)",
    cardBg: "rgba(200,169,106,0.04)",
    dotColor: "#C8A96A",
  },
  {
    n: "02",
    label: "Process",
    desc: "Noise removed, signal identified.",
    bullets: [
      "Signal vs noise filtering",
      "M.A.P attribution scoring",
      "Constraint mapping",
    ],
    accent: "#3B5BFF",
    border: "rgba(59,91,255,0.42)",
    cardBg: "rgba(59,91,255,0.07)",
    dotColor: "#8EA2FF",
    glow:
      "0 0 32px -8px rgba(59,91,255,0.28), 0 0 16px -4px rgba(59,91,255,0.12), inset 0 0 0 1px rgba(59,91,255,0.08)",
  },
  {
    n: "03",
    label: "Output",
    desc: "Clarity drives execution.",
    bullets: [
      "Prioritized decisions",
      "AI-augmented workflows",
      "Deployed campaigns",
    ],
    accent: "#94A3B8",
    border: "rgba(148,163,184,0.16)",
    cardBg: "rgba(148,163,184,0.03)",
    dotColor: "#94A3B8",
  },
  {
    n: "04",
    label: "Feedback",
    desc: "Outcomes update the model.",
    bullets: [
      "Revenue-linked validation",
      "Predictive model refinement",
      "Loop compounds over time",
    ],
    accent: "#FF4500",
    border: "rgba(255,69,0,0.24)",
    cardBg: "rgba(255,69,0,0.05)",
    dotColor: "#FF6A30",
  },
];

// ─── Stage card mini icons ────────────────────────────────────────────────────

function InputIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      {([-4.5, 0, 4.5] as number[]).flatMap((x) =>
        ([-4, 4] as number[]).map((y) => (
          <circle
            key={`${x}${y}`}
            cx={11 + x}
            cy={11 + y}
            r="1.8"
            fill={color}
            opacity="0.55"
          />
        ))
      )}
    </svg>
  );
}

function ProcessIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <rect x="4" y="5" width="14" height="12" rx="1.5" stroke={color} strokeWidth="1.1" opacity="0.8" />
      {([-2.5, 2.5] as number[]).map((y) => (
        <line key={`L${y}`} x1="1.5" y1={11 + y} x2="4" y2={11 + y} stroke={color} strokeWidth="1.1" opacity="0.8" />
      ))}
      {([-2.5, 2.5] as number[]).map((y) => (
        <line key={`R${y}`} x1="18" y1={11 + y} x2="20.5" y2={11 + y} stroke={color} strokeWidth="1.1" opacity="0.8" />
      ))}
      <circle cx="11" cy="11" r="2.2" fill={color} opacity="0.9" />
    </svg>
  );
}

function OutputIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="9" stroke={color} strokeWidth="0.9" opacity="0.45" />
      <circle cx="11" cy="11" r="5" stroke={color} strokeWidth="0.9" opacity="0.60" />
      <circle cx="11" cy="11" r="1.8" fill={color} opacity="0.80" />
    </svg>
  );
}

function FeedbackIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      {/* 270° clockwise arc from top, ending at right */}
      <path
        d="M 11 2 A 9 9 0 1 1 20 11"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Arrowhead at arc end (right side) */}
      <path
        d="M 17 8 L 20 11 L 17 14"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
}

const STAGE_ICONS: Record<string, (color: string) => React.ReactNode> = {
  Input: (c) => <InputIcon color={c} />,
  Process: (c) => <ProcessIcon color={c} />,
  Output: (c) => <OutputIcon color={c} />,
  Feedback: (c) => <FeedbackIcon color={c} />,
};

// ─── Loop SVG ─────────────────────────────────────────────────────────────────

const LOOP_NODES = [
  { cx: 100, label: "Input",    idx: 0 },
  { cx: 300, label: "Process",  idx: 1 },
  { cx: 500, label: "Output",   idx: 2 },
  { cx: 700, label: "Feedback", idx: 3 },
] as const;

function LoopSVG({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="Applied Intelligence Systems loop: input, process, output, feedback"
      viewBox="0 0 800 195"
      className={className}
    >
      <defs>
        <filter id="ais-process-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Connector spine ── */}
      <line
        x1="100" y1="105"
        x2="700" y2="105"
        stroke="#3B5BFF"
        strokeWidth="1"
        opacity="0.30"
      />

      {/* Midpoint dots between nodes */}
      {[200, 400, 600].map((x) => (
        <circle key={x} cx={x} cy="105" r="2.5" fill="#3B5BFF" opacity="0.35" />
      ))}

      {/* ── Feedback return arc (above) ── */}
      <path
        d="M 700 83 Q 750 22 400 22 Q 60 22 100 83"
        fill="none"
        stroke="#3B5BFF"
        strokeWidth="0.8"
        strokeDasharray="4 4"
        opacity="0.35"
      />
      {/* Arrow at Input end */}
      <path
        d="M 97 89 L 100 83 L 103 89"
        fill="none"
        stroke="#3B5BFF"
        strokeWidth="0.9"
        opacity="0.35"
      />

      {/* ── Nodes ── */}
      {LOOP_NODES.map((node) => {
        const isProcess = node.idx === 1;
        const r = isProcess ? 28 : 22;

        return (
          <g key={node.label}>
            {/* Outer glow ring — Process only */}
            {isProcess && (
              <circle
                cx={node.cx} cy="105" r="38"
                fill="none"
                stroke="#3B5BFF"
                strokeWidth="0.5"
                opacity="0.16"
              />
            )}

            {/* Node circle */}
            <circle
              cx={node.cx}
              cy="105"
              r={r}
              fill={isProcess ? "rgba(14,20,48,0.98)" : "rgba(10,15,30,0.95)"}
              stroke="#3B5BFF"
              strokeWidth={isProcess ? 1.5 : 1}
              opacity={isProcess ? 1 : 0.38}
              filter={isProcess ? "url(#ais-process-glow)" : undefined}
            />

            {/* Icon inside node — centered at (cx, 105) */}
            <g transform={`translate(${node.cx}, 105)`}>
              {node.idx === 0 && (
                <>
                  {([-4.5, 0, 4.5] as number[]).flatMap((x) =>
                    ([-4, 4] as number[]).map((y) => (
                      <circle key={`${x}${y}`} cx={x} cy={y} r="1.8" fill="#C8A96A" opacity="0.6" />
                    ))
                  )}
                </>
              )}
              {node.idx === 1 && (
                <>
                  <rect x="-9" y="-8" width="18" height="16" rx="2" fill="none" stroke="#3B5BFF" strokeWidth="1.2" opacity="0.95" />
                  {([-3.5, 3.5] as number[]).map((y) => (
                    <line key={`L${y}`} x1="-13" y1={y} x2="-9" y2={y} stroke="#3B5BFF" strokeWidth="1.2" opacity="0.95" />
                  ))}
                  {([-3.5, 3.5] as number[]).map((y) => (
                    <line key={`R${y}`} x1="9" y1={y} x2="13" y2={y} stroke="#3B5BFF" strokeWidth="1.2" opacity="0.95" />
                  ))}
                  <circle cx="0" cy="0" r="3.2" fill="#3B5BFF" opacity="1" />
                </>
              )}
              {node.idx === 2 && (
                <>
                  <circle cx="0" cy="0" r="13" fill="none" stroke="#94A3B8" strokeWidth="0.8" opacity="0.45" />
                  <circle cx="0" cy="0" r="7" fill="none" stroke="#94A3B8" strokeWidth="0.8" opacity="0.60" />
                  <circle cx="0" cy="0" r="2.2" fill="#94A3B8" opacity="0.80" />
                </>
              )}
              {node.idx === 3 && (
                <>
                  <path
                    d="M 0 -10 A 10 10 0 1 1 9 5"
                    fill="none"
                    stroke="#FF4500"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    opacity="0.65"
                  />
                  <path
                    d="M 6 1 L 9 5 L 12 1"
                    fill="none"
                    stroke="#FF4500"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.65"
                  />
                </>
              )}
            </g>

            {/* Label below node */}
            <text
              x={node.cx}
              y="155"
              textAnchor="middle"
              fontSize="10"
              fontFamily="ui-monospace, monospace"
              letterSpacing="0.18em"
              fill={isProcess ? "#E5E7EB" : "#C8A96A"}
              fontWeight={isProcess ? "600" : "400"}
              opacity={isProcess ? 0.9 : 0.65}
            >
              {node.label.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SystemModelLoop() {
  return (
    <section
      id="system-model"
      className="relative overflow-hidden border-t border-[var(--line-2)] bg-[#05070F] py-24 sm:py-32"
    >
      {/* ── Background image ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <Image
          src={BG}
          alt=""
          fill
          className="object-cover object-center"
          style={{ opacity: 0.88 }}
          sizes="100vw"
        />
      </div>

      {/* ── Dark overlay — edges only, open in the middle to show the image ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,7,15,0.60) 0%, rgba(5,7,15,0.18) 35%, rgba(5,7,15,0.18) 65%, rgba(5,7,15,0.72) 100%)",
        }}
      />

      {/* ── Left-edge fade so text stays readable ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,7,15,0.65) 0%, transparent 40%)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Header */}
        <div className="mb-14 max-w-3xl">
          <Eyebrow>Applied Intelligence Systems</Eyebrow>
          <h2 className="mt-4 t-h1 text-balance">
            AI only works when the system is ready.
          </h2>
          <p className="mt-5 t-lead text-fg-2">
            Automation applied to broken systems accelerates dysfunction.
            Applied Intelligence Systems align human judgment, data signals,
            and feedback loops before automation scales the work.
          </p>
        </div>

        {/* ── Diagram panel ── */}
        <div
          className="relative rounded-[var(--r-panel)] border border-[var(--line-2)] p-8 sm:p-12"
          style={{
            background: "rgba(5,8,20,0.52)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 0 0 1px rgba(59,91,255,0.12), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Inner blue glow — Process node zone */}
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              top: 0,
              left: "22%",
              width: "36%",
              height: "55%",
              background:
                "radial-gradient(ellipse 80% 70% at 50% 20%, rgba(59,91,255,0.10), transparent 75%)",
            }}
          />

          {/* Loop diagram */}
          <LoopSVG className="relative mx-auto w-full max-w-3xl" />

          {/* Stage cards */}
          <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {STAGES.map((stage) => (
              <div
                key={stage.n}
                className="relative overflow-hidden rounded-[var(--r-lg)] p-5"
                style={{
                  background: stage.cardBg,
                  border: `1px solid ${stage.border}`,
                  boxShadow: stage.glow,
                }}
              >
                {/* Stage number + icon */}
                <div className="mb-4 flex items-start justify-between">
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: stage.accent,
                    }}
                  >
                    {stage.n}
                  </span>
                  <span aria-hidden style={{ opacity: 0.55 }}>
                    {STAGE_ICONS[stage.label]?.(stage.accent)}
                  </span>
                </div>

                <div
                  className="t-h4"
                  style={{
                    color: stage.label === "Process" ? "#E5E7EB" : undefined,
                  }}
                >
                  {stage.label}
                </div>
                <p className="mt-2 t-small text-fg-2">{stage.desc}</p>

                <ul className="mt-3 space-y-1.5">
                  {stage.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span
                        aria-hidden
                        className="mt-[5px] inline-block h-1 w-1 shrink-0 rounded-full opacity-70"
                        style={{ background: stage.dotColor }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "11px",
                          lineHeight: 1.5,
                          color: "var(--fg-3)",
                        }}
                      >
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
