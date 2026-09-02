/**
 * Public projection of the offer registry.
 *
 * This is the only path by which registry records reach anything outside the
 * application: a future `/offers.json` endpoint, JSON-LD builders, and any
 * machine-readable feed. The registry itself holds commercial metadata that must
 * never be published — internal price corridors, unratified evidence status,
 * allocation-level records.
 *
 * Two rules this module exists to enforce:
 *
 * 1. **Filter at serialization, not at authoring.** A record mis-tagged upstream
 *    must fail closed here rather than rely on whoever wrote it having been
 *    careful.
 * 2. **Publish only what has been approved for publication.** Visibility is the
 *    gate; everything else is projection.
 */

import { OFFERS, type Offer, type OfferVisibility } from "@/content/offers";
import { SITE_URL } from "@/lib/founder-intelligence/tokens";

/**
 * Visibility states that may appear on a public surface. Anything not listed —
 * `private-corridor`, `internal-allocation`, and any state added later — is
 * withheld, because the check is an allowlist rather than a list of exclusions.
 */
const PUBLISHABLE: readonly OfferVisibility[] = [
  "public-fixed",
  "public-from",
  "public-scoped",
];

export function isPublishable(offer: Offer): boolean {
  return PUBLISHABLE.includes(offer.pricing.visibility);
}

/**
 * The shape published to machine consumers. Deliberately narrower than `Offer`:
 * no `evidenceStatus`, no internal corridor, no relationship ids that reveal
 * unannounced offers.
 */
export type PublicOffer = {
  id: string;
  name: string;
  summary: string;
  stage: Offer["stage"];
  family?: Offer["family"];
  price: string;
  priceDetails?: readonly string[];
  url: string;
  updatedAt: string;
};

/**
 * Projects a publishable record, or returns `null` for one that is not.
 *
 * **Allowlist by construction.** Every published field is named explicitly
 * rather than spread from the record, so a field added to `Offer` later is
 * withheld until someone deliberately publishes it here. The two failure modes
 * are not symmetric: omitting a field that should have been public is a visible
 * gap someone reports, whereas publishing an internal one — a price corridor, a
 * margin assumption, an unratified status — is silent and already distributed by
 * the time anyone notices. `PUBLIC_OFFER_KEYS` and the registry-key triage test
 * keep this honest rather than merely intended.
 */
export function toPublicOffer(offer: Offer): PublicOffer | null {
  if (!isPublishable(offer)) return null;

  return {
    id: offer.id,
    name: offer.name,
    summary: offer.summary,
    stage: offer.stage,
    ...(offer.family ? { family: offer.family } : {}),
    price: offer.pricing.display,
    ...(offer.pricing.details ? { priceDetails: offer.pricing.details } : {}),
    url: offer.pagePath
      ? `${SITE_URL}${offer.pagePath}`
      : `${SITE_URL}/pricing#${offer.id}`,
    updatedAt: offer.updatedAt,
  };
}

/**
 * The complete set of keys a `PublicOffer` may carry. Asserted in
 * `test/pricing-offers.test.ts` so the allowlist cannot widen by accident —
 * adding a key here is the deliberate act of publishing a new field.
 */
export const PUBLIC_OFFER_KEYS = [
  "family",
  "id",
  "name",
  "price",
  "priceDetails",
  "stage",
  "summary",
  "updatedAt",
  "url",
] as const;

/** Every publishable record, in registry order. */
export function publicOffers(): readonly PublicOffer[] {
  return OFFERS.map(toPublicOffer).filter(
    (offer): offer is PublicOffer => offer !== null,
  );
}
