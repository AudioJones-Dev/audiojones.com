import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ctaLinks } from "@/config/links";

export const metadata: Metadata = {
  title: { absolute: "Applied Intelligence Services | Audio Jones" },
  description:
    "Strategic AI diagnostics, buildouts, workflow design, and signal audits for founder-led businesses.",
};

type WhopPrice = {
  id?: string;
  amount?: number; // cents
  currency?: string;
  interval?: string; // month, year, one_time
};

type WhopProduct = {
  id: string;
  name?: string;
  description?: string;
  url?: string; // checkout or landing URL if provided by API
  prices?: WhopPrice[];
};

type ServiceBucket = {
  category: string;
  title: string;
  description: string;
  metadata: string;
};

const serviceBuckets: ServiceBucket[] = [
  {
    category: "Diagnostic",
    title: "AI Business Systems Diagnostic",
    description:
      "A structured read on where AI can create leverage without adding noise. We map the operating system you already run, isolate the bottlenecks, and identify where automation will produce measurable signal.",
    metadata: "Entry point · signal map · systems brief",
  },
  {
    category: "Buildout",
    title: "Applied Intelligence Systems Buildout",
    description:
      "The core engagement for founders who need a working system, not another tool subscription. We install the workflows, automations, and measurement loops your team can actually operate after launch.",
    metadata: "Core engagement · shipped systems · operator handoff",
  },
  {
    category: "Workflow",
    title: "AI Agent Workflow Design",
    description:
      "Focused design for agentic workflows that remove drag from high-value work. We define the handoffs, constraints, prompts, and review loops so agents support operators instead of creating another inbox.",
    metadata: "Modular sprint · agent workflows · governance loop",
  },
  {
    category: "Measurement",
    title: "Attribution + Signal Audit",
    description:
      "A measurement layer for teams that know activity is happening but cannot prove what is working. We inspect attribution, intake, pipeline, and content signals so decisions are tied to evidence.",
    metadata: "Audit layer · attribution clarity · decision signal",
  },
];

const processSteps = [
  {
    label: "01",
    title: "Diagnose the system",
    copy: "We start with the business model, current workflows, data paths, and team constraints before recommending automation.",
  },
  {
    label: "02",
    title: "Install the missing leverage",
    copy: "Buildouts prioritize the smallest durable system that changes operator behavior and reduces repeated manual work.",
  },
  {
    label: "03",
    title: "Measure the signal",
    copy: "Every engagement defines what should improve, where the proof will show up, and how the loop stays usable after handoff.",
  },
];

async function getProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/whop/products`,
      {
        cache: "no-store",
        // Phase 3 owns ISR, product typing, and fallback hardening for Whop.
        next: { revalidate: 0 },
      },
    );
    if (!res.ok) return [] as WhopProduct[];
    const data = await res.json();
    return (data?.data || []) as WhopProduct[];
  } catch {
    return [] as WhopProduct[];
  }
}

function formatPrice(p?: WhopPrice) {
  if (!p || p.amount == null) return "";
  const amt = (p.amount / 100).toFixed(0);
  const cur = (p.currency || "usd").toUpperCase();
  const cycle =
    p.interval === "year" ? "/yr" : p.interval === "month" ? "/mo" : "";
  return `$${amt} ${cur}${cycle ? ` ${cycle}` : ""}`.trim();
}

export default async function ServicesPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-bg-0 text-fg-0">
      <section className="relative overflow-hidden border-b border-[var(--line-1)] bg-bg-0">
        <div className="mx-auto flex min-h-[78vh] max-w-[1280px] items-center px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-[var(--copy-max)]">
            <Eyebrow tone="gold">Audio Jones Services</Eyebrow>
            <h1 className="mt-5 t-h1 text-balance text-fg-0">
              Applied Intelligence Services
            </h1>
            <p className="mt-6 t-lead text-fg-2">
              We don&apos;t sell tools. We build the systems your tools should
              have been part of from day one — diagnosed first, automated
              second, measured continuously.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink
                href={ctaLinks.roiCalculator}
                variant="glow"
                size="lg"
              >
                Calculate Your AI ROI
              </ButtonLink>
              <ButtonLink href="/apply" variant="secondary" size="lg">
                Apply for Engagement
              </ButtonLink>
            </div>
            <p className="mt-6 t-small text-fg-3">
              We engage selectively. Most work starts with a diagnostic, then
              moves into a focused systems buildout.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line-1)] bg-bg-1 py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="max-w-[var(--copy-max)]">
            <Eyebrow tone="gold">The Method</Eyebrow>
            <h2 className="mt-4 t-h2 text-balance text-fg-0">
              We diagnose your operating system, then install what is missing.
            </h2>
            <div className="mt-6 space-y-5 t-body text-fg-1">
              <p>
                Applied intelligence only works when it is connected to the way
                the business already creates value. We look for the repeated
                decisions, handoffs, data gaps, and manual loops that keep
                founders close to work they should no longer own.
              </p>
              <p>
                The output is not an AI wishlist. It is an operator-ready path
                from bottleneck to system: what to automate, what to leave
                human, where to measure, and how the team should run it after
                the build.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line-1)] bg-bg-0 py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="mb-10 max-w-3xl">
            <Eyebrow tone="gold">Engagements</Eyebrow>
            <h2 className="mt-4 t-h2 text-balance text-fg-0">
              How we work with founder-led businesses.
            </h2>
            <p className="mt-5 t-lead text-fg-2">
              Four strategic entry points, each designed around operational
              clarity before implementation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {serviceBuckets.map((bucket) => (
              <article
                key={bucket.title}
                className="flex min-h-full flex-col rounded-[var(--r-card)] border border-[var(--line-2)] bg-bg-2 p-6 transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)] hover:border-[var(--line-3)] sm:p-8"
              >
                <Eyebrow tone="blue">{bucket.category}</Eyebrow>
                <h3 className="mt-4 t-h3 text-fg-0">{bucket.title}</h3>
                <p className="mt-4 t-body text-fg-2">{bucket.description}</p>
                <div className="mt-8 border-t border-[var(--line-1)] pt-4">
                  <p className="t-label text-aj-gold">{bucket.metadata}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line-1)] bg-bg-1 py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div>
            <Eyebrow tone="gold">How We Work</Eyebrow>
            <h2 className="mt-4 t-h2 text-balance text-fg-0">
              Diagnostic first. Automation second. Measurement always.
            </h2>
            <p className="mt-5 t-body text-fg-2">
              Our methodology is grounded in the Applied Intelligence framework:
              signal before scale, system before software, durable loops before
              one-off implementation.
            </p>
            <ButtonLink
              href="/applied-intelligence"
              variant="secondary"
              size="lg"
              className="mt-8"
            >
              Explore the Methodology
            </ButtonLink>
          </div>

          <div className="grid gap-4">
            {processSteps.map((step) => (
              <article
                key={step.label}
                className="rounded-[var(--r-card)] border border-[var(--line-2)] bg-bg-2 p-6"
              >
                <p className="t-label text-aj-blue-bright">{step.label}</p>
                <h3 className="mt-3 t-h3 text-fg-0">{step.title}</h3>
                <p className="mt-3 t-body text-fg-2">{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line-1)] bg-bg-0 py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="mb-10 max-w-3xl">
            <Eyebrow tone="gold">Optional Catalog</Eyebrow>
            <h2 className="mt-4 t-h2 text-balance text-fg-0">
              Whop offers remain supplementary.
            </h2>
            <p className="mt-5 t-body text-fg-2">
              This product list is intentionally preserved, not optimized, in
              Phase 1. Phase 3 owns ISR, stronger typing, and fallback behavior
              for the Whop integration.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="rounded-[var(--r-card)] border border-[var(--line-2)] bg-bg-2 p-6 sm:p-8">
              <p className="t-body text-fg-2">
                Whop offers will appear here once products are available.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((prod) => {
                const primary = prod.prices?.[0];
                const price = formatPrice(primary);
                return (
                  <article
                    key={prod.id}
                    className="flex min-h-full flex-col rounded-[var(--r-card)] border border-[var(--line-2)] bg-bg-2 p-6"
                  >
                    <h3 className="t-h3 text-fg-0">
                      {prod.name || "Untitled Offer"}
                    </h3>
                    {price && <p className="mt-4 t-h3 text-aj-gold">{price}</p>}
                    <p className="mt-4 line-clamp-4 t-small text-fg-2">
                      {prod.description ||
                        "Includes strategy, production, and automation systems tailored to your goals."}
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <ButtonLink
                        href={prod.url || ctaLinks.bookSession}
                        external={Boolean(prod.url)}
                        variant="secondary"
                      >
                        {prod.url ? "View Offer" : "Book a Call"}
                      </ButtonLink>
                      <ButtonLink href="/apply" variant="ghost">
                        Consult First
                      </ButtonLink>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-bg-0 py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 text-center sm:px-8">
          <Eyebrow tone="gold">Next Step</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-3xl t-h2 text-balance text-fg-0">
            Start with the diagnostic. Build only after the signal is clear.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl t-body text-fg-2">
            If you have read this far, the next move is a sharper view of where
            AI can pay back in your actual operating system.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink
              href={ctaLinks.signalDiagnostic}
              variant="glow"
              size="lg"
            >
              Take Signal Diagnostic
            </ButtonLink>
            <ButtonLink href="/apply" variant="secondary" size="lg">
              Apply for Engagement
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
