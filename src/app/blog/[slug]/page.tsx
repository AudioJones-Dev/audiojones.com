import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "next-sanity";
import { safeFetch } from "@/lib/sanity/client";
import {
  POST_BY_SLUG_QUERY,
  ALL_POST_SLUGS_QUERY,
} from "@/lib/sanity/queries";
import type { Post } from "@/lib/sanity/types";
import JsonLd from "@/components/seo/JsonLd";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo/schema";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/lib/site";

// ─── Static params (build-time) ───────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await safeFetch<Array<{ slug: string }>>(ALL_POST_SLUGS_QUERY);
  return slugs ?? [];
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await safeFetch<Post>(POST_BY_SLUG_QUERY, { slug: params.slug });

  if (!post) {
    return {
      title: "Post Not Found | Audio Jones Blog",
      description: "The requested article could not be found.",
    };
  }

  const canonicalUrl = `${siteConfig.url}/blog/${post.slug.current}`;
  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.excerpt ?? post.answerSummary ?? "";
  const ogImage = post.coverImage?.url ?? `${siteConfig.url}/assets/og/audio-jones-og.jpg`;

  return {
    title,
    description,
    alternates: { canonical: post.canonicalUrl ?? canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await safeFetch<Post>(POST_BY_SLUG_QUERY, { slug: params.slug });

  if (!post) notFound();

  const canonicalUrl = `${siteConfig.url}/blog/${post.slug.current}`;
  const hasFaqs = Array.isArray(post.faqs) && post.faqs.length > 0;
  const cluster = post.topicCluster;

  return (
    <div className="min-h-screen" style={{ background: "#05070F" }}>
      {/* ── JSON-LD ── */}
      <JsonLd
        data={articleJsonLd({
          title: post.seoTitle ?? post.title,
          description: post.seoDescription ?? post.excerpt ?? "",
          url: post.canonicalUrl ?? canonicalUrl,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt ?? post.publishedAt,
          image: post.coverImage?.url,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          ...(cluster
            ? [{ name: cluster.title, url: `/blog/topic/${cluster.slug.current}` }]
            : []),
          { name: post.title, url: `/blog/${post.slug.current}` },
        ])}
      />
      {hasFaqs && (
        <JsonLd
          data={faqJsonLd(
            post.faqs!.map((f) => ({ question: f.question, answer: f.answer }))
          )}
        />
      )}

      {/* ── Back nav ── */}
      <div className="mx-auto max-w-[820px] px-5 pt-10 sm:px-8">
        <Link
          href="/blog"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.08em",
          }}
        >
          ← Blog
        </Link>
        {cluster && (
          <>
            <span style={{ color: "rgba(255,255,255,0.15)", margin: "0 8px" }}>/</span>
            <Link
              href={`/blog/topic/${cluster.slug.current}`}
              style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}
            >
              {cluster.title}
            </Link>
          </>
        )}
      </div>

      {/* ── Article header ── */}
      <header className="mx-auto max-w-[820px] px-5 pb-10 pt-10 sm:px-8">
        {cluster && <Eyebrow>{cluster.title}</Eyebrow>}

        <h1
          className="mt-4 text-balance"
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
          }}
        >
          {post.title}
        </h1>

        {/* AEO direct answer */}
        {post.answerSummary && (
          <div
            className="mt-6 rounded-xl p-5"
            style={{
              background: "rgba(59,91,255,0.07)",
              border: "1px solid rgba(59,91,255,0.18)",
              borderLeft: "3px solid #3B5BFF",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#3B5BFF",
                marginBottom: "8px",
              }}
            >
              Direct Answer
            </p>
            <p
              style={{
                fontFamily: "var(--font-accent)",
                fontSize: "16px",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.80)",
              }}
            >
              {post.answerSummary}
            </p>
          </div>
        )}

        {/* Meta row */}
        <div className="mt-6 flex flex-wrap items-center gap-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px" }}>
          {post.author?.name && (
            <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.50)" }}>
              By {post.author.name}
            </span>
          )}
          {post.publishedAt && (
            <time
              dateTime={post.publishedAt}
              style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}
            >
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          )}
          {post.updatedAt && post.updatedAt !== post.publishedAt && (
            <time
              dateTime={post.updatedAt}
              style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.25)" }}
            >
              Updated {new Date(post.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </time>
          )}
          {post.focusKeyword && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,69,0,0.70)",
                background: "rgba(255,69,0,0.08)",
                padding: "3px 10px",
                borderRadius: "999px",
              }}
            >
              {post.focusKeyword}
            </span>
          )}
        </div>
      </header>

      {/* ── Cover image ── */}
      {post.coverImage?.url && (
        <div className="mx-auto mb-10 max-w-[820px] px-5 sm:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage.url}
            alt={post.coverImage.alt ?? post.title}
            className="w-full rounded-2xl"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          />
        </div>
      )}

      {/* ── Body ── */}
      {post.body && post.body.length > 0 && (
        <article
          className="mx-auto max-w-[820px] px-5 pb-16 sm:px-8"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "17px",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <PortableText value={post.body} />
        </article>
      )}

      {/* ── FAQ block ── */}
      {hasFaqs && (
        <section
          className="mx-auto max-w-[820px] px-5 pb-16 sm:px-8"
          aria-label="Frequently asked questions"
        >
          <Eyebrow>FAQ</Eyebrow>
          <div className="mt-6 space-y-4">
            {post.faqs!.map((faq) => (
              <details
                key={faq._key}
                className="rounded-xl"
                style={{
                  background: "rgba(10,14,28,0.72)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: "18px 20px",
                }}
              >
                <summary
                  className="cursor-pointer select-none"
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    letterSpacing: "-0.01em",
                    listStyle: "none",
                  }}
                >
                  {faq.question}
                </summary>
                <p
                  className="mt-3"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.7,
                  }}
                >
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ── Related posts ── */}
      {Array.isArray(post.relatedPosts) && post.relatedPosts.length > 0 && (
        <section className="border-t border-[var(--line-2)] py-16">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <Eyebrow>Continue the signal path</Eyebrow>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {post.relatedPosts.map((rp) => (
                <Link
                  key={rp._id}
                  href={`/blog/${rp.slug.current}`}
                  className="group flex flex-col rounded-xl p-5 transition-all"
                  style={{
                    background: "rgba(10,14,28,0.72)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-headline)",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#FFFFFF",
                      letterSpacing: "-0.01em",
                      marginBottom: "8px",
                    }}
                    className="group-hover:text-[#FF4500] transition-colors"
                  >
                    {rp.title}
                  </span>
                  {rp.excerpt && (
                    <span
                      className="line-clamp-2"
                      style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.40)" }}
                    >
                      {rp.excerpt}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Diagnostic CTA ── */}
      <section className="border-t border-[var(--line-2)] py-16">
        <div className="mx-auto max-w-[820px] px-5 sm:px-8 text-center">
          <p
            style={{ fontFamily: "var(--font-body)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#C8A96A", marginBottom: "16px" }}
          >
            Apply the thinking
          </p>
          <h2
            style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#FFFFFF", marginBottom: "24px" }}
          >
            Ready to build your Applied Intelligence System?
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/applied-intelligence/diagnostic" variant="glow">
              Book Diagnostic
            </ButtonLink>
            <ButtonLink href="/frameworks" variant="system-glow">
              Explore Frameworks
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
