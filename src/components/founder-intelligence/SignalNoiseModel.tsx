import SectionShell from "./SectionShell";

const COLUMNS = [
  {
    label: "Signal",
    color: "border-[#3B5BFF]/40 bg-[#0B1020]",
    eyebrow: "text-[#3B5BFF]",
    title: "Causal inputs tied to outcomes.",
    items: [
      "Lead source that produces revenue",
      "Pricing changes that move margin",
      "Process steps that compress cycle time",
    ],
  },
  {
    label: "Acceptable noise",
    color: "border-[#C8A96A]/40 bg-[#101827]",
    eyebrow: "text-[#C8A96A]",
    title: "Unavoidable complexity that reveals what matters.",
    items: [
      "Variance you measure on purpose",
      "Friction that exposes weak workflows",
      "Edge cases that pressure-test the system",
    ],
  },
  {
    label: "Noise",
    color: "border-white/10 bg-[#0B1020]",
    eyebrow: "text-slate-400",
    title: "Activity that obscures judgment.",
    items: [
      "Vanity metrics, fragmented dashboards",
      "Tool clutter without owners",
      "Reports nobody decides from",
    ],
  },
];

export default function SignalNoiseModel() {
  return (
    <SectionShell
      id="signal-vs-noise"
      variant="alt"
      eyebrow="Signal vs Noise model"
      title="Identify which noise reveals signal."
      intro="The goal is not to eliminate all noise. The goal is to find the noise that exposes the causal inputs behind growth — and remove the rest."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {COLUMNS.map((c) => (
          <article
            key={c.label}
            className={`rounded-xl border ${c.color} p-6`}
          >
            <p className={`mb-2 text-xs font-semibold uppercase tracking-[0.18em] ${c.eyebrow}`}>
              {c.label}
            </p>
            <h3 className="mb-4 text-lg font-semibold text-white">{c.title}</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {c.items.map((i) => (
                <li key={i}>— {i}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
