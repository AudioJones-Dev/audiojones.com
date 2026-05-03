# ASSET MAP — 02-hero-all-signal

All assets for the homepage hero section. Organised by layer role.
Important: all live text (headline, ALL SIGNAL typography, CTAs, metrics) must remain in code — never baked into background images.

---

## Responsive Portrait Rules

CRITICAL: Each portrait must render at exactly one breakpoint. Never show more than one portrait at a given viewport.

| Breakpoint | Range | File | className |
|---|---|---|---|
| Mobile | < 768px | portrait/hero-portrait-audiojones-mobile-transparent.png | flex justify-center md:hidden |
| Tablet | 768-1023px | portrait/portraithero-portrait-audiojones-transparent.png (desktop fallback) | hidden md:block lg:hidden |
| Desktop | >= 1024px | portrait/portraithero-portrait-audiojones-transparent.png | hidden lg:block |

Display value rule: Never put display:flex or display:block in inline style={} on a portrait or metrics wrapper. Always put display in className. Inline styles override Tailwind responsive hidden/md:hidden/lg:hidden classes and will break responsive switching.

---

## Responsive Metrics Rules

| Breakpoint | className |
|---|---|
| Mobile < 768px | flex md:hidden |
| Tablet 768-1023px | hidden md:flex lg:hidden |
| Desktop >= 1024px | hidden lg:flex |

---

## Hero Background — Desktop

File: backgrounds/hero-bg-split-dark-light-system-desktop.png
Size: 970 KB
Role: Desktop hero base background with dark noise field on the left and clean system diagram field on the right.
Usage: Atmospheric background layer only. Do not bake headline, ALL SIGNAL typography, portrait, CTAs, or metrics into this background.
Responsive: hidden lg:block

---

## Hero Background — Tablet

File: backgrounds/hero-bg-split-dark-light-system-tablet.png
Size: 1221 KB
Role: Tablet hero base background.
Responsive: hidden md:block lg:hidden

---

## Hero Background — Mobile

File: backgrounds/hero-bg-split-dark-light-system-mobile.png
Size: 1291.3 KB
Role: Mobile hero base background.
Responsive: block md:hidden

---

## Portrait — Desktop

File: portrait/portraithero-portrait-audiojones-transparent.png
Size: 471 KB
Role: Transparent cutout portrait, desktop size. Also used as tablet fallback.
Usage: hidden lg:block — absolute positioned, large layered composition. Must not render on mobile.

---

## Portrait — Tablet (fallback to desktop asset)

No dedicated tablet portrait file exists. Desktop portrait is used at tablet breakpoint with reduced sizing:
  width: 50vw, maxWidth: 520px, height: 78vh, maxHeight: 700px
  className: hidden md:block lg:hidden
If a dedicated tablet portrait is produced, name it: portrait/hero-portrait-audiojones-tablet-transparent.png

---

## Portrait — Mobile (v3, current)

File: portrait/hero-portrait-audiojones-mobile-transparent.png
Source: audio-jones-portrait-mobile-png v3.png
Size: 393 KB
Dimensions: 1200x1600 (3:4 portrait ratio)
Version: v3 (current as of 2026-05-03)
Usage: flex justify-center md:hidden — explicit width=1200 height=1600, responsive style width:82vw maxWidth:420px height:auto.
Sits below CTAs in the mobile stacked flow. Must not render on tablet or desktop.

Archive:
  archive/hero-portrait-audiojones-mobile-transparent-20260503-140352.png — v2, replaced by v3

---

## Noise Layer — Desktop Left

File: noise-layer/hero-noise-left-dense-transparent.png.png
Role: Dense pixel noise field overlaid on the left/dark side of the hero for texture.

---

## Noise Layer — Tablet Left

File: noise-layer/hero-noise-left-dense-tablet-transparent.png
Role: Tablet-sized noise layer, left field.

---

## Noise Layer — Mobile Left

File: noise-layer/hero-noise-left-dense-mobile-transparent.png
Role: Mobile-sized noise layer, left field.

---

## Noise Layer — Desktop Center Transition

File: noise-layer/hero-noise-transition-center-transparent.png.png
Role: Center transition noise that blends the dark noise field into the light right panel.

---

## System Diagram — Desktop

File: system-diagram/hero-system-diagram-transparent.png.png
Role: Applied Intelligence loop icon cluster (Input -> Process -> Output -> Feedback), desktop size.

---

## System Diagram — Tablet

File: system-diagram/hero-system-diagram-tablet-transparent.png.png
Role: System diagram, tablet size.

---

## System Diagram — Mobile

File: system-diagram/hero-system-diagram-mobile-transparent.png.png
Role: System diagram, mobile size.
