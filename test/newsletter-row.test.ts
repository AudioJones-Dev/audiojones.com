import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { toNewsletterRow } from "../src/lib/newsletter/newsletter-row";
import { newsletterSchema, type NewsletterInput } from "../src/lib/newsletter/newsletter-schema";

const repoRoot = process.cwd();

function readSource(relativePath: string) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

const ctx = { ipHash: "abc123", userAgent: "test-agent" };

test("normalises absent and blank optionals to null, never empty strings", () => {
  const row = toNewsletterRow(
    { email: "dana@example.com", utmSource: "", utmCampaign: "   " },
    ctx,
  );

  for (const [field, value] of [
    ["source", row.source],
    ["utmSource", row.utmSource],
    ["utmMedium", row.utmMedium],
    ["utmCampaign", row.utmCampaign],
    ["utmTerm", row.utmTerm],
    ["utmContent", row.utmContent],
  ] as const) {
    assert.equal(value, null, `${field} should be null, got ${JSON.stringify(value)}`);
  }
});

// NewsletterForm does not ask for consent, so the usual value is "not asked".
// Writing false there would record a refusal nobody gave.
test("keeps unasked consent (null) apart from declined (false)", () => {
  const email = "dana@example.com";
  assert.equal(toNewsletterRow({ email }, ctx).consentToContact, null);
  assert.equal(toNewsletterRow({ email, consent: false }, ctx).consentToContact, false);
  assert.equal(toNewsletterRow({ email, consent: true }, ctx).consentToContact, true);
});

test("preserves every field the form can send", () => {
  const full: NewsletterInput = {
    email: "dana@example.com",
    source: "footer",
    utmSource: "newsletter",
    utmMedium: "email",
    utmCampaign: "september",
    utmTerm: "attribution",
    utmContent: "footer-cta",
    consent: true,
  };

  // The schema is the contract for what the form can send. A field added
  // there and not mapped here fails this, rather than silently never reaching
  // the table.
  const mapped = toNewsletterRow(full, ctx);
  const renamed: Record<string, string> = { consent: "consentToContact" };
  const skipped = new Set(["hp"]);
  for (const field of Object.keys(newsletterSchema.shape)) {
    if (skipped.has(field)) continue;
    const key = renamed[field] ?? field;
    assert.ok(key in mapped, `newsletterSchema field is not mapped to a row column: ${field}`);
  }

  assert.equal(mapped.email, "dana@example.com");
  assert.equal(mapped.source, "footer");
  assert.equal(mapped.utmContent, "footer-cta");
  assert.equal(mapped.userAgent, "test-agent");
  assert.equal(mapped.ipHash, "abc123");
});

// The failure this guards against is the expensive one: code writing a column
// no migration creates, which only surfaces as a 500 on a real signup against
// a real database.
test("every column the code writes exists in migration 005", () => {
  const source = readSource("src/db/newsletter.ts");
  const migration = readSource("db/migrations/005_newsletter_subscribers.sql");

  const insertList = source
    .split("INSERT INTO newsletter_subscribers (")[1]
    ?.split(") VALUES")[0];
  assert.ok(insertList, "could not locate the INSERT column list");

  const inserted = insertList
    .split(",")
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  // `column = value` lines inside the SQL templates: the upsert's DO UPDATE SET
  // and the sync result's UPDATE.
  const queries = source
    .split("sql`")
    .slice(1)
    .map((q) => q.split("`")[0]);
  const assigned = queries.flatMap((q) =>
    [...q.matchAll(/^\s*([a-z_]+) = /gm)].map((m) => m[1]),
  );

  assert.ok(inserted.includes("email"), "the insert must write the email column");
  assert.ok(inserted.length >= 10, `expected the full column list, saw ${inserted.length}`);
  for (const column of ["submission_count", "mailerlite_status", "mailerlite_last_error"]) {
    assert.ok(assigned.includes(column), `expected an assignment to ${column}`);
  }

  for (const column of new Set([...inserted, ...assigned])) {
    assert.match(
      migration,
      new RegExp(`\\b${column}\\b`),
      `code writes a column migration 005 does not create: ${column}`,
    );
  }
});

test("the upsert has a unique conflict target, and every sync status is allowed", () => {
  const source = readSource("src/db/newsletter.ts");
  const migration = readSource("db/migrations/005_newsletter_subscribers.sql");

  // ON CONFLICT (email) needs a unique constraint on email, or every insert
  // fails.
  assert.match(source, /ON CONFLICT \(email\)/);
  assert.match(migration, /email CITEXT NOT NULL UNIQUE/);

  const allowed = migration.match(/mailerlite_status IN \(([^)]*)\)/)?.[1] ?? "";
  for (const status of ["pending", "synced", "failed", "skipped"]) {
    assert.ok(allowed.includes(`'${status}'`), `mailerlite_status CHECK does not allow '${status}'`);
  }
});
