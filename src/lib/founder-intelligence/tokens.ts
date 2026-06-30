// Audio Jones canonical design tokens.
// Mirrors the brand-folder design system (`colors_and_type.css`)
// and the CSS variables exposed by `src/app/globals.css`.
// Update both together — keep in sync.

export const aiColors = {
  // Portable Audio Jones design system.
  // `orange`/`gold` names are preserved as aliases for call sites that
  // haven't been renamed yet; they resolve to signal yellow.
  signal: "#E8FF5A",
  signalInk: "#080808",
  data: "#4DACFF",
  critical: "#FF4545",
  warning: "#FFB340",
  success: "#3DFFB0",

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
  bg4: "#1E1E1E",

  // Surfaces — light split (paired clarity layer, opt-in)
  paper: "#F4F1E9",
  surface: "#F4F1E9",
  surfaceSoft: "#ECE7DA",
  ink: "#080808",
  inkMuted: "#3F3A31",
  borderLight: "#D8D3C6",

  // Legacy aliases (deprecated — call sites migrating)
  bgLight0: "#F4F1E9",
  bgLight1: "#F4F1E9",
  bgLight2: "#ECE7DA",

  // Text — dark (canonical V2)
  fg0: "#F2F2F2",
  fg1: "#F2F2F2",
  fg2: "#A8A8A8",
  fg3: "#6E6E6E",

  // Text — light (legacy aliases)
  fgLight0: "#080808",
  fgLight1: "#080808",
  fgLight2: "#3F3A31",

  // Brand identity aliases (canonical names) — V2
  orangePrimary: "#E8FF5A",
  blueSystem: "#4DACFF",
  darkPrimary: "#080808",
  darkSecondary: "#0F0F0F",

  // Borders
  line1: "rgba(255,255,255,0.08)",
  line2: "#222222",
  line3: "#333333",
  lineBlue: "rgba(77,172,255,0.40)",
  lineGold: "rgba(232,255,90,0.40)",

  // Semantic — V2 canonical palette
  system: "#4DACFF",
  metric: "#E8FF5A",
  danger: "#FF4545",

  // Legacy aliases (kept until call sites migrate). All resolve to V2.
  // Old call sites that wanted the dark card surface should use `bg2`.
  background: "#080808",
  surfaceAlt: "#161616",
  primary: "#4DACFF",
  primaryBright: "#4DACFF",
  accent: "#E8FF5A",
  text: "#F2F2F2",
  muted: "#6E6E6E",
  border: "#222222",
} as const;

// V2 §03 — Syne for display/headers, DM Sans for body, DM Mono for
// eyebrows/labels. Mirrors the next/font variables wired in layout.tsx.
export const aiFonts = {
  headline: 'var(--font-syne, "Syne"), "DM Sans", ui-sans-serif, system-ui, sans-serif',
  accent: 'var(--font-syne, "Syne"), "DM Sans", ui-sans-serif, system-ui, sans-serif',
  body: 'var(--font-dm-sans, "DM Sans"), ui-sans-serif, system-ui, -apple-system, sans-serif',
  mono: 'var(--font-dm-mono, "DM Mono"), ui-monospace, "SFMono-Regular", Consolas, monospace',
} as const;

export const aiRadii = {
  none: "0",
  control: "4px",
  card: "8px",
  pill: "999px",
} as const;

export const aiContainers = {
  prose: "680px",
  app: "1280px",
  wide: "1440px",
  gutter: "24px",
} as const;

export const aiMotion = {
  easeOut: "cubic-bezier(0.2, 0, 0, 1)",
  easeInOut: "cubic-bezier(0.2, 0, 0, 1)",
  durFast: "120ms",
  durBase: "180ms",
  durSlow: "180ms",
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
