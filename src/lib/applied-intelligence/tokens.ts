// Audio Jones canonical design tokens — Brand Guidelines 2.0 (May 2026).
// Mirrors `src/app/globals.css` (`:root` block) and `docs/DESIGN.md`
// (Color tokens table). The CI guard `pnpm check:design-tokens` will
// fail if any of these three drift. Keep them in lockstep.

export const aiColors = {
  // V2 canonical palette (Brand 2.0 §02)
  signalYellow: "#E8FF5A",
  signalSoft: "#F0FF85",
  bgBase: "#080808",
  surface1: "#0F0F0F",
  surface2: "#161616",
  borderStrong: "#2A2A2A",
  borderSubtle: "#1E1E1E",
  textPrimary: "#E8E8E8",
  textMuted: "#666666",

  accentBlue: "#4DACFF",
  accentRed: "#FF4545",
  accentAmber: "#FFB340",
  accentGreen: "#3DFFB0",

  // Legacy aliases — retargeted to V2 values so existing call sites
  // (~300 references to `aj-orange`, `bg-0`, etc.) pick up V2 without
  // per-file edits. Do not reintroduce the V1 hex values.
  ajOrange: "#E8FF5A",       // V1 was #FF4500 — now signal yellow
  ajOrangeSoft: "#F0FF85",   // V1 was #FF6A30
  ajBlue: "#4DACFF",         // V1 was #0088CC
  ajBlueBright: "#4DACFF",   // V1 was #3B5BFF
  ajGold: "#E8FF5A",         // V1 was #C8A96A — eyebrows now signal yellow per V2 §07

  // Surfaces — dark (V2 default)
  bg0: "#080808",
  bg1: "#0F0F0F",
  bg2: "#0F0F0F",
  bg3: "#161616",
  bg4: "#1A1A1A",

  // Surfaces — light split (opt-in clarity layer via `.surface-light`)
  paper: "#F8FAFC",
  surface: "#F5F5F5",
  surfaceSoft: "#EEF2F6",
  ink: "#111111",
  inkMuted: "#4B5563",
  borderLight: "rgba(17,17,17,0.10)",

  // Text — dark (V2: #E8E8E8 primary, #666 muted)
  fg0: "#FFFFFF",
  fg1: "#E8E8E8",
  fg2: "#9A9A9A",
  fg3: "#666666",

  // Text — light
  fgLight0: "#111111",
  fgLight1: "#1F1F1F",
  fgLight2: "#4B5563",

  // Brand identity aliases
  orangePrimary: "#E8FF5A",
  blueSystem: "#4DACFF",
  darkPrimary: "#080808",
  darkSecondary: "#0F0F0F",

  // Borders
  line1: "rgba(255,255,255,0.06)",
  line2: "#1E1E1E",
  line3: "#2A2A2A",
  lineBlue: "rgba(77,172,255,0.40)",
  lineGold: "rgba(232,255,90,0.45)",
  lineSignal: "rgba(232,255,90,0.45)",

  // Semantic
  signal: "#E8FF5A",
  system: "#4DACFF",
  metric: "#E8FF5A",
  success: "#3DFFB0",
  warning: "#FFB340",
  danger: "#FF4545",
} as const;

export const aiFonts = {
  headline: '"Syne", "Space Grotesk", ui-sans-serif, system-ui, sans-serif',
  accent: '"Syne", "Space Grotesk", ui-sans-serif, system-ui, sans-serif',
  body: '"DM Sans", "Inter", ui-sans-serif, system-ui, sans-serif',
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
