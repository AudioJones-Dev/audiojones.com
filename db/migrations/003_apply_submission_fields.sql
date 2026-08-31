-- /apply submissions — additive columns on applied_intelligence_leads.
--
-- The deeper-intent application form at /apply feeds the same table as the
-- Founder Intelligence diagnostic (see 001), but carries four fields the
-- diagnostic does not. Without these columns the apply payload cannot be
-- persisted without dropping data.
--
-- Additive and idempotent: no column is dropped, renamed, or retyped, and
-- every statement is IF NOT EXISTS, so this is safe to re-run and safe to
-- apply while the current code is live.

-- Which engagement the applicant clicked through for. Values match the ids in
-- APPLY_OFFERS (src/lib/apply/apply-schema.ts), which in turn match the offer
-- ids in src/content/pricing.ts. Left as TEXT rather than an enum so retiring
-- or adding an offer stays a code change, not a migration.
ALTER TABLE applied_intelligence_leads
  ADD COLUMN IF NOT EXISTS offer TEXT;

-- Which surface the application came from: diagnostic | homepage-cta |
-- pricing | direct | other. Distinct from source_page (the URL path) and from
-- utm_source (campaign attribution).
ALTER TABLE applied_intelligence_leads
  ADD COLUMN IF NOT EXISTS apply_source TEXT;

ALTER TABLE applied_intelligence_leads
  ADD COLUMN IF NOT EXISTS team_size TEXT;

ALTER TABLE applied_intelligence_leads
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Partial index: only application rows carry an offer, and the question this
-- answers is "which offers are drawing applications", so the NULL diagnostic
-- rows are dead weight in the index.
CREATE INDEX IF NOT EXISTS idx_applied_intelligence_leads_offer
  ON applied_intelligence_leads(offer)
  WHERE offer IS NOT NULL;
