import Breadcrumbs, { type Crumb } from "@/components/founder-intelligence/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { getPageById } from "@/content/journeys";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

/**
 * Parent-hub recovery for a registered page (Canonical Map v1.1 §7.1, §7.3):
 * the crumb trail is the registry's parent chain, so a tool or detail page
 * always links back to the hub that owns it, with the hub's own label. The
 * BreadcrumbList JSON-LD is emitted from the same chain, so the structured
 * trail equals the visible one (§10.12).
 */
export default function RegistryBreadcrumbs({ pageId }: { pageId: string }) {
  const chain: Crumb[] = [];
  let current = getPageById(pageId);
  if (!current) throw new Error(`RegistryBreadcrumbs: unknown pageId "${pageId}"`);
  while (current) {
    chain.unshift({ name: current.navLabel, href: current.route });
    current = current.parentId ? getPageById(current.parentId) : undefined;
  }
  if (chain[0]?.href !== "/") chain.unshift({ name: "Home", href: "/" });
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(chain.map((c) => ({ name: c.name, url: c.href! })))} />
      <Breadcrumbs items={chain} />
    </>
  );
}
