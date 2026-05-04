import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import NewsletterForm from "@/components/newsletter/NewsletterForm";

/**
 * Section 8 — Diagnostic CTA.
 * High-conversion. Inline form preview is non-functional and routes
 * the user to the canonical 6-step diagnostic at
 * /applied-intelligence/diagnostic. We do not collect data here —
 * the field is visual scaffolding only. (Mock-only per Wave 1 rules;
 * real intake stays at the Applied Intelligence diagnostic route.)
 */
export default function DiagnosticCTA() {
  return (
    <section
      id="diagnostic"
      className="relative border-t border-[var(--line-2)] bg-bg-0 py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-aj-blue-bright/40 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_30%,rgba(59,91,255,0.18),transparent_50%)]"
      />

      <div className="mx-auto max-w-[960px] px-5 sm:px-8 text-center">
        <Eyebrow>Apply</Eyebrow>
        <h2
          className="mt-4 text-fg-0 text-balance"
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(40px,6vw,64px)",
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: "-0.035em",
          }}
        >
          Stop guessing what works.
        </h2>
        <p
          className="mt-4 text-fg-2 max-w-[56ch] mx-auto"
          style={{
            fontFamily: "var(--font-accent)",
            fontSize: "20px",
            fontWeight: 500,
            lineHeight: 1.5,
            letterSpacing: "-0.01em",
          }}
        >
          Identify what is actually driving your business.
        </p>
        <p className="mt-4 t-body text-fg-2 max-w-2xl mx-auto">
          The diagnostic shows whether your business has a signal problem, a
          systems problem, an attribution problem, or an AI readiness problem.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <ButtonLink
            href="/applied-intelligence/diagnostic"
            variant="glow"
          >
            Book Your Diagnostic
          </ButtonLink>
          <ButtonLink href="/frameworks" variant="system-glow">
            See Frameworks
          </ButtonLink>
        </div>
        <p className="mt-6 t-small text-fg-3">
          Free fit review. No commitment. Reviewed personally by Audio Jones.
        </p>

        {/* ── Quiet divider ── */}
        <div
          aria-hidden
          className="mx-auto mt-16 h-px w-32 bg-gradient-to-r from-transparent via-[var(--line-2)] to-transparent"
        />

        {/* ── Newsletter — secondary, lower-prominence path ──
            Suspense required because <NewsletterForm> uses
            useSearchParams() (App Router constraint, see W1.6/W2 lessons). */}
        <div className="mx-auto mt-10 max-w-[480px] text-left">
          <Eyebrow tone="muted">Insights</Eyebrow>
          <p className="mt-3 t-small text-fg-2">
            Or subscribe to the next signal — short, framework-driven, no nurture drip.
          </p>
          <Suspense fallback={<NewsletterFormSkeleton />}>
            <NewsletterForm
              source="homepage-final-cta"
              className="mt-4"
            />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

function NewsletterFormSkeleton() {
  return (
    <div aria-hidden className="mt-4 flex flex-col gap-4 opacity-50">
      <div className="h-10 rounded-md bg-bg-2" />
      <div className="h-3 w-40 rounded bg-bg-2" />
      <div className="h-11 w-32 rounded-md bg-bg-2" />
    </div>
  );
}
