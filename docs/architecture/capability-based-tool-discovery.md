---
title: Capability-Based Tool Discovery
version: 1
date: Thu Jan 29 2026 18:00:00 GMT-0600 (Central Standard Time)
status: active
audience: intermediate
category: architecture
---



# Capability-Based Tool Discovery

**Decoupling workflows from tool locations for flexible, maintainable framework architecture.**

---

## Overview

Capability-based tool discovery decouples workflows from specific tool paths. Instead of hardcoding `bun tools/validation/audit.ts`, workflows reference capabilities like `[framework-accuracy-audit]`, and agents discover the tool location dynamically.

**Benefits:**
- Tools can move without breaking workflows
- Workflows remain stable and maintainable
- Clear separation between "what" (capability) and "where" (implementation)
- Agents can discover tools at runtime

---

## Core Concept

### OLD WAY (Hardcoded Paths - Brittle)

```markdown
## Step 3: Validate Framework

Run the validation tool:
```bash
```
```

**Problems:**
- Path hardcoded in workflow
- If tool moves → workflow breaks
- Tight coupling between workflow and tool location
- Every workflow must be updated when tools reorganize

### NEW WAY (Capability References - Flexible)

```markdown
## Step 3: Validate Framework

**Required capability:** `framework-accuracy-audit`

**Agent instructions:**
1. Read `docs/catalogs/tool-catalog.md`
2. Search for capability: `[framework-accuracy-audit]`
3. Execute tool at discovered path
```

**Benefits:**
- Workflow references capability, not path
- Tool can move freely - catalog is updated once
- Loose coupling - workflows stable across reorganizations
- Self-documenting - capability name describes intent

---

## Tool Discovery Protocol

**How agents discover and execute tools:**

### Step 1: Workflow Specifies Capability

```markdown
**Required capability:** `framework-accuracy-audit`
```

### Step 2: Agent Reads Catalog

Agent reads `docs/catalogs/tool-catalog.md` and searches for the capability tag.

### Step 3: Catalog Entry Found

```markdown
## Validation & Testing

**Tool:** `validation`
**Path:** `tools/validation/`
**Capabilities:** `[framework-accuracy-audit]` `[routing-gate-audit]` `[skill-completion-audit]`

**Usage:**
```bash
bun tools/validation/audit-framework-accuracy.ts
```
```

### Step 4: Agent Executes Tool

Agent runs the discovered tool at the documented path.

### Step 5: Workflow Continues

Agent returns to workflow with tool results.

---

## Capability Naming Conventions

**Format:** `[action-domain-noun]`

**Examples:**
- `[framework-accuracy-audit]` - Audit framework accuracy
- `[framework-install]` - Install framework
- `[video-download]` - Download video
- `[github-workflow-validation]` - Validate GitHub workflows
- `[env-backup]` - Backup environment file

**Guidelines:**
- Use hyphens, not underscores or camelCase
- Keep names under 40 characters
- Be specific but not too verbose
- Action-oriented (audit, install, download, validate)

---

## Writing Capability-Based Workflows

### Workflow Pattern

```markdown
## Step N: [Action Description]

**Required capability:** `[capability-name]`

**What this does:** [Brief explanation of what the tool accomplishes]

**Agent instructions:**
1. Read `docs/catalogs/tool-catalog.md`
2. Search for capability: `[capability-name]`
3. Execute tool at discovered path
```

### Example: Validation Step

```markdown
## Step 7: Security Scan

**Required capability:** `github-workflow-validation`

**What this does:** Validates GitHub Actions workflow files for syntax errors and path issues.

**Agent instructions:**
1. Read `docs/catalogs/tool-catalog.md`
2. Search for capability: `[github-workflow-validation]`
3. Execute tool at discovered path
```

---

## Adding New Tools

When adding a new tool to the framework:

### 1. Create Tool Directory

```bash
mkdir tools/{tool-name}
# Add tool files (NO subdirectories - flat structure)
```

### 2. Create Tool README

Document usage, purpose, and examples in `tools/{tool-name}/README.md`.

### 3. Update tool-catalog.md

Add capability entry:

```markdown
### Tool Name

**Tool:** `{tool-name}`
**Path:** `tools/{tool-name}/`
**Capabilities:** `[capability-1]` `[capability-2]`

**What it does:**
- Feature 1
- Feature 2

**Usage:**
```bash
bun tools/{tool-name}/script.ts
```

**When to use:** [Guidance on when this tool is appropriate]
```

### 4. Add to Capability Index

Update the capability index table at the top of tool-catalog.md:

```markdown
| Capability | Tool | Path |
|------------|------|------|
| `capability-name` | tool-name | `tools/tool-name/` |
```

### 5. Update Workflows (Optional)

Workflows that need this tool can now reference it by capability.

---

## Anti-Patterns

### ❌ DON'T: Hardcode Tool Paths in Workflows

```markdown
## Step 3: Validate
Run: bun tools/validation/audit.ts
```

### ✅ DO: Reference Capabilities

```markdown
## Step 3: Validate
**Required capability:** `framework-accuracy-audit`
```

---

### ❌ DON'T: Duplicate Tool Documentation in Workflows

```markdown
The validation tool checks framework structure, validates routing gates,
audits skills, checks for hardcoded counts, and validates links...
```

### ✅ DO: Reference Catalog for Details

```markdown
**Required capability:** `framework-accuracy-audit`
(See docs/catalogs/tool-catalog.md for details)
```

---

### ❌ DON'T: Create Framework Tools in Skill Directories

```markdown
skills/ghost/scripts/framework-validation.ts  # WRONG
```

### ✅ DO: Framework Tools in /tools, Skill Scripts in Skill Directory

```markdown
tools/validation/full-framework-audit.ts    # Framework-wide tool
skills/ghost/scripts/publish-post.ts          # Skill-specific script
```

---

## Skill-Specific vs Framework Tools

### Framework Tools (`tools/`)

**Characteristics:**
- Used by multiple skills or framework-wide
- General-purpose utilities
- Documented in tool-catalog.md
- Referenced by capability in workflows

**Examples:**
- Framework validation tools
- Setup and installation scripts
- Video analysis utilities
- Environment management tools

### Skill-Specific Scripts (`skills/{skill}/scripts/`)

**Characteristics:**
- Only used by one skill
- Domain-specific logic
- Documented in skill's SKILL.md
- Referenced directly by skill workflows

**Examples:**
- Ghost blog publishing scripts
- Security remediation automation
- Git repository operations
- Skill-specific API clients

---

## Migration Guide

### Updating Existing Workflows

**Before:**
```markdown
## Step 3: Validate Configuration
Run: bun tools/validation/validate-github-workflows.ts
```

**After:**
```markdown
## Step 3: Validate Configuration

**Required capability:** `github-workflow-validation`

**Agent instructions:**
1. Read `docs/catalogs/tool-catalog.md`
2. Search for capability: `[github-workflow-validation]`
3. Execute tool at discovered path
```

### Checklist

- [ ] Identify hardcoded tool path
- [ ] Find or create capability in tool-catalog.md
- [ ] Replace hardcoded path with capability reference
- [ ] Test workflow to ensure agent can discover tool
- [ ] Update any related documentation

---

## Troubleshooting

### Agent Can't Find Tool

**Symptom:** Agent reports "capability not found in catalog"

**Solution:**
1. Check capability name matches exactly (case-sensitive)
2. Verify capability exists in tool-catalog.md capability index
3. Ensure capability tag format is `[capability-name]` with brackets

### Tool Path Changed

**Symptom:** Workflow breaks after tool moves

**Solution:**
1. Update tool path in tool-catalog.md (one location)
2. Workflows automatically discover new location
3. No workflow updates needed

### Multiple Tools Have Same Capability

**Symptom:** Multiple tools claim same capability

**Solution:**
1. Capabilities should be unique per tool
2. Use more specific capability names
3. Or document multiple entry points for same capability

---

## Related Documentation

- `docs/catalogs/tool-catalog.md` - Complete tool catalog with all capabilities
- `docs/catalogs/commands.md` - Command reference (slash commands)
- `docs/standards/file-location-standards.md` - Where to put files
- `plans/2026-01-30-next-session-plan.md` - Implementation notes

---

**Version:** 1.0
**Last Updated:** 2026-01-30
**Status:** Active - Capability-based discovery implemented framework-wide
