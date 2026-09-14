import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { getOfferPublicRoute, getPageByRoute, stripQuery } from "../src/content/journeys";
import { OFFERS, offerById } from "../src/content/offers";
import { pricingOffers } from "../src/content/pricing";
import { advancedSolutions, solutionLadder, solutionStages, surfacedOfferIds } from "../src/content/solutions";

const appDir = path.join(process.cwd(), "src", "app");
const routeExists = (route: string) =>
  existsSync(path.join(appDir, ...stripQuery(route).split("#")[0].split("/").filter(Boolean), "page.tsx"));
const allCards = [...solutionStages.flatMap((s) => s.cards), ...advancedSolutions];

test("offer cards take their title from the registry and their destination from the public-route selector", () => {
  for (const card of allCards.filter((c) => c.kind === "offer")) {
    assert.equal(card.offerIds.length, 1);
    const offer = offerById(card.offerIds[0]);
    assert.ok(offer, `${card.offerIds[0]} is a registry offer`);
    assert.equal(card.title, offer!.name);
    const held = getPageByRoute(card.href);
    assert.ok(
      card.href === getOfferPublicRoute(offer!.id) || (held && held.status === "live"),
      `${offer!.id} lands on its public route or an explicit live hold page`,
    );
  }
});

test("system cards own only registry offers and link to the live page that owns them", () => {
  for (const card of allCards.filter((c) => c.kind === "system")) {
    assert.ok(card.offerIds.length >= 1);
    for (const id of card.offerIds) assert.ok(offerById(id), `${id} is a registry offer`);
    const page = getPageByRoute(card.href);
    assert.ok(page && page.status === "live", `${card.href} is a live registered page`);
  }
});

test("capability cards carry no offer identity and link to a live registered page", () => {
  for (const card of allCards.filter((c) => c.kind === "capability")) {
    assert.deepEqual(card.offerIds, []);
    const page = getPageByRoute(card.href);
    assert.ok(page && page.status === "live", `${card.href} is a live registered page`);
  }
});

test("every card destination exists, is canonical, and carries no acquisition UTMs", () => {
  for (const card of allCards) {
    assert.ok(routeExists(card.href), `${card.href} exists`);
    assert.ok(!/utm_/.test(card.href), `${card.href} has no utm_`);
    assert.ok(card.title.length > 0 && card.blurb.length > 0 && card.cta.length > 0);
  }
});

test("every /pricing anchor a card points at is a rendered pricing card", () => {
  const anchored = allCards.filter((c) => c.href.startsWith("/pricing#")).map((c) => c.href.split("#")[1]);
  assert.ok(anchored.length >= 1, "at least one card anchors into pricing");
  const rendered = new Set(pricingOffers.map((o) => o.id));
  for (const id of anchored) assert.ok(rendered.has(id), `${id} is rendered on /pricing`);
});

test("the Managed Intelligence card is held on the inquiry gateway while its label says Book a call", () => {
  const card = allCards.find((c) => c.offerIds[0] === "managed-intelligence")!;
  assert.equal(card.cta, "Book a call");
  assert.equal(card.href, "/book-a-call");
});

test("no surfaced offer is unpublishable, and every surfaced offer ID is unique to one card", () => {
  const ids = surfacedOfferIds();
  assert.equal(new Set(ids).size, ids.length, "each offer appears once");
  for (const id of ids) {
    const offer = OFFERS.find((o) => o.id === id)!;
    assert.ok(["public-fixed", "public-from", "public-scoped"].includes(offer.pricing.visibility), `${id} publishable`);
  }
});

test("the ladder and the two ResponseOS tiers are represented as ratified", () => {
  assert.deepEqual([...solutionLadder], ["Free", "Audit", "Blueprint", "Build", "Operate"]);
  const responseos = allCards.find((c) => c.kind === "system" && c.href === "/agents/responseos");
  assert.ok(responseos);
  assert.deepEqual([...responseos!.offerIds].sort(), ["responseos-core", "responseos-managed-pilot"]);
});

test("the page keeps no offer identity of its own: no page-local offer names or destinations", () => {
  const src = readFileSync(path.join(appDir, "solutions", "page.tsx"), "utf8");
  assert.ok(!/const STAGES|const ADVANCED|href: "/.test(src), "no page-local catalog");
  for (const offer of OFFERS) assert.ok(!src.includes(`"${offer.name}"`), `${offer.name} not restated in page.tsx`);
});

test("public-route selector prefers the owning solution page, then the offer route, then the pricing anchor", () => {
  assert.equal(getOfferPublicRoute("founder-intelligence-system"), "/founder-intelligence");
  assert.equal(getOfferPublicRoute("responseos-managed-pilot"), "/agents/responseos");
  assert.equal(getOfferPublicRoute("ai-readiness-score"), "/ai-readiness-diagnostic");
  assert.equal(getOfferPublicRoute("rekonr-revenue-recovery-diagnostic"), "/pricing#rekonr-revenue-recovery-diagnostic");
  assert.throws(() => getOfferPublicRoute("no-such-offer"));
});
