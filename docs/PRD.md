# PRD.md — AudioJones.com

**Status:** living document
**Owner:** AJ Digital LLC

---

## 1. What this product is

AudioJones.com is the **public marketing site** for AJ Digital LLC. It
is the front door to the Founder Intelligence System offering: founder-
led AI infrastructure for businesses in the $250K–$5M range.

It is **only** a marketing site. There is no admin portal, no client
portal, no auth surface, and no internal "engine" services in this
codebase. The legacy `/portal/*`, `/api/admin/*`, `/api/governance/*`,
and `/api/incidents/*` trees have been removed (see
[`CHANGELOG.md`](./CHANGELOG.md), 2026-06-08).

---

## 2. Why it exists

To convert the right-fit founder into a qualified lead through three
mechanisms:

1. **Authority content** — insights, frameworks, case studies, ROI
   calculator.
2. **Diagnostic** — the AI Readiness Diagnostic (`/ai-readiness-diagnostic`)
   captures structured intent and routes leads to the appropriate tier.
   The Founder Intelligence System has its own discovery flow at
   `/founder-intelligence-system/diagnostic`. The two are distinct: the
   AI Readiness Diagnostic is the top-of-funnel lead qualifier; the FIS
   diagnostic is the offer-specific discovery.
3. **Direct booking** — the `Book a Call` CTA opens a scheduling flow
   for high-intent visitors.

Every surface should drive toward one of these three exits.

---

## 3. Audiences

| Persona             | Where they enter            | What they need                                     |
| ------------------- | --------------------------- | -------------------------------------------------- |
| **Founders / SMB**  | Homepage, `/services`       | Proof the system fits, ROI clarity, low-risk next step |
| **Creators**        | `/agents`, `/insights`      | A productized package they can self-evaluate       |
| **Operators / RevOps** | `/case-studies`, `/roi-calculator` | Numbers, integrations, evidence            |
| **Returning leads** | Diagnostic resume, email    | Frictionless re-entry to where they left off       |

---

## 4. Core flows

### 4.1 Lead capture (primary)

1. Visitor lands on a marketing page.
2. CTA opens a form (`/ai-readiness-diagnostic`, contact, or inline).
3. Submission goes to `src/app/api/founder-intelligence/leads/route.ts`
   (or `src/app/api/leads/route.ts` for generic intake).
4. Server validates with Zod, rate-limits per IP, scores the lead
   (`src/lib/leads/lead-scoring.ts`), persists to NeonDB
   (`src/db/leads.ts → insertFounderIntelligenceLead`), sends an
   internal Resend email, and optionally fires `N8N_LEAD_WEBHOOK_URL`.
5. n8n failure must not block the response. Lead is durable in Neon and
   the email is queued before the webhook fires.

### 4.2 Booking

`Book a Call` links to the scheduling provider (currently Calendly /
Cal.com depending on environment configuration). The site does not host
the booking surface itself.

### 4.3 Content

Long-form content (insights, blog, topic clusters) is authored in
**Sanity CMS** and rendered through the App Router pages. See
`docs/sanity-blog-content-model.md`.

### 4.4 Commerce

- **Stripe** — payment processing and customer portal (`/api/stripe/*`).

The site links into checkout but does not own the post-purchase
fulfillment, which lives in the Stripe account.

---

## 5. Non-goals

- **Not a CMS-builder.** Content authoring happens in Sanity Studio, not
  in this repo.
- **Not the admin portal.** Customer servicing belongs to a separate
  application.
- **Not a Firebase project.** See [`DECISIONS.md`](./DECISIONS.md).
- **Not a multi-tenant SaaS.** This is a single brand site.

---

## 6. Quality bar

| Dimension       | Target                                                       |
| --------------- | ------------------------------------------------------------ |
| Performance     | LCP < 2.5s on 4G mobile; CLS < 0.1; INP < 200ms.            |
| Accessibility   | WCAG 2.1 AA on all marketing pages.                         |
| SEO/AEO         | Structured data on every page; canonical URLs; sitemap.     |
| Lead durability | Zero-loss: persistence to Neon must succeed before responding 200. |
| Security        | No secrets in repo; CSP on production; admin endpoints gated. |
| Brand           | Matches [`DESIGN.md`](./DESIGN.md) tone and tokens.         |

---

## 7. Success signals

- Diagnostic completion rate.
- Qualified lead count per week (lead score ≥ threshold).
- `Book a Call` → meeting-held conversion.
- Organic traffic growth on cluster topics.
- Time-to-publish for new insight (Sanity → live).

---

## 8. Open questions

Tracked in [`ROADMAP.md`](./ROADMAP.md) and
[`DECISIONS.md`](./DECISIONS.md). When in doubt, file a decision entry
rather than letting ambiguity ship.
