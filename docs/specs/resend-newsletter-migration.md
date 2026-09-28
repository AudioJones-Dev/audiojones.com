# Resend Newsletter Migration

**Status:** approved for implementation
**Owner:** AJ Digital LLC
**Decision date:** 2026-09-28

## Problem

AudioJones.com currently sends transactional email through Resend while its
newsletter signup path writes subscribers to MailerLite. Maintaining both
providers duplicates contacts, credentials, domain authentication, automation
state, and delivery diagnostics. The MailerLite welcome workflow is still an
empty draft, so no live lifecycle automation depends on it.

## Desired outcome

Use Resend as the single provider for Audio Jones transactional and newsletter
email. A valid newsletter signup must create or update a Resend contact, add it
to the Audio Jones newsletter segment, explicitly opt it into the newsletter
topic, and emit an event that can trigger a disabled welcome automation.

## Success criteria

- `audiojones.com` is verified as a Resend sending domain.
- A newsletter submission creates or updates a Resend contact without exposing
  credentials to the browser.
- The contact belongs to the `Audio Jones Newsletter` segment.
- The contact is explicitly opted into the `Audio Jones Newsletter` topic.
- The route attempts `audiojones.newsletter.subscribed` only after contact
  setup succeeds; an event outage is logged without discarding the durable
  subscriber or encouraging duplicate form submissions.
- Production refuses a signup when Resend is unavailable; it never reports a
  false success through the mock adapter.
- Local development and deliberate preview mock mode continue to work.
- Typecheck, lint, Firebase guard, build, focused tests, and Aikido scan pass.
- The final PR records independent review evidence for its current head.

## Scope

- Replace the canonical newsletter adapter's MailerLite implementation with a
  Resend implementation.
- Add server-only environment configuration for the Resend segment, topic, and
  event identifiers.
- Update canonical deployment and environment documentation.
- Add focused tests for provider selection and Resend request behavior.
- Create Resend segment, topic, and event resources through the official CLI.
- Prepare a disabled welcome automation after sender-domain verification and
  approved email copy are available.

## Out of scope

- Production deployment or merge.
- Enabling the welcome automation.
- Sending a broadcast or welcome email.
- Migrating Whop buyer lifecycle integrations in the same change.
- Deleting MailerLite resources or credentials before rollback validation.
- Configuring the other brand domains.

## Constraints

- Preserve the existing route and form contract.
- Do not add or upgrade a dependency solely for the migration; use Resend's
  server-side REST API at the existing application boundary.
- Do not silently fall back to mock in production.
- Do not import subscribers until consent state is preserved and duplicate
  welcome delivery is prevented.
- DNS changes must be exact, collision-checked, and reversible.
- Human-only merge and independent-review requirements remain in force.

## Existing assets

- Canonical route: `src/app/api/newsletter/route.ts`
- Adapter boundary: `src/lib/newsletter/newsletter-storage.ts`
- Validation: `src/lib/newsletter/newsletter-schema.ts`
- Existing Resend credential: `RESEND_API_KEY`
- Resend segment: `0c48c406-5fa3-46d4-9553-f23680d775e0`
- Resend topic: `8253f5f9-7d9c-4c6e-b325-0e0ad59b4b82`
- Resend event: `audiojones.newsletter.subscribed`

## Proposed plan

1. Verify the Audio Jones Resend DNS records in Cloudflare.
2. Implement and test the Resend newsletter adapter.
3. Configure Preview with the segment, topic, and event identifiers.
4. Create the welcome automation in disabled state using approved copy.
5. Import the existing consented subscribers without emitting the signup event.
6. Deploy Preview and submit a new test alias.
7. Validate the contact, segment, topic, event, automation run, and delivery log.
8. Run repository validation, Aikido, and independent review before handoff.

## Risks and rollback

- **DNS error:** Resend stays unverified. Roll back by deleting only the three
  newly added Resend DNS records.
- **Duplicate lifecycle email:** Existing subscribers could receive a welcome
  email. Mitigate by importing before automation enablement and never emitting
  the signup event during migration.
- **False signup success:** Provider errors could discard an address. Preserve
  the current production fail-closed behavior.
- **Split provider state:** MailerLite and Resend can temporarily diverge.
  Keep MailerLite unchanged until Preview validation succeeds.

## Open questions / activation gates

- Final welcome-email subject and body require owner-approved copy.
- The Cloudflare dashboard must be authenticated before DNS records can be
  added; the stored API token currently fails authentication.
- Production activation and MailerLite retirement require separate approval
  after Preview validation.
