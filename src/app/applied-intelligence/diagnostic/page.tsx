import type { Metadata } from "next";
import DiagnosticForm from "@/components/applied-intelligence/DiagnosticForm";
import Breadcrumbs from "@/components/applied-intelligence/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "Strategic Diagnostic | Applied Intelligence",
  description:
    "Apply for an Applied Intelligence Diagnostic. Six steps that map your constraint, signal architecture, AI readiness, and attribution clarity.",
  path: "/applied-intelligence/diagnostic",
});

export default function DiagnosticPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Applied Intelligence", url: "/applied-intelligence" },
          { name: "Diagnostic", url: "/applied-intelligence/diagnostic" },
        ])}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Applied Intelligence", href: "/applied-intelligence" },
          { name: "Diagnostic" },
        ]}
      />

      <section className="bg-bg-base pt-16 pb-10">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="mb-3">
            <Eyebrow withLine>Strategic Diagnostic</Eyebrow>
          </div>
          <h1 className="text-balance text-3xl font-semibold leading-tight text-text-primary sm:text-4xl">
            Tell me where your business actually leaks signal.
          </h1>
          <p className="mt-4 text-lg text-text-muted">
            Six short steps. I review every submission personally and reply
            within two business days if there’s a strong fit.
          </p>
        </div>
      </section>

      <section className="bg-bg-base pb-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <DiagnosticForm />
        </div>
      </section>
    </>
  );
}
