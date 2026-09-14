import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import sitemap from "../src/app/sitemap";
import { getPageByRoute, JOURNEY_PAGES } from "../src/content/journeys";
import { TOOLS } from "../src/content/tools";
import { siteConfig } from "../src/lib/site";
import { SITE_URL } from "../src/lib/founder-intelligence/tokens";

const appDir = path.join(process.cwd(), "src", "app");
const base = siteConfig.url;

function pageFile(route: string): string {
  return route === "/"
    ? path.join(appDir, "page.tsx")
    : path.join(appDir, ...route.split("/").filter(Boolean), "page.tsx");
}

function routeOf(url: string): string {
  assert.ok(url.startsWith(base), `${url} is under the site origin`);
  const rest = url.slice(base.length);
  return rest === "" ? "/" : rest;
}

test("sitemap origin equals the metadata canonical origin (§10.12 equality holds across origins too)", () => {
  assert.equal(siteConfig.url, SITE_URL);
});

test("the homepage sitemap URL carries the trailing slash its canonical declares", async () => {
  const { entries } = await loaded;
  assert.ok(entries.some((e) => e.url === `${base}/`), "root URL is base + slash");
  assert.ok(!entries.some((e) => e.url === base), "bare origin is not listed");
});

// Blog posts need Sanity; the test runs against the registry projection only.
delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const loaded = sitemap().then((entries) => ({ entries, routes: entries.map((e) => routeOf(e.url)) }));

test("sitemap has no duplicate URLs and every URL is canonical, absolute, and query-free", async () => {
  const { entries, routes } = await loaded;
  assert.equal(new Set(routes).size, routes.length);
  for (const r of routes) {
    assert.ok(!r.includes("?") && !r.includes("#"), `${r} carries no query or fragment`);
    assert.ok(r === "/" || !r.endsWith("/"), `${r} has no trailing slash`);
  }
});

test("every sitemap route exists in src/app and is a live, indexable, sitemap-eligible registry page", async () => {
  const { entries, routes } = await loaded;
  for (const r of routes) {
    assert.ok(existsSync(pageFile(r)), `${r} exists`);
    const page = getPageByRoute(r);
    assert.ok(page, `${r} registered`);
    assert.equal(page!.status, "live", `${r} live`);
    assert.equal(page!.indexable, true, `${r} indexable`);
    assert.equal(page!.sitemapEligible, true, `${r} eligible`);
    assert.ok(!page!.canonicalRoute || page!.canonicalRoute === r, `${r} is canonical`);
  }
});

test("no planned tool, noindex page, or excluded-by-default route leaks into the sitemap", async () => {
  const { entries, routes } = await loaded;
  for (const t of TOOLS.filter((t) => t.status === "planned")) {
    assert.ok(!routes.includes(t.href), `${t.id} excluded`);
  }
  for (const p of JOURNEY_PAGES.filter((p) => !p.indexable || !p.sitemapEligible || p.status !== "live")) {
    assert.ok(!routes.includes(p.route), `${p.route} excluded`);
  }
  for (const r of routes) {
    const src = readFileSync(pageFile(r), "utf8");
    assert.ok(!/index:\s*false/.test(src), `${r} does not declare noindex`);
  }
  for (const excluded of ["/apply", "/apply/thank-you", "/founder-intelligence/diagnostic", "/founder-gravity-audit/diagnostic", "/founder-gravity-audit/report", "/step-2"]) {
    assert.ok(!routes.includes(excluded), `${excluded} excluded`);
  }
});

test("lastModified is never a build-time stamp: absent unless a real content date is declared", async () => {
  const { entries, routes } = await loaded;
  const now = Date.now();
  for (const e of entries) {
    const page = getPageByRoute(routeOf(e.url))!;
    if (!page.updatedAt) {
      assert.equal(e.lastModified, undefined, `${e.url} has no lastModified`);
    } else {
      assert.ok(e.lastModified instanceof Date, `${e.url} carries a Date`);
      assert.equal((e.lastModified as Date).toISOString().slice(0, 10), page.updatedAt.slice(0, 10));
      assert.ok((e.lastModified as Date).getTime() < now - 60_000, `${e.url} date is not "now"`);
    }
  }
});

test("each sitemap page declares a self-referencing canonical that equals its sitemap URL", async () => {
  const { entries, routes } = await loaded;
  const missing: string[] = [];
  for (const r of routes) {
    const src = readFileSync(pageFile(r), "utf8");
    const literalPath = new RegExp(`path:\\s*"${escape(r)}"`);
    const constPath = new RegExp(`const PATH = "${escape(r)}"`) ;
    const canonicalLiteral = new RegExp("canonical:\\s*`\\$\\{siteConfig\\.url\\}" + escape(r) + "`");
    if (!literalPath.test(src) && !(constPath.test(src) && /path:\s*PATH/.test(src)) && !canonicalLiteral.test(src)) {
      missing.push(r);
    }
  }
  assert.deepEqual(missing, []);
});

test("every live, indexable, eligible registry page is in the sitemap (nothing silently dropped)", async () => {
  const { entries, routes } = await loaded;
  const expected = JOURNEY_PAGES.filter((p) => p.status === "live" && p.indexable && p.sitemapEligible).map((p) => p.route);
  assert.deepEqual([...routes].sort(), [...new Set(expected)].sort());
});

test("sitemap keeps the primary surfaces the previous hand-written list carried", async () => {
  const { entries, routes } = await loaded;
  for (const kept of ["/", "/solutions", "/resources", "/agents/responseos", "/roi-calculator", "/ai-readiness-diagnostic", "/founder-gravity-audit", "/founder-intelligence", "/pricing", "/insights", "/frameworks", "/blog", "/case-studies", "/workshops", "/services", "/agents", "/about", "/book-a-call"]) {
    assert.ok(routes.includes(kept), `${kept} kept`);
  }
  assert.ok(routes.includes("/insights/revenue-leak-diagnostic"));
  assert.ok(routes.includes("/frameworks/map-attribution"));
});

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
}
