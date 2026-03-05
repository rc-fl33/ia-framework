#!/usr/bin/env bun
/**
 * Test Plan markdown bridge.
 * Writes section files, then delegates to assemble-report.ts.
 *
 * Usage:
 *   bun skills/test-plan/scripts/markdown-bridge.ts --output-dir <path>
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { join, resolve, dirname } from "path";
import { spawnSync } from "child_process";

function parseArgs(): { outDir: string; doRender: boolean } {
  const args = process.argv.slice(2);
  const idx = args.indexOf("--output-dir");
  if (idx === -1 || !args[idx + 1]) {
    console.error("Usage: markdown-bridge.ts --output-dir <path>");
    process.exit(1);
  }
  const outDir = resolve(args[idx + 1]!);
  if (!outDir.startsWith(process.cwd())) {
    console.error(`Error: output-dir must be within ${process.cwd()}`);
    process.exit(1);
  }
  const renderIdx = args.indexOf("--render");
  return { outDir, doRender: renderIdx !== -1 };
}

function detectBrand(engDir: string): { css?: string; theme?: string } {
  const cssPath = join(process.cwd(), "private/brand/assets/styles.css");
  const themePath = join(process.cwd(), "private/brand/assets/theme-light.scss");
  return {
    css: existsSync(cssPath) ? cssPath : undefined,
    theme: existsSync(themePath) ? themePath : undefined,
  };
}

function main() {
  const { outDir, doRender } = parseArgs();

  console.log(`Bridge: ${outDir}`);

  // Ensure _sections directory exists
  const sectionsDir = join(outDir, "_sections");
  mkdirSync(sectionsDir, { recursive: true });

  const read = (name: string) => {
    const p = join(outDir, name);
    return existsSync(p) ? readFileSync(p, "utf-8") : "";
  };

  const meta = (() => {
    const r = read("metadata.json");
    return r ? JSON.parse(r) : {};
  })();

  // Read content sections
  const scope = read("scope.md");
  const methodology = read("methodology-selection.md");
  const testPlan = read("TEST-PLAN.md");

  // Test Cases from directory
  const testCasesDir = join(outDir, "test-cases");
  let testCasesContent = "";
  if (existsSync(testCasesDir)) {
    const testCaseFiles = readdirSync(testCasesDir)
      .filter(f => f.endsWith(".md"))
      .sort();

    if (testCaseFiles.length > 0) {
      testCasesContent = testCaseFiles.map(filename => {
        const content = readFileSync(join(testCasesDir, filename), "utf-8");
        return `## ${filename.replace(".md", "")}\n\n${content}`;
      }).join("\n\n---\n\n");
    }
  }

  // Write _sections/_scope.qmd (includes methodology)
  let scopeContent = scope ? `# Scope\n\n${scope}\n` : "# Scope\n\n_No scope defined._\n";
  if (methodology) {
    scopeContent += `\n# Methodology\n\n${methodology}\n`;
  }
  if (testPlan) {
    scopeContent += `\n# Test Plan\n\n${testPlan}\n`;
  }
  writeFileSync(join(sectionsDir, "_scope.qmd"), scopeContent, "utf-8");
  console.log("  Wrote _sections/_scope.qmd");

  // Write _sections/_test-cases.qmd
  const testCasesQmd = testCasesContent
    ? `# Test Cases\n\n${testCasesContent}\n`
    : "# Test Cases\n\n_No test cases defined._\n";
  writeFileSync(join(sectionsDir, "_test-cases.qmd"), testCasesQmd, "utf-8");
  console.log("  Wrote _sections/_test-cases.qmd");

  // Write _sections/_test-matrix.qmd (placeholder - could be generated from test cases)
  const testMatrixQmd = `# Test Coverage Matrix

| Requirement | Test Case | Status | Result |
|-------------|-----------|--------|--------|
| _REQ_001_ | _TC001_ | _Pending_ | _—_ |
`;
  writeFileSync(join(sectionsDir, "_test-matrix.qmd"), testMatrixQmd, "utf-8");
  console.log("  Wrote _sections/_test-matrix.qmd");

  // Write _sections/_appendices.qmd
  const appendicesQmd = `# Appendices

## Appendix A: Test Environment

| Component | Value |
|-----------|-------|
| Test Date | ${new Date().toISOString().split("T")[0]} |
| Tester | ${meta.tester || "[Tester Name]"} |

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| TC | Test Case |
| TR | Test Result |
| PASS | Test passed successfully |
| FAIL | Test failed |
`;
  writeFileSync(join(sectionsDir, "_appendices.qmd"), appendicesQmd, "utf-8");
  console.log("  Wrote _sections/_appendices.qmd");

  // Write engagement.yaml if not exists
  const engYamlPath = join(outDir, "engagement.yaml");
  if (!existsSync(engYamlPath)) {
    const engYaml = `# Test Plan Engagement Metadata
project_name: "${meta.project || "Test Project"}"
project_version: "1.0.0"
client_name: "${meta.client || "Client Name"}"
engagement_id: "TEST-$(date +%Y)-001"
assessment_type: "Test Plan"
classification: "Internal"
start_date: "$(date +%Y-%m-%d)"
end_date: "$(date +%Y-%m-%d)"
report_date: "$(date +%Y-%m-%d)"
report_version: "1.0"
reviewer_name: "${meta.tester || "[Tester Name]"}"
reviewer_org: "Intelligence Adjacent"
scope_in:
  - "[Target] | [Type] | [Description]"
scope_out:
  - "[Out of scope item]"
`;
    writeFileSync(engYamlPath, engYaml, "utf-8");
    console.log("  Wrote engagement.yaml");
  }

  // Call assemble-report
  const assembler = resolve("skills/test-plan/scripts/assemble-report.ts");
  console.log("Running assembler...");
  const result = spawnSync("bun", [
    assembler,
    "--engagement", engYamlPath,
    ...(doRender ? ["--render"] : [])
  ], { stdio: "inherit", cwd: process.cwd() });

  if (result.status !== 0) {
    console.error(`Assembler failed with code ${result.status}`);
    process.exit(result.status ?? 1);
  }
}

main();
