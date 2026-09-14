import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { mainNav } from "../src/config/nav";
import {
  JOURNEY_PAGES,
  JOURNEYS,
  getFooterNavigation,
  getOfferDestination,
  getPageByRoute,
  getResourcesNavChildren,
  getSitemapRoutes,
  getSolutionsNavChildren,
  stripQuery,
} from "../src/content/journeys";
import { validateJourneyRegistry } from "../src/content/journeys/validate";
import { TOOLS } from "../src/content/tools";

const appDir = path.join(process.cwd(), "src", "app");

function routeExists(route: string): boolean {
  const clean = stripQuery(route);
  const dir = clean === "/" ? appDir : path.join(appDir, ...clean.split("/").filter(Boolean));
  return existsSync(path.join(dir, "page.tsx"));
}

test("journey registry passes reference and semantic validation", () => {
  assert.deepEqual(validateJourneyRegistry(), []);
});

test("every live page and every internal CTA destination resolves to a real route", () => {
  const missing: string[] = [];
  for (const p of JOURNEY_PAGES) {
    if (p.status === "live" && !routeExists(p.route)) missing.push(`${p.id}: ${p.route}`);
    for (const cta of [p.primaryCta, ...(p.secondaryCtas ?? [])]) {
      if (cta.destination.startsWith("/") && p.status === "live" && !routeExists(cta.destination)) {
        missing.push(`${p.id} cta ${cta.id}: ${cta.destination}`);
      }
    }
  }
  assert.deepEqual(missing, []);
});

test("planned pages point at routes that do not exist yet, and stay out of navigation", () => {
  const planned = JOURNEY_PAGES.filter((p) => p.status === "planned");
  assert.ok(planned.length >= 2, "the two planned tools are registered");
  for (const p of planned) {
    assert.equal(routeExists(p.route), false, `${p.id} route is unbuilt`);
  }
  const navHrefs = [
    ...getResourcesNavChildren(),
    ...getSolutionsNavChildren(),
    ...getFooterNavigation(),
  ].flatMap((g) => g.items.map((i) => i.href));
  for (const p of planned) assert.ok(!navHrefs.includes(p.route), `${p.id} hidden from nav`);
  for (const href of navHrefs) assert.ok(routeExists(href), `nav href ${href} exists`);
});

test("every live tool in the registry is discoverable from the Resources dropdown", () => {
  const hrefs = getResourcesNavChildren().flatMap((g) => g.items.map((i) => i.href));
  for (const t of TOOLS.filter((t) => t.status === "live")) {
    assert.ok(hrefs.includes(t.href), `${t.id} in Resources nav`);
  }
});

test("nav.ts top-level routes are registered live pages with matching labels", () => {
  for (const item of mainNav) {
    const page = getPageByRoute(item.href);
    assert.ok(page, `${item.href} registered`);
    assert.equal(page!.status, "live");
    assert.equal(page!.navLabel, item.label, `${item.href} label`);
  }
});

test("footer treats Diagnostics and Calculators as groups over live tool links", () => {
  const groups = getFooterNavigation();
  const byLabel = Object.fromEntries(groups.map((g) => [g.label, g.items.map((i) => i.href)]));
  assert.deepEqual(byLabel.Diagnostics.sort(), ["/ai-readiness-diagnostic", "/founder-gravity-audit"]);
  assert.deepEqual(byLabel.Calculators, ["/roi-calculator"]);
  assert.ok(!Object.values(byLabel).flat().includes("/resources/diagnostics"));
});

test("sitemap projection is canonical, live, indexable, deduplicated, and never stamps a fake date", () => {
  const routes = getSitemapRoutes();
  const seen = new Set<string>();
  for (const r of routes) {
    assert.ok(!seen.has(r.route), `duplicate ${r.route}`);
    seen.add(r.route);
    assert.ok(routeExists(r.route), `${r.route} exists`);
    const page = getPageByRoute(r.route)!;
    assert.equal(page.status, "live");
    assert.equal(page.indexable, true);
    assert.ok(r.lastModified === undefined || r.lastModified instanceof Date);
  }
  for (const excluded of ["/apply", "/apply/thank-you", "/founder-gravity-audit/report", "/step-2"]) {
    assert.ok(!seen.has(excluded), `${excluded} excluded`);
  }
});

test("offer destinations carry journey context and no acquisition UTMs", () => {
  const url = getOfferDestination("revenue-leak-assessment", {
    originPage: "/roi-calculator",
    ctaId: "roi-result-primary",
    source: "diagnostic",
  });
  assert.equal(
    url,
    "/apply?source=diagnostic&offer=revenue-leak-assessment&origin_page=%2Froi-calculator&cta_id=roi-result-primary",
  );
  assert.equal(
    getOfferDestination("ai-readiness-score", { originPage: "/pricing", ctaId: "x" }),
    "/ai-readiness-diagnostic?origin_page=%2Fpricing&cta_id=x",
  );
  assert.throws(() => getOfferDestination("no-such-offer", { originPage: "/", ctaId: "x" }));
});

test("every journey walks live pages in order", () => {
  for (const j of JOURNEYS) {
    for (const id of j.orderedPageIds) {
      const page = JOURNEY_PAGES.find((p) => p.id === id)!;
      assert.equal(page.status, "live", `${j.id} step ${id}`);
    }
  }
});
