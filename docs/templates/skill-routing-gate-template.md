# Skill Routing Gate Template

**Purpose:** Template for skills/*/SKILL.md routing gates
**Generated:** Via tools/generators/routing-gate-generator.ts
**DO NOT EDIT MANUALLY**

---

## Template Variables

- `{skill_name}` - Skill name (from directory name)
- `{agent_name}` - Required agent (from frontmatter)
- `{skill_description}` - Brief skill description

---

## Template

```markdown
> **⛔ ROUTING GATE - READ THIS FIRST**
>
> **This skill requires the `{agent_name}` agent.**
>
> **Identity check:** If you are NOT the `{agent_name}` agent → STOP and delegate:
>
> ```typescript
> Task(subagent_type="{agent_name}", prompt="Execute {skill_name} skill. Request: {user_request}")
> ```
>
> **DO NOT:**
> - Read files beyond this SKILL.md
> - Search web or external resources
> - Create todos or project files
> - Execute workflows or scripts
> - Load other skills
>
> **STOP HERE. DELEGATE NOW.**
>
> **If you ARE the {agent_name} agent:**
> - ✅ Proceed to read this SKILL.md
> - ✅ Load workflow phases below
> - ✅ Execute with provided context
```

---

## Validation Requirements

**Must have:**
- Blockquote formatting (>)
- Emoji (⛔)
- Position: Lines 0-15 (before frontmatter)
- Required agent statement
- Identity check: "If you are NOT the X agent"
- Delegation code with exact Task() syntax
- Prohibition list (DO NOT)
- Double command: "STOP HERE. DELEGATE NOW"
- Permission to proceed if identity matches

**Language requirements:**
- Command verbs: STOP, DELEGATE
- Imperatives: DO NOT, MUST
- Identity check: conditional "If you are NOT"
- Code example with exact syntax
- Clear prohibition list

---

## Position Rules

**Routing gate MUST be:**
- Lines 0-15 of SKILL.md
- Before YAML frontmatter
- Before any descriptive content
- Before workflow phases
- Before documentation sections

**Format:**
```
[Routing Gate - Lines 0-15]

---

[YAML Frontmatter - Lines 16-30]

[Rest of SKILL.md content]
```

---

**Version:** 1.0.0
**Last Updated:** 2026-01-22
