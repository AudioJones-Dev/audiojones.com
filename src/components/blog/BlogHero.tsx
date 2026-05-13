// Blog Hero Component - Header section for individual blog posts
import { PILLARS, formatPillarForDisplay, PillarType } from '@/lib/models/blog';
import IKImage from '@/components/IKImage';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  pillar: PillarType;
  seoDescription?: string;
  ogImage?: string;
  readingTime: number;
  publishedAt: string;
  frameworkUsed?: string;
}

interface BlogHeroProps {
  post: BlogPost;
}

export default function BlogHero({ post }: BlogHeroProps) {
  const pillarConfig = PILLARS[post.pillar];
  const publishDate = new Date(post.publishedAt);

  return (
    <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Pillar Badge */}
          <div className="flex items-center gap-4 mb-6">
            <span
              className="px-4 py-2 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: pillarConfig.color }}
            >
              {pillarConfig.label}
            </span>
            {post.frameworkUsed && (
              <span className="px-4 py-2 bg-[#F0FF85]/20 border border-[#F0FF85]/30 rounded-full text-sm font-semibold text-[#F0FF85]">
                {post.frameworkUsed} Framework
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Description */}
          {post.seoDescription && (
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {post.seoDescription}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-[#E8FF5A]">📅</span>
              <time dateTime={post.publishedAt}>
                {publishDate.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[#E8FF5A]">⏱️</span>
              <span>{post.readingTime} min read</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#E8FF5A]">👨‍💼</span>
              <span>Audio Jones Team</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.ogImage && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-gray-800">
              <IKImage
                src={post.ogImage}
                alt={post.title}
                width={1200}
                height={675}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}