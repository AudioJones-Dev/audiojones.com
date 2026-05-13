// Drafts List Component - Manage blog drafts with Audio Jones styling
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PillarType, PILLARS } from '@/lib/models/blog';

interface BlogDraft {
  id: string;
  title: string;
  slug: string;
  pillar: PillarType;
  status: 'draft' | 'review' | 'ready';
  aiGenerated: boolean;
  lastModified: string;
  wordCount: number;
  performanceScore?: number;
  scheduledFor?: string;
}

interface DraftsListProps {
  pillarFilter?: PillarType;
}

export default function DraftsList({ pillarFilter }: DraftsListProps) {
  const [drafts, setDrafts] = useState<BlogDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data - replace with real API call
  useEffect(() => {
    const mockDrafts: BlogDraft[] = [
      {
        id: '1',
        title: 'AI Marketing Automation Framework for Creators',
        slug: 'ai-marketing-automation-framework',
        pillar: 'ai',
        status: 'ready',
        aiGenerated: true,
        lastModified: '2024-01-15T10:30:00Z',
        wordCount: 2400,
        performanceScore: 89,
        scheduledFor: '2024-01-16T09:00:00Z'
      },
      {
        id: '2', 
        title: 'Personal Brand Strategy: Miami Operator Approach',
        slug: 'personal-brand-strategy-miami-operator',
        pillar: 'personal-brand',
        status: 'review',
        aiGenerated: false,
        lastModified: '2024-01-14T16:45:00Z',
        wordCount: 1800,
        performanceScore: 76
      },
      {
        id: '3',
        title: 'Podcast Growth Hacks That Actually Work',
        slug: 'podcast-growth-hacks-that-work',
        pillar: 'podcast-news',
        status: 'draft',
        aiGenerated: true,
        lastModified: '2024-01-14T08:20:00Z',
        wordCount: 1200,
        performanceScore: 65
      },
      {
        id: '4',
        title: 'Tech Business Trends: Q1 2024 Predictions',
        slug: 'tech-business-trends-q1-2024',
        pillar: 'tech-business-trends',
        status: 'draft',
        aiGenerated: false,
        lastModified: '2024-01-13T14:15:00Z',
        wordCount: 3200
      },
      {
        id: '5',
        title: 'Marketing ROI Calculator Framework',
        slug: 'marketing-roi-calculator-framework',
        pillar: 'marketing',
        status: 'ready',
        aiGenerated: true,
        lastModified: '2024-01-13T11:30:00Z',
        wordCount: 2100,
        performanceScore: 82
      }
    ];

    setTimeout(() => {
      setDrafts(mockDrafts);
      setLoading(false);
    }, 500);
  }, []);

  const filteredDrafts = drafts.filter(draft => {
    const statusMatch = filterStatus === 'all' || draft.status === filterStatus;
    const pillarMatch = !pillarFilter || draft.pillar === pillarFilter;
    return statusMatch && pillarMatch;
  });

  const handleSelectDraft = (draftId: string) => {
    setSelectedDrafts(prev => 
      prev.includes(draftId) 
        ? prev.filter(id => id !== draftId)
        : [...prev, draftId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on drafts:`, selectedDrafts);
    // Implement bulk actions
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-400 bg-green-400/20';
      case 'review': return 'text-yellow-400 bg-yellow-400/20';
      case 'draft': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getPillarColor = (pillar: PillarType) => {
    const colors = {
      'ai': 'bg-purple-500/20 text-purple-400',
      'marketing': 'bg-[#E8FF5A]/20 text-[#E8FF5A]',
      'podcast-news': 'bg-blue-500/20 text-blue-400',
      'tech-business-trends': 'bg-green-500/20 text-green-400',
      'personal-brand': 'bg-[#F0FF85]/20 text-[#F0FF85]'
    };
    return colors[pillar] || 'bg-gray-500/20 text-gray-400';
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-[#F0FF85]">
            📝 Content Drafts
          </h2>
          <span className="px-3 py-1 bg-[#E8FF5A]/20 text-[#E8FF5A] text-sm rounded-full">
            {filteredDrafts.length} total
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E8FF5A]"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="ready">Ready</option>
          </select>

          <button className="bg-[#E8FF5A] hover:bg-[#F0FF85] text-[#080808] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            + New Draft
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedDrafts.length > 0 && (
        <div className="mb-4 p-3 bg-[#E8FF5A]/10 border border-[#E8FF5A]/30 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#E8FF5A]">
              {selectedDrafts.length} drafts selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('publish')}
                className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              >
                Publish
              </button>
              <button
                onClick={() => handleBulkAction('schedule')}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                Schedule
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drafts List */}
      <div className="space-y-3">
        {filteredDrafts.map((draft) => (
          <div
            key={draft.id}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/70 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedDrafts.includes(draft.id)}
                onChange={() => handleSelectDraft(draft.id)}
                className="mt-1 w-4 h-4 text-[#E8FF5A] bg-gray-700 border-gray-600 rounded focus:ring-[#E8FF5A] focus:ring-2"
              />

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      <Link 
                        href={`/portal/admin/blog/edit/${draft.id}`}
                        className="hover:text-[#E8FF5A] transition-colors"
                      >
                        {draft.title}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>/{draft.slug}</span>
                      <span>•</span>
                      <span>{draft.wordCount} words</span>
                      <span>•</span>
                      <span>{new Date(draft.lastModified).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Performance Score */}
                  {draft.performanceScore && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#F0FF85]">
                        {draft.performanceScore}%
                      </div>
                      <div className="text-xs text-gray-400">Performance</div>
                    </div>
                  )}
                </div>

                {/* Tags and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPillarColor(draft.pillar)}`}>
                      {PILLARS[draft.pillar].label}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(draft.status)}`}>
                      {draft.status}
                    </span>
                    {draft.aiGenerated && (
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">
                        🤖 AI Generated
                      </span>
                    )}
                    {draft.scheduledFor && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                        📅 Scheduled
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/portal/admin/blog/edit/${draft.id}`}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/blog/${draft.slug}`}
                      target="_blank"
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                    >
                      Preview
                    </Link>
                    {draft.status === 'ready' && (
                      <button className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors">
                        Publish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDrafts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-white mb-2">No drafts found</h3>
          <p className="text-gray-400 mb-4">
            {pillarFilter 
              ? `No drafts found for ${PILLARS[pillarFilter].label} pillar`
              : 'Create your first draft to get started'
            }
          </p>
          <button className="bg-[#E8FF5A] hover:bg-[#F0FF85] text-[#080808] px-6 py-2 rounded-lg font-medium transition-colors">
            + Create Draft
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700 text-center">
        <p className="text-xs text-gray-400">
          🔥 <span className="text-[#E8FF5A]">Audio Jones</span> Content Management • 
          Miami operator-level efficiency • 
          <span className="text-[#F0FF85]">Predictable content growth</span>
        </p>
      </div>
    </div>
  );
}