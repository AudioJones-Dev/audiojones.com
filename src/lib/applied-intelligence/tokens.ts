// Audio Jones canonical design tokens.
// Mirrors the brand-folder design system (`colors_and_type.css`)
// and the CSS variables exposed by `src/app/globals.css`.
// Update both together — keep in sync.

export const aiColors = {
  // Brand
  signalYellow: "#E8FF5A",
  signalSoft: "#F1FF8A",
  dataBlue: "#4DACFF",
  dataBlueSoft: "#8FCAFF",
  positiveGreen: "#3DFFB0",
  warningAmber: "#FFB340",
  criticalRed: "#FF4545",

  // Legacy aliases kept for older call sites; these now resolve to V2 tokens.
  orange: "#E8FF5A",
  orangeSoft: "#F1FF8A",
  blue: "#4DACFF",
  blueBright: "#4DACFF",
  gold: "#E8FF5A",

  // Surfaces — dark (canonical)
  bg0: "#080808",
  bg1: "#0F0F0F",
  bg2: "#161616",
  bg3: "#2A2A2A",
  bg4: "#353534",

  // Surfaces — light split (paired clarity layer, opt-in)
  paper: "#F8FAFC",
  surface: "#F5F5F5",
  surfaceSoft: "#EEF2F6",
  ink: "#111111",
  inkMuted: "#4B5563",
  borderLight: "rgba(17,17,17,0.10)",

  // Legacy aliases (deprecated — call sites migrating)
  bgLight0: "#F8FAFC",
  bgLight1: "#F5F5F5",
  bgLight2: "#EEF2F6",

  // Text — dark
  fg0: "#FFFFFF",
  fg1: "#E8E8E8",
  fg2: "#A1A1AA",
  fg3: "#666666",

  // Text — light (legacy aliases)
  fgLight0: "#111111",
  fgLight1: "#1E2A3A",
  fgLight2: "#4B5563",

  // Brand identity aliases (canonical names)
  orangePrimary: "#E8FF5A",
  blueSystem: "#4DACFF",
  darkPrimary: "#080808",
  darkSecondary: "#0F0F0F",

  // Borders
  line1: "rgba(255,255,255,0.06)",
  line2: "rgba(255,255,255,0.10)",
  line3: "rgba(255,255,255,0.18)",
  lineBlue: "rgba(77,172,255,0.40)",
  lineGold: "rgba(232,255,90,0.36)",

  // Semantic
  signal: "#E8FF5A",
  system: "#4DACFF",
  metric: "#E8FF5A",
  success: "#3DFFB0",
  warning: "#FFB340",
  danger: "#FF4545",

  // Legacy aliases (kept until call sites migrate).
  // NOTE: `surface` is no longer aliased here — it conflicts with the
  // canonical light-split `surface` above (#F5F5F5). Old call sites
  // that wanted the dark card surface should use `bg2` ("#0B1020").
  background: "#080808",
  surfaceAlt: "#161616",
  primary: "#4DACFF",
  primaryBright: "#4DACFF",
  accent: "#E8FF5A",
  text: "#FFFFFF",
  muted: "#A1A1AA",
  border: "rgba(255,255,255,0.10)",
} as const;

export const aiFonts = {
  headline: '"Syne", ui-sans-serif, system-ui, sans-serif',
  accent: '"Syne", ui-sans-serif, system-ui, sans-serif',
  body: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
  mono: '"DM Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
} as const;

export const aiMotion = {
  easeOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  durFast: "120ms",
  durBase: "180ms",
  durSlow: "320ms",
} as const;

export const aiEntity = {
  name: "Audio Jones",
  legalName: "Tyrone Alexander Nelms",
  brandName: "AJ Digital",
  title: "Applied Intelligence Systems Partner",
  description:
    "Audio Jones helps founder-led businesses reduce noise, identify causal growth signals, and build Applied Intelligence Systems.",
  url: "https://audiojones.com",
  sameAs: [
    "https://www.linkedin.com/in/audiojones",
    "https://www.youtube.com/@audiojones",
    "https://audiojones.com",
  ],
  knowsAbout: [
    "Applied Intelligence Systems",
    "AI Consulting",
    "Marketing Attribution",
    "Signal vs Noise",
    "Business Systems",
    "Founder-Led Businesses",
    "AEO",
    "SEO",
    "AI Augmentation",
    "Systems Thinking",
  ],
} as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://audiojones.com";

/**
 * Local-business facts for LocalBusiness / ProfessionalService JSON-LD.
 *
 * Service-area business: `address` is the verified registered address used
 * for Google Business Profile verification. The actual business does NOT
 * operate from a public storefront — clients are served remotely or on-site
 * at their location. Schema.org allows `address` for SAB; what governs
 * public visibility is the GBP "hide address from customers" toggle.
 *
 * Phone matches the canonical number on the Audio Jones GBP under
 * audiojones@ajdigital.app. Update both together if it ever changes.
 *
 * Geo coordinates are an approximate centroid of the registered address;
 * refine if you want sharper geographic ranking signal.
 */
export const aiLocalBusiness = {
  brandName: "Audio Jones",
  legalEntity: "AJ Digital LLC",
  founder: "Tyrone Alexander Nelms",
  telephone: "+1-954-613-9330",
  email: "audiojones@ajdigital.app",
  address: {
    streetAddress: "20028 NW 64th PL",
    addressLocality: "Hialeah",
    addressRegion: "FL",
    postalCode: "33015",
    addressCountry: "US",
  },
  geo: {
    latitude: 25.9485,
    longitude: -80.3275,
  },
  /** Service area cities + counties mirrored from the GBP listing. */
  areaServed: [
    { type: "City", name: "Miami", region: "FL" },
    { type: "City", name: "Hialeah", region: "FL" },
    { type: "City", name: "Fort Lauderdale", region: "FL" },
    { type: "City", name: "Hollywood", region: "FL" },
    { type: "City", name: "Pembroke Pines", region: "FL" },
    { type: "City", name: "Miramar", region: "FL" },
    { type: "City", name: "Miami Beach", region: "FL" },
    { type: "City", name: "Davie", region: "FL" },
    { type: "City", name: "Cooper City", region: "FL" },
    { type: "City", name: "Naples", region: "FL" },
    { type: "City", name: "Fort Myers", region: "FL" },
    { type: "AdministrativeArea", name: "Broward County", region: "FL" },
    { type: "AdministrativeArea", name: "Miami-Dade County", region: "FL" },
    { type: "Region", name: "South Florida", region: "FL" },
  ],
  /**
   * 24/7 availability is legitimate because the business operates an AI
   * receptionist that handles inbound calls/chats around the clock. If you
   * ever want to surface only your human-staffed hours, narrow this to
   * Mo-Fr 09:00-18:00 and add an "Online service hours" attribute on GBP.
   */
  openingHours: ["Mo-Su 00:00-23:59"],
  priceRange: "$$$",
  knowsAbout: [
    "Applied Intelligence Systems",
    "AI Consulting",
    "AI Automation",
    "Marketing Automation",
    "SEO Strategy",
    "AEO Strategy",
    "Founder Intelligence Systems",
    "Podcast Production",
    "Business Automation",
    "Conversion Optimization",
    "Funnel Strategy",
    "Analytics & Attribution",
    "Executive Reporting Systems",
  ],
} as const;
