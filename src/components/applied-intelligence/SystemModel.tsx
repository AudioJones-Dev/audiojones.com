import SectionShell from "./SectionShell";

const LAYERS = [
  { n: 1, label: "Business objective", note: "What outcome are we engineering for?" },
  { n: 2, label: "Signal collection", note: "What inputs do we capture and where?" },
  { n: 3, label: "Attribution layer", note: "Which inputs cause which outcomes?" },
  { n: 4, label: "Human judgment layer", note: "Where does taste, ethics, and context decide?" },
  { n: 5, label: "AI augmentation layer", note: "Where does AI compress time or expand reach?" },
  { n: 6, label: "Execution workflow", note: "Who owns what, with which tools, in what order?" },
  { n: 7, label: "Feedback loop", note: "What gets reviewed, retrained, and retired?" },
];

export default function SystemModel() {
  return (
    <SectionShell
      id="system-model"
      eyebrow="Applied Intelligence Systems"
      title="Seven layers that turn AI from a tool into leverage."
      intro="Applied Intelligence Systems are business operating systems that combine human judgment, data signals, AI tools, attribution, and feedback loops to improve decisions and execution."
    >
      <ol className="grid gap-3 sm:grid-cols-2">
        {LAYERS.map((l) => (
          <li
            key={l.n}
            className="flex gap-4 rounded-lg border border-border-subtle bg-surface-1 p-5"
          >
            <span
              aria-hidden
              className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-accent-blue/40 bg-accent-blue/10 text-sm font-semibold text-accent-blue"
            >
              {l.n}
            </span>
            <div>
              <p className="font-semibold text-white">{l.label}</p>
              <p className="mt-1 text-sm text-text-muted">{l.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
