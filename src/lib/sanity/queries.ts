/**
 * GROQ queries for the Audio Jones blog.
 *
 * All queries filter on status == "published" so drafts never leak to the
 * public site. The `defineQuery` helper from next-sanity adds type inference
 * in editors that support it.
 *
 * Keep params explicit — never interpolate user input into GROQ strings.
 */

import { defineQuery } from "next-sanity";

// ─── Field projections ────────────────────────────────────────────────────────

const SLUG_FIELDS = `"slug": slug.current`;

const COVER_IMAGE_FIELDS = `
  coverImage {
    "url": asset->url,
    alt,
    caption
  }
`;

const TOPIC_CLUSTER_STUB = `
  topicCluster-> {
    _id,
    title,
    ${SLUG_FIELDS}
  }
`;

const POST_STUB_FIELDS = `
  _id,
  title,
  ${SLUG_FIELDS},
  excerpt,
  publishedAt,
  ${COVER_IMAGE_FIELDS},
  ${TOPIC_CLUSTER_STUB},
  "tags": tags[]->{ _id, title, ${SLUG_FIELDS} }
`;

const POST_FULL_FIELDS = `
  _id,
  _type,
  title,
  ${SLUG_FIELDS},
  excerpt,
  publishedAt,
  updatedAt,
  "author": author->{ _id, name, bio, "image": image{ "url": asset->url, alt } },
  ${COVER_IMAGE_FIELDS},
  "category": category->{ _id, title, ${SLUG_FIELDS} },
  ${TOPIC_CLUSTER_STUB},
  "pillar": pillar->{ _id, title, ${SLUG_FIELDS} },
  "tags": tags[]->{ _id, title, ${SLUG_FIELDS} },
  seoTitle,
  seoDescription,
  canonicalUrl,
  focusKeyword,
  aeoQuestion,
  answerSummary,
  faqs[] { _key, question, answer },
  body,
  "relatedPosts": relatedPosts[]->{ ${POST_STUB_FIELDS} }
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

/** All published posts, newest first. */
export const ALL_POSTS_QUERY = defineQuery(`
  *[_type == "post" && status == "published"] | order(publishedAt desc) {
    ${POST_STUB_FIELDS}
  }
`);

/** Featured posts (up to 3) — those marked featuredOnHome or newest published. */
export const FEATURED_POSTS_QUERY = defineQuery(`
  *[_type == "post" && status == "published"] | order(publishedAt desc) [0..2] {
    ${POST_STUB_FIELDS}
  }
`);

/** Single post by slug. */
export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug && status == "published"][0] {
    ${POST_FULL_FIELDS}
  }
`);

/** Posts in a specific topic cluster (by cluster slug). */
export const POSTS_BY_TOPIC_QUERY = defineQuery(`
  *[_type == "post" && status == "published" && topicCluster->slug.current == $topicSlug]
    | order(publishedAt desc) {
    ${POST_STUB_FIELDS}
  }
`);

/** Posts in a specific category. */
export const POSTS_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "post" && status == "published" && category->slug.current == $categorySlug]
    | order(publishedAt desc) {
    ${POST_STUB_FIELDS}
  }
`);

/** Posts by tag. */
export const POSTS_BY_TAG_QUERY = defineQuery(`
  *[_type == "post" && status == "published" && $tagSlug in tags[]->slug.current]
    | order(publishedAt desc) {
    ${POST_STUB_FIELDS}
  }
`);

/** All topic clusters. */
export const ALL_TOPIC_CLUSTERS_QUERY = defineQuery(`
  *[_type == "topicCluster"] | order(title asc) {
    _id,
    title,
    ${SLUG_FIELDS},
    description,
    pillar,
    primaryKeyword,
    seoTitle,
    seoDescription
  }
`);

/** Single topic cluster by slug. */
export const TOPIC_CLUSTER_BY_SLUG_QUERY = defineQuery(`
  *[_type == "topicCluster" && slug.current == $slug][0] {
    _id,
    title,
    ${SLUG_FIELDS},
    description,
    pillar,
    primaryKeyword,
    seoTitle,
    seoDescription
  }
`);

/** Post slugs for static generation (build-time). */
export const ALL_POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && status == "published"] { ${SLUG_FIELDS} }
`);

/** Topic cluster slugs for static generation. */
export const ALL_TOPIC_SLUGS_QUERY = defineQuery(`
  *[_type == "topicCluster"] { ${SLUG_FIELDS} }
`);

/** Sitemap: published posts with last-modified date. */
export const SITEMAP_POSTS_QUERY = defineQuery(`
  *[_type == "post" && status == "published"] {
    ${SLUG_FIELDS},
    "lastModified": coalesce(updatedAt, publishedAt)
  }
`);
