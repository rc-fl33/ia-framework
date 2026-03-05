---
type: guide
title: Getting Started with Intelligence Adjacent Framework
classification: public
version: 2
last_updated: 2026-02-17
audience: beginner
category: guides
---

# Getting Started with Intelligence Adjacent Framework

Welcome to Intelligence Adjacent (IA) Framework. This guide covers the fastest path to get running and common use case starting points.

**Full installation details:** The repository root contains a complete installation guide with platform-specific steps, WSL2 configuration, and troubleshooting.

---

## Prerequisites

Before starting, you need:

- **Operating System:** macOS, Linux, or Windows (WSL2 recommended)
- **Claude Code CLI:** [claude.ai/claude-code](https://claude.ai/claude-code) with a Claude Pro/Team subscription
- **Git:** For cloning and framework updates
- **Bun:** JavaScript runtime (`curl -fsSL https://bun.sh/install | bash`)

The prerequisite install scripts handle Bun, GitHub CLI, and git-lfs automatically — see platform setup below.

---

## Quick Start

### 1. Install Prerequisites

**Windows (WSL2) — run in PowerShell as Administrator:**

```powershell
# Step 1: Enable WSL2 (restarts your machine)
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/windows/01-install-wsl.ps1" -OutFile "$env:TEMP\01-install-wsl.ps1"; & "$env:TEMP\01-install-wsl.ps1"

# Step 2: After restart — install Ubuntu and configure WSL
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/windows/02-install-ubuntu-and-harden.ps1" -OutFile "$env:TEMP\02-install-ubuntu-and-harden.ps1"; & "$env:TEMP\02-install-ubuntu-and-harden.ps1"
```

**Step 3+ — switch to WSL/Ubuntu terminal:**

```bash
# Install git, bun, GitHub CLI, Claude Code inside WSL
curl -fsSL https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/linux/01-install-prerequisites.sh -o /tmp/01-install-prerequisites.sh && chmod +x /tmp/01-install-prerequisites.sh && /tmp/01-install-prerequisites.sh
```

**Linux:**

```bash
curl -fsSL https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/linux/01-install-prerequisites.sh -o /tmp/01-install-prerequisites.sh
chmod +x /tmp/01-install-prerequisites.sh
/tmp/01-install-prerequisites.sh
```

**macOS:**

```bash
curl -fsSL https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/macos/01-install-prerequisites.sh -o /tmp/01-install-prerequisites.sh
chmod +x /tmp/01-install-prerequisites.sh
/tmp/01-install-prerequisites.sh
```

### 2. Clone the Framework

```bash
git clone https://github.com/notchrisgroves/ia-framework.git ~/ia-framework
```

### 3. Run Setup

```bash
cd ~/ia-framework
claude
```

Once Claude Code is running, paste this prompt:

```
run the setup command from commands/setup.md
```

Setup creates symlinks, configures `.env`, installs dependencies, and runs a health check. It's idempotent — safe to re-run.

### 4. Start Using Skills

After setup, slash commands work in any Claude Code session:

```
/career       — Job analysis and market research
/pentest      — Penetration testing workflows
/compliance   — Multi-framework compliance assessment
/write        — Structured content writing (5-phase)
/advisory     — Security guidance and best practices
```

See `docs/catalogs/commands.md` for the full command list.

---

## Use Case Paths

### Security Professional

```
/pentest      — Full engagement workflow (Director/Mentor/Demo modes)
/vuln-scan    — Automated vulnerability scanning
/code-review  — OWASP/CWE-focused code review
/sec-review — STRIDE/PASTA threat modeling with security practices and patch management
/compliance   — NIST CSF, ISO 42001, and more
```

Skills output findings to `skills/[skill]/output/`. Scope and authorization are required for `/pentest` and `/vuln-scan`.

Configure OpenRouter API key in `.env` for multi-model QA pipelines:
```
OPENROUTER_API_KEY=[insert key]
```

### Developer / Contributor

Create a new skill:

```
/create
```

The interactive wizard guides you through naming, domain selection, and directory scaffolding. Skill docs go in `skills/[skill-name]/SKILL.md`.

Code standards:
- Functions ≤ 100 lines
- Bun for all scripts (not Node/npm)
- Absolute imports via tsconfig aliases (`@/tools`, `@/skills`, `@/hooks`)
- No hardcoded credentials — `.env` only

Submit PRs to [github.com/notchrisgroves/ia-framework](https://github.com/notchrisgroves/ia-framework).

### Content / Writing

```
/write        — 5-phase content workflow (research → draft → QA → visuals → output)
/ghost-write  — Blog post workflow with Ghost CMS publishing
/advisory     — Security guidance with framework references
```

Configure Ghost credentials in `.env` for direct publishing:
```
GHOST_URL=https://your-site.ghost.io
GHOST_ADMIN_API_KEY=[insert key]
```

---

## Updating the Framework

```bash
cd ~/ia-framework
git pull origin main
bun install
```

Or from within Claude Code:

```
/framework-update
```

---

## Troubleshooting

**Commands not working after setup?**
```bash
ls -la ~/.claude/commands  # Should be a symlink to ~/ia-framework/commands
```

If broken, re-run setup: `run the setup command from commands/setup.md`

**Full troubleshooting:** The repository's installation guide has a Troubleshooting section covering broken symlinks, WSL DNS issues, credential errors, and uninstallation.

**GitHub Issues:** [github.com/notchrisgroves/ia-framework/issues](https://github.com/notchrisgroves/ia-framework/issues)

---

**Version:** 2.0
**Last Updated:** 2026-02-17
**Framework:** Intelligence Adjacent (IA)
