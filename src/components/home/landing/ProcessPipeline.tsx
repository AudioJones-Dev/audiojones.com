import { Eyebrow } from "@/components/ui/Eyebrow";

const steps = [
  {
    n: "01",
    label: "Diagnose",
    desc: "Map the existing system. Surface noise, gaps, and false signals.",
    active: false,
  },
  {
    n: "02",
    label: "Identify Constraint",
    desc: "Find the single highest-leverage bottleneck. Name it.",
    active: true,
  },
  {
    n: "03",
    label: "Design System",
    desc: "Architect the operating model — signal → process → output → feedback.",
    active: false,
  },
  {
    n: "04",
    label: "Deploy",
    desc: "Ship it. Instrument it. Compound the loop.",
    active: false,
  },
];

export default function ProcessPipeline() {
  return (
    <section
      id="process"
      className="relative border-t border-[var(--line-2)] bg-bg-0 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-14 max-w-3xl">
          <Eyebrow>Process</Eyebrow>
          <h2 className="mt-4 t-h1 text-balance">
            Four steps. No tool list.
          </h2>
          <p className="mt-5 t-lead text-fg-2">
            Diagnose. Identify the constraint. Design the system. Deploy. Repeat
            until the loop is causal.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li
              key={s.n}
              className={`relative rounded-[var(--r-card)] border bg-bg-2 p-7 ${
                s.active
                  ? "border-[var(--line-blue)] bg-[rgba(59,91,255,0.06)] shadow-[var(--shadow-glow-blue)]"
                  : "border-[var(--line-2)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="t-mono text-aj-gold">{s.n}</span>
                {s.active && (
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full bg-aj-blue-bright"
                  />
                )}
              </div>
              <h3 className="mt-4 t-h3">{s.label}</h3>
              <p className="mt-3 t-small text-fg-2">{s.desc}</p>

              {/* Connector arrow on desktop */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-3 top-1/2 hidden -translate-y-1/2 t-mono text-fg-3 lg:block"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
