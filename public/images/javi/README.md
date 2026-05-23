# Javi avatar asset

This directory hosts the avatar image used by the Javi AI Executive
Assistant widget (`src/components/javi/JaviChatWidget.tsx`).

Expected file: `avatar.png` (square, ≥ 256×256, transparent or
solid background — the widget masks to a circle).

The widget references `/images/javi/avatar.png`. If the file is
missing or fails to load, the launcher falls back to a typographic
initial ("J") inside a signal-yellow ring — the site does not break.

When updating, run `pnpm build` to confirm the asset is picked up by
the static optimizer.
