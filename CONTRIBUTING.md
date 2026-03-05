# Contributing to Intelligence Adjacent Framework

Thank you for your interest in contributing to the Intelligence Adjacent (IA) Framework. This document provides guidelines for contributing code, documentation, and new features.

## Quick Start

1. **Installation**: Run `/setup` for automated installation or see `README.md` for manual setup
2. **Health Check**: Validate your environment (required capability: `framework-accuracy-audit`)
3. **Read CLAUDE.md**: Understand the framework architecture and navigation
4. **Review SECURITY.md**: Familiarize yourself with security requirements before contributing

## Creating New Skills

Skills are modular capabilities that extend the framework. Each skill must:

- Follow the structure defined in `skills/create/templates/SKILL-TEMPLATE.md`
- Stay under 500 lines in the main SKILL.md file
- Include STATUS.md for tracking development progress
- Default to `classification: private` until approved for public release
- Use self-contained `input/` and `output/` directories for skill-specific data

**Automated Creation**: Use `/create` for interactive skill and tool scaffolding with proper structure validation.

**Directory Structure**:
```
skills/{skill-name}/
├── SKILL.md             (Skill definition - <500 lines)
├── STATUS.md            (Development tracking - REQUIRED)
├── commands/            (Symlinked to /commands/)
├── workflows/           (Phase-based execution)
├── docs/                (Domain knowledge)
├── scripts/             (TypeScript automation)
├── templates/           (Output templates)
├── input/               (User-provided resources - gitignored)
└── output/              (Generated deliverables - gitignored)
```

## Code Standards

**File Organization**:
- Skills: `skills/{skill-name}/` - Self-contained with all resources
- Agents: `agents/{agent-name}.md` - <200 lines, follows `docs/templates/agent-template.md`
- Tools: `tools/` (framework-core) or `skills/{skill}/scripts/` (skill-specific)
- Documentation: `docs/` for framework architecture

**TypeScript Standards**:
- Use Bun runtime for TypeScript execution
- Load credentials from `.env` ONLY - no hardcoded keys, no fallbacks
- Follow existing patterns in `skills/*/scripts/` for consistency
- Include clear error handling and validation

**Documentation Standards**:
- Never hardcode counts (e.g., "multiple tools", "various skills") - they become stale immediately
- Never include time estimates (e.g., "standard effort", "extended project") - use relative effort scale instead
- Use progressive disclosure - brief overview in main files, details in subdocuments
- Follow hierarchical context loading pattern (CLAUDE.md → SKILL.md → detailed docs)

## Security

Security is a first-class concern in the IA Framework. Before contributing:

1. **Read SECURITY.md** - Understand our security infrastructure and reporting procedures
2. **Never commit credentials** - Use `.env` for API keys, tokens, and sensitive data
3. **Test security scanning** - Ensure your changes don't bypass or break security checks
4. **Report vulnerabilities responsibly** - See SECURITY.md for disclosure policy

### Pre-Commit Security Checks

Your commits will be automatically scanned for:

- **Hardcoded credentials** - API keys, tokens, passwords, private keys
- **Forbidden files** - `.env`, `.pem`, credential files, private keys
- **TypeScript syntax errors** - Ensures all scripts compile correctly
- **Documentation standards** - Hardcoded counts, time estimates, forbidden patterns
- **File naming conventions** - Proper casing, no spaces
- **Skill structure** - Required files (STATUS.md, proper frontmatter)

If a check fails, fix the issue before committing. Only use `git commit --no-verify` for confirmed false positives, and document why in your commit message.

### Privacy Configuration

The framework includes privacy-first defaults:
- Telemetry disabled (`DISABLE_TELEMETRY=1`)
- Error reporting disabled (`DISABLE_ERROR_REPORTING=1`)
- Non-essential traffic blocked
- No training data collection

Privacy settings are validated during health checks and enforced at installation.

### Skill Classification

**All new skills default to `classification: private`** until explicitly approved for public release.

Before marking a skill as `classification: public`:
- [ ] Contains NO organization-specific workflows
- [ ] Contains NO proprietary methodologies
- [ ] Contains NO client-specific patterns
- [ ] Contains NO sensitive data or credentials
- [ ] Has been reviewed and approved for public release

Public skills are tracked via the `classification` field in each skill's SKILL.md frontmatter.

### Repository Safety

Before committing to any repository:
1. Run `git remote -v` to verify correct repository (private vs. public)
2. Review all staged changes carefully
3. Use `/git-push` for private repository (automated security scan)
4. Use `/git-public` for public repository (triple verification, enhanced security)
5. **CHECK THREE TIMES** before pushing to public repositories

## Testing

1. **Framework Health Check** (required capability: `framework-accuracy-audit`):
   - Required directories and files
   - Agent format compliance
   - Credential handling
   - Privacy settings
   - Dependency installation
   - TypeScript compilation

2. **Skill-Specific Tests**: If your skill includes automation scripts, test them in isolation:
   ```bash
   bun run skills/{skill-name}/scripts/{script-name}.ts
   ```

3. **Hook Testing**: Test pre-commit hooks manually:
   ```bash
   bun run hooks/pre-commit/{hook-name}.ts
   ```

## Before Committing

**Essential Checklist** (Do this before EVERY commit):

- [ ] **No backup files**: Check for `*.backup`, `*.bak`, `*.tmp`, `*~`, `*.swp`
- [ ] **No hardcoded credentials**: Ensure all API keys, tokens, and passwords use `.env`
- [ ] **Skill structure correct**: SKILL.md at skill root, not in `scripts/`
- [ ] **Output/Input at skill root**: Not nested in `scripts/` directory
- [ ] **No stray hidden directories**: Check for `.framework-staging`, `.build-cache`, etc.
- [ ] **No hardcoded counts**: Use "multiple", "various", "several" instead of numbers
- [ ] **File naming lowercase**: Documentation files use lowercase with hyphens
- [ ] **Run validators**:
  ```bash
  # Run full validation
  bun tools/validation/pre-commit-orchestrator.ts

  # Auto-cleanup (removes backups, temps, etc.)
  bun tools/cleanup/auto-cleanup.ts

  # Then commit
  git commit -m "..."
  ```

**File Organization Checklist**:

- [ ] **Backup files NOT committed**: Use `.gitignore` patterns or auto-cleanup
- [ ] **Skill structure correct**: See `docs/standards/file-location-standards.md` → Skill Directory Structure
- [ ] **Hidden directories whitelisted**: See `docs/standards/file-location-standards.md` → Hidden Directory Policy
- [ ] **No orphaned files**: See `docs/architecture/framework-validation-system.md` → Orphaned Files Validator

**References**:
- `docs/standards/file-location-standards.md` - Where different files belong
- `docs/architecture/framework-validation-system.md` - How validation works
- `.gitignore` - Patterns automatically ignored

---

## Pull Request Guidelines

1. **Fork and Branch**: Create a feature branch from `main`
2. **Follow Standards**: Adhere to code and documentation standards above
3. **Test Thoroughly**: Run health checks and skill-specific tests
4. **Security Scan**: Ensure pre-commit hooks pass without `--no-verify`
5. **Clear Description**: Explain what changes you made and why
6. **Link Issues**: Reference any related issues or feature requests

**Commit Message Format**:
```
<type>: <brief description>

<detailed explanation if needed>

Co-Authored-By: Your Name <your-email@example.com>
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

## Questions and Support

- **Framework Issues**: https://github.com/anthropics/claude-code/issues
- **Security Concerns**: See SECURITY.md for responsible disclosure
- **Documentation**: Start with `CLAUDE.md` for navigation
- **Architecture**: See `docs/` for detailed design documents

Thank you for contributing to Intelligence Adjacent!
