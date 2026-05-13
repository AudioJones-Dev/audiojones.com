// Audio Jones Brand 2.0 — Services section.
// §07: Signal yellow is the only accent. Dark surfaces, DM Mono eyebrows,
// no emoji in professional surfaces. The previous orange/gold gradient
// "icons" carried emoji glyphs; replaced with V2 signal-mark glyphs
// rendered inline as SVG.

import { Eyebrow } from "@/components/ui/Eyebrow";

type Pillar = {
  title: string;
  body: string;
  bullets: string[];
  href: string;
};

const PILLARS: Pillar[] = [
  {
    title: "Personal Branding Authority",
    body: "We help you build a powerful, authentic personal brand that establishes you as a thought leader in your industry.",
    bullets: ["Brand Strategy", "Content Creation", "Audience Growth"],
    href: "/book?service=personal-branding",
  },
  {
    title: "Video Podcast Production",
    body: "From concept to distribution, we handle the entire podcasting process to produce high-quality video and audio content.",
    bullets: [
      "Full-Service Production",
      "High-Quality Editing",
      "Distribution Strategy",
    ],
    href: "/book?service=podcast",
  },
  {
    title: "AI Marketing Systems",
    body: "Leverage artificial intelligence to streamline content repurposing, lead generation, and workflow optimization.",
    bullets: ["AI Automation", "Content Repurposing", "Lead Generation"],
    href: "/book?service=ai",
  },
];

function SignalGlyph() {
  return (
    <svg
      viewBox="0 0 48 56"
      role="img"
      aria-hidden="true"
      className="h-7 w-auto"
    >
      <g fill="#E8FF5A">
        <rect x="6"  y="18" width="6" height="22" rx="3" />
        <rect x="18" y="10" width="6" height="30" rx="3" />
        <rect x="30" y="2"  width="6" height="38" rx="3" />
        <circle cx="21" cy="48" r="6" />
      </g>
    </svg>
  );
}

export default function ServicesSection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-bg-base text-text-primary">
      {/* Atmospheric signal-yellow glow — never a full fill, just a wash. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-glow-orange opacity-60"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Eyebrow withLine>What We Build</Eyebrow>
          <h2 className="font-headline mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.02em] text-fg-0">
            Three pillars to grow authority and revenue
          </h2>
          <p className="mt-6 max-w-3xl mx-auto font-body text-lg leading-[1.7] text-text-primary">
            Personal branding, video podcast production, and AI marketing systems delivered as a unified growth engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="rounded bg-surface-1 border border-border-subtle p-8 transition-colors hover:border-border-strong"
            >
              <div className="mb-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded border border-border-strong bg-surface-2">
                  <SignalGlyph />
                </div>
                <h3 className="font-headline text-xl font-bold tracking-[-0.02em] text-fg-0 mb-3">
                  {p.title}
                </h3>
                <p className="font-body text-sm leading-[1.7] text-text-primary/80">
                  {p.body}
                </p>
              </div>
              <ul className="space-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
                {p.bullets.map((b) => (
                  <li key={b}>— {b}</li>
                ))}
              </ul>
              <a
                href={p.href}
                className="mt-6 inline-flex items-center font-headline text-sm font-bold tracking-[-0.01em] text-signal-yellow transition-colors hover:text-signal-soft"
              >
                Learn More <span aria-hidden="true" className="ml-1.5">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
