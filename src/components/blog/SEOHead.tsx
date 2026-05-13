// SEO Head Component - Structured data and meta tags for blog posts
import { PillarType } from '@/lib/models/blog';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  pillar: PillarType;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];
  ogImage?: string;
  readingTime: number;
  publishedAt: string;
  frameworkUsed?: string;
}

interface SEOHeadProps {
  post: BlogPost;
  structuredData?: any;
}

export default function SEOHead({ post, structuredData }: SEOHeadProps) {
  // Generate structured data if not provided
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    author: {
      '@type': 'Organization',
      name: 'Audio Jones / AJ DIGITAL LLC',
      url: 'https://audiojones.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Audio Jones',
      logo: {
        '@type': 'ImageObject',
        url: 'https://audiojones.com/logo-icon.svg',
        width: 200,
        height: 60,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://audiojones.com/blog/${post.slug}`,
    },
    image: post.ogImage ? {
      '@type': 'ImageObject',
      url: `https://audiojones.com${post.ogImage}`,
      width: 1200,
      height: 630,
    } : undefined,
    keywords: post.seoKeywords.join(', '),
    articleSection: post.pillar,
    ...(post.frameworkUsed && {
      mentions: {
        '@type': 'Thing',
        name: `${post.frameworkUsed} Framework`,
        description: `Audio Jones ${post.frameworkUsed} framework for predictable growth`,
      },
    }),
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  // Generate breadcrumb structured data
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://audiojones.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://audiojones.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://audiojones.com/blog/${post.slug}`,
      },
    ],
  };

  // Generate organization structured data
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Audio Jones',
    alternateName: 'AJ DIGITAL LLC',
    url: 'https://audiojones.com',
    logo: 'https://audiojones.com/logo-icon.svg',
    foundingLocation: {
      '@type': 'Place',
      name: 'Miami, FL',
    },
    specialty: 'AI Marketing Automation',
    description: 'Miami-based AI branding and marketing agency specializing in predictable growth through automation and systematic frameworks.',
    sameAs: [
      'https://twitter.com/audiojonesco',
      'https://linkedin.com/company/audiojones',
    ],
  };

  return (
    <>
      {/* Article structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData),
        }}
      />

      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />

      {/* Organization structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />

      {/* Additional meta tags for better SEO */}
      <meta name="author" content="Audio Jones Team" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Article-specific meta tags */}
      <meta property="article:publisher" content="https://audiojones.com" />
      <meta property="article:author" content="Audio Jones Team" />
      <meta property="article:published_time" content={post.publishedAt} />
      <meta property="article:modified_time" content={post.publishedAt} />
      <meta property="article:section" content={post.pillar} />
      
      {post.seoKeywords.map((keyword) => (
        <meta key={keyword} property="article:tag" content={keyword} />
      ))}

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@audiojonesco" />
      <meta name="twitter:creator" content="@audiojonesco" />
      
      {/* Additional Open Graph tags */}
      <meta property="og:site_name" content="Audio Jones Blog" />
      <meta property="og:locale" content="en_US" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`https://audiojones.com/blog/${post.slug}`} />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://ik.imagekit.io" />
      <link rel="dns-prefetch" href="https://ik.imagekit.io" />
    </>
  );
}