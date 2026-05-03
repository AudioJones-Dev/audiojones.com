import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

// ─── Asset ───────────────────────────────────────────────────────────────────

const BG =
  "/assets/Homepage/08-who-this-is-for/backgrounds/who-this-is-for-bg-desktop.png";

// ─── Copy ────────────────────────────────────────────────────────────────────

const NOT_FOR = [
  "You want AI tools without building the system first",
  "You are chasing tactics over strategy",
  "You want automation before attribution",
  "You are not willing to examine what is broken",
  "You need a vendor — not a strategic partner",
];

const FOR_YOU = [
  "You operate a founder-led business between $250K–$5M",
  "You want causal clarity over vanity metrics",
  "You need better decision systems, not more dashboards",
  "You want AI to augment judgment, not replace it",
  "You are ready to build the system, not just the campaign",
];

// ─── Micro icons ─────────────────────────────────────────────────────────────

function CrossIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
      <path
        d="M1 1L7 7M7 1L1 7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="9" height="8" viewBox="0 0 9 8" fill="none" aria-hidden>
      <path
        d="M1 4L3.5 6.5L8 1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ICPFilterSection() {
  return (
    <section
      id="icp"
      className="relative overflow-hidden border-t border-[var(--line-2)] bg-[#05070F] py-24 sm:py-32"
    >
      {/* ── Background image ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <Image
          src={BG}
          alt=""
          fill
          className="object-cover object-center"
          style={{ opacity: 0.38 }}
          sizes="100vw"
        />
      </div>

      {/* ── Dark overlay ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(160deg, rgba(5,7,15,0.88) 0%, rgba(5,7,15,0.68) 50%, rgba(5,7,15,0.92) 100%)",
        }}
      />

      {/* ── Atmosphere: orange warmth (left / not-for zone) ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10"
        style={{
          top: "10%",
          left: "-8%",
          width: "52%",
          height: "80%",
          background:
            "radial-gradient(ellipse 70% 60% at 20% 50%, rgba(255,69,0,0.07), transparent 70%)",
        }}
      />

      {/* ── Atmosphere: blue emphasis (right / for-you zone) ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10"
        style={{
          top: "10%",
          right: "-8%",
          width: "52%",
          height: "80%",
          background:
            "radial-gradient(ellipse 70% 60% at 80% 50%, rgba(59,91,255,0.10), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* ── Header ── */}
        <div className="mb-14 max-w-2xl">
          <Eyebrow>Who This Is For</Eyebrow>

          {/* Signal-path rule */}
          <div
            aria-hidden
            className="mt-5 mb-5"
            style={{
              width: "48px",
              height: "1.5px",
              background:
                "linear-gradient(to right, #FF4500, rgba(255,69,0,0))",
              boxShadow: "0 0 6px 1px rgba(255,69,0,0.25)",
            }}
          />

          <h2 className="t-h1 text-balance">
            This is not for everyone.
          </h2>
          <p className="mt-5 t-lead text-fg-2">
            The diagnostic is designed for founder-led businesses that want
            clarity before complexity.
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

          {/* ── NOT FOR YOU ── muted, lower emphasis ── */}
          <article
            className="relative flex flex-col rounded-[var(--r-card)] p-8 sm:p-10"
            aria-label="Not for you if"
            style={{
              background:
                "linear-gradient(160deg, rgba(200,169,106,0.05) 0%, rgba(7,9,18,0.92) 100%)",
              border: "1px solid rgba(200,169,106,0.18)",
            }}
          >
            {/* Warm top-edge accent */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: "15%",
                right: "15%",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(200,169,106,0.35), transparent)",
              }}
            />

            <Eyebrow tone="muted">Not for you if</Eyebrow>

            <ul className="mt-6 flex flex-1 flex-col gap-4">
              {NOT_FOR.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  {/* ✕ badge */}
                  <span
                    aria-hidden
                    className="mt-[5px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                    style={{
                      border: "1px solid rgba(200,169,106,0.25)",
                      background: "rgba(200,169,106,0.06)",
                      color: "rgba(200,169,106,0.55)",
                    }}
                  >
                    <CrossIcon />
                  </span>
                  <span
                    className="t-small leading-[1.65]"
                    style={{ color: "var(--fg-3)" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          {/* ── FOR YOU ── active, blue emphasis ── */}
          <article
            className="relative flex flex-col rounded-[var(--r-card)] p-8 sm:p-10"
            aria-label="For you if"
            style={{
              background:
                "linear-gradient(160deg, rgba(59,91,255,0.09) 0%, rgba(7,9,18,0.94) 100%)",
              border: "1px solid rgba(59,91,255,0.40)",
              boxShadow:
                "0 0 56px -12px rgba(59,91,255,0.22), inset 0 0 0 1px rgba(59,91,255,0.06)",
            }}
          >
            {/* Blue top-edge accent */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: "10%",
                right: "10%",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(59,91,255,0.75), transparent)",
              }}
            />

            {/* Signal dot — top-right qualifier indicator */}
            <div
              aria-hidden
              className="absolute right-6 top-6"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              {/* Outer ring */}
              <span
                style={{
                  position: "absolute",
                  inset: "-4px",
                  borderRadius: "50%",
                  border: "1px solid rgba(59,91,255,0.20)",
                }}
              />
              {/* Inner dot */}
              <span
                style={{
                  display: "block",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#3B5BFF",
                  boxShadow: "0 0 10px 2px rgba(59,91,255,0.50)",
                }}
              />
            </div>

            <Eyebrow tone="blue">For you if</Eyebrow>

            <ul className="mt-6 flex flex-1 flex-col gap-4">
              {FOR_YOU.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  {/* ✓ badge */}
                  <span
                    aria-hidden
                    className="mt-[5px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                    style={{
                      border: "1px solid rgba(59,91,255,0.38)",
                      background: "rgba(59,91,255,0.10)",
                      color: "#8EA2FF",
                    }}
                  >
                    <CheckIcon />
                  </span>
                  <span className="t-small text-fg-1 leading-[1.65]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA — anchored at bottom, separated by subtle border */}
            <div
              className="mt-8 pt-6"
              style={{ borderTop: "1px solid rgba(59,91,255,0.16)" }}
            >
              {/* Qualifier micro-label */}
              <p
                className="mb-4"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(59,91,255,0.65)",
                }}
              >
                Apply for a diagnostic →
              </p>
              <ButtonLink
                href="/applied-intelligence/diagnostic"
                variant="glow"
              >
                Take the Diagnostic
              </ButtonLink>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
