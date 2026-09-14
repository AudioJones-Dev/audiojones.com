// Cookie-consent state shared by the analytics loader and event dispatch.
// The visitor's choice is the "cookie_consent" value written by CookieBanner.

export const CONSENT_EVENT = "aj:consent-changed";

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem("cookie_consent") === "true";
  } catch {
    return false;
  }
}

// Authenticated surfaces must never load marketing analytics or emit events:
// a GA page view on /portal/admin/customers/[email] would ship customer
// identifiers and admin navigation to a marketing tool.
const EXCLUDED_PREFIXES = ["/portal", "/ops", "/api"];

export function isAnalyticsExcludedPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return EXCLUDED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
