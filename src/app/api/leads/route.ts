// Canonical lead-capture endpoint for audiojones.com.
//
// Persists to NeonDB via `persistFounderIntelligenceLead`, then notifies
// via Resend and the optional n8n webhook. Note: the underlying table is
// still `applied_intelligence_leads` (see db/migrations/001) — table name
// is retained for migration safety; brand is Founder Intelligence System.
//
// The Founder Intelligence System diagnostic form posts to
// /api/founder-intelligence/leads, which shares the same persistence flow.

export { POST } from "@/app/api/founder-intelligence/leads/route";
export const runtime = "nodejs";
