// Author Card Component - Audio Jones team information
import IKImage from '@/components/IKImage';

export default function AuthorCard() {
  return (
    <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-gray-700 rounded-xl p-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#E8FF5A]">
          <IKImage
            src="/assets/team/audio-jones-avatar.jpg"
            alt="Audio Jones Team"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Audio Jones Team</h3>
        <p className="text-[#E8FF5A] font-semibold">Miami-Based AI Marketing Operators</p>
      </div>

      <div className="space-y-4 text-sm text-gray-300">
        <p>
          Audio Jones / AJ DIGITAL LLC specializes in AI-powered marketing automation 
          and predictable growth strategies for creators, entrepreneurs, and agencies.
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#E8FF5A]">🏢</span>
            <span>Founded in Miami, FL</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#E8FF5A]">🎯</span>
            <span>Operator-focused approach</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#E8FF5A]">🤖</span>
            <span>AI & automation experts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#E8FF5A]">📈</span>
            <span>Predictable growth systems</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700">
        <h4 className="font-semibold text-white mb-3">Connect with Audio Jones</h4>
        <div className="flex flex-col gap-2">
          <a
            href="/newsletter"
            className="flex items-center gap-3 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <span className="text-[#F0FF85]">📧</span>
            <span className="text-sm">Weekly Newsletter</span>
          </a>
          <a
            href="/podcast"
            className="flex items-center gap-3 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <span className="text-[#F0FF85]">🎙️</span>
            <span className="text-sm">Podcast</span>
          </a>
          <a
            href="https://twitter.com/audiojonesco"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <span className="text-[#F0FF85]">🐦</span>
            <span className="text-sm">Twitter</span>
          </a>
          <a
            href="https://linkedin.com/company/audiojones"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <span className="text-[#F0FF85]">💼</span>
            <span className="text-sm">LinkedIn</span>
          </a>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700 text-center">
        <a
          href="/services"
          className="inline-block bg-[#E8FF5A] text-[#080808] px-6 py-3 rounded-lg font-semibold hover:bg-[#E8FF5A]/90 transition-colors"
        >
          Work with Audio Jones
        </a>
      </div>
    </div>
  );
}