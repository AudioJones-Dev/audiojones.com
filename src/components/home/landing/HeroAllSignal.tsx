import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

const METRICS = [
  { value: "37%", direction: "↓", label: "CAC Reduction" },
  { value: "28%", direction: "↑", label: "Pipeline Growth" },
  { value: "42%", direction: "↑", label: "Conversion Rate" },
];

/**
 * Hero — editorial-tech composition using real asset layers.
 *
 * Visual logic per brief:
 *   LEFT  = noise / confusion / fragmented data (dark bg, noise layer PNG)
 *   CENTER = human judgment / signal processor (transparent portrait cutout + signal node reticle)
 *   RIGHT = clarity / system / outcomes (light bg, system diagram PNG)
 *
 * Asset layers (all transparent PNG):
 *   - Noise layer  → /assets/Homepage/02-hero-all-signal/noise-layer/
 *   - Portrait     → /assets/Homepage/02-hero-all-signal/portrait/
 *   - Signal node  → /assets/Homepage/02-hero-all-signal/signal-node/
 *   - System diag  → /assets/Homepage/02-hero-all-signal/system-diagram/
 */
export default function HeroAllSignal() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden flex flex-col"
      style={{ minHeight: "92vh" }}
    >
      {/* ── Split background ── */}
      <div aria-hidden className="absolute inset-0 -z-30 flex pointer-events-none">
        <div className="w-full lg:w-1/2 bg-[#05070F]" />
        <div className="hidden lg:block lg:w-1/2 bg-[#F5F5F5]" />
      </div>

      {/* ── Dark-side grid texture ── */}
      <svg
        aria-hidden
        className="absolute left-0 top-0 -z-20 h-full w-full lg:w-1/2 opacity-[0.04] pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 640 800"
      >
        <defs>
          <pattern id="hg" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hg)" />
      </svg>

      {/* ── Noise layer — mobile (< 640px) ── */}
      <div
        aria-hidden
        className="block sm:hidden absolute left-0 top-0 -z-10 h-full w-full pointer-events-none"
      >
        <Image
          src="/assets/Homepage/02-hero-all-signal/noise-layer/hero-noise-left-dense-mobile-transparent.png"
          alt=""
          fill
          className="object-cover object-left-top"
          sizes="100vw"
        />
      </div>

      {/* ── Noise layer — tablet (640px–1023px) ── */}
      <div
        aria-hidden
        className="hidden sm:block lg:hidden absolute left-0 top-0 -z-10 h-full w-full pointer-events-none"
      >
        <Image
          src="/assets/Homepage/02-hero-all-signal/noise-layer/hero-noise-left-dense-tablet-transparent.png"
          alt=""
          fill
          className="object-cover object-left-top"
          sizes="100vw"
        />
      </div>

      {/* ── Noise layer — desktop (1024px+) ── */}
      <div
        aria-hidden
        className="hidden lg:block absolute left-0 top-0 -z-10 h-full w-1/2 pointer-events-none"
      >
        <Image
          src="/assets/Homepage/02-hero-all-signal/noise-layer/hero-noise-left-dense-transparent.png.png"
          alt=""
          fill
          className="object-cover object-left-top"
          sizes="50vw"
        />
      </div>

      {/* ── Center transition gradient (dark → light boundary) ── */}
      <div
        aria-hidden
        className="hidden lg:block absolute top-0 -z-10 h-full pointer-events-none"
        style={{ left: "40%", width: "20%" }}
      >
        <Image
          src="/assets/Homepage/02-hero-all-signal/noise-layer/hero-noise-transition-center-transparent.png.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="20vw"
        />
      </div>

      {/* ── "ALL SIGNAL" mega background typography ── */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none overflow-hidden select-none"
      >
        <span
          className="whitespace-nowrap font-bold tracking-tighter"
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(80px, 14vw, 200px)",
            lineHeight: 1,
            letterSpacing: "-0.045em",
          }}
        >
          <span style={{ color: "#111111", opacity: 0.07 }}>ALL </span>
          <span style={{ color: "#FF4500", opacity: 0.15 }}>SIGNAL</span>
        </span>
      </div>

      {/* ── Main content grid ── */}
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 flex-1 grid grid-cols-12 gap-x-6 lg:gap-x-8 items-end">

        {/* LEFT — copy zone */}
        <div className="col-span-12 lg:col-span-5 flex flex-col justify-center py-32 lg:py-40">
          <span
            className="inline-block font-semibold uppercase text-aj-gold mb-5"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              letterSpacing: "0.22em",
            }}
          >
            Applied Intelligence Systems
          </span>

          <h1
            className="font-bold text-fg-0 text-balance"
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(34px, 4.2vw, 54px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            You don&apos;t have an AI problem.
            <br />
            <span style={{ color: "#FF4500" }}>You have a signal problem.</span>
          </h1>

          <p
            className="mt-6 text-fg-2 max-w-[50ch]"
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: "18px",
              lineHeight: 1.55,
              fontWeight: 500,
            }}
          >
            I help founder-led businesses identify what actually creates outcomes
            and build systems to scale it.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink
              href="/applied-intelligence/diagnostic"
              variant="glow"
            >
              Book Your Diagnostic
            </ButtonLink>
            <ButtonLink href="#system-model" variant="system-glow">
              See the System
            </ButtonLink>
          </div>
        </div>

        {/* CENTER — founder portrait (transparent cutout) */}
        <div className="hidden lg:flex lg:col-span-4 relative items-end justify-center h-full">
          {/* Signal node reticle — desktop */}
          <div
            aria-label="Signal node"
            className="absolute z-20 w-full"
            style={{
              bottom: "32%",
              left: "50%",
              transform: "translateX(-50%)",
              maxWidth: "200px",
              height: "120px",
            }}
          >
            <Image
              src="/assets/Homepage/02-hero-all-signal/signal-node/hero-signal-node-reticle-transparent.png.png"
              alt=""
              fill
              className="object-contain"
              sizes="200px"
            />
          </div>

          {/* Portrait — transparent PNG cutout */}
          <div
            className="relative w-full"
            style={{ height: "680px" }}
          >
            <Image
              src="/assets/Homepage/02-hero-all-signal/portrait/portraithero-portrait-audiojones-transparent.png.png"
              alt="Tyrone Nelms, founder — Audio Jones"
              fill
              priority
              className="object-contain object-bottom"
              sizes="(max-width: 1280px) 33vw, 400px"
            />
          </div>
        </div>

        {/* RIGHT — system diagram PNG on light surface */}
        <div className="hidden lg:flex lg:col-span-3 items-center justify-center h-full pb-16">
          <div className="relative w-full" style={{ height: "420px" }}>
            <Image
              src="/assets/Homepage/02-hero-all-signal/system-diagram/hero-system-diagram-transparent.png.png"
              alt="Applied Intelligence System loop: Input → Process → Output → Feedback"
              fill
              className="object-contain object-center"
              sizes="(max-width: 1280px) 25vw, 300px"
            />
          </div>
        </div>
      </div>

      {/* ── Mobile portrait (below copy, above metrics) ── */}
      <div className="block sm:hidden relative w-full" style={{ height: "320px" }}>
        {/* Mobile signal node reticle */}
        <div
          aria-hidden
          className="absolute z-10"
          style={{
            top: "35%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100px",
            height: "60px",
          }}
        >
          <Image
            src="/assets/Homepage/02-hero-all-signal/signal-node/hero-signal-node-reticle--mobile-transparent.png.png"
            alt=""
            fill
            className="object-contain"
            sizes="100px"
          />
        </div>
        <Image
          src="/assets/Homepage/02-hero-all-signal/portrait/portraithero-portrait-audiojones-transparent.png.png"
          alt="Tyrone Nelms, founder — Audio Jones"
          fill
          className="object-contain object-bottom"
          sizes="100vw"
        />
      </div>

      {/* ── Tablet portrait strip (640px–1023px) ── */}
      <div
        className="hidden sm:block lg:hidden relative w-full mx-auto"
        style={{ height: "400px", maxWidth: "480px" }}
      >
        {/* Tablet signal node reticle */}
        <div
          aria-hidden
          className="absolute z-10"
          style={{
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "140px",
            height: "80px",
          }}
        >
          <Image
            src="/assets/Homepage/02-hero-all-signal/signal-node/hero-signal-node-reticle-tablet-transparent.png.png"
            alt=""
            fill
            className="object-contain"
            sizes="140px"
          />
        </div>
        <Image
          src="/assets/Homepage/02-hero-all-signal/portrait/portraithero-portrait-audiojones-transparent.png.png"
          alt="Tyrone Nelms, founder — Audio Jones"
          fill
          className="object-contain object-bottom"
          sizes="480px"
        />
      </div>

      {/* ── Metrics strip ── */}
      <div className="relative z-10 border-t border-[rgba(255,255,255,0.08)] bg-[rgba(5,7,15,0.88)] backdrop-blur-md">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 py-5 flex flex-wrap gap-8 sm:gap-12 items-center">
          {METRICS.map((m) => (
            <div key={m.label} className="flex flex-col gap-0.5">
              <span
                className="font-bold text-aj-orange"
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "26px",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {m.direction}&thinsp;{m.value}
              </span>
              <span
                className="text-fg-3 uppercase tracking-widest"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  letterSpacing: "0.14em",
                }}
              >
                {m.label}
              </span>
            </div>
          ))}
          <div className="ml-auto hidden sm:block">
            <span
              className="font-bold text-fg-0 opacity-[0.12] tracking-tighter"
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "22px",
                letterSpacing: "-0.03em",
              }}
            >
              ALL SIGNAL
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
