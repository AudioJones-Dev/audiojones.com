// src/app/cancellation-policy/page.tsx
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Cancellation & Refund Policy",
  description:
    "Cancellation windows, refund eligibility, and rescheduling rules for Audio Jones consulting, recurring engagements, and studio sessions.",
  path: "/cancellation-policy",
});

export default function CancellationPolicyPage() {
  const lastUpdated = "October 29, 2025";

  return (
    <main className="min-h-screen bg-[#111] text-white">
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">Cancellation & Refund Policy</h1>
        <p className="mt-4 text-lg text-white/75">Last Updated: {lastUpdated}</p>

        <div className="prose prose-invert mt-8 max-w-none">
          <h2>1. Online Services</h2>
          <p>Cancel ≥ 7 days before next billing cycle for no charge.</p>
          <p>Work in progress is billed prorata.</p>

          <h2>2. In-Studio Sessions</h2>
          <p>Cancel ≥ 48 hours before appointment → full credit.</p>
          <p>Cancel {"<"} 24 hours → 50% fee.</p>
          <p>No-shows → non-refundable.</p>
          <p>One reschedule complimentary within 30 days.</p>

          <h2>3. Deposits</h2>
          <p>Non-refundable but transferable within 30 days.</p>

          <h2>4. Refund Processing</h2>
          <p>
            Email <a href="mailto:contact@audiojones.com">contact@audiojones.com</a>; allow 5-10 business
            days.
          </p>

          <h2>5. Force Majeure</h2>
          <p>Acts of God, power loss, or emergencies → credit or reschedule only.</p>

          <p>Governing Law: Florida.</p>
        </div>
      </section>
    </main>
  );
}
