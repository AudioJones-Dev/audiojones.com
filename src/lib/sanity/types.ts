/**
 * Sanity content types for the Audio Jones blog.
 *
 * These mirror the Sanity Studio schema (see docs/sanity-blog-content-model.md).
 * All fields are optional-safe — missing fields degrade gracefully in UI.
 */

// ─── Primitives ───────────────────────────────────────────────────────────────

export interface SanitySlug {
  current: string;
}

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  /** Expanded by GROQ projection: `"url": asset->url` */
  url?: string;
  alt?: string;
  caption?: string;
}

export interface SanityBlock {
  _type: "block";
  _key: string;
  style?: string;
  children: Array<{
    _type: "span";
    _key: string;
    text: string;
    marks?: string[];
  }>;
  markDefs?: Array<{ _key: string; _type: string; href?: string }>;
}

// ─── Reusable objects ─────────────────────────────────────────────────────────

export interface FAQ {
  _key: string;
  question: string;
  answer: string;
}

// ─── Topic cluster pillars ────────────────────────────────────────────────────

export type TopicClusterSlug =
  | "applied-intelligence-systems"
  | "signal-vs-noise"
  | "map-attribution"
  | "why-ai-fails"
  | "ai-readiness";

export interface TopicCluster {
  _id: string;
  title: string;
  slug: SanitySlug;
  description?: string;
  pillar?: string;
  primaryKeyword?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Pillar {
  _id: string;
  title: string;
  slug: SanitySlug;
  description?: string;
  positioningStatement?: string;
  seoTitle?: string;
  seoDescription?: string;
}

// ─── Author ───────────────────────────────────────────────────────────────────

export interface Author {
  _id: string;
  name: string;
  slug?: SanitySlug;
  bio?: string;
  image?: SanityImage;
}

// ─── Category / Tag ───────────────────────────────────────────────────────────

export interface Category {
  _id: string;
  title: string;
  slug: SanitySlug;
  description?: string;
}

export interface Tag {
  _id: string;
  title: string;
  slug: SanitySlug;
}

// ─── Blog Post ────────────────────────────────────────────────────────────────

export interface Post {
  _id: string;
  _type: "post";
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  publishedAt?: string;
  updatedAt?: string;

  author?: Author;
  coverImage?: SanityImage;
  category?: Category;
  topicCluster?: TopicCluster;
  pillar?: Pillar;
  tags?: Tag[];

  // SEO / AEO
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  focusKeyword?: string;
  aeoQuestion?: string;
  answerSummary?: string;

  // Content
  faqs?: FAQ[];
  body?: SanityBlock[];
  relatedPosts?: PostStub[];

  status?: "draft" | "published";
}

/** Lightweight post reference used for lists and related-posts */
export interface PostStub {
  _id: string;
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  publishedAt?: string;
  coverImage?: SanityImage;
  topicCluster?: Pick<TopicCluster, "_id" | "title" | "slug">;
  tags?: Tag[];
}
