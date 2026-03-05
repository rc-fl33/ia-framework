# Framework Tool Catalog

**Capability-based tool discovery for agents**

**Last Updated:** 2026-03-02
**Version:** 2.5

---

## How to Use This Catalog

**For Agents:**
1. Identify the capability you need (e.g., "video-download")
2. Search this file for that capability tag
3. Use the tool path provided
4. Read the tool's README for detailed usage

**For Workflows:**
- **OLD (hardcoded):** `bun tools/validation/audit-framework.ts`
- **NEW (capability):** `Required capability: framework-accuracy-audit`

**Agents:** When you see "Required capability: X", search this catalog for `[X]` to find the tool.

---

## Capability Index

Quick reference - full details below:

| Capability | Tool | Path |
|------------|------|------|
| `framework-install` | setup | `tools/setup/` + `setup/` |
| `framework-accuracy-audit` | validation | `tools/validation/` |
| `routing-gate-audit` | validation | `tools/validation/` |
| `skill-completion-audit` | validation | `tools/validation/` |
| `ci-validation` | validation | `tools/validation/` |
| `github-workflow-validation` | validation | `tools/validation/` |
| `video-download` | video-analysis | `tools/video-analysis/` |
| `video-frame-extraction` | video-analysis | `tools/video-analysis/` |
| `video-frame-analysis` | video-analysis | `tools/video-analysis/` |
| `env-backup` | env-sync | `tools/framework/env-sync/` |
| `env-diff` | env-sync | `tools/framework/env-sync/` |
| `env-merge` | env-sync | `tools/framework/env-sync/` |
| `hook-generation` | hooks | `tools/hooks/` |
| `doc-generation` | docs | `tools/docs/` |
| `framework-migration` | migration | `tools/migration/` |
| `prompt-generation` | prompt-generators | `tools/prompt-generators/` |
| `image-prompt-generation` | prompt-generators | `tools/prompt-generators/` |
| `video-prompt-generation` | prompt-generators | `tools/prompt-generators/` |
| `claude-md-merge` | claude-md-sync | `tools/claude-md-sync/` |
| `claude-md-backup` | claude-md-sync | `tools/claude-md-sync/` |
| `claude-md-diff` | claude-md-sync | `tools/claude-md-sync/` |
| `file-cleanup` | cleanup | `tools/cleanup/` |
| `doc-search` | context7 | `tools/context7/` |
| `result-deduplication` | deduplicator | `tools/deduplicator/` |
| `pdf-export` | export | `tools/export/` |
| `docx-export` | export | `tools/export/` |
| `pdf-split` | export | `tools/export/` |
| `routing-gate-generation` | generators | `tools/generators/` |
| `workflow-prompt-generation` | generators | `tools/generators/` |
| `workflow-validation` | generators | `tools/generators/` |
| `git-commit-push` | git | `tools/git/` |
| `git-public-sync` | git | `tools/git/` |
| `framework-core` | framework | `tools/framework/` |
| `image-generation` | grok2api | `tools/grok2api/` |
| `video-generation` | grok2api | `tools/grok2api/` |
| `chat-generation` | grok2api | `tools/grok2api/` |
| `prompt-provider` | grok2api | `tools/grok2api/` |
| `image-editing` | grok2api | `tools/grok2api/` |
| `voice-generation` | grok2api | `tools/grok2api/` |
| `admin-api` | grok2api | `tools/grok2api/` |
| `nsfw-control` | grok2api | `tools/grok2api/` |
| `markdown-parsing` | markdown | `tools/framework/markdown/` |
| `frontmatter-extraction` | markdown | `tools/framework/markdown/` |
| `llm-routing` | model-router | `tools/model-router/` |
| `framework-monitoring` | monitor | `tools/monitor/` |
| `n8n-setup` | n8n | `tools/n8n/` |
| `cve-search` | nvd | `tools/nvd/` |
| `llm-chat` | openrouter | `tools/openrouter/` |
| `pdf-extraction` | pdf | `tools/pdf/` |
| `iso-pdf-extraction` | pdf-extract | `tools/pdf-extract/` |
| `ssrf-protection` | security | `tools/framework/security/` |
| `input-validation` | security | `tools/framework/security/` |
| `content-sanitization` | security | `tools/framework/security/` |
| `vps-deployment` | twingate | `tools/twingate/` |
| `hook-sync` | utils | `tools/utils/` |
| `app-download` | app-downloader | `tools/app-downloader/` |
| `browser-automation` | agent-browser | External CLI (npm) |
| `web-snapshot` | agent-browser | External CLI (npm) |
| `framework-update` | framework-update | `tools/framework-update/` |
| `model-ranking` | model-ranker | `tools/model-ranker/` |
| `repo-ingestion` | ingestion | `tools/ingestion/` |
| `framework-refresh` | ingestion | `tools/ingestion/` |
| `reference-ingestion` | ingestion | `tools/ingestion/` |
| `quarto-render` | quarto | `tools/quarto/` |
| `quarto-style` | quarto | `tools/quarto/` |
| `report-generation` | quarto | `tools/quarto/` |
| `template-scaffold` | quarto | `tools/quarto/` |
| `session-toggle` | toggle | `tools/toggle/` |
| `session-status` | toggle | `tools/toggle/` |
| `verbose-toggle` | toggle | `tools/toggle/` |
| `scope-validation` | pentest | `tools/pentest/` |
| `tool-execution` | pentest | `tools/pentest/` |
| `session-management` | pentest | `tools/pentest/` |
| `audit-logging` | pentest | `tools/pentest/` |
| `scope-parsing` | bug-bounty | `tools/bug-bounty/` |
| `bounty-target-sync` | bug-bounty | `tools/bug-bounty/` |
| `hackerone-api` | bug-bounty | `tools/bug-bounty/` |
| `diagram-render` | mermaid | `tools/mermaid/` |
| `svg-render` | mermaid | `tools/mermaid/` |
| `mermaid-validate` | mermaid | `tools/mermaid/` |
| `poc-generation` | code-review | `tools/code-review/` |
| `coverage-analysis` | code-review | `tools/code-review/` |
| `standard-selection` | code-review | `tools/code-review/` |
| `manifest-generation` | standards | `tools/standards/` |
| `question-deduplication` | compliance | `tools/standards/` |

---

## Tools by Capability

### Setup & Installation

**Tool:** `setup`
**Paths:** `tools/setup/` (TypeScript utilities) + `setup/` (user-facing platform scripts)
**Capabilities:** `[framework-install]`

**What it does:**
- Platform detection (Linux, macOS, Windows/WSL)
- Dependency installation (Bun, Git, Docker)
- Framework initialization
- System optimization

**TypeScript utilities (`tools/setup/`):**
- `install-framework.ts` - Main installer orchestrator
- `platform-detector.ts` - Detect OS/platform
- `bun-installer.ts` - Install Bun runtime
- `git-installer.ts` - Install/configure Git
- `system-deps-checker.ts` - Validate dependencies
- `wsl-configurator.ts` - WSL-specific configuration
- `uninstall.ts` - Framework removal
- `99-cleanup.sh` - Post-install cleanup

**User-facing platform scripts (`setup/`):**
- `setup/windows/` - PowerShell scripts (4 scripts: WSL, Ubuntu, prerequisites, Docker)
- `setup/linux/` - Bash scripts (prerequisites, Docker, system tuning)
- `setup/macos/` - Bash scripts (prerequisites, Docker)

**Usage:**
```bash
bun tools/setup/install-framework.ts
```

**When to use:** First-time framework installation, system setup. Platform scripts in `setup/` are downloaded by users via raw.githubusercontent.com URLs in INSTALL.md.

---

### Validation & Testing

**Tool:** `validation`
**Path:** `tools/validation/`
**Capabilities:** `[framework-accuracy-audit]` `[routing-gate-audit]` `[skill-completion-audit]` `[ci-validation]` `[github-workflow-validation]`

**What it does:**
- Framework health checks
- Routing gate validation
- Skill completion audits
- CI/CD validation
- GitHub workflow validation
- Hardcoded count detection
- Link validation
- Structure validation

**Files:**
- `audit-framework-accuracy.ts` - Framework health check
- `audit-routing-gates.ts` - Validate routing gates
- `audit-skill-completion.ts` - Check skill completeness
- `ci-validation.ts` - CI/CD validation
- (GitHub workflow validator - check README)

**Usage:**
```typescript
// In workflow: "Required capability: framework-accuracy-audit"
// Agent discovers and runs:
bun tools/validation/audit-framework-accuracy.ts
```

**When to use:** Pre-commit, CI/CD, manual audits

---

### Video Analysis

**Tool:** `video-analysis`
**Path:** `tools/video-analysis/`
**Capabilities:** `[video-download]` `[video-frame-extraction]` `[video-frame-analysis]`

**What it does:**
- Download YouTube videos (yt-dlp)
- Extract frames at intervals
- Analyze frames with Claude vision
- Auto-cleanup temporary files

**Dependencies:** yt-dlp, ffmpeg, @anthropic-ai/sdk

**Files:**
- `download-video.ts` - Download YouTube video
- `extract-frames.ts` - Extract frames from video
- `analyze-video.ts` - Analyze frames with Claude

**Workflow:** Download → Extract → Analyze → Cleanup

**Usage:**
```typescript
// Download
bun tools/video-analysis/download-video.ts <youtube-url>

// Extract frames
bun tools/video-analysis/extract-frames.ts <video-path>

// Analyze
bun tools/video-analysis/analyze-video.ts <frames-dir>
```

**When to use:**
- ✅ Research phase in `/ghost` skill
- ✅ OSINT analysis in `/advisor` skill
- ❌ Don't use for video editing/production

---

### Browser Automation

**Tool:** `agent-browser`
**Path:** External CLI (`npm install -g agent-browser`)
**Capabilities:** `[browser-automation]` `[web-snapshot]`

**What it does:**
- Headless browser automation for AI agents
- Navigate URLs, click elements, fill forms
- Get accessibility snapshots with refs for deterministic selection
- Screenshot capture (including annotated with element labels)
- Session persistence (cookies, localStorage)
- Security features: domain allowlist, action policy, content boundaries

**Installation:**
```bash
npm install -g agent-browser
agent-browser install  # Download Chromium
```

**Core Workflow:**
```bash
# 1. Navigate to URL
agent-browser open https://example.com

# 2. Get accessibility snapshot with refs
agent-browser snapshot -i

# 3. Interact using refs (from snapshot output)
agent-browser click @e2
agent-browser fill @e3 "text"

# 4. Re-snapshot after page changes
agent-browser snapshot -i
```

**Security Options:**
```bash
# Restrict to allowed domains
agent-browser open example.com --allowed-domains "example.com,*.example.com"

# Content boundaries for LLM safety
agent-browser open example.com --content-boundaries

# Action policy file
agent-browser open example.com --action-policy ./policy.json
```

**When to use:**
- ✅ Web automation, form filling, login flows
- ✅ Web scraping with proper interactivity
- ✅ Visual regression testing
- ✅ AI agent web interactions
- ❌ Don't use for simple GET requests (use curl/wget)

---

### Environment Management

**Tool:** `env-sync`
**Path:** `tools/framework/env-sync/`
**Capabilities:** `[env-backup]` `[env-diff]` `[env-merge]`

**What it does:**
- Backup environment variables
- Diff .env files
- Merge .env sections
- Integration testing

**Files:**
- `backup-env.ts` - Backup .env file
- `diff-env.ts` - Compare .env files
- `merge-env-sections.ts` - Merge .env sections
- `integration-test.ts` - Test env sync

**Usage:**
```bash
# Backup
bun tools/framework/env-sync/backup-env.ts

# Diff
bun tools/framework/env-sync/diff-env.ts .env .env.backup

# Merge
bun tools/framework/env-sync/merge-env-sections.ts
```

**When to use:** Environment management, credential rotation, setup

---

### CLAUDE.md Sync

**Tool:** `claude-md-sync`
**Path:** `tools/claude-md-sync/`
**Capabilities:** `[claude-md-merge]` `[claude-md-backup]` `[claude-md-diff]`

**What it does:**
- Intelligently merge upstream CLAUDE.md with local customizations during framework updates
- Detect section ownership (framework vs user vs hybrid) and apply appropriate merge strategy
- Preview changes before applying, with automatic backup and rollback support

**Key scripts:**
- `merge-claude-sections.ts` -- Section-aware merge with preview and apply modes
- `diff-claude-md.ts` -- Side-by-side diff with ownership annotations
- `backup-claude-md.ts` -- Timestamped backup creation
- `list-backups.ts` -- List available backups
- `rollback.ts` -- Restore from backup
- `parser-claude-md.ts` -- Section parser (code-fence aware)

**Usage:**
```bash
bun tools/claude-md-sync/merge-claude-sections.ts preview
bun tools/claude-md-sync/merge-claude-sections.ts apply
bun tools/claude-md-sync/diff-claude-md.ts <upstream> <local>
```

**When to use:** Framework updates that modify CLAUDE.md while preserving user customizations

---

### Framework Cleanup

**Tool:** `cleanup`
**Path:** `tools/cleanup/`
**Capabilities:** `[file-cleanup]`

**What it does:**
- Remove backup files, OS artifacts (.DS_Store, Thumbs.db), and editor temporaries
- Clean empty cache directories
- Protection list prevents deletion of important files (.env.backup, .gitkeep)

**Key scripts:**
- `auto-cleanup.ts` -- Automated cleanup with dry-run, verbose, and protection modes

**Usage:**
```bash
bun tools/cleanup/auto-cleanup.ts --dry-run
bun tools/cleanup/auto-cleanup.ts
```

**When to use:** Pre-commit cleanup, repository hygiene, removing accumulated artifacts

---

### Git Hooks & Validation

**Tool:** `hooks`
**Path:** `tools/hooks/`
**Capabilities:** `[hook-generation]`

**What it does:**
- Generate pre-commit hooks
- Generate startup hooks
- Generate runtime validation hooks
- Hook scaffolding

**Files:**
- `generate-hook-scaffolds.py` - Generate hook templates

**Usage:**
```bash
python tools/hooks/generate-hook-scaffolds.py
```

**When to use:** Setting up git hooks, adding new validation hooks

---

### Documentation Generation

**Tool:** `docs`
**Path:** `tools/docs/`
**Capabilities:** `[doc-generation]`

**What it does:**
- Update CLAUDE.md
- Generate framework references
- Documentation compilation

**Files:**
- `update-reference.py` - Update reference docs

**Usage:**
```bash
python tools/docs/update-reference.py
```

**When to use:** After framework changes, documentation updates

---

### Markdown Parsing

**Tool:** `markdown`
**Path:** `tools/framework/markdown/`
**Capabilities:** `[markdown-parsing]` `[frontmatter-extraction]`

**What it does:**
- Parse markdown into named sections by heading level
- Extract YAML frontmatter between `---` delimiters
- Code-fence aware (ignores `##` inside code blocks)

**Key scripts:**
- `section-parser.ts` -- parseMarkdownSections() and extractFrontmatter() utilities

**Usage:**
```typescript
import { parseMarkdownSections, extractFrontmatter } from '@/tools/framework/markdown/section-parser';

const { frontmatter, sections } = parseMarkdownSections(content);
```

**When to use:** Any tool that needs to parse markdown content, extract sections, or read frontmatter

---

### Framework Migration

**Tool:** `migration`
**Path:** `tools/migration/`
**Capabilities:** `[framework-migration]`

**What it does:**
- Framework restructuring
- Data migration
- Backup/restore operations
- Archive management

**Files:**
- `rename-deep-dive-to-overview.ts` - Example migration

**Usage:**
```bash
bun tools/migration/<migration-script>.ts
```

**When to use:** Framework refactors, data migrations

---

### Git Workflow

**Tool:** `git`
**Path:** `tools/git/`
**Capabilities:** `[git-commit-push]` `[git-public-sync]`

**What it does:**
- Commit and push to private repo with credential scanning, cleanup, and pre-commit hooks
- Pull latest changes from private repo
- Sync classified files to public repo with triple verification and security scanning

**Key scripts:**
- `scripts/push/index.ts` -- 10-step private push orchestrator (cleanup, scan, audit, commit, push)
- `scripts/pull/index.ts` -- Pull with conflict reporting
- `scripts/public/index.ts` -- 12-step public sync (classification filter, transform, security scan)
- `scripts/setup.ts` -- Git workflow configuration

**Usage:**
```bash
bun tools/git/scripts/push/index.ts
bun tools/git/scripts/pull/index.ts
bun tools/git/scripts/public/index.ts
```

**When to use:** All git operations -- prefer these over raw git commands for safety guarantees

---

### Prompt Generation

**Tool:** `prompt-generators`
**Path:** `tools/prompt-generators/`
**Capabilities:** `[prompt-generation]` `[image-prompt-generation]` `[video-prompt-generation]`

**What it does:**
- Generate image prompts
- Generate video prompts
- Prompt optimization

**Files:**
- `image-generator.ts` - Generate image prompts
- `video-generator.ts` - Generate video prompts

**Usage:**
```bash
bun tools/prompt-generators/image-generator.ts <topic>
bun tools/prompt-generators/video-generator.ts <topic>
```

**When to use:**
- ✅ Generating hero images for blog posts
- ✅ Creating video prompts for content
- ❌ Don't use for actual image/video generation (use Grok Imagine)

---

### Code Generators

**Tool:** `generators`
**Path:** `tools/generators/`
**Capabilities:** `[routing-gate-generation]` `[workflow-prompt-generation]` `[workflow-validation]`

**What it does:**
- Generate routing gates for CLAUDE.md, agents, and skills
- Generate workflow/image/video/LLM prompts with generator-specific optimization
- Validate skill workflows against framework standards

**Key scripts:**
- `routing-gate-generator.ts` -- Generate and integrate routing gates (framework/agent/skill)
- `prompt-generator.ts` -- Universal prompt generator (workflow, image, video, LLM)
- `validate-workflow-standard.ts` -- Validate skill workflow compliance

**Usage:**
```bash
bun tools/generators/routing-gate-generator.ts --type skill --target skills/write/SKILL.md
bun tools/generators/prompt-generator.ts --type image --generator flux --idea "Concept"
bun tools/generators/validate-workflow-standard.ts write
```

**When to use:** Creating new skills, regenerating gates after changes, optimizing prompts for specific generators

---

### Document Export

**Tool:** `export`
**Path:** `tools/export/`
**Capabilities:** `[pdf-export]` `[docx-export]` `[pdf-split]`

**What it does:**
- Convert markdown/HTML documents to PDF format
- Convert markdown/HTML documents to DOCX (Word) format
- Split multi-page PDFs into individual page files

**Key scripts:**
- `export-pdf.ts` -- PDF export from markdown/HTML source
- `export-docx.ts` -- DOCX export from markdown/HTML source
- `pdf-splitter.ts` -- Split PDF by page into separate files

**Usage:**
```bash
bun tools/export/export-pdf.ts --input report.md --output report.pdf
bun tools/export/export-docx.ts --input report.md --output report.docx
bun tools/export/pdf-splitter.ts --input combined.pdf --output-dir ./pages/
```

**When to use:** Exporting client-ready deliverables (security reports, compliance documents)

---

### App Download

**Tool:** `app-downloader`
**Path:** `tools/app-downloader/`
**Capabilities:** `[app-download]`

**What it does:**
- Download APK files (Android)
- Download IPA files (iOS)
- App deployment utilities

**Files:**
- `download-apk.ts` - Download Android APK
- `download-ipa.ts` - Download iOS IPA
- `deploy.sh` - Deployment script

**Usage:**
```bash
bun tools/app-downloader/download-apk.ts <app-id>
bun tools/app-downloader/download-ipa.ts <app-id>
```

**When to use:** Mobile app analysis, security testing

---

### Framework Update

**Tool:** `framework-update`
**Path:** `tools/framework-update/`
**Capabilities:** `[framework-update]`

**What it does:**
- Update framework to latest version
- Preserve user customizations
- Sync from upstream

**Files:**
- `framework-update.py` - Update framework

**Usage:**
```bash
python tools/framework-update/framework-update.py
```

**When to use:** Updating framework from upstream repository

---

### Model Router

**Tool:** `model-router`
**Path:** `tools/model-router/`
**Capabilities:** `[llm-routing]`

**What it does:**
- Route security research queries to the optimal LLM (Claude or Grok) based on task type
- Build RSA-methodology prompts and execute via OpenRouter
- Six query types: CVE research, novel techniques, social research, exploitation, stuck mode, detection/defense

**Key scripts:**
- `model-router.ts` -- Query router, RSA prompt builder, and CLI entry point

**Usage:**
```bash
bun tools/model-router/model-router.ts \
  --query-type cve-research \
  --task "Find exploits for CVE-2024-12345" \
  --tech-stack "Next.js 14.0"
```

**When to use:** Security research phases that need intelligent model selection per query type

---

### Framework Monitor

**Tool:** `monitor`
**Path:** `tools/monitor/`
**Capabilities:** `[framework-monitoring]`

**What it does:**
- Real-time web dashboard for framework health, sessions, and activity tracking
- Session history with duration, skills used, and commands executed
- System health metrics (CPU, memory, disk, error rate)
- WebSocket-based live updates

**Key scripts:**
- `scripts/setup.ts` -- First-time setup
- `scripts/server.ts` -- Dashboard HTTP server with WebSocket
- `scripts/events.ts` -- Event system
- `scripts/watcher.ts` -- File system activity watcher

**Usage:**
```bash
bun tools/monitor/scripts/setup.ts
bun tools/monitor/scripts/server.ts
```

**When to use:** Monitoring framework activity, viewing session history, troubleshooting issues

---

### n8n

**Tool:** `n8n`
**Path:** `tools/n8n/`
**Capabilities:** `[n8n-setup]`

**What it does:**
- Validate n8n environment configuration (URL + API key) and test connectivity
- Check running n8n version against latest release for available updates

**Key scripts:**
- `setup.ts` -- Environment validation and connectivity test
- `check-update.ts` -- Version update checker

**Usage:**
```bash
bun tools/n8n/setup.ts
bun tools/n8n/check-update.ts
```

**When to use:** Setting up or managing a self-hosted n8n workflow automation instance

---

### PDF Extraction

**Tool:** `pdf`
**Path:** `tools/pdf/`
**Capabilities:** `[pdf-extraction]`

**What it does:**
- Extract text content from PDF files
- Read PDF document metadata (title, author, page count)
- Core PDF manipulation primitives (page access, document structure)

**Key scripts:**
- `extract.ts` -- Text and metadata extraction from PDF files
- `core.ts` -- Core PDF document handling and page access

**Usage:**
```typescript
import { extractText, extractMetadata } from '@/tools/pdf/extract';
import { openPDF } from '@/tools/pdf/core';

const text = await extractText('report.pdf');
const meta = await extractMetadata('report.pdf');
```

**When to use:** Ingesting PDF content for compliance analysis, reading security deliverables

---

### ISO PDF Extraction

**Tool:** `pdf-extract`
**Path:** `tools/pdf-extract/`
**Capabilities:** `[iso-pdf-extraction]`
**Language:** Python 3 (pdfplumber, PyMuPDF, click)

**What it does:**
- Extract structured sections, tables, and images from ISO standard PDFs
- Auto-generate `controls-draft.yaml` stubs from detected clauses and annex controls
- Merge multiple PDFs into one extraction (e.g., ISO 27001 split files)
- README fallback for standards without available PDFs

**Key scripts:**
- `extract.py` -- Main CLI with --pdf, --framework, --output, --merge flags
- `lib/text_extractor.py` -- pdfplumber text and table extraction, clause detection
- `lib/image_extractor.py` -- PyMuPDF image extraction (>5000px area filter)
- `lib/controls_drafter.py` -- controls-draft.yaml generation

**Usage:**
```bash
python tools/pdf-extract/extract.py \
  --pdf "path/to/ISO_standard.pdf" \
  --framework iso-42001 \
  --output standards/frameworks/iso/42001/docs/extracted/

# Merge split PDFs
python tools/pdf-extract/extract.py \
  --pdf part1.pdf --pdf part2.pdf \
  --framework iso-27001 \
  --output path/extracted/ --merge

# README fallback (no PDF)
python tools/pdf-extract/extract.py \
  --readme path/README.md \
  --framework iso-24028 \
  --output path/extracted/
```

**When to use:** ISO compliance framework documentation workflows — extracts raw content
for downstream compliance documentation agents to process.

---

### Repository Ingestion

**Tool:** `ingestion`
**Path:** `tools/ingestion/`
**Capabilities:** `[repo-ingestion]` `[framework-refresh]` `[reference-ingestion]`
**Source:** [coderamp-labs/gitingest](https://github.com/coderamp-labs/gitingest)

**What it does:**
- Ingest GitHub repositories into LLM-digestible text format using gitingest
- Refresh skill reference libraries with latest upstream content
- Generate metadata for ingested frameworks/resources
- Configuration-driven via YAML (no code changes to add new sources)

**Dependencies:** gitingest (`pipx install gitingest`), bun, yaml

**Files:**
- `framework-ingester.ts` - Main ingestion engine (FrameworkIngester class)
- `config-loader.ts` - YAML configuration management
- `types.ts` - TypeScript type definitions
- `README.md` - Full documentation

**Configurations:**
- `security-frameworks.yaml` - 25 security frameworks (OWASP, MITRE, NIST, CWE)
- `compliance-frameworks.yaml` - 24 compliance frameworks (NIST, CIS, FedRAMP, ISO)
- `learning-resources.yaml` - 6 mentorship resources (OSCP, CEH, CISSP prep)

**gitingest CLI reference:**
```
gitingest [OPTIONS] [SOURCE]

SOURCE: local path, GitHub URL, or GitHub subdirectory URL
  gitingest /path/to/repo
  gitingest https://github.com/user/repo
  gitingest https://github.com/user/repo/tree/main/src

Options:
  -o, --output TEXT           Output file path (default: digest.txt). Use '-' for stdout.
  -s, --max-size INTEGER      Max file size in bytes [default: 10485760]
  -i, --include-pattern TEXT  Shell-style patterns to include
  -e, --exclude-pattern TEXT  Shell-style patterns to exclude
  -b, --branch TEXT           Branch to clone and ingest
  -t, --token TEXT            GitHub PAT for private repos (or set GITHUB_TOKEN env var)
  --include-submodules        Include repo submodules
  --include-gitignored        Include files matched by .gitignore/.gitingestignore
```

**Usage:**
```bash
# Via skill wrappers (config-driven)
bun run skills/pentest/scripts/ingest-frameworks.ts --list
bun run skills/pentest/scripts/ingest-frameworks.ts --framework owasp-top10-web
bun run skills/pentest/scripts/ingest-frameworks.ts --all

bun run tools/standards/ingest-frameworks.ts --framework nist-oscal
bun run skills/mentorship/scripts/ingest-resources.ts --resource oscp-prep

# Direct gitingest for ad-hoc repos
gitingest https://github.com/org/repo -o output.txt
gitingest https://github.com/org/repo -o - | head -100   # stdout preview
gitingest https://github.com/org/repo -i "*.md" -o docs-only.txt
gitingest https://github.com/user/private-repo -t [insert token] -o output.txt
```

**When to use:**
- Refreshing skill reference libraries with latest upstream content
- Adding context to workflows from GitHub repositories
- Ingesting new frameworks/standards into skill knowledge bases
- Ad-hoc repo ingestion for research or analysis

---

### Report Generation (Quarto)

**Tool:** `quarto`
**Path:** `tools/quarto/`
**Capabilities:** `[quarto-render]` `[quarto-style]` `[report-generation]` `[template-scaffold]`

**What it does:**
- Render `.qmd` source files to HTML, PDF (Typst), and DOCX simultaneously
- Visual style editor with real-time preview (browser-based)
- Apply brand identity (`_brand.yml`) across all output formats
- Logo upload and management
- Theme selection (Bootstrap 5 presets + custom SCSS)
- Font configuration (base, headings, monospace)
- Color palette management with security/compliance/advisory domain palettes

**Dependencies:** Quarto 1.8.27+ (`/opt/quarto/bin`), Typst (bundled), Bun

**Files:**
- `scripts/render.ts` - Quarto render wrapper (HTML + PDF + DOCX)
- `scripts/style-editor.ts` - Bun HTTP server for visual style editor
- `scripts/create-template.ts` - Scaffold new report templates
- `web/index.html` - Style editor frontend UI
- `web/editor.js` - Real-time preview logic (CSS variable injection)

**Usage:**
```bash
# Render a report (all formats)
bun tools/quarto/scripts/render.ts <report.qmd>

# Launch visual style editor
bun tools/quarto/scripts/style-editor.ts
# Opens at http://localhost:3000

# Scaffold a new report template for a skill
bun tools/quarto/scripts/create-template.ts --skill <skill-name>
# Creates: skills/<skill>/templates/ with full _sections/ structure
```

**PATH requirement:** Typst must be in PATH for PDF rendering:
```bash
export PATH="/opt/quarto/bin/tools/x86_64:$PATH"
```

**When to use:**
- ✅ Generating client-ready reports (pentest, compliance, advisory)
- ✅ Customizing brand identity across all report formats
- ✅ Multi-format delivery from single source (`.qmd`)
- ❌ Don't use for simple markdown → HTML (Pandoc direct is faster)
- ❌ Don't use for non-document output (API responses, JSON)

**Brand config:** `_brand.yml` at framework root (auto-applied to all renders)

---

### Diagram Rendering (Mermaid)

**Tool:** `mermaid`
**Path:** `tools/mermaid/`
**Capabilities:** `[diagram-render]` `[svg-render]` `[mermaid-validate]`

**What it does:**
- Render Mermaid syntax to SVG string (in-process, no CLI)
- Render Mermaid syntax to PNG/PDF files (via mermaid-cli + Chromium)
- Validate Mermaid syntax without rendering (fast pre-flight check)

**Dependencies:** mermaid, @mermaid-js/mermaid-cli, Chromium (PNG/PDF only)

**Files:**
- `scripts/client.ts` — Public API exports (import surface for consumers)
- `scripts/render.ts` — SVG, PNG, PDF rendering with CLI entry point
- `scripts/validate.ts` — Syntax validation
- `scripts/types.ts` — TypeScript type definitions

**Usage:**
```typescript
import { renderSVG, renderPNG, renderPDF, validate } from '@/tools/mermaid/scripts/client';

// SVG (in-process, fast)
const svg = await renderSVG('graph TD\n  A --> B');

// PNG/PDF (file output, requires mermaid-cli)
await renderPNG('graph TD\n  A --> B', 'output/diagram.png');
await renderPDF('graph TD\n  A --> B', 'output/diagram.pdf');

// Validate only
const result = await validate('graph TD\n  A --> B');
```

**When to use:**
- ✅ Embedding diagrams in content (ghost-write, compliance reports)
- ✅ Architecture and flow diagrams in deliverables
- ✅ Pre-flight syntax validation before rendering
- ❌ Don't use for non-Mermaid diagram formats (PlantUML, Graphviz)

**Used by:** `skills/ghost/`, `standards/`, any documentation workflow
**Related tools:** `tools/quarto/` (can embed SVG in .qmd reports)

#### Visual Editor

The framework includes a Docker-based Mermaid Live Editor for visually creating diagrams.

- `/mermaid-editor-start` — Start Mermaid Live Editor on http://localhost:8080
- `/mermaid-editor-stop` — Stop the Mermaid Live Editor

Requires Docker. See `tools/mermaid/commands/` for details.

---

### Pentest Execution

**Tool:** `pentest`
**Path:** `tools/pentest/`
**Capabilities:** `[scope-validation]` `[tool-execution]` `[session-management]` `[audit-logging]`

**What it does:**
- Scope validation and authorization checking
- Tool execution via VPS/Docker containers
- Session management across engagement phases
- Audit logging for all security actions
- PoC test plan generation
- Screenshot capture and evidence collection

**Key scripts:**
- `scope-validator.ts` — Validates target is within authorized scope
- `tool-executor.ts` — Executes security tools via SSH/Docker
- `tool-registry.ts` — Tool catalog and domain mapping
- `session-manager.ts` — Phase progression and gate validation
- `audit-logger.ts` / `audit-wrapper.ts` — Complete audit trail
- `exec-utils.ts` — SSH command building, VPS connectivity
- `test-executor.ts` — Phase 5 test case execution engine

**Used by:** `skills/pentest/`, `skills/vuln-scan/`, `skills/seg-test/`
**Related tools:** `tools/framework/security/` (input validation), `tools/framework/utils/` (VPS configuration)

---

### Framework Utilities

**Tool:** `utils`
**Path:** `tools/utils/`
**Capabilities:** `[hook-sync]`

**What it does:**
- Synchronizes hook symlinks from project `hooks/` to `~/.claude/hooks/`
- Portable framework maintenance utility
- Creates and removes symlinks as needed

**Key scripts:**
- `sync-hooks.ts` -- Symlink synchronization utility

**Usage:**
```bash
# Create/update symlinks
bun run tools/utils/sync-hooks.ts

# Dry run (show what would happen)
bun run tools/utils/sync-hooks.ts --check
```

**When to use:**
- After cloning the framework (required for hooks to work)
- After pulling framework updates (new/modified hooks)
- If you see "Module not found hooks/..." errors

---

### Session Settings Toggle

**Tool:** `toggle`
**Path:** `tools/toggle/`
**Capabilities:** `[session-toggle, session-status, verbose-toggle]`

**What it does:**
- Enable/disable Claude Code session settings at runtime
- Toggle destructive commands (rm -rf, git reset --hard, etc.)
- Toggle verbose mode for detailed tool execution
- Persists settings in `.claude/settings.json`

**Key scripts:**
- `toggle.ts` -- Main toggle utility

**Usage:**
```bash
# Show current status
bun tools/toggle/toggle.ts

# Enable destructive commands
bun tools/toggle/toggle.ts destructive on

# Disable destructive commands
bun tools/toggle/toggle.ts destructive off

# Toggle verbose mode
bun tools/toggle/toggle.ts verbose on
```

**When to use:**
- When you need to allow destructive bash commands temporarily
- When debugging tool execution with verbose output
- Session settings persist across Claude Code restarts

---

### Bug Bounty Automation

**Tool:** `bug-bounty`
**Path:** `tools/bug-bounty/`
**Capabilities:** `[scope-parsing]` `[bounty-target-sync]` `[hackerone-api]`

**What it does:**
- Parse and validate bug bounty program scopes from public data
- Query targets from arkadiyt/bounty-targets-data repository
- HTTP header analysis for reconnaissance
- Framework ingestion for platform data

**Key scripts:**
- `bounty-scope-parser-public.ts` — Parse program scope from public data source
- `bounty-targets-sync.ts` — Sync targets to local engagement data
- `http-headers.ts` — HTTP header analysis utilities
- `ingest-frameworks.ts` — Bug bounty framework data ingestion

**Used by:** `skills/bug-bounty/`
**Data source:** `arkadiyt/bounty-targets-data` (public GitHub repository)

---

### Code Review Utilities

**Tool:** `code-review`
**Path:** `tools/code-review/`
**Capabilities:** `[poc-generation]` `[coverage-analysis]` `[standard-selection]`

**What it does:**
- Generate PoC exploit scripts from FINDING JSON templates
- Analyze code coverage against security standards
- Select applicable security standards (OWASP, CWE, ASVS) for review

**Key scripts:**
- `poc-generator.ts` — Template-based PoC generation from findings
- `coverage-analyzer.ts` — Coverage analysis against security frameworks
- `standard-selector.ts` — Detect applicable security standards for codebase

**Used by:** `skills/code-review/`
**Related tools:** `tools/nvd/` (CVE research during reviews)

---

### Security Validation

**Tool:** `security`
**Path:** `tools/framework/security/`
**Capabilities:** `[ssrf-protection]` `[input-validation]` `[content-sanitization]`

**What it does:**
- SSRF protection: block private IPs, metadata endpoints, dangerous protocols
- Prompt injection detection and command/path injection prevention
- Content sanitization for external sources (wrap in untrusted tags, remove injection patterns)
- Logging sanitization (redact API keys, passwords, tokens)

**Key scripts:**
- `input-validation.ts` -- validateUrl(), validatePrompt(), validatePath(), validateCommand()
- `content-sanitizer.ts` -- sanitizeUntrustedContent(), sanitizeWebSearchResults()

**Usage:**
```typescript
import { validateUrl, validatePrompt } from '@/tools/framework/security/input-validation';
import { sanitizeUntrustedContent } from '@/tools/framework/security/content-sanitizer';

const urlCheck = validateUrl('https://api.example.com/data');
const safe = sanitizeUntrustedContent(externalContent, { source: url });
```

**When to use:** Any code handling external URLs, user input, or untrusted content

---

### Standards Automation

**Tool:** `standards`
**Path:** `tools/standards/`
**Capabilities:** `[manifest-generation]` `[question-deduplication]`

**What it does:**
- Generate per-framework manifests for discovery
- Deduplicate questions within a framework's sections
- Framework data extraction and crosswalk generation
- Compliance setup and reference update utilities

**Key scripts:**
- `generate-manifest.ts` — Generate manifest.yaml for framework discovery
- `question-merger.ts` — Deduplicate questions within a single framework
- `extract-crosswalks.ts` — Extract crosswalk mappings between frameworks
- `clean-questions.ts` — Question quality cleanup
- `ingest-frameworks.ts` — Framework data ingestion

**Used by:** `skills/gap-analysis/`, `skills/risk-assess/`, `skills/harden/`, `skills/incident/`
**Related data:** `standards/frameworks/` (framework reference documents)

---

## Framework Libraries

Shared infrastructure libraries under `tools/framework/`. These are imported by other tools and skills, not invoked directly.

| Library | Path | Purpose |
|---------|------|---------|
| utils | `tools/framework/utils/` | Path resolution, env validation, VPS config, QA model, error sanitization, audit trail |
| sessions | `tools/framework/sessions/` | Session index, YAML parser, compliance analyzer, search, archive |
| manifest | `tools/framework/manifest/` | Framework manifest sync and validation |
| prompts | `tools/framework/prompts/` | Shared prompt library and rendering utilities |
| markdown | `tools/framework/markdown/` | Markdown section parsing, frontmatter extraction |
| security | `tools/framework/security/` | Input validation (URL, path, command), content sanitization, SSRF protection |
| env-sync | `tools/framework/env-sync/` | .env backup, diff, merge, parsing |
| automation | `tools/framework/automation/` | Browser automation (Puppeteer manager) |

**Usage:** Imported via `@/tools/framework/` path aliases:
```typescript
import { resolveFrameworkRoot } from '@/tools/framework/utils/path-resolution';
import { validateUrl } from '@/tools/framework/security/input-validation';
import { parseEnvFile } from '@/tools/framework/env-sync/parser-env';
import { parseSessionYaml } from '@/tools/framework/sessions/yaml-parser';
```

---

## API Clients

External service integrations, imported as libraries:

| Client | Path | Capabilities | Auth |
|--------|------|-------------|------|
| Context7 | `tools/context7/` | `[doc-search]` | API key |
| OpenRouter | `tools/openrouter/` | `[llm-chat]` | API key |
| NVD | `tools/nvd/` | `[cve-search]` | API key |
| Grok2API | `tools/grok2api/` | `[image-generation]` `[video-generation]` `[chat-generation]` `[prompt-provider]` `[image-editing]` `[voice-generation]` `[admin-api]` `[nsfw-control]` | SSO token |
| Deduplicator | `tools/deduplicator/` | `[result-deduplication]` | None |
| Model Ranker | `tools/model-ranker/` | `[model-ranking]` | API key |

**Usage:** These are imported as libraries:
```typescript
import { searchLibrary } from '@/tools/context7';
import { OpenRouterClient } from '@/tools/openrouter';
import { getTopModels, refreshRankings } from '@/tools/model-ranker/scripts/client';
```

---

## Skill-Specific Tools

Tools that belong to a single skill are in `skills/{skill}/scripts/`:

- **Ghost publishing:** `skills/ghost/scripts/`
- **Penetration testing:** `skills/pentest/scripts/`
- **Bug bounty:** `skills/bug-bounty/scripts/`
- **Code review:** `skills/code-review/scripts/`

**Discovery:** When working within a skill, agents read that skill's SKILL.md which lists available scripts.

---

## Tool Discovery Protocol

**For Agents:**

1. **User says:** "Validate the framework structure"
2. **Workflow says:** "Required capability: `framework-accuracy-audit`"
3. **Agent does:**
   - Reads `docs/catalogs/tool-catalog.md`
   - Searches for `[framework-accuracy-audit]`
   - Finds: Tool `validation`, Path `tools/validation/`
   - Reads `tools/validation/README.md` for specific script
   - Executes: `bun tools/validation/audit-framework-accuracy.ts`

**For Workflows:**

Never hardcode tool paths. Instead:

```markdown
## Step 3: Validate Structure

**Required capability:** `framework-accuracy-audit`

**What this does:** Runs framework health checks to verify structure integrity.

**Expected behavior:** Agent reads tool-catalog.md, finds validation tool, executes audit.
```

---

## Anti-Patterns

❌ **DON'T:** Hardcode tool paths in workflows
```markdown
Run: bun tools/validation/audit-framework-accuracy.ts
```

✅ **DO:** Reference capabilities
```markdown
Required capability: `framework-accuracy-audit`
```

---

❌ **DON'T:** Duplicate tool documentation in workflows
```markdown
The validation tool checks framework structure, validates routing gates, and audits skills...
```

✅ **DO:** Reference the tool by capability, let agents discover details
```markdown
Required capability: `framework-accuracy-audit`
(See tool-catalog.md for details)
```

---

❌ **DON'T:** Create skill-specific tools in `/tools`
```markdown
tools/ghost-publishing/publish-post.ts  # WRONG - belongs in skills/ghost/
```

✅ **DO:** Keep skill-specific tools in skill directories
```markdown
skills/ghost/scripts/publish-post.ts  # CORRECT
```

---

## Adding New Tools

**When adding a new tool:**

1. Create tool directory: `tools/{tool-name}/`
2. Add files (no subdirectories)
3. Create `README.md` with usage
4. Update this catalog with:
   - Capability tags (e.g., `[new-capability]`)
   - Tool path
   - Usage examples
   - When to use / when not to use
5. Add to Capability Index table

---

**Framework:** ▲ Intelligence Adjacent (IA)
**Version:** 2.5
**Last Updated:** 2026-03-02
