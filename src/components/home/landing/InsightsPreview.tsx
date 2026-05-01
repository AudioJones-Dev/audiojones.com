import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

const insights = [
  {
    q: "Why do most AI projects fail in small businesses?",
    a: "Because the systems underneath them are undefined. Automation applied to a broken system accelerates dysfunction — it does not fix it.",
    href: "/insights/why-ai-fails-most-companies",
  },
  {
    q: "What is signal vs noise in business?",
    a: "Signal is the information that predicts outcomes. Noise is everything that creates false confidence without improving decisions.",
    href: "/insights/signal-vs-noise-business",
  },
  {
    q: "What is the M.A.P Attribution Framework?",
    a: "A decision model for identifying meaningful, actionable, and profitable inputs. If a metric fails any leg of M.A.P, it should not drive strategy.",
    href: "/frameworks/map-attribution",
  },
  {
    q: "How do you know which marketing channel works?",
    a: "You need attribution that identifies cause, not just correlation. Last-click rewards the closer — not the channel that created the decision.",
    href: "/insights/marketing-attribution-causal-identification",
  },
  {
    q: "What is Applied Intelligence?",
    a: "The integration of human judgment, data signals, and feedback loops into a repeatable operating system. Not a tool. A system.",
    href: "/insights/applied-intelligence-systems",
  },
  {
    q: "Why is AI not the first step?",
    a: "Because automation only scales what already exists. If the system is broken, AI scales the dysfunction. Signal clarity comes first.",
    href: "/insights/why-ai-fails-most-companies",
  },
];

export default function InsightsPreview() {
  return (
    <section
      id="insights"
      className="relative border-t border-[var(--line-2)] bg-bg-1 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <Eyebrow>Insights</Eyebrow>
            <h2 className="mt-4 t-h1 text-balance">
              Structured answers for founders building with AI.
            </h2>
            <p className="mt-5 t-lead text-fg-2">
              Each insight is designed to answer the questions founders ask
              when growth, AI, and systems stop making sense.
            </p>
          </div>
          <Link
            href="/insights"
            className="t-small font-medium text-aj-blue-bright hover:text-fg-0"
          >
            All insights <span aria-hidden>→</span>
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((it) => (
            <li key={it.q}>
              <Link
                href={it.href}
                className="block h-full rounded-[var(--r-card)] border border-[var(--line-2)] bg-bg-2 p-7 transition-colors hover:border-[var(--line-blue)]"
              >
                <h3 className="t-h4 text-balance">{it.q}</h3>
                <p className="mt-3 t-small text-fg-2">{it.a}</p>
                <div className="mt-5 inline-flex items-center gap-2 t-small font-medium text-aj-blue-bright">
                  Read <span aria-hidden>→</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
