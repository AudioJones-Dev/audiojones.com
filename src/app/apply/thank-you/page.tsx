import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Application received",
  description: "Your application has been received. I'll be in touch.",
  alternates: { canonical: `${siteConfig.url}/apply/thank-you` },
  robots: { index: false, follow: true },
};

export default function ApplyThankYou() {
  return (
    <section className="bg-bg-0 py-24 sm:py-32">
      <div className="mx-auto max-w-[760px] px-5 text-center sm:px-8">
        <Eyebrow tone="blue">Application received</Eyebrow>
        <h1 className="mt-4 t-h1 text-balance">
          Got it. Now I do the work.
        </h1>
        <p className="mt-5 t-lead text-fg-2">
          Your application is in. I review every one personally — no bots, no
          autoresponder fluff. Expect a response within 1–3 business days. If
          it&apos;s a strong fit, the next step is a strategic conversation.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/frameworks" variant="secondary" size="lg">
            Read the frameworks
          </ButtonLink>
          <ButtonLink href="/insights" variant="ghost" size="lg">
            Browse insights
          </ButtonLink>
        </div>

        <p className="mt-12 t-small text-fg-3">
          Wrong place? <a href="/" className="underline hover:text-fg-0">Back to the homepage</a>.
        </p>
      </div>
    </section>
  );
}
