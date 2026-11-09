import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/lib/site";

// Google Calendar appointment schedule "30 min with Audio"
// (audiojones@ajdigital.app). Calls stay apply-first, so the calendar
// lives here rather than on /book-a-call.
const BOOKING_EMBED_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3BvZmbSuIyzUrtFSaDmVl9ZlGgOUD0ymCFnWJPaKmFGqRWVHrtTN50u-KDS6L--vmltnl4orTF?gv=true";
const BOOKING_LINK = "https://calendar.app.google/ucM2SDX18xRCRgsB9";

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
          autoresponder fluff. Pick a 30-minute time below and I&apos;ll read
          your answers before we talk.
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl bg-white">
          <iframe
            src={BOOKING_EMBED_URL}
            title="Book a 30-minute call with Audio Jones"
            className="block h-[640px] w-full border-0"
          />
        </div>
        <p className="mt-3 t-small text-fg-3">
          Calendar not loading?{" "}
          <a href={BOOKING_LINK} className="underline hover:text-fg-0" target="_blank" rel="noopener noreferrer">
            Open the booking page
          </a>
          .
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
