# Skills - Modular Capabilities

> Reference documentation for the skills/ subsystem.

**Purpose:** Self-contained skill modules with decision trees, workflows, and domain-specific expertise.

---

## Skill Architecture

**Skills contain:**
- `SKILL.md` - Main decision tree and routing logic
- `commands/` - Slash command definitions (symlinked to `/commands/`)
- `workflows/` - Step-by-step processes for specific tasks
- `docs/` - Reference documentation loaded on-demand
- `scripts/` - Executable tools (not loaded as context)
- `templates/` - Output and report templates

**All skills follow the Unified Phase Structure (UPS v2.0).**

---

## How Skills Work

**1. Agent routes to skill:**
```
# In security.md agent
"If task involves pentesting → Load skills/pentest/SKILL.md"
```

**2. Skill context loaded via hooks:**
```
# skill-loader.ts fires on PostToolUse
# Loads: agents/security.md + skills/pentest/SKILL.md
```

**3. Skill decision tree executes:**
```
Mode Detection → Load appropriate workflow → Execute steps → Return results
```

**4. Progressive disclosure:**
- SKILL.md loaded first (routing logic)
- Workflow files loaded when needed
- Reference materials loaded on-demand

---

## Skill Structure (UPS v2.0 Pattern)

```
skills/{name}/
├── SKILL.md              # Decision tree, routing logic
├── STATUS.md             # Development status
├── README.md             # Skill overview
├── commands/             # Slash command definitions
├── workflows/            # Step-by-step processes
├── docs/                 # Reference material (on-demand)
├── scripts/              # Executable tools
├── templates/            # Report/output templates
├── input/                # Input data
└── output/               # Engagement deliverables
```

**Key principle:** SKILL.md routes, workflows/ provide steps, docs/ provides detail, scripts/ execute actions.

---

## Available Skills

**See `docs/catalogs/commands.md` for the complete command reference with all slash commands.**

| Skill | Domain | Agent | Key Commands |
|-------|--------|-------|-------------|
| `advisory` | Security guidance and code review | advisor | `/advisory`, `/code-review` |
| `sec-review` | Architecture security review, threat modeling, security practices, patch management | security | `/sec-review` |
| `career` | Job search, resume analysis, interview prep | advisor | `/career`, `/career-search` |
| `clifton` | CliftonStrengths analysis and coaching | advisor | `/clifton` |
| `compliance` | Multi-framework compliance assessment (NIST, HIPAA, PCI-DSS) | legal | `/compliance`, `/risk-assess` |
| `create` | Interactive skill/tool creation wizard | — | `/create` |
| `ghost` | Blog writing, newsletters, research | writer | `/ghost-write`, `/ghost-newsletter`, `/ghost-research` |
| `mentorship` | Learning roadmaps, career progression | advisor | `/mentorship` |
| `security` | Penetration testing, vulnerability scanning, segmentation | security | `/pentest`, `/vuln-scan`, `/bug-bounty` |
| `write` | General content writing with 5-phase workflow | writer | `/write` |

---

## When to Create New Skills

**Create new skill when:**
- Domain expertise requires structured workflows
- Multiple related workflows share common patterns
- Reusable across different projects
- Has specialized tools/scripts

**DON'T create new skill for:**
- One-off tasks (use existing skill)
- Simple commands (create slash command instead)
- Variations of existing skills (extend existing skill)

**Use `/create` to scaffold new skills interactively.**

---

## Progressive Disclosure

**Load only what's needed:**

**Level 1:** SKILL.md (loaded when skill activated)
- Decision tree routing
- Mode detection
- Workflow references

**Level 2:** Workflows (loaded when phase begins)
- Specific task steps
- Execution sequence
- Deliverable templates

**Level 3:** Reference materials (loaded on-demand)
- Frameworks (PTES, OWASP, NIST)
- Methodologies (domain-specific)
- Standards (CIS benchmarks)

---

## References

**Templates:**
- `skills/create/templates/SKILL-TEMPLATE.md` - Skill structure template
- `/create` skill - Interactive skill creation

**Documentation:**
- `docs/guides/hierarchical-context-loading.md` - Progressive disclosure
- `docs/standards/agent-format-standards.md` - Related agent standards
- `docs/catalogs/commands.md` - Complete command reference
- `docs/catalogs/skills.md` - Skills catalog

---

**Skills:** See `ls skills/` for complete list
**Framework:** Intelligence Adjacent (IA) v2.4.0
