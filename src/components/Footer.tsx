import Link from "next/link";
import Image from "next/image";

const PRIMARY_NAV = [
  { label: "AI", href: "/applied-intelligence" },
  { label: "Frameworks", href: "/frameworks" },
  { label: "Insights", href: "/insights" },
  { label: "Diagnostic", href: "/applied-intelligence/diagnostic" },
];

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
      className="border-t border-[var(--line-2)] bg-bg-0"
    >
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand block */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label="Audio Jones — home"
            >
              <Image
                src="/assets/logos/audiojones-workmark-white.png"
                alt=""
                width={160}
                height={32}
                className="h-7 w-auto"
              />
            </Link>
            <p className="mt-6 max-w-md t-lead text-fg-1">
              Applied Intelligence Systems for founder-led businesses.
            </p>
            <p className="mt-3 max-w-md t-small text-fg-3">
              Audio Jones is the operating brand of AJ Digital LLC. Founder-led businesses, $250K–$5M.
            </p>
          </div>

          {/* Site nav */}
          <div className="lg:col-span-3">
            <h3 className="t-label text-aj-gold">Site</h3>
            <ul className="mt-5 space-y-3">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="t-body text-fg-1 transition-colors hover:text-fg-0"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-2">
            <h3 className="t-label text-aj-gold">Connect</h3>
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
            <h3 className="t-label text-aj-gold">Legal</h3>
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

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[var(--line-2)] pt-8 sm:flex-row sm:items-center">
          <p className="t-small text-fg-3">
            © {new Date().getFullYear()} AJ Digital LLC · Audio Jones · All rights reserved.
          </p>
          <p className="t-small text-fg-3 max-w-xl">
            Audio Jones provides strategic, creative, and systems consulting for
            informational and educational purposes. No specific financial, ranking,
            or operational result is guaranteed.
          </p>
        </div>
      </div>
    </footer>
  );
}
