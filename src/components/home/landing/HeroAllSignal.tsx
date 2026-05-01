import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

const METRICS = [
  { value: "37%", direction: "↓", label: "CAC Reduction" },
  { value: "28%", direction: "↑", label: "Pipeline Growth" },
  { value: "42%", direction: "↑", label: "Conversion Rate" },
];

/**
 * Hero — editorial-tech composition.
 *
 * Visual logic per brief:
 *   LEFT  = noise / confusion / fragmented data (dark bg, particles, copy)
 *   CENTER = human judgment / signal processor (founder portrait b&w, signal node)
 *   RIGHT = clarity / system / outcomes (light bg, INPUT→PROCESS→OUTPUT→FEEDBACK)
 *
 * "ALL SIGNAL" in Space Grotesk Bold spans full width behind the subject.
 * Metrics strip anchors the bottom edge.
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

      {/* ── Left noise / particle field ── */}
      <div
        aria-hidden
        className="absolute left-0 top-0 -z-10 h-full w-full lg:w-1/2 overflow-hidden pointer-events-none"
      >
        <NoiseField />
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

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink
              href="/applied-intelligence/diagnostic"
              variant="primary"
              size="lg"
            >
              Book Your Diagnostic
            </ButtonLink>
            <ButtonLink href="#system-model" variant="secondary" size="lg">
              See the System
            </ButtonLink>
          </div>
        </div>

        {/* CENTER — founder portrait */}
        <div className="hidden lg:flex lg:col-span-4 relative items-end justify-center h-full">
          {/* Orange signal node — chest level */}
          <div
            aria-label="Signal node"
            className="absolute z-20"
            style={{
              bottom: "38%",
              left: "50%",
              transform: "translateX(-50%) translateX(8px)",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#FF4500",
              boxShadow:
                "0 0 0 3px rgba(255,69,0,0.25), 0 0 16px 6px rgba(255,69,0,0.18), 0 0 32px 14px rgba(255,69,0,0.08)",
            }}
          />
          {/* Thin blue border — frame accent */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 z-10 border-l border-r border-[rgba(59,91,255,0.2)]"
            style={{ height: "85%", borderRadius: "8px 8px 0 0" }}
          />
          <div
            className="relative w-full"
            style={{ height: "620px" }}
          >
            <Image
              src="/assets/audio-jones-hero.webp"
              alt="Tyrone Nelms, founder — Audio Jones"
              fill
              priority
              className="object-cover object-top"
              style={{
                filter: "grayscale(100%) contrast(1.08)",
                maskImage:
                  "linear-gradient(to bottom, black 55%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 55%, transparent 100%)",
              }}
            />
          </div>
        </div>

        {/* RIGHT — system diagram on light surface */}
        <div className="hidden lg:flex lg:col-span-3 items-center justify-center h-full pb-16">
          <SystemDiagramHero />
        </div>
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

/* ─────────────── Noise field — left dark zone ─────────────── */

function NoiseField() {
  // Deterministic scatter — no hydration mismatch
  const dots = Array.from({ length: 48 }, (_, i) => ({
    x: ((i * 41) % 90) + 5,
    y: ((i * 59 + 13) % 90) + 5,
    r: ((i * 17) % 5) + 1,
    o: (((i * 7) % 55) + 15) / 100,
  }));
  const frags = Array.from({ length: 8 }, (_, i) => ({
    x: ((i * 73) % 80) + 5,
    y: ((i * 31 + 7) % 75) + 10,
    w: ((i * 23) % 20) + 8,
    h: ((i * 11) % 6) + 2,
    o: (((i * 13) % 25) + 8) / 100,
  }));
  const lines = Array.from({ length: 10 }, (_, i) => ({
    x1: ((i * 47) % 80) + 5,
    y1: ((i * 31 + 11) % 80) + 5,
    x2: ((i * 47 + 20) % 90) + 5,
    y2: ((i * 53 + 7) % 85) + 5,
    o: (((i * 11) % 25) + 8) / 100,
  }));

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      {/* Scattered fragment blocks (glitch UI) */}
      {frags.map((f, i) => (
        <rect
          key={`f${i}`}
          x={f.x}
          y={f.y}
          width={f.w}
          height={f.h}
          rx="0.5"
          fill="none"
          stroke="#FF4500"
          strokeWidth="0.25"
          opacity={f.o}
        />
      ))}
      {/* Diagonal connector lines */}
      {lines.map((l, i) => (
        <line
          key={`l${i}`}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="#94A3B8"
          strokeWidth="0.15"
          opacity={l.o}
        />
      ))}
      {/* Particle dots */}
      {dots.map((d, i) => (
        <circle
          key={`d${i}`}
          cx={d.x}
          cy={d.y}
          r={d.r * 0.35}
          fill="#94A3B8"
          opacity={d.o}
        />
      ))}
    </svg>
  );
}

/* ─────────────── System diagram — right light zone ─────────────── */

function SystemDiagramHero() {
  const nodes = [
    { label: "INPUT", sub: "signals, data, behavior" },
    { label: "PROCESS", sub: "intelligence layer", active: true },
    { label: "OUTPUT", sub: "actions, systems, content" },
    { label: "FEEDBACK", sub: "measurement, refinement" },
  ];

  return (
    <div className="flex flex-col items-center gap-0 w-full max-w-[200px]">
      {nodes.map((n, i) => (
        <div key={n.label} className="flex flex-col items-center w-full">
          <div
            className="w-full rounded-lg px-3 py-3 flex flex-col items-center"
            style={{
              background: n.active ? "rgba(59,91,255,0.08)" : "rgba(11,16,32,0.04)",
              border: n.active
                ? "1px solid rgba(59,91,255,0.5)"
                : "1px solid rgba(17,17,17,0.14)",
            }}
          >
            <span
              className="font-mono font-semibold tracking-widest"
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: "9px",
                letterSpacing: "0.2em",
                color: n.active ? "#3B5BFF" : "#C8A96A",
              }}
            >
              {n.label}
            </span>
            <span
              className="mt-1 text-center"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                color: n.active ? "#1E2A3A" : "#64748B",
                lineHeight: 1.3,
              }}
            >
              {n.sub}
            </span>
            {n.active && (
              <div
                aria-hidden
                className="mt-2 rounded-full"
                style={{
                  width: "6px",
                  height: "6px",
                  background: "#3B5BFF",
                  boxShadow: "0 0 8px 3px rgba(59,91,255,0.4)",
                }}
              />
            )}
          </div>
          {i < nodes.length - 1 && (
            <div
              aria-hidden
              style={{
                width: "1px",
                height: "20px",
                background: "linear-gradient(to bottom, rgba(59,91,255,0.4), rgba(59,91,255,0.15))",
              }}
            />
          )}
        </div>
      ))}
      {/* Feedback loop arc */}
      <svg
        aria-hidden
        viewBox="0 0 80 40"
        className="w-full mt-1"
        style={{ height: "28px" }}
      >
        <path
          d="M40 4 Q75 4 75 20 Q75 38 40 38 Q8 38 8 20 Q8 4 40 4"
          fill="none"
          stroke="rgba(59,91,255,0.25)"
          strokeWidth="0.8"
          strokeDasharray="3 2"
        />
        <text
          x="40"
          y="23"
          textAnchor="middle"
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: "5px",
            fill: "#64748B",
            letterSpacing: "0.1em",
          }}
        >
          LOOP
        </text>
      </svg>
    </div>
  );
}
