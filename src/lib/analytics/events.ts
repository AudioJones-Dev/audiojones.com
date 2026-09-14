// Analytics event dispatch.
//
// Pushes events into the GTM dataLayer and, if a direct GA4 gtag is present,
// fires there too. Dispatch is gated on consent and on the current path:
// nothing is queued before the visitor accepts cookies (GTM replays whatever
// is already in dataLayer when it loads, which would transmit a pre-consent
// event after the fact), and nothing fires on portal/admin surfaces. Every
// call is otherwise a no-op when no tag manager is loaded, so callers never
// need to guard. This replaces the previous dead `window.gtag` calls that
// could never fire because gtag.js was never loaded.

import { readAttribution } from "@/lib/analytics/attribution";
import { hasAnalyticsConsent, isAnalyticsExcludedPath } from "@/lib/analytics/consent";

type EventParams = Record<string, string | number | boolean | undefined | null>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

function canDispatch(): boolean {
  if (typeof window === "undefined") return false;
  if (!hasAnalyticsConsent()) return false;
  if (isAnalyticsExcludedPath(window.location.pathname)) return false;
  return true;
}

export function pushDataLayer(payload: Record<string, unknown>): void {
  if (!canDispatch()) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

/** Fire a named event to GTM (dataLayer) and GA4 (gtag) if either is present. */
export function trackEvent(event: string, params: EventParams = {}): void {
  if (!canDispatch()) return;
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null),
  );
  pushDataLayer({ event, ...clean });
  if (typeof window.gtag === "function") {
    window.gtag("event", event, clean);
  }
}

/**
 * Canonical lead-conversion event. Attaches the persisted attribution so the
 * conversion carries its acquisition source into GTM/GA and any pixel tags
 * wired through the container.
 */
export function trackLeadConversion(input: {
  formType: string;
  offer?: string;
  value?: number;
}): void {
  const attr = readAttribution();
  trackEvent("lead_submit", {
    form_type: input.formType,
    offer: input.offer,
    value: input.value,
    utm_source: attr?.utmSource,
    utm_medium: attr?.utmMedium,
    utm_campaign: attr?.utmCampaign,
    gclid: attr?.gclid,
    fbclid: attr?.fbclid,
    msclkid: attr?.msclkid,
  });
}
