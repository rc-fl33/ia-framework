#!/usr/bin/env bun
/**
 * Advisory markdown bridge.
 * Converts Phase 4 markdown output → QMD structure → HTML report.
 *
 * Usage:
 *   bun skills/advisory/scripts/markdown-bridge.ts --output-dir <path>
 *   bun skills/advisory/scripts/markdown-bridge.ts --finding <finding-dir>
 *
 * --output-dir: Full engagement report from findings/F*\/finding.md (or FINDINGS.md fallback)
 * --finding:    One-off branded HTML for a single finding directory
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "fs";
import { join, resolve, basename } from "path";
import { spawnSync } from "child_process";

interface Finding {
  title: string; severity: string; priority: string; status: string;
  cwe: string; confidence: string; source: string;
  file_path: string; line: string;
  what: string; where: string; why: string; remediation: string;
}

const SEV_ORDER: Record<string, number> = { critical: 1, high: 2, medium: 3, low: 4 };
const SEV_TO_PRI: Record<string, string> = { critical: "P0", high: "P1", medium: "P2", low: "P3" };
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const fld = (c: string, k: string) => c.match(new RegExp(`\\*\\*${k}:\\*\\*\\s*(.+)`))?.[1]?.trim() ?? "";
const sec = (c: string, k: string) =>
  c.match(new RegExp(`\\*\\*${k}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*[A-Z]+:|\\n## |$)`))?.[1]?.trim() ?? "";

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
  return content.split(/\n(?=### Finding \d+:)/)
    .filter(c => c.match(/^### Finding \d+:/))
    .map(chunk => {
      const title = chunk.match(/^### Finding \d+:\s*(.+)/)?.[1]?.trim() ?? "Untitled Finding";
      const sevRaw = fld(chunk, "Severity").toLowerCase();
      const severity = ["critical", "high", "medium", "low"].includes(sevRaw) ? sevRaw : "medium";
      const statusRaw = fld(chunk, "STATUS") || fld(chunk, "Status");
      const where = sec(chunk, "Location") || sec(chunk, "WHERE");
      return {
        title, severity, priority: fld(chunk, "Priority") || SEV_TO_PRI[severity] || "P3",
        status: statusRaw.toLowerCase() || "open",
        cwe: fld(chunk, "CWE").match(/(CWE-\d+)/)?.[1] ?? fld(chunk, "CWE").split(" ")[0] ?? "",
        confidence: fld(chunk, "Confidence").toUpperCase() || "MEDIUM",
        source: fld(chunk, "Source").toUpperCase().replace(/-/g, "_") || "MANUAL",
        file_path: where.match(/File:\s*`([^`]+)`/)?.[1] ?? "",
        line: where.match(/Lines?:\s*(\d+)/)?.[1] ?? "",
        what: sec(chunk, "Description"),
        where: sec(chunk, "Location"),
        why: sec(chunk, "Impact"),
        remediation: sec(chunk, "REMEDIATION"),
      };
    })
    .sort((a, b) => (SEV_ORDER[a.severity] ?? 99) - (SEV_ORDER[b.severity] ?? 99));
}

function findingToQmd(f: Finding, id: string): string {
  const remediated = f.status === "remediated" || f.status === "closed" || f.status === "resolved";
  const divClass = remediated ? "finding-remediated" : `finding-${f.severity}`;
  const badgeClass = remediated ? "badge-remediated" : `badge-${f.severity}`;
  const statusLabel = remediated ? "Remediated" : cap(f.status === "open" ? "Open" : f.status);
  return `<!-- ia:finding
id: ${id}
severity: ${f.severity}
priority: ${f.priority}
status: ${f.status}
title: ${JSON.stringify(f.title)}
file: ${JSON.stringify(f.file_path)}
line: ${JSON.stringify(f.line)}
cwe: ${JSON.stringify(f.cwe)}
confidence: ${f.confidence}
source: ${f.source}
-->

::: {.${divClass}}
#### ${id}: ${f.title}

**Severity:** [${cap(f.severity)}]{.${badgeClass}} | **Priority:** ${f.priority} | **Confidence:** ${f.confidence}

**CWE:** ${f.cwe || "—"}

${f.file_path ? `**Location:** \`${f.file_path}${f.line ? `:${f.line}` : ""}\`` : ""}

**Status:** ${statusLabel}

---

**Description**

${f.what || f.where || "_No description provided._"}

**Impact**

${f.why || "_No impact description provided._"}

${f.remediation ? `**Remediation**\n\n${f.remediation}` : ""}

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

function buildEngagementYaml(meta: { project?: string; date?: string; mode?: string }, scope: string): string {
  const project = meta.project ?? "Unknown Project";
  const date = meta.date ?? new Date().toISOString().slice(0, 10);
  const mode = meta.mode ?? "advisory";
  const lines = (pat: RegExp) => (scope.match(pat)?.[1] ?? "")
    .split("\n").filter(l => l.trim().startsWith("-"))
    .map(l => l.trim().replace(/^-\s*/, "").replace(/`/g, "").trim()).filter(Boolean);
  const rawIn = lines(/\*\*In scope:\*\*([\s\S]*?)(?=\*\*Out of scope:|$)/);
  const scopeIn = rawIn.length
    ? rawIn.map(c => `"${c} | Scope Item | Description | Environment"`)
    : ['"Scope | System | Core functionality | Production"'];
  const rawOut = lines(/\*\*Out of scope:\*\*([\s\S]*?)(?=###|$)/);
  const scopeOut = rawOut.length ? rawOut.map(c => `"${c}"`) : ['"Third-party services"'];
  return `# Generated by markdown-bridge.ts — ${new Date().toISOString()}
project_name: "${project}"
project_version: "${date}"
client_name: "[Client Company Name]"
client_contact: "[Client Contact Name]"
client_email: "[client@email.com]"
engagement_id: "ADV-${date.slice(0, 4)}-001"
assessment_type: "Security Advisory"
classification: "[Confidential | Restricted | Internal | Public]"
start_date: "${date}"
end_date: "${date}"
report_date: "${date}"
report_version: "1.0"
reviewer_name: "[Reviewer Name]"
reviewer_contact: "[reviewer@email.com]"
reviewer_org: "[Organization Name]"
mode: "${mode}"
scope_in:
${scopeIn.map(s => `  - ${s}`).join("\n")}
scope_out:
${scopeOut.map(s => `  - ${s}`).join("\n")}
frameworks:
  - "NIST CSF 2.0"
  - "OWASP Top 10"
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
  const id = `ADV-${num}`;

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

  const frontmatter = `---\ntitle: "${id}: ${f.title.replace(/"/g, '\\"')}"\nformat:\n  html:\n    self-contained: true\n    toc: false\n${hasCss ? `    css: "${cssPath}"\n` : ""}${hasTheme ? `    theme: "${themePath}"\n` : ""}---\n\n`;
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

  // Find mode from output directory path
  const isCodeReview = outDir.includes("code-reviews");
  const mode = isCodeReview ? "code-review" : "ad-hoc";

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

  const sectDir = join(outDir, "_sections");
  const qmdFindingsDir = join(sectDir, "_findings");
  mkdirSync(qmdFindingsDir, { recursive: true });
  findings.forEach((f, i) => {
    const id = `ADV-${String(i + 1).padStart(3, "0")}`;
    const filename = `_f${String(i + 1).padStart(3, "0")}-${f.severity}.qmd`;
    writeFileSync(join(qmdFindingsDir, filename), findingToQmd(f, id), "utf-8");
    console.log(`  Wrote ${filename} [${f.severity}] ${f.title.slice(0, 50)}`);
  });

  const engPath = join(outDir, "engagement.yaml");
  writeFileSync(engPath, buildEngagementYaml(meta, read("scope.md") || read("request.md") || ""), "utf-8");
  console.log(`  Wrote engagement.yaml`);

  const assembler = resolve("skills/advisory/scripts/assemble-report.ts");
  console.log("Running assembler...");
  const result = spawnSync("bun", [assembler, "--engagement", engPath, "--render"], { stdio: "inherit", cwd: process.cwd() });
  if (result.status !== 0) { console.error(`Assembler exited with code ${result.status}`); process.exit(result.status ?? 1); }
  console.log(`\nHTML report: ${join(outDir, "advisory-report.html")}`);
}

main();
