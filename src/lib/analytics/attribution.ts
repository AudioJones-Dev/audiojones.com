// First-party marketing attribution.
//
// Captures acquisition signals (utm_*, ad click identifiers, referrer) when a
// visitor arrives with them and persists them in a first-party cookie so they
// survive navigation to the lead forms. Without this, the funnel only saw utm
// params when the form lived on the exact landing URL, and internal links that
// append their own utm (e.g. /apply?utm_source=pricing&utm_medium=website)
// overwrote the real paid source. See docs audit 2026-09-12.
//
// Model: ranked first touch. Each arrival is scored — an ad click identifier
// (gclid/fbclid/msclkid) is authoritative, a genuine external campaign utm
// counts, and an internal or same-origin utm counts for nothing. The stored
// record is only replaced by a *stronger* signal, so the first real campaign
// is preserved, a later genuine ad click can still claim the visit, and an
// internal navigation can never clobber either.

export type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
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

// The site's own CTA links tag themselves utm_medium=website (offers.ts,
// agents/responseos). Those describe navigation, not acquisition.
const INTERNAL_MEDIUMS = new Set(["website", "internal"]);

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
    msclkid: get("msclkid"),
    referrer,
    landingPath,
    capturedAt: new Date().toISOString(),
  };
}

function sameOriginReferrer(): boolean {
  if (typeof document === "undefined" || !document.referrer) return false;
  try {
    return new URL(document.referrer).host === window.location.host;
  } catch {
    return false;
  }
}

/**
 * 2 — ad click identifier: an authoritative paid arrival.
 * 1 — genuine campaign utm from an external arrival.
 * 0 — nothing, or an internal / same-origin utm (never acquisition).
 */
function signalRank(a: Attribution | null, opts?: { internal?: boolean }): 0 | 1 | 2 {
  if (!a) return 0;
  if (a.gclid || a.fbclid || a.msclkid) return 2;
  if (!(a.utmSource || a.utmMedium || a.utmCampaign)) return 0;
  if (INTERNAL_MEDIUMS.has((a.utmMedium || "").toLowerCase())) return 0;
  if (opts?.internal) return 0;
  return 1;
}

/**
 * Capture attribution from the current URL. Safe to call on every navigation.
 * Writes only when the arrival carries a stronger signal than what is stored,
 * so internal links cannot erase a campaign and a real ad click can still
 * claim a visit that previously only had a utm.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  const incoming = paramsToAttribution(new URLSearchParams(window.location.search));
  const incomingRank = signalRank(incoming, { internal: sameOriginReferrer() });
  if (incomingRank === 0) return;
  if (signalRank(readCookie()) >= incomingRank) return;
  writeCookie(incoming);
}

/** The persisted attribution record, or null. */
export function readAttribution(): Attribution | null {
  return readCookie();
}

/**
 * UTM fields for a lead payload. Uses the persisted first-touch record as a
 * whole when one exists, otherwise the live URL (covers cookie-disabled
 * clients). Fields are never mixed across the two, so a stored campaign is
 * never paired with a different campaign's live parameters.
 */
export function getUtmForForm(): UtmFields {
  const stored = readCookie();
  const rec =
    stored ??
    (typeof window !== "undefined"
      ? paramsToAttribution(new URLSearchParams(window.location.search))
      : null);
  return {
    utmSource: rec?.utmSource,
    utmMedium: rec?.utmMedium,
    utmCampaign: rec?.utmCampaign,
    utmTerm: rec?.utmTerm,
    utmContent: rec?.utmContent,
  };
}
