import type { Metadata } from "next";
import DiagnosticForm from "@/components/applied-intelligence/DiagnosticForm";
import JsonLd from "@/components/seo/JsonLd";
import { Eyebrow } from "@/components/ui/Eyebrow";
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

      <section className="bg-bg-0 pt-16 pb-10">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Eyebrow tone="blue" className="mb-4">
            Strategic Diagnostic
          </Eyebrow>
          <h1 className="text-balance font-headline text-[clamp(2.35rem,6vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-fg-0">
            Tell me where your business actually leaks signal.
          </h1>
          <p className="mt-5 max-w-[58ch] font-body text-[clamp(1.05rem,2.5vw,1.35rem)] leading-[1.55] text-fg-1">
            Six short steps. I review every submission personally and reply
            within two business days if there’s a strong fit.
          </p>
        </div>
      </section>

      <section className="diagnostic-grid-wrapper py-16 sm:py-20">
        <div className="diagnostic-grid-background" aria-hidden />
        <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8">
          <DiagnosticForm />
        </div>
      </section>
    </>
  );
}
