import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Founder Media System",
  description:
    "Turn founder expertise into authority, discoverability, and measurable pipeline with a strategy-led media system.",
  path: "/services/founder-media-system",
});

const layers = [
  ["Positioning", "Clarify founder POV, audience, offer, and narrative."],
  ["Production", "Capture long-form founder insight through structured video recording."],
  ["Distribution", "Repurpose recordings into platform-specific assets and sales-ready touchpoints."],
  ["Search/AEO", "Turn expertise into searchable, answer-ready content for buyers."],
  ["Attribution", "Track qualified conversations, source, and assisted pipeline influence."],
] as const;

export default function FounderMediaSystemPage() {
  return (
    <main className="min-h-screen bg-bg-0 text-fg-0">
      <section className="border-b border-[var(--line-2)] py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="max-w-[var(--copy-max)]">
            <Eyebrow>Founder Visibility System</Eyebrow>
            <h1 className="mt-5 t-h1 text-balance">Founder Media System</h1>
            <p className="mt-6 t-lead text-fg-2">
              Turn founder expertise into authority, discoverability, and measurable pipeline.
            </p>
            <p className="mt-5 t-body-lg text-fg-2">
              This is not a podcast package, content calendar, or studio rental offer. It is a strategy-led media
              system that connects founder positioning, production, distribution, SEO/AEO visibility, and attribution.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/book-a-call" variant="glow">Book a Founder Media Audit</ButtonLink>
              <ButtonLink href="/ai-readiness-diagnostic" variant="secondary">Start with a Signal Audit</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <Eyebrow>System Layers</Eyebrow>
          <h2 className="mt-4 t-h2 text-balance">Most businesses produce content. Very few operate a media system.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {layers.map(([title, description]) => (
              <article key={title} className="rounded-2xl border border-[var(--line-2)] bg-bg-2 p-6">
                <h3 className="t-h4 text-fg-0">{title}</h3>
                <p className="mt-3 t-body text-fg-2">{description}</p>
              </article>
            ))}
          </div>
          <p className="mt-10 t-body text-fg-2">
            Founder Media System supports Founder Intelligence Systems by making expertise visible and commercially
            useful without reducing your brand to commodity media production.
          </p>
          <Link href="/services" className="mt-6 inline-flex t-body text-aj-orange hover:text-aj-orange-soft">
            Back to Services →
          </Link>
        </div>
      </section>
    </main>
  );
}
