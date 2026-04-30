// Canonical lead-capture endpoint for audiojones.com.
//
// Persists to NeonDB (db/migrations/001_applied_intelligence_leads.sql) via
// `persistAppliedIntelligenceLead`, then notifies via Resend and the optional
// n8n webhook. Firebase/Firestore is intentionally not used — see
// docs/architecture/stack-decision.md.
//
// The Applied Intelligence diagnostic form posts to
// /api/applied-intelligence/leads, which shares the same persistence flow.

export { POST } from "@/app/api/applied-intelligence/leads/route";
export const runtime = "nodejs";
