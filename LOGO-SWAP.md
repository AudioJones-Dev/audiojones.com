# Logo Swap Procedure

When production SVG files are delivered from the designer:

1. Replace `/public/logo-dark.svg`
2. Replace `/public/logo-light.svg`
3. Replace `/public/logo-icon.svg`
4. Replace `/public/logo-horizontal.svg`
5. Run `pnpm build` to confirm no path errors
6. Update `/public/favicon.svg`, `favicon.ico`, and `apple-touch-icon.png`
7. Test all four variants render at 32px, 128px, 512px

## How the system is wired

- The single source of truth is `src/components/ui/Logo.tsx`. It exports a
  `<Logo variant="dark|light|icon|horizontal" />` component that today renders
  the placeholder marks inline so the page works during the design phase.
- The header (`src/components/Header.tsx`) uses `variant="dark"`.
- The footer (`src/components/Footer.tsx`) uses `variant="horizontal"`.
- `Logo.tsx` also exports `productionAsset`, a `Record<LogoVariant, string>`
  that maps each variant to its `/logo-*.svg` path. When production files
  are dropped in, swap the inline SVG branches in `Logo.tsx` for
  `<Image src={productionAsset[variant]} … />` — one line per variant.

## Brand color reference (V2)

| Token         | Value     | Where                                |
|---------------|-----------|--------------------------------------|
| Signal yellow | `#E8FF5A` | mark fill, accents, primary CTA      |
| Near-black    | `#080808` | page background, dark surfaces       |
| Off-white     | `#F4F4F4` | light surfaces, light-variant text   |

## Files this swap touches

- `/public/logo-dark.svg`
- `/public/logo-light.svg`
- `/public/logo-icon.svg`
- `/public/logo-horizontal.svg`
- `/public/favicon.svg`
- `/public/favicon.ico`
- `/public/apple-touch-icon.png`
- `/public/android-chrome-192x192.png`
- `/public/android-chrome-512x512.png`
- `/public/site.webmanifest` — `theme_color` / `background_color` must be `#080808`
- `src/app/layout.tsx` — `viewport.themeColor` must be `#080808`

## OG / social share image

The OG image referenced from `src/lib/site.ts` (`/assets/og/audio-jones-og.jpg`)
should be regenerated to use the V2 palette: `#080808` background with
`#E8FF5A` accent. Dimensions: 1200×630.

## Verification checklist

- [ ] Each variant renders correctly at 32, 128, and 512 px heights
- [ ] Dark variant has sufficient contrast on `#080808` surface
- [ ] Light variant has sufficient contrast on `#F4F4F4` surface
- [ ] Icon variant is legible at favicon size (16–32 px)
- [ ] No broken `<Image>` references in `pnpm build`
- [ ] `manifest` `theme_color` and layout `viewport.themeColor` both `#080808`
- [ ] OG image uses signal yellow on near-black background
