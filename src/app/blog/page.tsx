// Blog Listing Page - Public interface for Audio Jones blog
import { Metadata } from 'next';
import Link from 'next/link';
import { PILLARS, formatPillarForDisplay, PillarType } from '@/lib/models/blog';
import IKImage from '@/components/IKImage';

export const metadata: Metadata = {
  title: 'Blog | Audio Jones',
  description:
    'Applied Intelligence, signal systems, M.A.P Attribution, and AI-readiness insights for founder-led businesses. The Audio Jones knowledge base.',
  keywords: ['Applied Intelligence', 'signal vs noise', 'MAP attribution', 'AI readiness', 'founder-led business', 'Audio Jones'],
  alternates: {
    canonical: 'https://audiojones.com/blog',
  },
  openGraph: {
    title: 'Blog | Audio Jones',
    description:
      'Applied Intelligence, signal systems, M.A.P Attribution, and AI-readiness insights for founder-led businesses.',
    url: 'https://audiojones.com/blog',
    siteName: 'Audio Jones',
    type: 'website',
    images: [{ url: '/assets/og/audio-jones-og.jpg', width: 1200, height: 630, alt: 'Audio Jones Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Audio Jones',
    description:
      'Applied Intelligence, signal systems, M.A.P Attribution, and AI-readiness insights for founder-led businesses.',
    images: ['/assets/og/audio-jones-og.jpg'],
  },
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  pillar: PillarType;
  seoDescription: string;
  ogImage?: string;
  readingTime: number;
  publishedAt: string;
  keyTakeaways: string[];
  ctaType: string;
  ctaHeadline: string;
  ctaDescription: string;
  ctaLink: string;
  contentPerformance?: {
    views: number;
    engagementTime: number;
    socialShares: number;
    performanceScore: number;
  };
}

interface BlogPageProps {
  searchParams: {
    pillar?: string;
    page?: string;
  };
}

// TODO: Replace with Data Connect query
async function getBlogPosts(pillar?: string, page: number = 1): Promise<{ posts: BlogPost[]; total: number }> {
  // Mock data for now - will be replaced with Data Connect query
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'AI Marketing Automation: The Audio Jones Framework for Predictable Growth',
      slug: 'ai-marketing-automation-framework',
      pillar: 'ai',
      seoDescription: 'Discover how Audio Jones uses AI marketing automation to deliver predictable growth for creators and entrepreneurs. Learn the EPM framework and practical implementation strategies.',
      ogImage: '/assets/blog/ai-marketing-automation.jpg',
      readingTime: 8,
      publishedAt: '2024-11-01T10:00:00Z',
      keyTakeaways: [
        'AI automation reduces manual marketing tasks by 75%',
        'EPM framework drives 3x higher conversion rates',
        'Predictable growth through systematic approaches'
      ],
      ctaType: 'newsletter',
      ctaHeadline: 'Get Weekly AI Marketing Insights',
      ctaDescription: 'Join 5,000+ operators getting Audio Jones\' latest AI marketing strategies.',
      ctaLink: '/newsletter',
      contentPerformance: {
        views: 2450,
        engagementTime: 320,
        socialShares: 89,
        performanceScore: 0.87
      }
    },
    {
      id: '2',
      title: 'Creator Economy 2024: Miami Perspective on Monetization Strategies',
      slug: 'creator-economy-monetization-strategies',
      pillar: 'podcast-news',
      seoDescription: 'Audio Jones breaks down the latest creator economy trends and monetization strategies from a Miami operator perspective. Actionable insights for creators and entrepreneurs.',
      readingTime: 6,
      publishedAt: '2024-10-30T14:00:00Z',
      keyTakeaways: [
        'Creator economy now worth $104B globally',
        'Miami creators leading in Web3 adoption',
        'Diversified revenue streams reduce platform risk'
      ],
      ctaType: 'podcast',
      ctaHeadline: 'Listen to Audio Jones Podcast',
      ctaDescription: 'Get deeper insights on creator economy trends and strategies.',
      ctaLink: '/podcast',
      contentPerformance: {
        views: 1890,
        engagementTime: 280,
        socialShares: 124,
        performanceScore: 0.78
      }
    },
    {
      id: '3',
      title: 'SEO vs AEO: Why Answer Engine Optimization Dominates in 2024',
      slug: 'seo-vs-aeo-answer-engine-optimization',
      pillar: 'marketing',
      seoDescription: 'Learn why Answer Engine Optimization (AEO) is replacing traditional SEO strategies. Audio Jones shares practical AEO implementation tactics for modern marketers.',
      readingTime: 7,
      publishedAt: '2024-10-28T09:00:00Z',
      keyTakeaways: [
        'AEO drives 45% more qualified traffic than SEO',
        'Answer-first content strategy improves conversions',
        'Voice search optimization becomes critical'
      ],
      ctaType: 'services',
      ctaHeadline: 'Scale Your AEO Strategy',
      ctaDescription: 'Work with Audio Jones to implement AEO for predictable growth.',
      ctaLink: '/services',
      contentPerformance: {
        views: 3100,
        engagementTime: 410,
        socialShares: 67,
        performanceScore: 0.92
      }
    }
  ];

  // Filter by pillar if specified
  const filteredPosts = pillar 
    ? mockPosts.filter(post => post.pillar === pillar)
    : mockPosts;

  return {
    posts: filteredPosts,
    total: filteredPosts.length
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPillar = searchParams.pillar as PillarType | undefined;
  const currentPage = parseInt(searchParams.page || '1');
  
  const { posts, total } = await getBlogPosts(currentPillar, currentPage);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Audio Jones <span className="text-[#FF4500]">Blog</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Operator insights on AI marketing, automation, and predictable growth. 
              Miami-forward perspective on the creator economy and business development.
            </p>
          </div>

          {/* Pillar Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              href="/blog"
              className={`px-6 py-3 rounded-full transition-colors ${
                !currentPillar 
                  ? 'bg-[#FF4500] text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All Posts
            </Link>
            {Object.entries(PILLARS).map(([key, config]) => (
              <Link
                key={key}
                href={`/blog?pillar=${key}`}
                className={`px-6 py-3 rounded-full transition-colors ${
                  currentPillar === key
                    ? 'text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                style={{
                  backgroundColor: currentPillar === key ? config.color : undefined
                }}
              >
                {config.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-400 mb-4">
                No posts found
              </h2>
              <p className="text-gray-500">
                {currentPillar 
                  ? `No posts available for ${formatPillarForDisplay(currentPillar)} yet.`
                  : 'No blog posts available yet.'
                }
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Load More / Pagination */}
          {posts.length > 0 && (
            <div className="text-center mt-16">
              <button className="bg-[#FF4500] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#FF4500]/90 transition-colors">
                Load More Posts
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-[#FF4500]/10 to-[#FFD700]/10 border border-[#FF4500]/20 rounded-2xl p-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Get Audio Jones <span className="text-[#FF4500]">Weekly Insights</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join 5,000+ operators getting weekly insights on AI marketing, automation, 
              and predictable growth strategies. Miami-forward perspective delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#FF4500] focus:outline-none"
              />
              <button className="bg-[#FF4500] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#FF4500]/90 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              No spam. Unsubscribe anytime. Powered by Audio Jones AI systems.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Blog Post Card Component
function BlogPostCard({ post }: { post: BlogPost }) {
  const pillarConfig = PILLARS[post.pillar];
  
  return (
    <article className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-[#FF4500]/30 transition-all duration-300 group">
      {/* Featured Image */}
      {post.ogImage && (
        <div className="aspect-[16/9] overflow-hidden">
          <IKImage
            src={post.ogImage}
            alt={post.title}
            width={400}
            height={225}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {/* Pillar Badge & Meta */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: pillarConfig.color }}
          >
            {pillarConfig.label}
          </span>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{post.readingTime} min read</span>
            {post.contentPerformance && (
              <span>{post.contentPerformance.views.toLocaleString()} views</span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <Link href={`/blog/${post.slug}`} className="group">
          <h2 className="text-xl font-bold mb-3 group-hover:text-[#FF4500] transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-gray-300 mb-4 line-clamp-3">
          {post.seoDescription}
        </p>

        {/* Key Takeaways */}
        {post.keyTakeaways.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#FFD700] mb-2">Key Takeaways:</h3>
            <ul className="space-y-1">
              {post.keyTakeaways.slice(0, 2).map((takeaway, index) => (
                <li key={index} className="text-sm text-gray-400 flex items-start">
                  <span className="text-[#FF4500] mr-2">•</span>
                  {takeaway}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="text-sm text-gray-400">
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          
          <Link 
            href={`/blog/${post.slug}`}
            className="text-[#FF4500] hover:text-[#FF4500]/80 transition-colors text-sm font-semibold"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
}