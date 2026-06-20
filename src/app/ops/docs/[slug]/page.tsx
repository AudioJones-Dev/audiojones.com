import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

export const dynamic = 'force-dynamic';

interface DocPageProps {
  params: { slug: string };
}

export default async function DocPage({ params }: DocPageProps) {
  const submoduleDocsDir = path.join(process.cwd(), "repos", "ajdigital-automation-hub", "docs");
  const fallbackDocsDir = path.join(process.cwd(), "src", "content", "ops-docs");

  // get available files from both locations
  let submoduleFiles: string[] = [];
  let fallbackFiles: string[] = [];
  
  if (fs.existsSync(submoduleDocsDir)) {
    submoduleFiles = fs.readdirSync(submoduleDocsDir).filter((f) => f.endsWith(".md"));
  }
  
  if (fs.existsSync(fallbackDocsDir)) {
    fallbackFiles = fs.readdirSync(fallbackDocsDir).filter((f) => f.endsWith(".md"));
  }

  const targetFile = `${params.slug}.md`;
  
  // Try submodule first, then fallback
  let filePath: string | null = null;
  let source = "";
  
  const submodulePath = path.join(submoduleDocsDir, targetFile);
  const fallbackPath = path.join(fallbackDocsDir, targetFile);
  
  if (fs.existsSync(submodulePath)) {
    filePath = submodulePath;
    source = "automation-hub";
  } else if (fs.existsSync(fallbackPath)) {
    filePath = fallbackPath;
    source = "local-content";
  }

  // if missing from both locations, show diagnostic info
  if (!filePath) {
    const allFiles = [
      ...submoduleFiles.map(f => ({ name: f, source: "automation-hub" })),
      ...fallbackFiles.map(f => ({ name: f, source: "local-content" }))
    ];
    
    return (
      <main className="mx-auto max-w-3xl py-10 space-y-6">
        <h1 className="text-2xl font-bold">Document not found on server.</h1>
        <p className="text-gray-600">
          The document <code>{targetFile}</code> was not found in either location.
        </p>
        <p className="text-gray-700">Here are the docs I do see:</p>
        
        {allFiles.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">No markdown files found. Check:</p>
            <ul className="list-disc pl-5 mt-2 text-yellow-700">
              <li>Submodule: repos/ajdigital-automation-hub/docs</li>
              <li>Fallback: src/content/ops-docs</li>
            </ul>
          </div>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {allFiles.map((file) => (
              <li key={`${file.source}-${file.name}`}>
                <a
                  href={`/ops/docs/${file.name.replace(".md", "")}`}
                  className="text-signal-yellow underline"
                >
                  {file.name}
                </a>
                <span className="text-gray-500 text-sm ml-2">
                  ({file.source})
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    );
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const processed = await remark().use(html).process(raw);
  const content = processed.toString();

  return (
    <main className="prose mx-auto max-w-3xl py-10">
      <div className="mb-4 text-sm text-gray-500">
        Source: {source === "automation-hub" ? "automation-hub submodule" : "local content"}
      </div>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </main>
  );
}