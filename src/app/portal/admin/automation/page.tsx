import mappings from "@/config/automation-mappings.json";
import fs from 'fs';
import path from 'path';
import { getMailerLiteToken } from "@/lib/integrations/mailerlite";

interface IntegrationStatus {
  whopConfigured: boolean;
  mailerliteConfigured: boolean;
  mappingCount: number;
}

async function getIntegrationStatus(): Promise<IntegrationStatus> {
  // Check environment variables
  const whopConfigured = !!process.env.WHOP_API_KEY;
  const mailerliteConfigured = Boolean(getMailerLiteToken());
  
  // Read and parse mappings
  const mappingsPath = path.join(process.cwd(), 'src/config/automation-mappings.json');
  const mappingsData = fs.readFileSync(mappingsPath, 'utf-8');
  const mappingsArray = JSON.parse(mappingsData);
  
  return {
    whopConfigured,
    mailerliteConfigured,
    mappingCount: mappingsArray.length
  };
}

export default async function AutomationPage() {
  const status = await getIntegrationStatus();
  return (
    <main className="max-w-5xl mx-auto py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Automation Integrations</h1>
        <p className="text-gray-600 mt-2">
          Expected environment variables: WHOP_API_KEY, MAILERLITE_TOKEN, MAILERLITE_WEBHOOK_SECRET
        </p>
      </div>

      {/* Integration Status Section */}
      <section className="rounded-lg border p-4 bg-slate-950/20 space-y-2">
        <h2 className="text-lg font-semibold">Automation Integrations</h2>
        <p>Whop: {status.whopConfigured ? "✅ configured" : "❌ missing WHOP_API_KEY"}</p>
        <p>MailerLite: {status.mailerliteConfigured ? "✅ configured" : "❌ missing MAILERLITE_TOKEN"}</p>
        <p>Product → Tag mappings: {status.mappingCount}</p>
        <p className="text-xs text-slate-400">
          To test: POST /api/integrations/mailerlite with {`{ email }`}.
        </p>
      </section>

      {/* Webhook Logs Section */}
      <section className="rounded-lg border p-4 bg-white space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Automation Events</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">
            Automation endpoint deployed at <code className="bg-gray-200 px-1 rounded">/api/webhooks/whop</code>
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Check Vercel logs for live webhook runs and MailerLite API calls.
          </p>
          <div className="mt-3 space-y-1 text-xs text-gray-500">
            <p>• Whop → MailerLite automation chain ready</p>
            <p>• Product mappings loaded: {status.mappingCount} entries</p>
            <p>• Webhook signature verification enabled</p>
          </div>
        </div>
      </section>

      {/* Current Mappings Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Mappings</h2>
        <div className="space-y-4">
          {mappings.map((mapping, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Whop Product ID</span>
                  <div className="mt-1 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {mapping.whopProductId}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">MailerLite Tag</span>
                  <div className="mt-1 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {mapping.mailerliteTag}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">EPM Stage</span>
                  <div className="mt-1 font-semibold text-sm text-orange-600 capitalize">
                    {mapping.epmStage}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Endpoints Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Endpoints</h2>
        <p className="text-gray-600 mb-4">
          These are POST-only endpoints for testing webhook integration:
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <span className="font-mono text-sm">/api/webhooks/whop</span>
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">WEBHOOK</span>
            </div>
            <span className="text-gray-700 text-sm font-medium">Whop → MailerLite automation</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-mono text-sm">/api/integrations/whop</span>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">POST</span>
            </div>
            <span className="text-gray-500 text-sm">Whop test endpoint</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-mono text-sm">/api/integrations/mailerlite</span>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">POST</span>
            </div>
            <span className="text-gray-500 text-sm">MailerLite test endpoint</span>
          </div>
        </div>
      </div>
    </main>
  );
}