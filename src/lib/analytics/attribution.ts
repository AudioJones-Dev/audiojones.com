// First-party marketing attribution.
//
// Captures acquisition signals (utm_*, gclid, fbclid, referrer) the first time
// a visitor arrives with them and persists them in a first-party cookie so they
// survive navigation to the lead forms. Without this, the funnel only saw utm
// params when the form lived on the exact landing URL, and internal links that
// append their own utm (e.g. /apply?utm_source=pricing) overwrote the real paid
// source. See docs audit 2026-09-12.
//
// Model: first-touch-paid. The stored record is only replaced when a *new*
// arrival itself carries a paid signal, so an internal navigation with a
// non-paid or synthetic utm cannot clobber the original campaign.

export type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landingPath?: string;
  capturedAt?: string;
};

export type UtmFields = Pick<
  Attribution,
  "utmSource" | "utmMedium" | "utmCampaign" | "utmTerm" | "utmContent"
>;

const COOKIE = "aj_attr";
const MAX_AGE_DAYS = 90;

function readCookie(): Attribution | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE}=`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.slice(COOKIE.length + 1))) as Attribution;
  } catch {
    return null;
  }
}

function writeCookie(value: Attribution): void {
  if (typeof document === "undefined") return;
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
  const encoded = encodeURIComponent(JSON.stringify(value));
  document.cookie = `${COOKIE}=${encoded}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function paramsToAttribution(params: URLSearchParams): Attribution {
  const get = (k: string) => params.get(k) || undefined;
  const referrer =
    typeof document !== "undefined" && document.referrer ? document.referrer : undefined;
  const landingPath =
    typeof window !== "undefined" ? window.location.pathname + window.location.search : undefined;
  return {
    utmSource: get("utm_source"),
    utmMedium: get("utm_medium"),
    utmCampaign: get("utm_campaign"),
    utmTerm: get("utm_term"),
    utmContent: get("utm_content"),
    gclid: get("gclid"),
    fbclid: get("fbclid"),
    referrer,
    landingPath,
    capturedAt: new Date().toISOString(),
  };
}

/** True if the record carries a real acquisition signal (paid or campaign). */
function hasPaidSignal(a: Attribution | null): boolean {
  if (!a) return false;
  return Boolean(a.utmSource || a.utmMedium || a.utmCampaign || a.gclid || a.fbclid);
}

/**
 * Capture attribution from the current URL. Safe to call on every navigation.
 * Writes only on first paid touch: it will not overwrite an existing paid
 * record, so internal links appending their own utm cannot erase the campaign.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  const incoming = paramsToAttribution(new URLSearchParams(window.location.search));
  if (!hasPaidSignal(incoming)) return; // nothing worth recording on this hop
  const existing = readCookie();
  if (hasPaidSignal(existing)) return; // first paid touch already recorded
  writeCookie(incoming);
}

/** The persisted attribution record, or null. */
export function readAttribution(): Attribution | null {
  return readCookie();
}

/**
 * UTM fields for a lead payload. Prefers the persisted first-touch record, then
 * falls back to the current URL (covers cookie-disabled clients). This is what
 * forms should submit instead of reading the live URL directly.
 */
export function getUtmForForm(): UtmFields {
  const stored = readCookie();
  const live =
    typeof window !== "undefined"
      ? paramsToAttribution(new URLSearchParams(window.location.search))
      : null;
  const pick = (k: keyof UtmFields) => stored?.[k] || live?.[k] || undefined;
  return {
    utmSource: pick("utmSource"),
    utmMedium: pick("utmMedium"),
    utmCampaign: pick("utmCampaign"),
    utmTerm: pick("utmTerm"),
    utmContent: pick("utmContent"),
  };
}
