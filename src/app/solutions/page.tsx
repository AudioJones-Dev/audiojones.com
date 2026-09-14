import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getRelatedPages } from "@/content/journeys";
import { advancedSolutions, solutionLadder, solutionStages } from "@/content/solutions";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

const TITLE = "Solutions";
const DESCRIPTION =
  "Business systems consulting for founder-led service businesses. Find lost time and sales, plan the first fix, and connect workflows, AI, and reporting.";

// Commercial identity (offer, name, destination) is projected from the offer and
// journey registries in `src/content/solutions.ts`; this file only lays it out.
// Related surfaces come from the registry's declared edges for this hub.
const RELATED_ARCHETYPES = new Set(["tool-landing", "tool-instrument", "proof"]);
const RELATED = getRelatedPages("solutions").filter((p) => RELATED_ARCHETYPES.has(p.archetype));

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-bg-0 text-fg-0">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Solutions", url: "/solutions" },
        ])}
      />

      {/* Hero */}
      <section className="border-b border-[var(--line-2)] py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="max-w-[var(--copy-max)]">
            <Eyebrow>What AJ Digital Builds</Eyebrow>
            <h1 className="mt-5 t-h1 text-balance text-fg-0">
              Fix the gaps that cost you time and sales.
            </h1>
            <p className="mt-6 t-lead text-fg-2">
              Missed leads, stuck jobs, and repeat work can have different causes.
              We help founder-led service businesses find the first issue to
              fix, agree on a plan, and build what the team needs.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/founder-intelligence/diagnostic" variant="glow">
                Request a Diagnostic
              </ButtonLink>
              <ButtonLink href="/book-a-call" variant="secondary">
                Book a Call
              </ButtonLink>
            </div>
          </div>

          {/* Ladder strip */}
          <ol className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 t-small text-fg-3">
            {solutionLadder.map((label, i) => (
              <li key={label} className="flex items-center gap-3">
                <span className="text-aj-gold">{label}</span>
                {i < solutionLadder.length - 1 ? (
                  <span aria-hidden className="text-fg-3">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Stages */}
      {solutionStages.map((stage, idx) => (
        <section
          key={stage.stage}
          className={
            idx % 2 === 1
              ? "bg-bg-1 py-16 sm:py-24"
              : "py-16 sm:py-24"
          }
        >
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <div className="flex items-baseline gap-4">
              <span className="t-h4 text-aj-gold">{stage.step}</span>
              <div className="max-w-3xl">
                <Eyebrow tone="blue">{stage.stage}</Eyebrow>
                <p className="mt-3 t-body-lg text-fg-2">{stage.intro}</p>
              </div>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stage.cards.map((offer) => (
                <article
                  key={offer.title}
                  data-offer-ids={offer.offerIds.join(" ") || undefined}
                  className="flex h-full flex-col rounded-2xl border border-[var(--line-2)] bg-bg-2 p-6 sm:p-8"
                >
                  <h2 className="t-h3 text-fg-0">{offer.title}</h2>
                  <p className="mt-4 flex-1 t-body text-fg-2">{offer.blurb}</p>
                  <Link
                    href={offer.href}
                    className="mt-6 inline-flex t-body text-aj-orange hover:text-aj-orange-soft"
                  >
                    {offer.cta} →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Advanced / validation program */}
      <section className="border-t border-[var(--line-2)] py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="max-w-3xl">
            <Eyebrow>Advanced · Validation Program</Eyebrow>
            <h2 className="mt-4 t-h2 text-balance text-fg-0">
              A connected system for founder-led service businesses.
            </h2>
            <p className="mt-5 t-body-lg text-fg-2">
              These projects are part of a validation program. Each has an agreed
              scope and checks for success. We connect the parts of your business
              that need to work together, then test the result with your team.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {advancedSolutions.map((offer) => (
              <article
                key={offer.title}
                data-offer-ids={offer.offerIds.join(" ") || undefined}
                className="flex h-full flex-col rounded-2xl border border-[var(--line-2)] bg-bg-2 p-6 sm:p-8"
              >
                <h3 className="t-h3 text-fg-0">{offer.title}</h3>
                <p className="mt-4 flex-1 t-body text-fg-2">{offer.blurb}</p>
                <Link
                  href={offer.href}
                  className="mt-6 inline-flex t-body text-aj-orange hover:text-aj-orange-soft"
                >
                  {offer.cta} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Related surfaces: declared registry edges, rendered with their own labels */}
      {RELATED.length > 0 ? (
        <section aria-labelledby="solutions-related" className="border-t border-[var(--line-2)] py-12 sm:py-16">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <h2 id="solutions-related" className="t-label">Related</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {RELATED.map((page) => (
                <li key={page.id}>
                  <Link
                    href={page.route}
                    className="block h-full rounded-2xl border border-[var(--line-2)] bg-bg-2 p-5 transition-colors hover:border-[var(--line-1)]"
                  >
                    <span className="block t-h4 text-fg-0">{page.navLabel}</span>
                    {page.navDescription ? (
                      <span className="mt-2 block t-small text-fg-2">{page.navDescription}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="bg-bg-1 py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 text-center sm:px-8">
          <Eyebrow>Start here</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-3xl t-h2 text-balance text-fg-0">
            Start with the issue that hurts most.
          </h2>
          <p className="mx-auto mt-5 max-w-[var(--copy-max)] t-body-lg text-fg-2">
            Tell us where work gets stuck. We will review your request and
            discuss the next step if there is a fit. Scope and price are agreed
            before paid work starts.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/founder-intelligence/diagnostic" variant="glow">
              Request a Diagnostic
            </ButtonLink>
            <ButtonLink href="/pricing" variant="secondary">
              View Pricing
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
