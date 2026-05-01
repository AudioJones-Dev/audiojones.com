import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

const CARDS = [
  {
    letter: "M",
    name: "Meaningful",
    question: "Does this data point actually matter to the business?",
    desc: "Not all data is equal. Meaningful data has a causal relationship with business outcomes — revenue, retention, qualified pipeline. If a metric cannot be traced to an economic consequence, it is not meaningful.",
    borderColor: "rgba(200,169,106,0.45)",
    glowColor: "rgba(200,169,106,0.06)",
    accentColor: "#C8A96A",
  },
  {
    letter: "A",
    name: "Actionable",
    question: "Can we do something with this insight immediately?",
    desc: "Actionable intelligence changes behavior — it shifts budget, modifies messaging, restructures a channel, or adjusts a process. Data that generates a report but no decision is not actionable.",
    borderColor: "rgba(59,91,255,0.45)",
    glowColor: "rgba(59,91,255,0.06)",
    accentColor: "#3B5BFF",
    active: true,
  },
  {
    letter: "P",
    name: "Profitable",
    question: "Does this create or improve ROI?",
    desc: "Profitable inputs drive economic output. If a metric is not tied to a revenue-generating or cost-reducing lever, it should not be a decision driver — regardless of how frequently it appears in your dashboard.",
    borderColor: "rgba(255,69,0,0.35)",
    glowColor: "rgba(255,69,0,0.05)",
    accentColor: "#FF4500",
  },
];

export default function MAPAttributionSection() {
  return (
    <section
      id="map-attribution"
      className="relative border-t border-[var(--line-2)] bg-bg-1 py-24 sm:py-32"
    >
      {/* Subtle blue field centered on active card */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 60%, rgba(59,91,255,0.08), transparent 65%)",
        }}
      />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <Eyebrow>M.A.P Attribution</Eyebrow>
          <h2 className="mt-4 t-h1 text-balance">
            Attribution is not tracking everything.{" "}
            <span className="text-aj-blue-bright">
              It is identifying what caused the outcome.
            </span>
          </h2>
          <p className="mt-5 t-lead text-fg-2">
            Most businesses do not have a marketing problem. They have a
            misattribution problem.
          </p>
        </div>

        {/* Three connected cards */}
        <div className="relative grid grid-cols-1 gap-px lg:grid-cols-3">
          {/* Connecting line on desktop */}
          <div
            aria-hidden
            className="absolute hidden lg:block top-[52px] left-[33%] right-[33%] h-px"
            style={{
              background:
                "linear-gradient(to right, rgba(200,169,106,0.4), rgba(59,91,255,0.6), rgba(255,69,0,0.4))",
            }}
          />

          {CARDS.map((card, i) => (
            <article
              key={card.letter}
              className="relative rounded-[var(--r-card)] p-8 sm:p-10 flex flex-col"
              style={{
                background: card.glowColor,
                border: `1px solid ${card.borderColor}`,
                marginLeft: i === 0 ? 0 : "-1px",
                borderRadius:
                  i === 0
                    ? "var(--r-card) 0 0 var(--r-card)"
                    : i === CARDS.length - 1
                    ? "0 var(--r-card) var(--r-card) 0"
                    : "0",
                zIndex: card.active ? 2 : 1,
              }}
            >
              {card.active && (
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-[0] pointer-events-none"
                  style={{
                    boxShadow: "0 0 48px -8px rgba(59,91,255,0.35)",
                  }}
                />
              )}

              {/* Letter badge */}
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl mb-6"
                style={{
                  background: `${card.accentColor}18`,
                  border: `1.5px solid ${card.accentColor}50`,
                }}
              >
                <span
                  className="font-bold"
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "24px",
                    color: card.accentColor,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {card.letter}
                </span>
              </div>

              <span
                className="font-semibold uppercase tracking-widest mb-2"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  color: card.accentColor,
                }}
              >
                {card.name}
              </span>

              <h3
                className="font-medium text-fg-0 mt-1 mb-4"
                style={{
                  fontFamily: "var(--font-accent)",
                  fontSize: "17px",
                  lineHeight: 1.45,
                  fontWeight: 500,
                }}
              >
                {card.question}
              </h3>

              <p className="t-small text-fg-2 leading-[1.65] flex-1">{card.desc}</p>
            </article>
          ))}
        </div>

        {/* Thesis statement */}
        <div
          className="mt-14 rounded-[var(--r-lg)] border border-[var(--line-2)] bg-bg-2 px-8 py-7 text-center"
        >
          <p
            className="text-fg-1 max-w-3xl mx-auto"
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: 1.55,
              letterSpacing: "-0.01em",
            }}
          >
            If a metric is not meaningful, actionable, and profitable,{" "}
            <span className="text-aj-orange font-semibold">
              it should not drive strategy.
            </span>
          </p>
          <Link
            href="/frameworks/map-attribution"
            className="inline-flex items-center gap-2 mt-5 text-aj-blue-bright font-medium hover:text-fg-0 transition-colors"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
            }}
          >
            Read the full M.A.P framework <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
