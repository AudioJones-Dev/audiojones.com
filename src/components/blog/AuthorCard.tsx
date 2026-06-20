// Author Card Component - Audio Jones team information
import IKImage from '@/components/IKImage';
import { ButtonLink } from '@/components/ui/Button';

export default function AuthorCard() {
  return (
    <div className="bg-surface-1 border border-border-subtle rounded-xl p-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-signal-yellow">
          <IKImage
            src="/assets/team/audio-jones-avatar.jpg"
            alt="Audio Jones Team"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Audio Jones Team</h3>
        <p className="text-signal-yellow font-semibold">Miami-Based AI Marketing Operators</p>
      </div>

      <div className="space-y-4 text-sm text-text-muted">
        <p>
          Audio Jones / AJ DIGITAL LLC specializes in AI-powered marketing automation 
          and predictable growth strategies for creators, entrepreneurs, and agencies.
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-signal-yellow">🏢</span>
            <span>Founded in Miami, FL</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-signal-yellow">🎯</span>
            <span>Operator-focused approach</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-signal-yellow">🤖</span>
            <span>AI & automation experts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-signal-yellow">📈</span>
            <span>Predictable growth systems</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border-subtle">
        <h4 className="font-semibold text-white mb-3">Connect with Audio Jones</h4>
        <div className="flex flex-col gap-2">
          <a
            href="/newsletter"
            className="flex items-center gap-3 p-2 rounded-lg bg-surface-2 hover:bg-surface-2 transition-colors"
          >
            <span className="text-signal-yellow">📧</span>
            <span className="text-sm">Weekly Newsletter</span>
          </a>
          <a
            href="/podcast"
            className="flex items-center gap-3 p-2 rounded-lg bg-surface-2 hover:bg-surface-2 transition-colors"
          >
            <span className="text-signal-yellow">🎙️</span>
            <span className="text-sm">Podcast</span>
          </a>
          <a
            href="https://twitter.com/audiojonesco"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg bg-surface-2 hover:bg-surface-2 transition-colors"
          >
            <span className="text-signal-yellow">🐦</span>
            <span className="text-sm">Twitter</span>
          </a>
          <a
            href="https://linkedin.com/company/audiojones"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg bg-surface-2 hover:bg-surface-2 transition-colors"
          >
            <span className="text-signal-yellow">💼</span>
            <span className="text-sm">LinkedIn</span>
          </a>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border-subtle text-center">
        <ButtonLink href="/services" variant="primary">
          Work with Audio Jones
        </ButtonLink>
      </div>
    </div>
  );
}