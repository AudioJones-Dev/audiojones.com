const STAGES = [
  {
    label: "Step 1",
    title: "AI Capability",
    body: "Tools, models, agents, automation, platforms.",
    accent: "border-white/10 text-slate-300",
    eyebrow: "text-slate-400",
  },
  {
    label: "Step 2",
    title: "Operating Layer",
    body: "Diagnosis, workflows, attribution, implementation, feedback loops.",
    accent: "border-[#3B5BFF]/50 bg-[#3B5BFF]/10 text-white",
    eyebrow: "text-[#3B5BFF]",
  },
  {
    label: "Step 3",
    title: "Measurable Outcomes",
    body: "Profit, speed, margin, scale, decision quality.",
    accent: "border-[#C8A96A]/40 text-slate-200",
    eyebrow: "text-[#C8A96A]",
  },
];

export default function MissingMiddleDiagram() {
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
      {STAGES.map((s, i) => (
        <div key={s.label} className="contents">
          <article
            className={`rounded-xl border bg-[#0B1020] p-6 ${s.accent}`}
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
              className="hidden text-2xl text-slate-500 lg:flex lg:items-center lg:justify-center"
            >
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
