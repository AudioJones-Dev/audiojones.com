import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pilot application received",
  description:
    "Your Founder Intelligence Systems pilot application has been received. Reviewed personally — expect a response within 1–3 business days.",
  alternates: {
    canonical: `${siteConfig.url}/founder-intelligence-systems-pilot/thank-you`,
  },
  robots: { index: false, follow: true },
};

export default function PilotThankYou() {
  return (
    <section className="bg-bg-0 py-24 sm:py-32">
      <div className="mx-auto max-w-[760px] px-5 text-center sm:px-8">
        <Eyebrow tone="signal">Pilot application received</Eyebrow>
        <h1 className="mt-4 t-h1 text-balance">
          Got it. Now I review for fit.
        </h1>
        <p className="mt-5 t-lead text-fg-2">
          Only 3 pilot partners are being accepted, so every application is
          reviewed personally — no bots, no autoresponder fluff. Expect a
          response within 1–3 business days. If it&apos;s a strong fit, the
          next step is a Pilot Fit Call to map your operational constraint.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/book-a-call" variant="primary" size="lg">
            Book Pilot Fit Call
          </ButtonLink>
          <ButtonLink
            href="/founder-intelligence-system"
            variant="secondary"
            size="lg"
          >
            Read the framework
          </ButtonLink>
        </div>

        <p className="mt-12 t-small text-fg-3">
          Wrong place?{" "}
          <a href="/" className="underline hover:text-fg-0">
            Back to the homepage
          </a>
          .
        </p>
      </div>
    </section>
  );
}
