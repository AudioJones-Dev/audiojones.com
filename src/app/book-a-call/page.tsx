import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

const TITLE = "Book a Call";
const DESCRIPTION =
  "Schedule a diagnostic call to identify the highest-leverage system opportunity inside your business.";
const PATH = "/book-a-call";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

export default function BookACallPage() {
  return (
    <div className="min-h-screen bg-bg-0">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Book a Call", url: PATH },
        ])}
      />
      <section className="border-b border-[var(--line-2)] py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <Eyebrow>Coming soon</Eyebrow>
          <h1 className="mt-4 t-h1 text-balance text-fg-0">{TITLE}</h1>
          <p className="mt-5 max-w-2xl t-lead text-fg-2">{DESCRIPTION}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/apply" variant="glow">
              Apply Now
            </ButtonLink>
            <ButtonLink href="/roi-calculator" variant="secondary">
              Calculate Your AI ROI
            </ButtonLink>
          </div>
          <p className="mt-6 t-small text-fg-3 max-w-xl">
            Calendar scheduling integration coming soon. In the meantime,
            apply for an engagement and Audio Jones will reach out personally
            to schedule a call.
          </p>
        </div>
      </section>

      <RelatedLinks
        items={[
          { label: "AI Readiness Diagnostic", href: "/ai-readiness-diagnostic", description: "Pre-call self-assessment" },
          { label: "Services", href: "/services", description: "Engagement options" },
          { label: "Case Studies", href: "/case-studies", description: "What outcomes look like" },
          { label: "Apply", href: "/apply", description: "Full intake form" },
        ]}
      />
    </div>
  );
}
