import type { Metadata } from "next";
import Link from "next/link";
import { safeFetch, isSanityConfigured } from "@/lib/sanity/client";
import { FEATURED_POSTS_QUERY, ALL_POSTS_QUERY } from "@/lib/sanity/queries";
import type { PostStub } from "@/lib/sanity/types";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ctaLinks } from "@/config/links";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Applied Intelligence, signal systems, M.A.P Attribution, and AI-readiness insights for founder-led businesses. The Audio Jones knowledge base.",
  alternates: {
    canonical: "https://audiojones.com/blog",
  },
  openGraph: {
    title: "Blog",
    description:
      "Applied Intelligence, signal systems, M.A.P Attribution, and AI-readiness insights for founder-led businesses.",
    url: "https://audiojones.com/blog",
    siteName: "Audio Jones",
    type: "website",
    images: [{ url: "/assets/og/audio-jones-og.jpg", width: 1200, height: 630, alt: "Audio Jones Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description:
      "Applied Intelligence, signal systems, M.A.P Attribution, and AI-readiness insights for founder-led businesses.",
    images: ["/assets/og/audio-jones-og.jpg"],
  },
};

// ─── Static topic cluster config ──────────────────────────────────────────────
// Accent values map to design palette: system blue, signal orange, gold,
// fg-2 muted, success green. Used as data for per-cluster accenting.

const TOPIC_CLUSTERS = [
  {
    slug: "applied-intelligence-systems",
    label: "Applied Intelligence Systems",
    description: "How to identify signal, build operating leverage, and create systems that compound.",
    accent: "var(--aj-blue-bright)",
    icon: "◈",
  },
  {
    slug: "signal-vs-noise",
    label: "Signal vs Noise",
    description: "Causal vs vanity metrics. Separating what creates revenue from what consumes attention.",
    accent: "var(--aj-orange)",
    icon: "◎",
  },
  {
    slug: "map-attribution",
    label: "M.A.P Attribution",
    description: "Meaningful. Actionable. Profitable. How to identify what actually drives your growth.",
    accent: "var(--aj-gold)",
    icon: "⬡",
  },
  {
    slug: "why-ai-fails",
    label: "Why AI Fails",
    description: "AI fails before it starts — when automation precedes systems, processes, and signal.",
    accent: "var(--fg-2)",
    icon: "⊗",
  },
  {
    slug: "ai-readiness",
    label: "AI Readiness for Founder-Led Businesses",
    description: "The diagnostic framework for knowing whether your business is ready for AI.",
    accent: "var(--success)",
    icon: "◉",
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default async function BlogPage() {
  const [featured, all] = await Promise.all([
    safeFetch<PostStub[]>(FEATURED_POSTS_QUERY),
    safeFetch<PostStub[]>(ALL_POSTS_QUERY),
  ]);

  const hasPosts = Array.isArray(all) && all.length > 0;
  const featuredPosts = featured ?? [];
  const latestPosts = all ?? [];

  return (
    <div className="min-h-screen bg-bg-0">
      {/* ── Hero ── */}
      <section className="border-b border-[var(--line-2)] py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <Eyebrow>Knowledge Base</Eyebrow>
          <h1 className="mt-4 t-h1 text-balance text-fg-0">
            Applied Intelligence,<br />
            <span className="text-aj-orange">documented.</span>
          </h1>
          <p className="mt-5 t-lead text-fg-2 max-w-2xl">
            The Audio Jones blog documents Applied Intelligence Systems, signal strategy,
            M.A.P Attribution, and AI-readiness for founder-led businesses.
          </p>
        </div>
      </section>

      {/* ── Topic cluster rail ── */}
      <section className="border-b border-[var(--line-2)] py-16">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <Eyebrow tone="muted" className="mb-8 block">Topic Clusters</Eyebrow>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {TOPIC_CLUSTERS.map((cluster) => (
              <Link
                key={cluster.slug}
                href={`/blog/topic/${cluster.slug}`}
                className="group flex flex-col rounded-2xl border border-[var(--line-2)] bg-bg-2 p-5 transition-colors hover:border-[var(--line-3)]"
                style={{ borderTopColor: cluster.accent, borderTopWidth: "2px" }}
              >
                <span
                  className="mb-3 text-2xl"
                  style={{ color: cluster.accent }}
                  aria-hidden
                >
                  {cluster.icon}
                </span>
                <span className="mb-2 t-h4 text-fg-0">{cluster.label}</span>
                <span className="t-small text-fg-2">{cluster.description}</span>
                <span
                  className="mt-auto pt-4 t-label"
                  style={{ color: cluster.accent }}
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
          <div className="rounded-2xl border border-[var(--line-2)] bg-bg-2 p-10 sm:p-14">
            <Eyebrow>Continue the signal path</Eyebrow>
            <h2 className="mt-3 t-h2 text-fg-0">
              From insight to operating system.
            </h2>
            <p className="mt-3 t-body-lg text-fg-2 max-w-[52ch]">
              The blog documents the thinking. The frameworks and diagnostic
              are where it becomes a system for your business.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/frameworks" variant="system-glow">
                Explore Frameworks
              </ButtonLink>
              <ButtonLink href={ctaLinks.signalDiagnostic} variant="glow">
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
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--line-2)] bg-bg-2 transition-colors hover:border-[var(--line-3)]">
      {post.coverImage?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage.url}
          alt={post.coverImage.alt ?? post.title}
          className="aspect-[16/9] w-full object-cover"
        />
      ) : (
        <div
          className="aspect-[16/9] w-full border-b border-[var(--line-1)] bg-bg-3"
          aria-hidden
        />
      )}

      <div className="flex flex-1 flex-col p-6">
        {cluster && (
          <Eyebrow tone="blue" className="mb-3 block">
            {cluster.title}
          </Eyebrow>
        )}

        <Link href={`/blog/${post.slug.current}`} className="flex-1">
          <h2 className={`mb-3 ${featured ? "t-h3" : "t-h4"} text-fg-0 transition-colors group-hover:text-aj-orange`}>
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="mb-4 t-small text-fg-2 line-clamp-3">
            {post.excerpt}
          </p>
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
            className="t-label text-aj-orange"
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
          <Eyebrow tone="muted" className="mb-4 block">
            {configured ? "No posts published yet" : "Content system initializing"}
          </Eyebrow>
          <h2 className="t-h2 text-fg-0">
            The Audio Jones knowledge base<br />
            <span className="text-aj-orange">is being structured.</span>
          </h2>
          <p className="mt-4 t-body-lg text-fg-2">
            Articles on Applied Intelligence Systems, signal strategy, M.A.P Attribution,
            and AI-readiness are being written and structured into topic clusters.
          </p>
          <p className="mt-6 t-small text-fg-3">
            Explore the topic clusters above to see what&apos;s coming.
          </p>
        </div>
      </div>
    </section>
  );
}
