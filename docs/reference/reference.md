---
type: hub
title: Reference Documentation Hub
classification: public
version: 1
last_updated: Mon Feb 02 2026 18:00:00 GMT-0600 (Central Standard Time)
audience: all
category: reference
---


# Reference Documentation Hub

Central navigation for all reference documentation, catalogs, and standardized resources. Use this hub to **look up facts** - commands, skills, tools, standards, and configuration requirements.

This hub organizes comprehensive catalogs and reference documents by category. You can find exactly what you're looking for without reading through guides or tutorials.

---

## Command Reference

Complete catalog of all slash commands and how they're routed to agents and skills.

| Resource | Purpose |
|----------|---------|
| **[commands.md](../catalogs/commands.md)** | All 62 slash commands with routing, classification, and output locations |

**Columns:** Command name, description, agent, skill, classification, output location

**Use this to:**
- Find the command for what you want to do
- Understand what skill handles a command
- Check if a command is public or private
- Find output file locations

---

## Skill Reference

Comprehensive reference for all skills in the framework.

| Resource | Purpose |
|----------|---------|
| **[skills.md](../catalogs/skills.md)** | All skills with descriptions, agents, effort levels, and integration status |

**Columns:** Skill name, description, agent, classification, effort, version

**Sections:**
- Skills by agent
- Skills by effort (Quick, Standard, Extended)
- Skills with external integrations
- Skill file structure standards
- Discovery methods

**Use this to:**
- Find skills by function or domain
- Check skill integration requirements
- Understand effort levels
- Find skill documentation

---

## Agent Reference

Comprehensive reference for all agents and routing logic.

| Resource | Purpose |
|----------|---------|
| **[agents.md](../catalogs/agents.md)** | All 5 agents with domains, capabilities, and commands |

**Sections:**
- Agent descriptions and capabilities
- Agent routing decision tree
- Skills per agent
- Commands per agent
- Model tier selection
- Common routing mistakes (anti-patterns)

**Use this to:**
- Understand agent domains
- Route requests to correct agent
- Check agent capabilities
- Learn routing logic

---

## Integration Reference

Complete catalog of external services and APIs used by the framework.

| Resource | Purpose |
|----------|---------|
| **[integrations.md](../catalogs/integrations.md)** | All 13 external service integrations with auth methods and setup |

**Integrations by Category:**
- Content Publishing (Ghost CMS, X/Twitter)
- AI Model Services (OpenRouter, Context7, Grok Imagine)
- Financial Services (Stripe, Cal.com, SimpleFIN, Twingate)
- Security & Bug Bounties (HackerOne, Intigriti, Bugcrowd)
- Vulnerability Data (NVD)

**Per Integration:**
- Status and auth method
- Environment variables
- Skills using it
- Setup guide location
- Features and integration points

**Use this to:**
- Understand required credentials
- Find setup guides
- Check integration status
- Troubleshoot auth issues

---

## Tool Reference

Complete reference for all available tools and capabilities.

| Resource | Purpose |
|----------|---------|
| **[tool-catalog.md](../catalogs/tool-catalog.md)** | All tools (API clients, utilities) with capability matrix |

**Tools Include:**
- OpenRouter (AI models)
- Context7 (research API)
- Grok Imagine (image generation)
- Ghost API (blog publishing)
- NVD API (vulnerability database)
- Payment processing (Stripe)
- And more...

**Use this to:**
- Find the right tool for a task
- Check tool availability
- Understand tool capabilities
- Find API documentation

---

## Standards & Best Practices

Standardized guidelines and conventions used throughout the framework.

### File & Organization Standards

| Standard | Purpose |
|----------|---------|
| **[File Location Standards](../standards/file-location-standards.md)** | Where to put each type of file (docs, skills, agents, etc.) |
| **Naming Conventions** | lowercase-hyphenated-names for files, snake_case for variables |
| **Directory Structure** | Standard layout for skills, agents, docs |

### Documentation Standards

| Standard | Purpose |
|----------|---------|
| **[Documentation Template](../templates/doc-template.md)** | Standard YAML frontmatter and structure for all docs |
| **[Agent Format Standards](../standards/agent-format-standards.md)** | Standard format for agent definition files (<200 lines) |
| **[Skill File Structure Standards](../standards/skill-file-structure-standards.md)** | Standard directory and file layout for all skills |

### Skill Development

| Standard | Purpose |
|----------|---------|
| **SKILL Template** | Template for creating new skills with proper structure |
| **Skill Classification** | Public vs private classifications and publishing process |

### Code Standards

| Standard | Purpose |
|----------|---------|
| **TypeScript Conventions** | Code style for skill scripts and API clients |
| **Error Handling** | Standardized error codes and recovery patterns |
| **Pre-commit Hooks** | Validation rules enforced before commits |

---

## Security Reference

Security-specific documentation and standards.

| Reference | Purpose |
|-----------|---------|
| **[Credential Protection](../standards/credential-protection.md)** | How credentials are stored and protected |
| **[Credential Handling Enforcement](../standards/credential-handling-enforcement.md)** | Multi-layer credential security validation |
| **API Security Guidelines** | Best practices for API integration security |

---

## Metadata Reference

Structured metadata used throughout the framework.

### YAML Frontmatter

All documentation files use consistent YAML frontmatter:

```yaml
---
type: documentation | guide | reference | troubleshooting | hub
title: Human-Readable Title
classification: public | private
version: 1.0
last_updated: 2026-02-03
audience: beginner | intermediate | advanced | all
category: architecture | guides | reference | troubleshooting | standards
related_docs:
  - path/to/related.md
---
```

### Skill Metadata

All SKILL.md files contain:

```yaml
---
name: skill-name
description: One-line description
agent: advisor | engineer | writer | security | legal
version: X.Y
classification: public | private
last_updated: 2026-02-03
effort_default: QUICK | STANDARD | EXTENDED | THOROUGH
env_required: true | false
env_keys: [ENV_VAR_1, ENV_VAR_2]
---
```

### Agent Metadata

All agent files contain:

```yaml
---
name: agent-name
description: Agent description
---
```

---

## Quick Lookup Tables

### Commands by Classification

**Public Commands (14):**
- Career: `/career`, `/clifton`, `/mentorship`
- Framework: `/create`, `/framework-update`, `/setup`
- Git: `/git-pull`, `/git-push`, `/git-public`
- Monitoring: `/monitor-start`, `/monitor-stop`

**Private Commands (47):**
- Security: `/pentest`, `/vuln-scan`, `/code-review`, `/sec-review`
- Content: `/write`, `/ghost`, `/newsletter`
- Compliance: `/compliance`
- And more...

### Skills by Effort

**Quick (3):** git, monitor
**Standard (16):** Most skills
**Extended (1):** security
**Thorough (1):** (future expansion)

### Agents by Domain

- **advisor:** Career, research, QA, personal development
- **engineer:** Infrastructure, automation, deployment
- **writer:** Content, documentation, publishing
- **security:** Offensive security, testing
- **legal:** Compliance, legal analysis

---

## Related Documentation

- **Getting Started:** `../guides/getting-started.md` - Onboarding paths
- **Architecture Hub:** `../architecture/architecture.md` - How the framework works
- **Guides Hub:** `../guides/guides.md` - Step-by-step tutorials
- **Master Index:** `../index.md` - All documentation

---

**Version:** 1.0
**Last Updated:** 2026-02-03
**Framework:** Intelligence Adjacent (IA)
