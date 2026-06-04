// Related Posts Component - Pillar-based recommendations
import Link from 'next/link';
import { PILLARS, PillarType } from '@/lib/models/blog';
import IKImage from '@/components/IKImage';

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  pillar: PillarType;
  seoDescription: string;
  ogImage?: string;
  readingTime: number;
  publishedAt: string;
}

interface RelatedPostsProps {
  currentPillar: PillarType;
  currentSlug: string;
}

// TODO: Replace with Data Connect query
async function getRelatedPosts(pillar: PillarType, excludeSlug: string): Promise<RelatedPost[]> {
  // Mock data for now - will be replaced with Data Connect query
  const mockPosts: RelatedPost[] = [
    {
      id: '2',
      title: 'Creator Economy Monetization: Miami Perspective',
      slug: 'creator-economy-monetization-strategies',
      pillar: 'podcast-news',
      seoDescription: 'Discover the latest creator economy trends and monetization strategies from Audio Jones Miami operators.',
      ogImage: '/assets/blog/creator-economy.jpg',
      readingTime: 6,
      publishedAt: '2024-10-30T14:00:00Z'
    },
    {
      id: '3',
      title: 'SEO vs AEO: Answer Engine Optimization Guide',
      slug: 'seo-vs-aeo-answer-engine-optimization',
      pillar: 'marketing',
      seoDescription: 'Learn why Answer Engine Optimization (AEO) is replacing traditional SEO in 2024.',
      readingTime: 7,
      publishedAt: '2024-10-28T09:00:00Z'
    },
    {
      id: '4',
      title: 'Personal Brand Development Framework',
      slug: 'personal-brand-development-framework',
      pillar: 'personal-brand',
      seoDescription: 'Build a powerful personal brand with Audio Jones proven framework and strategies.',
      readingTime: 9,
      publishedAt: '2024-10-25T11:00:00Z'
    }
  ];

  // Filter out current post and prioritize same pillar
  return mockPosts
    .filter(post => post.slug !== excludeSlug)
    .sort((a, b) => {
      // Prioritize same pillar posts
      if (a.pillar === pillar && b.pillar !== pillar) return -1;
      if (a.pillar !== pillar && b.pillar === pillar) return 1;
      // Then sort by date
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, 3);
}

export default async function RelatedPosts({ currentPillar, currentSlug }: RelatedPostsProps) {
  const relatedPosts = await getRelatedPosts(currentPillar, currentSlug);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface-1 border border-border-subtle rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-signal-yellow">📚</span>
        Related Posts
      </h3>

      <div className="space-y-4">
        {relatedPosts.map((post) => (
          <RelatedPostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border-subtle text-center">
        <Link
          href="/blog"
          className="text-signal-yellow hover:text-signal-soft transition-colors font-semibold"
        >
          View All Posts →
        </Link>
      </div>
    </div>
  );
}

function RelatedPostCard({ post }: { post: RelatedPost }) {
  const pillarConfig = PILLARS[post.pillar];

  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="flex gap-4 p-3 rounded-lg hover:bg-surface-2 transition-colors">
          {/* Thumbnail */}
          {post.ogImage && (
            <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
              <IKImage
                src={post.ogImage}
                alt={post.title}
                width={64}
                height={64}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Pillar Badge */}
            <span
              className="inline-block px-2 py-1 text-xs font-semibold text-white rounded mb-1"
              style={{ backgroundColor: pillarConfig.color }}
            >
              {pillarConfig.label}
            </span>

            {/* Title */}
            <h4 className="font-semibold text-white group-hover:text-signal-yellow transition-colors line-clamp-2 mb-1">
              {post.title}
            </h4>

            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <span>{post.readingTime} min</span>
              <span>•</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </time>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}