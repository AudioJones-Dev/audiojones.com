import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

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
      className="relative border-t border-[var(--line-2)] bg-bg-0 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-14 max-w-3xl">
          <Eyebrow>The Reframe</Eyebrow>
          <h2 className="mt-4 t-h1 text-balance">
            You don&apos;t have a growth problem.{" "}
            <span className="text-aj-orange">You have a signal problem.</span>
          </h2>
          <p className="mt-5 t-lead text-fg-2">
            Most companies misdiagnose stalled growth as a marketing or AI
            problem. Underneath, the architecture is leaking signal.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* NOISE side */}
          <article
            className="relative rounded-[var(--r-card)] border border-[var(--line-gold)] bg-bg-2 p-8 sm:p-10"
            aria-label="Noise side"
          >
            <Eyebrow tone="muted">Noise</Eyebrow>
            <h3 className="mt-3 t-h3">Activity scaled — without leverage</h3>
            <ul className="mt-5 space-y-3">
              {noiseBullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-[7px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[var(--line-gold)] text-fg-3"
                    style={{ fontSize: "9px" }}
                  >
                    ✕
                  </span>
                  <span className="t-small text-fg-2 leading-[1.6]">{b}</span>
                </li>
              ))}
            </ul>
            <NoiseDashboard className="mt-8" />
          </article>

          {/* SYSTEM side */}
          <article
            className="relative rounded-[var(--r-card)] border border-[var(--line-blue)] bg-[rgba(59,91,255,0.05)] p-8 sm:p-10"
            aria-label="System side"
            style={{ boxShadow: "0 0 48px -12px rgba(59,91,255,0.18)" }}
          >
            <div
              aria-hidden
              className="absolute top-6 right-6 h-2 w-2 rounded-full bg-aj-blue-bright"
              style={{ boxShadow: "0 0 8px 2px rgba(59,91,255,0.5)" }}
            />
            <Eyebrow tone="blue">System</Eyebrow>
            <h3 className="mt-3 t-h3">Signal extracted — outcomes compound</h3>
            <ul className="mt-5 space-y-3">
              {systemBullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-[7px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[var(--line-blue)] text-aj-blue-bright"
                    style={{ fontSize: "9px" }}
                  >
                    ✓
                  </span>
                  <span className="t-small text-fg-1 leading-[1.6]">{b}</span>
                </li>
              ))}
            </ul>
            <SystemDashboard className="mt-8" />
            <div className="mt-6 pt-5 border-t border-[var(--line-blue)]">
              <ButtonLink href="/applied-intelligence/diagnostic" variant="glow">
                Run the Diagnostic
              </ButtonLink>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   Noise Dashboard — fragmented, chaotic, misaligned
   ──────────────────────────────────────────── */
function NoiseDashboard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`rounded-[var(--r-lg)] border border-[var(--line-1)] bg-bg-3 overflow-hidden ${className ?? ""}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--line-1)]">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-aj-orange opacity-60" />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-3)" }}>
            Analytics — 7 tools
          </span>
        </div>
        <div className="flex gap-1.5">
          {(["rgba(200,169,106,0.25)", "rgba(59,91,255,0.25)", "rgba(255,69,0,0.25)"] as string[]).map((c, i) => (
            <div key={i} className="h-1.5 w-8 rounded-full" style={{ background: c }} />
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* KPI tiles — no causal context */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Sessions", val: "48,291", delta: "+12%", pos: true },
            { label: "CAC", val: "$342", delta: "+28%", pos: false },
            { label: "Conv Rate", val: "1.8%", delta: "−3%", pos: false },
          ].map((k) => (
            <div key={k.label} className="rounded-[6px] border border-[var(--line-1)] bg-bg-2 px-2.5 py-2">
              <div style={{ fontFamily: "var(--font-body)", fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)" }}>
                {k.label}
              </div>
              <div style={{ fontFamily: "var(--font-headline)", fontSize: "14px", fontWeight: 700, color: "var(--fg-0)", marginTop: "2px" }}>
                {k.val}
              </div>
              <div style={{ fontSize: "9px", color: k.pos ? "#4CAF50" : "#FF4500", marginTop: "1px" }}>
                {k.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Chaotic multi-line chart — contradicting signals */}
        <div className="rounded-[6px] border border-[var(--line-1)] bg-bg-2 p-3">
          <div style={{ fontFamily: "var(--font-body)", fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: "8px" }}>
            Performance — 12 weeks
          </div>
          <svg viewBox="0 0 260 68" className="w-full h-14">
            {[17, 34, 51].map(y => (
              <line key={y} x1="0" y1={y} x2="260" y2={y} stroke="currentColor" strokeWidth="0.4" className="text-fg-3" opacity="0.3" />
            ))}
            <polyline points="0,52 22,30 44,58 66,18 88,46 110,12 132,50 154,26 176,60 198,16 220,44 242,20 260,42" fill="none" stroke="#FF4500" strokeWidth="1.3" opacity="0.85" />
            <polyline points="0,28 22,52 44,14 66,48 88,22 110,58 132,18 154,56 176,16 198,48 220,10 242,52 260,28" fill="none" stroke="#C8A96A" strokeWidth="1.3" opacity="0.65" />
            <polyline points="0,40 22,36 44,44 66,30 88,50 110,36 132,26 154,48 176,32 198,58 220,26 242,62 260,18" fill="none" stroke="#3B5BFF" strokeWidth="1.3" opacity="0.5" />
          </svg>
          <div className="flex gap-3 mt-1.5">
            {[{ c: "#FF4500", l: "Channel A" }, { c: "#C8A96A", l: "Tool B" }, { c: "#3B5BFF", l: "Platform C" }].map(l => (
              <div key={l.l} className="flex items-center gap-1">
                <div className="h-1.5 w-3 rounded-full" style={{ background: l.c }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "8px", color: "var(--fg-3)" }}>{l.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disconnected tool tiles */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { tool: "Google Ads", stat: "ROAS 1.2x", ok: false },
            { tool: "HubSpot", stat: "412 open", ok: null },
            { tool: "GA4", stat: "Sessions ↑", ok: true },
            { tool: "Klaviyo", stat: "CTR 0.8%", ok: false },
          ].map((t) => (
            <div key={t.tool} className="flex items-center justify-between rounded-[6px] border border-[var(--line-1)] bg-bg-2 px-2.5 py-2">
              <div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "9px", color: "var(--fg-2)", fontWeight: 600 }}>{t.tool}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "8px", color: "var(--fg-3)", marginTop: "1px" }}>{t.stat}</div>
              </div>
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: t.ok === true ? "#4CAF50" : t.ok === false ? "#FF4500" : "var(--fg-3)",
                  opacity: t.ok === null ? 0.4 : 0.9,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   System Dashboard — unified, causal, compounding
   ──────────────────────────────────────────── */
function SystemDashboard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`rounded-[var(--r-lg)] border border-[var(--line-blue)] bg-bg-3 overflow-hidden ${className ?? ""}`}
      style={{ boxShadow: "0 0 24px -8px rgba(59,91,255,0.15)" }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--line-blue)]" style={{ background: "rgba(59,91,255,0.04)" }}>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-aj-blue-bright" style={{ boxShadow: "0 0 6px rgba(59,91,255,0.6)" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-2)" }}>
            Signal Map — Live
          </span>
        </div>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", color: "#3B5BFF", fontWeight: 600 }}>
          ↑ 3 signals active
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* Signal KPI tiles — causally labeled */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "CAC", val: "↓ 37%", color: "#4CAF50" },
            { label: "Pipeline", val: "↑ 28%", color: "#3B5BFF" },
            { label: "Conv Rate", val: "↑ 42%", color: "#3B5BFF" },
          ].map((k) => (
            <div key={k.label} className="rounded-[6px] border border-[var(--line-blue)] bg-[rgba(59,91,255,0.06)] px-2.5 py-2">
              <div style={{ fontFamily: "var(--font-body)", fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)" }}>
                {k.label}
              </div>
              <div style={{ fontFamily: "var(--font-headline)", fontSize: "15px", fontWeight: 700, color: k.color, marginTop: "2px" }}>
                {k.val}
              </div>
            </div>
          ))}
        </div>

        {/* Clean single signal → revenue chart */}
        <div className="rounded-[6px] border border-[var(--line-blue)] bg-[rgba(59,91,255,0.04)] p-3">
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontFamily: "var(--font-body)", fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)" }}>
              Signal → Revenue
            </span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "8px", color: "#3B5BFF", fontWeight: 600 }}>
              r² = 0.91
            </span>
          </div>
          <svg viewBox="0 0 260 68" className="w-full h-14">
            <defs>
              <linearGradient id="sfill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B5BFF" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3B5BFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[17, 34, 51].map(y => (
              <line key={y} x1="0" y1={y} x2="260" y2={y} stroke="currentColor" strokeWidth="0.4" className="text-fg-3" opacity="0.2" />
            ))}
            <path d="M0,65 C50,58 100,48 150,34 C200,20 230,10 260,4 L260,68 L0,68 Z" fill="url(#sfill)" />
            <path d="M0,65 C50,58 100,48 150,34 C200,20 230,10 260,4" fill="none" stroke="#3B5BFF" strokeWidth="1.8" />
            {[{ x: 0, y: 65 }, { x: 52, y: 55 }, { x: 104, y: 44 }, { x: 156, y: 30 }, { x: 208, y: 16 }, { x: 260, y: 4 }].map((m, i) => (
              <circle key={i} cx={m.x} cy={m.y} r="2.6" fill="#3B5BFF" stroke="var(--bg-3)" strokeWidth="1.2" />
            ))}
          </svg>
        </div>

        {/* Signal attribution rows */}
        <div className="grid grid-cols-1 gap-1.5">
          {[
            { signal: "Behavior pattern", attr: "→ Pipeline ↑18%", strength: 91 },
            { signal: "Constraint mapped", attr: "→ CAC −$127/acq", strength: 84 },
            { signal: "Channel causality", attr: "→ ROI ×3 realloc", strength: 78 },
          ].map((s) => (
            <div key={s.signal} className="flex items-center gap-3 rounded-[6px] border border-[var(--line-blue)] bg-[rgba(59,91,255,0.04)] px-3 py-2">
              <div className="flex-1 min-w-0">
                <div style={{ fontFamily: "var(--font-body)", fontSize: "9px", color: "var(--fg-1)", fontWeight: 600 }}>{s.signal}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "8px", color: "var(--fg-3)", marginTop: "1px" }}>{s.attr}</div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="h-1 w-12 rounded-full bg-bg-2">
                  <div className="h-full rounded-full" style={{ width: `${s.strength}%`, background: "linear-gradient(to right,#3B5BFF,#7B9BFF)" }} />
                </div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "8px", color: "#3B5BFF", fontWeight: 700 }}>{s.strength}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
