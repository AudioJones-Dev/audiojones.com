import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { getPageById, getPageByRoute, getResourcesNavChildren } from "../src/content/journeys";
import { resourceLibrary, resourceThemes } from "../src/content/resources";
import { TOOLS } from "../src/content/tools";

const appDir = path.join(process.cwd(), "src", "app");
const pageFile = (route: string) => path.join(appDir, ...route.split("/").filter(Boolean), "page.tsx");

test("library cards mirror the registry's Resources Library group: same order, labels, and routes", () => {
  const group = getResourcesNavChildren().find((g) => g.label === "Library")!;
  assert.deepEqual(
    resourceLibrary.map((r) => [r.title, r.href]),
    group.items.map((i) => [i.label, i.href]),
  );
  assert.deepEqual(resourceLibrary.map((r) => r.href), ["/insights", "/frameworks", "/blog", "/workshops", "/case-studies"]);
  for (const r of resourceLibrary) {
    assert.ok(r.description.length > 0, `${r.pageId} has copy`);
    assert.ok(existsSync(pageFile(r.href)), `${r.href} exists`);
  }
});

test("theme cards name live registered pages and take their routes from the registry", () => {
  assert.equal(resourceThemes.length, 6);
  for (const t of resourceThemes) {
    const page = getPageById(t.pageId);
    assert.ok(page && page.status === "live", `${t.pageId} live`);
    assert.equal(t.href, page!.route);
    assert.ok(existsSync(pageFile(t.href)), `${t.href} exists`);
    assert.ok(!/utm_/.test(t.href));
  }
  assert.equal(new Set(resourceThemes.map((t) => t.href)).size, resourceThemes.length, "no duplicate theme routes");
  // Rendered links are registry edges (§7.4): every theme target is declared on the hub.
  const hub = getPageById("resources")!;
  const declared = new Set([...(hub.relatedPageIds ?? []), ...(hub.requiredOutboundTo ?? [])]);
  for (const t of resourceThemes) assert.ok(declared.has(t.pageId), `${t.pageId} is a declared edge of the resources hub`);
});

test("the hub page keeps no page-local catalog", () => {
  const src = readFileSync(path.join(appDir, "resources", "page.tsx"), "utf8");
  assert.ok(!/const RESOURCES|const THEMES/.test(src));
  for (const r of resourceLibrary) assert.ok(!src.includes(`"${r.description}"`), `${r.pageId} copy lives in the projection`);
});

test("every live tool page renders the registry breadcrumb trail back to Resources", () => {
  for (const tool of TOOLS.filter((t) => t.status === "live")) {
    const page = getPageByRoute(tool.href)!;
    assert.equal(page.parentId, "resources", `${tool.id} parent is resources`);
    const src = readFileSync(pageFile(tool.href), "utf8");
    assert.ok(src.includes(`<RegistryBreadcrumbs pageId="${page.id}" />`), `${tool.id} renders RegistryBreadcrumbs`);
    assert.ok(!src.includes("breadcrumbJsonLd("), `${tool.id} emits breadcrumb JSON-LD only through the registry trail`);
  }
});
