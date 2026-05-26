# Javi Widget — V1 (mock mode)

Audio Jones' AI Executive Assistant, embedded site-wide on
audiojones.com as a floating launcher.

The widget exists for two reasons at once:

1. **Operational.** Help visitors understand our systems, services,
   and route them to the diagnostic.
2. **Commercial proof-of-concept.** Demonstrate the kind of AI
   executive assistant Audio Jones builds for founder-led clients —
   the site is the brochure.

## What ships in V1

- `src/components/javi/JaviChatWidget.tsx` — floating launcher +
  dialog panel, mounted globally from `src/app/layout.tsx`.
- `src/lib/javi/mockJaviResponses.ts` — hard-coded response map keyed
  off suggestion ids and loose keyword matchers. Marketing-grade, not
  NLP.
- `src/lib/javi/javiClient.ts` — `sendJaviMessage(message)` seam. Today
  routes to the mock. Tomorrow, swap to `/api/javi/chat`.
- `public/images/javi/` — avatar asset directory. Drop `avatar.png`
  here; widget falls back to a typographic "J" if missing.

There is **no** assistant backend wired yet, **no** new env secrets,
and **no** new tracking.

## Future integration path

```text
audiojones.com widget → /api/javi/chat → Javi assistant backend
                        (server route,   (AudioJones-Dev/
                         injects key)     Audio-Jones-Executive-
                                          Assistant-Javi)
```

When the assistant repo exposes a stable chat endpoint, the change to
this site is small:

1. Add a server route at `src/app/api/javi/chat/route.ts` that reads
   `JAVI_API_URL` and `JAVI_API_KEY` from env and forwards the user
   message.
2. Replace the body of `sendJaviMessage` in
   `src/lib/javi/javiClient.ts` with a `fetch('/api/javi/chat', …)`.
3. Keep the `JaviResponse` shape (`text`, `followUps?`, `cta?`)
   compatible — the widget reads only these fields.

Planned env keys (do **not** add to `.env` yet):

```env
NEXT_PUBLIC_JAVI_WIDGET_ENABLED=true
JAVI_API_URL=
JAVI_API_KEY=
JAVI_ESCALATION_EMAIL=javi@audiojones.com
```

`NEXT_PUBLIC_JAVI_WIDGET_ENABLED` is the only one read today, and it
defaults to enabled — set `false` in Vercel to kill-switch without a
redeploy.

## Brand contract

- Dark surface (`bg-surface-1`), `border-strong` outlines.
- Signal-yellow `#E8FF5A` is the only primary accent (CTA buttons,
  send button, focus ring, avatar ring).
- Syne in the header / button label, DM Sans in body copy, DM Mono
  for the "AI EXECUTIVE ASSISTANT" eyebrow.
- All colors via tokens — no raw hexes inside the component.

## Route exclusions

The widget is **hidden** under operator surfaces, where a marketing
chatbot would be noise:

- `/portal/**`
- `/ops/**`
- `/uploader/**`
- `/status/**`

Add new prefixes in `HIDDEN_PATH_PREFIXES` at the top of
`JaviChatWidget.tsx`.

## Accessibility

- Launcher: `aria-label`, `aria-expanded`, `aria-controls`.
- Panel: `role="dialog"`, accessible label.
- Esc closes the panel and restores focus to the launcher.
- Input has a visually-hidden `<label>` plus `placeholder`.
- All interactive elements have visible focus rings.

## Not in scope (V1)

- Real LLM responses.
- Analytics / tracking.
- Lead capture form inside the chat (the CTA goes to the diagnostic).
- Mobile fullscreen mode — V1 uses a responsive popover that caps at
  the viewport width.
