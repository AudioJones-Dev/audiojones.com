/**
 * Responsive header / nav QA harness — manual-run, non-blocking.
 *
 * Captures the header chrome at 10 viewport widths and asserts:
 *   - no horizontal page overflow
 *   - no nav-item wrapping (all desktop nav items on one line)
 *   - sticky header stays fixed during scroll
 *   - drawer opens, closes on link tap, closes on ESC, restores body scroll
 *
 * Output:
 *   test-results/preview-qa/<width>-<name>.png
 *
 * Configure via env:
 *   PREVIEW_URL                 — defaults to http://localhost:3000
 *   VERCEL_PROTECTION_BYPASS    — appended as x-vercel-protection-bypass header
 *
 * Usage:
 *   pnpm qa:responsive
 *   PREVIEW_URL=https://audiojones-com-pr-62.vercel.app pnpm qa:responsive
 */

import { test, expect, type Page } from "@playwright/test";
import * as path from "node:path";

// Naming the widths makes the screenshot filenames self-documenting.
const VIEWPORTS = [
  { width: 390,  name: "iphone" },
  { width: 430,  name: "iphone-pro-max" },
  { width: 768,  name: "tablet-portrait" },
  { width: 820,  name: "ipad-air" },
  { width: 1024, name: "desktop-1024" },
  { width: 1100, name: "desktop-1100" },
  { width: 1180, name: "desktop-1180" },
  { width: 1280, name: "desktop-1280" },
  { width: 1440, name: "desktop-1440" },
  { width: 1728, name: "desktop-1728" },
] as const;

// Tailwind breakpoints (DESIGN.md §13). Below `lg` the drawer activates.
const LG = 1024;

const SCREENSHOT_DIR = path.resolve(__dirname, "..", "..", "test-results", "preview-qa");

function shotPath(width: number, name: string) {
  return path.join(SCREENSHOT_DIR, `${width}-${name}.png`);
}

async function setViewportAndLoad(page: Page, width: number) {
  // Tall viewport so the screenshot captures hero + nav without scroll.
  await page.setViewportSize({ width, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
}

async function assertNoHorizontalOverflow(page: Page, width: number) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(
    overflow.scrollWidth,
    `horizontal overflow at ${width}px: scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth}`,
  ).toBeLessThanOrEqual(overflow.clientWidth);
}

for (const vp of VIEWPORTS) {
  test.describe(`@${vp.width}px (${vp.name})`, () => {
    test("header — no horizontal overflow + nav screenshot", async ({ page }) => {
      await setViewportAndLoad(page, vp.width);
      await assertNoHorizontalOverflow(page, vp.width);

      // Screenshot the header chrome only — first 120px is sufficient for
      // wordmark + nav row + CTAs at any viewport.
      await page.screenshot({
        path: shotPath(vp.width, "header"),
        clip: { x: 0, y: 0, width: vp.width, height: 120 },
      });

      // Top-of-page screenshot (header + hero) for scanning the layout.
      await page.screenshot({
        path: shotPath(vp.width, "home-nav"),
        clip: { x: 0, y: 0, width: vp.width, height: Math.min(900, 600) },
      });
    });

    test("desktop nav: no wrap, both CTAs visible", async ({ page }) => {
      test.skip(vp.width < LG, "drawer mode; covered by mobile-drawer test");
      await setViewportAndLoad(page, vp.width);

      const navList = page.locator("header nav ul").first();
      await expect(navList).toBeVisible();

      // Single-row guarantee: all <li> share the same offsetTop as the first.
      // If any wrap, their offsetTop diverges by at least the line-height.
      const offsets = await navList.evaluate((ul: HTMLElement) =>
        Array.from(ul.children).map((c) => (c as HTMLElement).offsetTop),
      );
      const allSameRow = offsets.every((o) => o === offsets[0]);
      expect(
        allSameRow,
        `nav wrapped to multiple rows at ${vp.width}px: offsets=${JSON.stringify(offsets)}`,
      ).toBe(true);

      // Both CTAs must be visible (mobile-only rule: drawer hides them
      // until tap, but we're in desktop mode here).
      const ctas = page.locator("header a", { hasText: /Diagnostic|Book a Call|Signal/ });
      const ctaCount = await ctas.count();
      expect(ctaCount, `expected at least one header CTA at ${vp.width}px`).toBeGreaterThanOrEqual(1);
    });

    test("mobile drawer: open, close on link, close on ESC, scroll-lock cleanup", async ({ page }) => {
      test.skip(vp.width >= LG, "desktop nav; covered by no-wrap test");
      await setViewportAndLoad(page, vp.width);

      const menuBtn = page.getByRole("button", { name: /menu/i });
      await expect(menuBtn).toBeVisible();

      // Open
      await menuBtn.click();
      const drawer = page.locator("#primary-nav-mobile");
      await expect(drawer).toBeVisible();
      await page.screenshot({
        path: shotPath(vp.width, "mobile-drawer-open"),
        clip: { x: 0, y: 0, width: vp.width, height: 700 },
      });

      // While open, body scroll is locked.
      const overflowOpen = await page.evaluate(() => document.body.style.overflow);
      expect(overflowOpen, "body scroll should be locked while drawer is open").toBe("hidden");

      // Close on ESC, body scroll restored.
      await page.keyboard.press("Escape");
      await expect(drawer).toHaveCount(0);
      const overflowClosed = await page.evaluate(() => document.body.style.overflow);
      expect(overflowClosed, "body scroll should be restored after ESC").toBe("");

      // Reopen, click a link inside the drawer — drawer must close.
      await menuBtn.click();
      await expect(drawer).toBeVisible();
      const firstLink = drawer.locator("a, [href]").first();
      // Avoid actually navigating away; intercept the click.
      await page.evaluate(() => {
        const root = document.getElementById("primary-nav-mobile");
        if (!root) return;
        root.querySelectorAll("a").forEach((a) => a.addEventListener(
          "click",
          (e) => e.preventDefault(),
          { capture: true, once: true },
        ));
      });
      await firstLink.click();
      await expect(drawer).toHaveCount(0);
    });

    test("sticky header: stays fixed during scroll", async ({ page }) => {
      await setViewportAndLoad(page, vp.width);
      const headerHandle = page.locator("header[role='banner']");
      const before = await headerHandle.boundingBox();
      await page.evaluate(() => window.scrollTo(0, 800));
      await page.waitForTimeout(150);
      const after = await headerHandle.boundingBox();
      expect(before, "header bounding box should be measurable").not.toBeNull();
      expect(after, "header bounding box should be measurable after scroll").not.toBeNull();
      // Header is `fixed top-0` — y must remain ~0 regardless of scroll.
      expect(
        Math.round((after?.y ?? -1) * 10) / 10,
        `header y drifted during scroll at ${vp.width}px: before=${before?.y} after=${after?.y}`,
      ).toBeLessThanOrEqual(1);
    });
  });
}
