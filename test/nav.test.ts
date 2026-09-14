import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { mainNav } from "../src/config/nav";
import { getFooterNavigation, getPageByRoute } from "../src/content/journeys";
import { TOOLS } from "../src/content/tools";

const appDir = path.join(process.cwd(), "src", "app");
const routeExists = (route: string) =>
  existsSync(path.join(appDir, ...route.split("/").filter(Boolean), "page.tsx"));

test("Solutions and Resources carry derived children; every child is a live registered route", () => {
  const withChildren = mainNav.filter((i) => i.children?.length);
  assert.deepEqual(
    withChildren.map((i) => i.label),
    ["Solutions", "Resources"],
  );
  for (const item of withChildren) {
    for (const child of item.children!) {
      const page = getPageByRoute(child.href);
      assert.ok(page, `${child.href} registered`);
      assert.equal(page!.status, "live", `${child.href} live`);
      assert.ok(routeExists(child.href), `${child.href} exists`);
      assert.notEqual(child.href, item.href, "parent is not repeated as a child");
    }
    // Grouped and flat views describe the same destination set.
    const grouped = item.groups!.flatMap((g) => g.items.map((i) => i.href)).sort();
    assert.deepEqual(item.children!.map((c) => c.href).sort(), grouped);
    assert.equal(new Set(grouped).size, grouped.length, `${item.label}: no duplicate children`);
  }
});

test("Resources dropdown groups every live tool by kind and hides planned tools", () => {
  const resources = mainNav.find((i) => i.href === "/resources")!;
  const byGroup = Object.fromEntries(resources.groups!.map((g) => [g.label, g.items.map((i) => i.href)]));
  assert.deepEqual(byGroup.Diagnostics.sort(), ["/ai-readiness-diagnostic", "/founder-gravity-audit"]);
  assert.deepEqual(byGroup.Calculators, ["/roi-calculator"]);
  assert.deepEqual(byGroup.Library, ["/insights", "/frameworks", "/blog", "/workshops", "/case-studies"]);
  for (const t of TOOLS.filter((t) => t.status === "planned")) {
    assert.ok(!resources.children!.some((c) => c.href === t.href), `${t.id} hidden`);
  }
});

test("Solutions dropdown surfaces only the two live canonical system pages; no family hub yet", () => {
  const solutions = mainNav.find((i) => i.href === "/solutions")!;
  assert.deepEqual(
    solutions.groups!.map((g) => g.label),
    ["Featured Systems"],
  );
  assert.deepEqual(solutions.children!.map((c) => c.href).sort(), ["/agents/responseos", "/founder-intelligence"]);
  assert.ok(!solutions.children!.some((c) => c.href.startsWith("/solutions/")), "no /solutions/* until live");
});

test("footer projection lists only live existing routes and keeps the group order", () => {
  const groups = getFooterNavigation();
  assert.deepEqual(
    groups.map((g) => g.label),
    ["Solutions", "Resources", "Diagnostics", "Calculators", "Company", "Legal"],
  );
  for (const g of groups) for (const i of g.items) assert.ok(routeExists(i.href), `${i.href} exists`);
  const company = groups.find((g) => g.label === "Company")!.items.map((i) => i.href);
  assert.deepEqual(company, ["/about", "/pricing", "/book-a-call"]);
});
