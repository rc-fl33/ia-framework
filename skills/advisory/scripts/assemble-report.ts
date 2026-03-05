#!/usr/bin/env bun
/**
 * Advisory report assembler.
 * Delegates to centralized report generator.
 *
 * Usage:
 *   bun skills/advisory/scripts/assemble-report.ts --engagement <path/to/engagement.yaml> [--render]
 */

import { dirname } from "path";
import { existsSync, readdirSync, readFileSync } from "fs";
import { parse } from "yaml";
import { parseEngagementPath, loadEngagement } from "../../../tools/quarto/scripts/assembler-common.ts";
import { generateReport } from "../../../tools/quarto/scripts/report-generator.ts";

function main() {
  const { engPath, doRender } = parseEngagementPath();
  const engDir = dirname(engPath);

  console.log(`Assembling: ${engPath}`);

  // Load findings from _sections/_findings/
  const findingsDir = `${engDir}/_sections/_findings`;
  const findings = loadFindings(findingsDir);
  console.log(`  ${findings.length} finding(s) found`);

  // Determine report type based on engagement mode
  const eng = loadEngagement(engPath);
  const reportType = eng.mode === "code-review" ? "code-review" : "advisory";

  // Use centralized generator
  generateReport({
    engagementPath: engPath,
    findingsDir,
    outputDir: engDir,
    reportType,
    render: doRender,
  });
}

function loadFindings(dir: string) {
  if (!existsSync(dir)) return [];

  const files = readdirSync(dir)
    .filter(f => f.endsWith(".qmd") && f.startsWith("_f"))
    .sort();

  const findings: Array<Record<string, unknown>> = [];
  for (const f of files) {
    const content = readFileSync(`${dir}/${f}`, "utf-8");
    const match = content.match(/<!--\s*ia:finding\s*([\s\S]*?)-->/);
    if (match) {
      findings.push(parse(match[1]) as Record<string, unknown>);
    }
  }
  return findings;
}

main();
