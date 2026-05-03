# ASSET MAP — 02-hero-all-signal

All assets for the homepage hero section. Organised by layer role.
Important: all live text (headline, ALL SIGNAL typography, CTAs, metrics) must remain in code — never baked into background images.

---

## Hero Background — Desktop

File: `backgrounds/hero-bg-split-dark-light-system-desktop.png`
Size: 970 KB

Role: Desktop hero base background with dark noise field on the left and clean system diagram field on the right.

Usage: Atmospheric background layer only. Do not bake headline, ALL SIGNAL typography, portrait, CTAs, or metrics into this background.

Responsive note: Use only for desktop. Tablet and mobile background variants should be generated separately or handled with CSS if the desktop crop works.

Implementation note: Important text must remain live in code for SEO/AEO.

---

## Hero Background — Tablet

File: `backgrounds/hero-bg-split-dark-light-system-tablet.png`
Size: 1221 KB

Role: Tablet hero base background — dark-to-light gradient field with system diagram inset, portrait orientation crop.

Usage: Atmospheric background layer only. Same content rules as desktop — no live text baked in.

Responsive note: Use at `md` breakpoint (`hidden lg:block` or equivalent). Do not use on mobile.

Implementation note: Important text must remain live in code for SEO/AEO.

---

## Hero Background — Mobile

File: `backgrounds/hero-bg-split-dark-light-system-mobile.png`
Size: 1291.3 KB

Role: Mobile hero base background — full portrait dark-to-light gradient field with system diagram inset at bottom.

Usage: Atmospheric background layer only. Same content rules as desktop — no live text baked in.

Responsive note: Use at `sm`/`base` breakpoint (`block md:hidden`). System diagram icon cluster sits in lower third.

Implementation note: Important text must remain live in code for SEO/AEO.

---

## Portrait — Desktop

File: `portrait/portraithero-portrait-audiojones-transparent.png`

Role: Transparent cutout portrait, desktop size.

---

## Portrait — Tablet

File: `portrait/portraithero-portrait-tablet-audiojones-transparent.png.png`

Role: Transparent cutout portrait, tablet size.

---

## Portrait — Mobile

File: `portrait/portraithero-portrait-audiojones-mobile-transparent.png.png`

Role: Transparent cutout portrait, mobile size.

---

## Noise Layer — Desktop Left

File: `noise-layer/hero-noise-left-dense-transparent.png.png`

Role: Dense pixel noise field overlaid on the left/dark side of the hero for texture.

---

## Noise Layer — Tablet Left

File: `noise-layer/hero-noise-left-dense-tablet-transparent.png`

Role: Tablet-sized noise layer, left field.

---

## Noise Layer — Mobile Left

File: `noise-layer/hero-noise-left-dense-mobile-transparent.png`

Role: Mobile-sized noise layer, left field.

---

## Noise Layer — Desktop Center Transition

File: `noise-layer/hero-noise-transition-center-transparent.png.png`

Role: Center transition noise that blends the dark noise field into the light right panel.

---

## System Diagram — Desktop

File: `system-diagram/hero-system-diagram-transparent.png.png`

Role: Applied Intelligence loop icon cluster (Input → Process → Output → Feedback), desktop size.

---

## System Diagram — Tablet

File: `system-diagram/hero-system-diagram-tablet-transparent.png.png`

Role: System diagram, tablet size.

---

## System Diagram — Mobile

File: `system-diagram/hero-system-diagram-mobile-transparent.png.png`

Role: System diagram, mobile size.
