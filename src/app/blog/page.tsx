import type { Metadata } from "next";
import Link from "next/link";
import { safeFetch, isSanityConfigured } from "@/lib/sanity/client";
import { FEATURED_POSTS_QUERY, ALL_POSTS_QUERY } from "@/lib/sanity/queries";
import type { PostStub } from "@/lib/sanity/types";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Blog | Audio Jones",
  description:
    "Applied Intelligence, signal systems, M.A.P Attribution, and AI-readiness insights for founder-led businesses. The Audio Jones knowledge base.",
  alternates: {
    canonical: "https://audiojones.com/blog",
  },
  openGraph: {
    title: "Blog | Audio Jones",
    description:
      "Applied Intelligence, signal systems, M.A.P Attribution, and AI-readiness insights for founder-led businesses.",
    url: "https://audiojones.com/blog",
    siteName: "Audio Jones",
    type: "website",
    images: [{ url: "/assets/og/audio-jones-og.jpg", width: 1200, height: 630, alt: "Audio Jones Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Audio Jones",
    description:
      "Applied Intelligence, signal systems, M.A.P Attribution, and AI-readiness insights for founder-led businesses.",
    images: ["/assets/og/audio-jones-og.jpg"],
  },
};

// ─── Static topic cluster config ──────────────────────────────────────────────
// These render as navigation + empty-state cards regardless of Sanity content.

const TOPIC_CLUSTERS = [
  {
    slug: "applied-intelligence-systems",
    label: "Applied Intelligence Systems",
    description: "How to identify signal, build operating leverage, and create systems that compound.",
    accent: "#3B5BFF",
    icon: "◈",
  },
  {
    slug: "signal-vs-noise",
    label: "Signal vs Noise",
    description: "Causal vs vanity metrics. Separating what creates revenue from what consumes attention.",
    accent: "#FF4500",
    icon: "◎",
  },
  {
    slug: "map-attribution",
    label: "M.A.P Attribution",
    description: "Meaningful. Actionable. Profitable. How to identify what actually drives your growth.",
    accent: "#C8A96A",
    icon: "⬡",
  },
  {
    slug: "why-ai-fails",
    label: "Why AI Fails",
    description: "AI fails before it starts — when automation precedes systems, processes, and signal.",
    accent: "#94A3B8",
    icon: "⊗",
  },
  {
    slug: "ai-readiness",
    label: "AI Readiness for Founder-Led Businesses",
    description: "The diagnostic framework for knowing whether your business is ready for AI.",
    accent: "#10B981",
    icon: "◉",
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default async function BlogPage() {
  // Fetch from Sanity if configured — fail silently to empty state if not
  const [featured, all] = await Promise.all([
    safeFetch<PostStub[]>(FEATURED_POSTS_QUERY),
    safeFetch<PostStub[]>(ALL_POSTS_QUERY),
  ]);

  const hasPosts = Array.isArray(all) && all.length > 0;
  const featuredPosts = featured ?? [];
  const latestPosts = all ?? [];

  return (
    <div
      className="min-h-screen"
      style={{ background: "#05070F" }}
    >
      {/* ── Hero ── */}
      <section className="border-b border-[var(--line-2)] py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <Eyebrow>Knowledge Base</Eyebrow>
          <h1
            className="mt-4 text-balance"
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
            }}
          >
            Applied Intelligence,<br />
            <span style={{ color: "#FF4500" }}>documented.</span>
          </h1>
          <p
            className="mt-5 max-w-2xl"
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: "18px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.65)",
            }}
          >
            The Audio Jones blog documents Applied Intelligence Systems, signal strategy,
            M.A.P Attribution, and AI-readiness for founder-led businesses.
          </p>
        </div>
      </section>

      {/* ── Topic cluster rail ── */}
      <section className="border-b border-[var(--line-2)] py-16">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <p
            className="mb-8"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Topic Clusters
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {TOPIC_CLUSTERS.map((cluster) => (
              <Link
                key={cluster.slug}
                href={`/blog/topic/${cluster.slug}`}
                className="group flex flex-col rounded-2xl p-5 transition-all duration-200"
                style={{
                  background: "rgba(10,14,28,0.72)",
                  border: `1px solid ${cluster.accent}22`,
                  borderTop: `2px solid ${cluster.accent}`,
                }}
              >
                <span
                  className="mb-3 text-2xl"
                  style={{ color: cluster.accent }}
                  aria-hidden
                >
                  {cluster.icon}
                </span>
                <span
                  className="mb-2 font-semibold leading-snug"
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "14px",
                    color: "#FFFFFF",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {cluster.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.5,
                  }}
                >
                  {cluster.description}
                </span>
                <span
                  className="mt-auto pt-4"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    color: cluster.accent,
                    letterSpacing: "0.08em",
                  }}
                >
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {hasPosts ? (
        <>
          {/* ── Featured posts ── */}
          {featuredPosts.length > 0 && (
            <section className="border-b border-[var(--line-2)] py-20">
              <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
                <Eyebrow>Featured</Eyebrow>
                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                  {featuredPosts.map((post) => (
                    <PostCard key={post._id} post={post} featured />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Latest posts ── */}
          <section className="py-20">
            <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
              <Eyebrow>Latest</Eyebrow>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {latestPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <EmptyState configured={isSanityConfigured} />
      )}

      {/* ── Framework CTA ── */}
      <section className="border-t border-[var(--line-2)] py-20">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div
            className="rounded-3xl p-10 sm:p-14"
            style={{
              background: "linear-gradient(135deg, rgba(59,91,255,0.08) 0%, rgba(255,69,0,0.06) 100%)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#C8A96A",
                marginBottom: "16px",
              }}
            >
              Continue the signal path
            </p>
            <h2
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#FFFFFF",
                marginBottom: "12px",
              }}
            >
              From insight to operating system.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-accent)",
                fontSize: "16px",
                color: "rgba(255,255,255,0.60)",
                marginBottom: "28px",
                maxWidth: "52ch",
              }}
            >
              The blog documents the thinking. The frameworks and diagnostic
              are where it becomes a system for your business.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/frameworks" variant="system-glow">
                Explore Frameworks
              </ButtonLink>
              <ButtonLink href="/applied-intelligence/diagnostic" variant="glow">
                Book Diagnostic
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PostCard({ post, featured = false }: { post: PostStub; featured?: boolean }) {
  const cluster = post.topicCluster;

  return (
    <article
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: "rgba(10,14,28,0.72)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Cover image placeholder */}
      {post.coverImage?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage.url}
          alt={post.coverImage.alt ?? post.title}
          className="aspect-[16/9] w-full object-cover"
        />
      ) : (
        <div
          className="aspect-[16/9] w-full"
          style={{ background: "rgba(59,91,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          aria-hidden
        />
      )}

      <div className="flex flex-1 flex-col p-6">
        {cluster && (
          <span
            className="mb-3 inline-block"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#3B5BFF",
            }}
          >
            {cluster.title}
          </span>
        )}

        <Link href={`/blog/${post.slug.current}`} className="flex-1">
          <h2
            className="mb-3 leading-snug transition-colors group-hover:text-[#FF4500]"
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: featured ? "20px" : "17px",
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
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "rgba(255,255,255,0.50)",
              lineHeight: 1.6,
            }}
          >
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {post.publishedAt && (
            <time
              dateTime={post.publishedAt}
              style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.30)" }}
            >
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          )}
          <Link
            href={`/blog/${post.slug.current}`}
            style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#FF4500", letterSpacing: "0.08em" }}
          >
            Read →
          </Link>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ configured }: { configured: boolean }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="mb-4"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            {configured ? "No posts published yet" : "Content system initializing"}
          </p>
          <h2
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              marginBottom: "16px",
            }}
          >
            The Audio Jones knowledge base<br />
            <span style={{ color: "#FF4500" }}>is being structured.</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-accent)",
              fontSize: "16px",
              color: "rgba(255,255,255,0.50)",
              lineHeight: 1.6,
              marginBottom: "32px",
            }}
          >
            Articles on Applied Intelligence Systems, signal strategy, M.A.P Attribution,
            and AI-readiness are being written and structured into topic clusters.
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.08em",
            }}
          >
            Explore the topic clusters above to see what&apos;s coming.
          </p>
        </div>
      </div>
    </section>
  );
}
