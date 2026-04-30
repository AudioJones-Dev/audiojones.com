// Audio Jones canonical design tokens.
// Mirrors the brand-folder design system (`colors_and_type.css`)
// and the CSS variables exposed by `src/app/globals.css`.
// Update both together — keep in sync.

export const aiColors = {
  // Brand
  orange: "#FF4500",
  orangeSoft: "#FF6A30",
  blue: "#0088CC",
  blueBright: "#3B5BFF",
  gold: "#C8A96A",

  // Surfaces — dark (canonical)
  bg0: "#05070F",
  bg1: "#0B0F1A",
  bg2: "#0B1020",
  bg3: "#101827",
  bg4: "#1A2234",

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
  fg1: "#E5E7EB",
  fg2: "#94A3B8",
  fg3: "#64748B",

  // Text — light (legacy aliases)
  fgLight0: "#111111",
  fgLight1: "#1E2A3A",
  fgLight2: "#4B5563",

  // Brand identity aliases (canonical names)
  orangePrimary: "#FF4500",
  blueSystem: "#0088CC",
  darkPrimary: "#05070F",
  darkSecondary: "#0B0F1A",

  // Borders
  line1: "rgba(255,255,255,0.06)",
  line2: "rgba(255,255,255,0.10)",
  line3: "rgba(255,255,255,0.18)",
  lineBlue: "rgba(59,91,255,0.40)",
  lineGold: "rgba(200,169,106,0.40)",

  // Semantic
  signal: "#FF4500",
  system: "#3B5BFF",
  metric: "#C8A96A",
  success: "#22C55E",
  warning: "#FACC15",
  danger: "#EF4444",

  // Legacy aliases (kept until call sites migrate)
  background: "#05070F",
  surface: "#0B1020",
  surfaceAlt: "#101827",
  primary: "#3B5BFF",
  primaryBright: "#3B5BFF",
  accent: "#C8A96A",
  text: "#FFFFFF",
  muted: "#94A3B8",
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
