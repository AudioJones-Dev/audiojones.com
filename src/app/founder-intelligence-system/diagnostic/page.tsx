import type { Metadata } from "next";
import DiagnosticForm from "@/components/founder-intelligence/DiagnosticForm";
import Breadcrumbs from "@/components/founder-intelligence/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "Strategic Diagnostic | Founder Intelligence System",
  description:
    "Apply for a Founder Intelligence System Diagnostic. Six steps that map your constraint, signal architecture, AI readiness, and attribution clarity.",
  path: "/founder-intelligence-system/diagnostic",
});

export default function DiagnosticPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Founder Intelligence System", url: "/founder-intelligence-system" },
          { name: "Diagnostic", url: "/founder-intelligence-system/diagnostic" },
        ])}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Founder Intelligence System", href: "/founder-intelligence-system" },
          { name: "Diagnostic" },
        ]}
      />

      <section className="bg-[#05070F] pt-16 pb-10">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C8A96A]">
            Strategic Diagnostic
          </p>
          <h1 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Tell me where your business actually leaks signal.
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Six short steps. I review every submission personally and reply
            within two business days if there’s a strong fit.
          </p>
        </div>
      </section>

      <section className="bg-[#05070F] pb-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <DiagnosticForm />
        </div>
      </section>
    </>
  );
}
