# Multi-Repo Copilot Prompts for Audio Jones Ecosystem

**Date:** November 17, 2025  
**Purpose:** Tight, behavior-focused Copilot prompts for advancing the Audio Jones platform across multiple repositories.

---

## 0. Ground Rule: Open Each Repo in Its Own VS Code Window

Use separate windows to avoid context confusion:

```powershell
cd "C:\Users\tyron.AUDIOJONES\OneDrive\Documents\AJDIGITAL\DEV\audiojones.com"
code .

cd "C:\Users\tyron.AUDIOJONES\OneDrive\Documents\AJDIGITAL\DEV\audiojones-client"
code .

cd "C:\Users\tyron.AUDIOJONES\OneDrive\Documents\AJDIGITAL\DEV\audiojones-admin"
code .

cd "C:\Users\tyron.AUDIOJONES\OneDrive\Documents\AJDIGITAL\DEV\ajdigital systems infrastructure\AJDIGITAL REPO INFRASTRUCTURE\ajdigital-automation-hub"
code .
```

**Run the matching prompt only inside that repo's VS Code window.**

---

## 1) Copilot Prompt – `audiojones-client` (Client Portal, Whop-Aware Bookings)

**Paste this in Copilot Chat inside the `audiojones-client` window:**

```text
You are operating inside the audiojones-client repo (Next.js 16 App Router, Tailwind, Firebase Auth, Firestore, Whop-aware booking flow already in place).

Global constraints:
- Do NOT touch Firebase config, .env, or env validation scripts.
- Do NOT modify Next.js or Vercel config.
- Do NOT break existing routing or protected route patterns.
- Reuse existing BookingWizard, dashboard, and TenantContext patterns.
- Keep status values consistent with existing BookingStatus types (including PENDING_PAYMENT).

GOAL: Finish the "client-facing" behavior so a logged-in user can:
- See services segmented by module (Client Delivery, Marketing Automation, AI Optimization, Data Intelligence) and persona (Creator vs Business).
- Book sessions that clearly show payment expectations (Whop-aware) and booking status.
- See a clear "system journey" in the dashboard tied to those modules.

Tasks (execute in order):

1) Service taxonomy + filters
- Inspect current service types and APIs:
  - src/lib/types.ts
  - src/lib/types/firestore.ts
  - src/app/api/client/services/route.ts
  - Any components rendering service cards (Book a Session page).
- Introduce:

  - A `module` field on services (one of: "client-delivery", "marketing-automation", "ai-optimization", "data-intelligence").
  - A `persona` field (one of: "creator", "business", "both").

- Update services API to include these fields.
- Update the "Book a Session" page to:
  - Add filters for "All / Creators / Businesses".
  - Add filters or pill indicators for module (Client Delivery, Marketing Automation, AI Optimization, Data Intelligence).
  - Keep styling consistent with Audio Jones brand / existing UI.

2) Whop-aware UX in booking flow
- In the BookingWizard and the booking API:
  - Make sure that when a service has `billingProvider === "whop"` and `whop.url` is present, the user clearly sees:
    - That payment happens via Whop.
    - That their booking status will be "Awaiting Payment" (PENDING_PAYMENT) until payment is confirmed.
  - Confirm:
    - Booking creation sets initial status to PENDING_PAYMENT when billingProvider is "whop" or "stripe".
    - The wizard displays a clear CTA "Complete Payment on Whop" with the URL, and instruction text.
- Add a small explanatory block in the confirmation step summarizing:
  - Current booking status.
  - Next step (pay → confirm → schedule, if applicable).

3) Dashboard "system journey" panel
- In the client dashboard page, add a "Your System Journey" panel that:
  - Uses the module names (Client Delivery, Marketing Automation, AI Optimization, Data Intelligence).
  - Shows per-module progress based on the user's bookings:
    - e.g., "In progress", "Not started", "Active", "Recently completed".
  - The logic can be approximate:
    - If user has any bookings for a module in non-cancelled status → "Active".
    - If user has completed status bookings → "Completed".
    - Otherwise → "Not started".
- Represent this as cards or a small stepper with icons, using the existing design system and colors.

4) My Bookings details upgrade
- Enhance the booking detail panel/modal to:
  - Explicitly show:
    - Module name (mapped from service.module).
    - Persona tag (Creator / Business / Both).
    - Billing provider.
    - Payment status label (including "Awaiting Payment" for PENDING_PAYMENT).
    - A link to payment URL if present (and a note if missing).
- Ensure status labels use the label mapper (e.g., "Awaiting Payment" instead of "pending_payment").

5) Wiring + polish
- After implementing everything:
  - Run: npm run build
  - Fix any TypeScript or runtime errors until build passes.
- Then:
  - git add -A
  - git commit -m "feat: module-aware services and Whop-first booking UX"
  - git push origin main

Finally, summarize:
- Files changed/created.
- New fields added to types.
- Any TODOs left (e.g., real Whop webhooks).
```

---

## 2) Copilot Prompt – `audiojones-admin` (Multi-Tenant Control + Modules + Whop View)

**Paste this in Copilot Chat inside the `audiojones-admin` window:**

```text
You are operating inside the audiojones-admin repo (Next.js 16 App Router, Tailwind, Firebase Auth, Firestore, AdminContext, TenantSelector, Whop integration skeleton).

Global constraints:
- Do NOT alter Firebase config, env validation, or CI configuration.
- Do NOT break Auth layout, protected routes, or TenantSelector behavior.
- Reuse existing admin API routes under /api/admin/* and avoid mocks.
- Respect existing types in src/lib and Firestore models.

GOAL: Give the admin a clear control surface over:
- Modules (Client Delivery, Marketing Automation, AI Optimization, Data Intelligence).
- Services per module and per tenant.
- Bookings per module and per status (including pending payment).
- Whop-linked services (visibility into what's wired / not wired).

Tasks (execute in order):

1) Module-aware services management
- Inspect:
  - src/app/(protected)/services/page.tsx
  - Any relevant types in src/lib (Service, WhopConfig, BillingProvider, etc.)
- Extend the services table + edit form to:
  - Display module and persona for each service.
  - Allow admin to set:
    - module: "client-delivery" | "marketing-automation" | "ai-optimization" | "data-intelligence"
    - persona: "creator" | "business" | "both"
- These fields must be persisted to Firestore via the existing admin services API route (if no route yet, create /api/admin/services accordingly).
- Add basic filters at the top:
  - Module filter (All + four modules).
  - Persona filter (All / Creators / Businesses).

2) Whop integration console
- On the same services page (or a new tab/section), surface a concise Whop integration view:
  - For each service:
    - Show a chip or small column indicating:
      - Whop: "Not linked" if no whop.productId.
      - "Linked" if whop.productId exists.
      - "Sync enabled" if whop.syncEnabled is true.
  - If `WHOP_API_KEY` is NOT present in env, show a non-blocking warning in the UI:
    - "Whop API key not configured. Sync will be skipped."
- Wire this to the existing whop.ts helper; do not introduce new env vars.

3) Module-centric bookings management
- Expand the existing bookings admin view:
  - Add optional filters:
    - By module (derived from service.module via join).
    - By status, including "Awaiting Payment" (PENDING_PAYMENT).
  - In each booking row / detail drawer, show:
    - Module name.
    - Persona (from service).
    - Billing provider.
    - Payment-related status info (e.g., PENDING_PAYMENT should read "Awaiting Payment").
- Reuse existing Firestore joins in /api/admin/bookings and /api/admin/tenants/[tenantId]/bookings; extend them to include module and persona from service.

4) Systems overview for admin
- Add a new protected admin page:
  - Route: /systems
  - This should be a high-level admin view of the four modules:
    - Each module card should show:
      - Count of active services in that module for the selected tenant.
      - Count of active bookings in that module (for selected tenant).
      - Any bookings in PENDING_PAYMENT for that module.
  - Must respect AdminContext and TenantSelector:
    - When tenant changes, this page reflects new tenant's stats.
- Implement backend helper(s) and/or reuse existing admin APIs to compute these counts; avoid N+1 querying where possible but keep implementation straightforward.

5) Wiring + guardrails
- Ensure all new pages are behind existing protected layout.
- Ensure all new admin API route changes call the existing auth/tenant guard helpers (requireAdmin, requireTenant where appropriate).
- After changes:
  - Run: npm run build
  - Fix all errors until build passes.
- Then:
  - git add -A
  - git commit -m "feat: module-centric admin controls for services, bookings, and Whop links"
  - git push origin main

Finally, output a summary in the editor:
- New/updated routes.
- New fields on admin views.
- Any remaining TODOs (e.g., full Whop sync jobs, reporting).
```

---

## 3) Copilot Prompt – `ajdigital-automation-hub` (Central Config + Env Governance)

This is where you centralize **shared configs and schemas** so you don't repeat yourself across repos.

**Paste this in Copilot Chat inside the `ajdigital-automation-hub` window:**

```text
You are operating inside the ajdigital-automation-hub repo, which is the infra/config hub for the Audio Jones ecosystem.

Global constraints:
- Do NOT add secrets. This repo holds shapes and schemas, never real keys.
- This repo should describe structure for:
  - audiojones.com (marketing)
  - audiojones-client (client portal)
  - audiojones-admin (admin portal)
  - Future repo specs (Whop offers, automations, etc.)
- Outputs must be consumable as plain JSON/YAML or TypeScript config; no frameworks.

GOAL: Create a central "system config + env governance" layer covering:
- Modules (Client Delivery, Marketing Automation, AI Optimization, Data Intelligence).
- Personas (Creators, Businesses).
- Shared booking + status vocabulary.
- Shared env var schemas for Firebase + Whop + Stripe.

Tasks:

1) Systems + modules config
- Create a config file, e.g.:
  - config/systems/modules.json
- Define all module metadata:

  - id (client-delivery, marketing-automation, ai-optimization, data-intelligence)
  - name
  - shortDescription
  - longDescription (1–2 sentences, concise)
  - suggestedPersonas: ["creator" | "business" | "both", …]
  - funnelStage: one of ["discover", "book", "deliver", "optimize", "retain"]

- This JSON will be the single source of truth for:
  - audiojones.com systems pages
  - client portal module tags
  - admin portal module filters

2) Shared vocab config
- Create config/systems/vocabulary.json with:
  - bookingStatuses: list of allowed values and labels
    - e.g. { "code": "PENDING_PAYMENT", "label": "Awaiting Payment" }
  - personas: allowed persona codes + labels
  - modules: cross-ref to modules.json (or at least IDs).
- This gives you one place to update labels without guessing across repos.

3) Env schema definitions
- Create config/env/firebase.schema.json describing:
  - All required Firebase keys for these projects (NEXT_PUBLIC_FIREBASE_...)
  - Types: string, optional/required, description.
- Create config/env/payments.schema.json for:
  - WHOP_API_BASE_URL
  - WHOP_API_KEY
  - STRIPE_SECRET_KEY
  - Any other payment-related envs.
- The goal is descriptive, not project-specific. This repo does NOT contain real values.

4) Cross-repo integration notes
- Create a docs/CROSS-REPO-INTEGRATION.md that explains:
  - How audiojones.com should read modules.json to render systems pages.
  - How audiojones-client should map service.module to modules.json IDs.
  - How audiojones-admin should use the same IDs for filters and reporting.
  - How env schemas here relate to .env.schema.json in each repo.

5) Commit
- When done:
  - Ensure JSON is valid.
  - git add -A
  - git commit -m "chore: add central systems config and env schemas"
  - git push origin main

Finally, print a short summary of the files created and how each app should consume them.
```

---

## 4) Copilot Prompt – `audiojones.com` (Wire to Central Modules Config)

Once the automation hub has `modules.json`, you can circle back and tell the marketing site to **stop hardcoding** module names and instead read them from config.

**Use this prompt when ready (after completing prompt #3):**

```text
You are in audiojones.com (marketing site). The ajdigital-automation-hub repo now defines canonical module metadata in config/systems/modules.json.

GOAL: Stop hardcoding module labels and descriptions in the marketing site; instead, consume them from a central config file in THIS repo that mirrors the automation-hub modules.json.

Tasks:
- Create src/config/modules.ts that contains a TypeScript representation of the modules config (IDs, names, short/long descriptions, funnel stage).
- Refactor:
  - /systems
  - /systems/client-delivery
  - /systems/marketing-automation
  - /systems/ai-optimization
  - /systems/data-intelligence
  to read titles, subtitles, and key descriptions from src/config/modules.ts instead of inline literals.
- Keep layout and styling intact; only replace hardcoded copy with config lookups.
- Export a helper like getModuleById(id) to clean up the page components.
- After changes:
  - Run npm run build
  - Fix issues until build is green.
  - git add -A
  - git commit -m "refactor: centralize systems copy into modules config"
  - git push origin main

Then summarize which pages now depend on src/config/modules.ts.
```

---

## Usage Notes

1. **Execute prompts in order**: Start with #3 (automation-hub) to establish central config, then #1 (client), #2 (admin), and finally #4 (marketing site refactor).

2. **Repo isolation**: Always open each repo in its own VS Code window to prevent Copilot from mixing contexts.

3. **No env changes**: These prompts explicitly forbid touching Firebase config, .env files, or introducing new environment variables.

4. **Build-first**: Every prompt requires a successful `npm run build` before committing.

5. **Behavior over infrastructure**: These prompts focus on user-facing features and admin controls, not on refactoring core architecture.

---

## Related Documentation

- [MARKETING-IA.md](./archive/MARKETING-IA.md) - Marketing site information architecture
- [.github/copilot-instructions.md](../.github/copilot-instructions.md) - AI development guide
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment procedures

---

**Last Updated:** November 17, 2025  
**Maintainer:** Engineering Team
