#!/usr/bin/env bun
/**
 * Test Plan markdown bridge.
 * Writes section files, then delegates to assemble-report.ts.
 *
 * Usage:
 *   bun skills/test-plan/scripts/markdown-bridge.ts --output-dir <path>
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { join, resolve } from "path";
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

interface TcMeta {
  id: string;
  category: string;
  owasp: string;
  atlas: string;
  priority: string;
  timeEstimate: string;
  body: string;
}

function parseTcFile(filename: string, content: string): TcMeta {
  const idMatch = filename.match(/^(TC\d+)/);
  const id = idMatch?.[1] ?? filename.replace(".md", "");

  const lines = content.split("\n");
  const category = lines.find(l => l.startsWith("## "))?.replace(/^## /, "").trim() ?? "";
  const owasp = content.match(/\*\*OWASP Category:\*\*\s*(.+)/)?.[1]?.trim() ?? "";
  const atlas = content.match(/\*\*ATLAS Techniques:\*\*\s*(.+)/)?.[1]?.trim() ?? "";
  const priority = content.match(/\*\*Priority:\*\*\s*(.+)/)?.[1]?.trim() ?? "";
  const timeEstimate = content.match(/\*\*Time Estimate:\*\*\s*(.+)/)?.[1]?.trim() ?? "";

  // Normalize body: strip H1 (# Test Case: ...) and H2 category heading
  const bodyLines: string[] = [];
  for (const line of lines) {
    if (/^# /.test(line)) continue;
    if (/^## /.test(line)) continue;
    bodyLines.push(line);
  }
  while (bodyLines.length && !bodyLines[0]!.trim()) bodyLines.shift();

  return { id, category, owasp, atlas, priority, timeEstimate, body: bodyLines.join("\n") };
}

function buildTcSection(tc: TcMeta): string {
  const metaTable = [
    `| Field | Value |`,
    `|-------|-------|`,
    `| OWASP | ${tc.owasp || "—"} |`,
    `| ATLAS | ${tc.atlas || "—"} |`,
    `| Priority | ${tc.priority || "—"} |`,
    `| Time | ${tc.timeEstimate || "—"} |`,
  ].join("\n");
  return `## ${tc.id} — ${tc.category}\n\n${metaTable}\n\n${tc.body}`;
}

function main() {
  const { outDir, doRender } = parseArgs();

  console.log(`Bridge: ${outDir}`);

  const today = new Date().toISOString().split("T")[0]!;
  const year = today.split("-")[0]!;

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

  const scope = read("scope.md");
  const methodology = read("methodology-selection.md");

  // Parse test cases from directory
  const testCasesDir = join(outDir, "test-cases");
  const tcMetas: TcMeta[] = [];
  if (existsSync(testCasesDir)) {
    const files = readdirSync(testCasesDir).filter(f => f.endsWith(".md")).sort();
    for (const filename of files) {
      const content = readFileSync(join(testCasesDir, filename), "utf-8");
      tcMetas.push(parseTcFile(filename, content));
    }
  }

  // Write _sections/_scope.qmd — scope + methodology only (no TEST-PLAN.md)
  let scopeContent = scope ? `# Scope\n\n${scope}\n` : "# Scope\n\n_No scope defined._\n";
  if (methodology) scopeContent += `\n# Methodology\n\n${methodology}\n`;
  writeFileSync(join(sectionsDir, "_scope.qmd"), scopeContent, "utf-8");
  console.log("  Wrote _sections/_scope.qmd");

  // Write _sections/_test-cases.qmd with summary table + normalized TC sections
  let testCasesQmd: string;
  if (tcMetas.length > 0) {
    const summaryRows = tcMetas.map(tc =>
      `| ${tc.id} | ${tc.category} | ${tc.owasp.split(" ")[0] ?? "—"} | ${tc.atlas.split(",")[0]?.trim() ?? "—"} | ${tc.priority} | ${tc.timeEstimate} |`
    ).join("\n");
    const summaryTable = [
      `| ID | Test Case | OWASP | ATLAS | Priority | Time/Model |`,
      `|----|-----------|-------|-------|----------|------------|`,
      summaryRows,
    ].join("\n");
    const sections = tcMetas.map(buildTcSection).join("\n\n---\n\n");
    testCasesQmd = `# Test Cases\n\n${summaryTable}\n\n${sections}\n`;
  } else {
    testCasesQmd = "# Test Cases\n\n_No test cases defined._\n";
  }
  writeFileSync(join(sectionsDir, "_test-cases.qmd"), testCasesQmd, "utf-8");
  console.log("  Wrote _sections/_test-cases.qmd");

  // Write _sections/_test-matrix.qmd from parsed TC metadata
  let testMatrixQmd: string;
  if (tcMetas.length > 0) {
    const matrixRows = tcMetas.map(tc =>
      `| ${tc.id} | ${tc.category} | ${tc.owasp.split(" ")[0] ?? "—"} | ${tc.atlas.split(",")[0]?.trim() ?? "—"} | ${tc.priority} | ${tc.timeEstimate || "—"} | ${tc.timeEstimate || "—"} |`
    ).join("\n");
    testMatrixQmd = `# Test Coverage Matrix\n\n| TC ID | Test Case | OWASP | ATLAS | Priority | Time/Model | Total Time |\n|-------|-----------|-------|-------|----------|------------|------------|\n${matrixRows}\n`;
  } else {
    testMatrixQmd = `# Test Coverage Matrix\n\n| TC ID | Test Case | OWASP | ATLAS | Priority | Time/Model | Total Time |\n|-------|-----------|-------|-------|----------|------------|------------|\n| — | — | — | — | — | — | — |\n`;
  }
  writeFileSync(join(sectionsDir, "_test-matrix.qmd"), testMatrixQmd, "utf-8");
  console.log("  Wrote _sections/_test-matrix.qmd");

  // Write _sections/_appendices.qmd
  const appendicesQmd = `# Appendices

## Appendix A: Test Environment

| Component | Value |
|-----------|-------|
| Test Date | ${today} |
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

  // Write engagement.yaml if not exists — real JS dates, no shell syntax
  const engYamlPath = join(outDir, "engagement.yaml");
  if (!existsSync(engYamlPath)) {
    const engYaml = `# Test Plan Engagement Metadata
project_name: "${meta.project || "Test Project"}"
project_version: "1.0.0"
client_name: "${meta.client || "Client Name"}"
engagement_id: "TEST-${year}-001"
assessment_type: "Test Plan"
classification: "Internal"
start_date: "${today}"
end_date: "${today}"
report_date: "${today}"
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
