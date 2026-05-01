import { Eyebrow } from "@/components/ui/Eyebrow";

const stats = [
  { metric: "CAC Reduction", direction: "↓", value: "37%", label: "Customer acquisition cost" },
  { metric: "Pipeline Growth", direction: "↑", value: "28%", label: "Qualified pipeline per quarter" },
  { metric: "Conversion Rate", direction: "↑", value: "42%", label: "Lead-to-call conversion rate" },
  { metric: "Decision Clarity", direction: "↑", value: "1 map", label: "One signal map, one model" },
];

/**
 * Section 6 — Proof / Results.
 * Before/after comparison. The "after" panel uses the opt-in light surface
 * to make the clarity narrative visible at a glance.
 */
export default function ProofStats() {
  return (
    <section
      id="proof"
      className="relative border-t border-[var(--line-2)] bg-bg-0 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* BEFORE — chaotic dark panel */}
          <article
            className="rounded-[var(--r-card)] border border-[var(--line-gold)] bg-bg-2 p-8 sm:p-10"
            aria-label="Before"
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

          {/* AFTER — opt-in light surface for clarity */}
          <article
            data-surface="light"
            className="rounded-[var(--r-card)] border border-[var(--border-light)] bg-paper p-8 sm:p-10 text-ink"
            aria-label="After"
          >
            <span className="t-label text-aj-blue-bright">After</span>
            <h3 className="mt-3 t-h3">Causal system, compounding outcomes</h3>
            <CleanChart className="mt-6 h-40 w-full" />
            <ul className="mt-6 space-y-2 t-small text-ink-muted">
              <li>· Clearer decision inputs, revenue-linked metrics</li>
              <li>· Attribution as identification — not correlation</li>
              <li>· Systemized execution, diagnostic-ready growth loop</li>
              <li>· Founder freed from operations, focused on signal</li>
            </ul>
          </article>
        </div>

        {/* Stat strip */}
        <dl className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.metric}
              className="rounded-[var(--r-card)] border border-[var(--line-2)] bg-bg-2 p-7"
            >
              <dt className="t-label text-aj-gold">
                {s.metric}
              </dt>
              <dd
                className="mt-3 font-bold text-fg-0"
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "clamp(32px,4vw,44px)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                {s.direction}&thinsp;{s.value}
              </dd>
              <p className="mt-2 t-small text-fg-2">{s.label}</p>
            </div>
          ))}
        </dl>

        {/* Disclaimer */}
        <p className="mt-6 t-small text-fg-3 text-center max-w-2xl mx-auto leading-relaxed">
          Representative system outcomes. Actual results depend on
          implementation, offer, market, and operational maturity.
        </p>
      </div>
    </section>
  );
}

function ChaoticChart({ className }: { className?: string }) {
  const path =
    "M0,40 L8,28 L16,36 L24,18 L32,40 L40,22 L48,46 L56,24 L64,38 L72,16 L80,42 L88,28 L96,34 L100,30";
  return (
    <svg viewBox="0 0 100 60" preserveAspectRatio="none" className={className} aria-hidden>
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        className="text-aj-orange"
        opacity="0.85"
      />
      {[12, 28, 18, 36, 24, 32, 16, 30, 14, 26].map((h, i) => (
        <rect
          key={i}
          x={i * 10 + 1}
          y={60 - h}
          width="3"
          height={h}
          fill="currentColor"
          opacity="0.3"
          className="text-fg-2"
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
          <stop offset="0%" stopColor="#3B5BFF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#3B5BFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0,52 C20,46 35,38 55,28 C72,20 85,14 100,8 L100,60 L0,60 Z" fill="url(#cleanFill)" />
      <path
        d="M0,52 C20,46 35,38 55,28 C72,20 85,14 100,8"
        fill="none"
        stroke="#3B5BFF"
        strokeWidth="1"
      />
      {[
        { x: 10, y: 49 },
        { x: 30, y: 41 },
        { x: 50, y: 31 },
        { x: 72, y: 20 },
        { x: 95, y: 10 },
      ].map((m, i) => (
        <circle key={i} cx={m.x} cy={m.y} r="1.6" fill="#3B5BFF" />
      ))}
    </svg>
  );
}
