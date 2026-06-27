// Blog Content Component - Simple markdown renderer with Audio Jones styling
'use client';

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  // Simple markdown-like processing for now
  const processContent = (text: string) => {
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="blog-heading blog-heading-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="blog-heading blog-heading-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="blog-heading blog-heading-1">$1</h1>')
      
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="blog-strong">$1</strong>')
      
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="blog-emphasis">$1</em>')
      
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<div class="blog-code-block"><pre class="blog-code"><code>$1</code></pre></div>')
      
      // Inline code
      .replace(/`(.*?)`/g, '<code class="blog-inline-code">$1</code>')
      
      // Links
      .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2" class="blog-link">$1</a>')
      
      // Line breaks to paragraphs
      .split('\n\n')
      .map(paragraph => {
        if (paragraph.trim() === '') return '';
        if (paragraph.startsWith('<h') || paragraph.startsWith('<div class="blog-code')) {
          return paragraph;
        }
        return `<p class="blog-paragraph">${paragraph}</p>`;
      })
      .join('\n');
  };

  const processedContent = processContent(content);

  return (
    <article className="blog-content">
      <div 
        dangerouslySetInnerHTML={{ __html: processedContent }}
        className="prose prose-lg prose-invert max-w-none"
      />
      
      <style>{`
        .blog-content {
          line-height: 1.8;
          color: #E8E8E8;
        }

        .blog-heading {
          font-weight: 700;
          margin: 2rem 0 1rem 0;
          color: #ffffff;
          line-height: 1.3;
        }

        .blog-heading-1 {
          font-size: 2.5rem;
          margin-top: 0;
          border-bottom: 2px solid #E8FF5A;
          padding-bottom: 0.5rem;
        }

        .blog-heading-2 {
          font-size: 2rem;
          color: #E8FF5A;
          margin-top: 3rem;
        }

        .blog-heading-3 {
          font-size: 1.5rem;
          color: #E8FF5A;
        }

        .blog-paragraph {
          margin: 1.5rem 0;
          color: #d1d5db;
          font-size: 1.125rem;
          line-height: 1.8;
        }

        .blog-code-block {
          margin: 2rem 0;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #374151;
          background: #1f2937;
        }

        .blog-code {
          background: #1f2937;
          color: #E8E8E8;
          padding: 1.5rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
          overflow-x: auto;
        }

        .blog-inline-code {
          background: #374151;
          color: #E8FF5A;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875em;
        }

        .blog-link {
          color: #E8FF5A;
          text-decoration: underline;
          text-decoration-color: rgba(232, 255, 90, 0.5);
          transition: all 0.2s ease;
        }

        .blog-link:hover {
          color: #F0FF85;
          text-decoration-color: #F0FF85;
        }

        .blog-strong {
          color: #ffffff;
          font-weight: 700;
        }

        .blog-emphasis {
          color: #E8FF5A;
          font-style: italic;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .blog-heading-1 {
            font-size: 2rem;
          }

          .blog-heading-2 {
            font-size: 1.75rem;
          }

          .blog-heading-3 {
            font-size: 1.375rem;
          }

          .blog-paragraph {
            font-size: 1rem;
          }

          .blog-code {
            padding: 1rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </article>
  );
}
