import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { getHmacSecret } from "./config";

/**
 * Verify a Fourthwall webhook signature.
 *
 * Fourthwall sends `X-Fourthwall-Hmac-SHA256: <base64>` where the value is the
 * base64-encoded HMAC-SHA256 of the *raw* request body using the shop's
 * webhook secret. Compute the same and compare in constant time.
 *
 * Returns false if the integration has no secret configured.
 */
export function verifyFourthwallSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = getHmacSecret();
  if (!secret || !signatureHeader) return false;

  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");

  // Constant-time compare; bail if lengths differ (timingSafeEqual throws otherwise).
  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
