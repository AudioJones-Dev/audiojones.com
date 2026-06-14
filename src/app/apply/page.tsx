import type { Metadata } from "next";
import { Suspense } from "react";
import ApplyForm from "@/components/apply/ApplyForm";
import FAQ from "@/components/founder-intelligence/FAQ";
import { Eyebrow } from "@/components/ui/Eyebrow";
import JsonLd from "@/components/seo/JsonLd";
import {
  faqJsonLd,
  organizationJsonLd,
  personJsonLd,
} from "@/lib/seo/schema";
import { founderIntelligenceFaqs } from "@/lib/seo/founder-intelligence-faq";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Diagnostic Review Application",
  description:
    "Apply for an Audio Jones engagement. Founder-led businesses, $250K–$5M. Reviewed personally for fit.",
  alternates: { canonical: `${siteConfig.url}/apply` },
  openGraph: {
    title: "Apply | Audio Jones",
    description:
      "Apply for a strategic engagement. Reviewed personally for fit.",
    url: `${siteConfig.url}/apply`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Apply | Audio Jones",
    description: "Apply for a strategic engagement. Reviewed personally for fit.",
  },
};

export default function ApplyPage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={personJsonLd()} />
      <JsonLd data={faqJsonLd(founderIntelligenceFaqs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Apply | Audio Jones",
          url: `${siteConfig.url}/apply`,
          description:
            "Application form for a strategic engagement with Audio Jones.",
          isPartOf: { "@type": "WebSite", url: siteConfig.url },
        }}
      />

      <section className="bg-bg-0 py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <header className="mx-auto mb-14 max-w-[640px]">
            <Eyebrow>Apply</Eyebrow>
            <h1 className="mt-4 t-h1 text-balance">
              Bring me your real constraint.
            </h1>
            <p className="mt-5 t-lead text-fg-2">
              The diagnostic is the front door. This form is the deeper cut —
              it&apos;s where the actual scoping starts. Be specific. The
              clearer the picture, the faster the right answer.
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-2 t-small text-fg-3 sm:grid-cols-3">
              <li>· Reviewed personally</li>
              <li>· No automated bot replies</li>
              <li>· Founder-led, $250K–$5M</li>
            </ul>
          </header>

          <section className="mx-auto mb-14 max-w-[760px] rounded-xl border border-border-subtle bg-surface-1 p-6 sm:p-8">
            <Eyebrow>Direct Answer</Eyebrow>
            <h2 className="mt-4 t-h3 text-fg-0">
              The application is for founder-led service businesses that need
              a sharper operating diagnosis before a systems buildout.
            </h2>
            <p className="mt-4 t-body text-fg-2">
              AJ Digital reviews the constraint, current stack, revenue leaks,
              and implementation readiness before recommending a diagnostic,
              engagement, or no-fit next step.
            </p>
            <div className="mt-8">
              <FAQ items={founderIntelligenceFaqs} />
            </div>
          </section>

          {/* Suspense boundary required because <ApplyForm> uses
              useSearchParams() — without it, /apply throws a prerender
              error in Next.js 15+ App Router. The fallback renders a
              minimal skeleton so the form area isn't empty during the
              brief client-hydration window. */}
          <Suspense fallback={<ApplyFormSkeleton />}>
            <ApplyForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}

function ApplyFormSkeleton() {
  return (
    <div
      aria-hidden
      className="mx-auto flex w-full max-w-[640px] flex-col gap-12 opacity-50"
    >
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-5">
          <div className="h-3 w-32 rounded bg-bg-2" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="h-11 rounded-md bg-bg-2" />
            <div className="h-11 rounded-md bg-bg-2" />
          </div>
        </div>
      ))}
      <div className="h-12 w-48 rounded-md bg-bg-2" />
    </div>
  );
}
