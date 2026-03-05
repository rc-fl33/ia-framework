#!/usr/bin/env bun
/**
 * Report Template Generator - Centralized Version
 *
 * Generates report templates from the centralized templates.yaml config.
 * This is the single source of truth for all report templates.
 *
 * Usage:
 *   bun tools/quarto/scripts/create-template.ts --all              # Generate all templates
 *   bun tools/quarto/scripts/create-template.ts --skill pentest    # Generate specific skill
 *   bun tools/quarto/scripts/create-template.ts --sync             # Regenerate from config (alias for --all)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { join, resolve, dirname, relative } from "path";
import { parse } from "yaml";

// ── Paths ──────────────────────────────────────────────────────────────────────
const FRAMEWORK_ROOT = resolve(join(import.meta.dir, "../../.."));
const TEMPLATES_CONFIG = join(FRAMEWORK_ROOT, "tools/quarto/templates/templates.yaml");
const SKILLS_DIR = join(FRAMEWORK_ROOT, "skills");
const CENTRAL_TEMPLATES_DIR = join(FRAMEWORK_ROOT, "tools/quarto/templates/reports");

// ── Types ──────────────────────────────────────────────────────────────────────
interface TemplateSection {
  name: string;
  file: string;
  required: boolean;
  description?: string;
  content_template?: string;
  nested?: boolean;
  children_template?: string;
  children_content_template?: string;
}

interface UniqueSection {
  id: string;
  name: string;
  file: string;
  description: string;
  required: boolean;
  content_template: string;
}

interface SkillConfig {
  name: string;
  report_type: string;
  sections: string[];
  unique_sections: UniqueSection[];
}

interface TemplatesConfig {
  version: string;
  sections: Record<string, TemplateSection>;
  skills: Record<string, SkillConfig>;
  content_templates: Record<string, string>;
}

interface Args {
  skill?: string;
  all: boolean;
  sync: boolean;
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function parseArgs(): Args {
  const args = process.argv.slice(2);
  const result: Args = { all: false, sync: false };

  const skillIdx = args.indexOf("--skill");
  if (skillIdx !== -1 && args[skillIdx + 1]) {
    result.skill = args[skillIdx + 1]!.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  }

  result.all = args.includes("--all");
  result.sync = args.includes("--sync");

  // --sync is an alias for --all
  if (result.sync) result.all = true;

  return result;
}

function loadTemplatesConfig(): TemplatesConfig {
  const content = readFileSync(TEMPLATES_CONFIG, "utf-8");
  return parse(content) as TemplatesConfig;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function kebabToTitle(str: string): string {
  return str.split("-").map(capitalize).join(" ");
}

// ── Section Templates ───────────────────────────────────────────────────────
function generateCoverSection(): string {
  return `::: {.report-header}
![](../../../private/brand/assets/logo.{webp,png,jpg}){width=200}

# {{title}} Report {.unnumbered .unlisted}

<span class="report-target">[PROJECT NAME]</span>

::: {.report-header-meta}
<span><span class="meta-label">Organization</span>[Organization Name]</span>
<span><span class="meta-label">Report Date</span>\\date{}</span>
<span><span class="meta-label">Engagement ID</span>[ENG-001]</span>
:::
:::

::: {.classification-notice .confidential}
CONFIDENTIAL — For Authorized Recipients Only
:::

## Report Information {.unnumbered .unlisted}

::: {.report-meta}
| Field | Value |
|-------|-------|
| Project | [Project Name] |
| Version | 1.0 |
| Classification | [Confidential | Restricted | Internal | Public] |
| Engagement ID | [ENG-001] |
| Report Date | \\date{} |
| Report Version | 1.0 |
| Prepared By | [Your Name], [Organization] |
:::
`;
}

function generateExecutiveSummary(titleLower: string): string {
  return `# Executive Summary

[Organization Name] conducted a ${titleLower} of **[Project Name]**.
The assessment identified **N finding(s)**.

## Risk Distribution

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Informational | 0 |
| **Total** | **0** |

## Key Recommendations

- Recommendation 1
- Recommendation 2
- Recommendation 3

## Scope

- **In-Scope**: [List in-scope items]
- **Out-of-Scope**: [List out-of-scope items]
`;
}

function generateScopeSection(): string {
  return `# Scope and Methodology

## Assessment Scope

| Component | Type | Description |
|-----------|------|-------------|
| [Component] | [Type] | [Description] |

## Out of Scope

- Item 1
- Item 2

## Methodology

| Phase | Activity |
|-------|----------|
| 1 | Discovery |
| 2 | Analysis |
| 3 | Testing |
| 4 | Reporting |
`;
}

function generateFindingsSection(): string {
  return `# Findings

## Finding Index

| ID | Title | Severity | Status |
|----|-------|----------|--------|
| F001 | Example Finding | Medium | Open |

{{< include _sections/_findings/_f001-medium.qmd >}}
`;
}

function generateFindingTemplate(): string {
  return `<!-- ia:finding
id: F001
severity: medium
priority: P2
title: "Example Finding Title"
status: open
cwe: "CWE-XXX"
owasp: "OWASP-XXX"
-->

::: {.finding-medium}
#### F001: Example Finding Title

**Severity:** [Medium]{.badge-medium} | **Priority:** P2

**Component:** [Component Name]

**CWE:** CWE-XXX | **OWASP:** OWASP-XXX

**Status:** Open

---

**Description**

[Description of the finding]

**Impact**

[Impact description]

**Proof of Concept**

\`\`\`
[Code or steps to reproduce]
\`\`\`

**Remediation**

[Remediation guidance]

:::
`;
}

function generateRecommendationsSection(): string {
  return `# Recommendations

| Priority | Severity | Response Time |
|----------|----------|---------------|
| P0 | Critical | Immediately |
| P1 | High | Within 30 days |
| P2 | Medium | Within 90 days |
| P3 | Low | Backlog |

## Prioritized Recommendations

### P0 — Critical

- [ ] Finding F001: [Title] — [Action]

### P1 — High

*No high-priority findings identified.*

### P2 — Medium

*No medium-priority findings identified.*

### P3 — Low

*No low-priority findings identified.*
`;
}

function generateAppendicesSection(): string {
  return `# Appendices

## Appendix A: Finding Status

| ID | Title | Severity | Status |
|----|-------|----------|--------|
| F001 | Example Finding | Medium | Open |

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| [Term] | [Definition] |
`;
}

// ── Skill-Specific Sections ─────────────────────────────────────────────────
const uniqueSectionTemplates: Record<string, () => string> = {
  remediation: () => `# Remediation Tracker

| Finding | Severity | Assigned To | Due Date | Status |
|---------|----------|-------------|----------|--------|
| F001 | Medium | [Assignee] | [Date] | Open |
`,

  architecture: () => `# Architecture Overview

## System Components

[Component diagram or description]

## Trust Boundaries

[Trust boundary description]
`,

  threat_model: () => `# Threat Model

## Threat Categories

| Category | Threats Identified |
|----------|-------------------|
| Spoofing | |
| Tampering | |
| Repudiation | |
| Information Disclosure | |
| Denial of Service | |
| Elevation of Privilege | |

## Attack Surface

[Attack surface description]
`,

  practices: () => `# Security Practices Assessment

## Current Controls

| Control Domain | Implementation Status | Notes |
|-----------------|----------------------|-------|
| Access Control | [Implemented/Partial/Missing] | |
| Authentication | [Implemented/Partial/Missing] | |
| Encryption | [Implemented/Partial/Missing] | |
| Logging | [Implemented/Partial/Missing] | |
| Input Validation | [Implemented/Partial/Missing] | |
`,

  compliance: () => `# Compliance Assessment

## Framework Requirements

| Requirement | Status | Evidence |
|-------------|--------|----------|
| [Requirement 1] | [Compliant/Partial/Non-Compliant] | [Evidence] |
| [Requirement 2] | [Compliant/Partial/Non-Compliant] | [Evidence] |
`,

  data_flow: () => `# Data Flow Analysis

## Data Flows

[Describe data flows]

## Taint Sources

[List taint sources]
`,

  test_cases: () => `# Test Cases

## Test Case Summary

| ID | Category | Description | Expected Result | Status |
|----|----------|-------------|-----------------|--------|
| TC001 | [Category] | [Description] | [Expected] | Pending |
`,

  test_matrix: () => `# Test Coverage Matrix

| Requirement | Test Case | Status | Result |
|-------------|-----------|--------|--------|
| REQ-001 | TC001 | Complete | Pass |
`,

  compliance_matrix: () => `# Compliance Matrix

| Control ID | Control Description | Status | Gap | Remediation |
|------------|---------------------|--------|-----|-------------|
| [Control] | [Description] | [Compliant/Gap] | [Gap Description] | [Remediation] |
`,

  gap_findings: () => `# Gap Findings

## Framework: [Framework Name]

### Critical Gaps

- [Gap description]

### Moderate Gaps

- [Gap description]
`,

  remediation_roadmap: () => `# Remediation Roadmap

## Phase 1 (0-30 days)

- [Critical remediation item]

## Phase 2 (30-90 days)

- [Moderate remediation item]

## Phase 3 (90+ days)

- [Low priority remediation item]
`,

  asset_inventory: () => `# Asset Inventory

| Asset | Type | Criticality | Owner | Location |
|-------|------|-------------|-------|----------|
| [Asset] | [Type] | [High/Medium/Low] | [Owner] | [Location] |
`,

  threat_landscape: () => `# Threat Landscape

## Relevant Threats

- [Threat description]

## Threat Actors

- [Actor description]
`,

  risk_register: () => `# Risk Register

| Risk ID | Description | Likelihood | Impact | Score | Treatment |
|---------|-------------|------------|--------|-------|-----------|
| R001 | [Description] | [High/Medium/Low] | [High/Medium/Low] | [1-25] | [Mitigate/Accept/Transfer] |
`,

  timeline: () => `# Incident Timeline

| Timestamp | Event | Source | Analyst |
|-----------|-------|--------|---------|
| [ISO8601] | [Event description] | [Source] | [Analyst] |
`,

  impact: () => `# Impact Assessment

## Business Impact

[Business impact description]

## Technical Impact

[Technical impact description]
`,

  root_cause: () => `# Root Cause Analysis

## Technical Root Cause

[Root cause description]

## Contributing Factors

- [Factor 1]
- [Factor 2]
`,

  scan_methodology: () => `# Scan Methodology

## Scanner Configuration

| Setting | Value |
|---------|-------|
| Scanner | [Tool Name] |
| Version | [Version] |
| Scan Type | [Full/Partial] |
`,
  network_diagram: () => `# Network Diagram

[Network topology description]
`,
  connectivity_matrix: () => `# Connectivity Matrix

| Source Zone | Destination Zone | Port/Protocol | Action | Justification |
|-------------|-------------------|---------------|--------|---------------|
| [Zone A] | [Zone B] | [Port/Proto] | [Allow/Deny] | [Justification] |
`,
};

// ── Main Generation ────────────────────────────────────────────────────────
function generateMainTemplate(skill: string, skillConfig: SkillConfig, sections: Record<string, TemplateSection>): string {
  const title = skillConfig.name;
  const sectionIncludes: string[] = [];

  // Add base sections
  for (const sectionId of skillConfig.sections) {
    const section = sections[sectionId];
    if (section) {
      sectionIncludes.push(`{{< include _sections/${section.file} >}}`);
    }
  }

  // Add unique sections
  for (const unique of skillConfig.unique_sections) {
    sectionIncludes.push(`{{< include _sections/${unique.file} >}}`);
  }

  return `---
title: "${title}"
subtitle: "[CLIENT NAME] — [ENGAGEMENT TYPE]"
date: today
author: "Intelligence Adjacent Framework"
appendix-style: default
format:
  html:
    theme:
      - cosmo
      - ../../../private/brand/assets/theme-light.scss
    css: ../../../private/brand/assets/styles.css
    toc: true
    toc-depth: 3
    toc-location: left
    number-sections: true
    code-fold: show
    code-tools: true
    self-contained: true
  pdf:
    documentclass: report
    papersize: letter
    geometry:
      - margin=1in
      - top=1.25in
      - bottom=1.25in
    fontsize: 11pt
    pdf-engine: typst
    toc: true
    toc-depth: 3
    number-sections: true
execute:
  echo: false
  warning: false
---

${sectionIncludes.join("\n\n")}
`;
}

function generateEngagementYaml(skill: string, skillConfig: SkillConfig): string {
  const title = skillConfig.name;

  return `# ${title} Engagement Metadata
# Copy to your engagement directory and customize

project_name: "[Project Name]"
project_version: "1.0.0"
repo_url: "https://github.com/org/repo"
primary_language: "[Language]"
frameworks: "[Frameworks]"

client_name: "[Client Company Name]"
client_contact: "[Client Contact]"
client_email: "[email@domain.com]"

engagement_id: "${skill.toUpperCase()}-$(date +%Y)-001"
engagement_type: "${title}"
assessment_type: "Security Assessment"

classification: "Confidential"
start_date: "$(date +%Y-%m-%d)"
end_date: "$(date +%Y-%m-%d)"
report_date: "$(date +%Y-%m-%d)"
report_version: "1.0"

reviewer_name: "[Your Name]"
reviewer_org: "Intelligence Adjacent"
reviewer_contact: "[email@domain.com]"

scope_in:
  - "[Target] | [Type] | [Description] | [Environment]"
scope_out:
  - "[Out of scope item]"

compliance:
  - "[Framework 1]"
  - "[Framework 2]"

tools:
  - "[Tool Name] | [Purpose] | [Version]"
`;
}

function generateSkillTemplate(skill: string): void {
  const config = loadTemplatesConfig();
  const skillConfig = config.skills[skill];

  if (!skillConfig) {
    console.error(`Error: Skill '${skill}' not found in templates.yaml`);
    console.log(`Available skills: ${Object.keys(config.skills).join(", ")}`);
    process.exit(1);
  }

  const baseDir = resolve(CENTRAL_TEMPLATES_DIR, skill);
  console.log(`\nGenerating template for: ${skill}`);
  console.log(`  Output: ${baseDir}`);

  // Ensure directories exist
  mkdirSync(baseDir, { recursive: true });
  mkdirSync(join(baseDir, "_sections"), { recursive: true });
  mkdirSync(join(baseDir, "_sections", "_findings"), { recursive: true });

  // Generate main template
  const mainTemplate = generateMainTemplate(skill, skillConfig, config.sections);
  writeFileSync(join(baseDir, `${skill}-report.qmd`), mainTemplate, "utf-8");
  console.log(`  Created: ${skill}-report.qmd`);

  // Generate engagement.yaml
  const engagementYaml = generateEngagementYaml(skill, skillConfig);
  writeFileSync(join(baseDir, "engagement.yaml"), engagementYaml, "utf-8");
  console.log(`  Created: engagement.yaml`);

  // Generate base sections
  const titleLower = skillConfig.name.toLowerCase();

  const sectionFiles: [string, string][] = [
    ["_sections/_cover.qmd", generateCoverSection()],
    ["_sections/_executive-summary.qmd", generateExecutiveSummary(titleLower)],
    ["_sections/_scope.qmd", generateScopeSection()],
    ["_sections/_findings.qmd", generateFindingsSection()],
    ["_sections/_recommendations.qmd", generateRecommendationsSection()],
    ["_sections/_appendices.qmd", generateAppendicesSection()],
    ["_sections/_findings/_f001-medium.qmd", generateFindingTemplate()],
  ];

  // Add unique sections for this skill
  for (const unique of skillConfig.unique_sections) {
    const generator = uniqueSectionTemplates[unique.id];
    if (generator) {
      sectionFiles.push([`_sections/${unique.file}`, generator()]);
    }
  }

  // Write all section files
  for (const [filename, content] of sectionFiles) {
    const path = join(baseDir, filename);
    // Ensure parent directory exists
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content, "utf-8");
    console.log(`  Created: ${filename}`);
  }

  console.log(`\n✓ Template generated at: ${baseDir}`);
}

function generateAllTemplates(): void {
  const config = loadTemplatesConfig();
  const skills = Object.keys(config.skills);

  console.log(`Generating templates for ${skills.length} skills...`);
  console.log(`  Skills: ${skills.join(", ")}`);

  for (const skill of skills) {
    generateSkillTemplate(skill);
  }

  console.log("\n✓ All templates generated successfully");
}

// ── CLI ──────────────────────────────────────────────────────────────────────
function main() {
  const args = parseArgs();

  if (!args.all && !args.skill) {
    console.error(`Usage: create-template.ts [options]
Options:
  --all              Generate all templates from config
  --skill <name>    Generate template for specific skill
  --sync             Alias for --all (regenerate from config)
`);
    process.exit(1);
  }

  if (args.all || args.sync) {
    generateAllTemplates();
  } else if (args.skill) {
    generateSkillTemplate(args.skill);
  }
}

main();
