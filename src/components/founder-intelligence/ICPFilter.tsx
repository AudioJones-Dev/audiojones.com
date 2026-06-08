import SectionShell from "./SectionShell";

const GOOD = [
  "Founder-led company doing $250K–$5M",
  "Has revenue but unclear growth drivers",
  "Wants AI leverage without tool chaos",
  "Needs attribution, systems, and strategic clarity",
];

const BAD = [
  "No proven offer or revenue history",
  "Wants cheap automations only",
  "Refuses to instrument or measure",
  "Wants content without conversion architecture",
];

export default function ICPFilter() {
  return (
    <SectionShell
      variant="alt"
      eyebrow="Who this is for"
      title="A diagnostic, not a sales call."
      intro="This work compounds for a specific operator. If you don't see yourself in the left column, it won't help you — and the right column will tell you why."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[#22C55E]/30 bg-[#0B1020] p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#22C55E]">
            Strong fit
          </p>
          <ul className="space-y-3 text-slate-200">
            {GOOD.map((g) => (
              <li key={g} className="flex gap-3">
                <span aria-hidden className="mt-1 text-[#22C55E]">✓</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-[#EF4444]/30 bg-[#0B1020] p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#EF4444]">
            Not a fit
          </p>
          <ul className="space-y-3 text-slate-200">
            {BAD.map((b) => (
              <li key={b} className="flex gap-3">
                <span aria-hidden className="mt-1 text-[#EF4444]">✕</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
