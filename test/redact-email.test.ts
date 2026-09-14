// The shared redaction helper is what every storage module logs through.
// Nothing before the `@` may survive: with a one-character local part,
// keeping even the first character makes the address fully recoverable.

import assert from "node:assert/strict";
import test from "node:test";

import { redactEmail } from "../src/lib/logging/redact-email";

for (const address of ["a@b.com", "x@y.co.uk", "dana@example.com"]) {
  test(`redactEmail hides the whole local part of ${address}`, () => {
    const domain = address.slice(address.indexOf("@"));
    assert.equal(redactEmail(address), `•••${domain}`);
    assert.ok(!redactEmail(address).includes(address[0]!));
  });
}

test("redactEmail keeps only the last @-suffix when the local part contains @", () => {
  assert.equal(redactEmail('"a@b"@c.com'), "•••@c.com");
});

test("redactEmail redacts a value with no @ entirely", () => {
  assert.equal(redactEmail("not-an-email"), "•••");
  assert.equal(redactEmail(""), "•••");
});
