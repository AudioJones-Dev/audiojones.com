import assert from "node:assert/strict";
import test from "node:test";

import {
  applySubject,
  offerLabel,
  renderApplyEmail,
} from "../src/lib/apply/apply-notification-content";
import { APPLY_OFFERS, type ApplyInput } from "../src/lib/apply/apply-schema";

const baseInput: ApplyInput = {
  firstName: "Dana",
  email: "dana@example.com",
  companyName: "Northwind Services",
  annualRevenueRange: "$1M–$2M",
  desiredOutcome: "Stop losing inbound to slow follow-up",
  timeline: "Within 30 days",
  consentToContact: true,
};

test("names the offer the applicant clicked, in the words the page used", () => {
  for (const offer of APPLY_OFFERS) {
    assert.equal(offerLabel(offer.id), offer.label);
    assert.match(applySubject({ ...baseInput, offer: offer.id }), new RegExp(offer.label));
  }
});

test("stays legible when no offer was selected", () => {
  const subject = applySubject(baseInput);
  assert.match(subject, /No offer selected/);
  assert.match(subject, /Northwind Services/);
  assert.match(renderApplyEmail("lead-1", baseInput), /No offer selected/);
});

test("falls back to the first name when no company is given", () => {
  // companyName is required by the schema, but an operator reading a subject
  // line should still get something useful if it ever arrives empty.
  assert.match(applySubject({ ...baseInput, companyName: "" }), /Dana/);
});

// A mail header is the one place where user-supplied text can change the
// meaning of the message rather than just its content.
test("strips CR/LF from the subject so a header cannot be injected", () => {
  const subject = applySubject({
    ...baseInput,
    companyName: "Acme\r\nBcc: attacker@example.com",
  });

  assert.equal(subject.includes("\r"), false);
  assert.equal(subject.includes("\n"), false);
  assert.match(subject, /Acme Bcc: attacker@example\.com/);
});

test("escapes every user-supplied field in the HTML body", () => {
  const html = renderApplyEmail("lead-1", {
    ...baseInput,
    firstName: "<script>alert(1)</script>",
    companyName: 'Ampersand & "quotes"',
    notes: "5 > 3 && 2 < 4",
    desiredOutcome: "it's fine",
  });

  assert.equal(html.includes("<script>"), false);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /Ampersand &amp; &quot;quotes&quot;/);
  assert.match(html, /5 &gt; 3 &amp;&amp; 2 &lt; 4/);
  assert.match(html, /it&#39;s fine/);
});

test("omits rows for fields the applicant left blank", () => {
  const html = renderApplyEmail("lead-1", baseInput);

  for (const label of ["Phone", "Website", "Notes", "Budget", "Team size"]) {
    assert.equal(html.includes(`>${label}<`), false, `${label} row should be omitted`);
  }
  assert.match(html, />Email</);
  assert.match(html, />Company</);
});
