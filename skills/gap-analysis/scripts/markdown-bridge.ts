#!/usr/bin/env bun
/**
 * Gap Analysis markdown bridge.
 * Writes section files, then delegates to assemble-report.ts.
 *
 * Usage:
 *   bun skills/gap-analysis/scripts/markdown-bridge.ts --output-dir <path>
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { join, resolve, dirname, basename } from "path";
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

  const project = meta.project_name ?? meta.client ?? basename(outDir);
  const date = meta.date ?? new Date().toISOString().slice(0, 10);

  // Read deliverables
  const deliverablesDir = join(outDir, "deliverables");
  const readDeliverable = (name: string) => {
    const p = join(deliverablesDir, name);
    return existsSync(p) ? readFileSync(p, "utf-8") : "";
  };

  // Write _sections/_scope.qmd
  const scopeContent = readDeliverable("scope.md") || `# Scope

## Assessment Scope

| Component | Type | Description |
|-----------|------|-------------|
| [Component] | [Type] | [Description] |

## Out of Scope

- Item 1
- Item 2
`;
  writeFileSync(join(sectionsDir, "_scope.qmd"), scopeContent, "utf-8");
  console.log("  Wrote _sections/_scope.qmd");

  // Write _sections/_compliance-matrix.qmd
  const complianceMatrix = readDeliverable("compliance-matrix.md") || `# Compliance Matrix

| Control ID | Control Description | Status | Gap | Remediation |
|------------|---------------------|--------|-----|-------------|
| [Control] | [Description] | [Compliant/Gap] | [Gap] | [Remediation] |
`;
  writeFileSync(join(sectionsDir, "_compliance-matrix.qmd"), complianceMatrix, "utf-8");
  console.log("  Wrote _sections/_compliance-matrix.qmd");

  // Write _sections/_gap-findings.qmd
  const gapFindings = readDeliverable("gap-analysis.md") || `# Gap Findings

## Framework: [Framework Name]

### Critical Gaps

- No critical gaps identified.

### Moderate Gaps

- No moderate gaps identified.
`;
  writeFileSync(join(sectionsDir, "_gap-findings.qmd"), gapFindings, "utf-8");
  console.log("  Wrote _sections/_gap-findings.qmd");

  // Write _sections/_remediation-roadmap.qmd (optional)
  const roadmap = readDeliverable("remediation-roadmap.md");
  if (roadmap) {
    writeFileSync(join(sectionsDir, "_remediation-roadmap.qmd"), roadmap, "utf-8");
    console.log("  Wrote _sections/_remediation-roadmap.qmd");
  }

  // Write _sections/_appendices.qmd
  const appendices = readDeliverable("qa-report.md") || `# Appendices

## Appendix A: Methodology

This gap analysis was conducted using a framework-native approach.

## Appendix B: Evidence

Evidence files are available upon request.
`;
  writeFileSync(join(sectionsDir, "_appendices.qmd"), appendices, "utf-8");
  console.log("  Wrote _sections/_appendices.qmd");

  // Write engagement.yaml if not exists
  const engYamlPath = join(outDir, "engagement.yaml");
  if (!existsSync(engYamlPath)) {
    const engYaml = `# Gap Analysis Engagement Metadata
project_name: "${project}"
project_version: "1.0.0"
client_name: "${meta.client || "Client Name"}"
engagement_id: "GAP-$(date +%Y)-001"
assessment_type: "Gap Analysis"
classification: "Confidential"
start_date: "$(date +%Y-%m-%d)"
end_date: "$(date +%Y-%m-%d)"
report_date: "${date}"
report_version: "1.0"
reviewer_name: "${meta.reviewer || "[Reviewer Name]"}"
reviewer_org: "Intelligence Adjacent"
scope_in:
  - "[Target] | [Type] | [Description]"
scope_out:
  - "[Out of scope item]"
compliance:
  - "[Framework 1]"
  - "[Framework 2]"
`;
    writeFileSync(engYamlPath, engYaml, "utf-8");
    console.log("  Wrote engagement.yaml");
  }

  // Call assemble-report
  const assembler = resolve("skills/gap-analysis/scripts/assemble-report.ts");
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
