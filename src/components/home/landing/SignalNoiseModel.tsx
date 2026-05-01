import { Eyebrow } from "@/components/ui/Eyebrow";

const COLUMNS = [
  {
    id: "noise",
    label: "Noise",
    tone: "gold" as const,
    borderStyle: "border-[var(--line-gold)]",
    bgStyle: "bg-bg-2",
    items: [
      "Vanity metrics that feel good but predict nothing",
      "Tool sprawl without system integration",
      "Activity volume as a proxy for progress",
      "Last-click attribution dressed as truth",
      "Dashboards optimized for presentations",
    ],
  },
  {
    id: "acceptable",
    label: "Acceptable Noise",
    tone: "muted" as const,
    borderStyle: "border-[var(--line-2)]",
    bgStyle: "bg-bg-2",
    items: [
      "Brand awareness campaigns without short-term conversion signal",
      "Content with long attribution windows",
      "Exploratory testing without clear hypothesis",
      "Organic reach as a supplementary channel",
    ],
  },
  {
    id: "signal",
    label: "Signal",
    tone: "blue" as const,
    borderStyle: "border-[var(--line-blue)]",
    bgStyle: "bg-[rgba(59,91,255,0.04)]",
    items: [
      "Causal inputs that predict qualified pipeline",
      "Behavioral patterns that precede conversion",
      "Constraint data that explains stalled growth",
      "Attribution tied to revenue-generating actions",
      "Decision data with repeatable predictive power",
    ],
  },
];

export default function SignalNoiseModel() {
  return (
    <section
      id="signal-noise"
      className="relative border-t border-[var(--line-2)] bg-bg-0 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-14 max-w-3xl">
          <Eyebrow>Signal vs Noise Model</Eyebrow>
          <h2 className="mt-4 t-h1 text-balance">
            Identify which noise reveals signal.
          </h2>
          <p className="mt-5 t-lead text-fg-2">
            Most businesses do not need more data. They need a system for
            separating signal from noise.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {COLUMNS.map((col) => (
            <article
              key={col.id}
              className={`relative rounded-[var(--r-card)] border ${col.borderStyle} ${col.bgStyle} p-7 sm:p-8 flex flex-col`}
            >
              <Eyebrow tone={col.tone}>{col.label}</Eyebrow>
              <ul className="mt-6 flex flex-col gap-4 flex-1">
                {col.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 t-body text-fg-1"
                  >
                    <span
                      aria-hidden
                      className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        background:
                          col.id === "signal"
                            ? "var(--aj-blue-bright)"
                            : col.id === "noise"
                            ? "var(--aj-gold)"
                            : "var(--fg-3)",
                      }}
                    />
                    <span className="t-small text-fg-1 leading-[1.55]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Footer insight line */}
        <p
          className="mt-10 text-center text-fg-2 max-w-2xl mx-auto"
          style={{
            fontFamily: "var(--font-accent)",
            fontSize: "17px",
            fontWeight: 500,
            lineHeight: 1.5,
            letterSpacing: "-0.01em",
          }}
        >
          The 20% noise often reveals the 80% signal —{" "}
          <span className="text-aj-orange">
            if you know how to read the system.
          </span>
        </p>
      </div>
    </section>
  );
}
