"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

// Public env vars are inlined by Next.js at build time, so reading
// process.env.NEXT_PUBLIC_BOOKING_URL here resolves to a string literal
// in the client bundle. Trim once at definition so a whitespace-only
// value (e.g. accidentally `NEXT_PUBLIC_BOOKING_URL="   "`) still falls
// back to the apply-async panel instead of rendering a broken iframe.
const RAW_BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL;
const BOOKING_URL = RAW_BOOKING_URL ? RAW_BOOKING_URL.trim() : "";

export default function BookACallEmbed() {
  if (!BOOKING_URL) {
    return (
      <div className="aj-form-panel">
        <Eyebrow tone="signal">Booking Path</Eyebrow>
        <h2 className="mt-4 font-accent text-3xl font-bold tracking-[-0.03em] text-fg-0">
          Scheduling is being routed through the application flow.
        </h2>
        <p className="mt-4 text-sm leading-7 text-fg-2">
          The live scheduler is not configured in this environment. Submit the
          engagement application and Audio Jones will follow up with the right
          call path.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/apply" variant="glow">
            Apply for Engagement
          </ButtonLink>
          <ButtonLink href="/roi-calculator" variant="secondary">
            Calculate Lost Revenue
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="aj-form-panel">
      <Eyebrow tone="signal">Schedule</Eyebrow>
      <h2 className="mt-4 font-accent text-3xl font-bold tracking-[-0.03em] text-fg-0">
        Pick a time that works.
      </h2>
      <p className="mt-3 text-sm leading-7 text-fg-2">
        Calls run 30 minutes. Come with one operating constraint you want to
        diagnose.
      </p>

      <div
        className="mt-6 overflow-hidden rounded-xl border border-[var(--line-2)] bg-[rgba(5,7,15,0.62)]"
        style={{ colorScheme: "dark" }}
      >
        <iframe
          src={BOOKING_URL}
          title="Schedule a call with Audio Jones"
          loading="lazy"
          tabIndex={0}
          className="block h-[720px] w-full border-0"
        />
      </div>

      <p className="mt-5 text-xs leading-6 text-fg-3">
        Prefer to apply async first?{" "}
        <a
          href="/apply"
          className="font-medium text-fg-1 underline decoration-[var(--line-2)] underline-offset-4 transition-colors hover:text-fg-0 hover:decoration-fg-0"
        >
          Submit the engagement application
        </a>{" "}
        and Audio Jones will follow up.
      </p>
    </div>
  );
}
