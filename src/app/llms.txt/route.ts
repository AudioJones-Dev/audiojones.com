import { buildLlmsTxt } from "@/lib/agent-docs/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
