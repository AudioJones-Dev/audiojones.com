import type { Metadata } from "next";
import AiRoiDiagnostic from "@/components/ai-roi-diagnostic/AiRoiDiagnostic";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  type FaqItem,
} from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "AI ROI Diagnostic | Audio Jones",
  description:
    "Find out whether AI is worth investing in for your business. Calculate ROI potential, AI readiness, automation priority, and the best next step before you automate.",
  path: "/ai-roi-calculator",
});

const FAQS: FaqItem[] = [
  {
    question: "How do I calculate AI ROI for my business?",
    answer:
      "AI ROI is calculated by comparing the annual financial benefit of AI against the total cost of implementation, software, training, maintenance, and human review. The most useful AI ROI models include labor savings, error reduction, revenue lift, cycle-time improvement, and cost avoidance.",
  },
  {
    question: "Why do AI projects fail?",
    answer:
      "AI projects usually fail because the workflow, data, SOPs, adoption plan, or business objective is unclear. The issue is rarely the model alone. AI works best when attached to a measurable business bottleneck and a repeatable workflow.",
  },
  {
    question: "Should every business automate with AI?",
    answer:
      "No. Some businesses should automate immediately, while others need to fix workflows, data quality, documentation, or measurement before AI will create ROI. Automating a broken process often increases operational noise.",
  },
  {
    question: "What is an AI readiness score?",
    answer:
      "An AI readiness score measures whether a business has the operational conditions required for AI to work. It considers SOP maturity, data quality, process clarity, leadership buy-in, tool fragmentation, team adoption risk, and measurement discipline.",
  },
  {
    question: "What is the best first workflow to automate?",
    answer:
      "The best first workflow to automate is usually repetitive, high-volume, measurable, and tied to either revenue, labor cost, customer response time, or error reduction. Common examples include lead follow-up, customer intake, scheduling, content production, reporting, and support.",
  },
];

export default function AiRoiCalculatorPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "AI ROI Diagnostic", url: "/ai-roi-calculator" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQS)} />

      {/* Hero */}
      <section className="bg-bg-0 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <Eyebrow tone="gold">AI ROI Diagnostic</Eyebrow>
            <h1 className="mt-4 t-h1 text-balance text-fg-0">
              Find out if AI is actually worth it for your business.
            </h1>
            <p className="mt-5 t-lead text-fg-2">
              Estimate potential ROI, diagnose readiness, and identify whether
              to automate now, pilot first, or fix the system before investing.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#diagnostic" variant="glow" size="lg">
                Calculate AI ROI
              </ButtonLink>
              <ButtonLink
                href="/applied-intelligence/diagnostic"
                variant="secondary"
                size="lg"
              >
                Take the Signal Diagnostic
              </ButtonLink>
            </div>
            <p className="mt-5 t-small text-fg-3">
              Most AI projects fail because the workflow, data, SOPs, or
              measurement system were not ready. This diagnostic separates real
              AI opportunity from expensive automation theater.
            </p>
          </div>
        </div>
      </section>

      {/* Value strip */}
      <section className="bg-bg-1 border-y border-[var(--line-1)] py-12">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                eyebrow: "Signal vs. Noise",
                body: "AI accelerates whatever system already exists. We diagnose the system before recommending automation.",
              },
              {
                eyebrow: "ROI Before Hype",
                body: "We calculate labor savings, error reduction, payback period, and risk-adjusted impact — not vibes.",
              },
              {
                eyebrow: "Applied Intelligence",
                body: "Score your workflow on ROI, readiness, and priority. Get one of six clear recommended next steps.",
              },
            ].map((item) => (
              <div
                key={item.eyebrow}
                className="rounded-xl border border-[var(--line-2)] bg-bg-2 p-5"
              >
                <Eyebrow tone="gold">{item.eyebrow}</Eyebrow>
                <p className="mt-3 t-small text-fg-1">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diagnostic */}
      <section id="diagnostic" className="bg-bg-0 py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <AiRoiDiagnostic />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-bg-1 border-t border-[var(--line-1)] py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Eyebrow tone="gold">Frequently Asked</Eyebrow>
          <h2 className="mt-3 t-h2 text-fg-0">AI ROI questions, answered.</h2>
          <dl className="mt-8 space-y-6">
            {FAQS.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border border-[var(--line-2)] bg-bg-2 p-6"
              >
                <dt className="t-h4 text-fg-0">{faq.question}</dt>
                <dd className="mt-3 t-body text-fg-2">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
