#!/usr/bin/env bun
/**
 * Incident Response markdown bridge.
 * Writes section files, then delegates to assemble-report.ts.
 *
 * Usage:
 *   bun skills/incident/scripts/markdown-bridge.ts --output-dir <path>
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

  const project = meta.incident_id ?? meta.incident ?? basename(outDir);
  const date = meta.date ?? new Date().toISOString().slice(0, 10);
  const today = new Date().toISOString().split("T")[0]!;
  const year = today.split("-")[0]!;

  // Read incident report
  const incidentReport = read("INCIDENT-REPORT.md");

  // Write _sections/_scope.qmd
  const scopeContent = `# Scope and Methodology

## Incident Overview

| Field | Value |
|-------|-------|
| Incident ID | ${project} |
| Date | ${date} |
| Status | ${meta.status || "Open"} |

## Investigation Scope

${incidentReport ? "See incident report for details." : "[Investigation details]"}
`;
  writeFileSync(join(sectionsDir, "_scope.qmd"), scopeContent, "utf-8");
  console.log("  Wrote _sections/_scope.qmd");

  // Write _sections/_timeline.qmd
  const timeline = read("TIMELINE.md") || `# Incident Timeline

| Timestamp | Event | Source | Analyst |
|-----------|-------|--------|---------|
| ${date}T00:00:00Z | Incident detected | [Source] | [Analyst] |
`;
  writeFileSync(join(sectionsDir, "_timeline.qmd"), timeline, "utf-8");
  console.log("  Wrote _sections/_timeline.qmd");

  // Write _sections/_impact.qmd (optional)
  const impact = read("IMPACT.md");
  if (impact) {
    writeFileSync(join(sectionsDir, "_impact.qmd"), impact, "utf-8");
    console.log("  Wrote _sections/_impact.qmd");
  }

  // Write _sections/_root-cause.qmd (optional)
  const rootCause = read("ROOT-CAUSE.md");
  if (rootCause) {
    writeFileSync(join(sectionsDir, "_root-cause.qmd"), rootCause, "utf-8");
    console.log("  Wrote _sections/_root-cause.qmd");
  }

  // Write engagement.yaml if not exists
  const engYamlPath = join(outDir, "engagement.yaml");
  if (!existsSync(engYamlPath)) {
    const engYaml = `# Incident Response Engagement Metadata
project_name: "${project}"
project_version: "1.0.0"
client_name: "${meta.client || "Client Name"}"
engagement_id: "INC-${year}-001"
assessment_type: "Incident Response"
classification: "Confidential"
start_date: "${today}"
end_date: "${today}"
report_date: "${date}"
report_version: "1.0"
reviewer_name: "${meta.analyst || "[Analyst Name]"}"
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
  const assembler = resolve("skills/incident/scripts/assemble-report.ts");
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
