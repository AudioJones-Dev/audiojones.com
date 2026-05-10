import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { safeFetch } from "@/lib/sanity/client";
import {
  TOPIC_CLUSTER_BY_SLUG_QUERY,
  POSTS_BY_TOPIC_QUERY,
  ALL_TOPIC_SLUGS_QUERY,
} from "@/lib/sanity/queries";
import type { TopicCluster, PostStub } from "@/lib/sanity/types";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buildMetadata } from "@/lib/seo/metadata";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
import { ctaLinks } from "@/config/links";

// ─── Static cluster fallbacks (render even without Sanity) ────────────────────
// Accent values map to design palette: system blue, signal orange, gold,
// fg-2 muted, success green.

const STATIC_CLUSTERS: Record<string, { label: string; description: string; accent: string }> = {
  "applied-intelligence-systems": {
    label: "Applied Intelligence Systems",
    description:
      "How to identify signal, build operating leverage, and create systems that compound. The full Applied Intelligence Systems framework documented.",
    accent: "var(--aj-blue-bright)",
  },
  "signal-vs-noise": {
    label: "Signal vs Noise",
    description:
      "Causal vs vanity metrics. Separating what actually creates revenue from what consumes attention and budget without producing outcomes.",
    accent: "var(--aj-orange)",
  },
  "map-attribution": {
    label: "M.A.P Attribution",
    description:
      "Meaningful. Actionable. Profitable. The Audio Jones attribution framework for identifying exactly what drives growth in your business.",
    accent: "var(--aj-gold)",
  },
  "why-ai-fails": {
    label: "Why AI Fails",
    description:
      "AI fails before it starts — when automation precedes systems, processes, and signal clarity. Everything founder-led businesses need to know before adopting AI.",
    accent: "var(--fg-2)",
  },
  "ai-readiness": {
    label: "AI Readiness for Founder-Led Businesses",
    description:
      "The diagnostic framework for knowing whether your business is ready for AI. Processes, attribution, data hygiene, and operating model — all before the tools.",
    accent: "var(--success)",
  },
};

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const staticSlugs = Object.keys(STATIC_CLUSTERS).map((slug) => ({ slug }));

  const sanityData = await safeFetch<Array<{ slug: string }>>(ALL_TOPIC_SLUGS_QUERY);
  if (sanityData) {
    sanityData.forEach(({ slug }) => {
      if (!staticSlugs.find((s) => s.slug === slug)) {
        staticSlugs.push({ slug });
      }
    });
  }

  return staticSlugs;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const sanityCluster = await safeFetch<TopicCluster>(TOPIC_CLUSTER_BY_SLUG_QUERY, {
    slug: params.slug,
  });
  const staticFallback = STATIC_CLUSTERS[params.slug];

  const title = sanityCluster?.seoTitle ?? sanityCluster?.title ?? staticFallback?.label;
  const description = sanityCluster?.seoDescription ?? sanityCluster?.description ?? staticFallback?.description;

  if (!title) return {};

  return buildMetadata({
    title,
    description: description ?? `Audio Jones articles on ${title}.`,
    path: `/blog/topic/${params.slug}`,
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TopicClusterPage({
  params,
}: {
  params: { slug: string };
}) {
  const staticFallback = STATIC_CLUSTERS[params.slug];

  const [sanityCluster, posts] = await Promise.all([
    safeFetch<TopicCluster>(TOPIC_CLUSTER_BY_SLUG_QUERY, { slug: params.slug }),
    safeFetch<PostStub[]>(POSTS_BY_TOPIC_QUERY, { topicSlug: params.slug }),
  ]);

  if (!sanityCluster && !staticFallback) notFound();

  const title = sanityCluster?.title ?? staticFallback!.label;
  const description = sanityCluster?.description ?? staticFallback!.description;
  const accent = staticFallback?.accent ?? "var(--aj-blue-bright)";
  const hasPosts = Array.isArray(posts) && posts.length > 0;

  return (
    <div className="min-h-screen bg-bg-0">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: title, url: `/blog/topic/${params.slug}` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="border-b border-[var(--line-2)] py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <Link
            href="/blog"
            className="t-label text-fg-3 mb-6 inline-block hover:text-fg-1 transition-colors"
          >
            ← Blog
          </Link>
          <Eyebrow>Topic Cluster</Eyebrow>
          <h1
            className="mt-4 t-h1 text-balance"
            style={{ color: accent }}
          >
            {title}
          </h1>
          <p className="mt-5 t-lead text-fg-2 max-w-2xl">
            {description}
          </p>

          <InternalLinks slug={params.slug} accent={accent} />
        </div>
      </section>

      {/* ── Posts grid ── */}
      <section className="py-20">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          {hasPosts ? (
            <>
              <Eyebrow>{`${posts!.length} article${posts!.length !== 1 ? "s" : ""}`}</Eyebrow>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts!.map((post) => (
                  <TopicPostCard key={post._id} post={post} accent={accent} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center">
              <h2 className="t-h3 text-fg-0 mb-3">Articles coming soon.</h2>
              <p className="t-body text-fg-2 mb-8">
                This topic cluster is being written and structured.
              </p>
              <ButtonLink href="/blog" variant="system-glow">
                ← Back to Blog
              </ButtonLink>
            </div>
          )}
        </div>
      </section>

      {/* ── Diagnostic CTA ── */}
      <section className="border-t border-[var(--line-2)] py-16">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 text-center">
          <Eyebrow>Apply the framework</Eyebrow>
          <h2 className="mt-3 t-h2 text-fg-0 mb-6">
            Ready to build your Applied Intelligence System?
          </h2>
          <ButtonLink href={ctaLinks.signalDiagnostic} variant="glow">
            Book Your Diagnostic
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}

// ─── Internal link map per topic ──────────────────────────────────────────────

function InternalLinks({ slug, accent }: { slug: string; accent: string }) {
  const links: Record<string, Array<{ label: string; href: string }>> = {
    "applied-intelligence-systems": [
      { label: "AIS Framework", href: "/frameworks/applied-intelligence-systems" },
      { label: "Applied Intelligence", href: "/applied-intelligence" },
      { label: "Book Diagnostic", href: ctaLinks.signalDiagnostic },
    ],
    "signal-vs-noise": [
      { label: "Signal vs Noise Framework", href: "/frameworks/signal-vs-noise" },
      { label: "Applied Intelligence", href: "/applied-intelligence" },
    ],
    "map-attribution": [
      { label: "M.A.P Attribution Framework", href: "/frameworks/map-attribution" },
      { label: "Applied Intelligence", href: "/applied-intelligence" },
    ],
    "why-ai-fails": [
      { label: "Applied Intelligence", href: "/applied-intelligence" },
      { label: "AI Readiness Diagnostic", href: ctaLinks.signalDiagnostic },
    ],
    "ai-readiness": [
      { label: "Book Diagnostic", href: ctaLinks.signalDiagnostic },
      { label: "Applied Intelligence", href: "/applied-intelligence" },
    ],
  };

  const items = links[slug];
  if (!items?.length) return null;

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {items.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="t-label rounded-full border px-3.5 py-1.5 transition-opacity hover:opacity-80"
          style={{ color: accent, borderColor: accent }}
        >
          {link.label} →
        </Link>
      ))}
    </div>
  );
}

function TopicPostCard({ post, accent }: { post: PostStub; accent: string }) {
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--line-2)] bg-bg-2 transition-colors hover:border-[var(--line-3)]"
      style={{ borderTopColor: accent, borderTopWidth: "2px" }}
    >
      <div className="flex flex-1 flex-col p-6">
        <Link href={`/blog/${post.slug.current}`} className="flex-1">
          <h2 className="mb-3 t-h4 text-fg-0 transition-colors group-hover:text-aj-orange">
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="mb-4 t-small text-fg-2 line-clamp-3">{post.excerpt}</p>
        )}
        <div className="mt-auto flex items-center justify-between border-t border-[var(--line-1)] pt-4">
          {post.publishedAt && (
            <time dateTime={post.publishedAt} className="t-small text-fg-3">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          )}
          <Link
            href={`/blog/${post.slug.current}`}
            className="t-label"
            style={{ color: accent }}
          >
            Read →
          </Link>
        </div>
      </div>
    </article>
  );
}
