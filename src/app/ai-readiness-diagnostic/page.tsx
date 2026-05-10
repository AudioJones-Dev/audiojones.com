import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

const TITLE = "AI Readiness Diagnostic";
const DESCRIPTION =
  "Assess your business systems, data maturity, automation gaps, and readiness for AI-powered execution.";
const PATH = "/ai-readiness-diagnostic";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

export default function AiReadinessDiagnosticPage() {
  return (
    <div className="min-h-screen bg-bg-0">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "AI Readiness Diagnostic", url: PATH },
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
          { label: "Agents", href: "/agents", description: "What gets deployed after readiness" },
          { label: "Services", href: "/services", description: "How we close the gap" },
          { label: "ROI Calculator", href: "/roi-calculator", description: "Estimate the upside" },
          { label: "Insights", href: "/insights", description: "Why most AI projects fail" },
        ]}
      />
    </div>
  );
}
