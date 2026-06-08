// Audio Jones canonical design tokens.
// Mirrors the brand-folder design system (`colors_and_type.css`)
// and the CSS variables exposed by `src/app/globals.css`.
// Update both together — keep in sync.

export const aiColors = {
  // Brand — V2 (signal yellow primary, accent blue system).
  // `orange`/`gold` names are preserved as aliases for call sites that
  // haven't been renamed yet; in V2 they resolve to signal yellow.
  orange: "#E8FF5A",
  orangeSoft: "#F0FF85",
  blue: "#4DACFF",
  blueBright: "#4DACFF",
  gold: "#E8FF5A",

  // Surfaces — dark (canonical V2)
  bg0: "#080808",
  bg1: "#0F0F0F",
  bg2: "#0F0F0F",
  bg3: "#161616",
  bg4: "#161616",

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

  // Text — dark (canonical V2)
  fg0: "#FFFFFF",
  fg1: "#E8E8E8",
  fg2: "#666666",
  fg3: "#666666",

  // Text — light (legacy aliases)
  fgLight0: "#111111",
  fgLight1: "#1E2A3A",
  fgLight2: "#4B5563",

  // Brand identity aliases (canonical names) — V2
  orangePrimary: "#E8FF5A",
  blueSystem: "#4DACFF",
  darkPrimary: "#080808",
  darkSecondary: "#0F0F0F",

  // Borders
  line1: "rgba(255,255,255,0.06)",
  line2: "rgba(255,255,255,0.10)",
  line3: "rgba(255,255,255,0.18)",
  lineBlue: "rgba(77,172,255,0.40)",
  lineGold: "rgba(232,255,90,0.40)",

  // Semantic — V2 canonical palette
  signal: "#E8FF5A",
  system: "#4DACFF",
  metric: "#E8FF5A",
  success: "#3DFFB0",
  warning: "#FFB340",
  danger: "#FF4545",

  // Legacy aliases (kept until call sites migrate). All resolve to V2.
  // Old call sites that wanted the dark card surface should use `bg2`.
  background: "#080808",
  surfaceAlt: "#161616",
  primary: "#4DACFF",
  primaryBright: "#4DACFF",
  accent: "#E8FF5A",
  text: "#FFFFFF",
  muted: "#666666",
  border: "rgba(255,255,255,0.10)",
} as const;

// V2 §03 — Syne for display/headers, DM Sans for body, DM Mono for
// eyebrows/labels. Mirrors the next/font variables wired in layout.tsx.
export const aiFonts = {
  headline: 'var(--font-syne, "Syne"), "Space Grotesk", ui-sans-serif, system-ui, sans-serif',
  accent: 'var(--font-syne, "Syne"), "Space Grotesk", ui-sans-serif, system-ui, sans-serif',
  body: 'var(--font-dm-sans, "DM Sans"), ui-sans-serif, system-ui, sans-serif',
  mono: 'var(--font-dm-mono, "DM Mono"), ui-monospace, "SF Mono", Menlo, Consolas, monospace',
} as const;

export const aiMotion = {
  easeOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  durFast: "120ms",
  durBase: "180ms",
  durSlow: "320ms",
} as const;

function normalizeSiteUrl(url: string) {
  return url
    .replace(/^https:\/\/audiojones\.com\/?$/, "https://www.audiojones.com")
    .replace(/\/$/, "");
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.audiojones.com"
);

export const aiEntity = {
  name: "Audio Jones",
  legalName: "Tyrone Alexander Nelms",
  brandName: "AJ Digital",
  title: "Founder Intelligence Systems Partner",
  description:
    "Audio Jones helps founder-led businesses reduce noise, identify causal growth signals, and build Founder Intelligence Systems.",
  url: SITE_URL,
  sameAs: [
    "https://www.linkedin.com/in/audiojones",
    "https://www.youtube.com/@audiojones",
    SITE_URL,
  ],
  knowsAbout: [
    "Founder Intelligence Systems",
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
