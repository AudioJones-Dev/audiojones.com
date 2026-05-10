import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

const TITLE = "Workshops";
const DESCRIPTION =
  "Operator workshops and live training sessions for founder-led businesses building Applied Intelligence Systems.";
const PATH = "/workshops";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

export default function WorkshopsPage() {
  return (
    <div className="min-h-screen bg-bg-0">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Workshops", url: PATH },
        ])}
      />
      <section className="border-b border-[var(--line-2)] py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <Eyebrow>Coming soon</Eyebrow>
          <h1 className="mt-4 t-h1 text-balance text-fg-0">{TITLE}</h1>
          <p className="mt-5 max-w-2xl t-lead text-fg-2">{DESCRIPTION}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/book-a-call" variant="glow">
              Book a Call
            </ButtonLink>
            <ButtonLink href="/roi-calculator" variant="secondary">
              Calculate Your AI ROI
            </ButtonLink>
          </div>
        </div>
      </section>

      <RelatedLinks
        items={[
          { label: "AI Readiness Diagnostic", href: "/ai-readiness-diagnostic", description: "Assess where you stand" },
          { label: "Insights", href: "/insights", description: "The frameworks taught in workshops" },
          { label: "Frameworks", href: "/frameworks", description: "Reference library" },
          { label: "Services", href: "/services", description: "Hands-on engagements" },
        ]}
      />
    </div>
  );
}
