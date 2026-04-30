import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Hero — "ALL SIGNAL" composition.
 *
 * Aggressive asymmetry per the brief:
 *  - Left:   fragmented-data / noise layer (SVG, code-rendered)
 *  - Center: large display headline + glow at the chest node
 *  - Right:  clean system diagram (SVG, code-rendered)
 *
 * No PNG hero imagery is used here — all visual weight is in code so the
 * hero ships under any network condition and re-styles with tokens.
 *
 * If/when ImageKit hero compositing is approved, the right-pane SVG can
 * accept an `<image>` overlay sourced from `NEXT_PUBLIC_IK_HERO_OVERLAY`
 * (see .env.example). Until then the SVG stands alone.
 */
export default function HeroAllSignal() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-bg-0 pt-32 pb-24 sm:pt-40 sm:pb-32"
    >
      {/* Ambient gradient field */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_55%,rgba(59,91,255,0.22),transparent_55%),radial-gradient(circle_at_15%_25%,rgba(255,69,0,0.08),transparent_45%),radial-gradient(circle_at_85%_85%,rgba(200,169,106,0.10),transparent_60%)]"
      />
      {/* Top hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-aj-blue-bright/40 to-transparent"
      />
      {/* Subtle grid lines */}
      <svg
        aria-hidden
        className="absolute inset-0 -z-10 h-full w-full opacity-[0.06]"
        preserveAspectRatio="none"
        viewBox="0 0 1280 800"
      >
        <defs>
          <pattern id="hero-grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-fg-2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      <div className="mx-auto grid max-w-[1280px] grid-cols-12 gap-x-8 px-5 sm:px-8">
        {/* LEFT — fragmented data / noise */}
        <div className="relative col-span-12 hidden lg:col-span-3 lg:block">
          <NoiseField className="h-full w-full" />
        </div>

        {/* CENTER — type composition */}
        <div className="col-span-12 flex flex-col justify-center lg:col-span-6">
          <Eyebrow>Applied Intelligence Systems</Eyebrow>
          <h1 className="mt-6 t-display-lg text-balance">
            <span className="block">All</span>
            <span className="relative inline-block">
              Signal
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-aj-orange"
              />
            </span>
            <span className="block t-h2 mt-3 font-medium text-fg-2">
              No noise. Just the systems that compound.
            </span>
          </h1>
          <p className="mt-7 max-w-[56ch] t-lead text-fg-1">
            You don&apos;t have an AI problem. You have a signal problem. Audio Jones
            helps founder-led businesses identify the causal inputs behind growth,
            reduce operational noise, and build Applied Intelligence Systems that
            scale judgment, execution, and profit.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink
              href="/applied-intelligence/diagnostic"
              variant="primary"
              size="lg"
            >
              Request strategic diagnostic
            </ButtonLink>
            <ButtonLink href="#system-model" variant="secondary" size="lg">
              View the system model
            </ButtonLink>
          </div>

          {/* Center glow node */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,91,255,0.35),transparent_70%)] blur-2xl"
          />
        </div>

        {/* RIGHT — clean system diagram */}
        <div className="relative col-span-12 hidden lg:col-span-3 lg:block">
          <SystemDiagramMini className="h-full w-full" />
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── decorative SVGs ───────────────────────── */

function NoiseField({ className }: { className?: string }) {
  // Deterministic pseudo-random scatter so SSR/CSR match
  const dots = Array.from({ length: 64 }, (_, i) => {
    const x = (i * 37) % 100;
    const y = (i * 53 + 17) % 100;
    const r = ((i * 13) % 5) + 1;
    const o = (((i * 7) % 60) + 20) / 100;
    return { x, y, r, o };
  });
  const lines = Array.from({ length: 12 }, (_, i) => {
    const x1 = (i * 47) % 100;
    const y1 = (i * 31 + 11) % 100;
    const x2 = ((i + 1) * 43) % 100;
    const y2 = ((i + 1) * 29 + 23) % 100;
    return { x1, y1, x2, y2, o: (((i * 11) % 30) + 10) / 100 };
  });
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className}
    >
      {lines.map((l, i) => (
        <line
          key={`l${i}`}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="currentColor"
          strokeWidth="0.2"
          opacity={l.o}
          className="text-aj-orange"
        />
      ))}
      {dots.map((d, i) => (
        <circle
          key={`d${i}`}
          cx={d.x}
          cy={d.y}
          r={d.r * 0.4}
          fill="currentColor"
          opacity={d.o}
          className="text-fg-2"
        />
      ))}
    </svg>
  );
}

function SystemDiagramMini({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 320"
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      {/* Stack of 4 horizontal layers connected by a vertical spine */}
      <line
        x1="100"
        y1="20"
        x2="100"
        y2="300"
        stroke="currentColor"
        strokeWidth="1"
        className="text-aj-blue-bright"
        opacity="0.5"
      />
      {[
        { y: 40, label: "INPUT" },
        { y: 120, label: "PROCESS" },
        { y: 200, label: "OUTPUT" },
        { y: 280, label: "FEEDBACK" },
      ].map((layer, i) => (
        <g key={layer.label}>
          <rect
            x="20"
            y={layer.y - 18}
            width="160"
            height="36"
            rx="6"
            fill="rgba(11,16,32,0.9)"
            stroke="currentColor"
            strokeWidth="1"
            className="text-aj-blue-bright"
            opacity={i === 1 ? "0.9" : "0.45"}
          />
          <text
            x="100"
            y={layer.y + 4}
            textAnchor="middle"
            fontSize="9"
            fontFamily="ui-monospace, monospace"
            letterSpacing="0.18em"
            fill="currentColor"
            className="text-aj-gold"
            opacity={i === 1 ? "1" : "0.7"}
          >
            {layer.label}
          </text>
        </g>
      ))}
      {/* Active node pulse on PROCESS */}
      <circle
        cx="100"
        cy="120"
        r="4"
        fill="currentColor"
        className="text-aj-blue-bright"
      />
    </svg>
  );
}
