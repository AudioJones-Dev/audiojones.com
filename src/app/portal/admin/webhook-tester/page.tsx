'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface TestResult {
  valid: boolean;
  error?: string;
  timestamp?: string;
  event_type?: string;
  payload_size?: number;
  signature_method?: string;
}

export default function WebhookTesterPage() {
  const { user } = useAuth();
  const [payload, setPayload] = useState('{\n  "event": "test.signature",\n  "data": {\n    "message": "Testing webhook signature"\n  }\n}');
  const [signature, setSignature] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const generateTimestamp = () => {
    setTimestamp(Math.floor(Date.now() / 1000).toString());
  };

  const validateSignature = async () => {
    setTesting(true);
    setResult(null);

    try {
      // Get auth token for admin API
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/admin/webhook/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          payload,
          signature,
          timestamp: timestamp || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Validation failed');
      }

      setResult(data);
    } catch (error) {
      setResult({
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setTesting(false);
    }
  };

  const copyExampleCurl = () => {
    const examplePayload = payload.replace(/\n/g, '').replace(/\s+/g, ' ');
    const curlCommand = `curl -X POST https://yourdomain.com/api/examples/event-consumer \\
  -H "Content-Type: application/json" \\
  -H "x-aj-signature: ${signature || 'YOUR_SIGNATURE_HERE'}" \\
  -H "x-aj-timestamp: ${timestamp || Math.floor(Date.now() / 1000)}" \\
  -H "x-aj-id: test-$(date +%s)" \\
  -d '${examplePayload}'`;
    
    navigator.clipboard.writeText(curlCommand);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Webhook Signature Tester</h1>
        <p className="text-text-muted">
          Test and validate AJ Event Bus webhook signatures for development and debugging.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Test Parameters</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  JSON Payload
                </label>
                <textarea
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  className="w-full h-32 bg-black border border-gray-600 rounded px-3 py-2 text-white font-mono text-sm"
                  placeholder="Enter JSON payload..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Signature (x-aj-signature)
                </label>
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white font-mono text-sm"
                  placeholder="sha256=abc123..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Timestamp (x-aj-timestamp) - Optional
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    className="flex-1 bg-black border border-gray-600 rounded px-3 py-2 text-white font-mono text-sm"
                    placeholder="Unix timestamp (auto-generated if empty)"
                  />
                  <button
                    onClick={generateTimestamp}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
                  >
                    Now
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={validateSignature}
                disabled={testing || !payload.trim() || !signature.trim()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-medium"
              >
                {testing ? 'Testing...' : 'Validate Signature'}
              </button>
              
              <button
                onClick={copyExampleCurl}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium"
              >
                Copy cURL
              </button>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Quick Examples</h3>
            <div className="space-y-2">
              <button
                onClick={() => setPayload('{\n  "event": "user.created",\n  "data": {\n    "user_id": "user_123",\n    "email": "test@example.com"\n  }\n}')}
                className="block w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 text-text-primary rounded text-sm"
              >
                User Created Event
              </button>
              <button
                onClick={() => setPayload('{\n  "event": "order.completed",\n  "data": {\n    "order_id": "ord_456",\n    "amount": 99.99\n  }\n}')}
                className="block w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 text-text-primary rounded text-sm"
              >
                Order Completed Event
              </button>
              <button
                onClick={() => setPayload('{\n  "event": "misc.test",\n  "data": {\n    "test": true,\n    "timestamp": "' + new Date().toISOString() + '"\n  }\n}')}
                className="block w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 text-text-primary rounded text-sm"
              >
                Misc Test Event
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div>
          {result && (
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Validation Result</h2>
              
              <div className={`p-4 rounded-lg mb-4 ${
                result.valid 
                  ? 'bg-green-900/30 border border-green-600' 
                  : 'bg-red-900/30 border border-red-600'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    result.valid ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className={`font-semibold ${
                    result.valid ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {result.valid ? 'Valid Signature' : 'Invalid Signature'}
                  </span>
                </div>
                
                {result.error && (
                  <p className="text-red-300 text-sm font-mono">
                    {result.error}
                  </p>
                )}
              </div>

              {result.valid && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {result.event_type && (
                      <div>
                        <span className="text-text-muted">Event Type:</span>
                        <div className="text-white font-mono">{result.event_type}</div>
                      </div>
                    )}
                    {result.payload_size && (
                      <div>
                        <span className="text-text-muted">Payload Size:</span>
                        <div className="text-white font-mono">{result.payload_size} bytes</div>
                      </div>
                    )}
                    {result.signature_method && (
                      <div>
                        <span className="text-text-muted">Signature Method:</span>
                        <div className="text-white font-mono">{result.signature_method}</div>
                      </div>
                    )}
                    {result.timestamp && (
                      <div>
                        <span className="text-text-muted">Verified At:</span>
                        <div className="text-white font-mono text-xs">{result.timestamp}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Documentation */}
          <div className="bg-gray-900 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">How to Generate Signatures</h3>
            <div className="text-sm text-text-primary space-y-3">
              <p>
                AJ Event Bus uses HMAC-SHA256 signatures with the format:
              </p>
              <code className="block bg-black p-3 rounded text-green-400 font-mono">
                x-aj-signature: sha256=&lt;hex_digest&gt;
              </code>
              
              <p className="pt-2">
                <strong className="text-white">Node.js Example:</strong>
              </p>
              <pre className="bg-black p-3 rounded text-green-400 font-mono text-xs overflow-x-auto">
{`const crypto = require('crypto');
const secret = process.env.AJ_WEBHOOK_SECRET;
const payload = JSON.stringify(data);
const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');
console.log('sha256=' + signature);`}
              </pre>

              <p className="pt-2">
                <strong className="text-white">Required Headers:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-text-muted">
                <li><code>x-aj-signature</code> - HMAC signature</li>
                <li><code>x-aj-timestamp</code> - Unix timestamp (optional)</li>
                <li><code>x-aj-id</code> - Unique event ID (optional)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}