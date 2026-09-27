import { NextRequest } from "next/server";
import { NodeHtmlMarkdown } from "node-html-markdown";
import {
  absolutizeRootRelative,
  isAllowedMarkdownHost,
  isMarkdownEligiblePath,
} from "@/lib/agent-docs/markdown";

// Reached through the middleware rewrite for `Accept: text/markdown`
// requests. Renders the page's own HTML and converts its <main> content.

const converter = new NodeHtmlMarkdown({
  ignore: ["script", "style", "noscript", "svg", "nav", "footer", "form", "button"],
});

function plain(status: number, message: string, headers: HeadersInit = {}) {
  return new Response(`${message}\n`, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8", Vary: "Accept", ...headers },
  });
}

function mainContent(html: string): string {
  const start = html.search(/<main[\s>]/i);
  const end = html.toLowerCase().lastIndexOf("</main>");
  if (start !== -1 && end > start) return html.slice(start, end + "</main>".length);
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return body ? body[1] : html;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await params;
  const pagePath = `/${path.join("/")}`;

  if (!isAllowedMarkdownHost(req.nextUrl.hostname)) {
    return plain(400, "Markdown is not served for this host.");
  }
  if (!isMarkdownEligiblePath(pagePath)) {
    return plain(404, "No markdown version of this path.");
  }

  const upstream = await fetch(new URL(pagePath, req.nextUrl.origin), {
    headers: { Accept: "text/html" },
    redirect: "manual",
    cache: "no-store",
  });

  const location = upstream.headers.get("location");
  if (upstream.status >= 300 && upstream.status < 400 && location) {
    return plain(upstream.status, `Moved to ${location}`, { Location: location });
  }
  const contentType = upstream.headers.get("content-type") ?? "";
  if (upstream.status !== 200 || !contentType.includes("text/html")) {
    return plain(upstream.status === 200 ? 406 : upstream.status, "No markdown version of this page.");
  }

  const html = await upstream.text();
  const title = decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "");
  const canonical =
    html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] ??
    new URL(pagePath, req.nextUrl.origin).toString();

  // Resolve against the serving origin, not the canonical: a blog post may
  // declare an external canonical, and its site links must stay on this site.
  const content = absolutizeRootRelative(mainContent(html), req.nextUrl.origin);

  const body = converter.translate(content).trim();
  const frontmatter = ["---", `title: ${JSON.stringify(title)}`, `url: ${canonical}`, "---"];
  const markdown = `${frontmatter.join("\n")}\n\n${body}`;

  return new Response(`${markdown}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8", Vary: "Accept" },
  });
}
