// Blog Draft Editor Component - Full-featured editor for blog content
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PillarType, PILLARS, CTAType } from '@/lib/models/blog';

interface BlogDraft {
  id: string;
  title: string;
  slug: string;
  pillar: PillarType;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];
  ogImage?: string;
  status: 'draft' | 'review' | 'ready';
  aiGenerated: boolean;
  lastModified: string;
  wordCount: number;
  performanceScore?: number;
  ctaType: CTAType;
  ctaHeadline?: string;
  ctaDescription?: string;
  ctaLink?: string;
  faqs?: string;
  keyTakeaways: string[];
}

interface BlogDraftEditorProps {
  draft: BlogDraft;
}

export default function BlogDraftEditor({ draft: initialDraft }: BlogDraftEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState(initialDraft);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'cta' | 'settings'>('content');
  const [wordCount, setWordCount] = useState(draft.content.length);

  // Update word count when content changes
  useEffect(() => {
    const words = draft.content.trim().split(/\s+/).length;
    setWordCount(words);
  }, [draft.content]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // In real app, make API call to save draft
      console.log('Saving draft:', draft);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock save
      
      // Update last modified
      setDraft(prev => ({
        ...prev,
        lastModified: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      // In real app, make API call to publish
      console.log('Publishing draft:', draft);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Mock publish
      router.push('/portal/admin/blog?tab=drafts');
    } catch (error) {
      console.error('Error publishing draft:', error);
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const updateDraft = (updates: Partial<BlogDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  };

  const tabs = [
    { id: 'content', label: 'Content', icon: '📝' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'cta', label: 'CTA', icon: '🎯' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#F0FF85]">
              📝 Edit Draft
            </h1>
            <p className="text-sm text-gray-400">
              Last modified: {new Date(draft.lastModified).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">
            {wordCount} words
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="bg-[#E8FF5A] hover:bg-[#F0FF85] disabled:opacity-50 text-[#080808] px-4 py-2 rounded-lg transition-colors"
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-6 bg-gray-800 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[#E8FF5A] text-[#080808]'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => {
                const newTitle = e.target.value;
                updateDraft({ 
                  title: newTitle, 
                  slug: generateSlug(newTitle) 
                });
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8FF5A]"
              placeholder="Enter blog post title..."
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL Slug
            </label>
            <div className="flex items-center">
              <span className="text-gray-400 text-sm mr-2">/blog/</span>
              <input
                type="text"
                value={draft.slug}
                onChange={(e) => updateDraft({ slug: e.target.value })}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8FF5A]"
              />
            </div>
          </div>

          {/* Pillar */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content Pillar
            </label>
            <select
              value={draft.pillar}
              onChange={(e) => updateDraft({ pillar: e.target.value as PillarType })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E8FF5A]"
            >
              {Object.entries(PILLARS).map(([key, pillar]) => (
                <option key={key} value={key}>
                  {pillar.label}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content (Markdown)
            </label>
            <textarea
              value={draft.content}
              onChange={(e) => updateDraft({ content: e.target.value })}
              className="w-full h-96 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8FF5A] font-mono text-sm"
              placeholder="Write your blog content in Markdown..."
            />
            <div className="text-xs text-gray-400 mt-2">
              Supports Markdown formatting. {wordCount} words
            </div>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              SEO Title
            </label>
            <input
              type="text"
              value={draft.seoTitle || ''}
              onChange={(e) => updateDraft({ seoTitle: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8FF5A]"
              placeholder="SEO optimized title (60 chars max)"
              maxLength={60}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Meta Description
            </label>
            <textarea
              value={draft.seoDescription || ''}
              onChange={(e) => updateDraft({ seoDescription: e.target.value })}
              className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8FF5A]"
              placeholder="SEO meta description (160 chars max)"
              maxLength={160}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Keywords (comma separated)
            </label>
            <input
              type="text"
              value={draft.seoKeywords.join(', ')}
              onChange={(e) => updateDraft({ 
                seoKeywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
              })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8FF5A]"
              placeholder="keyword 1, keyword 2, keyword 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              OG Image URL
            </label>
            <input
              type="text"
              value={draft.ogImage || ''}
              onChange={(e) => updateDraft({ ogImage: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8FF5A]"
              placeholder="/assets/blog/post-image.jpg"
            />
          </div>
        </div>
      )}

      {/* CTA Tab */}
      {activeTab === 'cta' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CTA Type
            </label>
            <select
              value={draft.ctaType}
              onChange={(e) => updateDraft({ ctaType: e.target.value as CTAType })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E8FF5A]"
            >
              <option value="newsletter">Newsletter Signup</option>
              <option value="podcast">Podcast Subscribe</option>
              <option value="services">Services</option>
              <option value="lead_magnet">Lead Magnet</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CTA Headline
            </label>
            <input
              type="text"
              value={draft.ctaHeadline || ''}
              onChange={(e) => updateDraft({ ctaHeadline: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8FF5A]"
              placeholder="Compelling CTA headline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CTA Description
            </label>
            <textarea
              value={draft.ctaDescription || ''}
              onChange={(e) => updateDraft({ ctaDescription: e.target.value })}
              className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8FF5A]"
              placeholder="Describe the value proposition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CTA Link
            </label>
            <input
              type="text"
              value={draft.ctaLink || ''}
              onChange={(e) => updateDraft({ ctaLink: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8FF5A]"
              placeholder="/download/resource or https://external-link.com"
            />
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={draft.status}
              onChange={(e) => updateDraft({ status: e.target.value as any })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E8FF5A]"
            >
              <option value="draft">Draft</option>
              <option value="review">Ready for Review</option>
              <option value="ready">Ready to Publish</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={draft.aiGenerated}
              onChange={(e) => updateDraft({ aiGenerated: e.target.checked })}
              className="w-4 h-4 text-[#E8FF5A] bg-gray-700 border-gray-600 rounded focus:ring-[#E8FF5A]"
            />
            <label className="text-sm text-gray-300">
              AI Generated Content
            </label>
          </div>

          {draft.performanceScore && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Performance Score
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] h-2 rounded-full"
                    style={{ width: `${draft.performanceScore}%` }}
                  />
                </div>
                <span className="text-[#F0FF85] font-semibold">
                  {draft.performanceScore}%
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-700 text-center">
        <p className="text-xs text-gray-400">
          🔥 <span className="text-[#E8FF5A]">Audio Jones</span> Blog Editor • 
          Miami operator-level content creation • 
          <span className="text-[#F0FF85]">Predictable growth through systematic content</span>
        </p>
      </div>
    </div>
  );
}