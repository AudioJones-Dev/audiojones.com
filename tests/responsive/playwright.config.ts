import { defineConfig } from "@playwright/test";

const PREVIEW_URL = process.env.PREVIEW_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: ".",
  outputDir: "../../test-results/preview-qa",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: [
    ["list"],
    ["html", { outputFolder: "../../test-results/preview-qa-report", open: "never" }],
  ],
  use: {
    baseURL: PREVIEW_URL,
    trace: "retain-on-failure",
    screenshot: "off",
    video: "off",
    extraHTTPHeaders: process.env.VERCEL_PROTECTION_BYPASS
      ? { "x-vercel-protection-bypass": process.env.VERCEL_PROTECTION_BYPASS }
      : undefined,
  },
});
