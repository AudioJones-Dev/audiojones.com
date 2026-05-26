# Audio Jones — Brand Asset Library

Canonical brand mark files for Audio Jones / AJ Digital LLC.

## File inventory

| File | What it is | When to use |
|---|---|---|
| `audio-jones-icon.png` | Pure mark on dark background | Avatar, social icon, sticker, anywhere needing a square mark with controlled background |
| `audio-jones-icon-transparent.png` | Pure mark with transparent background | Placement over any background color; source for favicon generation |
| `audio-jones-logo.png` | Full lockup (mark + wordmark) on dark | Header on dark sections, deck cover, dark UI |
| `audio-jones-logo-transparent.png` | Full lockup with transparent background | Header that needs to sit on any background |
| `audio-jones-logo-tagline.png` | Full lockup with "Applied Intelligence Systems" tagline, dark bg | Brand-forward placements where the tagline is part of the message |
| `audio-jones-logo-tagline-transparent.png` | Tagline lockup, transparent | Same use as above but transparent for flexibility |

## Brand colors

| Color | Hex | Use |
|---|---|---|
| Signal chartreuse | `#C8FF1A` *(verify exact)* | Primary accent, mark color |
| Near-black background | `#0E1117` *(verify exact)* | Primary background, theme color |
| Wordmark white | `#FFFFFF` | Wordmark text on dark |

> **TODO:** Confirm exact hex codes from brand guidelines and update this table.

## Typography

- **Wordmark serif:** Likely Cormorant Garamond / Playfair Display family. Confirm and license.
- **Tagline mono:** Likely Space Mono / JetBrains Mono family. Confirm and license.

## Usage rules (placeholder — to formalize)

- Minimum clear space around mark: half the height of the mark on all sides
- Minimum size: 24px for the mark alone; 96px wide for full lockup
- Never recolor the chartreuse to other hues
- Never place the mark on backgrounds with insufficient contrast (test against your dark hex specifically)
- The mark-as-i-dot version is the strongest lockup — prefer it for the brand's most visible placements

## Where favicon files live (separate from this folder)

Generated favicon files from realfavicongenerator.net live at `/public/` root, NOT in this `/brand/` folder. The RFG-generated files at root:

- `favicon.ico`
- `favicon-16x16.png`, `favicon-32x32.png`
- `apple-touch-icon.png`
- `android-chrome-192x192.png`, `android-chrome-512x512.png`
- `favicon.svg` (if generated)
- `site.webmanifest`

This `/brand/` folder is the **source of truth for brand assets** used elsewhere on the site (headers, social cards, OG images, etc.).
