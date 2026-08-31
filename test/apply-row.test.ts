import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { APPLY_SOURCE_PAGE, toApplyRow } from "../src/lib/apply/apply-row";
import { applySchema, type ApplyInput } from "../src/lib/apply/apply-schema";

const repoRoot = process.cwd();

function readSource(relativePath: string) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

const baseInput: ApplyInput = {
  firstName: "Dana",
  email: "dana@example.com",
  companyName: "Northwind Services",
  annualRevenueRange: "$1M–$2M",
  desiredOutcome: "Stop losing inbound to slow follow-up",
  timeline: "Within 30 days",
  consentToContact: true,
};

const ctx = { ipHash: "abc123", userAgent: "test-agent" };

test("carries the offer and its attribution onto the row", () => {
  const row = toApplyRow(
    {
      ...baseInput,
      offer: "responseos-core",
      source: "pricing",
      utmSource: "pricing",
      utmCampaign: "pricing-offers",
      utmContent: "responseos-core",
    },
    ctx,
  );

  assert.equal(row.offer, "responseos-core");
  assert.equal(row.applySource, "pricing");
  assert.equal(row.utmContent, "responseos-core");
  assert.equal(row.sourcePage, APPLY_SOURCE_PAGE);
});

test("normalises absent and blank optionals to null, never empty strings", () => {
  const row = toApplyRow(
    { ...baseInput, offer: undefined, notes: "", website: "", phone: "   " },
    ctx,
  );

  for (const [field, value] of [
    ["offer", row.offer],
    ["notes", row.notes],
    ["website", row.website],
    ["phone", row.phone],
    ["teamSize", row.teamSize],
    ["budgetRange", row.budgetRange],
    ["applySource", row.applySource],
  ] as const) {
    assert.equal(value, null, `${field} should be null, got ${JSON.stringify(value)}`);
  }
});

test("preserves every field the form collects", () => {
  const full: ApplyInput = {
    ...baseInput,
    lastName: "Okafor",
    phone: "+1 555 0100",
    role: "Founder",
    website: "https://northwind.example",
    currentGrowthStage: "Compounding ($1M–$5M)",
    primaryConstraint: "Follow-up",
    teamSize: "6–15",
    offer: "founder-intelligence-system",
    budgetRange: "$15K–$35K",
    notes: "Two locations.",
    source: "pricing",
  };

  // The schema is the contract for what the form can send; if a field is
  // added there and not mapped here, this catches it rather than the column
  // silently going missing at insert time.
  const mapped = toApplyRow(full, ctx);
  const skipped = new Set(["hp", "consentToContact", "source"]);
  for (const field of Object.keys(applySchema.shape)) {
    if (skipped.has(field)) continue;
    assert.ok(field in mapped, `applySchema field is not mapped to a row column: ${field}`);
  }

  assert.equal(mapped.consentToContact, true);
  assert.equal(mapped.applySource, "pricing");
  assert.equal(mapped.userAgent, "test-agent");
  assert.equal(mapped.ipHash, "abc123");
});

// The failure this guards against is the expensive one: code inserting into a
// column no migration creates, which only surfaces as a 500 on a real
// submission against a real database.
test("every column the insert writes exists in the migrations", () => {
  const insertSource = readSource("src/db/apply.ts");
  const schema = [
    readSource("db/migrations/001_applied_intelligence_leads.sql"),
    readSource("db/migrations/003_apply_submission_fields.sql"),
  ].join("\n");

  const columnList = insertSource
    .split("INSERT INTO applied_intelligence_leads (")[1]
    ?.split(") VALUES")[0];
  assert.ok(columnList, "could not locate the INSERT column list");

  const columns = columnList
    .split(",")
    .map((c) => c.trim())
    .filter((c) => c.length > 0 && !c.startsWith("--"));

  assert.ok(columns.includes("offer"), "the insert must write the offer column");
  assert.ok(columns.length >= 25, `expected the full column list, saw ${columns.length}`);

  for (const column of columns) {
    assert.match(
      schema,
      new RegExp(`\\b${column}\\b`),
      `insert writes a column no migration creates: ${column}`,
    );
  }
});
