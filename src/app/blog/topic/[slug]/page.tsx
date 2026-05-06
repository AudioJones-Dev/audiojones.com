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
import { siteConfig } from "@/lib/site";

// ─── Static cluster fallbacks (render even without Sanity) ────────────────────

const STATIC_CLUSTERS: Record<string, { label: string; description: string; accent: string }> = {
  "applied-intelligence-systems": {
    label: "Applied Intelligence Systems",
    description:
      "How to identify signal, build operating leverage, and create systems that compound. The full Applied Intelligence Systems framework documented.",
    accent: "#3B5BFF",
  },
  "signal-vs-noise": {
    label: "Signal vs Noise",
    description:
      "Causal vs vanity metrics. Separating what actually creates revenue from what consumes attention and budget without producing outcomes.",
    accent: "#FF4500",
  },
  "map-attribution": {
    label: "M.A.P Attribution",
    description:
      "Meaningful. Actionable. Profitable. The Audio Jones attribution framework for identifying exactly what drives growth in your business.",
    accent: "#C8A96A",
  },
  "why-ai-fails": {
    label: "Why AI Fails",
    description:
      "AI fails before it starts — when automation precedes systems, processes, and signal clarity. Everything founder-led businesses need to know before adopting AI.",
    accent: "#94A3B8",
  },
  "ai-readiness": {
    label: "AI Readiness for Founder-Led Businesses",
    description:
      "The diagnostic framework for knowing whether your business is ready for AI. Processes, attribution, data hygiene, and operating model — all before the tools.",
    accent: "#10B981",
  },
};

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  // Start with known static slugs
  const staticSlugs = Object.keys(STATIC_CLUSTERS).map((slug) => ({ slug }));

  // Add any Sanity-defined clusters if configured
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
    title: `${title} | Audio Jones Blog`,
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

  // Fetch Sanity data in parallel
  const [sanityCluster, posts] = await Promise.all([
    safeFetch<TopicCluster>(TOPIC_CLUSTER_BY_SLUG_QUERY, { slug: params.slug }),
    safeFetch<PostStub[]>(POSTS_BY_TOPIC_QUERY, { topicSlug: params.slug }),
  ]);

  // 404 if neither Sanity nor static fallback recognises this slug
  if (!sanityCluster && !staticFallback) notFound();

  const title = sanityCluster?.title ?? staticFallback!.label;
  const description = sanityCluster?.description ?? staticFallback!.description;
  const accent = staticFallback?.accent ?? "#3B5BFF";
  const hasPosts = Array.isArray(posts) && posts.length > 0;

  return (
    <div className="min-h-screen" style={{ background: "#05070F" }}>
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
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.08em",
              display: "inline-block",
              marginBottom: "24px",
            }}
          >
            ← Blog
          </Link>
          <Eyebrow>Topic Cluster</Eyebrow>
          <h1
            className="mt-4 text-balance"
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              color: accent,
            }}
          >
            {title}
          </h1>
          <p
            className="mt-5 max-w-2xl"
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: "17px",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.60)",
            }}
          >
            {description}
          </p>

          {/* Internal links to related framework pages */}
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
              <p
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  marginBottom: "12px",
                }}
              >
                Articles coming soon.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.40)",
                  marginBottom: "32px",
                }}
              >
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
          <p
            style={{ fontFamily: "var(--font-body)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#C8A96A", marginBottom: "16px" }}
          >
            Apply the framework
          </p>
          <h2
            style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#FFFFFF", marginBottom: "24px" }}
          >
            Ready to build your Applied Intelligence System?
          </h2>
          <ButtonLink href="/applied-intelligence/diagnostic" variant="glow">
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
      { label: "Book Diagnostic", href: "/applied-intelligence/diagnostic" },
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
      { label: "AI Readiness Diagnostic", href: "/applied-intelligence/diagnostic" },
    ],
    "ai-readiness": [
      { label: "Book Diagnostic", href: "/applied-intelligence/diagnostic" },
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
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: accent,
            border: `1px solid ${accent}33`,
            borderRadius: "999px",
            padding: "6px 14px",
            background: `${accent}0A`,
          }}
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
      className="group flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "rgba(10,14,28,0.72)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderTop: `2px solid ${accent}`,
      }}
    >
      <div className="flex flex-1 flex-col p-6">
        <Link href={`/blog/${post.slug.current}`} className="flex-1">
          <h2
            className="mb-3 leading-snug transition-colors group-hover:text-[#FF4500]"
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "17px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
            }}
          >
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p
            className="mb-4 line-clamp-3"
            style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}
          >
            {post.excerpt}
          </p>
        )}
        <div
          className="mt-auto flex items-center justify-between pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          {post.publishedAt && (
            <time
              dateTime={post.publishedAt}
              style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.30)" }}
            >
              {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </time>
          )}
          <Link
            href={`/blog/${post.slug.current}`}
            style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: accent, letterSpacing: "0.08em" }}
          >
            Read →
          </Link>
        </div>
      </div>
    </article>
  );
}

