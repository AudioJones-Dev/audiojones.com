'use client';

import { useEffect, useState } from 'react';

interface DomainInfo {
  host: string;
  userAgent: string;
  origin: string;
  referer: string;
  protocol: string;
  pathname: string;
  search: string;
}

export default function DomainsPage() {
  const [domainInfo, setDomainInfo] = useState<DomainInfo | null>(null);
  const [serverInfo, setServerInfo] = useState<any>(null);

  useEffect(() => {
    // Client-side info
    const clientInfo: DomainInfo = {
      host: window.location.host,
      userAgent: navigator.userAgent,
      origin: window.location.origin,
      referer: document.referrer,
      protocol: window.location.protocol,
      pathname: window.location.pathname,
      search: window.location.search,
    };
    setDomainInfo(clientInfo);

    // Fetch server-side info
    fetch('/api/ops/domain-info')
      .then(res => res.json())
      .then(setServerInfo)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#E8FF5A]">Domain Diagnostics</h1>
        
        <div className="grid gap-8">
          {/* Client Info */}
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#F0FF85]">Client-Side Info</h2>
            {domainInfo && (
              <dl className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <dt className="font-medium text-gray-300">Host:</dt>
                  <dd className="md:col-span-2 font-mono text-sm bg-black/50 px-2 py-1 rounded">{domainInfo.host}</dd>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <dt className="font-medium text-gray-300">Origin:</dt>
                  <dd className="md:col-span-2 font-mono text-sm bg-black/50 px-2 py-1 rounded">{domainInfo.origin}</dd>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <dt className="font-medium text-gray-300">Protocol:</dt>
                  <dd className="md:col-span-2 font-mono text-sm bg-black/50 px-2 py-1 rounded">{domainInfo.protocol}</dd>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <dt className="font-medium text-gray-300">Pathname:</dt>
                  <dd className="md:col-span-2 font-mono text-sm bg-black/50 px-2 py-1 rounded">{domainInfo.pathname}</dd>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <dt className="font-medium text-gray-300">Search:</dt>
                  <dd className="md:col-span-2 font-mono text-sm bg-black/50 px-2 py-1 rounded">{domainInfo.search || '(none)'}</dd>
                </div>
              </dl>
            )}
          </div>

          {/* Server Info */}
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#F0FF85]">Server-Side Info</h2>
            {serverInfo ? (
              <dl className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <dt className="font-medium text-gray-300">Host Header:</dt>
                  <dd className="md:col-span-2 font-mono text-sm bg-black/50 px-2 py-1 rounded">{serverInfo.host || 'undefined'}</dd>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <dt className="font-medium text-gray-300">X-Forwarded-Host:</dt>
                  <dd className="md:col-span-2 font-mono text-sm bg-black/50 px-2 py-1 rounded">{serverInfo.xForwardedHost || 'undefined'}</dd>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <dt className="font-medium text-gray-300">X-Forwarded-Proto:</dt>
                  <dd className="md:col-span-2 font-mono text-sm bg-black/50 px-2 py-1 rounded">{serverInfo.xForwardedProto || 'undefined'}</dd>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <dt className="font-medium text-gray-300">User-Agent:</dt>
                  <dd className="md:col-span-2 font-mono text-sm bg-black/50 px-2 py-1 rounded break-all">{serverInfo.userAgent || 'undefined'}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-gray-400">Loading server info...</p>
            )}
          </div>

          {/* Tests */}
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#F0FF85]">Subdomain Tests</h2>
            <div className="space-y-4">
              <div className="p-4 bg-black/50 rounded">
                <h3 className="font-semibold text-green-400 mb-2">✅ Expected Behavior:</h3>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• <code>audiojones.com</code> → Homepage</li>
                  <li>• <code>admin.audiojones.com</code> → <code>/portal/admin</code> (via middleware rewrite)</li>
                  <li>• <code>audiojones.com/portal/admin</code> → Admin portal directly</li>
                </ul>
              </div>
              <div className="p-4 bg-black/50 rounded">
                <h3 className="font-semibold text-blue-400 mb-2">🔍 Current Detection:</h3>
                <p className="text-sm text-gray-300">
                  {domainInfo?.host.startsWith('admin.') ? 
                    '✅ Admin subdomain detected - should show admin portal' : 
                    '❌ Regular domain - should show public site'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}