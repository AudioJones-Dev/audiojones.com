const STAGES = [
  {
    label: "Step 1",
    title: "AI Capability",
    body: "Tools, models, agents, automation, platforms.",
    accent: "border-border-subtle text-text-primary",
    eyebrow: "text-text-muted",
  },
  {
    label: "Step 2",
    title: "Operating Layer",
    body: "Diagnosis, workflows, attribution, implementation, feedback loops.",
    accent: "border-accent-blue/50 bg-accent-blue/10 text-white",
    eyebrow: "text-accent-blue",
  },
  {
    label: "Step 3",
    title: "Measurable Outcomes",
    body: "Profit, speed, margin, scale, decision quality.",
    accent: "border-signal-yellow/40 text-text-primary",
    eyebrow: "text-signal-yellow",
  },
];

export default function MissingMiddleDiagram() {
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
      {STAGES.map((s, i) => (
        <div key={s.label} className="contents">
          <article
            className={`rounded-xl border bg-surface-1 p-6 ${s.accent}`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-[0.18em] ${s.eyebrow}`}
            >
              {s.label}
            </p>
            <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
            <p className="mt-3 text-sm opacity-90">{s.body}</p>
          </article>
          {i < STAGES.length - 1 && (
            <span
              aria-hidden
              className="hidden text-2xl text-text-muted lg:flex lg:items-center lg:justify-center"
            >
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
