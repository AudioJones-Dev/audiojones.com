import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  implementationOffers,
  pricingFaqs,
  pricingOffers,
  pricingPolicy,
  pricingServicesJsonLd,
  providerUsagePolicy,
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
