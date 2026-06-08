import SectionShell from "./SectionShell";

const STEPS = [
  { n: "01", title: "Diagnose the constraint", body: "Find the binding bottleneck — the one that, if removed, unlocks the next stage of growth." },
  { n: "02", title: "Map signal vs noise", body: "Audit dashboards, reports, and inputs against the M.A.P filter." },
  { n: "03", title: "Identify causal inputs", body: "Move from correlation to causation in your attribution model." },
  { n: "04", title: "Design the system", body: "Architect the seven-layer Founder Intelligence System for your business." },
  { n: "05", title: "Deploy AI where it creates leverage", body: "Insert AI inside workflows where it compresses time or expands judgment — not as a layer on top." },
  { n: "06", title: "Measure, iterate, compound", body: "Close the feedback loop. Retire what doesn't work. Reinvest in what does." },
];

export default function ProcessSteps() {
  return (
    <SectionShell
      eyebrow="Process"
      title="Diagnose. Identify. Build. Compound."
    >
      <ol className="grid gap-4 sm:grid-cols-2">
        {STEPS.map((s) => (
          <li
            key={s.n}
            className="rounded-lg border border-white/10 bg-[#0B1020] p-6"
          >
            <p className="mb-2 text-xs font-mono text-[#C8A96A]">{s.n}</p>
            <h3 className="mb-2 text-lg font-semibold text-white">{s.title}</h3>
            <p className="text-sm text-slate-400">{s.body}</p>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
