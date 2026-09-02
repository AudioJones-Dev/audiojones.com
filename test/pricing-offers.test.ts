import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { APPLY_OFFERS } from "../src/lib/apply/apply-schema";
import { OFFERS } from "../src/content/offers";
import {
  isPublishable,
  publicOffers,
  toPublicOffer,
  PUBLIC_OFFER_KEYS,
} from "../src/lib/offers/public-view";
import {
  implementationOffers,
  pricingFaqs,
  pricingOffers,
  pricingPolicy,
  pricingServicesJsonLd,
  providerUsagePolicy,
  registryOrderedOfferIds,
} from "../src/content/pricing";

const repoRoot = process.cwd();

function readSource(relativePath: string) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function readPublicSourceTree(relativeDir: string): string {
  const absoluteDir = path.join(repoRoot, relativeDir);
  return readdirSync(absoluteDir, { withFileTypes: true })
    .filter((entry) => !["portal", "api"].includes(entry.name))
    .map((entry) => {
      const relativePath = path.join(relativeDir, entry.name);
      return entry.isDirectory()
        ? readPublicSourceTree(relativePath)
        : /\.(ts|tsx)$/.test(entry.name)
          ? readSource(relativePath)
          : "";
    })
    .join("\n");
}

test("publishes the approved ten-offer ladder and starting prices", () => {
  assert.equal(pricingOffers.length, 10);
  assert.deepEqual(
    pricingOffers.map(({ name, price, priceDetails }) => ({ name, price, priceDetails })),
    [
      { name: "AI Readiness Score", price: "Free", priceDetails: undefined },
      { name: "Revenue Leak Assessment", price: "$1,997", priceDetails: undefined },
      {
        name: "ReKonr Revenue Recovery Diagnostic",
        price: "From $3,500",
        priceDetails: undefined,
      },
      {
        name: "Team AI Readiness Workshop",
        price: "From $2,500",
        priceDetails: undefined,
      },
      {
        name: "ResponseOS Managed Pilot",
        price: "From $8,500 implementation",
        priceDetails: ["From $1,500/month", "Provider usage separate"],
      },
      {
        name: "ResponseOS Core",
        price: "From $12,500 implementation",
        priceDetails: ["From $2,500/month", "Provider usage separate"],
      },
      {
        name: "Founder Intelligence System",
        price: "From $15,000",
        priceDetails: undefined,
      },
      {
        name: "Managed Intelligence",
        price: "From $2,500/month",
        priceDetails: undefined,
      },
      { name: "Worksie Reference Pilot", price: "Application only", priceDetails: undefined },
      { name: "Strategic Partnership", price: "Application only", priceDetails: undefined },
    ],
  );
});

test("removes the old public SaaS and performance-partnership language", () => {
  const publicSource = readPublicSourceTree("src/app");
  const oldMonthlyPrices = ["397", "797", "1,297"].map((amount) => `$${amount}/mo`);
  const retiredPartnership = ["Performance", "Partnership"].join(" ");
  const retiredPrimaryCategory = ["AI", "Receptionist", "System"].join(" ");

  for (const staleValue of [
    ...oldMonthlyPrices,
    ["$5,000", "$25,000+"].join("–"),
    "$2,000/mo",
    retiredPartnership,
    retiredPrimaryCategory,
  ]) {
    assert.equal(publicSource.includes(staleValue), false, `stale public value remains: ${staleValue}`);
  }

  assert.match(publicSource, /Revenue Recovery System/);
});

test("removes or relabels unsupported public performance claims", () => {
  const publicAppSource = readPublicSourceTree("src/app");
  const sharedProofSource = readSource("src/data/audiojones-design.ts");
  // HomeFAQ.tsx and CaseStudySection.tsx used to be audited here. Both were
  // orphaned component shells with no importers and were deleted in #214, so
  // the claims they carried are gone rather than relabelled.
  const auditedSource = `${publicAppSource}\n${sharedProofSource}`;
  const unsupportedClaims = [
    ["+", "38%"].join(""),
    ["<", "9 min"].join(""),
    ["$", "214K"].join(""),
    ["25", "x ROI"].join(""),
  ];

  for (const claim of unsupportedClaims) {
    assert.equal(auditedSource.includes(claim), false, `unsupported claim remains: ${claim}`);
  }

  // The shared proof strip states how the installed system behaves rather
  // than asserting measured outcomes. These are the labels that shipped
  // (#208, #226); the "Target KPI / Tracked outcome / Operational goal"
  // wording this test previously required was never published.
  assert.match(sharedProofSource, /One inbox/);
  assert.match(sharedProofSource, /On an SLA/);
  assert.match(sharedProofSource, /Cadence/);
});

test("keeps offer CTAs routable, contextual, and instrumented", () => {
  const requiredEvents = new Set([
    "pricing_assessment_cta",
    "pricing_rekonr_diagnostic_cta",
    "pricing_workshop_cta",
    "pricing_responseos_pilot_cta",
    "pricing_responseos_core_cta",
    "pricing_fis_cta",
    "pricing_managed_intelligence_cta",
    "pricing_worksie_pilot_cta",
    "pricing_strategic_partnership_cta",
  ]);
  const actualEvents = new Set(pricingOffers.map((offer) => offer.cta.eventName));

  assert.deepEqual(actualEvents, requiredEvents);

  for (const offer of pricingOffers) {
    const route = offer.cta.href.split(/[?#]/, 1)[0];
    assert.ok(route.startsWith("/"), `${offer.name} CTA must use a local route`);
    assert.ok(
      existsSync(path.join(repoRoot, "src", "app", route.slice(1), "page.tsx")),
      `${offer.name} CTA route does not resolve: ${route}`,
    );
    assert.match(offer.cta.href, /utm_content=/);
  }

  // Every /apply CTA must name the engagement it came from, and the id must be
  // one the form knows how to preselect. Without this the ten CTAs collapse
  // back into one undifferentiated destination.
  const applyOfferIds = new Set<string>(APPLY_OFFERS.map((offer) => offer.id));
  const seenOfferParams = new Set<string>();

  for (const offer of pricingOffers) {
    if (!offer.cta.href.startsWith("/apply")) continue;

    const params = new URLSearchParams(offer.cta.href.split("?")[1]);
    assert.equal(params.get("source"), "pricing", `${offer.name} must attribute to pricing`);

    const offerParam = params.get("offer");
    assert.equal(offerParam, offer.id, `${offer.name} must carry its own offer id`);
    assert.ok(applyOfferIds.has(offer.id), `${offer.name} is missing from APPLY_OFFERS`);
    assert.equal(seenOfferParams.has(offer.id), false, `duplicate offer param: ${offer.id}`);
    seenOfferParams.add(offer.id);
  }

  // The labels the form shows must be the names the pricing page advertised.
  for (const applyOffer of APPLY_OFFERS) {
    const source = pricingOffers.find((offer) => offer.id === applyOffer.id);
    if (!source) {
      assert.fail(`APPLY_OFFERS lists an offer the pricing ladder does not: ${applyOffer.id}`);
    }
    assert.equal(source.name, applyOffer.label, `label drift for ${applyOffer.id}`);
  }

  const responseOsPage = readSource("src/app/agents/responseos/page.tsx");
  assert.match(responseOsPage, /utm_source=responseos/);
  assert.match(responseOsPage, /utm_campaign=responseos-managed-service/);
  assert.equal(responseOsPage.includes("href={offer.cta.href}"), false);
});

test("keeps structured prices aligned and omits fake application or mixed prices", () => {
  const jsonLd = pricingServicesJsonLd();
  assert.equal(jsonLd.itemListElement.length, pricingOffers.length);

  for (const [index, offer] of pricingOffers.entries()) {
    const service = jsonLd.itemListElement[index].item;
    assert.equal(service.name, offer.name);
    assert.equal(service.description, offer.description);

    if (offer.schemaPrice) {
      const structuredOffer = "offers" in service ? service.offers : undefined;
      if (!structuredOffer) {
        assert.fail(`${offer.name} is missing its structured offer`);
      }
      assert.equal(structuredOffer.price, offer.schemaPrice.amount);
      assert.equal(structuredOffer.priceSpecification.price, offer.schemaPrice.amount);
    } else {
      assert.equal("offers" in service, false, `${offer.name} must not publish a fake price`);
    }
  }

  const applicationOnly = pricingOffers.filter((offer) => offer.price === "Application only");
  assert.equal(applicationOnly.length, 2);
  assert.ok(applicationOnly.every((offer) => offer.schemaPrice === undefined));
  assert.ok(implementationOffers.slice(0, 2).every((offer) => offer.schemaPrice === undefined));
});

test("publishes provider, diagnostic, FAQ, and modeled-price guardrails", () => {
  assert.match(providerUsagePolicy, /Voice, SMS, model, storage, telephony/);
  assert.match(pricingPolicy, /starting prices for defined scopes/);
  assert.equal(pricingFaqs.length, 14);

  const faqText = pricingFaqs.map(({ question, answer }) => `${question} ${answer}`).join("\n");
  assert.match(faqText, /No public self-service ResponseOS plan/);
  assert.match(faqText, /does not guarantee recovered revenue, ROI, or revenue improvement/);
  assert.match(faqText, /independently deliverable/);
  assert.match(faqText, /not automatically credited/);
  assert.match(faqText, /three comparable paid ReKonr engagements/);
  assert.match(faqText, /modeled starting prices being tested/);

  for (const responseOsOffer of implementationOffers.slice(0, 2)) {
    assert.ok(
      responseOsOffer.guardrails?.some((item) => item.includes("Diagnostic required")),
      `${responseOsOffer.name} must require diagnosis`,
    );
    assert.ok(responseOsOffer.priceDetails?.includes("Provider usage separate"));
  }
});

// Inverted from its original form, which required a `$500K–$5M+` band on
// these surfaces. AUDIOJONES_NICHE_VALIDATION_CORRECTIONS.md §5 retires hard
// ARR bands from public copy — the persona is qualified on signal-maturity
// criteria — and that retirement shipped in #228. The test now guards the
// retirement instead of the band.
test("publishes no revenue band on public qualification surfaces", () => {
  const currentIcpCopy = [
    readSource("src/components/Footer.tsx"),
    readSource("src/app/apply/page.tsx"),
    readSource("src/components/founder-intelligence/ICPFilter.tsx"),
    readSource("src/components/home/landing/ICPFilterSection.tsx"),
  ].join("\n");

  for (const band of ["$500K", "$250K", "ARR", "annual revenue"]) {
    assert.equal(
      currentIcpCopy.includes(band),
      false,
      `revenue-band framing remains on a public qualification surface: ${band}`,
    );
  }

  // Signal-maturity framing, plus the mandated wedge qualifier from §2.
  assert.match(currentIcpCopy, /founder-led service business/);
  assert.match(currentIcpCopy, /demand signal|inbound to diagnose/);
});

// ── Offer registry contract ────────────────────────────────────────────────
// `src/content/offers.ts` is the source; `src/content/pricing.ts` projects it.
// These guard the invariants that projection relies on.

test("registry order matches the order /pricing renders", () => {
  // pricingOffers is assembled section by section, so a record moved between
  // groups in the registry would silently reorder the page and the ItemList
  // JSON-LD positions with it.
  assert.deepEqual(
    pricingOffers.map((offer) => offer.id),
    registryOrderedOfferIds,
  );
});

test("registry ids and slugs are unique and stable", () => {
  const ids = OFFERS.map((offer) => offer.id);
  const slugs = OFFERS.map((offer) => offer.slug);
  assert.equal(new Set(ids).size, ids.length, "duplicate offer id in the registry");
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug in the registry");

  // Ids key APPLY_OFFERS and every pricing CTA's `offer=` param. A rename is a
  // funnel change, not a refactor.
  for (const offer of OFFERS) {
    assert.match(
      offer.id,
      /^[a-z0-9-]+$/,
      `offer id must stay url-safe and lowercase: ${offer.id}`,
    );
  }
});

test("an offer with its own page carries proof", () => {
  // The public-page qualification rule requires original proof per indexed
  // page. Every offer today is a card on /pricing with no `pagePath`, so this
  // is vacuously satisfied by design — it starts biting the moment an offer
  // gets a standalone route, which is exactly when the rule should apply.
  const withPages = OFFERS.filter((offer) => offer.pagePath !== undefined);
  for (const offer of withPages) {
    assert.ok(
      offer.proofAssetPaths.length > 0,
      `${offer.name} has a standalone page but no proof asset`,
    );
  }
  assert.equal(
    OFFERS.some((offer) => offer.indexable && offer.pagePath === undefined),
    false,
    "an offer cannot be indexable without a page to index",
  );
});

test("only approved visibility states reach a public surface", () => {
  // The gate is an allowlist, so a visibility state added later is withheld
  // until someone deliberately publishes it.
  for (const offer of OFFERS) {
    const publishable = isPublishable(offer);
    if (offer.pricing.visibility === "private-corridor" || offer.pricing.visibility === "internal-allocation") {
      assert.equal(publishable, false, `${offer.name} must not be publishable`);
    }
  }

  // Everything currently on /pricing is, by definition, already public.
  for (const offer of OFFERS) {
    assert.ok(
      isPublishable(offer),
      `${offer.name} renders on /pricing but is not publishable`,
    );
  }
});

test("every registry price display is reproduced verbatim on the page", () => {
  // Projection must not reformat, round, or normalise a price string.
  for (const offer of OFFERS) {
    const projected = pricingOffers.find((candidate) => candidate.id === offer.id);
    assert.ok(projected, `${offer.name} is missing from the pricing view`);
    assert.equal(projected.price, offer.pricing.display, `price drift for ${offer.id}`);
    assert.equal(projected.description, offer.summary, `summary drift for ${offer.id}`);
  }
});

test("the public projection is an enforced allowlist, not an intention", () => {
  const published = publicOffers();
  assert.equal(published.length, OFFERS.length, "every current offer is public");

  // A projected record may carry only reviewed keys. Adding one to
  // PUBLIC_OFFER_KEYS is the deliberate act of publishing a new field.
  for (const offer of published) {
    for (const key of Object.keys(offer)) {
      assert.ok(
        (PUBLIC_OFFER_KEYS as readonly string[]).includes(key),
        `unreviewed key reached the public projection: ${key}`,
      );
    }
  }
});

test("a new registry field must be triaged before it can be published", () => {
  // The allowlist protects the output; this protects the input. If someone adds
  // a field to a registry record, this fails and forces a decision about
  // whether it is public — rather than it silently sitting one spread away
  // from the feed.
  const reviewedRegistryKeys = new Set([
    "id",
    "slug",
    "name",
    "family",
    "stage",
    "pricingGroup",
    "summary",
    "scopeLabel",
    "scope",
    "bestFor",
    "guardrails",
    "pricing",
    "pagePath",
    "indexable",
    "cta",
    "featured",
    "prerequisiteOfferIds",
    "followOnOfferIds",
    "proofAssetPaths",
    "updatedAt",
  ]);

  const seen = new Set<string>();
  for (const offer of OFFERS) {
    for (const key of Object.keys(offer)) seen.add(key);
  }

  for (const key of seen) {
    assert.ok(
      reviewedRegistryKeys.has(key),
      `registry field "${key}" has not been triaged for publication — add it to ` +
        `reviewedRegistryKeys, and to PUBLIC_OFFER_KEYS only if it is public`,
    );
  }
});

test("no internal commercial metadata survives serialization", () => {
  // The end-to-end check: whatever a machine consumer would actually receive.
  const serialized = JSON.stringify(publicOffers());

  for (const marker of [
    "unratified",
    "evidenceStatus",
    "displayConvention",
    "internal-allocation",
    "private-corridor",
    "pricingGroup",
    "prerequisiteOfferIds",
    "followOnOfferIds",
    "proofAssetPaths",
    "guardrails",
  ]) {
    assert.equal(
      serialized.includes(marker),
      false,
      `internal field leaked into the public feed: ${marker}`,
    );
  }
});

test("withheld visibility states project to null", () => {
  // No registry record is non-public today, so exercise the gate directly
  // rather than waiting for the first private offer to prove it works.
  const [sample] = OFFERS;
  for (const visibility of ["private-corridor", "internal-allocation"] as const) {
    const withheld = {
      ...sample,
      pricing: { ...sample.pricing, visibility },
    };
    assert.equal(isPublishable(withheld), false, `${visibility} must not publish`);
    assert.equal(toPublicOffer(withheld), null, `${visibility} must project to null`);
  }
});

test("public offer urls resolve to a real surface", () => {
  for (const offer of publicOffers()) {
    assert.match(offer.url, /^https?:\/\//, `${offer.id} url must be absolute`);
    // Every offer is a /pricing card today, so each url is that page's anchor.
    assert.match(
      offer.url,
      new RegExp(`/pricing#${offer.id}$`),
      `${offer.id} url should anchor to its pricing card until it has a page`,
    );
  }
});
