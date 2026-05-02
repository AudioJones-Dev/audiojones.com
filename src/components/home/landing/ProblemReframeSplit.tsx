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
          <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", col