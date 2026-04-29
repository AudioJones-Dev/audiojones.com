// Firebase has been intentionally removed from audiojones.com.
// Kept as a no-op shim so legacy analytics integrations still type-check.
// See docs/architecture/stack-decision.md.
import { getAnalytics } from "@/lib/legacy-stubs";

export const app: unknown = null;
export { getAnalytics };
