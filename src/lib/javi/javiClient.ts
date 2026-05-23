/**
 * Javi V1 — client seam.
 *
 * Today: routes through `getMockJaviResponse` so the website widget
 * can ship as a brand proof-of-concept without an assistant backend.
 *
 * Tomorrow: swap the body for a `fetch` to the Javi assistant
 * (`AudioJones-Dev/Audio-Jones-Executive-Assistant-Javi`) — likely
 * proxied through a Next.js route at `/api/javi/chat` so the
 * widget never sees `JAVI_API_KEY`.
 *
 *   audiojones.com widget → /api/javi/chat → Javi assistant backend
 *
 * Keep the `sendJaviMessage(message)` signature stable; the widget
 * imports this module by name.
 */

import { getMockJaviResponse, type JaviResponse } from "./mockJaviResponses";

export type { JaviResponse } from "./mockJaviResponses";

export async function sendJaviMessage(message: string): Promise<JaviResponse> {
  // TODO(javi-backend): when JAVI_API_URL is wired, replace the body below
  // with a fetch to `/api/javi/chat` (server route that injects JAVI_API_KEY).
  // The widget contract must not change.
  return Promise.resolve(getMockJaviResponse(message));
}
