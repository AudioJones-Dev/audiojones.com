import type { Metadata } from "next";
import ApplyForm from "@/components/apply/ApplyForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import JsonLd from "@/components/seo/JsonLd";
import {
  organizationJsonLd,
  personJsonLd,
} from "@/lib/seo/schema";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Apply",
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

          <ApplyForm />
        </div>
      </section>
    </>
  );
}
