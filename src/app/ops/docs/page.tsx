import fs from "fs";
import path from "path";
import Link from "next/link";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "System Modules | Audio Jones Operations",
  description: "Internal documentation for Audio Jones automation and system modules",
  robots: {
    index: false,
    follow: false,
  }
};

export default async function DocsIndex() {
  const docsDir = path.join(process.cwd(), "repos", "ajdigital-automation-hub", "docs");
  
  // Check if docs directory exists
  if (!fs.existsSync(docsDir)) {
    return (
      <main className="mx-auto max-w-3xl py-10 space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">System Modules</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Documentation directory not found. Please ensure the automation hub submodule is properly initialized.</p>
        </div>
      </main>
    );
  }

  const files = fs.readdirSync(docsDir).filter(f => f.endsWith(".md"));

  return (
    <main className="mx-auto max-w-3xl py-10 space-y-6">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">System Modules</h1>
        <p className="text-sm text-gray-500 mt-2">
          Internal documentation sourced from ajdigital-automation-hub/docs
        </p>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
          <p className="text-orange-800 text-sm">
            🔒 <strong>Internal Use Only</strong> - These docs are for Audio Jones operations team
          </p>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No documentation files found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Modules</h2>
          <div className="grid gap-3">
            {files.map((file) => {
              const slug = file.replace(".md", "");
              const title = slug
                .replace(/-/g, " ")
                .replace(/\b\w/g, l => l.toUpperCase());
              
              return (
                <a
                  key={file}
                  href={`/ops/docs/${slug}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-[#FF4500] hover:bg-orange-50 transition-colors duration-200"
                >
                  <h3 className="text-[#FF4500] font-medium">{title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    View {slug} module documentation
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Total modules: {files.length}</span>
          <Link href="/" className="text-[#FF4500] hover:text-[#E03D00] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}