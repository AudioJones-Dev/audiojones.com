/**
 * consent.ts — Shared cookie-consent state for analytics and tracking.
 *
 * Mirrors the simple binary model used by CookieBanner:
 *   - Accept All → localStorage.cookie_consent = "true"  → analytics/pixel load
 *   - Decline    → localStorage.cookie_consent = "false" → analytics/pixel never load
 *   - Unset      → treated as not-yet-consented (false)
 *
 * Emits a `consent-changed` custom event when setConsent() is called so
 * Analytics.tsx components can react without a page reload.
 *
 * The useConsent() hook subscribes via useSyncExternalStore — the canonical
 * React 19 pattern for external stores. Avoids the setState-in-effect
 * anti-pattern that the react-hooks plugin flags.
 *
 * If/when the consent model becomes granular (separate analytics vs marketing
 * vs functional cookies), expand this file rather than scattering logic.
 */

"use client";

import { useSyncExternalStore } from "react";

export const CONSENT_KEY = "cookie_consent";
export const CONSENT_EVENT = "consent-changed";

/**
 * Read current consent from localStorage. SSR-safe (returns false on server).
 */
export function getConsent(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CONSENT_KEY) === "true";
}

/**
 * Persist consent + broadcast change to listeners (analytics components).
 * Use this from any consent UI (banner, settings page, etc.) instead of
 * calling localStorage directly so all subscribers stay in sync.
 */
export function setConsent(accepted: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, accepted ? "true" : "false");
  window.dispatchEvent(
    new CustomEvent(CONSENT_EVENT, { detail: { accepted } }),
  );
}

/**
 * Subscribe function for useSyncExternalStore. Listens to both the in-tab
 * custom event (fired by setConsent) and the cross-tab storage event so
 * consent stays consistent across multiple tabs/windows.
 */
function subscribeConsent(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handleStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_KEY) callback();
  };
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(CONSENT_EVENT, callback);
    window.removeEventListener("storage", handleStorage);
  };
}

/**
 * React hook — returns current consent state and re-renders on change.
 * Uses useSyncExternalStore for proper React 19 external-store semantics.
 * The server snapshot is `false` (no consent until proven otherwise) which
 * prevents flicker during hydration.
 */
export function useConsent(): boolean {
  return useSyncExternalStore(
    subscribeConsent,
    getConsent,
    () => false,
  );
}
