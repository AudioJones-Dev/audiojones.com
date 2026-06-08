import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/founder-intelligence/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Diagnostic received | Founder Intelligence",
    description:
      "Your Founder Intelligence Diagnostic request has been received. Audio Jones will review your signal profile and respond within two business days.",
    path: "/founder-intelligence/diagnostic/thank-you",
  }),
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Founder Intelligence", href: "/founder-intelligence" },
          { name: "Diagnostic", href: "/founder-intelligence/diagnostic" },
          { name: "Received" },
        ]}
      />
      <section className="bg-bg-base py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="mb-3">
            <Eyebrow withLine>Received</Eyebrow>
          </div>
          <h1 className="text-balance text-4xl font-semibold leading-tight text-text-primary sm:text-5xl">
            Your diagnostic request has been received.
          </h1>
          <p className="mt-6 text-lg text-text-muted">
            I’ll review your signal profile, attribution clarity, and AI
            readiness. If there is a strong fit, the next step is a strategic
            diagnostic conversation. Expect a reply within two business days.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <Link
              href="/frameworks/founder-intelligence-systems"
              className="rounded-lg border border-border-subtle bg-surface-2 p-6 transition hover:border-border-strong"
            >
              <Eyebrow>Read while you wait</Eyebrow>
              <p className="mt-2 text-lg font-semibold text-text-primary">
                Founder Intelligence Systems →
              </p>
              <p className="mt-1 text-sm text-text-muted">
                The seven-layer model behind every engagement.
              </p>
            </Link>
            <Link
              href="/frameworks/map-attribution"
              className="rounded-lg border border-border-subtle bg-surface-2 p-6 transition hover:border-border-strong"
            >
              <Eyebrow>Pre-work</Eyebrow>
              <p className="mt-2 text-lg font-semibold text-text-primary">
                M.A.P Attribution →
              </p>
              <p className="mt-1 text-sm text-text-muted">
                The filter every metric must pass before driving strategy.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
