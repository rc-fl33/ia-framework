---
name: setup
type: infrastructure
classification: public
description: Framework installation scripts - installs prerequisites, Docker, Bun, Git, and configures system
version: 1.0
last_updated: 2026-02-17
env_required: false
env_keys: []
commands: []
related_tools:
  - tools/validation
  - tools/framework-update
---

> **FOR AI AGENTS:** TypeScript utilities for framework installation and system setup.
> Load when: Installing the IA framework on a new system or troubleshooting installation issues.
> Note: User-facing platform scripts (Windows PS1, Linux/macOS bash) live in top-level `setup/`.

---

# Setup Tool

**TypeScript framework installation utilities**

TypeScript orchestrators that install framework prerequisites (Bun, Git, Docker) and configure the system for framework operation. User-facing platform scripts that users download via raw.githubusercontent.com URLs live in the top-level `setup/` directory (separate from this tool infrastructure).

---

## Classification

**Type:** infrastructure
**Visibility:** public
**Commands:** none

---

## Purpose

TypeScript orchestrators for installing the IA framework on a fresh system:

- **install-framework.ts** - Main installation orchestrator
- **bun-installer.ts** - Bun runtime installation
- **git-installer.ts** - Git configuration and setup
- **quarto-installer.ts** - Quarto CLI installation (document rendering)
- **platform-detector.ts** - Detects OS/platform (WSL, Linux, macOS)
- **system-deps-checker.ts** - Validates required dependencies
- **wsl-configurator.ts** - WSL-specific configuration
- **uninstall.ts** - Framework removal
- **99-cleanup.sh** - Post-install cleanup

**User-facing platform scripts** (not in this directory — see `setup/` at repo root):
- `setup/windows/` - PowerShell scripts for Windows WSL2 setup
- `setup/linux/` - Bash scripts for Linux prerequisites and Docker
- `setup/macos/` - Bash scripts for macOS prerequisites and Docker

---

## Usage

```bash
# Use TypeScript orchestrator (recommended)
bun tools/setup/install-framework.ts

# Validate installed dependencies
bun tools/setup/system-deps-checker.ts

# Uninstall framework
bun tools/setup/uninstall.ts

# Post-install cleanup
bash tools/setup/99-cleanup.sh
```

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

No direct TypeScript importers — invoked by users running platform installation scripts (tools/setup/linux/, tools/setup/macos/, tools/setup/windows/).

**Tools that call setup internally:**
- `tools/framework-update/` — calls system-deps-checker.ts to verify prerequisites before applying updates

---

## File Structure

```
tools/setup/                       # TypeScript framework utilities
├── install-framework.ts           # Installation orchestrator
├── bun-installer.ts               # Bun runtime setup
├── git-installer.ts               # Git configuration
├── quarto-installer.ts            # Quarto CLI setup
├── platform-detector.ts           # OS/platform detection
├── system-deps-checker.ts         # Dependency validation
├── wsl-configurator.ts            # WSL-specific setup
├── uninstall.ts                   # Framework removal
├── 99-cleanup.sh                  # Post-install cleanup
└── TOOL.md                        # This file

setup/                             # User-facing platform scripts
├── windows/
│   ├── 01-install-wsl.ps1         # Enable WSL2 features
│   ├── 02-install-ubuntu-and-harden.ps1  # Install Ubuntu + configure WSL
│   ├── 03-install-prerequisites.ps1      # Windows-native prerequisites
│   └── 04-install-docker.ps1      # Docker Desktop for Windows
├── linux/
│   ├── 01-install-prerequisites.sh  # git, bun, gh, Claude Code
│   ├── 02-install-docker.sh         # Docker Engine
│   └── 03-optimize-system.sh        # System tuning
└── macos/
    ├── 01-install-prerequisites.sh  # git, bun, gh via Homebrew
    └── 02-install-docker.sh         # Docker Desktop or Colima
```

---

## Platform Support

| Platform | Status |
|----------|--------|
| Ubuntu/Debian Linux | ✅ Full support |
| WSL2 (Windows) | ✅ Full support (wsl-configurator.ts) |
| macOS | ⚠️ Partial (no Docker script) |

---

## Related Tools

- **tools/validation** - Run after setup to verify installation
- **tools/framework-update** - Update framework after installation

---

**Framework:** Intelligence Adjacent (IA)
