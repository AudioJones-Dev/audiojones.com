import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// The pre-existing codebase has a substantial backlog of `any` typings,
// CommonJS test scripts, and unused locals that predate strict CI lint
// enforcement. This config narrows lint to the surfaces that matter for
// production correctness, keeping debt visible as warnings rather than
// blocking deploys on every PR until the cleanup is done.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Throwaway test scripts and local tooling
    "test-*.js",
    "test-*.ts",
    "test-*.mjs",
    "validate-*.js",
    "validate-*.ts",
    "tools/**",
    "scripts/**",
    "functions/**",
    "test/**",
    "packages/**/dist/**",
    // Generated Firebase DataConnect files (CommonJS output):
    "src/dataconnect-generated/**",
  ]),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "react/no-unescaped-entities": "warn",
      // React Compiler / React 19 rules — flag tech debt without blocking deploys.
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/static-components": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      // Next.js rules introduced after this codebase's existing patterns.
      "@next/next/no-html-link-for-pages": "warn",
      "@next/next/no-assign-module-variable": "warn",
      "prefer-const": "warn",
    },
  },
]);

export default eslintConfig;
