import type { Metadata } from "next";
import Link from "next/link";
import FAQ from "@/components/founder-intelligence/FAQ";
import JsonLd from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ctaLinks } from "@/config/links";
import { buildMetadata } from "@/lib/seo/metadata";
import { founderIntelligenceFaqs } from "@/lib/seo/founder-intelligence-faq";
import { faqJsonLd } from "@/lib/seo/schema";

const TITLE = "Founder Intelligence Services";
const DESCRIPTION =
  "Strategic operator engagements that diagnose business systems first, then install AI workflows and measurement loops where they create leverage.";

const serviceBuckets = [
  {
    category: "Diagnostic",
    title: "AI Business Systems Diagnostic",
    description:
      "A focused review of the operating system your business already runs on: intake, follow-up, fulfillment, content, reporting, and decision cadence. We identify the bottlenecks, quantify the upside, and define where AI belongs before anything is built.",
    meta: "2 weeks · founder + ops lead · readiness map",
  },
  {
    category: "Buildout",
    title: "Founder Intelligence Systems Buildout",
    description:
      "The core engagement for installing the workflows your team should have had from day one. We turn the diagnostic into connected intake, automation, agent, and reporting layers that reduce manual drag without burying the operator in another tool stack.",
    meta: "60–90 days · system sprints · measured rollout",
  },
  {
    category: "Workflow",
    title: "AI Agent Workflow Design",
    description:
      "Modular tactical work for teams that already know the workflow they need to upgrade. We design the agent responsibilities, handoff points, prompts, guardrails, and escalation paths so automation supports the human operator instead of replacing judgment.",
    meta: "1–2 sprints · SOPs + agents · adoption support",
  },
  {
    category: "Measurement",
    title: "Attribution + Signal Audit",
    description:
      "A measurement-layer audit for founders who cannot see which campaigns, conversations, or systems are producing real pipeline. We clean up the signal path from source to close so future automation has a trustworthy scoreboard.",
    meta: "2–4 weeks · attribution map · signal scorecard",
  },
] as const;

const processSteps = [
  {
    title: "Map the operating system",
    description:
      "We document how work actually moves through the business: where requests enter, who touches them, which tools carry state, and where decisions stall.",
  },
  {
    title: "Prioritize leverage",
    description:
      "We separate high-signal constraints from noisy tool problems, then choose the workflows where founder intelligence can measurably improve speed, clarity, or conversion.",
  },
  {
    title: "Build the system layer",
    description:
      "We install the automation, agent, and reporting layer around your existing stack so the team gets a working operating rhythm, not another disconnected dashboard.",
  },
  {
    title: "Measure and harden",
    description:
      "We instrument adoption, cycle time, and business signal, then tighten the workflows until the system becomes durable enough to run without constant founder intervention.",
  },
] as const;

const signalMetrics = [
  {
    value: "60–90",
    label:
      "days is the typical window for a focused systems buildout once the diagnostic is complete.",
  },
  {
    value: "4",
    label:
      "engagement paths cover diagnostic, buildout, workflow design, and attribution clarity.",
  },
  {
    value: "1",
    label:
      "operating system view keeps tools, agents, data, and human handoffs aligned.",
  },
] as const;

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-bg-0 text-fg-0">
      <JsonLd data={faqJsonLd(founderIntelligenceFaqs)} />
      <section className="border-b border-[var(--line-2)] py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="max-w-[var(--copy-max)]">
            <Eyebrow>Audio Jones Services</Eyebrow>
            <h1 className="mt-5 t-h1 text-balance text-fg-0">{TITLE}</h1>
            <p className="mt-6 t-lead text-fg-2">
              We don&apos;t sell tools. We build the systems your tools should
              have been part of from day one.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={ctaLinks.roiCalculator} variant="glow">
                Calculate Your AI ROI
              </ButtonLink>
              <ButtonLink href="/apply" variant="secondary">
                Apply for Engagement
              </ButtonLink>
            </div>
            <p className="mt-6 t-small text-fg-3">
              We engage selectively. Most buildouts ship in 60 to 90 days.
              Diagnostic first, automation second, measurement always.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="max-w-[var(--copy-max)]">
            <Eyebrow>The Method</Eyebrow>
            <h2 className="mt-4 t-h2 text-balance text-fg-0">
              We diagnose your operating system, then install what is missing.
            </h2>
            <div className="mt-6 space-y-5">
              <p className="t-body-lg text-fg-1">
                Founder-led businesses rarely need more isolated software. They
                need the connective tissue between the tools they already use,
                the workflows their team repeats, and the decisions that move
                revenue.
              </p>
              <p className="t-body-lg text-fg-1">
                We treat AI as a{" "}
                <span className="text-aj-orange">
                  force multiplier on a working system
                </span>
                , not a substitute for one. Every engagement starts by finding
                the constraint, then builds only the automation and measurement
                layer required to remove it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg-1 py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="max-w-3xl">
            <Eyebrow>Engagements</Eyebrow>
            <h2 className="mt-4 t-h2 text-balance text-fg-0">
              How we work with founder-led businesses.
            </h2>
            <p className="mt-5 t-body-lg text-fg-2">
              Four static engagement paths replace the old catalog model. Each
              path is scoped around operational leverage, not product browsing
              or off-the-shelf packages.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {serviceBuckets.map((bucket) => (
              <article
                key={bucket.title}
                className="flex h-full flex-col rounded-2xl border border-[var(--line-2)] bg-bg-2 p-6 sm:p-8"
              >
                <Eyebrow tone="blue">{bucket.category}</Eyebrow>
                <h3 className="mt-4 t-h3 text-fg-0">{bucket.title}</h3>
                <p className="mt-4 t-body text-fg-2">{bucket.description}</p>
                <p className="mt-6 border-t border-[var(--line-1)] pt-4 t-small text-fg-3">
                  {bucket.meta}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <Eyebrow>Process</Eyebrow>
              <h2 className="mt-4 t-h2 text-balance text-fg-0">
                Diagnostic first. Automation second. Measurement always.
              </h2>
              <p className="mt-5 t-body-lg text-fg-2">
                The list is the diagram: understand the system, pick the
                leverage point, install the layer, then prove the work changed
                the operating rhythm.
              </p>
              <Link
                href="/founder-intelligence"
                className="mt-6 inline-flex t-body text-aj-orange hover:text-aj-orange-soft"
              >
                Read the full Founder Intelligence framework →
              </Link>
            </div>

            <ol className="space-y-4">
              {processSteps.map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-2xl border border-[var(--line-2)] bg-bg-2 p-6"
                >
                  <div className="flex gap-4">
                    <span className="t-h4 text-aj-gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="t-h4 text-fg-0">{step.title}</h3>
                      <p className="mt-2 t-body text-fg-2">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-bg-1 py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="max-w-3xl">
            <Eyebrow>Signal</Eyebrow>
            <h2 className="mt-4 t-h2 text-balance text-fg-0">
              What working with us looks like in practice.
            </h2>
            <p className="mt-5 t-body-lg text-fg-2">
              The work is intentionally narrow: fewer catalog choices, clearer
              operating leverage, and a measurement loop that tells the founder
              whether the system is paying back.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {signalMetrics.map((metric) => (
              <div
                key={metric.value}
                className="rounded-2xl border border-[var(--line-2)] bg-bg-2 p-6"
              >
                <p className="t-h2 text-aj-gold">{metric.value}</p>
                <p className="mt-3 t-small text-fg-2">{metric.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 t-body text-fg-1 sm:flex-row sm:flex-wrap">
            <Link
              href="/insights"
              className="text-aj-orange hover:text-aj-orange-soft"
            >
              Read Founder Intelligence insights →
            </Link>
            <Link
              href="/case-studies"
              className="text-aj-orange hover:text-aj-orange-soft"
            >
              Review operator case studies →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line-2)] bg-bg-1 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Eyebrow>Direct Answer</Eyebrow>
          <h2 className="mt-4 t-h2 text-balance text-fg-0">
            AJ Digital builds Founder Intelligence Systems for founder-led
            service businesses with follow-up, CRM, attribution, and reporting
            gaps.
          </h2>
          <p className="mt-5 t-body-lg text-fg-2">
            The service path starts with diagnosis, then installs the smallest
            system layer needed to recover signal, reduce manual drag, and make
            revenue movement visible.
          </p>
          <div className="mt-8">
            <FAQ items={founderIntelligenceFaqs} />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 text-center sm:px-8">
          <Eyebrow>Ready to engage</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-3xl t-h2 text-balance text-fg-0">
            Start with a diagnostic. Most engagements begin there.
          </h2>
          <p className="mx-auto mt-5 max-w-[var(--copy-max)] t-body-lg text-fg-2">
            If your tools are creating work instead of reducing it, the
            diagnostic gives us the operating-system map before we recommend a
            buildout.
          </p>
          <div className="mt-10 flex justify-center">
            <ButtonLink href={ctaLinks.signalDiagnostic} variant="glow">
              Take Signal Diagnostic
            </ButtonLink>
          </div>
          <Link
            href="/apply"
            className="mt-6 inline-flex t-body text-aj-orange hover:text-aj-orange-soft"
          >
            Or apply for an engagement directly →
          </Link>
        </div>
      </section>
    </main>
  );
}
