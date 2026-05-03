import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

const REFRAME_BG =
  "/assets/Homepage/04-problem-reframe/backgrounds/reframe-bg-dark-structured-desktop.png";

const noiseBullets = [
  "Too many tools, no operating system",
  "Vanity metrics dressed up as KPIs",
  "Disconnected dashboards, fragmented signal",
  "Misattribution — last-click theatre",
];

const systemBullets = [
  "Causal inputs identified, scored, ranked",
  "One signal map, one operating model",
  "Attribution as identification, not correlation",
  "Decisions made under clarity, not load",
];

export default function ProblemReframeSplit() {
  return (
    <section
      id="problem"
      className="relative overflow-hidden border-t border-white/5"
      style={{ background: "#05070F" }}
    >
      {/* ── Background image — atmospheric layer ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 0 }}
      >
        <Image
          src={REFRAME_BG}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay so text stays readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,7,15,0.72) 0%, rgba(5,7,15,0.60) 50%, rgba(5,7,15,0.78) 100%)",
          }}
        />
      </div>

      {/* ── Restrained orange glow — lower right ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          zIndex: 0,
          bottom: "-10%",
          right: "-5%",
          width: "40%",
          height: "55%",
          background:
            "radial-gradient(ellipse at 80% 80%, rgba(255,69,0,0.07), transparent 65%)",
        }}
      />
      {/* ── Faint blue glow — upper right ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          zIndex: 0,
          top: "-8%",
          right: "0%",
          width: "30%",
          height: "40%",
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(59,91,255,0.07), transparent 65%)",
        }}
      />

      {/* ── Section content ── */}
      <div
        className="relative mx-auto max-w-[1280px] px-5 py-24 sm:px-8 sm:py-32"
        style={{ zIndex: 1 }}
      >
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <Eyebrow>The Reframe</Eyebrow>
          <h2 className="mt-4 t-h1 text-balance text-white">
            You don&apos;t have a growth problem.{" "}
            <span className="text-aj-orange">You have a signal problem.</span>
          </h2>
          <p
            className="mt-5 t-lead"
            style={{ color: "rgba(255,255,255,0.58)" }}
          >
            Most companies misdiagnose stalled growth as a marketing or AI
            problem. Underneath, the architecture is leaking signal.
          </p>
          {/* Orange accent rule */}
          <div
            className="mt-6"
            style={{
              width: "48px",
              height: "2px",
              background:
                "linear-gradient(to right, #FF4500, rgba(255,69,0,0))",
              borderRadius: "1px",
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* ── NOISE card ── */}
          <article
            aria-label="Noise side"
            className="relative flex flex-col overflow-hidden rounded-[var(--r-card)]"
            style={{
              background: "rgba(8,10,20,0.72)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Dim gold top edge */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(200,169,106,0.28), transparent)",
              }}
            />
            <div className="p-8 sm:p-10">
              <Eyebrow tone="muted">Noise</Eyebrow>
              <h3 className="mt-3 t-h3 text-white/75">
                Activity scaled — without leverage
              </h3>
              <ul className="mt-5 space-y-3">
                {noiseBullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-[6px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                      style={{
                        border: "1px solid rgba(200,169,106,0.22)",
                        fontSize: "9px",
                        color: "rgba(200,169,106,0.45)",
                      }}
                    >
                      ✕
                    </span>
                    <span
                      className="t-small leading-[1.6]"
                      style={{ color: "rgba(255,255,255,0.42)" }}
                    >
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
              <NoiseDashboard className="mt-8" />
            </div>
          </article>

          {/* ── SYSTEM card ── */}
          <article
            aria-label="System side"
            className="relative flex flex-col overflow-hidden rounded-[var(--r-card)]"
            style={{
              background: "rgba(8,12,28,0.82)",
              border: "1px solid rgba(59,91,255,0.20)",
              backdropFilter: "blur(12px)",
              boxShadow:
                "0 0 60px -12px rgba(59,91,255,0.16), 0 0 30px -8px rgba(255,69,0,0.06)",
            }}
          >
            {/* Blue→orange top edge */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(59,91,255,0.55), rgba(255,69,0,0.22), transparent)",
              }}
            />
            {/* Live indicator */}
            <div
              aria-hidden
              className="absolute right-6 top-6 h-2 w-2 rounded-full"
              style={{
                background: "#3B5BFF",
                boxShadow: "0 0 8px 2px rgba(59,91,255,0.5)",
              }}
            />
            <div className="p-8 sm:p-10">
              <Eyebrow tone="blue">System</Eyebrow>
              <h3 className="mt-3 t-h3 text-white">
                Signal extracted — outcomes compound
              </h3>
              <ul className="mt-5 space-y-3">
                {systemBullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-[6px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-aj-blue-bright"
                      style={{
                        border: "1px solid rgba(59,91,255,0.40)",
                        fontSize: "9px",
                      }}
                    >
                      ✓
                    </span>
                    <span
                      className="t-small leading-[1.6]"
                      style={{ color: "rgba(255,255,255,0.80)" }}
                    >
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
              <SystemDashboard className="mt-8" />
              <div
                className="mt-6 pt-5"
                style={{ borderTop: "1px solid rgba(59,91,255,0.16)" }}
              >
                <ButtonLink
                  href="/applied-intelligence/diagnostic"
                  variant="glow"
                >
                  Run the Diagnostic
                </ButtonLink>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ─── Noise Dashboard ──────────────────────────────────────────────────────── */
function NoiseDashboard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`overflow-hidden rounded-[var(--r-lg)] ${className ?? ""}`}
      style={{
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(5,7,15,0.70)",
      }}
    >
      <div
        className="flex items-center justify-between border-b px-4 py-2.5"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ background: "#FF4500", opacity: 0.42 }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Analytics — 7 tools
          </span>
        </div>
        <div className="flex gap-1.5">
          {(
            [
              "rgba(200,169,106,0.16)",
              "rgba(59,91,255,0.16)",
              "rgba(255,69,0,0.16)",
            ] as string[]
          ).map((c, i) => (
            <div
              key={i}
              className="h-1.5 w-8 rounded-full"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Sessions", val: "48,291", delta: "+12%", pos: true },
            { label: "CAC", val: "$342", delta: "+28%", pos: false },
            { label: "Conv Rate", val: "1.8%", delta: "−3%", pos: false },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-[6px] px-2.5 py-2"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "8px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.22)",
                }}
              >
                {k.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.50)",
                  marginTop: "2px",
                }}
              >
                {k.val}
              </div>
              <div
                style={{
                  fontSize: "9px",
                  color: k.pos
                    ? "rgba(74,222,128,0.50)"
                    : "rgba(255,69,0,0.60)",
                  marginTop: "1px",
                }}
              >
                {k.delta}
              </div>
            </div>
          ))}
        </div>
        <div
          className="rounded-[6px] p-3"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "8px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.20)",
              marginBottom: "8px",
            }}
          >
            Performance — 12 weeks
          </div>
          <svg viewBox="0 0 260 68" className="h-14 w-full">
            {[17, 34, 51].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="260"
                y2={y}
                stroke="white"
                strokeWidth="0.3"
                opacity="0.07"
              />
            ))}
            <polyline
              points="0,52 22,30 44,58 66,18 88,46 110,12 132,50 154,26 176,60 198,16 220,44 242,20 260,42"
              fill="none"
              stroke="#FF4500"
              strokeWidth="1.2"
              opacity="0.52"
            />
            <polyline
              points="0,28 22,52 44,14 66,48 88,22 110,58 132,18 154,56 176,16 198,48 220,10 242,52 260,28"
              fill="none"
              stroke="#C8A96A"
              strokeWidth="1.2"
              opacity="0.32"
            />
            <polyline
              points="0,40 22,36 44,44 66,30 88,50 110,36 132,26 154,48 176,32 198,58 220,26 242,62 260,18"
              fill="none"
              stroke="#3B5BFF"
              strokeWidth="1.2"
              opacity="0.25"
            />
          </svg>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { tool: "Google Ads", stat: "ROAS 1.2x", ok: false },
            { tool: "HubSpot", stat: "412 open", ok: null },
            { tool: "GA4", stat: "Sessions ↑", ok: true },
            { tool: "Klaviyo", stat: "CTR 0.8%", ok: false },
          ].map((t) => (
            <div
              key={t.tool}
              className="flex items-center justify-between rounded-[6px] px-2.5 py-2"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "9px",
                    color: "rgba(255,255,255,0.38)",
                    fontWeight: 600,
                  }}
                >
                  {t.tool}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "8px",
                    color: "rgba(255,255,255,0.20)",
                    marginTop: "1px",
                  }}
                >
                  {t.stat}
                </div>
              </div>
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background:
                    t.ok === true
                      ? "rgba(74,222,128,0.45)"
                      : t.ok === false
                      ? "rgba(255,69,0,0.45)"
                      : "rgba(255,255,255,0.15)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── System Dashboard ─────────────────────────────────────────────────────── */
function SystemDashboard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`overflow-hidden rounded-[var(--r-lg)] ${className ?? ""}`}
      style={{
        border: "1px solid rgba(59,91,255,0.18)",
        background: "rgba(6,9,22,0.80)",
        boxShadow: "0 0 24px -8px rgba(59,91,255,0.12)",
      }}
    >
      <div
        className="flex items-center justify-between border-b px-4 py-2.5"
        style={{
          borderColor: "rgba(59,91,255,0.14)",
          background: "rgba(59,91,255,0.04)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{
              background: "#3B5BFF",
              boxShadow: "0 0 6px rgba(59,91,255,0.6)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.58)",
            }}
          >
            Signal Map — Live
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "9px",
            color: "#3B5BFF",
            fontWeight: 600,
          }}
        >
          ↑ 3 signals active
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "CAC", val: "↓ 37%", color: "#4CAF50" },
            { label: "Pipeline", val: "↑ 28%", color: "#3B5BFF" },
            { label: "Conv Rate", val: "↑ 42%", color: "#3B5BFF" },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-[6px] px-2.5 py-2"
              style={{
                background: "rgba(59,91,255,0.06)",
                border: "1px solid rgba(59,91,255,0.14)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "8px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                {k.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: k.color,
                  marginTop: "2px",
                }}
              >
                {k.val}
              </div>
            </div>
          ))}
        </div>
        <div
          className="rounded-[6px] p-3"
          style={{
            background: "rgba(59,91,255,0.04)",
            border: "1px solid rgba(59,91,255,0.11)",
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "8px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.33)",
              }}
            >
              Signal → Revenue
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "8px",
                color: "#3B5BFF",
                fontWeight: 600,
              }}
            >
              r² = 0.91
            </span>
          </div>
          <svg viewBox="0 0 260 68" className="h-14 w-full">
            <defs>
              <linearGradient id="sfill2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B5BFF" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#3B5BFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[17, 34, 51].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="260"
                y2={y}
                stroke="white"
                strokeWidth="0.3"
                opacity="0.07"
              />
            ))}
            <path
              d="M0,65 C50,58 100,48 150,34 C200,20 230,10 260,4 L260,68 L0,68 Z"
              fill="url(#sfill2)"
            />
            <path
              d="M0,65 C50,58 100,48 150,34 C200,20 230,10 260,4"
              fill="none"
              stroke="#3B5BFF"
              strokeWidth="1.8"
            />
            {[
              { x: 0, y: 65 },
              { x: 52, y: 55 },
              { x: 104, y: 44 },
              { x: 156, y: 30 },
              { x: 208, y: 16 },
              { x: 260, y: 4 },
            ].map((m, i) => (
              <circle
                key={i}
                cx={m.x}
                cy={m.y}
                r="2.6"
                fill="#3B5BFF"
                stroke="rgba(6,9,22,0.9)"
                strokeWidth="1.2"
              />
            ))}
          </svg>
        </div>
        <div className="space-y-1.5">
          {[
            { signal: "Behavior pattern", attr: "→ Pipeline ↑18%", strength: 91 },
            { signal: "Constraint mapped", attr: "→ CAC −$127/acq", strength: 84 },
            { signal: "Channel causality", attr: "→ ROI ×3 realloc", strength: 78 },
          ].map((s) => (
            <div
              key={s.signal}
              className="flex items-center gap-3 rounded-[6px] px-3 py-2"
              style={{
                background: "rgba(59,91,255,0.04)",
                border: "1px solid rgba(59,91,255,0.10)",
              }}
            >
              <div className="min-w-0 flex-1">
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "9px",
                    color: "rgba(255,255,255,0.75)",
                    fontWeight: 600,
                  }}
                >
                  {s.signal}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "8px",
                    color: "rgba(255,255,255,0.33)",
                    marginTop: "1px",
                  }}
                >
                  {s.attr}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <div
                  className="h-1 w-12 rounded-full"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.strength}%`,
                      background: "linear-gradient(to right,#3B5BFF,#7B9BFF)",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "8px",
                    color: "#3B5BFF",
                    fontWeight: 700,
                  }}
                >
                  {s.strength}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
