// Audio Jones canonical design tokens.
// Mirrors the brand-folder design system (`colors_and_type.css`)
// and the CSS variables exposed by `src/app/globals.css`.
// Update both together — keep in sync.

export const aiColors = {
  // Brand — V2 (Signal Yellow is the primary accent)
  orange: "#E8FF5A",
  orangeSoft: "#F0FF85",
  blue: "#4DACFF",
  blueBright: "#4DACFF",
  gold: "#E8FF5A",

  // V2 canonical accent text for `on-primary` surfaces (#E8FF5A bg).
  // White text on signal-yellow fails WCAG; use near-black instead.
  onPrimary: "#080808",

  // Surfaces — dark (V2 canonical)
  bg0: "#080808",
  bg1: "#0F0F0F",
  bg2: "#0F0F0F",
  bg3: "#161616",
  bg4: "#1A1A1A",

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

  // Text — dark (V2: #E8E8E8 primary, #666 muted)
  fg0: "#FFFFFF",
  fg1: "#E8E8E8",
  fg2: "#9A9A9A",
  fg3: "#666666",

  // Text — light (legacy aliases)
  fgLight0: "#111111",
  fgLight1: "#1E2A3A",
  fgLight2: "#4B5563",

  // Brand identity aliases — V2 (primary accent is Signal Yellow)
  orangePrimary: "#E8FF5A",
  blueSystem: "#4DACFF",
  darkPrimary: "#080808",
  darkSecondary: "#0F0F0F",

  // Borders
  line1: "rgba(255,255,255,0.06)",
  line2: "rgba(255,255,255,0.10)",
  line3: "rgba(255,255,255,0.18)",
  lineBlue: "rgba(77,172,255,0.40)",
  lineGold: "rgba(232,255,90,0.45)",

  // Semantic — V2
  signal: "#E8FF5A",
  system: "#4DACFF",
  metric: "#E8FF5A",
  success: "#3DFFB0",
  warning: "#FFB340",
  danger: "#FF4545",

  // Legacy aliases (kept until call sites migrate).
  // NOTE: `surface` is no longer aliased here — it conflicts with the
  // canonical light-split `surface` above (#F5F5F5). Old call sites
  // that wanted the dark card surface should use `bg2` ("#0F0F0F").
  background: "#080808",
  surfaceAlt: "#161616",
  primary: "#E8FF5A",
  primaryBright: "#E8FF5A",
  accent: "#E8FF5A",
  text: "#E8E8E8",
  muted: "#9A9A9A",
  border: "rgba(255,255,255,0.10)",
} as const;

export const aiFonts = {
  headline: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
  accent: '"Sora", ui-sans-serif, system-ui, sans-serif',
  body: '"Inter", ui-sans-serif, system-ui, sans-serif',
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
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
