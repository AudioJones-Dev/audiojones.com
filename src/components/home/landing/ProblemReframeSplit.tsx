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
            <ul className="mt-6 space-y-4">
              {noiseBullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 t-body text-fg-1"
                >
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-aj-orange opacity-70"
                  />
                  {b}
                </li>
              ))}
            </ul>
            <NoiseDashboardSketch className="mt-8" />
          </article>

          {/* SYSTEM side */}
          <article
            className="relative rounded-[var(--r-card)] border border-[var(--line-blue)] bg-[rgba(59,91,255,0.06)] p-8 sm:p-10"
            aria-label="System side"
          >
            <Eyebrow tone="blue">System</Eyebrow>
            <h3 className="mt-3 t-h3">Signal extracted — outcomes compound</h3>
            <ul className="mt-6 space-y-4">
              {systemBullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 t-body text-fg-1"
                >
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-aj-blue-bright"
                  />
                  {b}
                </li>
              ))}
            </ul>
            <SystemDashboardSketch className="mt-8" />
          </article>
        </div>
      </div>
    </section>
  );
}

function NoiseDashboardSketch({ className }: { className?: string }) {
  // Chaotic line + scattered bars — sketches a noisy dashboard
  const path =
    "M0,40 L10,30 L20,38 L30,12 L40,42 L50,22 L60,46 L70,18 L80,38 L90,8 L100,32";
  const bars = [22, 34, 12, 40, 28, 18, 36, 14, 32, 24, 38, 16];
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      className={`h-24 w-full ${className ?? ""}`}
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        className="text-aj-orange"
        opacity="0.8"
      />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 8 + 1}
          y={60 - h}
          width="3"
          height={h}
          fill="currentColor"
          opacity="0.35"
          className="text-fg-2"
        />
      ))}
    </svg>
  );
}

function SystemDashboardSketch({ className }: { className?: string }) {
  // Smooth upward curve with a thin trendline + small marker dots
  const curve =
    "M0,50 C20,46 30,42 50,32 C70,22 80,18 100,8";
  const markers = [
    { x: 12, y: 47 },
    { x: 32, y: 40 },
    { x: 54, y: 30 },
    { x: 76, y: 19 },
    { x: 96, y: 10 },
  ];
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      className={`h-24 w-full ${className ?? ""}`}
    >
      <path
        d={curve}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        className="text-aj-blue-bright"
      />
      {markers.map((m, i) => (
        <circle
          key={i}
          cx={m.x}
          cy={m.y}
          r="1.4"
          fill="currentColor"
          className="text-aj-blue-bright"
        />
      ))}
    </svg>
  );
}
