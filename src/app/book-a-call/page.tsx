import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buildMetadata } from "@/lib/seo/metadata";

const TITLE = "Book a Call";
const DESCRIPTION =
  "Schedule a diagnostic call to identify the highest-leverage system opportunity inside your business.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/book-a-call",
});

export default function BookACallPage() {
  return (
    <div className="min-h-screen bg-bg-0">
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
    </div>
  );
}
