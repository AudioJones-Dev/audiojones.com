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
        <div className="rounded-xl border border-accent-green/30 bg-surface-1 p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent-green">
            Strong fit
          </p>
          <ul className="space-y-3 text-text-primary">
            {GOOD.map((g) => (
              <li key={g} className="flex gap-3">
                <span aria-hidden className="mt-1 text-accent-green">✓</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-accent-red/30 bg-surface-1 p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent-red">
            Not a fit
          </p>
          <ul className="space-y-3 text-text-primary">
            {BAD.map((b) => (
              <li key={b} className="flex gap-3">
                <span aria-hidden className="mt-1 text-accent-red">✕</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
