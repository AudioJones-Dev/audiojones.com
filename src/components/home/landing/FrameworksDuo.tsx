import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function FrameworksDuo() {
  return (
    <section
      id="frameworks"
      className="relative border-t border-[var(--line-2)] bg-bg-0 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-14 max-w-3xl">
          <Eyebrow>Proprietary Frameworks</Eyebrow>
          <h2 className="mt-4 t-h1 text-balance">
            Two frameworks. One operating model.
          </h2>
          <p className="mt-5 t-lead text-fg-2">
            M.A.P decides what data deserves a decision. N.I.C.H.E decides where the
            decision actually compounds.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* M.A.P card with triangle/pyramid diagram */}
          <article className="rounded-[var(--r-card)] border border-[var(--line-2)] bg-bg-2 p-8 sm:p-10 transition-colors hover:border-[var(--line-blue)]">
            <Eyebrow tone="blue">M.A.P</Eyebrow>
            <h3 className="mt-3 t-h2">Meaningful · Actionable · Profitable</h3>
            <p className="mt-4 t-body text-fg-2">
              An attribution framework for evaluating whether a metric should drive
              strategy at all. Most dashboards measure activity. M.A.P measures
              causal economic impact.
            </p>
            <MAPTriangle className="mx-auto mt-8 w-full max-w-md" />
            <Link
              href="/frameworks/map-attribution"
              className="mt-8 inline-flex items-center gap-2 t-small font-medium text-aj-blue-bright hover:text-fg-0"
            >
              Read M.A.P framework <span aria-hidden>→</span>
            </Link>
          </article>

          {/* N.I.C.H.E card with step flow */}
          <article className="rounded-[var(--r-card)] border border-[var(--line-2)] bg-bg-2 p-8 sm:p-10 transition-colors hover:border-[var(--line-blue)]">
            <Eyebrow tone="blue">N.I.C.H.E</Eyebrow>
            <h3 className="mt-3 t-h2">Niche · Intelligence · Causal · Human · Engine</h3>
            <p className="mt-4 t-body text-fg-2">
              A positioning + systems framework for identifying the highest-signal
              segment, mapping decision intelligence, and designing a repeatable
              growth engine.
            </p>
            <NICHEFlow className="mt-8 w-full" />
            <Link
              href="/frameworks/niche-framework"
              className="mt-8 inline-flex items-center gap-2 t-small font-medium text-aj-blue-bright hover:text-fg-0"
            >
              Read N.I.C.H.E framework <span aria-hidden>→</span>
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

function MAPTriangle({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="M.A.P pyramid: Meaningful, Actionable, Profitable"
      viewBox="0 0 320 200"
      className={className}
    >
      {/* Triangle */}
      <polygon
        points="160,20 300,180 20,180"
        fill="rgba(59,91,255,0.05)"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-aj-blue-bright"
      />
      {/* Tier dividers */}
      <line
        x1="80"
        y1="120"
        x2="240"
        y2="120"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
        className="text-aj-blue-bright"
      />
      <line
        x1="120"
        y1="60"
        x2="200"
        y2="60"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
        className="text-aj-blue-bright"
      />
      {/* Labels */}
      <text x="160" y="46" textAnchor="middle" fontSize="11" letterSpacing="0.18em" fontFamily="ui-monospace, monospace" fill="currentColor" className="text-aj-gold">
        PROFITABLE
      </text>
      <text x="160" y="100" textAnchor="middle" fontSize="11" letterSpacing="0.18em" fontFamily="ui-monospace, monospace" fill="currentColor" className="text-aj-gold">
        ACTIONABLE
      </text>
      <text x="160" y="160" textAnchor="middle" fontSize="11" letterSpacing="0.18em" fontFamily="ui-monospace, monospace" fill="currentColor" className="text-aj-gold">
        MEANINGFUL
      </text>
    </svg>
  );
}

function NICHEFlow({ className }: { className?: string }) {
  const steps = ["N", "I", "C", "H", "E"];
  return (
    <div className={`flex items-center justify-between gap-2 ${className ?? ""}`}>
      {steps.map((s, i) => (
        <div key={s} className="flex flex-1 items-center gap-2">
          <div className="flex h-12 flex-1 items-center justify-center rounded-[var(--r-md)] border border-[var(--line-blue)] bg-[rgba(59,91,255,0.08)] t-h4 text-aj-blue-bright">
            {s}
          </div>
          {i < steps.length - 1 && (
            <span aria-hidden className="t-mono text-fg-3">
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
