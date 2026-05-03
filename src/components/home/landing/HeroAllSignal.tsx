import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

/**
 * HeroAllSignal — layered editorial-tech composition.
 *
 * Layer stack (bottom → top):
 *  1. Background PNG — dark noise left / clean system right (responsive)
 *  2. "ALL SIGNAL" live typography (behind portrait)
 *  3. Portrait transparent cutout (responsive)
 *  4. Metrics strip (live text, lower right)
 *  5. Left content block (headline / copy / CTAs)
 *
 * Asset path mapping:
 *  background desktop → backgrounds/hero-bg-split-dark-light-system-desktop.png
 *  background tablet  → backgrounds/hero-bg-split-dark-light-system-tablet.png
 *  background mobile  → backgrounds/hero-bg-split-dark-light-system-mobile.png
 *  portrait desktop   → portrait/portraithero-portrait-audiojones-transparent.png
 *  portrait tablet    → portrait/portraithero-portrait-tablet-audiojones-transparent.png.png
 *  portrait mobile    → portrait/portraithero-portrait-audiojones-mobile-transparent.png.png
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
      {/* ── 1. Background — mobile ── */}
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

      {/* ── 1. Background — tablet ── */}
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

      {/* ── 1. Background — desktop ── */}
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

      {/* ── 2. "ALL SIGNAL" live mega typography ── */}
      {/* Desktop: positioned right of center, behind portrait */}
      <div
        aria-hidden
        className="hidden lg:block"
        style={{
          position: "absolute",
          top: "18%",
          left: "34%",
          zIndex: 2,
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          lineHeight: 0.82,
          letterSpacing: "-0.045em",
          fontFamily: "var(--font-headline)",
          fontWeight: 700,
          fontSize: "clamp(5.5rem, 11.5vw, 14rem)",
        }}
      >
        <span style={{ color: "#000000", opacity: 0.80 }}>ALL </span>
        <span style={{ color: "#FF4500" }}>SIGNAL</span>
      </div>

      {/* Tablet ALL SIGNAL */}
      <div
        aria-hidden
        className="hidden md:block lg:hidden"
        style={{
          position: "absolute",
          top: "12%",
          left: "38%",
          zIndex: 2,
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          lineHeight: 0.82,
          letterSpacing: "-0.04em",
          fontFamily: "var(--font-headline)",
          fontWeight: 700,
          fontSize: "clamp(4rem, 9vw, 8rem)",
        }}
      >
        <span style={{ color: "#000000", opacity: 0.72 }}>ALL </span>
        <span style={{ color: "#FF4500" }}>SIGNAL</span>
      </div>

      {/* Mobile ALL SIGNAL — behind portrait, smaller */}
      <div
        aria-hidden
        className="block md:hidden"
        style={{
          position: "absolute",
          top: "24%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          lineHeight: 0.82,
          letterSpacing: "-0.04em",
          fontFamily: "var(--font-headline)",
          fontWeight: 700,
          fontSize: "clamp(3rem, 14vw, 5rem)",
        }}
      >
        <span style={{ color: "#111", opacity: 0.55 }}>ALL </span>
        <span style={{ color: "#FF4500", opacity: 0.65 }}>SIGNAL</span>
      </div>

      {/* ── 3. Portrait — desktop ── */}
      <div
        className="hidden lg:block"
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-52%)",
          width: "40vw",
          maxWidth: "600px",
          height: "90vh",
          maxHeight: "860px",
          zIndex: 3,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src={`${ASSET}/portrait/portraithero-portrait-audiojones-transparent.png`}
            alt="Audio Jones"
            fill
            priority
            className="object-contain object-bottom"
            sizes="(max-width: 1280px) 40vw, 600px"
          />
        </div>
      </div>

      {/* ── 3. Portrait — tablet ── */}
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
            src={`${ASSET}/portrait/portraithero-portrait-tablet-audiojones-transparent.png.png`}
            alt="Audio Jones"
            fill
            priority
            className="object-contain object-bottom"
            sizes="50vw"
          />
        </div>
      </div>

      {/* ── 4. Metrics strip — desktop (live text, dark card) ── */}
      <div
        className="hidden lg:block"
        style={{
          position: "absolute",
          right: "3.5rem",
          bottom: "10%",
          zIndex: 6,
          display: "flex",
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

      {/* ── 5. Left content block — desktop ── */}
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

      {/* ── Mobile / tablet content block (stacked flow) ── */}
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

      {/* ── Mobile portrait strip ── */}
      <div
        className="block md:hidden"
        style={{
          position: "relative",
          width: "100%",
          height: "52vw",
          maxHeight: "360px",
          marginTop: "24px",
          zIndex: 3,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src={`${ASSET}/portrait/portraithero-portrait-audiojones-mobile-transparent.png.png`}
            alt="Audio Jones"
            fill
            className="object-contain object-bottom"
            sizes="100vw"
          />
        </div>
      </div>

      {/* ── Mobile metrics strip (flow) ── */}
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

      {/* ── Tablet metrics strip (flow, below portrait) ── */}
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
