#!/usr/bin/env bun
/**
 * Risk Assessment markdown bridge.
 * Writes section files, then delegates to assemble-report.ts.
 *
 * Usage:
 *   bun skills/risk-assess/scripts/markdown-bridge.ts --output-dir <path>
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, resolve, basename } from "path";
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

  const project = meta.project_name ?? meta.org ?? basename(outDir);
  const date = meta.date ?? meta.start_date ?? new Date().toISOString().slice(0, 10);
  const today = new Date().toISOString().split("T")[0]!;
  const year = today.split("-")[0]!;

  // Read report files
  const fullReport = read("FULL-REPORT.md");
  const execSummary = read("EXECUTIVE-SUMMARY.md");

  // Write _sections/_scope.qmd
  const scopeContent = `# Scope and Methodology

## Assessment Scope

| Component | Type | Description |
|-----------|------|-------------|
| [Asset] | [Type] | [Description] |

## Methodology

Risk assessment conducted using [Methodology Name].
`;
  writeFileSync(join(sectionsDir, "_scope.qmd"), scopeContent, "utf-8");
  console.log("  Wrote _sections/_scope.qmd");

  // Write _sections/_asset-inventory.qmd
  const assetInventory = read("ASSET-INVENTORY.md") || `# Asset Inventory

| Asset | Type | Criticality | Owner | Location |
|-------|------|-------------|-------|----------|
| [Asset] | [Type] | [High/Medium/Low] | [Owner] | [Location] |
`;
  writeFileSync(join(sectionsDir, "_asset-inventory.qmd"), assetInventory, "utf-8");
  console.log("  Wrote _sections/_asset-inventory.qmd");

  // Write _sections/_threat-landscape.qmd
  const threatLandscape = read("THREAT-LANDSCAPE.md") || `# Threat Landscape

## Relevant Threats

- [Threat description]

## Threat Actors

- [Actor description]
`;
  writeFileSync(join(sectionsDir, "_threat-landscape.qmd"), threatLandscape, "utf-8");
  console.log("  Wrote _sections/_threat-landscape.qmd");

  // Write _sections/_risk-register.qmd (optional)
  const riskRegister = read("RISK-REGISTER.md");
  if (riskRegister) {
    writeFileSync(join(sectionsDir, "_risk-register.qmd"), riskRegister, "utf-8");
    console.log("  Wrote _sections/_risk-register.qmd");
  }

  // Write engagement.yaml if not exists
  const engYamlPath = join(outDir, "engagement.yaml");
  if (!existsSync(engYamlPath)) {
    const engYaml = `# Risk Assessment Engagement Metadata
project_name: "${project}"
project_version: "1.0.0"
client_name: "${meta.client || meta.org || "Client Name"}"
engagement_id: "RISK-${year}-001"
assessment_type: "Risk Assessment"
classification: "Confidential"
start_date: "${today}"
end_date: "${today}"
report_date: "${date}"
report_version: "1.0"
reviewer_name: "${meta.reviewer || "[Reviewer Name]"}"
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
  const assembler = resolve("skills/risk-assess/scripts/assemble-report.ts");
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
