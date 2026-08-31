import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import { mainNav } from "@/config/nav";

// Primary nav imported from canonical source — same array Header consumes.
const PRIMARY_NAV = mainNav;

const LEGAL_NAV = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-of-service" },
  { label: "Cookies", href: "/cookie-policy" },
];

const SOCIAL = [
  // TODO: integration deferred — confirm canonical URLs before publishing.
  { label: "LinkedIn", href: "https://www.linkedin.com/in/audiojones" },
  { label: "YouTube", href: "https://www.youtube.com/@audiojones" },
  { label: "X", href: "https://x.com/audiojones" },
];

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-[var(--border-subtle)] bg-bg-base"
    >
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand block — V2 horizontal wordmark with tagline */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label="Audio Jones — home"
            >
              <Image
                src="/assets/logos/audiojones-wordmark-white.svg"
                alt="Audio Jones — Founder Intelligence Systems"
                width={220}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-6 max-w-md font-headline text-2xl font-extrabold tracking-[-0.02em] text-fg-0">
              All Signal. No Noise.
            </p>
            <p className="mt-4 max-w-md t-body text-fg-1">
              Founder Intelligence Systems for founder-led businesses.
            </p>
            <p className="mt-3 max-w-md t-small text-fg-3">
              Audio Jones is the operating brand of AJ Digital LLC. For founder-led service businesses carrying more demand signal than capacity to act on it.
            </p>
          </div>

          {/* Site nav */}
          <div className="lg:col-span-3">
            <h3 className="t-label">Site</h3>
            <ul className="mt-5 space-y-3">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  {item.href.startsWith("http") ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t-body text-fg-1 transition-colors hover:text-fg-0"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="t-body text-fg-1 transition-colors hover:text-fg-0"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-2">
            <h3 className="t-label">Connect</h3>
            <ul className="mt-5 space-y-3">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-body text-fg-1 transition-colors hover:text-fg-0"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h3 className="t-label">Legal</h3>
            <ul className="mt-5 space-y-3">
              {LEGAL_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="t-body text-fg-1 transition-colors hover:text-fg-0"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/sitemap.xml"
                  className="t-small text-fg-3 transition-colors hover:text-fg-0"
                >
                  Site map
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Newsletter row — compact inline variant ──
            Suspense required because <NewsletterForm> uses
            useSearchParams() (App Router constraint). */}
        <div className="mt-12 grid grid-cols-1 gap-4 border-t border-[var(--border-subtle)] pt-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <h3 className="t-label">Subscribe</h3>
            <p className="mt-3 t-small text-fg-2">
              The next signal in your inbox. Direct, framework-driven, no nurture drip.
            </p>
          </div>
          <div className="lg:col-span-7">
            <Suspense fallback={<FooterNewsletterSkeleton />}>
              <NewsletterForm
                variant="inline"
                source="footer"
                showPendingNotice={false}
              />
            </Suspense>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[var(--border-subtle)] pt-8 sm:flex-row sm:items-center">
          <p className="t-small text-fg-3">
            © {new Date().getFullYear()} AJ Digital LLC · Audio Jones · All rights reserved.
          </p>
          <p className="t-small text-fg-3 max-w-xl">
            Audio Jones provides strategic, operational, and systems
            implementation for informational and educational purposes. No
            specific financial, ranking, or operational result is guaranteed.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterNewsletterSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-2 opacity-50 sm:flex-row">
      <div className="h-11 flex-1 rounded-md bg-bg-2" />
      <div className="h-11 w-full rounded-md bg-bg-2 sm:w-32" />
    </div>
  );
}
