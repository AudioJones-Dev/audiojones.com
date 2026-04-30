import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

const insights = [
  {
    q: "Why does AI fail in most small businesses?",
    a: "AI doesn't fail because the tools are bad. It fails because it's applied to a broken system. Automation amplifies dysfunction.",
    href: "/insights/why-ai-fails-most-companies",
  },
  {
    q: "What is signal vs noise in business?",
    a: "Signal is causal information that improves judgment. Noise is activity, vanity metrics, and complexity that obscures what matters.",
    href: "/insights/signal-vs-noise-business",
  },
  {
    q: "How do I identify my real growth bottleneck?",
    a: "Stop measuring activity. Map the system. The bottleneck is almost never where the symptoms surface — it's upstream.",
    href: "/insights/applied-intelligence-systems",
  },
  {
    q: "Why is last-click attribution lying to you?",
    a: "Last-click is a correlation model dressed up as causation. It rewards the channel that closes — not the channel that caused.",
    href: "/insights/marketing-attribution-causal-identification",
  },
  {
    q: "What is an Applied Intelligence System?",
    a: "A business operating system that integrates human judgment, data signals, AI tooling, and feedback into a closed causal loop.",
    href: "/insights/applied-intelligence-systems",
  },
  {
    q: "Why founders plateau at $1M revenue.",
    a: "It isn't the market. It's cognitive load. The founder runs out of working memory before the business runs out of demand.",
    href: "/insights/signal-vs-noise-business",
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
              The questions founders are actually asking.
            </h2>
            <p className="mt-5 t-lead text-fg-2">
              Direct answers, framework-backed. Built to be cited — by you, by
              your team, by the AI search engines indexing this page.
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
