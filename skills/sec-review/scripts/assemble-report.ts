#!/usr/bin/env bun
/**
 * Security Review report assembler.
 * Delegates to centralized report generator.
 *
 * Usage:
 *   bun skills/sec-review/scripts/assemble-report.ts --engagement <path/to/engagement.yaml> [--render]
 */

import { dirname, join } from "path";
import { existsSync, readdirSync, readFileSync } from "fs";
import { parse } from "yaml";
import { parseEngagementPath, loadEngagement } from "../../../tools/quarto/scripts/assembler-common.ts";
import { generateReport, type Finding } from "../../../tools/quarto/scripts/report-generator.ts";

function main() {
  const { engPath, doRender } = parseEngagementPath();
  const engDir = dirname(engPath);

  console.log(`Assembling: ${engPath}`);

  // Load findings from _sections/_findings/
  const findingsDir = `${engDir}/_sections/_findings`;
  const findings = loadFindings(findingsDir);
  console.log(`  ${findings.length} finding(s) found`);

  // Use centralized generator
  generateReport({
    engagementPath: engPath,
    findingsDir,
    outputDir: engDir,
    reportType: "sec-review",
    render: doRender,
  });
}

function loadFindings(dir: string): Finding[] {
  if (!existsSync(dir)) return [];

  const files = readdirSync(dir)
    .filter(f => f.endsWith(".qmd") && f.startsWith("_f"))
    .sort();

  const findings: Finding[] = [];
  for (const f of files) {
    const content = readFileSync(`${dir}/${f}`, "utf-8");
    const match = content.match(/<!--\s*ia:finding\s*([\s\S]*?)-->/);
    if (match) {
      const data = parse(match[1]) as Record<string, unknown>;
      findings.push({
        id: String(data.id || ""),
        severity: String(data.severity || "medium"),
        priority: String(data.priority || "P3"),
        title: String(data.title || "Untitled"),
        status: String(data.status || "open"),
        cwe: String(data.cwe || ""),
        owasp: String(data.owasp || ""),
        domain: String(data.domain || ""),
        stride: String(data.stride || ""),
        likelihood: String(data.likelihood || ""),
        impact: String(data.impact || ""),
        nist_csf: String(data.nist_csf || ""),
        ...data,
      } as Finding);
    }
  }
  return findings;
}

main();
