#!/usr/bin/env bun
/**
 * Security Review markdown bridge.
 * Converts Phase 4 markdown output → QMD structure → HTML report.
 *
 * Usage:
 *   bun skills/sec-review/scripts/markdown-bridge.ts --output-dir <path>
 *   bun skills/sec-review/scripts/markdown-bridge.ts --finding <finding-dir>
 *
 * --output-dir: Full engagement report from findings/F*\/finding.md (or FINDINGS.md fallback)
 * --finding:    One-off branded HTML for a single finding directory
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "fs";
import { join, resolve, basename } from "path";
import { spawnSync } from "child_process";

interface Finding {
  title: string; severity: string; priority: string; domain: string; status: string;
  component: string; stride: string; likelihood: string; impact: string;
  cwe: string; owasp: string; nist_csf: string;
  what: string; why: string; recommendation: string; remediation: string;
}

const SEV_ORDER: Record<string, number> = { critical: 1, high: 2, medium: 3, low: 4 };
const SEV_TO_PRI: Record<string, string> = { critical: "P0", high: "P1", medium: "P2", low: "P3" };
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const fld = (c: string, k: string) => c.match(new RegExp(`\\*\\*${k}:\\*\\*\\s*(.+)`))?.[1]?.trim() ?? "";
const sec = (c: string, k: string) =>
  c.match(new RegExp(`\\*\\*${k}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*[A-Z]+[^*]*:\\*\\*|$)`))?.[1]?.trim() ?? "";

const MIME: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
  gif: "image/gif", svg: "image/svg+xml", webp: "image/webp", bmp: "image/bmp",
};

function embedImages(content: string, baseDir: string): string {
  return content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    if (/^https?:\/\/|^data:/.test(src)) return match;
    const abs = resolve(baseDir, src);
    if (!existsSync(abs)) return match;
    try {
      const ext = abs.split(".").pop()?.toLowerCase() ?? "";
      const b64 = readFileSync(abs).toString("base64");
      return `![${alt}](data:${MIME[ext] ?? "image/png"};base64,${b64})`;
    } catch { return match; }
  });
}

function parseFindings(content: string): Finding[] {
  return content.split(/\n(?=### Finding [A-Z0-9]+:)/)
    .filter(c => c.match(/^### Finding [A-Z0-9]+:/))
    .map(chunk => {
      const title = chunk.match(/^### Finding [A-Z0-9]+:\s*(.+)/)?.[1]?.trim() ?? "Untitled Finding";
      const sevRaw = fld(chunk, "Severity").toLowerCase();
      const severity = ["critical", "high", "medium", "low"].includes(sevRaw) ? sevRaw : "medium";
      const statusRaw = fld(chunk, "STATUS") || fld(chunk, "Status");
      const domain = fld(chunk, "Domain") || "A";
      const where = sec(chunk, "WHERE");
      const component = fld(chunk, "Component") || where.match(/File:\s*`([^`]+)`/)?.[1] || "[component]";
      const nistRaw = fld(chunk, "NIST CSF") || fld(chunk, "NIST");
      return {
        title, severity, priority: fld(chunk, "Priority") || SEV_TO_PRI[severity] || "P3",
        domain, status: statusRaw.toLowerCase() || "open",
        component, stride: fld(chunk, "STRIDE") || "T",
        likelihood: fld(chunk, "Likelihood").toLowerCase() || "medium",
        impact: fld(chunk, "Impact").toLowerCase() || "medium",
        cwe: fld(chunk, "CWE").match(/(CWE-\d+)/)?.[1] ?? fld(chunk, "CWE").split(" ")[0] ?? "",
        owasp: fld(chunk, "OWASP").match(/([A-Z]\d+:\d+)/)?.[1] ?? fld(chunk, "OWASP").split(" ")[0] ?? "",
        nist_csf: nistRaw.match(/([A-Z]{2}\.[A-Z]{2})/)?.[1] ?? nistRaw,
        what: sec(chunk, "Description"),
        why: sec(chunk, "Impact"),
        recommendation: sec(chunk, "RECOMMENDATION") || sec(chunk, "RECOMMENDATIONS"),
        remediation: sec(chunk, "REMEDIATION"),
      };
    })
    .sort((a, b) => (SEV_ORDER[a.severity] ?? 99) - (SEV_ORDER[b.severity] ?? 99));
}

function findingToQmd(f: Finding, id: string): string {
  const sev = f.severity;
  const remediated = f.status === "remediated" || f.status === "closed" || f.status === "resolved";
  const divClass = remediated ? "finding-remediated" : `finding-${sev}`;
  const badgeClass = remediated ? "badge-remediated" : `badge-${sev}`;
  const statusLabel = remediated ? "Remediated" : cap(f.status === "open" ? "Open" : f.status);
  const body = f.remediation || f.recommendation;
  return `<!-- ia:finding
id: ${id}
domain: ${f.domain}
severity: ${sev}
priority: ${f.priority}
status: ${f.status}
title: ${JSON.stringify(f.title)}
component: ${JSON.stringify(f.component)}
stride: "${f.stride}"
likelihood: ${f.likelihood}
impact: ${f.impact}
cwe: ${JSON.stringify(f.cwe)}
nist_csf: ${JSON.stringify(f.nist_csf)}
owasp: ${JSON.stringify(f.owasp)}
-->

::: {.${divClass}}
#### ${id}: ${f.title}

**Severity:** [${cap(sev)}]{.${badgeClass}} | **Priority:** ${f.priority} | **Domain:** ${f.domain}

**Affected Component:** \`${f.component}\`

**STRIDE Category:** ${f.stride} | **Likelihood:** ${cap(f.likelihood)} | **Impact:** ${cap(f.impact)}

**Status:** ${statusLabel}

---

**Description**

${f.what || "_No description provided._"}

**Impact**

${f.why || "_No impact description provided._"}

${body ? `**Remediation**\n\n${body}` : ""}

:::
`;
}

function findFindingDirs(outDir: string): string[] {
  const findingsDir = join(outDir, "findings");
  if (!existsSync(findingsDir)) return [];
  return readdirSync(findingsDir)
    .filter(d => /^F\d{3}-/.test(d) && statSync(join(findingsDir, d)).isDirectory())
    .sort()
    .map(d => join(findingsDir, d));
}

function loadFindingsFromDirs(dirs: string[]): Finding[] {
  const all: Finding[] = [];
  for (const dir of dirs) {
    const p = join(dir, "finding.md");
    if (!existsSync(p)) continue;
    const content = embedImages(readFileSync(p, "utf-8"), dir);
    all.push(...parseFindings(content));
  }
  return all.sort((a, b) => (SEV_ORDER[a.severity] ?? 99) - (SEV_ORDER[b.severity] ?? 99));
}

function buildEngagementYaml(meta: { project?: string; date?: string }, scope: string): string {
  const project = meta.project ?? "Unknown Project";
  const date = meta.date ?? new Date().toISOString().slice(0, 10);
  const lines = (pat: RegExp) => (scope.match(pat)?.[1] ?? "")
    .split("\n").filter(l => l.trim().startsWith("-"))
    .map(l => l.trim().replace(/^-\s*/, "").trim()).filter(Boolean);
  const rawIn = lines(/\*\*In scope:\*\*([\s\S]*?)(?=\*\*Out of scope:|$)/);
  const scopeIn = rawIn.length
    ? rawIn.map(c => `"${c} | System | Description | Production"`)
    : ['"System | Web Application | Core system | Production"'];
  const rawOut = lines(/\*\*Out of scope:\*\*([\s\S]*?)(?=###|$)/);
  const scopeOut = rawOut.length ? rawOut.map(c => `"${c}"`) : ['"Third-party services"'];
  return `# Generated by markdown-bridge.ts — ${new Date().toISOString()}
project_name: "${project}"
project_version: "${date}"
client_name: "[Client Company Name]"
client_contact: "[Client Contact Name]"
client_title: "[Client Title]"
client_email: "[client@email.com]"
engagement_id: "SR-${date.slice(0, 4)}-001"
assessment_type: "Security Architecture Review"
classification: "[Confidential | Restricted | Internal | Public]"
start_date: "${date}"
end_date: "${date}"
report_date: "${date}"
report_version: "1.0"
reviewer_name: "[Reviewer Name]"
reviewer_contact: "[reviewer@email.com]"
reviewer_org: "[Organization Name]"
domain_A: true
domain_B: false
domain_C: false
domain_E: false
scope_in:
${scopeIn.map(s => `  - ${s}`).join("\n")}
scope_out:
${scopeOut.map(s => `  - ${s}`).join("\n")}
frameworks:
  - "NIST CSF 2.0"
  - "CIS Controls v8"
  - "OWASP SAMM 2.0"
`;
}

function singleFindingMode(findingDir: string) {
  const findingPath = join(findingDir, "finding.md");
  if (!existsSync(findingPath)) {
    console.error(`Error: no finding.md in ${findingDir}`);
    process.exit(1);
  }
  const dirName = basename(findingDir);
  const numMatch = dirName.match(/^F(\d{3})/);
  const num = numMatch?.[1] ?? "001";
  const id = `SR-${num}`;

  const content = embedImages(readFileSync(findingPath, "utf-8"), findingDir);
  const findings = parseFindings(content);
  if (!findings.length) { console.error("Error: no finding parsed from finding.md"); process.exit(1); }
  const f = findings[0]!;
  console.log(`One-off finding: ${id} — ${f.title} [${f.severity}]`);

  const cwd = process.cwd();
  const cssPath = join(cwd, "private/brand/assets/styles.css");
  const themePath = join(cwd, "private/brand/assets/theme-light.scss");
  const hasCss = existsSync(cssPath);
  const hasTheme = existsSync(themePath);

  const frontmatter = `---
title: "${id}: ${f.title.replace(/"/g, '\\"')}"
format:
  html:
    self-contained: true
    toc: false
${hasCss ? `    css: "${cssPath}"\n` : ""}${hasTheme ? `    theme: "${themePath}"\n` : ""}---

`;
  const qmdContent = frontmatter + findingToQmd(f, id);
  const qmdPath = join(findingDir, "finding-report.qmd");
  writeFileSync(qmdPath, qmdContent, "utf-8");
  console.log(`  Wrote ${qmdPath}`);

  const result = spawnSync("quarto", ["render", qmdPath], { stdio: "inherit", cwd: findingDir });
  if (result.status !== 0) { console.error("Quarto render failed"); process.exit(result.status ?? 1); }

  const htmlPath = join(findingDir, "finding-report.html");
  console.log(`\nFinding report: ${htmlPath}`);
}

function main() {
  const args = process.argv.slice(2);

  // One-off finding mode
  const findingIdx = args.indexOf("--finding");
  if (findingIdx !== -1) {
    const findingDir = resolve(args[findingIdx + 1] ?? "");
    singleFindingMode(findingDir);
    return;
  }

  // Full engagement mode
  const outDirIdx = args.indexOf("--output-dir");
  if (outDirIdx === -1 || !args[outDirIdx + 1]) {
    console.error("Usage: markdown-bridge.ts --output-dir <path> | --finding <finding-dir>");
    process.exit(1);
  }
  const outDir = resolve(args[outDirIdx + 1]!);
  if (!outDir.startsWith(process.cwd())) {
    console.error(`Error: output-dir must be within ${process.cwd()}`);
    process.exit(1);
  }

  console.log(`Bridge: ${outDir}`);
  const read = (name: string) => { const p = join(outDir, name); return existsSync(p) ? readFileSync(p, "utf-8") : ""; };
  const meta = (() => { const r = read("metadata.json"); return r ? JSON.parse(r) : {}; })();

  // Prefer per-finding directories; fall back to consolidated FINDINGS.md
  const findingDirs = findFindingDirs(outDir);
  let findings: Finding[];
  if (findingDirs.length) {
    console.log(`  Reading ${findingDirs.length} finding dir(s)`);
    findings = loadFindingsFromDirs(findingDirs);
    // Refresh consolidated FINDINGS.md from individual files
    const consolidated = findingDirs
      .filter(d => existsSync(join(d, "finding.md")))
      .map(d => readFileSync(join(d, "finding.md"), "utf-8"))
      .join("\n\n");
    writeFileSync(join(outDir, "FINDINGS.md"), consolidated, "utf-8");
    console.log("  Refreshed FINDINGS.md from individual finding files");
  } else {
    const findingsRaw = read("FINDINGS.md");
    if (!findingsRaw) console.warn("Warning: no findings found — report will have no findings");
    const findingsContent = findingsRaw ? embedImages(findingsRaw, outDir) : "";
    findings = findingsContent ? parseFindings(findingsContent) : [];
  }
  console.log(`  Parsed ${findings.length} finding(s)`);

  const findingsDir = join(outDir, "_sections", "_findings");
  mkdirSync(findingsDir, { recursive: true });
  findings.forEach((f, i) => {
    const id = `SR-${String(i + 1).padStart(3, "0")}`;
    const filename = `_f${String(i + 1).padStart(3, "0")}-${f.severity}.qmd`;
    writeFileSync(join(findingsDir, filename), findingToQmd(f, id), "utf-8");
    console.log(`  Wrote ${filename} [${f.severity}] ${f.title.slice(0, 50)}`);
  });

  const engPath = join(outDir, "engagement.yaml");
  writeFileSync(engPath, buildEngagementYaml(meta, read("scope.md")), "utf-8");
  console.log(`  Wrote engagement.yaml`);

  const assembler = resolve("skills/sec-review/scripts/assemble-report.ts");
  console.log("Running assembler...");
  const result = spawnSync("bun", [assembler, "--engagement", engPath, "--render"], { stdio: "inherit", cwd: process.cwd() });
  if (result.status !== 0) { console.error(`Assembler exited with code ${result.status}`); process.exit(result.status ?? 1); }
  console.log(`\nHTML report: ${join(outDir, "sec-review-report.html")}`);
}

main();
