import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

// ─── Card data ────────────────────────────────────────────────────────────────

const CARDS = [
  {
    letter: "M",
    name: "Meaningful",
    question: "Does this data point actually matter to the business?",
    desc: "Not all data is equal. Meaningful data has a causal relationship with business outcomes — revenue, retention, qualified pipeline. If a metric cannot be traced to an economic consequence, it is not meaningful.",
    accent: "#C8A96A",
    border: "rgba(200,169,106,0.35)",
    bg: "linear-gradient(180deg, rgba(200,169,106,0.07), rgba(11,15,26,0.96))",
    glow: "0 0 24px rgba(200,169,106,0.12), inset 0 1px 0 rgba(255,255,255,0.04)",
    badgeBg: "rgba(200,169,106,0.10)",
    badgeBorder: "rgba(200,169,106,0.35)",
    badgeGlow: "0 0 16px rgba(200,169,106,0.20)",
  },
  {
    letter: "A",
    name: "Actionable",
    question: "Can we do something with this insight immediately?",
    desc: "Actionable intelligence changes behavior — it shifts budget, modifies messaging, restructures a channel, or adjusts a process. Data that generates a report but no decision is not actionable.",
    accent: "#3B5BFF",
    border: "rgba(59,91,255,0.38)",
    bg: "linear-gradient(180deg, rgba(59,91,255,0.08), rgba(11,15,26,0.96))",
    glow: "0 0 24px rgba(59,91,255,0.16), inset 0 1px 0 rgba(255,255,255,0.04)",
    badgeBg: "rgba(59,91,255,0.12)",
    badgeBorder: "rgba(59,91,255,0.40)",
    badgeGlow: "0 0 16px rgba(59,91,255,0.24)",
  },
  {
    letter: "P",
    name: "Profitable",
    question: "Does this create or improve ROI?",
    desc: "Profitable inputs drive economic output. If a metric is not tied to a revenue-generating or cost-reducing lever, it should not be a decision driver — regardless of how frequently it appears in your dashboard.",
    accent: "#FF4500",
    border: "rgba(255,69,0,0.35)",
    bg: "linear-gradient(180deg, rgba(255,69,0,0.08), rgba(11,15,26,0.96))",
    glow: "0 0 24px rgba(255,69,0,0.12), inset 0 1px 0 rgba(255,255,255,0.04)",
    badgeBg: "rgba(255,69,0,0.10)",
    badgeBorder: "rgba(255,69,0,0.38)",
    badgeGlow: "0 0 16px rgba(255,69,0,0.20)",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function MAPAttributionSection() {
  return (
    <section
      id="map-attribution"
      className="relative border-t border-[var(--line-2)] bg-bg-1 py-24 sm:py-32"
      style={{ overflow: "hidden" }}
    >
      {/* Subtle blue field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 60%, rgba(59,91,255,0.07), transparent 65%)",
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

        {/* ── Infographic — desktop/tablet only ── */}
        <div className="mb-14 hidden sm:block">
          <div
            className="relative mx-auto w-full overflow-hidden rounded-[24px]"
            style={{
              maxWidth: "1080px",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 0 48px -16px rgba(255,69,0,0.12), 0 0 48px -16px rgba(59,91,255,0.14), 0 8px 40px rgba(0,0,0,0.35)",
            }}
          >
            <Image
              src="/assets/Homepage/06-map-attribution-framework/references/map-attribution-infographic-reference.png"
              alt="M.A.P Attribution framework visual showing metric qualification through meaningful, actionable, and profitable filters"
              width={1672}
              height={941}
              className="h-auto w-full"
              style={{ opacity: 0.95 }}
            />
          </div>
        </div>

        {/* ── Three independent cards — badge-first layout, no line collision ── */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">
          {CARDS.map((card) => (
            <article
              key={card.letter}
              className="relative overflow-hidden rounded-2xl p-6"
              style={{
                background: card.bg,
                border: `1px solid ${card.border}`,
                boxShadow: card.glow,
              }}
            >
              {/* ── Header zone: badge + label ── */}
              <div className="mb-5 flex items-center gap-3">
                {/* Circular letter badge — sits fully inside card, no border collision */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: card.badgeBg,
                    border: `1.5px solid ${card.badgeBorder}`,
                    boxShadow: card.badgeGlow,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-headline)",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: card.accent,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {card.letter}
                  </span>
                </div>

                {/* Label */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: card.accent,
                  }}
                >
                  {card.name}
                </p>
              </div>

              {/* Question / title */}
              <h3
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "15px",
                  fontWeight: 700,
                  lineHeight: 1.4,
                  color: "#E5E7EB",
                }}
              >
                {card.question}
              </h3>

              {/* Description */}
              <p
                className="mt-3"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  lineHeight: 1.65,
                  color: "#94A3B8",
                }}
              >
                {card.desc}
              </p>
            </article>
          ))}
        </div>

        {/* ── Thesis principle strip ── */}
        <div
          className="mt-14 rounded-[var(--r-lg)] border border-[var(--line-2)] bg-bg-2 px-8 py-7 text-center"
        >
          <p
            className="mx-auto max-w-3xl text-fg-1"
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: 1.55,
              letterSpacing: "-0.01em",
            }}
          >
            If a metric is not meaningful, actionable, and profitable,{" "}
            <span className="font-semibold text-aj-orange">
              it should not drive strategy.
            </span>
          </p>
          <Link
            href="/frameworks/map-attribution"
            className="mt-5 inline-flex items-center gap-2 font-medium text-aj-blue-bright transition-colors hover:text-fg-0"
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
