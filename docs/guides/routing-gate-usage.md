---
audience: intermediate
category: tools
---


# Routing Gate Generator & Validator Usage

**Status:** Production Ready
**Location:** `tools/generators/routing-gate-generator.ts`, `tools/validation/validate-routing-gates.ts`
**Created:** 2026-01-22

---

## Overview

The routing gate system ensures correct agent/skill delegation through:
1. **Visual patterns** - Blockquotes + emoji grab attention
2. **Language force** - Command verbs (STOP, DELEGATE) increase compliance
3. **Identity checks** - "You are X agent" prevents wrong execution
4. **Delegation examples** - Explicit Task() syntax for routing

**Components:**
- Generator: Creates gates from templates
- Validator: Ensures gates meet requirements
- Pre-commit hook: Automatic validation on commit

---

## Quick Start

### Generate All Gates

```bash
# Generate all 22 routing gates (framework + agents + skills)
bun run tools/generators/routing-gate-generator.ts --all
```

### Validate All Gates

```bash
# Validate all routing gates
bun run tools/validation/validate-routing-gates.ts --all
```

### Single File Operations

```bash
# Generate single gate
bun run tools/generators/routing-gate-generator.ts --type framework --target CLAUDE.md
bun run tools/generators/routing-gate-generator.ts --type agent --target agents/security.md
bun run tools/generators/routing-gate-generator.ts --type skill --target skills/pentest/SKILL.md

# Validate single gate
bun run tools/validation/validate-routing-gates.ts --file CLAUDE.md
```

---

## Generator Usage

### Command Syntax

```bash
bun run tools/generators/routing-gate-generator.ts [OPTIONS]

Options:
  --type <framework|agent|skill>   Type of routing gate
  --target <file>                  Target file path
  --all                           Generate all gates

Examples:
  # Framework gate (CLAUDE.md)
  bun run tools/generators/routing-gate-generator.ts --type framework --target CLAUDE.md

  # Agent gate
  bun run tools/generators/routing-gate-generator.ts --type agent --target agents/security.md

  # Skill gate
  bun run tools/generators/routing-gate-generator.ts --type skill --target skills/pentest/SKILL.md

  # All gates (batch)
  bun run tools/generators/routing-gate-generator.ts --all
```

### How It Works

1. **Loads template** from `docs/templates/`:
   - `framework-routing-gate-template.md` for CLAUDE.md
   - `agent-routing-gate-template.md` for agents/*.md
   - `skill-routing-gate-template.md` for skills/*/SKILL.md

2. **Gathers context** dynamically:
   - Framework: agents list, intent enrichment config
   - Agent: domain, tasks handled, skills list
   - Skill: required agent, description

3. **Replaces variables** in template:
   - `{agents_list}` → "security, writer, engineer, advisor, legal"
   - `{agent_name}` → "security"
   - `{skill_name}` → "security"

4. **Integrates into file**:
   - Reads existing file
   - Replaces lines 0-60 (up to first `---` separator)
   - Preserves remaining content

### Output

Generator creates gates with:
- Blockquote formatting (`>`)
- Attention emoji (⛔)
- Identity statements
- Delegation code examples
- Command language (STOP, DELEGATE, DO NOT)

---

## Validator Usage

### Command Syntax

```bash
bun run tools/validation/validate-routing-gates.ts [OPTIONS]

Options:
  --all              Validate all gates
  --file <path>      Validate single file

Exit codes:
  0 = All gates valid
  1 = Validation failed

Examples:
  # Validate all gates
  bun run tools/validation/validate-routing-gates.ts --all

  # Validate single file
  bun run tools/validation/validate-routing-gates.ts --file CLAUDE.md
```

### What It Validates

**Visual Pattern:**
- ✅ Blockquote formatting (`> `)
- ✅ Emoji present (⛔)
- ✅ Position (within first 60 lines)

**Language Force:**
- ✅ Required phrases: STOP, DELEGATE, DO NOT
- ✅ Identity check pattern (varies by type)

**Delegation Code:**
- ✅ Task() syntax present
- ✅ subagent_type parameter

**Structural Elements (type-specific):**
- Framework: intent enrichment, routing tree, agents list
- Agent: domain statement, identity verification, skills list
- Skill: required agent, identity conditional, prohibition list

### Validation Report

```
============================================================
Routing Gate Validation Report
============================================================

✓ CLAUDE.md
✓ agents/security.md
✗ agents/writer.md
  ERROR: Missing required phrase: "STOP"
  WARNING: Missing agents list

============================================================
Summary
============================================================
Total files: 3
✓ Valid: 2
✗ Invalid: 1
Errors: 1
Warnings: 1
```

---

## Pre-Commit Hook

### Automatic Validation

The pre-commit hook runs automatically on `git commit` and validates:
- CLAUDE.md (if modified)
- agents/*.md (if modified)
- skills/*/SKILL.md (if modified)

### Workflow

1. You commit changes:
   ```bash
   git add agents/security.md
   git commit -m "Update security agent"
   ```

2. Hook runs validation:
   ```
   [8/8] Validating routing gates...
      Found 1 file(s) to validate
   ✅ All routing gates valid!
   ```

3. Commit proceeds if valid, blocks if invalid:
   ```
   ❌ ROUTING GATE VALIDATION FAILED!

   Failed files (1):
     - agents/security.md

   To fix:
     1. Run: bun run tools/validation/validate-routing-gates.ts --all
     2. Review errors and regenerate gates if needed
   ```

### Bypass (Not Recommended)

```bash
git commit --no-verify
```

Only use when:
- Working on templates/rules themselves
- Debugging validation logic
- Emergency fixes (fix gates in next commit)

---

## Templates

### Location

`docs/templates/`:
- `framework-routing-gate-template.md`
- `agent-routing-gate-template.md`
- `skill-routing-gate-template.md`

### Editing Templates

1. Edit template in `docs/templates/`
2. Regenerate affected gates:
   ```bash
   # All gates
   bun run tools/generators/routing-gate-generator.ts --all

   # Or specific type
   bun run tools/generators/routing-gate-generator.ts --type agent --target agents/security.md
   ```
3. Validate:
   ```bash
   bun run tools/validation/validate-routing-gates.ts --all
   ```
4. Commit if valid

### Template Variables

**Framework:**
- `{agents_list}` - Comma-separated agent names
- `{intent_enrichment_enabled}` - true/false
- `{parallel_threshold}` - Number for parallel routing (default: 3)

**Agent:**
- `{agent_name}` - Agent identifier
- `{agent_domain}` - Domain description
- `{agent_tasks}` - What this agent handles
- `{agent_not_tasks}` - What this agent doesn't handle
- `{skills_list}` - Skills this agent can load

**Skill:**
- `{skill_name}` - Skill identifier
- `{agent_name}` - Required agent
- `{skill_description}` - Brief description

---

## Validation Rules

### Location

`docs/guides/validation-rules/routing-gate-rules.json`

### Rule Structure

```json
{
  "rules": {
    "routing_gate": {
      "visual_pattern": { ... },
      "language_force": { ... },
      "delegation_code": { ... },
      "structural_elements": { ... }
    }
  },
  "validation_levels": {
    "error": [ ... ],    // Blocks commit
    "warning": [ ... ],  // Alerts but allows
    "info": [ ... ]      // Informational
  }
}
```

### Editing Rules

1. Edit `routing-gate-rules.json`
2. Test with existing gates:
   ```bash
   bun run tools/validation/validate-routing-gates.ts --all
   ```
3. Adjust rules if too strict/lenient
4. Commit changes

---

## Common Workflows

### Adding New Agent

1. Create agent file: `agents/new-agent.md`
2. Generate gate:
   ```bash
   bun run tools/generators/routing-gate-generator.ts --type agent --target agents/new-agent.md
   ```
3. Validate:
   ```bash
   bun run tools/validation/validate-routing-gates.ts --file agents/new-agent.md
   ```
4. Commit (hook validates automatically)

### Adding New Skill

1. Create skill directory: `skills/{skill-name}/`
2. Create `SKILL.md` with frontmatter (specify `agent:`)
3. Generate gate:
   ```bash
   bun run tools/generators/routing-gate-generator.ts --type skill --target skills/{new-skill}/SKILL.md
   ```
4. Validate and commit

### Fixing Failed Validation

1. Check validation report:
   ```bash
   bun run tools/validation/validate-routing-gates.ts --file <file>
   ```

2. Option A: Regenerate gate
   ```bash
   bun run tools/generators/routing-gate-generator.ts --type <type> --target <file>
   ```

3. Option B: Manual fix
   - Edit file directly
   - Follow validation rules in `routing-gate-rules.json`
   - Revalidate

4. Commit when valid

### Updating All Gates After Template Change

```bash
# 1. Edit template
vim docs/templates/agent-routing-gate-template.md

# 2. Regenerate all
bun run tools/generators/routing-gate-generator.ts --all

# 3. Validate all
bun run tools/validation/validate-routing-gates.ts --all

# 4. Review changes
git diff

# 5. Commit if satisfied
git add -A
git commit -m "feat: Update routing gates with template changes"
```

---

## Troubleshooting

### "Missing required phrase: STOP"

**Cause:** Template doesn't include STOP command language

**Fix:**
1. Check template has STOP in uppercase
2. Regenerate gate from updated template

### "Missing delegation code"

**Cause:** No Task() syntax in gate

**Fix:**
1. Ensure template includes delegation example:
   ```typescript
   Task(subagent_type="...", prompt=...)
   ```
2. Regenerate

### "File not found" when generating

**Cause:** Target file path incorrect or file doesn't exist

**Fix:**
1. Verify file exists: `ls <file>`
2. Use correct path format:
   - Framework: `CLAUDE.md`
   - Agent: `agents/security.md`
   - Skill: `skills/pentest/SKILL.md`

### Pre-commit hook not running

**Cause:** Hook not installed or not executable

**Fix:**
```bash
# Check hook exists
ls -la .git/hooks/pre-commit

# Make executable if needed
chmod +x .git/hooks/pre-commit

# Test manually
.git/hooks/pre-commit
```

---

## Performance

**Generator:**
- Single gate: <100ms
- All 22 gates: <2s
- Cost: $0 (template-based, no API calls yet)

**Validator:**
- Single gate: <50ms
- All 22 gates: <500ms
- Exit immediately on first error

**Pre-commit hook:**
- Only validates modified files
- Adds ~100-500ms to commit time
- Skips if no routing gate files modified

---

## Future Enhancements

**Phase 4 (Planned):**
- Haiku integration for generation (external perspective)
- A/B testing of generated vs template gates
- Routing accuracy metrics tracking
- Auto-regenerate on template changes
- Multi-language support (translate gates)

**Measurement:**
- Current routing accuracy: ~80% (baseline)
- Target routing accuracy: 99%
- Metric: % of requests routed correctly first try

---

## References

- **Standard:** `docs/GENERATIVE-ROUTING-GATES-STANDARD.md`
- **Templates:** `docs/templates/*-routing-gate-template.md`
- **Rules:** `docs/guides/validation-rules/routing-gate-rules.json`
- **Generator:** `tools/generators/routing-gate-generator.ts`
- **Validator:** `tools/validation/validate-routing-gates.ts`
- **Hook:** `hooks/pre-commit/validate-routing-gates.ts`

---

**Version:** 1.0.0
**Last Updated:** 2026-01-22
**Status:** Production Ready
