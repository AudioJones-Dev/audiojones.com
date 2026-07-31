---
title: Commercial Cost Evidence Packet
status: evidence-intake-incomplete
type: commercial-cost-evidence
version: v0.1
created: 2026-07-28
owner: AJ Digital LLC
brand: Audio Jones
governed_by: docs/strategy/COMMERCIAL_UNIT_AND_MARGIN_REVIEW.md
authority: docs-only-phase-1-evidence-preparation
pricing_authority: none
quote_authority: none
implementation_authority: none
secret_values_reviewed: false
---

# Commercial Cost Evidence Packet

> **Authority boundary**
>
> This packet prepares the evidence required by the founder-ratified
> Commercial Unit and Margin Review. It does not approve cost inputs, calculate
> or publish prices, issue a quote, create a contract, start a pilot, change
> delivery operations, modify the website, or authorize a commit, push, pull
> request, or deployment.

## 1. Outcome

Phase 1 has established the structure needed to collect and evaluate commercial
cost evidence. It has not established enough evidence to calculate a defensible
dollar price.

Current state:

| Evidence area | Status | Meaning |
| --- | --- | --- |
| Canonical offer units | Ready | Ratified in the governing commercial policy |
| Cost taxonomy and formulas | Ready | Direct cost, P50/P80, margin, and contribution methods are defined |
| Founder delivery cost | Missing | Replacement-cost basis and productive capacity require Audio's input |
| Employee delivery cost | Unknown | No approved role or fully loaded cost schedule was found |
| Contractor delivery cost | Missing | No approved contractor rate card was found |
| Historical delivery hours | Missing | No offer-level time ledger was found |
| Vendor provider inventory | Partial | Marketing-site providers are identifiable; offer-specific runtime providers are not |
| Vendor rate cards | Missing | No current billing rates or invoices were reviewed |
| ResponseOS usage history | Missing | No production interaction, support, or exception data was found |
| Support obligation | Missing | Hours, service window, severity model, and response posture require approval |
| Rework and stabilization history | Missing | No offer-level defect or support ledger was found |
| Sales and acquisition cost | Missing | No offer-level funnel-cost evidence was found |
| Willingness-to-pay evidence | Missing | No structured win/loss or buyer-interview record was found |
| Offer cost cards | Template ready | Cannot be completed until labor, vendor, usage, and support inputs exist |
| Dollar price recommendation | Blocked | Not authorized and not evidence-ready |

## 2. Governing policy

This packet is subordinate to:

- [Commercial Unit and Margin Review v1.0](./COMMERCIAL_UNIT_AND_MARGIN_REVIEW.md)
- [Website Messaging and Offer Integration Specification v1.0](./WEBSITE_MESSAGING_AND_OFFER_INTEGRATION_SPEC.md)

The governing policy requires:

- founder labor at replacement cost;
- offer-level P50 and P80 delivery COGS;
- target and floor margin calculations;
- separation of installation, managed service, variable usage, and net-new
  change scope;
- post-delivery realized-margin review;
- separately approved cost inputs and dollar pricing.

## 3. Evidence-handling rules

### 3.1 What belongs in this packet

- approved internal labor-cost assumptions;
- role-based delivery-hour estimates;
- source and effective date for vendor rates;
- usage and support assumptions;
- direct-cost formulas;
- confidence ratings;
- actual-versus-estimated delivery evidence;
- offer-level cost-card status.

### 3.2 What does not belong in this packet

- credentials, API keys, access tokens, account passwords, or secret values;
- payment-card or banking data;
- employee personal records;
- client-identifying confidential data;
- copied vendor invoices containing account identifiers;
- unapproved public prices or sales promises.

Record a sanitized amount, unit, source type, effective date, and evidence
owner. Keep original invoices and sensitive source documents in the approved
financial or credential system, not in Git.

### 3.3 Evidence status vocabulary

| Status | Meaning |
| --- | --- |
| Verified | Supported by an inspected source within the stated scope |
| Operator supplied | Provided by Audio or an authorized financial owner |
| Estimated | Reasoned planning input without observed delivery history |
| Observed | Measured from a completed comparable engagement |
| Stale | Source exists but is outside the approved review window |
| Missing | Required evidence was not found or supplied |
| Not applicable | Cost or evidence category does not apply to the scoped unit |

### 3.4 Confidence vocabulary

| Confidence | Standard |
| --- | --- |
| High | Current invoice, approved compensation schedule, or three or more comparable observed deliveries |
| Medium | Current rate card or one to two comparable observed deliveries |
| Low | Planning estimate, memory-derived input, or non-comparable work |
| Unknown | No evidence |

## 4. Repository evidence inventory

### 4.1 Verified marketing-site providers

The repository identifies these possible website or commerce providers:

| Provider or category | Repository evidence | Commercial interpretation |
| --- | --- | --- |
| Vercel | Deployment and package configuration | Marketing-site hosting; not automatically a client-delivery COGS item |
| Cloudflare | Canonical edge/DNS posture and possible R2 storage | Shared brand infrastructure unless a client-specific resource is created |
| Sanity | CMS configuration | Marketing content infrastructure |
| NeonDB | Website lead and structured-data persistence | Marketing-site infrastructure unless a client environment uses it |
| Resend | Lead notifications and transactional email | Website operating cost; client usage must be separately identified |
| n8n | Optional automation webhooks | Potential shared or client delivery cost; hosting and execution model are unknown |
| Supabase | Optional auth, storage, or realtime | Potential future/client cost; only include when actually used |
| Whop | Licensing and customer-management integration | Commerce cost; offer-specific use and fees require evidence |
| Stripe | Payment processing | Direct variable commercial cost when AJ Digital absorbs it |
| ImageKit | Media CDN | Marketing or client-specific cost depending on asset ownership |
| OpenAI | Optional AI service configuration | Provider presence only; model, usage, and offer allocation are unknown |

Verified source locations:

- [Environment template](../../.env.example)
- [Environment schema](../../packages/config/env.schema.ts)
- [Package manifest](../../package.json)
- [Backend stack](../architecture/backend-stack.md)
- [Deployment documentation](../DEPLOYMENT.md)

No secret values were opened or recorded.

### 4.2 ResponseOS evidence

Repository documentation describes potential ResponseOS capability including:

- inbound SMS capture;
- voice routing and transcription;
- missed-call text-back;
- web-form intake;
- CRM synchronization;
- routing rules;
- calendar booking;
- human escalation;
- real-time notifications;
- reporting;
- multi-location and after-hours flows.

The reviewed source does not establish:

- a production telephony provider;
- a production transcription provider;
- a production messaging provider;
- a production model and token profile;
- a supported CRM integration matrix;
- provider account ownership;
- vendor rate cards;
- client usage volumes;
- exception-review rates;
- support incidents;
- production service levels.

The ResponseOS brief explicitly warns that planned integrations must not be
presented as shipped.

Sources:

- [ResponseOS delivery posture](../sop/offer-ecosystem/Agent%20OS/ResponseOS.md)
- [ResponseOS v1 brief](../codex/responseos-v1-brief.md)
- [Canonical ResponseOS commercial policy](./COMMERCIAL_UNIT_AND_MARGIN_REVIEW.md#9-responseos-cost-waterfall)

### 4.3 Evidence not found

A scoped filename and content review found no repository-governed:

- timesheet or offer-level time log;
- approved founder replacement-cost schedule;
- employee fully loaded cost schedule;
- contractor rate card;
- sanitized vendor invoice register;
- client-specific usage ledger;
- ResponseOS incident or support log;
- rework or stabilization ledger;
- realized offer-margin report;
- offer-level acquisition-cost report;
- structured proposal win/loss record.

This is not proof that the information does not exist elsewhere. It means the
evidence was not available in the reviewed repository and must be supplied or
referenced by its authorized owner.

## 5. Cost-input register

Complete one row per input. Do not enter credentials or sensitive account
identifiers.

| Input ID | Input | Value | Unit | Source type | Effective date | Owner | Status | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LAB-001 | Founder replacement cost | TBD | USD per productive delivery hour | Compensation or qualified replacement evidence | TBD | Audio | Missing | Unknown |
| LAB-002 | Founder annual productive delivery capacity | TBD | Hours per year | Calendar and capacity model | TBD | Audio | Missing | Unknown |
| LAB-003 | Employee role 1 fully loaded cost | TBD | USD per productive delivery hour | Payroll/benefit schedule | TBD | Audio | Missing | Unknown |
| LAB-004 | Contractor architecture rate | TBD | USD per hour or fixed unit | Current rate card | TBD | Audio | Missing | Unknown |
| LAB-005 | Contractor implementation rate | TBD | USD per hour or fixed unit | Current rate card | TBD | Audio | Missing | Unknown |
| LAB-006 | Contractor QA/security rate | TBD | USD per hour or fixed unit | Current rate card | TBD | Audio | Missing | Unknown |
| COM-001 | Payment-processing rate | TBD | Percent plus fixed transaction amount | Current provider schedule | TBD | Audio | Missing | Unknown |
| MKT-001 | Qualified-opportunity acquisition cost | TBD | USD per qualified opportunity | Marketing and sales ledger | TBD | Audio | Missing | Unknown |
| SUP-001 | Standard support window | TBD | Hours and time zone | Founder decision | TBD | Audio | Missing | Unknown |
| SUP-002 | Standard response objectives | TBD | Hours by severity | Founder decision | TBD | Audio | Missing | Unknown |
| SUP-003 | Standard stabilization window | 30 proposed | Calendar days | Ratified policy assumption | 2026-07-28 | Audio | Estimated | Low |
| RSK-001 | Standard installation risk reserve | TBD | Percent of direct COGS | Delivery evidence | TBD | Audio | Missing | Unknown |
| RSK-002 | Standard architecture risk reserve | TBD | Percent of direct COGS | Delivery evidence | TBD | Audio | Missing | Unknown |
| DSC-001 | Discount approval owner | TBD | Named role | Founder decision | TBD | Audio | Missing | Unknown |

## 6. Founder replacement-cost worksheet

Use either a qualified replacement method or a target-compensation method.
Use the higher result unless Audio explicitly approves another basis.

### Method A — Qualified replacement

| Input | Value |
| --- | --- |
| Comparable role title | TBD |
| Current annual cash compensation | TBD |
| Payroll burden and benefits | TBD |
| Role-specific delivery tools | TBD |
| Annual productive delivery hours | TBD |
| Fully loaded annual replacement cost | TBD |
| Replacement cost per productive hour | TBD |
| Source and effective date | TBD |

```text
Replacement cost per productive hour =
  fully loaded annual replacement cost
  / annual productive delivery hours
```

### Method B — Founder target compensation

| Input | Value |
| --- | --- |
| Target annual delivery compensation | TBD |
| Payroll/tax/benefit burden used for planning | TBD |
| Direct role-specific tools | TBD |
| Available working weeks | TBD |
| Less leave, holidays, and training | TBD |
| Less sales, admin, and leadership capacity | TBD |
| Annual productive delivery hours | TBD |
| Founder internal delivery cost per hour | TBD |

Do not use all calendar work hours as the denominator. That would understate
the cost of delivery and overstate margin.

## 7. Universal cost-card template

Copy this section once per approved offer version.

### Offer identity

| Field | Entry |
| --- | --- |
| Canonical offer | TBD |
| Scope version | TBD |
| Effective date | TBD |
| Commercial unit | TBD |
| Acceptance condition | TBD |
| Included scope | TBD |
| Exclusions | TBD |
| Change triggers | TBD |
| Stabilization/support included | TBD |
| Evidence owner | TBD |

### Labor model

| Phase | Role | P50 hours | P80 hours | Cost per hour | P50 cost | P80 cost | Evidence status |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Qualification handoff | TBD | TBD | TBD | TBD | TBD | TBD | Missing |
| Discovery/intake | TBD | TBD | TBD | TBD | TBD | TBD | Missing |
| Analysis/architecture | TBD | TBD | TBD | TBD | TBD | TBD | Missing |
| Build/configuration | TBD | TBD | TBD | TBD | TBD | TBD | Missing |
| Integration/data work | TBD | TBD | TBD | TBD | TBD | TBD | Missing |
| QA/governance review | TBD | TBD | TBD | TBD | TBD | TBD | Missing |
| Client review/revision | TBD | TBD | TBD | TBD | TBD | TBD | Missing |
| Training/handoff | TBD | TBD | TBD | TBD | TBD | TBD | Missing |
| Stabilization/support | TBD | TBD | TBD | TBD | TBD | TBD | Missing |
| Project management | TBD | TBD | TBD | TBD | TBD | TBD | Missing |
| **Total labor** |  | **TBD** | **TBD** |  | **TBD** | **TBD** |  |

### Non-labor direct cost

| Cost category | Setup cost | Recurring cost | Usage basis | Client funded? | P50 cost | P80 cost | Evidence |
| --- | ---: | ---: | --- | --- | ---: | ---: | --- |
| Client-specific software | TBD | TBD | TBD | TBD | TBD | TBD | Missing |
| Infrastructure | TBD | TBD | TBD | TBD | TBD | TBD | Missing |
| Communications | TBD | TBD | TBD | TBD | TBD | TBD | Missing |
| Model/transcription usage | TBD | TBD | TBD | TBD | TBD | TBD | Missing |
| Contractor fixed fees | TBD | TBD | TBD | TBD | TBD | TBD | Missing |
| Travel/other fulfillment | TBD | TBD | TBD | TBD | TBD | TBD | Missing |
| Payment processing | TBD | TBD | Transaction | No/TBD | TBD | TBD | Missing |
| **Total non-labor** | **TBD** | **TBD** |  |  | **TBD** | **TBD** |  |

### Risk and margin

| Calculation | Value |
| --- | ---: |
| P50 labor COGS | TBD |
| P50 non-labor COGS | TBD |
| P50 rework reserve | TBD |
| **P50 delivery COGS** | **TBD** |
| P80 labor COGS | TBD |
| P80 non-labor COGS | TBD |
| P80 scope-risk reserve | TBD |
| **P80 delivery COGS** | **TBD** |
| Ratified target gross margin | Offer-specific ratified band |
| Ratified gross-margin floor | Offer-specific ratified floor |
| Minimum fee at floor | Blocked until P80 COGS exists |
| Target fee | Blocked until P80 COGS exists |
| Offer-specific acquisition cost | TBD |
| Projected contribution margin | Blocked |

## 8. Founder Intelligence Diagnostic cost card

**Ratified unit:** one operating entity, one primary revenue or execution
journey, up to four stakeholder interviews, up to six approved evidence
sources or systems, one synthesis, one readout, one factual-correction cycle,
and one final report.

### Required effort inputs

| Work item | P50 hours | P80 hours | Primary role | Evidence source |
| --- | ---: | ---: | --- | --- |
| Qualification handoff and intake review | TBD | TBD | TBD | Missing |
| Stakeholder interview preparation | TBD | TBD | TBD | Missing |
| Stakeholder interviews | TBD | TBD | TBD | Missing |
| Evidence-source access and sampling | TBD | TBD | TBD | Missing |
| Operating and knowledge mapping | TBD | TBD | TBD | Missing |
| Leak, risk, and AI-readiness analysis | TBD | TBD | TBD | Missing |
| Recommendation synthesis | TBD | TBD | TBD | Missing |
| Report production | TBD | TBD | TBD | Missing |
| Decision readout | TBD | TBD | TBD | Missing |
| Factual-correction cycle | TBD | TBD | TBD | Missing |
| Project management | TBD | TBD | TBD | Missing |

### Evidence needed first

- one to three comparable diagnostic delivery records, if available;
- actual interview preparation and synthesis time;
- report-production time;
- evidence-access failure and client-delay rates;
- rework caused by contradictory or incomplete sources;
- acquisition and sales time attributable to a paid diagnostic.

## 9. Business Memory and SOP Architecture cost card

**Ratified unit:** one architecture core for one operating domain, including
source/authority map, terminology, governance rules, architecture, three
priority workflow/SOP designs, instruction patterns, and maintenance plan.

### Required effort inputs

| Work item | P50 hours | P80 hours | Primary role | Evidence source |
| --- | ---: | ---: | --- | --- |
| Architecture intake | TBD | TBD | TBD | Missing |
| Source inventory and access review | TBD | TBD | TBD | Missing |
| Knowledge extraction | TBD | TBD | TBD | Missing |
| Terminology/taxonomy design | TBD | TBD | TBD | Missing |
| Source and authority mapping | TBD | TBD | TBD | Missing |
| Governance-rule design | TBD | TBD | TBD | Missing |
| Three workflow/SOP designs | TBD | TBD | TBD | Missing |
| Human/agent instruction patterns | TBD | TBD | TBD | Missing |
| Validation facilitation | TBD | TBD | TBD | Missing |
| Architecture package and handoff | TBD | TBD | TBD | Missing |
| Project management | TBD | TBD | TBD | Missing |

### Complexity inputs

| Driver | Base assumption | Actual |
| --- | --- | --- |
| Operating domains | 1 | TBD |
| Priority workflows | 3 | TBD |
| Stakeholders | TBD | TBD |
| Authoritative systems | TBD | TBD |
| Restricted-data categories | None unless scoped | TBD |
| Contradictory source burden | Low/medium/high | TBD |
| Additional SOP blocks | None | TBD |
| Additional agent-context packages | None | TBD |

## 10. ResponseOS installation cost card

**Ratified base:** one entity/brand, one location, one primary inbound
channel/number, one CRM/system of record, one qualification/routing matrix, one
recovery sequence, one escalation path, one reporting view, governance policy,
acceptance, training, and finite stabilization.

### Installation effort inputs

| Work item | P50 hours | P80 hours | Primary role | Evidence source |
| --- | ---: | ---: | --- | --- |
| Workflow discovery | TBD | TBD | TBD | Missing |
| Channel/provider setup | TBD | TBD | TBD | Missing |
| Qualification and routing design | TBD | TBD | TBD | Missing |
| Recovery-sequence design | TBD | TBD | TBD | Missing |
| CRM/event mapping | TBD | TBD | TBD | Missing |
| Integration implementation | TBD | TBD | TBD | Missing |
| Consent/governance policy | TBD | TBD | TBD | Missing |
| Test scenario creation | TBD | TBD | TBD | Missing |
| Failure-path and escalation testing | TBD | TBD | TBD | Missing |
| Reporting setup | TBD | TBD | TBD | Missing |
| Client training and handoff | TBD | TBD | TBD | Missing |
| Production acceptance | TBD | TBD | TBD | Missing |
| Stabilization | TBD | TBD | TBD | Missing |
| Project management | TBD | TBD | TBD | Missing |

### Provider decision register

| Function | Proposed provider | Account owner | Rate-card source | Status |
| --- | --- | --- | --- | --- |
| Telephone numbers/calling | TBD | TBD | TBD | Missing |
| SMS/messaging | TBD | TBD | TBD | Missing |
| Transcription | TBD | TBD | TBD | Missing |
| Model inference | TBD | TBD | TBD | Missing |
| Workflow automation | TBD | TBD | TBD | Missing |
| CRM | Client-specific | TBD | TBD | Missing |
| Calendar | Client-specific | TBD | TBD | Missing |
| Email | TBD | TBD | TBD | Missing |
| Database/storage | TBD | TBD | TBD | Missing |
| Monitoring/logging | TBD | TBD | TBD | Missing |
| Reporting | TBD | TBD | TBD | Missing |

### Expansion-module evidence

| Module | Incremental P50 hours | Incremental P80 hours | Setup cost | Recurring cost | Evidence |
| --- | ---: | ---: | ---: | ---: | --- |
| Additional location/brand | TBD | TBD | TBD | TBD | Missing |
| Additional channel/number | TBD | TBD | TBD | TBD | Missing |
| Additional language | TBD | TBD | TBD | TBD | Missing |
| Additional CRM/integration | TBD | TBD | TBD | TBD | Missing |
| Additional routing workflow | TBD | TBD | TBD | TBD | Missing |
| Additional recovery workflow | TBD | TBD | TBD | TBD | Missing |
| Advanced attribution | TBD | TBD | TBD | TBD | Missing |
| Regulated-data controls | TBD | TBD | TBD | TBD | Missing |
| Migration/remediation | TBD | TBD | TBD | TBD | Missing |
| After-hours human coverage | TBD | TBD | TBD | TBD | Missing |

## 11. ResponseOS recurring usage model

Complete low, base, and high scenarios before evaluating a managed fee.

| Usage driver | Low | Base | High | Billing unit | Provider rate | Included or passed through? |
| --- | ---: | ---: | ---: | --- | ---: | --- |
| Active telephone numbers | TBD | TBD | TBD | Number/month | TBD | TBD |
| Inbound calls | TBD | TBD | TBD | Calls/month | TBD | TBD |
| Inbound call minutes | TBD | TBD | TBD | Minutes/month | TBD | TBD |
| Outbound call minutes | TBD | TBD | TBD | Minutes/month | TBD | TBD |
| SMS/messages sent | TBD | TBD | TBD | Messages/month | TBD | TBD |
| SMS/messages received | TBD | TBD | TBD | Messages/month | TBD | TBD |
| Transcription minutes | TBD | TBD | TBD | Minutes/month | TBD | TBD |
| Model invocations | TBD | TBD | TBD | Calls/month | TBD | TBD |
| Model input/output usage | TBD | TBD | TBD | Provider unit | TBD | TBD |
| Automation executions | TBD | TBD | TBD | Executions/month | TBD | TBD |
| Stored recordings/transcripts | TBD | TBD | TBD | GB/month | TBD | TBD |
| Retention | TBD | TBD | TBD | Months | TBD | TBD |
| Notification emails | TBD | TBD | TBD | Emails/month | TBD | TBD |
| Monitoring/log volume | TBD | TBD | TBD | Provider unit | TBD | TBD |
| Human exceptions | TBD | TBD | TBD | Cases/month | TBD | TBD |

### Recurring labor

| Work item | Low hours | Base hours | High hours | Role | Cost/hour |
| --- | ---: | ---: | ---: | --- | ---: |
| System health review | TBD | TBD | TBD | TBD | TBD |
| Workflow-performance review | TBD | TBD | TBD | TBD | TBD |
| Exception review | TBD | TBD | TBD | TBD | TBD |
| Incident handling | TBD | TBD | TBD | TBD | TBD |
| Bounded optimization | TBD | TBD | TBD | TBD | TBD |
| Reporting | TBD | TBD | TBD | TBD | TBD |
| Client communication | TBD | TBD | TBD | TBD | TBD |
| Vendor/integration maintenance | TBD | TBD | TBD | TBD | TBD |

### Scenario calculations

```text
Variable vendor COGS =
  sum(usage quantity × current provider rate)

Recurring labor COGS =
  sum(hours by activity × fully loaded role cost)

Recurring scenario COGS =
  variable vendor COGS
  + recurring labor COGS
  + client-specific fixed platforms
  + support/rework reserve
  + absorbed payment-processing cost
```

The high scenario must trigger an approved capacity-band change, overage,
pass-through reconciliation, or rescope before margin becomes unbounded.

## 12. AI Agent System Installation cost card

**Ratified unit:** one production agent role, one bounded business outcome, one
approved harness, one instruction package, one authority/approval matrix, one
primary workflow, bounded tools/sources, evaluations, failure behavior, audit
requirements, training, and handoff.

| Work item | P50 hours | P80 hours | Primary role | Evidence source |
| --- | ---: | ---: | --- | --- |
| Role and outcome definition | TBD | TBD | TBD | Missing |
| Source/tool inventory | TBD | TBD | TBD | Missing |
| Instruction/context architecture | TBD | TBD | TBD | Missing |
| Authority and approval design | TBD | TBD | TBD | Missing |
| Workflow implementation | TBD | TBD | TBD | Missing |
| Tool integration | TBD | TBD | TBD | Missing |
| Evaluation-set design | TBD | TBD | TBD | Missing |
| Failure and escalation testing | TBD | TBD | TBD | Missing |
| Audit/observability setup | TBD | TBD | TBD | Missing |
| Training/handoff | TBD | TBD | TBD | Missing |
| Stabilization | TBD | TBD | TBD | Missing |
| Project management | TBD | TBD | TBD | Missing |

Required usage inputs:

- approved harness and billing owner;
- model/provider and rate source;
- low/base/high model usage;
- tool/API usage;
- storage and logging;
- expected exception and approval rate;
- ongoing evaluation and maintenance cadence.

## 13. Custom Application Build cost card

No cost card should be completed until paid discovery or architecture defines:

- scope and milestones;
- environments;
- integrations;
- data condition and migration;
- security and quality gates;
- acceptance criteria;
- deployment responsibility;
- warranty and maintenance boundary.

| Milestone | Deliverable | P50 labor | P80 labor | Non-labor cost | Risk reserve | Evidence |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Discovery/architecture | TBD | TBD | TBD | TBD | TBD | Missing |
| Foundation | TBD | TBD | TBD | TBD | TBD | Missing |
| Core workflow | TBD | TBD | TBD | TBD | TBD | Missing |
| Integrations | TBD | TBD | TBD | TBD | TBD | Missing |
| QA/security | TBD | TBD | TBD | TBD | TBD | Missing |
| Acceptance/handoff | TBD | TBD | TBD | TBD | TBD | Missing |
| Stabilization | TBD | TBD | TBD | TBD | TBD | Missing |

Do not derive a fixed fee from a verbal feature list or the current broad
website range.

## 14. Founder Intelligence System Installation cost card

Build this card from approved module cost cards.

```text
FIS P80 delivery COGS =
  sum(approved module P80 COGS)
  + cross-module integration cost
  + program-management cost
  + cross-module QA/governance cost
  + dependency/risk reserve
```

| Component | Scope version | P80 COGS | Dependency | Evidence |
| --- | --- | ---: | --- | --- |
| Business Memory/SOP Architecture | TBD | TBD | TBD | Missing |
| ResponseOS | TBD | TBD | TBD | Missing |
| AI Agent System | TBD | TBD | TBD | Missing |
| Custom Application | TBD | TBD | TBD | Missing |
| Attribution/reporting | TBD | TBD | TBD | Missing |
| Program management | TBD | TBD | TBD | Missing |
| Cross-module QA/governance | TBD | TBD | TBD | Missing |
| Risk reserve | TBD | TBD | TBD | Missing |

No bundle discount is modeled until measured reuse creates a documented cost
reduction.

## 15. Managed Intelligence cost card

**Ratified unit:** one monthly managed-system capacity band with explicit
system count, review cadence, optimization capacity, support window, response
objectives, governance maintenance, and vendor-usage treatment.

### Service boundary inputs

| Input | Value | Status |
| --- | --- | --- |
| Installed systems included | TBD | Missing |
| Monthly health reviews | TBD | Missing |
| Reporting cadence | TBD | Missing |
| Memory/SOP review cycles | TBD | Missing |
| Optimization capacity | TBD | Missing |
| Incident/exception allowance | TBD | Missing |
| Support window/time zone | TBD | Missing |
| Response objectives | TBD | Missing |
| After-hours posture | Excluded unless separately staffed and costed | Ratified |
| Variable usage treatment | TBD | Missing |
| Net-new installation scope | Excluded/change order | Ratified |

### Recurring effort inputs

| Activity | P50 hours/month | P80 hours/month | Role | Cost/hour | Evidence |
| --- | ---: | ---: | --- | ---: | --- |
| System health review | TBD | TBD | TBD | TBD | Missing |
| Memory/SOP maintenance | TBD | TBD | TBD | TBD | Missing |
| Agent/workflow review | TBD | TBD | TBD | TBD | Missing |
| Governance/evidence review | TBD | TBD | TBD | TBD | Missing |
| Reporting/readout | TBD | TBD | TBD | TBD | Missing |
| Incident/exception handling | TBD | TBD | TBD | TBD | Missing |
| Bounded optimization | TBD | TBD | TBD | TBD | Missing |
| Client communication | TBD | TBD | TBD | TBD | Missing |
| Account/project management | TBD | TBD | TBD | TBD | Missing |

The first month must include an explicit activation cost or inherit completed
transition work from the preceding installation. Do not hide remediation in
steady-state monthly margin.

## 16. Sales and contribution evidence

Gross margin alone is insufficient. Complete this register by offer:

| Offer | Qualified opportunities | Proposals | Wins | Losses | Discounts | Acquisition cost | Sales hours | Collection loss | Confidence |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Founder Intelligence Diagnostic | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Unknown |
| Business Memory/SOP Architecture | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Unknown |
| ResponseOS Installation | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Unknown |
| AI Agent System Installation | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Unknown |
| Custom Application Build | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Unknown |
| Founder Intelligence System | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Unknown |
| Managed Intelligence | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | Unknown |

Track buyer-value evidence separately:

- revenue at risk or recoverable;
- labor or vendor cost displaced;
- cycle-time reduction;
- conversion or retention effect;
- compliance or operating-risk reduction;
- founder time returned;
- switching and change-management cost;
- confidence and attribution limitations.

Cost sets the minimum viable fee. Buyer value and willingness to pay determine
whether the offer can support a higher fee. Neither should be inferred from the
current website price.

## 17. Post-delivery evidence log

Create one record per completed engagement:

| Field | Entry |
| --- | --- |
| Engagement ID | Sanitized internal identifier |
| Offer and scope version | TBD |
| Start/end dates | TBD |
| Estimate confidence at quote | TBD |
| Estimated P50/P80 labor | TBD |
| Actual labor by phase/role | TBD |
| Estimated/actual vendor cost | TBD |
| Included support/rework | TBD |
| Out-of-scope work | TBD |
| Change orders | TBD |
| Client-delay days | TBD |
| Net collected service revenue | TBD |
| Realized delivery COGS | TBD |
| Realized gross margin | TBD |
| Attributable acquisition cost | TBD |
| Realized contribution margin | TBD |
| Variance explanation | TBD |
| Unit/scope wording changes | TBD |
| Cost-card update owner/date | TBD |

Do not include client-confidential content in the Git record. Reference the
approved private source by sanitized identifier.

## 18. Operator input checklist

Audio or an authorized financial owner must supply or approve:

### Labor and capacity

- [ ] Founder replacement-cost method.
- [ ] Founder productive delivery hours.
- [ ] Employee roles and fully loaded costs, if applicable.
- [ ] Contractor roles and current rate cards.
- [ ] Delivery ownership by offer and phase.

### Vendors and usage

- [ ] Current provider rate cards without credentials.
- [ ] Account ownership: AJ Digital, client, or pass-through.
- [ ] ResponseOS provider decisions.
- [ ] Low/base/high ResponseOS usage.
- [ ] AI agent model and tool usage assumptions.
- [ ] Shared infrastructure allocation policy.

### Support and risk

- [ ] Standard support window and time zone.
- [ ] Severity and response objectives.
- [ ] Stabilization duration.
- [ ] Expected incident and exception load.
- [ ] Rework and scope-risk reserve method.
- [ ] Client-delay/remobilization policy inputs.

### Sales and finance

- [ ] Payment-processing schedule.
- [ ] Acquisition and sales effort by offer.
- [ ] Discount authority.
- [ ] Collection and refund evidence.
- [ ] Accounting classification review.
- [ ] Legal review owner.

### Delivery evidence

- [ ] Up to three comparable completed engagements per offer, if available.
- [ ] Actual time by phase.
- [ ] Vendor and contractor direct costs.
- [ ] Support, rework, and stabilization effort.
- [ ] Proposal win/loss and willingness-to-pay evidence.

## 19. Recommended secure input method

Do not paste credentials, full invoices, banking data, or personal employee
records into chat or Git.

Recommended workflow:

1. Audio completes a private working copy of the cost-input register.
2. Sensitive source documents remain in the approved financial system.
3. The repository receives sanitized values, source types, effective dates,
   owners, and confidence levels only after Audio approves them for Git.
4. Codex receives a separately authorized, scoped task to populate the
   internal cost cards.
5. Codex calculates P50/P80 COGS and margin floors without publishing or
   changing prices.
6. Audio reviews a private price recommendation as a new decision gate.

## 20. Phase status and next gate

### Complete

- Phase 1 evidence structure.
- Secret-safe repository provider inventory.
- Evidence-gap register.
- Founder replacement-cost worksheet.
- Universal offer cost-card template.
- Offer-specific labor and complexity templates.
- ResponseOS setup and recurring usage model.
- Managed Intelligence capacity model.
- Sales/contribution and post-delivery evidence templates.

### Incomplete

- All operator-supplied labor costs.
- Vendor rate cards and ownership.
- Historical delivery hours.
- ResponseOS usage scenarios.
- Support and risk inputs.
- Acquisition and willingness-to-pay evidence.
- Completed offer cost cards.

### Blocked and unauthorized

- P50/P80 dollar COGS.
- Minimum or target dollar fees.
- Private price book.
- Quote issuance.
- Public pricing.
- Client pilot or delivery.
- Contract adoption.
- Website or checkout changes.
- Commit, push, pull request, or deployment.

### Next decision gate

After the required inputs are supplied:

```text
PROCEED with docs-only internal cost-card calculation using the approved
sanitized inputs.

Do not publish or change private or public prices, issue quotes, change
contracts, begin pilots, modify the website, commit, push, create a PR, or
deploy.
```

## 21. Success criteria

This packet is complete when:

1. every required input has a value, unit, source, date, owner, status, and
   confidence;
2. every canonical offer has a scoped P50/P80 labor model;
3. every client-specific provider has a current rate source and billing owner;
4. ResponseOS has low/base/high usage and support scenarios;
5. shared infrastructure is separated from direct client COGS;
6. installation, recurring service, usage, and change work are separated;
7. each offer has P50/P80 delivery COGS;
8. the cost cards can calculate margin without using current website prices;
9. evidence limitations remain explicit;
10. dollar pricing remains behind a separate founder decision.
