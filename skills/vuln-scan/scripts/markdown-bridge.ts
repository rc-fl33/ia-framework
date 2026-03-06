#!/usr/bin/env bun
/**
 * Vulnerability Scan markdown bridge.
 * Writes section files, then delegates to assemble-report.ts.
 *
 * Usage:
 *   bun skills/vuln-scan/scripts/markdown-bridge.ts --output-dir <path>
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
    const r = read("session.json");
    return r ? JSON.parse(r) : {};
  })();

  const project = meta.target ?? meta.client ?? basename(outDir);
  const date = meta.date ?? new Date().toISOString().slice(0, 10);
  const today = new Date().toISOString().split("T")[0]!;
  const year = today.split("-")[0]!;

  // Read reporting files
  const reportingDir = join(outDir, "07-reporting");
  const readReport = (name: string) => {
    const p = join(reportingDir, name);
    return existsSync(p) ? readFileSync(p, "utf-8") : "";
  };

  const execSummary = readReport("executive-summary.md");
  const techFindings = readReport("technical-findings.md");
  const scope = readReport("scope.md");

  // Write _sections/_scope.qmd
  const scopeContent = scope || `# Scope and Methodology

## Scan Scope

| Target | Type | Description |
|--------|------|-------------|
| ${project} | [Type] | [Description] |

## Methodology

Automated vulnerability scanning using [Scanner Name].
`;
  writeFileSync(join(sectionsDir, "_scope.qmd"), scopeContent, "utf-8");
  console.log("  Wrote _sections/_scope.qmd");

  // Write _sections/_scan-methodology.qmd
  const scanMethodology = readReport("scan-methodology.md") || `# Scan Methodology

## Scanner Configuration

| Setting | Value |
|---------|-------|
| Scanner | [Scanner Name] |
| Version | [Version] |
| Scan Type | Full |

## Scan Coverage

- TCP Port Scan
- Service Version Detection
- Vulnerability Detection
`;
  writeFileSync(join(sectionsDir, "_scan-methodology.qmd"), scanMethodology, "utf-8");
  console.log("  Wrote _sections/_scan-methodology.qmd");

  // Write engagement.yaml if not exists
  const engYamlPath = join(outDir, "engagement.yaml");
  if (!existsSync(engYamlPath)) {
    const engYaml = `# Vulnerability Scan Engagement Metadata
project_name: "${project}"
project_version: "1.0.0"
client_name: "${meta.client || "Client Name"}"
engagement_id: "VULN-${year}-001"
assessment_type: "Vulnerability Scan"
classification: "Confidential"
start_date: "${today}"
end_date: "${today}"
report_date: "${date}"
report_version: "1.0"
reviewer_name: "${meta.scanner || "[Scanner Name]"}"
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
  const assembler = resolve("skills/vuln-scan/scripts/assemble-report.ts");
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
