---
type: documentation
title: File Location Standards
classification: public
version: 1.3
last_updated: Mon Jan 19 2026 18:00:00 GMT-0600 (Central Standard Time)
audience: all
category: standards
---



# File Location Standards - MANDATORY ROUTING RULES

**Purpose:** Single source of truth for where different document types belong in the Intelligence Adjacent framework.

**Status:** ✅ Active Enforcement
**Version:** 1.0
**Last Updated:** 2025-11-23

---

## Overview

This document solves the recurring problem: **"Why is this permanent doc in scratchpad/"**

The framework has clear locations for different document types. Following these rules ensures:
- ✅ Permanent docs survive long-term
- ✅ Version control includes important files
- ✅ Easy to find documentation
- ✅ No accidental deletion of critical work

---

## Path Resolution Standards

**Purpose:** Ensure framework portability across different installations and operating systems.

**Critical Requirement:** NEVER hardcode absolute paths. Always use dynamic framework root resolution.

### Standard Pattern

**Framework Root Detection (Priority Order):**

1. **Environment Variable** - `IA_FRAMEWORK_ROOT` (highest priority)
2. **Self-Discovery** - Resolve relative to the current file's location (preferred fallback)

**TypeScript/JavaScript Pattern:**
```typescript
// Standard pattern for any file - use import.meta.dir to self-discover
import { join } from 'path';

const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, <levels_to_root>);
// Example: script at tools/api/scripts/client.ts → 3 levels up
// const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '../../..');

// Or import the canonical utility
import { resolveFrameworkRoot } from '@/tools/framework/utils/path-resolution';
const FRAMEWORK_ROOT = resolveFrameworkRoot();
```

**Shared Implementation:** All framework code should use `tools/framework/utils/path-resolution.ts` for consistency.

**Bash Pattern:**
```bash
# Self-discover framework root from script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRAMEWORK_ROOT="${IA_FRAMEWORK_ROOT:-$(cd "$SCRIPT_DIR/<relative_path_to_root>" && pwd)}"
# Example: script at tools/api/scripts/run.sh → 3 levels up
# FRAMEWORK_ROOT="${IA_FRAMEWORK_ROOT:-$(cd "$SCRIPT_DIR/../../.." && pwd)}"
```

### Centralized Utility Library

**Location:** `tools/framework/utils/path-resolution.ts`

**Available Functions:**
- `resolveFrameworkRoot()` - Get framework root directory
- `resolveEnvPath()` - Get .env file path
- `resolveSkillDir(skillName)` - Get specific skill directory
- `resolveSkillRoot(scriptPath, levelsUp)` - Resolve skill root from script location
- `resolveSessionsDir()` - Get sessions directory
- `resolvePlansDir()` - Get plans directory
- `resolveDocsDir()` - Get docs directory
- `resolveToolsDir()` - Get tools directory
- `resolveHooksDir()` - Get hooks directory
- `resolveAgentsDir()` - Get agents directory
- `isWithinFramework(path)` - Validate path is within framework
- `validateFrameworkRoot()` - Check framework configuration

**Usage Example:**
```typescript
import { resolveFrameworkRoot, resolveSkillDir } from 'tools/framework/utils/path-resolution';

const frameworkRoot = resolveFrameworkRoot();
const monitorSkill = resolveSkillDir('monitor');
```

### Validation and Enforcement

**Pre-commit Hook Check:**
- Scans all staged code files for hardcoded paths
- Blocks commits with `/home/username` patterns
- Blocks commits with ANY `HOME.*/.claude` reference (use `import.meta.dir` or `SCRIPT_DIR` instead)
- Provides fix suggestions in error output

**Excluded from validation:**
- The path resolution utility library itself (`tools/framework/utils/path-resolution.ts`)
- Comments and documentation explaining patterns

**Fix Suggestions:**
```bash
# If pre-commit hook fails with path violations:

# TypeScript fix (use import.meta.dir for self-discovery):
const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, <levels_to_root>);

# Bash fix (use SCRIPT_DIR for self-discovery):
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRAMEWORK_ROOT="${IA_FRAMEWORK_ROOT:-$(cd "$SCRIPT_DIR/<relative_path>" && pwd)}"

# Or import from utility library:
import { resolveFrameworkRoot } from '@/tools/framework/utils/path-resolution';
```

### Why This Matters

**Problem Solved:**
- Framework can be installed anywhere
- Works across different operating systems
- Supports multiple framework installations
- Enables easy testing and development setups
- Prevents hardcoded paths that break portability

**Real-World Impact:**
- User installs framework at `~/ia-framework-private/`
- Scripts self-discover their framework root via `import.meta.dir` or `SCRIPT_DIR`
- All tools automatically resolve to the correct root
- No code changes needed for custom installations

---

## Root Directory - GitHub Special Files

**EXCEPTION: GitHub recognizes specific markdown files in root directory.**

These files MUST stay in root (not docs/) for GitHub to detect them:

| File | Purpose | GitHub Feature |
|------|---------|----------------|
| README.md | Repository description | Main page display |
| CLAUDE.md | Framework entry point | N/A (framework-specific) |
| CHANGELOG.md | Release history | Releases tab |
| SECURITY.md | Security policy | Security tab |
| CONTRIBUTING.md | Contribution guidelines | Contributors guide |
| INSTALL.md | Installation instructions | Common convention |
| CODE_OF_CONDUCT.md | Community standards | Insights tab |
| SUPPORT.md | Support resources | Community standards |
| LICENSE | License information | License badge |

**All other markdown files** should go in `docs/` (public) or `private/docs/` (private).

---

## Command Symlink Architecture (CRITICAL)

**Three-layer system for command discovery and tracking:**

```
SOURCE: skills/*/commands/*.md (actual files)
   ↓ Framework symlink (.md extension)
FRAMEWORK: commands/*.md (for git tracking)
   ↓ Discovery symlink (.md extension)
DISCOVERY: ~/.claude/commands/*.md (for Claude Code)
```

### Layer 1: Source Files
- **Location:** `skills/[skill-name]/commands/[command-name].md`
- **Purpose:** Actual command definitions (source of truth)
- **Format:** Markdown with YAML frontmatter

### Layer 2: Framework Symlinks
- **Location:** `commands/[command-name].md`
- **Purpose:** Git tracking and framework organization
- **Format:** Symlinks WITH `.md` extension
- **Target:** Relative path to source: `../skills/[skill]/commands/[cmd].md`
- **Created:** Manually when creating new commands

### Layer 3: Discovery Symlinks
- **Location:** `~/.claude/commands/[command-name].md`
- **Purpose:** Claude Code command discovery mechanism
- **Format:** Symlinks WITH `.md` extension
- **Target:** Absolute path: `~/ia-framework-private/commands/[cmd].md`
- **Created:** Automatically by setup script

### Critical Rules

**DO:**
- ✅ Always use `.md` extension in symlink names
- ✅ Create framework symlinks with relative paths
- ✅ Run setup script to create/update discovery symlinks
- ✅ Validate with `hooks/pre-commit/06-validate-command-symlinks.ts`

**DON'T:**
- ❌ Create non-.md symlinks (they serve no purpose)
- ❌ Create subdirectories in `commands/` (breaks discovery)
- ❌ Manually create `~/.claude/commands/` symlinks (use setup script)
- ❌ Use absolute paths in framework symlinks

### Example Creation

```bash
# 1. Create source file
Write skills/ghost/commands/ghost-research.md

# 2. Create framework symlink (manual)
ln -s ../skills/ghost/commands/ghost-research.md commands/ghost-research.md

# 3. Create discovery symlink (via setup script)
# The setup script will create:
# ln -sf ~/ia-framework-private/commands/ghost-research.md ~/.claude/commands/ghost-research.md
```

### Why This Architecture?

1. **Portability:** Framework can be installed anywhere (symlinks resolve correctly)
2. **Organization:** Commands grouped with their skills
3. **Discovery:** Claude Code finds commands in standard location
4. **Git Tracking:** Framework repo tracks all commands
5. **Mobility:** User can move framework without breaking paths

---

## Public vs Private Documentation (CRITICAL)

**RULE: `/docs` is PUBLIC ONLY. Private content goes in `/private/docs`.**

| Directory | Purpose | Syncs to Public Repo | Examples |
|---|---|---|---|
| `/docs` | **PUBLIC framework architecture** | ✅ YES | agent-routing-architecture.md, file-location-standards.md |
| `/private/docs` | **PRIVATE project tracking and work** | ❌ NEVER | active-tracker.md, skill-integration-status.md, blog-audits/ |

**When to use `/private/docs`:**
- References private skills (ghost, security, compliance, advisory, n8n, write)
- Project tracking and active work status
- Blog content planning, audits, or workflow documentation
- Personal workflows or processes
- API usage documentation (Grok Imagine, etc.)
- Anything you wouldn't want in the public framework

**When to use `/docs`:**
- Public framework architecture
- General standards and best practices
- Tool documentation for public tools
- Implementation patterns (generic, not private skill-specific)

**Enforcement:**
- Pre-commit hook (`hooks/pre-commit/08-validate-docs-public.ts`) blocks commits with private content in `/docs`
- Manifest exclusion (`private/**/*`) ensures `/private` NEVER syncs to public repo

---

## Document Type Matrix

| Document Type | Location | When Created | Lifespan | Example |
|---|---|---|---|---|
| **User Input Files** | `input/` | User provides | Indefinite | resume.md, cliftonstrengths.pdf |
| **Design Plans** | `plans/YYYY-MM-DD-description.md` | Before implementation | Task duration | 2025-12-14-subdirectory-claude-md-design.md |
| **Public Framework Docs** | `docs/[category]/` | Infrastructure decisions | Indefinite | agent-routing-architecture.md, file-location-standards.md |
| **Private Project Docs** | `private/docs/[category]/` | Private work tracking | Indefinite | active-tracker.md, blog-audits/, grok-imagine-usage.md |
| **Skill Methodology** | `skills/[skill]/SKILL.md` | Methodology updates | Indefinite | SKILL.md sections, PRINCIPLES.md |
| **Skill Status** | `skills/[skill]/STATUS.md` | Skill creation | Indefinite | Readiness, session history |
| **Skill Domain Knowledge** | `skills/[skill]/docs/` | Domain reference | Indefinite | PDFs, frameworks, standards |
| **Session Checkpoints** | `sessions/YYYY-MM-DD-project-name.md` | Multi-session projects | Project duration | sessions/2025-12-11-blog-post.md |
| **Blog Content** | `blog/YYYY-MM-DD-title/` | Blog work | Indefinite | blog/2025-12-17-post-title/ |
| **Temporary Analysis** | `scratchpad/YYYYMMDD-HHMMSS/` | Session iteration | Session only | Quick notes, explorations |
| **Framework Configuration** | `docs/[category]/` | Framework infrastructure | Indefinite | detection-rules/bash-tool-violations.json, hook-config.json |

---

## Decision Rules

### Rule 0: Plans vs Sessions vs Docs (Critical Distinction)

**Three similar-looking locations with DIFFERENT purposes:**

| Directory | Purpose | When to Use | Lifecycle |
|---|---|---|---|
| `plans/` | **Design BEFORE execution** | Plan mode, research, analysis | Delete after task complete |
| `sessions/` | **Progress DURING execution** | Multi-session tracking, resume context | Keep until project complete |
| `docs/` | **Permanent architecture decisions** | Framework changes, standards | Keep indefinitely |

**Example workflow:**
1. **Plan mode:** Create `plans/2025-12-14-feature-design.md` with research and design decisions
2. **Implementation:** Create `sessions/2025-12-14-feature-name.md` to track progress across sessions
3. **After completion:** If it changed architecture, add section to `docs/architecture/[topic].md`, then delete plan and session files

**Key insight:** Plans and sessions are WORKING FILES (gitignored). Docs are PERMANENT (version controlled).

### Rule 0.5: User Input Files

**User-provided files that skills/commands consume.**

**CRITICAL: Input mirrors Output structure.** If a skill outputs to `output/{category}/`, its inputs come from `input/{category}/`.

| Category | Input Location | Output Location | Used By |
|---|---|---|---|
| Career | `input/career/` | `output/career/` | /career, career skill |

**Career input files:**

| File | Path | Purpose |
|---|---|---|
| Resume | `input/career/resume.md` | Master resume (Markdown) |
| CliftonStrengths | `input/career/cliftonstrengths-all34.pdf` | Full 34 themes (optional) |

**Key principles:**
- `input/` mirrors `output/` directory structure
- `input/` is for files the USER provides (not generated)
- `output/` is for files the FRAMEWORK generates
- When creating a new skill that needs input files, create `input/{category}/` matching `output/{category}/`
- Input files are version controlled (private repo)

---

### Rule 1: Permanent vs Temporary Test

**Ask this question before creating ANY file:**

> "If I delete this file tomorrow, would the project be damaged?"

- **YES (damaged)** → Permanent document → Use `docs/`, `skills/`, or project location
- **NO (not damaged)** → Temporary work → Use `scratchpad/`

**Examples:**
- ✅ Permanent: "Public migration gap analysis" (project plan)
- ✅ Permanent: "Server deployment audit" (infrastructure docs)
- ✅ Permanent: "Blog content roadmap" (strategic planning)
- ❌ Temporary: "Quick test of OpenRouter models" (one-off exploration)
- ❌ Temporary: "Session notes 2025-11-23" (throwaway)

### Rule 2: Analysis Document Locations

**System Infrastructure Analysis** → `docs/[category]/`
- Framework architecture decisions
- Migration planning
- System audits
- Standards and best practices

**Categories:**
- `docs/public-migration/` - Public repo preparation
- `docs/architecture/` - System design docs
- `docs/best-practices/` - Framework standards
- `docs/troubleshooting/` - How-to documentation

**Skill Methodology Updates** → `skills/[skill]/SKILL.md`
- Add as new section in existing SKILL.md
- Updates to workflows or methodologies
- Don't create separate methodology files

**Design Plans** → `plans/YYYY-MM-DD-description.md`
- Analysis and planning BEFORE implementation starts
- Research findings and design decisions

### Rule 3: Framework Configuration Files (CRITICAL)

**Framework audit rules, detection patterns, and configuration → `docs/` ONLY**

**MUST:** All extensible rule/configuration files go in `docs/` with semantic subdirectories.

**Examples:**
- Detection rules: `docs/detection-rules/bash-tool-violations.json`
- Hook configs: `docs/hooks-config/` (if created)
- Validation rules: `docs/validation-rules/` (if created)

**Why `docs/`:**
- The former `library/` directory has been removed from the framework
- `library/api/` migrated to `tools/api/`, `library/catalogs/` to `docs/catalogs/`, etc.
- All permanent framework configuration stays in `docs/`
- Version control and discoverability requirements

**Enforcement:**
- Pre-commit hook validates framework configuration files are in `docs/`
- Code that references rules/configs must read from `docs/` paths only
- Multiple implementation approaches considered
- Used in plan mode, referenced during execution

**Session Decisions** → `sessions/YYYY-MM-DD-project-name.md`
- Multi-session project tracking DURING implementation
- Current phase and blockers
- Resume context for next session
- Progress updates across multiple sessions

### Rule 3: Blog-Specific Rules (Most Common Case)

**Blog content uses NESTED STRUCTURE:**

| Content Type | Location | Examples |
|---|---|---|
| **Posts** | `blog/posts/YYYY-MM-DD-title/` | Posts, research, images, metadata |
| **Newsletters** | `blog/newsletters/weekly-digest-YYYY-MM-DD-DD/` | Weekly digests |
| **Pages** | `blog/pages/` | Static pages |

**Key Principle:** Files NEVER move between folders. Status tracked in `metadata.json`, not folder location.

**Structure:**
```
blog/
├── posts/
│   └── 2025-12-17-post-title/
│       ├── draft.md              (user writes)
│       ├── metadata.json         (status: "draft" → "published")
│       ├── research-notes.md     (OSINT research if needed)
│       ├── hero.png              (user uploads)
│       ├── hero-prompt.md        (generated)
│       └── tweet.txt             (generated)
├── newsletters/
│   └── weekly-digest-2025-12-16-22/
│       ├── draft.md
│       └── metadata.json
├── pages/
└── STATUS.md              (Single source of truth for status + planning)
```

**❌ NEVER:**
- Put blog content in `scratchpad/` (files may be deleted, won't be version controlled)
- Put blog content in `output/blog/` (deprecated location - INVERTED path)
- Move files between folders to change status (use metadata.json instead)

### Rule 4: When to Move From Scratchpad

Files should be moved from `scratchpad/` to permanent location if:

1. **Referenced in next session** - You'll need it again
2. **Contains decisions** - Documents choices made
3. **Project planning** - Roadmaps, gap analysis, audits
4. **Infrastructure docs** - Standards, architecture, guides
5. **Session lasted >2 hours** - Significant work product

**Move BEFORE committing to git.**

### Rule 5: Scratchpad-Only Content

**Only these belong in scratchpad/:**
- Quick experiments and tests
- One-off analysis that won't be referenced
- Session working notes (not checkpoints)
- Temporary outputs from tools
- Draft explorations before permanent docs

**Scratchpad files should be:**
- Dated (YYYYMMDD-HHMMSS)
- Disposable (can be deleted)
- Not referenced by other docs

### Rule 6: STATUS.md Files (Three-Level Tracking)

**STATUS.md serves different purposes at different levels:**

| Location | Purpose | When Updated | Template |
|----------|---------|--------------|----------|
| `skills/[skill]/STATUS.md` | Skill readiness and session history | Every skill modification | `skills/create/templates/STATUS-TEMPLATE.md` |

**Skill STATUS.md (REQUIRED for all skills):**
- Tracks skill development over time
- Required sections: Last Updated, Readiness, Session Changes
- Domain-specific sections allowed (e.g., blog tracking tables)
- Checked at workflow START, updated at workflow END

**Workflow Integration:**
1. **START of workflow:** Read `skills/[skill]/STATUS.md` for current state
2. **END of workflow:** Update `skills/[skill]/STATUS.md` with session changes

**Key principle:** STATUS.md is the single source of truth for state. New session entries go at TOP (reverse chronological).

---

## Agent Responsibilities

### All Agents MUST

**1. Load this file at startup:**
```markdown
## SESSION STARTUP REQUIREMENT
1. Read CLAUDE.md (bootloader)
2. Read docs/standards/file-location-standards.md (file location routing) ← THIS FILE
3. Read sessions/YYYY-MM-DD-project.md (if exists)
4. Read skills/[skill]/SKILL.md (skill context)
```

**2. Classify documents before creation:**
- Determine: Permanent or Temporary?
- Select correct location based on document type
- Create file in proper location FIRST TIME (don't move later)

**3. Before session end:**
- Review files created in `scratchpad/`
- Move any permanent docs to correct location
- Update session file with file references

---

## Common Mistakes & Fixes

### Mistake 1: "Gap Analysis" in Scratchpad

**❌ Wrong:**
```
scratchpad/PUBLIC-REPO-GAP-ANALYSIS-2025-11-23.md
```

**✅ Correct:**
```
docs/public-migration/gap-analysis.md
```

**Why:** Gap analysis is permanent project planning, not temporary work.

### Mistake 2: "Audit" Documentation in Scratchpad

**❌ Wrong:**
```
scratchpad/SERVERS-DEPLOYMENT-AUDIT-2025-11-23.md
```

**✅ Correct:**
```
docs/public-migration/servers-audit.md
```

**Why:** Audit documentation is infrastructure analysis, belongs in docs/.

### Mistake 3: Updating CLAUDE.md for Engagement Setup

**❌ Wrong:**
```
Updating CLAUDE.md when creating new pentest/audit engagement
```

**✅ Correct:**
```
Use skill-specific output directories within skills/[skill]/output/
```

**Why:** Client work outputs belong in skill directories. CLAUDE.md is for system-level changes only (new skills, agents, workflows). Never update CLAUDE.md for individual client engagements.

### Mistake 4: Blog Roadmap in Scratchpad

**❌ Wrong:**
```
scratchpad/BLOG-CONTENT-ROADMAP-2025-11-23.md
```

**✅ Correct:**
```
docs/blog/content-roadmap.md
```

**Why:** Blog planning is permanent project documentation, not blog content itself.

### Mistake 5: Timestamped Permanent Docs

**❌ Wrong pattern:**
```
ANY-PERMANENT-DOC-2025-11-23.md
```

**✅ Correct pattern:**
```
descriptive-name.md  (no timestamp)
```

**Why:** Timestamps signal "temporary". Permanent docs use descriptive names.

---

## Quick Reference Decision Tree

```
Creating a file?
  │
  ├─ Is it a USER-PROVIDED input file (resume, credentials)?
  │   └─ YES → input/{category}/ (mirrors output/{category}/)
  │
  ├─ Is it design/planning BEFORE implementation?
  │   └─ YES → plans/YYYY-MM-DD-description.md
  │
  ├─ Is it a blog post (posts, research, images)?
  │   └─ YES → blog/posts/YYYY-MM-DD-title/
  │
  ├─ Is it a newsletter digest?
  │   └─ YES → blog/newsletters/weekly-digest-YYYY-MM-DD-DD/
  │
  ├─ Is it infrastructure/framework documentation?
  │   ├─ References private skills (ghost, security, compliance, etc.)?
  │   │   └─ YES → private/docs/[category]/
  │   ├─ Contains project tracking or private workflows?
  │   │   └─ YES → private/docs/[category]/
  │   └─ Public framework architecture?
  │       └─ YES → docs/[category]/
  │
  ├─ Is it skill methodology update?
  │   └─ YES → skills/[skill]/SKILL.md (add section)
  │
  ├─ Is it multi-session project tracking DURING work?
  │   └─ YES → sessions/YYYY-MM-DD-project-name.md
  │
  └─ Is it temporary exploration/notes?
      └─ YES → scratchpad/YYYYMMDD-HHMMSS/
```

---

## Catalog-Based Discovery

**Purpose:** Enable complete feature discoverability in private repo while maintaining clean public release.

**Architecture:**

1. **CLAUDE.md** - Navigation and routing only (<200 lines)
   - Does NOT list individual skills/commands
   - References catalogs as source of truth
   - Provides context hierarchy and agent routing

2. **docs/catalogs/commands.md** - Complete command reference
   - Lists ALL skills and commands (public + private in private repo)
   - Classification metadata for public/private filtering
   - Command → Agent → Skill mapping

3. **docs/catalogs/tool-catalog.md** - Complete tool reference
   - Lists ALL API clients and integrations
   - Authentication requirements
   - Integration status

**Transform Process:**

When syncing to public repo (`/git-public`):
1. CLAUDE.md is filtered by `transform-claude-md.ts` (removes private sections)
2. commands.md is filtered by `filter-commands-catalog.ts` (removes private commands)
3. tool-catalog.md is excluded entirely (may contain private integrations)
4. Result: Public repo has clean, public-only catalogs

**Benefits:**
- ✅ Private repo documents ALL features
- ✅ Public repo automatically filtered
- ✅ Single source of truth (manifest + catalogs)
- ✅ CLAUDE.md stays concise
- ✅ Easy to maintain (update catalog, not CLAUDE.md)

**Maintenance:**

When adding new skills:
1. Update skill classification in `.framework-manifest.yaml`
2. Add command to `docs/catalogs/commands.md`
3. CLAUDE.md references remain unchanged (just points to catalog)
4. Transform scripts automatically filter during public sync

See: `tools/git/scripts/public/filter-commands-catalog.ts` for implementation.

---

## Backup File Handling

**CRITICAL: Backup files should NEVER be committed to version control.**

### Backup File Patterns to Avoid

Common backup file extensions that must be ignored:
- `*.backup` - Generic backups
- `*.backup-*` - Timestamped backups (e.g., `.backup-20260101`)
- `*.bak` - Traditional backup extension
- `*.tmp` - Temporary files
- `*~` - Editor backup files (vi, emacs)
- `*.swp`, `*.swo` - Vim swap files

### How Backups Are Prevented

1. **`.gitignore` patterns** - All backup patterns listed with comments
2. **orphaned-files-validator** - Pre-commit check detects accidental backup files
3. **auto-cleanup script** - Automatically removes backup files before commits

### Best Practices

**When you need a version:**
- Create a new branch instead of backup files
- Use git history instead of backup copies
- Name intermediate versions descriptively: `v1-original.md` → `v2-updated.md`

**When editing skill files:**
```bash
# DON'T do this:
cp SKILL.md SKILL.md.backup
# Edit SKILL.md
# Git will complain about backup file

# DO this instead:
# Edit SKILL.md
git add SKILL.md
git commit -m "Update SKILL.md"
# Use git log to access history
```

**Accidental backups:**
```bash
# If backup file was already committed:
git rm --cached SKILL.md.backup
echo "*.backup" >> .gitignore
git commit -m "Remove backup files and add to gitignore"
```

---

## Skill Directory Structure Standards

**All skills MUST follow this exact structure:**

```
skills/{skill-name}/
├── SKILL.md                    # Skill documentation (MUST be at root)
├── README.md                   # Quick overview (optional)
├── STATUS.md                   # Current status and history
├── scripts/                    # Implementation code
│   ├── main.ts
│   ├── utils/
│   └── ...
├── input/                      # Input templates/samples (optional)
│   ├── .gitkeep
│   └── examples/
├── output/                     # Generated outputs (optional)
│   ├── .gitkeep
│   └── [generated files]
├── docs/                       # Additional documentation
│   ├── guides/
│   ├── domain-knowledge.md
│   └── ...
└── commands/                   # Command symlinks
    └── my-command.md
```

### Structural Rules (Enforced)

1. **SKILL.md MUST be at skill root** - Never in `scripts/` or `docs/`
2. **output/ MUST be at skill root** - Never in `scripts/`
3. **input/ MUST be at skill root** - Never in `scripts/`
4. **scripts/ folder required** - Implementation code location
5. **No .gitkeep in root** - Only in empty input/ and output/

### Validation

The `skill-structure-validator` checks this automatically:
```bash
bun tools/validation/skill-structure-validator.ts
```

### Fixing Structure Issues

**Problem**: SKILL.md is in scripts/ subdirectory
```bash
# Fix: Move SKILL.md from scripts/ subdirectory to skill root
cd skills/my-skill
mv ./scripts/SKILL.md ./SKILL.md
git add SKILL.md
git commit -m "refactor: Move SKILL.md to skill root"
```

**Problem**: output/ is in scripts/
```bash
# Fix
cd skills/my-skill
mv scripts/output ./output
git add output/
git commit -m "refactor: Move output directory to skill root"
```

### Document Organization Within Skills

**SKILL.md** - Comprehensive skill documentation
- Skill overview and purpose
- Phase workflows (if applicable)
- Configuration and setup
- Reference information

**docs/** - Additional domain documentation
- Research files and references
- Technical guides
- Best practices
- Links to external resources

**README.md** - Quick overview
- One-paragraph description
- Quick start
- Key links

---

## Phase-Based Execution Prompts (`prompts/`)

**Purpose:** Atomic, executable prompts for orchestrated multi-phase skill execution.

**When to use:**
- Skills implementing phase-based workflows (Phase 1→2→3→...→N)
- Multi-step processes with clear input/output boundaries
- Scenarios where a master orchestrator routes between phases

**Examples:**
- **Security**: Phase 4 (test plan generation) → Phase 5 (test execution)
- **Writer**: Phase 1 (research) → Phase 2 (draft) → Phase 3 (QA) → Phase 4 (visuals) → Phase 5 (publish)
- **Engineer**: Phase 1 (plan) → Phase 2 (implement) → Phase 3 (test) → Phase 4 (validate)

**Structure:**
```
skills/{skill}/prompts/
├── shared/                      # Shared components (included via @include())
│   ├── authorization-check.md
│   ├── error-handling.md
│   └── validation.md
├── {domain}/                    # Domain-specific prompts
│   ├── {category}/
│   │   ├── technique-1.md       # Atomic execution prompt
│   │   ├── technique-2.md
│   │   └── technique-N.md
│   └── ...
└── [other domains]
```

**Atomic Prompt Requirements:**

Each prompt file must include:
1. **EXECUTION METADATA** - Model, mode, complexity, estimated duration
2. **WHO** - Role identity and constraints
3. **WHAT** - Objective and success criteria
4. **HOW** - Step-by-step execution instructions
5. **OUTPUT FORMAT** - Expected results structure
6. **ERROR HANDLING** - Recovery procedures (@include(shared/error-handling.md))

**Example:**
```markdown
# SQL Injection - MySQL Error-Based

## EXECUTION METADATA
**Model**: haiku
**Mode**: single-agent
**Complexity**: low
**Estimated Duration**: 5min

## WHO
**Role**: Security Tester
...
```

**Integration with Orchestration:**
- Master orchestrator loads prompts dynamically
- Phase 4: Selects applicable prompts based on scope/target characteristics
- Phase 5: Executes each prompt sequentially with status tracking
- Prompts contain placeholders for runtime substitution ([insert target url], etc.)

---

## Hidden Directory Policy

**Framework permits specific hidden directories only.**

### Allowed Hidden Directories

**Infrastructure**:
- `.git` - Version control
- `.github` - GitHub configuration (workflows, etc.)

**Configuration**:
- `.claude` - Framework configuration
- `.editorconfig` - Editor settings
- `.npmrc`, `.yarnrc` - Package manager config
- `.env`, `.env.local` - Environment variables

**IDE/Editor**:
- `.vscode` - VS Code settings
- `.idea` - JetBrains IDE settings
- `.obsidian` - Obsidian configuration

**Browsers/Automation**:
- `.browser-state` - Playwright/Chromium profile data
- `.playwright` - Playwright cache

**Other**:
- `.gitignore`, `.gitattributes` - Git configuration
- `.husky` - Git hooks
- `.test-artifacts` - Test output

### Prohibited Hidden Directories

These indicate problems and will be flagged:
- `.framework-staging` - Leftover from framework updates
- `.build-cache` - Build artifacts (should use .gitignore)
- `.work-in-progress` - Incomplete work (should be branches)
- `.backup`, `.bak` - Backups (should be ignored)
- `.old`, `.disabled`, `.deleted` - Dead code (use git history)

### Validation

Hidden directories are checked automatically:
```bash
bun tools/validation/hidden-directory-validator.ts
```

---

## .gitignore Pattern Guidelines

**Patterns are organized by category with comments:**

```gitignore
# Backup files
*.backup
*.backup-*
*.bak
*.tmp
*~

# Browser artifacts
**/.browser-state/
**/.playwright/

# Dependencies
node_modules/

# Build
dist/

# Environment
.env
.env.local

# IDE
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Cache
.cache/
.eslintcache

# Skill output/input (with exceptions)
**/output/*
!**/output/.gitkeep
!skills/ghost/output/**
**/input/*
!**/input/.gitkeep
```

### Adding New Patterns

**When adding new file types to ignore:**

1. **Add to .gitignore** with category comment
2. **Update gitignore-patterns-validator.ts** - Add to REQUIRED_PATTERNS
3. **Test the pattern** - Use `git check-ignore -v test.file`
4. **Document why** - Comment explaining the pattern

**Example:**
```bash
# 1. Add pattern
echo "**/*.mypattern" >> .gitignore

# 2. Update validator
# Add to REQUIRED_PATTERNS in gitignore-patterns-validator.ts:
# { pattern: '**/*.mypattern', ... }

# 3. Test
touch test.mypattern
git check-ignore -v test.mypattern
rm test.mypattern

# 4. Verify
bun tools/validation/gitignore-patterns-validator.ts
```

---

## Private Documentation Organization (MANDATORY)

**Document Type Taxonomy — 9 Categories:**

### 1. Keep at Root
**Location:** `/private/docs/{filename}.md`
**Criteria:** Heavily referenced in code/CLAUDE.md, operational necessity
**Examples:** `active-tracker.md`, `infrastructure-inventory.md`

### 2. Development Logs
**Location:** `/private/docs/development/`
**Subdirs:** `sprints/`, `milestones/`, `audits/`
**Criteria:** Sprint summaries, milestone completions, bug fixes, framework audits
**Examples:** `SPRINT-2-COMPLETE.md`, `M-3-ERROR-SANITIZATION-SUMMARY.md`

### 3. Project Tracking
**Location:** `/private/docs/projects/`
**Criteria:** Active work tracking, integration status, skill inventory, adoption plans
**Examples:** `skill-integration-status.md`, `gsd-adoption-plan.md`

### 4. Infrastructure Work
**Location:** `/private/docs/infrastructure/`
**Criteria:** VPS work, environment setup, deployment logs, configuration references
**Examples:** `vps-infrastructure.md`, `session-management.md`, `openrouter-setup-checklist.md`

### 5. Assessments
**Location:** `/private/docs/assessments/`
**Criteria:** Analysis reports, evaluations, phase summaries, tool assessments
**Examples:** `agent-lightning-assessment.md`, `quarto-evaluation-report.md`

### 6. Compliance Tracking
**Location:** `/private/docs/compliance-tracking/`
**Criteria:** Compliance audit tracking (NOT framework enrichment work, which lives in `standards/`)
**Examples:** `aiuc-1-compliance-tracker.yaml`, `aiuc-1-self-assessment.md`

### 7. Content Strategy
**Location:** `/private/docs/content/`
**Criteria:** Content tools, prompt architecture, API usage, Ghost content management
**Examples:** `grok-imagine-usage.md`, `posts-with-unapproved-tags.md`

### 8. Essential Skill Docs
**Location:** `skills/{skill-name}/docs/`
**Criteria:** ONLY documentation needed to USE the skill — workflows, guides, references, checklists
**Examples:** `agent-quick-start.md`, `complete-workflow.md`, `brand-guide.md`

### 9. Skill Working Docs
**Location:** `/private/docs/skills/{skill-name}/`
**Subdirs:** `audits/`, `incidents/`, `bug-fixes/`, `deployment/`, `development/`, `workflows/`
**Criteria:** Audits, bug fixes, deployment notes, incident reports, implementation history
**Examples:** `security-skill-audit-2026-001-028.md`, `implementation-complete.md`

**The rule:** If a document exists to RECORD what was done (audit, incident, fix, deploy), it goes in
`/private/docs/skills/`. If it exists to GUIDE what to do (workflow, checklist, guide), it stays in
`skills/{skill}/docs/`.

---

## Related Documentation

- `docs/session-checkpoint-enforcement.md` - Session state rules
- `docs/guides/hierarchical-context-loading.md` - Context architecture
- `CLAUDE.md` - Framework navigation and routing
- `docs/architecture/framework-validation-system.md` - Validation system documentation

---

**This is a MANDATORY document.** All agents must load and follow these rules.

**Questions?** These rules are authoritative. If unclear, ask user before creating files.

**Version:** 1.0
**Status:** ✅ Active Enforcement
**Framework:** Intelligence Adjacent (IA)
