import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../src/app/robots.txt/route";

async function groups() {
  const res = GET();
  assert.equal(res.headers.get("content-type"), "text/plain; charset=utf-8");
  const text = await res.text();
  const byAgent = new Map<string, string[]>();
  let current: string[] | null = null;
  for (const line of text.split("\n")) {
    const agent = line.match(/^User-Agent:\s*(.+)$/i);
    if (agent) {
      current = [];
      byAgent.set(agent[1].trim(), current);
    } else if (line.trim() && current && !/^Sitemap:/i.test(line)) {
      current.push(line.trim());
    }
  }
  return { text, byAgent };
}

test("all crawlers get the owner-approved Content-Signal (2026-09-27)", async () => {
  const { byAgent } = await groups();
  assert.deepEqual(
    byAgent.get("*")?.filter((l) => /^Content-Signal:/i.test(l)),
    ["Content-Signal: search=yes, ai-input=yes, ai-train=no"]
  );
});

test("GPTBot stays blocked from the whole site", async () => {
  const { byAgent } = await groups();
  assert.deepEqual(byAgent.get("GPTBot"), ["Disallow: /"]);
});

test("private surfaces stay disallowed for all crawlers", async () => {
  const rules = (await groups()).byAgent.get("*") ?? [];
  for (const path of ["/portal/", "/ops/", "/api/", "/portal/admin/", "/env", "/status"]) {
    assert.ok(rules.includes(`Disallow: ${path}`), `missing Disallow: ${path}`);
  }
  assert.ok(rules.includes("Allow: /"));
});

test("permanent-redirect paths are crawlable so redirects pass equity (A5)", async () => {
  const rules = (await groups()).byAgent.get("*") ?? [];
  for (const path of ["/business", "/creators", "/artisthub"]) {
    assert.ok(!rules.includes(`Disallow: ${path}`), `${path} should not be disallowed`);
  }
});

test("sitemap is advertised on the canonical host", async () => {
  const { text } = await groups();
  assert.match(text, /^Sitemap: https:\/\/www\.audiojones\.com\/sitemap\.xml$/m);
});
