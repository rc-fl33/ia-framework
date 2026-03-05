# Documentation

**Reference material, templates, and guides.** If it's not executable code, it belongs in `/docs/`.

---

## Categories

| Category | Contains | Status |
|----------|----------|--------|
| `catalogs/` | Discovery indexes (tools, commands, skills, agents) | Active |
| `templates/` | Scaffolding for new skills, agents, commands, docs | Active |
| `prompts/` | Shared prompt library (generated, validated, domain) | Active |
| `guides/` | How-to guides, patterns, validation rules, configs | Active |
| `schemas/` | JSON schemas for validation | Active |
| `detection-rules/` | Security detection rules | Active |
| `migration-guides/` | Migration documentation | Active |

**Organized into subdirectories:** `standards/`, `guides/`, `architecture/`, `reference/`.

---

## Key Documents

| Document | Purpose |
|----------|---------|
| `guides/hierarchical-context-loading.md` | Progressive disclosure architecture |
| `architecture/agent-routing-architecture.md` | Agent routing patterns and decision trees |
| `standards/agent-format-standards.md` | Agent structure requirements |
| `standards/file-location-standards.md` | Where files belong in the framework |
| `standards/credential-handling-enforcement.md` | Multi-layer credential security |
| `standards/readme-maintenance-rules.md` | README constitutional principles |
| `standards/model-selection-matrix.md` | Model selection for agents and skills |

---

## Catalogs

The `catalogs/` directory provides discovery indexes:

| Catalog | Purpose |
|---------|---------|
| `commands.md` | Complete slash command reference |
| `tool-catalog.md` | All API clients and utilities |
| `skills.md` | Skills catalog |
| `agents.md` | Agent catalog |
| `integrations.md` | External service integrations |
| `tool-sources.md` | VPS security tool inventory |

---

## Templates

The `templates/` directory provides scaffolding:

- `agent-template.md` - Agent structure
- `SKILL-TEMPLATE.md` - Skill structure
- `command-template.md` - Command structure
- `doc-template.md` - Documentation structure
- `routing-gate-template.md` - Routing gate patterns

---

## Prompts

The `prompts/` directory contains shared prompts:

- `generated/` - Auto-generated prompts
- `validated/` - QA-validated prompts
- `ghost/` - Ghost blog-specific prompts
- `security/` - Security testing prompts

---

**Last Updated:** 2026-02-13
