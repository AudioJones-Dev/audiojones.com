type GtagParams = Record<string, string | number | boolean | undefined>;

type GaWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  __ajGaQueue?: unknown[][];
};

const MAX_QUEUED = 50;

// Sends a GA4 event through gtag. gtag only exists after cookie consent
// (see GoogleAnalytics.tsx). If consent is already granted but gtag hasn't
// initialized yet (e.g. an event fired on mount), the event is queued and
// GoogleAnalytics flushes it right after gtag('config'). Without consent
// this is a no-op. Never pass personal data (names, emails, phone numbers).
export function trackEvent(name: string, params: GtagParams = {}) {
  if (typeof window === "undefined") return;
  const win = window as GaWindow;
  if (win.gtag) {
    win.gtag("event", name, params);
    return;
  }
  let consented = false;
  try {
    consented = localStorage.getItem("cookie_consent") === "true";
  } catch {
    consented = false;
  }
  if (!consented) return;
  const queue = (win.__ajGaQueue ??= []);
  if (queue.length < MAX_QUEUED) queue.push(["event", name, params]);
}

// Lead conversion. Mark `generate_lead` as a key event in GA4.
export function trackLead(form: string) {
  trackEvent("generate_lead", { form });
}
