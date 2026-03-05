# When to Create a Skill

**Decision tree for choosing the right component type.**

---

## Quick Decision Matrix

| What You're Building | Create This | Location | Example |
|----------------------|-------------|----------|---------|
| User-invocable capability with 5+ phases | **Skill** | `skills/[name]/` | `/pentest`, `/career` |
| Simple automation script | **Tool** | `tools/[category]/` | `tools/validation/` |
| Entry point to existing skill | **Command** | `commands/[name].md` | `/git-push` |
| Specialized execution mode | **Agent** | `agents/[name].md` | `security`, `advisor` |
| Framework utility | **Tool** | `tools/` | `full-framework-audit.ts` |

---

## Create a Skill When...

### ✅ YES - Create Skill

1. **Multi-phase workflow** (3+ distinct phases)
   - Example: Research → Analysis → Report → Delivery
   - Counter-example: Single script that runs once

2. **Requires domain knowledge**
   - Needs reference documentation (docs/)
   - Has specialized expertise
   - Complex decision trees
   - Counter-example: Generic file operations

3. **Produces deliverables**
   - Generates reports, analyses, documents
   - Creates structured output
   - Multiple output formats
   - Counter-example: Just modifies existing files

4. **State management needed**
   - Tracks progress across phases
   - Maintains context between steps
   - User can pause/resume
   - Counter-example: Fire-and-forget operation

5. **External credentials required**
   - API authentication
   - Service integrations
   - Credential management
   - Counter-example: Local file operations only

6. **Reusable capability**
   - Will be invoked multiple times
   - User-facing feature
   - Part of core framework value
   - Counter-example: One-time migration script

---

## Create a Tool When...

### 🔧 YES - Create Tool

1. **Simple automation**
   - Single-purpose script
   - No phases needed
   - Example: `clean-temp-files.sh`

2. **Framework utility**
   - Supports framework operation
   - Internal use only
   - Example: `full-framework-audit.ts`

3. **Shared library**
   - Used by multiple skills
   - Common functionality
   - Example: `tools/api/openrouter/client.ts`

4. **Integration wrapper**
   - Wraps external service
   - Thin API layer
   - Example: `tools/api/context7/client.ts`

**Location:** `tools/[category]/[script]`

**No need for:**
- SKILL.md
- phases/
- commands/
- Full skill structure

---

## Create a Command When...

### 📝 YES - Create Command

1. **Entry point to existing skill**
   - Skill already exists
   - Just need user-invocable trigger
   - Example: `/git-push` → `tools/git/`

2. **Multiple entry points to same skill**
   - One skill, multiple commands
   - Different modes/workflows
   - Example: `/pentest`, `/vuln-scan`, `/seg-test` → `skills/pentest/`, `skills/vuln-scan/`, `skills/seg-test/`

3. **Alias or shortcut**
   - Simplified invocation
   - Common operation
   - Example: `/commit` → `tools/git/workflows/private-push.md`

**Location:** `skills/[skill]/commands/[command].md` (symlinked to `/commands/`)

**Requirements:**
- Parent skill must exist
- Command file defines routing
- Symlink in root `/commands/` for discovery

---

## Create an Agent When...

### 🤖 YES - Create Agent

1. **Specialized execution mode**
   - Distinct identity and constraints
   - Specific tool access
   - Example: `security` (testing focus), `advisor` (guidance focus)

2. **Domain-specific routing**
   - Handles multiple related skills
   - Consistent approach across skills
   - Example: `writer` (blog, docs, reports)

3. **Restricted permissions**
   - Limited tool access
   - Safety constraints
   - Example: `legal` (citation verification required)

**Location:** `agents/[name].md`

**Requirements:**
- <200 lines (strictly enforced)
- Routing rules for skills
- Clear identity and constraints

---

## Examples by Type

### Skill Examples

**Career Analysis** (`skills/career/`)
- Multi-phase: Research → Analysis → Strengths → Report
- Domain knowledge: OSINT, job markets, strengths frameworks
- Deliverables: Job analyses, career reports
- ✅ Correct choice: Full skill

**Ghost Publishing** (`skills/ghost/`)
- Multi-phase: Draft → Review → Publish → Monitor
- Credentials: Ghost Admin API
- Deliverables: Blog posts, newsletters
- ✅ Correct choice: Full skill

**Git Operations** (`tools/git/`)
- Multi-phase: Cleanup → Scan → Stage → Commit → Push
- Multiple commands: `/git-push`, `/git-pull`, `/git-public`
- ✅ Correct choice: Full skill with commands

---

### Tool Examples

**Framework Health Check** (`tools/validation/full-framework-audit.ts`)
- Single-purpose: Validate framework structure
- No phases needed
- Internal utility
- ✅ Correct choice: Tool

**OpenRouter API Client** (`tools/api/openrouter/client.ts`)
- Shared library used by multiple skills
- No user-facing workflow
- ✅ Correct choice: Shared API library

**Context7 Documentation** (`tools/api/context7/client.ts`)
- Integration wrapper for external service (TypeScript library)
- Used by multiple skills
- ✅ Correct choice: Shared library

---

### Command Examples

**`/create`**
- Entry point to create-skill skill (creates skills and tools)
- ✅ Correct choice: Command (with parent skill)

**`/git-push`**
- Entry point to git skill's push workflow
- ✅ Correct choice: Command (with parent skill)

**`/pentest`, `/vuln-scan`, `/seg-test`**
- Multiple entry points to security skill
- Different workflows, same skill
- ✅ Correct choice: Multiple commands, one skill

---

## Anti-Patterns

### ❌ WRONG: Creating skill for simple script

**Bad:**
```
skills/clean-temp-files/
├── SKILL.md
├── phases/
│   └── 01-clean.md
└── ...
```

**Good:**
```
tools/cleanup/clean-temp-files.sh
```

---

### ❌ WRONG: Creating skill without parent for command

**Bad:**
```
commands/quick-fix.md  # No parent skill exists
```

**Good:**
```
skills/maintenance/
├── commands/
│   └── quick-fix.md
...

commands/quick-fix.md → ../skills/maintenance/commands/quick-fix.md
```

---

### ❌ WRONG: Creating tool when multi-phase workflow needed

**Bad:**
```
tools/pentest/run-pentest.sh  # Complex workflow stuffed in script
```

**Good:**
```
skills/pentest/
├── SKILL.md
├── phases/
│   ├── 01-explore.md
│   ├── 02-plan.md
│   ├── 03-execute.md
│   ├── 04-qa.md
│   └── 05-commit.md
...
```

---

## Decision Flowchart

```
START: What am I building?
│
├─ Is it user-invocable with 5+ phases?
│  └─ YES → CREATE SKILL
│
├─ Does it need domain knowledge + deliverables?
│  └─ YES → CREATE SKILL
│
├─ Is it an entry point to existing skill?
│  └─ YES → CREATE COMMAND
│
├─ Is it a specialized execution mode?
│  └─ YES → CREATE AGENT
│
└─ Otherwise → CREATE TOOL
```

---

## Still Unsure?

**Ask these questions:**

1. **"Will users type a slash command?"**
   - YES → Skill (or Command if skill exists)
   - NO → Tool or internal script

2. **"Does it produce a deliverable document?"**
   - YES → Skill
   - NO → Tool

3. **"Does it have 3+ distinct execution phases?"**
   - YES → Skill
   - NO → Tool

4. **"Does it need to maintain state across steps?"**
   - YES → Skill
   - NO → Tool

5. **"Will it be reused more than 5 times?"**
   - YES → Consider skill
   - NO → Tool is fine

---

**Version:** 1.0
**Last Updated:** 2026-01-19
