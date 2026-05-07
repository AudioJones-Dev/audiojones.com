/**
 * Centralized link configuration for Audio Jones platform
 * 
 * All portal URLs, booking CTAs, and external integrations should reference this file
 */

export const portalLinks = {
  client: "https://client.audiojones.com",
  clientLogin: "https://client.audiojones.com/login",
  admin: "https://admin.audiojones.com",
  adminLogin: "https://admin.audiojones.com/login",
  artistHub: "https://hub.audiojones.com", // Planned
} as const;

export const ctaLinks = {
  bookSession: "/book", // Internal booking page
  signalDiagnostic: "/applied-intelligence/diagnostic", // Canonical internal diagnostic flow
  viewServices: "/services", // Services catalog
  viewPricing: "/pricing", // Pricing page
  contactUs: "/contact", // Contact form (if exists)
} as const;

export const socialLinks = {
  twitter: "https://twitter.com/audiojones",
  linkedin: "https://linkedin.com/company/audio-jones",
  instagram: "https://instagram.com/audiojones",
  youtube: "https://youtube.com/@audiojones",
} as const;

export const externalIntegrations = {
  whop: {
    storefront: "https://whop.com/audiojones", // TODO: Replace with actual Whop URL
    checkoutBase: "https://whop.com/checkout", // TODO: Map product SKUs
  },
  stripe: {
    customerPortal: "https://billing.stripe.com/p/login", // TODO: Configure actual portal
  },
  mailerlite: {
    // No public URLs, only API integration
  },
} as const;

/**
 * Helper to build booking URL with optional service parameter
 */
export function getBookingUrl(serviceId?: string): string {
  const base = ctaLinks.bookSession;
  return serviceId ? `${base}?service=${serviceId}` : base;
}

/**
 * Helper to build client portal URL with optional deep link
 */
export function getClientPortalUrl(path?: string): string {
  return path ? `${portalLinks.client}${path}` : portalLinks.client;
}

/**
 * Helper to build admin portal URL with optional deep link
 */
export function getAdminPortalUrl(path?: string): string {
  return path ? `${portalLinks.admin}${path}` : portalLinks.admin;
}
