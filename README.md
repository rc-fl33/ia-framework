# ▲ Intelligence Adjacent (IA) Framework

[![Security Policy](https://img.shields.io/badge/security-policy-blue.svg)](SECURITY.md)
[![Privacy First](https://img.shields.io/badge/privacy-first-green.svg)](SECURITY.md#privacy-configuration)

**Intelligence Adjacent (IA)** is a framework for building AI systems that work alongside human intelligence rather than attempting to replace it.

We believe that orchestration and scaffolding are more important than model intelligence. The goal is upgrading human capabilities, not automation.

---

## What is This?

The IA Framework is an extensible architecture for Claude Code that lets you teach Claude new capabilities through modular "skills." Instead of one-off prompts, you create reusable workflows that Claude can execute automatically.

**Think of it like plugins for Claude.** You define what Claude should know and how it should work, and the framework handles context loading, agent routing, and execution.

**Core principles:** Solve once/reuse forever, conversation-driven workflows, human augmentation

---

## Why Does This Exist?

**Problem:** AI assistants are powerful but one-dimensional. Every conversation starts from scratch. Complex workflows require repeating the same context over and over.

**Solution:** A framework that lets you encode domain knowledge, workflows, and automation into persistent "skills" that Claude loads on demand.

**Result:** Claude becomes more capable over time as you build skills tailored to your specific needs.

---

## Key Features

- **Extensible Skills System** - Add new capabilities to Claude through modular skills
- **Hierarchical Context Loading** - 50-70% token reduction through progressive disclosure
- **Agent Routing** - Claude automatically delegates complex work to specialized agents
- **Interactive Skill Builder** - Use `/create` to scaffold new skills and tools with guided prompts
- **Privacy-First Design** - Telemetry disabled, training opt-out, local-only by default

---

## Installation

**See [INSTALL.md](INSTALL.md) for complete installation instructions.**

The framework supports Windows (WSL2), Linux, and macOS with automated setup scripts.

---

## How It Works

**You ask → Claude routes → Skill executes → You get results**

### Architecture Overview

1. **CLAUDE.md** - Main navigation (~200 lines) - Claude reads this first, sees all available skills
2. **skills/{name}/SKILL.md** - Skill definition (500 lines max) - Claude loads this when skill is needed
3. **skills/{name}/docs/** - Deep reference - Claude reads only when specific details required

This hierarchical approach reduces token usage by 50-70% vs loading everything upfront.

### Skill Structure

Every skill follows the same structure:
```
skills/my-skill/
├── SKILL.md              # What this skill does and how to use it
├── STATUS.md             # Development status and changelog
├── commands/             # Slash commands (symlinked to /commands/)
├── workflows/            # Phase-based execution workflows
├── docs/                 # Deep reference documentation
├── scripts/              # TypeScript automation
└── templates/            # Output templates
```

Run `/create` and Claude scaffolds this structure for you.

---

## Usage Examples

### Creating New Skills

The core value of this framework is extending Claude with new capabilities:

```
You: "I need Claude to help me analyze network packet captures"

You: /create

Claude walks you through:
1. What domain? (Network Analysis)
2. What workflows? (PCAP analysis, protocol identification, anomaly detection)
3. What outputs? (Analysis reports, visualizations)
4. What agent? (advisor for research, security for testing)
5. Generates complete skill structure in skills/network-analysis/
```

**Result:** Claude now understands network analysis workflows and can execute them.

### Conversational Infrastructure Setup

Ask Claude to configure your environment:

```
"Set up a Docker container with Postgres and Redis"
"Configure my VPS with nginx and SSL certificates"
"Help me set up a development environment for Python"
```

Claude walks you through the setup conversationally, runs commands, and troubleshoots issues.

### Framework Commands

Core framework capabilities:

```
/create               # Build new skills and tools for Claude
/setup                # Framework installation and configuration
/framework-update     # Update while preserving customizations
```

**See `docs/catalogs/commands.md`** for all available commands. Custom commands are automatically added when you create new skills.


## What's Included

The framework includes skills for personal development, content creation, and infrastructure management. Skills are categorized as **public** (included in this repository) or **private** (demonstrating advanced patterns but not publicly distributed).

**The real value is building YOUR OWN skills for YOUR specific needs.** Use `/create` to build custom capabilities tailored to your workflows.

**Explore included skills:** Browse the `skills/` directory to see examples and get started.

---

## Security & Privacy

The IA Framework is built with security and privacy as first-class concerns.

### Privacy-First Design

The framework ships with privacy-first defaults:

- **Telemetry disabled** - No usage tracking sent to external services
- **Error reporting disabled** - Crash reports stay local
- **Training opt-out** - Your data is never used for model training
- **Non-essential traffic blocked** - Only essential API calls allowed

Privacy settings are automatically configured during setup and validated by health checks.

**Important:** Privacy configuration in the framework only affects Claude Code (CLI tool). To prevent your conversations from being used for model training, you must also disable training at [claude.ai/settings → Data & Privacy](https://claude.ai/settings).

### Credential Security

All API keys, tokens, and credentials are:

- Stored in `.env` files (gitignored, never committed)
- Loaded at runtime only (no hardcoded values)
- Validated by pre-commit hooks (blocks accidental commits)
- Scanned automatically before git push
- Protected by multi-layer hooks that prevent exposure

**Template:** See `.env.example` for required credentials format.

**Getting Started with Credentials:**

1. Copy `.env.example` to `.env`
2. Fill in values for services you plan to use (optional at first)
3. The framework will show warnings for unconfigured optional services
4. Claude can read and help with `.env.example` template files during setup

**Security Layers:**
- Layer 1: AI instructions prohibit credential access
- Layer 2: `credential-guardian.ts` hook blocks reading production `.env` files
- Layer 3: Pre-commit hooks prevent committing credentials to git

For complete security documentation, see [SECURITY.md](SECURITY.md).

### Automated Security Scanning

Every commit is automatically scanned for:

- **Hardcoded credentials** - API keys, tokens, passwords
- **Forbidden files** - `.env`, `.pem`, private keys
- **Code quality** - TypeScript syntax, documentation standards
- **Skill structure** - Required files, proper classification

Pre-commit hooks block dangerous commits. Only bypass with `--no-verify` for confirmed false positives.

### Repository Protection

The framework enforces strict separation between private and public content:

- **`/git-push`** - Private repository with automated security scan
- **`/git-public`** - Public repository with triple verification, no override
- **Classification system** - Skills default to `private` until approved for public release

Run `git remote -v` before every commit to verify correct repository target.

### Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** open a public GitHub issue
2. Email security details to the maintainer (see SECURITY.md)
3. Include: Description, impact assessment, reproduction steps, suggested fix (if any)
4. Expect response within 48 hours

See [SECURITY.md](SECURITY.md) for complete security documentation.

---

## Documentation

- **[INSTALL.md](INSTALL.md)** - Installation guide for all platforms
- **[SECURITY.md](SECURITY.md)** - Security policy and incident response
- **[CLAUDE.md](CLAUDE.md)** - Framework navigation and skill catalog
- **[docs/](docs/)** - Architecture, standards, and design docs
- **[skills/{name}/SKILL.md](skills/)** - Individual skill documentation

---

## Contributing

Contributions welcome! See `CONTRIBUTING.md` for guidelines.

---

## Acknowledgments

Built on [Claude Code](https://claude.com/code) by Anthropic.

---

## License

MIT License - See LICENSE file for details.

---

**Philosophy:** You talk, Claude works, results delivered.
