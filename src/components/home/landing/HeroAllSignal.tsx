import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

/**
 * HeroAllSignal — layered editorial-tech composition.
 *
 * Layer stack (bottom → top):
 *  1. Background PNG — dark noise left / clean system right (responsive)
 *  2. "ALL SIGNAL" live typography (behind portrait) — desktop + tablet only
 *  3. Portrait transparent cutout — mutually exclusive per breakpoint:
 *       desktop  >= 1024px → portrait/hero-portrait-audiojones-desktop-transparent.png (1024×1536)
 *       tablet 768–1023px  → portrait/hero-portrait-audiojones-desktop-transparent.png (desktop fallback, adjusted size)
 *       mobile  < 768px    → portrait/hero-portrait-audiojones-mobile-transparent.png  (1200×1600)
 *  4. Metrics strip — one per breakpoint, never duplicated
 *  5. Content block (headline / copy / CTAs)
 *
 * ⚠ IMPORTANT — inline style vs Tailwind visibility:
 *   Inline `display:` values override Tailwind's `hidden` / `md:hidden` / `lg:hidden`
 *   because inline styles have higher CSS specificity than class-based rules.
 *   All flex/block display values must go in className, NOT in style={{}}.
 *   style={{}} may only contain non-display properties (position, zIndex, colors…).
 */

const ASSET = "/assets/Homepage/02-hero-all-signal";

const METRICS = [
  { pct: "37%", dir: "↓", label: "CAC Reduction" },
  { pct: "28%", dir: "↑", label: "Pipeline Growth" },
  { pct: "42%", dir: "↑", label: "Conversion Rate" },
];

export default function HeroAllSignal() {
  return (
    <section
      id="hero"
      aria-label="Hero"
      style={{
        position: "relative",
        minHeight: "calc(100vh - 80px)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── 1. Background — mobile < 768px ── */}
      <div
        aria-hidden
        className="block md:hidden"
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src={`${ASSET}/backgrounds/hero-bg-split-dark-light-system-mobile.png`}
            alt=""
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
        </div>
      </div>

      {/* ── 1. Background — tablet 768–1023px ── */}
      <div
        aria-hidden
        className="hidden md:block lg:hidden"
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src={`${ASSET}/backgrounds/hero-bg-split-dark-light-system-tablet.png`}
            alt=""
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
        </div>
      </div>

      {/* ── 1. Background — desktop >= 1024px ── */}
      <div
        aria-hidden
        className="hidden lg:block"
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src={`${ASSET}/backgrounds/hero-bg-split-dark-light-system-desktop.png`}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>

      {/* ── 2. "ALL SIGNAL" mega typography — desktop >= 1024px ── */}
      <div
        aria-hidden
        className="hidden lg:block"
        style={{
          position: "absolute",
          top: "8%",
          left: "30%",
          zIndex: 2,
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          fontFamily: "var(--font-headline)",
          fontWeight: 700,
          fontSize: "clamp(10rem, 18vw, 22rem)",
          lineHeight: 0.78,
          letterSpacing: "-0.08em",
          textTransform: "uppercase",
          transform: "scaleX(0.78)",
          transformOrigin: "left center",
        }}
      >
        <span style={{ color: "#000000" }}>ALL </span>
        <span style={{ color: "#FF4500" }}>SIGNAL</span>
      </div>

      {/* ── 2. "ALL SIGNAL" — tablet 768–1023px ── */}
      <div
        aria-hidden
        className="hidden md:block lg:hidden"
        style={{
          position: "absolute",
          top: "8%",
          left: "28%",
          zIndex: 2,
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          fontFamily: "var(--font-headline)",
          fontWeight: 700,
          fontSize: "clamp(5rem, 11vw, 10rem)",
          lineHeight: 0.78,
          letterSpacing: "-0.07em",
          textTransform: "uppercase",
          transform: "scaleX(0.78)",
          transformOrigin: "left center",
        }}
      >
        <span style={{ color: "#000000" }}>ALL </span>
        <span style={{ color: "#FF4500" }}>SIGNAL</span>
      </div>

      {/* ── 2. "ALL SIGNAL" — mobile — HIDDEN (clutters headline on small screens) ── */}

      {/* ── 3. Portrait — desktop >= 1024px ── */}
      <div
        className="hidden lg:block"
        style={{
          position: "absolute",
          bottom: "-3%",
          left: "50%",
          transform: "translateX(-54%)",
          width: "72vw",
          maxWidth: "1080px",
          height: "104vh",
          maxHeight: "1160px",
          zIndex: 3,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src={`${ASSET}/portrait/hero-portrait-audiojones-desktop-transparent.png`}
            alt="Audio Jones"
            fill
            priority
            className="object-contain object-bottom"
            sizes="(max-width: 1280px) 72vw, 1080px"
          />
        </div>
      </div>

      {/* ── 3. Portrait — tablet 768–1023px (desktop asset, adjusted size) ── */}
      <div
        className="hidden md:block lg:hidden"
        style={{
          position: "absolute",
          bottom: 0,
          left: "54%",
          transform: "translateX(-50%)",
          width: "50vw",
          maxWidth: "520px",
          height: "78vh",
          maxHeight: "700px",
          zIndex: 3,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src={`${ASSET}/portrait/hero-portrait-audiojones-desktop-transparent.png`}
            alt="Audio Jones"
            fill
            priority
            className="object-contain object-bottom"
            sizes="50vw"
          />
        </div>
      </div>

      {/* ── 4. Metrics strip — desktop >= 1024px ──
           NOTE: display value MUST stay in className (hidden lg:flex), NOT in style.
           An inline display:flex would override the hidden class on mobile. ── */}
      <div
        className="hidden lg:flex"
        style={{
          position: "absolute",
          right: "3.5rem",
          bottom: "10%",
          zIndex: 6,
          alignItems: "center",
          gap: "0",
          background: "rgba(8, 10, 20, 0.92)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "10px",
          padding: "14px 20px",
          backdropFilter: "blur(8px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        {METRICS.map((m, i) => (
          <div
            key={m.label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "3px",
              padding: "0 18px",
              borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.10)" : "none",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "22px",
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "#FF4500",
              }}
            >
              {m.dir}&thinsp;{m.pct}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {m.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── 5. Left content block — desktop >= 1024px ── */}
      <div
        className="hidden lg:flex"
        style={{
          position: "absolute",
          top: "16%",
          left: "3.5rem",
          width: "35vw",
          maxWidth: "520px",
          zIndex: 9,
          flexDirection: "column",
          gap: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#C8A96A",
            marginBottom: "20px",
            display: "block",
          }}
        >
          Applied Intelligence Systems
        </span>

        <h1
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(2.4rem, 3.8vw, 4.4rem)",
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          You don&apos;t have<br />an AI problem.
          <br />
          <span style={{ color: "#FF4500" }}>
            You have a<br />signal problem.
          </span>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-accent)",
            fontSize: "17px",
            fontWeight: 500,
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.72)",
            marginTop: "20px",
            maxWidth: "42ch",
          }}
        >
          I help founder-led businesses identify what actually
          creates outcomes and build systems to scale it.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "12px",
            marginTop: "28px",
          }}
        >
          <ButtonLink href="/applied-intelligence/diagnostic" variant="glow">
            Book Your Diagnostic
          </ButtonLink>
          <ButtonLink href="#system-model" variant="system-glow">
            See the System
          </ButtonLink>
        </div>

        {/* Sub-label */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)",
            marginTop: "32px",
          }}
        >
          ↓ Data to Decisions &nbsp;·&nbsp; Clarity creates leverage.
        </p>
      </div>

      {/* ── Mobile / tablet content block — stacked flow < 1024px ── */}
      <div
        className="flex lg:hidden flex-col"
        style={{
          position: "relative",
          zIndex: 9,
          padding: "96px 1.25rem 0",
          flex: 1,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#C8A96A",
            marginBottom: "16px",
            display: "block",
          }}
        >
          Applied Intelligence Systems
        </span>

        <h1
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(2.2rem, 8vw, 3.6rem)",
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            margin: 0,
            maxWidth: "16ch",
          }}
        >
          You don&apos;t have an AI problem.
          <br />
          <span style={{ color: "#FF4500" }}>You have a signal problem.</span>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-accent)",
            fontSize: "16px",
            fontWeight: 500,
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.72)",
            marginTop: "16px",
            maxWidth: "44ch",
          }}
        >
          I help founder-led businesses identify what actually
          creates outcomes and build systems to scale it.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "24px",
          }}
        >
          <ButtonLink href="/applied-intelligence/diagnostic" variant="glow">
            Book Your Diagnostic
          </ButtonLink>
          <ButtonLink href="#system-model" variant="system-glow">
            See the System
          </ButtonLink>
        </div>
      </div>

      {/* ── 3. Portrait — mobile < 768px ──
           NOTE: display value MUST stay in className (flex md:hidden), NOT in style.
           An inline display:flex would override the md:hidden class on tablet/desktop. ── */}
      <div
        className="flex justify-center md:hidden"
        style={{
          position: "relative",
          zIndex: 3,
          marginTop: "20px",
        }}
      >
        <Image
          src={`${ASSET}/portrait/hero-portrait-audiojones-mobile-transparent.png`}
          alt="Audio Jones"
          width={1200}
          height={1600}
          priority
          style={{
            width: "82vw",
            maxWidth: "420px",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>

      {/* ── 4. Metrics strip — mobile < 768px ── */}
      <div
        className="flex md:hidden"
        style={{
          position: "relative",
          zIndex: 6,
          background: "rgba(8, 10, 20, 0.92)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          justifyContent: "space-around",
          padding: "14px 12px",
          marginTop: "auto",
        }}
      >
        {METRICS.map((m) => (
          <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: "3px", textAlign: "center" }}>
            <span
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "#FF4500",
              }}
            >
              {m.dir}&thinsp;{m.pct}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "9px",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {m.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── 4. Metrics strip — tablet 768–1023px ── */}
      <div
        className="hidden md:flex lg:hidden"
        style={{
          position: "relative",
          zIndex: 6,
          background: "rgba(8, 10, 20, 0.85)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          justifyContent: "space-around",
          padding: "14px 2rem",
          marginTop: "auto",
        }}
      >
        {METRICS.map((m, i) => (
          <div
            key={m.label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "3px",
              textAlign: "center",
              padding: "0 16px",
              borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.1)" : "none",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "22px",
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "#FF4500",
              }}
            >
              {m.dir}&thinsp;{m.pct}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
