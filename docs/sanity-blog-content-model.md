# Audio Jones — Sanity Blog Content Model

This document defines the Sanity Studio schema for the Audio Jones blog system.
The blog is an AEO/SEO topic-cluster engine, not a generic blog.

---

## Environment Variables

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_API_READ_TOKEN=           # Optional — only for draft/preview
```

The frontend degrades gracefully if `NEXT_PUBLIC_SANITY_PROJECT_ID` is absent.
`/blog` renders with topic-cluster cards and an empty-state message.
No runtime errors are thrown.

---

## Topic Architecture

```
Pillar → TopicCluster → Post
```

### Core Pillars

1. Applied Intelligence Systems
2. Signal vs Noise
3. M.A.P Attribution
4. Why AI Fails
5. AI Readiness for Founder-Led Businesses

### Topic Cluster Routes

```
/blog/topic/applied-intelligence-systems
/blog/topic/signal-vs-noise
/blog/topic/map-attribution
/blog/topic/why-ai-fails
/blog/topic/ai-readiness
```

---

## Schema Definitions

### `post`

```js
{
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title',          type: 'string',    required: true },
    { name: 'slug',           type: 'slug',      required: true, options: { source: 'title' } },
    { name: 'status',         type: 'string',    options: { list: ['draft', 'published'] }, initialValue: 'draft' },
    { name: 'excerpt',        type: 'text',      rows: 3 },
    { name: 'publishedAt',    type: 'datetime' },
    { name: 'updatedAt',      type: 'datetime' },
    { name: 'author',         type: 'reference', to: [{ type: 'author' }] },
    { name: 'coverImage',     type: 'image',     options: { hotspot: true }, fields: [{ name: 'alt', type: 'string' }, { name: 'caption', type: 'string' }] },
    { name: 'category',       type: 'reference', to: [{ type: 'category' }] },
    { name: 'topicCluster',   type: 'reference', to: [{ type: 'topicCluster' }] },
    { name: 'pillar',         type: 'reference', to: [{ type: 'pillar' }] },
    { name: 'tags',           type: 'array',     of: [{ type: 'reference', to: [{ type: 'tag' }] }] },

    // SEO / AEO
    { name: 'seoTitle',       type: 'string',    description: 'Defaults to title if empty' },
    { name: 'seoDescription', type: 'text',      rows: 2, description: 'Defaults to excerpt' },
    { name: 'canonicalUrl',   type: 'url',       description: 'Leave empty to auto-generate' },
    { name: 'focusKeyword',   type: 'string' },
    { name: 'aeoQuestion',    type: 'string',    description: 'The question this post answers for AI search engines' },
    { name: 'answerSummary',  type: 'text',      rows: 3, description: 'Direct answer shown at top of post — must be 2-4 sentences' },

    // Content
    { name: 'body',           type: 'array',     of: [{ type: 'block' }, { type: 'image' }] },
    { name: 'faqs',           type: 'array',     of: [{ type: 'faq' }] },
    { name: 'relatedPosts',   type: 'array',     of: [{ type: 'reference', to: [{ type: 'post' }] }], max: 3 },
  ],
  preview: {
    select: { title: 'title', status: 'status', cluster: 'topicCluster.title' },
    prepare: ({ title, status, cluster }) => ({
      title,
      subtitle: `${status ?? 'draft'} · ${cluster ?? 'No cluster'}`,
    }),
  },
}
```

### `topicCluster`

```js
{
  name: 'topicCluster',
  title: 'Topic Cluster',
  type: 'document',
  fields: [
    { name: 'title',              type: 'string',    required: true },
    { name: 'slug',               type: 'slug',      required: true, options: { source: 'title' } },
    { name: 'description',        type: 'text',      rows: 3 },
    { name: 'pillar',             type: 'string',    description: 'Parent pillar name' },
    { name: 'primaryKeyword',     type: 'string' },
    { name: 'secondaryKeywords',  type: 'array',     of: [{ type: 'string' }] },
    { name: 'aeoQuestions',       type: 'array',     of: [{ type: 'string' }], description: 'Questions this cluster should rank for in AI search' },
    { name: 'seoTitle',           type: 'string' },
    { name: 'seoDescription',     type: 'text',      rows: 2 },
  ],
}
```

### `pillar`

```js
{
  name: 'pillar',
  title: 'Content Pillar',
  type: 'document',
  fields: [
    { name: 'title',                  type: 'string', required: true },
    { name: 'slug',                   type: 'slug',   required: true, options: { source: 'title' } },
    { name: 'description',            type: 'text',   rows: 3 },
    { name: 'positioningStatement',   type: 'text',   rows: 2 },
    { name: 'seoTitle',               type: 'string' },
    { name: 'seoDescription',         type: 'text',   rows: 2 },
  ],
}
```

### `author`

```js
{
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    { name: 'name',   type: 'string',  required: true },
    { name: 'slug',   type: 'slug',    options: { source: 'name' } },
    { name: 'bio',    type: 'text',    rows: 3 },
    { name: 'image',  type: 'image',   options: { hotspot: true }, fields: [{ name: 'alt', type: 'string' }] },
  ],
}
```

### `category`

```js
{
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    { name: 'title',       type: 'string', required: true },
    { name: 'slug',        type: 'slug',   required: true, options: { source: 'title' } },
    { name: 'description', type: 'text',   rows: 2 },
  ],
}
```

### `tag`

```js
{
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', required: true },
    { name: 'slug',  type: 'slug',   required: true, options: { source: 'title' } },
  ],
}
```

### `faq` (reusable object)

```js
{
  name: 'faq',
  title: 'FAQ',
  type: 'object',
  fields: [
    { name: 'question', type: 'string', required: true },
    { name: 'answer',   type: 'text',   rows: 3, required: true },
  ],
}
```

---

## AEO Rules for Every Post

Every published post must include:

1. **`answerSummary`** — 2–4 sentence direct answer to the post's primary question.
   This is displayed at the top of the article and used in AEO/AI search engine extraction.
   Example format:
   > AI fails in small businesses because automation is applied before the business has clear
   > processes, clean data, attribution logic, or decision systems. Without these foundations,
   > AI amplifies existing noise rather than identifying signal.

2. **`aeoQuestion`** — The single question the post answers.
   Example: `"Why does AI fail in founder-led businesses?"`

3. **`faqs`** — At least 3 FAQ pairs per post. Used for FAQPage JSON-LD schema.

4. **`seoTitle`** and **`seoDescription`** — Always populated.

5. **`topicCluster`** reference — Every post must belong to a cluster.

6. **`status: "published"`** — Posts in draft state are never served to the public.

---

## First 10 Articles to Seed

| # | Title | Cluster | Focus Keyword |
|---|---|---|---|
| 1 | What Is an Applied Intelligence System? | applied-intelligence-systems | applied intelligence system |
| 2 | Why AI Fails in Founder-Led Businesses | why-ai-fails | why AI fails small business |
| 3 | What Is Signal vs Noise in Business? | signal-vs-noise | signal vs noise business |
| 4 | What Is M.A.P Attribution? | map-attribution | MAP attribution framework |
| 5 | Attribution Is Not Tracking Everything | map-attribution | marketing attribution |
| 6 | Why Automation Fails Without Systems | why-ai-fails | business automation failure |
| 7 | How to Know If Your Business Is AI Ready | ai-readiness | AI readiness checklist |
| 8 | Vanity Metrics vs Causal Metrics | signal-vs-noise | vanity metrics causal metrics |
| 9 | How Founder-Led Businesses Can Use AI Without Scaling Chaos | ai-readiness | AI for founders |
| 10 | Diagnose Before You Automate | applied-intelligence-systems | diagnose before automate |

---

## Internal Linking Strategy

Each post should link to at least one framework page:

- Applied Intelligence Systems → `/frameworks/applied-intelligence-systems`
- Signal vs Noise → `/frameworks/signal-vs-noise`
- M.A.P Attribution → `/frameworks/map-attribution`
- AI content → `/applied-intelligence`
- Diagnostic CTAs → `/applied-intelligence/diagnostic`

---

## Blog Positioning Statement

> The Audio Jones blog documents Applied Intelligence Systems, signal strategy,
> attribution, and AI-readiness for founder-led businesses.

Use this in meta descriptions, social bios, and `og:description` fields.
