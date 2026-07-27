import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { ctaLinks } from "@/config/links";

/**
 * HeroAllSignal — editorial-tech composition on a white top-of-fold.
 *
 * Layer stack (bottom → top):
 *  1. White background (subtle signal-tint glow, no dark imagery)
 *  2. "ALL SIGNAL" watermark typography (behind portrait) — desktop + tablet
 *  3. Portrait transparent cutout (same asset across breakpoints)
 *  4. Content block (headline / copy / CTAs)
 *
 * On a white field every foreground text role flips to dark ink for
 * readability — signal-yellow is used as a highlighter behind dark ink.
 *
 * ⚠ IMPORTANT — inline style vs Tailwind visibility:
 *   Inline `display:` values override Tailwind's `hidden` / `md:hidden` /
 *   `lg:hidden` because inline styles have higher CSS specificity than
 *   class-based rules. All flex/block display values must go in className,
 *   NOT in style={{}}. style={{}} may only contain non-display properties.
 */

const ASSET = "/assets/Homepage/02-hero-all-signal";
const PORTRAIT = `${ASSET}/portrait/hero-portrait-eightee20-society.png`;

// On-white foreground ink roles.
const INK = "#0A0A0A";
const INK_SOFT = "rgba(10,10,10,0.66)";
const INK_FAINT = "rgba(10,10,10,0.34)";
const INK_LINE = "rgba(10,10,10,0.18)";
const SIGNAL = "#E8FF5A";

export default function HeroAllSignal() {
  return (
    <section
      id="hero"
      aria-label="Hero"
      style={{
        position: "relative",
        minHeight: "clamp(820px, calc(100vh - 40px), 1040px)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background:
          "radial-gradient(circle at 82% 16%, rgba(232,255,90,0.12), transparent 30%), #FFFFFF",
      }}
    >
      {/* ── 2. "ALL SIGNAL" watermark — desktop >= 1024px ──
           Monochrome ink watermark so it stays a texture, not competing
           text, on the white field. ── */}
      <div
        aria-hidden
        className="hidden lg:block"
        style={{
          position: "absolute",
          top: "11%",
          left: "38%",
          zIndex: 1,
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          fontFamily: "var(--font-headline)",
          fontWeight: 700,
          fontSize: "clamp(6.6rem, 11.2vw, 14.5rem)",
          lineHeight: 0.82,
          letterSpacing: "-0.065em",
          textTransform: "uppercase",
          transform: "scaleX(0.84)",
          transformOrigin: "left center",
        }}
      >
        <span style={{ color: "rgba(10,10,10,0.07)" }}>ALL </span>
        <span style={{ color: "rgba(10,10,10,0.13)" }}>SIGNAL</span>
      </div>

      {/* ── 2. "ALL SIGNAL" — tablet 768–1023px ── */}
      <div
        aria-hidden
        className="hidden md:block lg:hidden"
        style={{
          position: "absolute",
          top: "12%",
          left: "38%",
          zIndex: 1,
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          fontFamily: "var(--font-headline)",
          fontWeight: 700,
          fontSize: "clamp(3.8rem, 8vw, 7rem)",
          lineHeight: 0.82,
          letterSpacing: "-0.06em",
          textTransform: "uppercase",
          transform: "scaleX(0.84)",
          transformOrigin: "left center",
        }}
      >
        <span style={{ color: "rgba(10,10,10,0.07)" }}>ALL </span>
        <span style={{ color: "rgba(10,10,10,0.13)" }}>SIGNAL</span>
      </div>

      {/* ── 2. "ALL SIGNAL" — mobile — HIDDEN (clutters headline on small screens) ── */}

      {/* ── 3. Portrait — desktop >= 1024px ── */}
      <div
        className="hidden lg:block"
        style={{
          position: "absolute",
          bottom: "-8%",
          left: "51%",
          transform: "translateX(-55%)",
          width: "69vw",
          maxWidth: "1040px",
          height: "104vh",
          maxHeight: "1120px",
          zIndex: 3,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {/* Contact shadow — grounds the cutout on the white field. */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              bottom: "3%",
              transform: "translateX(-50%)",
              width: "44%",
              height: "90px",
              background:
                "radial-gradient(ellipse at center, rgba(8,8,12,0.22), rgba(8,8,12,0.10) 45%, transparent 72%)",
              filter: "blur(10px)",
              pointerEvents: "none",
            }}
          />
          <Image
            src={PORTRAIT}
            alt="Audio Jones"
            fill
            priority
            className="object-contain object-bottom"
            sizes="(max-width: 1280px) 72vw, 1080px"
          />
        </div>
      </div>

      {/* ── 3. Portrait — tablet 768–1023px (adjusted size) ── */}
      <div
        className="hidden md:block lg:hidden"
        style={{
          position: "absolute",
          bottom: "-3%",
          left: "54%",
          transform: "translateX(-50%)",
          width: "48vw",
          maxWidth: "520px",
          height: "78vh",
          maxHeight: "700px",
          zIndex: 3,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {/* Contact shadow — grounds the cutout on the white field. */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              bottom: "2%",
              transform: "translateX(-50%)",
              width: "50%",
              height: "54px",
              background:
                "radial-gradient(ellipse at center, rgba(8,8,12,0.20), rgba(8,8,12,0.09) 45%, transparent 72%)",
              filter: "blur(7px)",
              pointerEvents: "none",
            }}
          />
          <Image
            src={PORTRAIT}
            alt="Audio Jones"
            fill
            className="object-contain object-bottom"
            sizes="50vw"
          />
        </div>
      </div>

      {/* ── 4. Left content block — desktop >= 1024px ── */}
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
            color: INK,
            marginBottom: "20px",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            aria-hidden
            style={{
              width: "22px",
              height: "8px",
              background: SIGNAL,
              borderRadius: "2px",
              display: "inline-block",
            }}
          />
          Founder Intelligence for founder-led businesses
        </span>

        {/* Desktop heading — same content as the canonical mobile <h1>
            below, but emitted as role="heading" aria-level="1" so the
            DOM contains a single <h1> tag (mobile is the canonical one
            for SEO under mobile-first indexing). */}
        <div
          role="heading"
          aria-level={1}
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(2.4rem, 3.8vw, 4.4rem)",
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            color: INK,
            margin: 0,
          }}
        >
          You don&apos;t have <br />a growth problem.
          <br />
          <span
            style={{
              background: SIGNAL,
              color: INK,
              padding: "0.02em 0.18em",
              borderRadius: "2px",
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
            }}
          >
            You have a signal problem.
          </span>
        </div>

        <p
          style={{
            fontFamily: "var(--font-accent)",
            fontSize: "17px",
            fontWeight: 500,
            lineHeight: 1.55,
            color: INK_SOFT,
            marginTop: "20px",
            maxWidth: "42ch",
          }}
        >
          When follow-up breaks, decisions stay trapped in the founder&apos;s
          head, and reports cannot explain what to do next, adding more tools
          creates more noise. See what is actually happening before you
          automate it.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "18px",
            marginTop: "28px",
          }}
        >
          <ButtonLink href={ctaLinks.founderIntelligenceDiagnostic} variant="glow">
            Start the Founder Intelligence Diagnostic
          </ButtonLink>
          <a
            href="#diagnose-first"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: INK_SOFT,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              borderBottom: `1px solid ${INK_LINE}`,
              paddingBottom: "2px",
            }}
          >
            See how the diagnostic works <span aria-hidden>→</span>
          </a>
        </div>

        {/* Sub-label */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: INK_FAINT,
            marginTop: "32px",
          }}
        >
          ↓ See what is happening &nbsp;·&nbsp; Decide what to fix first.
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
            color: INK,
            marginBottom: "16px",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            aria-hidden
            style={{
              width: "20px",
              height: "8px",
              background: SIGNAL,
              borderRadius: "2px",
              display: "inline-block",
            }}
          />
          Founder Intelligence for founder-led businesses
        </span>

        <h1
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(2.2rem, 8vw, 3.6rem)",
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            color: INK,
            margin: 0,
            maxWidth: "16ch",
          }}
        >
          You don&apos;t have a growth problem.
          <br />
          <span
            style={{
              background: SIGNAL,
              color: INK,
              padding: "0.02em 0.18em",
              borderRadius: "2px",
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
            }}
          >
            You have a signal problem.
          </span>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-accent)",
            fontSize: "16px",
            fontWeight: 500,
            lineHeight: 1.55,
            color: INK_SOFT,
            marginTop: "16px",
            maxWidth: "44ch",
          }}
        >
          When follow-up breaks, decisions stay trapped in the founder&apos;s
          head, and reports cannot explain what to do next, adding more tools
          creates more noise. See what is actually happening before you
          automate it.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          <ButtonLink href={ctaLinks.founderIntelligenceDiagnostic} variant="glow">
            Start the Founder Intelligence Diagnostic
          </ButtonLink>
          <a
            href="#diagnose-first"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: INK_SOFT,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              borderBottom: `1px solid ${INK_LINE}`,
              paddingBottom: "2px",
            }}
          >
            See how the diagnostic works <span aria-hidden>→</span>
          </a>
        </div>
      </div>

      {/* ── 3. Portrait — mobile < 768px ──
           NOTE: display value MUST stay in className (flex md:hidden). ── */}
      <div
        className="flex justify-center md:hidden"
        style={{
          position: "relative",
          zIndex: 3,
          marginTop: "20px",
        }}
      >
        <div style={{ position: "relative" }}>
          {/* Contact shadow — grounds the cutout on the white field. */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              bottom: "6px",
              transform: "translateX(-50%)",
              width: "66%",
              height: "30px",
              background:
                "radial-gradient(ellipse at center, rgba(8,8,12,0.20), rgba(8,8,12,0.08) 45%, transparent 72%)",
              filter: "blur(6px)",
              pointerEvents: "none",
            }}
          />
          <Image
            src={PORTRAIT}
            alt="Audio Jones"
            width={1080}
            height={1350}
            priority
            style={{
              width: "82vw",
              maxWidth: "420px",
              height: "auto",
              objectFit: "contain",
              position: "relative",
            }}
          />
        </div>
      </div>

    </section>
  );
}
