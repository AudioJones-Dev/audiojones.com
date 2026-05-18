import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { ctaLinks } from "@/config/links";
import { getStaticBlogPost } from "@/content/blog";
import JsonLd from "@/components/seo/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";

const SLUG = "most-businesses-cannot-actually-scale-ai";
const POST = getStaticBlogPost(SLUG)!;
const PATH = `/blog/${SLUG}`;

export const metadata: Metadata = buildMetadata({
  title: POST.seoTitle,
  description: POST.seoDescription,
  path: PATH,
  type: "article",
});

export default function Page() {
  return (
    <div className="min-h-screen bg-[#05070F]">
      <JsonLd
        data={articleJsonLd({
          title: POST.seoTitle,
          description: POST.seoDescription,
          url: PATH,
          datePublished: POST.publishedAt,
          dateModified: POST.updatedAt ?? POST.publishedAt,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          {
            name: POST.topicCluster?.title ?? "AI Readiness",
            url: `/blog/topic/${POST.topicCluster?.slug.current ?? "ai-readiness"}`,
          },
          { name: POST.title, url: PATH },
        ])}
      />

      <div className="mx-auto max-w-[820px] px-5 pt-10 sm:px-8">
        <Link
          href="/blog"
          className="text-[11px] tracking-[0.08em] text-white/35 transition hover:text-white/60"
        >
          ← Blog
        </Link>
        <span className="mx-2 text-white/15">/</span>
        <Link
          href={`/blog/topic/${POST.topicCluster?.slug.current ?? "ai-readiness"}`}
          className="text-[11px] tracking-[0.08em] text-white/35 transition hover:text-white/60"
        >
          {POST.topicCluster?.title ?? "AI Readiness"}
        </Link>
      </div>

      <header className="mx-auto max-w-[820px] px-5 pb-10 pt-10 sm:px-8">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#C8A96A]">
          {POST.topicCluster?.title ?? "AI Readiness"}
        </p>
        <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">
          {POST.title}
        </h1>
        <div className="mt-6 rounded-xl border border-[#3B5BFF]/20 border-l-[#3B5BFF] bg-[#3B5BFF]/[0.07] p-5">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#3B5BFF]">
            Direct Answer
          </p>
          <p className="text-base leading-relaxed text-white/80">
            {POST.answerSummary}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-white/[0.06] pt-5">
          <span className="text-xs text-white/50">By Audio Jones</span>
          {POST.publishedAt && (
            <time dateTime={POST.publishedAt} className="text-xs text-white/35">
              {new Date(POST.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          )}
          <span className="text-xs text-white/35">{POST.readingTime}</span>
          <span className="rounded-full bg-[#FF4500]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#FF4500]/80">
            {POST.focusKeyword}
          </span>
        </div>
      </header>

      <article className="mx-auto max-w-[760px] px-5 pb-20 sm:px-8">
        <div className="space-y-7 border-t border-white/[0.06] pt-10 text-lg leading-relaxed text-slate-300">
          {POST.body.map((block, index) => {
            if (block.type === "list") {
              return (
                <ul
                  key={index}
                  className="list-disc space-y-2 pl-6 text-slate-300"
                >
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            }

            return <p key={index}>{block.text}</p>;
          })}
        </div>
      </article>

      <section className="border-t border-white/[0.06] py-16">
        <div className="mx-auto max-w-[820px] px-5 text-center sm:px-8">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#C8A96A]">
            Measure the gap
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
            Find the operational conditions AI will amplify.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            The diagnostic maps the workflows, attribution, ownership, and
            source-of-truth gaps that decide whether AI becomes leverage or
            instability.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href={ctaLinks.signalDiagnostic} variant="glow">
              Book Your Diagnostic
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
