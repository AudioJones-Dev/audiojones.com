/**
 * Fourthwall configuration — reads environment variables.
 *
 * Publishable (safe in the browser / NEXT_PUBLIC_):
 *   - NEXT_PUBLIC_FOURTHWALL_STOREFRONT_TOKEN  (ptkn_… storefront read token)
 *   - NEXT_PUBLIC_FOURTHWALL_CHECKOUT_URL       (hosted-checkout base, e.g. https://store.fourthwall.com)
 *
 * Server-only (NEVER exposed to the client):
 *   - FOURTHWALL_API_USERNAME / FOURTHWALL_API_PASSWORD  (Basic auth, Admin API)
 *   - FOURTHWALL_HMAC_SECRET                              (webhook signature verification)
 *
 * All are optional: when unset, the storefront degrades gracefully (no
 * products / "store unavailable") and the webhook route returns 503.
 */

export const STOREFRONT_API_BASE = "https://storefront-api.fourthwall.com/v1";

export const fourthwallPublic = {
  storefrontToken: process.env.NEXT_PUBLIC_FOURTHWALL_STOREFRONT_TOKEN ?? "",
  checkoutUrl: (process.env.NEXT_PUBLIC_FOURTHWALL_CHECKOUT_URL ?? "").replace(/\/$/, ""),
};

/** Storefront browsing is available when a storefront token is present. */
export function isStorefrontConfigured(): boolean {
  return fourthwallPublic.storefrontToken.length > 0;
}

/** Server-only secret accessors. Importing this file is fine on the client —
 *  these getters just return "" there because the vars aren't NEXT_PUBLIC. */
export function getHmacSecret(): string {
  return process.env.FOURTHWALL_HMAC_SECRET ?? "";
}

export function getApiBasicAuthHeader(): string | null {
  const user = process.env.FOURTHWALL_API_USERNAME;
  const pass = process.env.FOURTHWALL_API_PASSWORD;
  if (!user || !pass) return null;
  return `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
}
