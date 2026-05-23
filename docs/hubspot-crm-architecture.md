# hubspot-crm-architecture.md — HubSpot CRM ownership and integration plan

**Status:** proposed (planning only — no integration code yet)
**Created:** 2026-05-23
**Related:** [`DECISIONS.md`](./DECISIONS.md), [`SECURITY.md`](./SECURITY.md), [`PRD.md`](./PRD.md)

This document defines how HubSpot fits into the AJ Digital OS / ResponseOS
stack. It is the contract for *what HubSpot owns* vs. *what AJ Digital OS
owns*, so that any future integration work has a single source of truth
to point at. Nothing in this document changes runtime behavior — it
exists to prevent us from shipping integration code before the
ownership boundary is settled.

---

## 1. Strategic role

**HubSpot is the CRM / system of record.** It owns the canonical
representation of the people and organizations we talk to, their
lifecycle in our funnel, and the operational artifacts that touch them
(forms, meetings, deals, tasks). If a humans-vs-humans question comes
up — "who is this contact, what stage are they in, what did we promise
them?" — HubSpot answers it.

**AJ Digital OS is the intelligence layer.** It owns the things HubSpot
is not designed for: diagnostic responses, scoring models, attribution
graphs, revenue-leak signals, AI-generated recommendations, and the
founder-memory / business-context store that personalizes our outbound.
If an "infer / score / recommend / remember" question comes up, AJ
Digital OS answers it.

The rule of thumb: **operational truth lives in HubSpot; inferred truth
lives in AJ Digital OS.** When the two disagree, HubSpot wins for
identity and stage; AJ Digital OS wins for signal and recommendation.

---

## 2. Data ownership boundary

| Entity / data type        | Owner          | Sync direction                | Notes |
|---------------------------|----------------|-------------------------------|-------|
| Contacts                  | HubSpot        | HubSpot → AJ Digital OS (read) | Canonical identity. AJ Digital OS references by HubSpot contact ID, never duplicates PII. |
| Companies                 | HubSpot        | HubSpot → AJ Digital OS (read) | Same pattern as contacts. |
| Deals                     | HubSpot        | HubSpot → AJ Digital OS (read) | AJ Digital OS may *suggest* deal moves; HubSpot executes them. |
| Lifecycle stage           | HubSpot        | HubSpot → AJ Digital OS (read) | AJ Digital OS reads stage to gate recommendations; never writes stage directly. |
| Lead source               | HubSpot        | AJ Digital OS → HubSpot (write on creation) | Captured at form submit; pushed once, then HubSpot owns. |
| Forms / submissions       | HubSpot        | AJ Digital OS → HubSpot (write) | Website forms POST to HubSpot Forms API; raw submission also logged to AJ Digital OS for attribution. |
| Meetings / bookings       | HubSpot        | HubSpot → AJ Digital OS (read) | HubSpot Meetings (or Calendly synced into HubSpot) is canonical. AJ Digital OS reads to trigger follow-up logic. |
| Follow-up tasks           | HubSpot        | AJ Digital OS → HubSpot (write) | AI-generated tasks are created in HubSpot; humans complete them there. |
| Diagnostic responses      | AJ Digital OS  | AJ Digital OS → HubSpot (summary only) | Full responses stay in AJ Digital OS. Only a summary / score is mirrored as a HubSpot contact property. |
| Lead score                | AJ Digital OS  | AJ Digital OS → HubSpot (write) | Scored in AJ Digital OS, written back as a HubSpot contact property for sales visibility. |
| Attribution events        | AJ Digital OS  | one-way (stays in AJ Digital OS) | Page views, UTM chains, multi-touch attribution. Not in HubSpot. |
| Revenue leak signals      | AJ Digital OS  | AJ Digital OS → HubSpot (digest) | Detected in AJ Digital OS; surfaced into HubSpot as a contact/company note or task, never as a structured property. |
| AI recommendations        | AJ Digital OS  | AJ Digital OS → HubSpot (tasks/notes) | Recommendations land in HubSpot as tasks or notes the operator can act on. The underlying model state stays in AJ Digital OS. |
| Client memory / business context | AJ Digital OS | one-way (stays in AJ Digital OS) | Long-form founder context, prior conversations, prefs. Never synced to HubSpot. |

Two invariants fall out of this table:

- **HubSpot never holds inferred state.** No model outputs, no
  attribution graphs, no memory.
- **AJ Digital OS never holds canonical identity.** It references
  HubSpot IDs and treats HubSpot as the source for "who is this".

---

## 3. Integration phases

Phases are sequential. Do not start phase N+1 until phase N is signed
off. Each phase has an explicit exit criterion.

### Phase 0 — Docs / planning only *(current)*
- This document exists and is reviewed.
- No HubSpot project, no OAuth app, no integration code.
- **Exit:** ownership table approved by operator.

### Phase 1 — Manual HubSpot CRM usage
- HubSpot is set up as an account; contacts/companies/deals modeled
  manually in the UI.
- Pipelines, lifecycle stages, and required contact properties
  defined.
- No code touches HubSpot yet.
- **Exit:** the operator can run a manual lead → deal flow end-to-end
  in HubSpot alone.

### Phase 2 — Website forms push to HubSpot
- AudioJones.com forms (diagnostic intake, contact, lead capture)
  POST to the HubSpot Forms API.
- Implemented behind a typed adapter (e.g. `src/lib/hubspot/forms.ts`)
  so HubSpot can be swapped without touching form components.
- Server-side only; no HubSpot keys shipped to the browser.
- **Exit:** form submissions appear in HubSpot with correct lead
  source / UTM properties; failures are observable.

### Phase 3 — Read HubSpot data into AJ Digital OS
- AJ Digital OS subscribes (via webhooks or scheduled pulls) to
  HubSpot contact / deal / meeting changes.
- Data is referenced by HubSpot ID; no PII is duplicated unless
  strictly required for a documented use case.
- **Exit:** AJ Digital OS can render a contact's HubSpot-side state
  alongside its own inferred state.

### Phase 4 — AI-generated recommendations / tasks
- AJ Digital OS writes scores, tasks, and notes back into HubSpot via
  the CRM API.
- All writes go through a typed adapter with idempotency keys to
  prevent duplicates on retry.
- **Exit:** the operator can see AI-generated tasks in HubSpot and
  complete them in the normal HubSpot UI.

### Phase 5 — Optional HubSpot app / card / workflow / webhook project
- Only if Phases 2–4 reveal a use case that *requires* in-HubSpot UI
  (e.g. a CRM card surfacing AJ Digital OS signals next to a contact).
- This is the first phase that touches `hs project` tooling and the
  HubSpot Marketplace surface area.
- **Exit (per project):** the app is reviewed for the guardrails in
  §4 below and explicitly approved before publishing.

---

## 4. Guardrails

These apply across every phase. Treat them as bright lines, same
weight as [`SECURITY.md`](./SECURITY.md) §1.

- **No secrets committed.** HubSpot personal access keys, app secrets,
  and OAuth client secrets live in Doppler / Vercel env, never in the
  repo. A `hubspot.config.yml` produced by `hs auth` is gitignored.
- **No HubSpot project initialized yet.** Do not run `hs project create`
  / `hs project upload` until Phase 5 is approved.
- **No OAuth or marketplace app yet.** Phases 2–4 use server-side API
  calls with a private app token, not OAuth.
- **No CRM data stored locally unless explicitly needed.** Reference
  by HubSpot ID. If a field must be cached, document why and for how
  long.
- **Prefer typed adapters and env placeholders.** All HubSpot calls go
  through `src/lib/hubspot/*` (when introduced) behind a typed
  interface. Env keys are added to `docs/env/env.example` as
  placeholders before any real value is provisioned.
- **Keep HubSpot replaceable where possible.** Adapter surface should
  be narrow enough that a future CRM swap (Attio, Salesforce, etc.) is
  a re-implementation of the adapter, not a rewrite of features.
- **No client-side HubSpot keys.** Anything prefixed `NEXT_PUBLIC_*`
  ships to the browser. HubSpot access tokens must never be exposed
  that way.

---

## 5. Acceptance criteria (for this document)

- [x] Document exists at `docs/hubspot-crm-architecture.md`.
- [x] No runtime code changed in the introducing commit.
- [x] No secrets, tokens, or env values added.
- [x] No HubSpot app / project initialized.
- [x] Git diff is docs-only.

---

## 6. Open questions

These are deliberately unresolved; they should be answered before
Phase 2 starts.

1. Which HubSpot edition / hub do we standardize on (Free / Starter /
   Professional)? Several integration paths (custom properties limit,
   workflow access, webhooks) gate on this.
2. Do we adopt HubSpot Meetings as canonical, or keep Calendly and
   sync to HubSpot? (Currently Calendly is wired up via MCP; HubSpot
   Meetings is not.)
3. What is the minimum set of HubSpot custom contact properties AJ
   Digital OS needs to write back (lead score, diagnostic summary,
   revenue-leak digest)? List them before building the writer.
4. Retention: how long does AJ Digital OS keep a copy of HubSpot
   references for contacts that get deleted in HubSpot? Default
   answer: delete on webhook within 24h.
