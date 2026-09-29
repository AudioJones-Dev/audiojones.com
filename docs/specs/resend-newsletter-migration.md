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
topic, and send one idempotent welcome email from a published Resend template.

## Success criteria

- `audiojones.com` is verified as a Resend sending domain.
- A newsletter submission creates or updates a Resend contact without exposing
  credentials to the browser.
- The contact belongs to the `Audio Jones Newsletter` segment.
- The contact is explicitly opted into the `Audio Jones Newsletter` topic.
- An existing global unsubscribe or newsletter-topic opt-out is preserved; an
  unauthenticated form submission cannot reactivate either state.
- The route sends the welcome template only after contact setup succeeds, using
  `audiojones-welcome/<contact-id>` as the deterministic Resend idempotency key.
- A welcome-email outage is logged without discarding the durable subscriber or
  encouraging duplicate form submissions.
- Production refuses a signup when Resend is unavailable; it never reports a
  false success through the mock adapter.
- Local development and deliberate preview mock mode continue to work.
- Typecheck, lint, Firebase guard, build, focused tests, and Aikido scan pass.
- The final PR records independent review evidence for its current head.

## Scope

- Replace the canonical newsletter adapter's MailerLite implementation with a
  Resend implementation.
- Add server-only environment configuration for the Resend segment, topic, and
  welcome-template identifiers.
- Update canonical deployment and environment documentation.
- Add focused tests for provider selection and Resend request behavior.
- Create Resend segment and topic resources through the official CLI.
- Prepare an unpublished welcome template after sender-domain verification;
  publication remains an owner approval gate.

## Out of scope

- Production deployment or merge.
- Publishing the welcome template without owner copy approval.
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
- Draft welcome template: `cef50994-aaf0-403c-9da1-4197a38c2a8e`

## Proposed plan

1. Verify the Audio Jones Resend DNS records in Cloudflare.
2. Implement and test the Resend newsletter adapter.
3. Create the welcome template in draft state and obtain owner copy approval.
4. Publish the approved template and configure Preview with its identifier.
5. Import existing consented subscribers without invoking the signup route.
6. Deploy Preview and submit a new test alias.
7. Validate the contact, segment, topic, idempotent send, and delivery log.
8. Run repository validation, Aikido, and independent review before handoff.

## Risks and rollback

- **DNS error:** Resend stays unverified. Roll back by deleting only the three
  newly added Resend DNS records.
- **Duplicate lifecycle email:** Existing subscribers could receive a welcome
  email. Mitigate by importing outside the signup route and using one stable
  idempotency key per Resend contact for live signups.
- **False signup success:** Provider errors could discard an address. Preserve
  the current production fail-closed behavior.
- **Split provider state:** MailerLite and Resend can temporarily diverge.
  Keep MailerLite unchanged until Preview validation succeeds.

## Open questions / activation gates

- Final welcome-email subject and body require owner approval before the draft
  template is published.
- The welcome uses a visible reply-to unsubscribe link; future newsletters use
  Resend Broadcasts and Topics for native one-click preference management.
- Production activation and MailerLite retirement require separate approval
  after Preview validation.

## Draft welcome copy

**Subject:** You're in.

**Preheader:** Practical notes on finding the signal inside your business.

> SIGNAL, NOT NOISE.
>
> You're in.
>
> Thanks for subscribing to Audio Jones.
>
> I'll send practical notes on Founder Intelligence Systems: where revenue
> leaks, follow-up breaks, attribution blurs, and AI adds more complexity than
> clarity.
>
> The goal is simple: help you see the operating constraint before you add
> another tool.
>
> **Start the diagnostic**
>
> — Audio<br />
> Founder, AJ Digital LLC

The CTA points to `https://audiojones.com/founder-intelligence/diagnostic`.
The footer discloses that the recipient subscribed at audiojones.com, provides
the monitored `support@audiojones.com` unsubscribe address, and includes AJ
Digital LLC's published mailing address.
