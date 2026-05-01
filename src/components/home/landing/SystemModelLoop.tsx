import { Eyebrow } from "@/components/ui/Eyebrow";

const layers = [
  {
    n: "01",
    label: "Input",
    desc: "Customer behavior, sales conversations, attribution data, founder intuition.",
  },
  {
    n: "02",
    label: "Process",
    desc: "Signal vs noise filtering, M.A.P attribution, system mapping.",
  },
  {
    n: "03",
    label: "Output",
    desc: "Decisions, workflows, AI augmentation, deployed campaigns.",
  },
  {
    n: "04",
    label: "Feedback",
    desc: "Outcome data flows back. The system updates its own predictive model.",
  },
];

export default function SystemModelLoop() {
  return (
    <section
      id="system-model"
      className="relative border-t border-[var(--line-2)] bg-bg-1 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-14 max-w-3xl">
          <Eyebrow>Applied Intelligence Systems</Eyebrow>
          <h2 className="mt-4 t-h1 text-balance">
            AI only works when the system is ready.
          </h2>
          <p className="mt-5 t-lead text-fg-2">
            Automation applied to broken systems accelerates dysfunction.
            Applied Intelligence Systems align human judgment, data signals,
            and feedback loops before automation scales the work.
          </p>
        </div>

        {/* Diagram */}
        <div className="relative rounded-[var(--r-panel)] border border-[var(--line-2)] bg-bg-2 p-8 sm:p-12">
          <LoopSVG className="mx-auto w-full max-w-3xl" />
          <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {layers.map((l) => (
              <div
                key={l.n}
                className="rounded-[var(--r-lg)] border border-[var(--line-2)] bg-bg-3 p-5"
              >
                <div className="t-mono text-aj-gold">{l.n}</div>
                <div className="mt-2 t-h4">{l.label}</div>
                <p className="mt-2 t-small text-fg-2">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LoopSVG({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="Applied Intelligence loop: input, process, output, feedback"
      viewBox="0 0 720 200"
      className={className}
    >
      {/* Connector spine */}
      <line
        x1="60"
        y1="100"
        x2="660"
        y2="100"
        stroke="currentColor"
        strokeWidth="1"
        className="text-aj-blue-bright"
        opacity="0.4"
      />
      {/* Feedback curve */}
      <path
        d="M660 100 Q700 100 700 60 Q700 30 360 30 Q60 30 60 80 L60 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 4"
        className="text-aj-blue-bright"
        opacity="0.5"
      />
      {/* Nodes */}
      {[
        { cx: 80, label: "Input" },
        { cx: 280, label: "Process" },
        { cx: 480, label: "Output" },
        { cx: 660, label: "Feedback" },
      ].map((n, i) => (
        <g key={n.label}>
          <circle
            cx={n.cx}
            cy="100"
            r="22"
            fill="rgba(11,16,32,0.95)"
            stroke="currentColor"
            strokeWidth="1.5"
            className={
              i === 1 ? "text-aj-blue-bright" : "text-aj-blue-bright opacity-50"
            }
          />
          {/* Pulse on Process */}
          {i === 1 && (
            <circle
              cx={n.cx}
              cy="100"
              r="4"
              fill="currentColor"
              className="text-aj-blue-bright"
            />
          )}
          <text
            x={n.cx}
            y="148"
            textAnchor="middle"
            fontSize="11"
            fontFamily="ui-monospace, monospace"
            letterSpacing="0.16em"
            fill="currentColor"
            className="text-aj-gold"
          >
            {n.label.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}
