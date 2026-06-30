---
title: AI Discoverability & Founder Intelligence Platform
status: accepted
program_id: ADFIP
owner: AJ Digital LLC
date: 2026-06-29
related:
  - docs/PRD.md
  - docs/ROADMAP.md
  - docs/DECISIONS.md
  - docs/specs/founder-revenue-leak-diagnostic-route.md
  - docs/specs/founder-intelligence-assessment-v1.md
  - docs/strategy/AUDIOJONES_SEO_AEO_ENTITY_IMPLEMENTATION_PLAN.md
  - docs/strategy/PHASE_3C_FOUNDER_GRAVITY_SHARED_ENGINE_PARITY_REPORT.md
---

# AI Discoverability & Founder Intelligence Platform

## 1. Program Definition

**Project:** AI Discoverability & Founder Intelligence Platform (ADFIP)

**Objective:** Transform AudioJones.com from a traditional marketing website
into an AI-native knowledge platform that can be discovered, understood,
trusted, and transacted with by humans, search engines, AI assistants, and
future agent-to-agent ecosystems.

**Strategic reframing:** AudioJones.com remains the public marketing surface,
but the initiative is broader than pages. The work should be organized as a
Founder Intelligence Platform with seven layers:

1. Diagnostic Layer
2. Knowledge Layer
3. Memory Layer
4. Discoverability Layer
5. Intelligence Layer
6. Agent Layer
7. Measurement Layer

The operating question changes from "what page should we build next?" to
"which platform layer are we strengthening?"

## 2. Truth Basis

### Facts

- AudioJones.com is the public marketing site for AJ Digital LLC, not the
  admin portal or a multi-tenant SaaS application.
- The canonical stack excludes Firebase and uses Cloudflare, Vercel/Next.js,
  Sanity, NeonDB, Resend, optional n8n, and other approved services documented
  in `docs/DECISIONS.md` and `docs/architecture/stack-decision.md`.
- The existing PRD already treats diagnostics as a primary lead-capture
  mechanism.
- The existing SEO/AEO entity implementation plan already recommends
  `/diagnostics/founder-revenue-leak-diagnostic` as a canonical diagnostic
  landing route.
- The repository already contains multiple diagnostic surfaces and a separate
  strategy report for shared diagnostic-engine parity.

### Inferences

- The current site direction is best treated as a program, not a single route
  build, because it spans diagnostics, structured knowledge, memory, schema,
  competitive intelligence, content production, and measurement.
- "Book a Call" should become a secondary high-intent action, with diagnostics
  as the default acquisition path.
- Knowledge Catalog and Business Memory work should start as structured,
  version-controlled content and schema before any new app surface or agent API
  is built.

### Assumptions

- ADFIP is a strategic umbrella for AudioJones.com and adjacent internal
  systems, but implementation inside this repo stays scoped to the public site,
  public content, structured data, lead capture, and approved API routes.
- Measurement infrastructure may eventually live outside this repo if it
  requires scheduled probes, private dashboards, or cross-property analytics.
- Agent-to-agent commerce is future-facing; near-term work should make the
  site understandable to agents without overbuilding transactional agent APIs.

## 3. Problem

AudioJones.com currently carries overlapping responsibilities: public website,
diagnostic acquisition, Founder Intelligence positioning, SEO/AEO content,
agent-readiness experiments, and early knowledge/memory concepts. Treating
these as isolated page tasks creates sprawl, route confusion, deferred
integration churn, and weak measurement.

The site needs a program architecture that can sequence these concerns without
turning the public marketing repo into an admin portal or prematurely building
agent infrastructure.

## 4. Desired Outcome

ADFIP should produce:

- A diagnostic-first acquisition path that routes prospects by need, urgency,
  readiness, and commercial fit.
- A structured Knowledge Catalog that turns company knowledge into
  version-controlled, queryable, publishable assets.
- A Business Memory model that defines the entities and relationships AJ
  Digital wants to retain over time.
- AI-native discoverability through entity pages, schema, FAQs, pricing
  explainers, glossary entries, breadcrumbs, and answer-shaped page sections.
- Search Console and crawl intelligence that detects index, schema, coverage,
  and opportunity gaps.
- A content engine that converts calls, transcripts, questions, and diagnostics
  into reusable knowledge assets.
- Agent readiness that supports future qualification, proposal, booking, and
  commerce workflows without adding premature agent APIs.

## 5. Success Criteria

ADFIP is successful when:

- Diagnostics become the primary acquisition path across the public site.
- The Founder Revenue Leak Diagnostic has a canonical public landing page with
  metadata, FAQ, JSON-LD, breadcrumbs, CTA, and pricing reference.
- The assessment engine has documented scoring, result routing, CRM handoff,
  and email automation contracts before implementation expands.
- Every canonical offer, framework, FAQ, policy, case study, methodology,
  glossary term, entity profile, service area, customer question, and claim can
  be represented as Markdown plus structured metadata.
- Public entity pages exist for Audio Jones, AJ Digital, Founder Intelligence
  Systems for founder-led service businesses, Business Memory, Founder Revenue
  Leak Diagnostic, and the approved revenue-system naming.
- Key pages answer the retrieval questions agents and searchers ask: what is
  it, how does it work, why does it matter, should I use it, how much does it
  cost, and who is it for.
- Search Console, sitemap, structured-data, and crawl findings can be reviewed
  on a weekly cadence.
- Program KPIs are tracked without confusing code gates, deployment gates, and
  measurement gates.

## 6. Scope

### In Scope

- Public diagnostic acquisition architecture.
- Founder Revenue Leak Diagnostic landing page plan.
- Founder Intelligence Assessment requirements.
- Diagnostic routing strategy.
- Knowledge Catalog taxonomy and metadata requirements.
- Business Memory entity and relationship model.
- SEO/AEO/entity discoverability structure.
- Search Console intelligence requirements.
- Firecrawl competitive-intelligence requirements.
- Founder Intelligence content engine requirements.
- Agent-readiness phases.
- Program KPIs and measurement definitions.

### Out of Scope For This Spec Branch

- Implementing new routes.
- Renaming existing routes.
- Changing public copy.
- Editing lead-capture APIs.
- Adding dependencies.
- Touching `package.json` or `pnpm-lock.yaml`.
- Integrating Google Search Console.
- Installing Firecrawl.
- Adding CRM, email, Whop, Stripe, ImageKit, Doppler, GCP, GitHub PAT, or
  secret-bearing work.
- Creating production deployments.
- Reintroducing Firebase in any form.

## 7. Constraints

- No Firebase packages, imports, env keys, or docs that imply Firebase is part
  of the AudioJones.com stack.
- No route rename without redirect plan and explicit approval.
- No destructive documentation deletion. Supersede old docs with redirect stubs
  when needed.
- No public-copy change without approval.
- No secret values in repo.
- One concern per branch and PR.
- Code changes require local validation: `pnpm typecheck`, `pnpm lint`,
  `pnpm check:no-firebase`, and `pnpm build`.

## 8. Existing Assets To Inspect Before Implementation

- Product brief: `docs/PRD.md`
- Roadmap: `docs/ROADMAP.md`
- Decision log: `docs/DECISIONS.md`
- Stack decision: `docs/architecture/stack-decision.md`
- Design and voice: `docs/design/DESIGN.md`
- SEO/AEO entity plan:
  `docs/strategy/AUDIOJONES_SEO_AEO_ENTITY_IMPLEMENTATION_PLAN.md`
- Diagnostic engine parity report:
  `docs/strategy/PHASE_3C_FOUNDER_GRAVITY_SHARED_ENGINE_PARITY_REPORT.md`
- Canonical diagnostic lead route:
  `src/app/api/founder-intelligence/leads/route.ts`
- Lead persistence:
  `src/db/leads.ts`
- Navigation config:
  `src/config/nav.ts`
- CTA links:
  `src/config/links.ts`
- Existing diagnostic pages:
  `src/app/ai-readiness-diagnostic/`,
  `src/app/founder-intelligence/diagnostic/`,
  `src/app/founder-gravity-audit/`, and `src/app/roi-calculator/`

## 9. Program Epics

### Epic 1: Diagnostic Acquisition Layer

**Goal:** Replace "Book a Call" as the primary acquisition mechanism with
diagnostics. Booking remains available, but diagnostics become the default
qualification path.

**Task 1.1: Build `/diagnostics/founder-revenue-leak-diagnostic`**

Required outputs:

- Landing page.
- Metadata.
- FAQ.
- JSON-LD.
- CTA.
- Pricing reference.
- Breadcrumbs.

Acceptance criteria:

- The route has one primary diagnostic CTA.
- The page uses the approved entity language from the SEO/AEO plan.
- Schema includes the required diagnostic-specific blocks.
- The route appears in sitemap and internal linking once implemented.

**Task 1.2: Build Founder Intelligence Assessment**

Required outputs:

- Question engine.
- Score calculation.
- Result pages.
- CRM integration contract.
- Email automation contract.

Implementation spec:

- [`docs/specs/founder-intelligence-assessment-v1.md`](./founder-intelligence-assessment-v1.md)

Acceptance criteria:

- Scoring is deterministic, documented, and testable before CRM automation is
  treated as complete.
- Lead persistence succeeds before any optional downstream automation.
- Result routing is separate from marketing copy so scoring can evolve without
  rewriting pages.

**Task 1.3: Build diagnostic routing**

Routing model:

```txt
Free Score
  -> Paid Diagnostic
  -> ResponseOS
  -> Founder Intelligence System
```

Acceptance criteria:

- Each route has a clear commercial next step.
- The user is never asked to book a call before the system has offered the
  appropriate diagnostic path.
- ResponseOS and Founder Intelligence System recommendations are tied to score
  thresholds, revenue-leak categories, or explicit user inputs.

### Epic 2: Knowledge Catalog

**Goal:** Everything the company knows becomes structured knowledge.

**Task 2.1: Create Knowledge Catalog**

Initial categories:

- Services.
- Pricing.
- FAQs.
- Policies.
- Case studies.
- Processes.
- Methodologies.
- Frameworks.
- Glossary.
- Entity profiles.
- Service areas.
- Customer questions.
- Claims Registry.

**Task 2.2: Normalize source material**

Every document, FAQ, transcript, and case study should become:

- Markdown.
- Structured metadata.
- Version-controlled source.

**Task 2.3: Define knowledge ingestion**

Candidate sources:

- Website.
- Podcast transcripts.
- Sales calls.
- Discovery calls.
- CRM.
- Email.
- Google Docs.
- Obsidian.
- Markdown.
- SOPs.

Acceptance criteria:

- The catalog has a schema before ingestion automation begins.
- Claims are tracked separately from copy so public assertions can be audited.
- Private/client-sensitive material is not published by default.

### Epic 3: Business Memory

**Goal:** Create a proprietary memory layer without turning AudioJones.com into
the private memory store.

**Task 3.1: Business Memory schema**

Candidate entities:

- Founder.
- Client.
- Lead.
- Call.
- Meeting.
- Decision.
- Problem.
- Recommendation.
- Revenue Leak.
- Automation.
- Task.
- Opportunity.
- Framework.

**Task 3.2: Knowledge Graph**

Relationship model:

```txt
Founder
  -> Business
  -> Revenue Leak
  -> Recommendation
  -> Automation
  -> Outcome
```

Acceptance criteria:

- Public, private, and client-confidential memory classes are separated.
- Public site pages only expose approved public knowledge.
- Private memory implementation has its own security review before client data
  enters the system.

### Epic 4: AI Discoverability

**Goal:** Make the public surface AI-native.

**Task 4.1: Schema implementation**

Required schema types:

- Organization.
- Person.
- Service.
- DefinedTerm.
- FAQPage.
- Article.
- Breadcrumb.
- LocalBusiness.

**Task 4.2: Entity authority**

Entity pages:

- Audio Jones.
- AJ Digital.
- Founder Intelligence Systems for founder-led service businesses.
- Business Memory.
- Founder Revenue Leak Diagnostic.
- Founder Revenue System or the approved successor name.

**Task 4.3: Prompt optimization**

Every priority page should answer:

- What is this?
- How does it work?
- Why does it matter?
- Should I use it?
- How much does it cost?
- Who is it for?

Acceptance criteria:

- Every priority page has a canonical definition block.
- Every entity page links to related diagnostics, services, frameworks, and FAQ
  entries.
- Schema and visible copy agree.

### Epic 5: Search Console Intelligence

**Goal:** Monitor discoverability.

**Task 5.1:** Integrate Google Search Console.

**Task 5.2:** Build dashboard views for:

- Index status.
- Coverage.
- Pages.
- Clicks.
- Impressions.
- CTR.
- Position.
- Errors.
- Structured Data.
- Sitemaps.

**Task 5.3:** Generate weekly reports covering:

- Ranking changes.
- Lost pages.
- New pages.
- Index failures.
- Schema failures.
- Opportunities.

Acceptance criteria:

- Search Console credentials are never committed.
- Reporting distinguishes missing data, partial data, and confirmed failures.
- Weekly reporting produces an action queue, not just a metric snapshot.

### Epic 6: Firecrawl Intelligence

**Goal:** Use crawl intelligence for competitive and self-audit work.

**Task 6.1:** Install Firecrawl CLI, MCP, and skills after approval.

**Task 6.2:** Crawl competitor/reference properties:

- AudioJones.
- NinjaAI.
- Content Allies.
- Fame.
- Sweet Fish.
- Buena Vista.
- AppWT.

**Task 6.3:** Generate gap analysis across:

- SEO.
- AEO.
- Schema.
- Pricing.
- FAQ.
- Content.
- Services.
- CRO.
- Entity.
- Internal linking.

Acceptance criteria:

- Crawls are reproducible and documented.
- Outputs separate primary observations from recommendations.
- Competitor analysis informs the Knowledge Catalog and content engine.

### Epic 7: Founder Intelligence Content Engine

**Goal:** Everything useful becomes publishable after review.

**Task 7.1: Call intelligence**

Flow:

```txt
Calls
  -> Questions
  -> Knowledge
  -> Articles
  -> FAQs
  -> Video
  -> Podcast
  -> LinkedIn
  -> Knowledge Catalog
```

**Task 7.2: Pricing content**

Every service should eventually have:

- Pricing guide.
- Cost factors.
- FAQs.
- Mistakes.
- Alternatives.
- Decision guide.

**Task 7.3: Research assets**

Produce:

- State of Founder Intelligence.
- Benchmarks.
- Indexes.
- Calculators.
- Diagnostic reports.

Acceptance criteria:

- Content outputs cite source material or internal evidence class.
- Sales-call and discovery-call material is redacted before publication.
- Content maps back to entities and Knowledge Catalog records.

### Epic 8: Agent Readiness

**Goal:** Prepare for agent-to-agent commerce without overbuilding.

**Phase 1: Current**

- Booking.
- CRM.
- Calendars.
- Structured data.
- Knowledge Catalog.

**Phase 2: Near Future**

- AI Receptionist.
- Lead Qualification.
- Recommendation Engine.
- Proposal Generation.
- Calendar Booking.

**Phase 3: Future**

- Agentic Booking.
- Agent-to-agent workflows.
- Knowledge APIs.
- MCP.
- Business Agent.
- Transaction Agent.

Acceptance criteria:

- Phase 1 improves machine-readability and routing without adding premature
  agent transaction surfaces.
- Phase 2 only starts after diagnostic routing and CRM handoff are reliable.
- Phase 3 requires a separate architecture decision.

### Epic 9: Measurement

**Goal:** Measure whether the platform is becoming more discoverable,
retrievable, and commercially useful.

KPIs:

- AI Citation Share.
- Entity Coverage.
- Knowledge Coverage.
- Structured Data Coverage.
- Index Coverage.
- Prompt Coverage.
- Share of Voice.
- Organic Leads.
- Diagnostic Starts.
- Assessment Completion.
- Revenue Attribution.
- Business Memory Growth.

Acceptance criteria:

- Each KPI has a definition, source, cadence, owner, and failure mode before it
  is placed on a dashboard.
- Diagnostic and revenue metrics distinguish source, attribution window, and
  confidence.
- Measurement does not imply production readiness unless deployment and env
  gates are also complete.

## 10. Recommended Sequence

### Phase 0: Program ratification

Outputs:

- This ADFIP program spec.
- A proposed decision log entry.
- Roadmap pointer.

Gate:

- Human approval to proceed from program spec to implementation.

### Phase 1: Diagnostic Acquisition foundation

Outputs:

- Audit existing diagnostic routes and scoring flows.
- Decide canonical acquisition route hierarchy.
- Implement `/diagnostics/founder-revenue-leak-diagnostic` in a scoped PR.

Gate:

- Route, metadata, schema, FAQ, CTA, pricing reference, breadcrumbs, sitemap,
  and internal links verified.

### Phase 2: Assessment and routing contract

Outputs:

- Founder Intelligence Assessment task spec.
- Scoring model.
- Result-page model.
- CRM and email automation contract.

Gate:

- No CRM/email automation implementation until scoring and persistence
  contracts are approved.

### Phase 3: Knowledge Catalog schema

Outputs:

- Catalog taxonomy.
- Metadata schema.
- Claims Registry format.
- Initial normalization rules.

Gate:

- Ingestion automation waits until catalog schema is stable.

### Phase 4: Entity and schema expansion

Outputs:

- Entity-page map.
- Schema component inventory.
- Structured-data implementation PRs.

Gate:

- Schema validation and sitemap verification pass.

### Phase 5: Intelligence and measurement

Outputs:

- Search Console integration plan.
- Firecrawl crawl plan.
- Weekly report format.
- KPI definitions.

Gate:

- Credentials and private analytics access are handled outside committed code.

### Phase 6: Content engine and agent readiness

Outputs:

- Source-to-content workflow.
- Redaction and approval rules.
- Agent-readiness backlog.

Gate:

- Future agent APIs require separate architecture decisions.

## 11. Risks

- **Scope sprawl:** ADFIP spans site, content, CRM, analytics, and future agent
  systems. Mitigation: one concern per branch and PR.
- **Portal creep:** Business Memory and agent readiness could pull private
  admin functionality into the public site. Mitigation: keep AudioJones.com as
  the public surface only.
- **Premature automation:** Search Console, Firecrawl, CRM, and email work can
  create false confidence if credentials, data quality, and ownership are not
  resolved. Mitigation: document contracts before integration.
- **Entity confusion:** Founder Intelligence, Founder Revenue System, Signal
  terminology, and Business Memory naming have collision risk. Mitigation:
  follow the existing SEO/AEO entity plan and correction audits.
- **Measurement ambiguity:** AI citations, share of voice, and attribution can
  be overclaimed. Mitigation: define source, cadence, and confidence for every
  KPI.

## 12. Open Questions

1. Should "ADFIP" remain an internal program ID, or should the public-facing
   initiative name be only "Founder Intelligence Platform"?
2. Is the canonical paid next step called "Founder Revenue System" or another
   approved successor name?
3. Does the Founder Revenue Leak Diagnostic replace `/ai-readiness-diagnostic`
   as the main public CTA, or does it sit beside the existing readiness route
   during transition?
4. Where should private Business Memory live if it outgrows public-site
   metadata: separate app, internal repo, Sanity dataset, Neon schema, or
   another approved system?
5. Which system owns measurement infrastructure: AudioJones.com, a separate
   analytics repo, Search Console exports, or an internal dashboard?
6. What is the approval path for Firecrawl installation, competitor crawl
   scope, and crawl result storage?
7. Which CRM is canonical for diagnostic handoff in the first implementation
   phase?
8. Which email automation path is approved first: Resend-only, n8n, CRM-native
   automation, or a staged combination?

## 13. Immediate Next Task

After this program spec is approved, the next implementation-ready task should
be:

```txt
Review/Diagnosis owner: Codex
Actionable AI Assistant Task owner: Codex
Execution location/tool: C:\dev\audiojones-adfip on branch docs/adfip-program, then a new feat branch/worktree for implementation
Human/operator role: Approve the ADFIP spec and answer the open naming/routing questions
Copy/paste destination: Codex

Task:
Audit the existing diagnostic acquisition surface and produce a scoped build
spec for /diagnostics/founder-revenue-leak-diagnostic. Do not implement the
route yet. Confirm route hierarchy, CTA destination, pricing reference, schema
requirements, sitemap/internal-linking touchpoints, lead-capture handoff, and
validation commands. Keep the output Git Spec-ready Markdown.
```
