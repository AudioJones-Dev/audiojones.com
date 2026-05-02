import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

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

export default function ICPFilterSection() {
  return (
    <section
      id="icp"
      className="relative border-t border-[var(--line-2)] bg-bg-0 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-14 max-w-2xl">
          <Eyebrow>Who This Is For</Eyebrow>
          <h2 className="mt-4 t-h1 text-balance">
            This is not for everyone.
          </h2>
          <p className="mt-5 t-lead text-fg-2">
            The diagnostic is designed for founder-led businesses that want
            clarity before complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* NOT FOR — muted */}
          <article
            className="rounded-[var(--r-card)] border border-[var(--line-gold)] bg-bg-2 p-8 sm:p-10"
            aria-label="Not for you if"
          >
            <Eyebrow tone="muted">Not for you if</Eyebrow>
            <ul className="mt-6 flex flex-col gap-4">
              {NOT_FOR.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3"
                >
                  <span
                    aria-hidden
                    className="mt-[7px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[var(--line-gold)] text-fg-3"
                    style={{ fontSize: "9px" }}
                  >
                    ✕
                  </span>
                  <span className="t-small text-fg-2 leading-[1.6]">{item}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* FOR YOU — active, brighter */}
          <article
            className="rounded-[var(--r-card)] border border-[var(--line-blue)] bg-[rgba(59,91,255,0.05)] p-8 sm:p-10 relative"
            aria-label="For you if"
            style={{
              boxShadow: "0 0 48px -12px rgba(59,91,255,0.2)",
            }}
          >
            {/* Active indicator */}
            <div
              aria-hidden
              className="absolute top-6 right-6 h-2 w-2 rounded-full bg-aj-blue-bright"
              style={{ boxShadow: "0 0 8px 2px rgba(59,91,255,0.5)" }}
            />
            <Eyebrow tone="blue">For you if</Eyebrow>
            <ul className="mt-6 flex flex-col gap-4">
              {FOR_YOU.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3"
                >
                  <span
                    aria-hidden
                    className="mt-[7px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[var(--line-blue)] text-aj-blue-bright"
                    style={{ fontSize: "9px" }}
                  >
                    ✓
                  </span>
                  <span className="t-small text-fg-1 leading-[1.6]">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-[var(--line-blue)]">
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
