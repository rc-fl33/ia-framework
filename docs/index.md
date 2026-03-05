---
type: hub
title: Intelligence Adjacent Framework - Master Documentation Index
classification: public
version: 1
last_updated: Mon Feb 02 2026 18:00:00 GMT-0600 (Central Standard Time)
audience: all
category: reference
---


# Intelligence Adjacent Framework

**Master Documentation Index**

Welcome to the Intelligence Adjacent (IA) Framework documentation. This is your master entry point to all documentation, guides, references, and resources.

---

## Quick Navigation

Choose what you're looking for:

### 🚀 **Getting Started?**
→ **[Getting Started Guide](./guides/getting-started.md)** (5-30 minutes)
- 4 onboarding paths depending on your role
- Prerequisites and installation
- First commands to try
- Troubleshooting

### 🏗️ **Want to Understand the Architecture?**
→ **[Architecture Hub](./architecture/architecture.md)** (Intermediate)
- How the framework is designed
- Routing and orchestration
- Model selection
- Validation systems

### 📚 **Need Step-by-Step Instructions?**
→ **[Guides Hub](./guides/guides.md)** (All levels)
- How-to tutorials
- Skill-specific guides
- Integration setup
- Troubleshooting

### 📖 **Need to Look Something Up?**
→ **[Reference Hub](./reference/reference.md)** (Quick lookup)
- Command catalog
- Skill catalog
- Agent catalog
- Integration catalog
- Standards and conventions

---

## Hub Pages Overview

| Hub | Purpose | Audience | Content Type |
|-----|---------|----------|--------------|
| **[Getting Started](./guides/getting-started.md)** | Multi-path onboarding | Beginners | Step-by-step |
| **[Architecture](./architecture/architecture.md)** | System design & internals | Developers | Technical |
| **[Guides](./guides/guides.md)** | Practical how-tos | All | Tutorials |
| **[Reference](./reference/reference.md)** | Catalogs & standards | All | Reference |

---

## Documentation by Role

### 👤 New Users
Start here if you're new to IA Framework:
1. **[Getting Started](./guides/getting-started.md)** - Choose your path (5-30 min)
2. **[Reference Hub](./reference/reference.md)** - Look up commands (quick lookup)
3. **[Guides Hub](./guides/guides.md)** - Learn specific workflows (tutorials)

**First actions:**
- Install: `npm install` then `npm run setup:hooks`
- Try: `claude /career`
- Explore: `claude --list` for all available commands

### 👨‍💻 Developers
Build with and extend the framework:
1. **[Getting Started - Path 2](GETTING-STARTED.md#path-2-developer-setup-30-minutes)** - Full dev setup
2. **[Architecture Hub](./architecture/architecture.md)** - Understand design
3. **[Guides Hub](./guides/guides.md)** - Creating skills and agents

**First actions:**
- Setup: `npm install --save-dev` + `npm run setup:hooks`
- Create: `npm run create`
- Test: `npm test`
- Read: `docs/templates/SKILL-TEMPLATE.md`

### 🔒 Security Professionals
Leverage security testing capabilities:
1. **[Getting Started - Path 3](GETTING-STARTED.md#path-3-security-professional-15-minutes)** - Security setup
2. **[Reference Hub](./reference/reference.md)** - Security commands
3. **[Guides Hub](./guides/guides.md)** - Security skill guides

**First actions:**
- Setup: Configure OpenRouter API key
- Test: `claude /pentest --mode=demo`
- Learn: Read `skills/pentest/SKILL.md`
- Deploy: `npm run deploy:security-vps` (for large scans)

### 🤝 Contributors
Improve the framework:
1. **[Getting Started - Path 4](GETTING-STARTED.md#path-4-from-source-advanced)** - Source setup
2. **[Architecture Hub](./architecture/architecture.md)** - Design principles
3. **[Reference Hub](./reference/reference.md)** - Standards

**First actions:**
- Clone: `git clone https://github.com/anthropics/ia-framework-public.git`
- Install: `npm install --save-dev`
- Test: `npm run test:watch`
- Read: `CONTRIBUTING.md`

---

## Complete Catalogs

### Command Catalog
**File:** `docs/catalogs/commands.md`
- 62 total commands (15 public, 47 private)
- Organized by agent and domain
- Includes classification and output locations

**Quick lookup:** [commands.md](../docs/catalogs/commands.md)

### Skills Catalog
**File:** `docs/catalogs/skills.md`
- 22 total skills (15 public, 7 private)
- Organized by agent, effort, and integration status
- Includes setup and usage information

**Quick lookup:** [skills.md](../docs/catalogs/skills.md)

### Agents Catalog
**File:** `docs/catalogs/agents.md`
- 5 specialized agents
- Complete capabilities and domain boundaries
- Routing logic and anti-patterns

**Quick lookup:** [agents.md](../docs/catalogs/agents.md)

### Integrations Catalog
**File:** `docs/catalogs/integrations.md`
- 13 external service integrations
- Setup guides and configuration
- Troubleshooting and best practices

**Quick lookup:** [integrations.md](../docs/catalogs/integrations.md)

### Tools Catalog
**File:** `docs/catalogs/tool-catalog.md`
- All API clients and utilities
- Capability matrix
- Integration status

**Quick lookup:** [tool-catalog.md](../docs/catalogs/tool-catalog.md)

---

## Browse by Topic

### Getting Started & Installation
- [Getting Started Guide](./guides/getting-started.md) - 4 onboarding paths
- [Installation & Setup](GETTING-STARTED.md#prerequisites-all-paths)
- [First Commands](GETTING-STARTED.md#path-1-quick-start-5-minutes)
- [Troubleshooting](GETTING-STARTED.md#troubleshooting)

### Architecture & Design
- [Architecture Hub](./architecture/architecture.md) - System design
- [Hierarchical Context Loading](./guides/hierarchical-context-loading.md)
- [Agent Routing Architecture](./architecture/agent-routing-architecture.md)

### Skills & Commands
- [Skills Catalog](../docs/catalogs/skills.md) - All skills reference
- [Commands Catalog](../docs/catalogs/commands.md) - All commands
- [Skills by Agent](../docs/catalogs/skills.md#skills-by-agent)
- [Commands by Classification](../docs/catalogs/commands.md#classification-summary)

### Agents & Routing
- [Agents Catalog](../docs/catalogs/agents.md) - All agents
- [Routing Decision Tree](../docs/catalogs/agents.md#agent-routing-decision-tree)
- [Agent Capabilities](../docs/catalogs/agents.md#detailed-agent-descriptions)
- [Common Routing Mistakes](../docs/catalogs/agents.md#anti-patterns-common-routing-mistakes)

### Security & Compliance
- **Security Commands:** `/pentest`, `/vuln-scan`, `/code-review`, `/sec-review`
- **Compliance Commands:** `/compliance`
- **Setup:** [Security Skill Guide](GUIDES.md#security-skills)

### Content Creation
- **Content Commands:** `/write`, `/ghost`, `/newsletter`, `/proposal`
- **Setup:** [Content Creation Guide](GUIDES.md#content-creation-skills)
- **Integration:** [Ghost Setup](GUIDES.md#integration-setup-guides)

### Personal Development
- **Career:** `/career`, `/clifton`, `/mentorship`
- **Setup:** [Career Guide](GUIDES.md#career-development-skills)

### Infrastructure & Automation
- **Operations:** `/workflow`, `/monitor`
- **Setup:** [Infrastructure Guide](GUIDES.md#infrastructure-skills)

### Integrations
- [Integrations Catalog](../docs/catalogs/integrations.md) - All services
- [Integration Setup Guides](GUIDES.md#integration-setup-guides)
- **Content:** Ghost, X/Twitter
- **AI:** OpenRouter, Context7, Grok Imagine
- **Finance:** Stripe, Cal.com, SimpleFIN
- **Security:** HackerOne, Intigriti, Bugcrowd

### Standards & Best Practices
- [File Location Standards](./standards/file-location-standards.md)
- [Agent Format Standards](./standards/agent-format-standards.md)
- [Skill File Structure](./standards/skill-file-structure-standards.md)
- [Documentation Template](../docs/templates/doc-template.md)

### Security & Credentials
- [Credential Protection](./standards/credential-protection.md)
- [Credential Handling Enforcement](./standards/credential-handling-enforcement.md)

---

## Common Tasks

### "I want to..."

**...execute a command**
1. Check [commands.md](../docs/catalogs/commands.md) for the command
2. Check classification (public or private)
3. Run: `claude [command]`
4. For details, read the skill docs at `skills/[skill-name]/SKILL.md`

**...set up an integration**
1. Check [integrations.md](../docs/catalogs/integrations.md)
2. Find your service and auth method
3. Follow setup guide (e.g., `skills/ghost/docs/adding-credentials.md`)
4. Add variables to `.env`
5. Test the integration

**...create a custom skill**
1. Run: `npm run create`
2. Follow the interactive wizard
3. Edit your new skill's SKILL.md
4. Add script logic to `scripts/index.ts`
5. Test with `claude /my-skill --mode=demo`
6. Submit PR to framework

**...understand routing logic**
1. Read [agents.md](./catalogs/agents.md) routing section
2. Check [Architecture Hub](./architecture/architecture.md) for detailed flow
3. Review specific agent docs at `agents/[agent-name].md`

**...find a command for something**
1. Search [commands.md](../docs/catalogs/commands.md)
2. Filter by classification (public/private)
3. Check the Skill and Agent columns
4. Read the skill docs for details

**...set up the framework from scratch**
1. Choose your path in [Getting Started](./guides/getting-started.md)
2. Follow installation steps
3. Run first command
4. Explore with `claude --list`

**...troubleshoot an issue**
1. Check [Troubleshooting](GETTING-STARTED.md#troubleshooting)
2. Run diagnostics: `npm run diagnose`
3. Check relevant skill logs
4. Review [API Error Catalog](./reference/api-error-catalog.md)

---

## Quick Reference

### Commands by Domain

**Career & Development**
- `/career` - Job analysis
- `/clifton` - Strengths assessment
- `/mentorship` - Learning roadmaps

**Content & Publishing**
- `/write` - Content writing
- `/ghost` - Blog publishing
- `/newsletter` - Newsletter automation
- `/proposal` - Proposal generation

**Security Testing**
- `/pentest` - Penetration testing
- `/vuln-scan` - Vulnerability scanning
- `/code-review` - Code security review
- `/sec-review` - Architecture security review
- `/compliance` - Compliance assessment

**Infrastructure**
- `/workflow` - Workflow automation (n8n)
- `/monitor` - Monitoring dashboard

**Social Media**
- `/x-engage` - X/Twitter engagement
- `/ghost-research` - Auto-publish research

### Agents

| Agent | Domain | Commands |
|-------|--------|----------|
| **advisor** | Career, research, QA | `/career`, `/clifton`, `/mentorship` |
| **engineer** | Infrastructure, automation | `/workflow`, `/monitor`, `/git-*` |
| **writer** | Content, documentation | `/write`, `/ghost`, `/newsletter` |
| **security** | Security testing | `/pentest`, `/vuln-scan`, `/code-review`, `/sec-review` |
| **legal** | Legal, compliance | `/compliance` |

---

## Framework Statistics

- **Skills:** Multiple specialized capabilities across 5 agent domains
- **Commands:** Comprehensive slash command reference in commands.md
- **Agents:** Five domain-specific agents (advisor, engineer, writer, security, legal)
- **Integrations:** External service integrations documented in integrations.md
- **Documentation:** Extensive architecture, guides, and reference materials
- **API Clients:** Multiple service integrations (OpenRouter, Context7, Ghost, Grok Imagine, Stripe, etc.)

---

## File Structure

```
ia-framework/
├── docs/
│   ├── index.md                           ← You are here
│   ├── standards/                         (Rules, standards, enforcement)
│   ├── guides/                            (How-to guides, getting started)
│   │   └── patterns/                      (Workflow patterns)
│   ├── architecture/                      (System design, routing)
│   └── reference/                         (API reference, catalogs)
├── docs/
│   ├── catalogs/
│   │   ├── commands.md                   (All commands)
│   │   ├── skills.md                     (All skills)
│   │   ├── agents.md                     (All agents)
│   │   ├── integrations.md               (All integrations)
│   │   └── tool-catalog.md               (All tools & APIs)
│   └── templates/
│       ├── doc-template.md               (Standard)
│       ├── SKILL-TEMPLATE.md             (Standard)
│       └── agent-template.md             (Standard)
├── tools/
│   ├── api/                              (API clients)
│   ├── export/                           (PDF/DOCX export)
│   └── framework/utils/                  (Path resolution, utilities)
├── agents/
│   ├── [Agent definitions with routing logic]
├── skills/
│   └── [Modular skills with SKILL.md, scripts/, docs/]
└── CLAUDE.md                             (Routing & orchestration)
```

---

## Getting Help

- **Bug Reports:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Documentation:** This site
- **Examples:** `output/` directories with real examples

---

**Version:** 1.0
**Last Updated:** 2026-02-03
**Framework:** Intelligence Adjacent (IA)

---

**Choose a path above and get started! 🚀**
