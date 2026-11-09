type GtagParams = Record<string, string | number | boolean | undefined>;

// Sends a GA4 event through gtag when it is loaded. gtag only exists after
// cookie consent (see GoogleAnalytics.tsx), so this is a no-op otherwise.
// Never pass personal data (names, emails, phone numbers) as params.
export function trackEvent(name: string, params: GtagParams = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", name, params);
}

// Lead conversion. Mark `generate_lead` as a key event in GA4.
export function trackLead(form: string) {
  trackEvent("generate_lead", { form });
}
