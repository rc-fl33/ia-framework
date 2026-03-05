---
name: command-name
description: Brief description (shown in command discovery)
agent: agent-name
skill: skill-name
---

# /command-name - Command Title

**⛔ STOP: Invoke the `agent-name` agent to execute this command. Do NOT execute directly.**

```
Task(subagent_type="agent-name", prompt="Skill: skill-name\n\nContext: {user request}\n\nOutput: output/engagements/skill-name/")
```

---

## Quick Start

```
/command-name
```

Brief description of what happens when command is invoked.

---

## When to Use

**Use /command-name when:**
- Use case 1
- Use case 2
- Use case 3

**Don't use if:** Alternative situation and what command to use instead

---

## Workflow

### Step 1: First Step Title

Description of what happens in this step.

**Input:** What user provides
**Output:** What gets created

### Step 2: Second Step Title

Description of next step.

### Step 3: Final Step Title

Description of completion step.

---

## Context Prompts

### Prompt Name

**Question:** "Question text displayed to user?"

**Options:**
- **Option 1** - Description of what this option does
- **Option 2** - Description of what this option does
- **Option 3** - Description of what this option does

**Default:** Recommended default option

---

## Validation

Before execution:

- [ ] Requirement 1 verified
- [ ] Requirement 2 verified
- [ ] Credential check passed

**Error Handling:**

```
Missing credential:
  -> Display: "Error message"
  -> Suggest: "How to fix"
  -> Options: [Retry] [Abort]
```

---

## Output Structure

```
output/engagements/skill-name/{client}-{YYYY-MM}/
├── file1.md
├── file2.md
└── subdirectory/
    └── file3.md
```

---

## Examples

**IMPORTANT: Conversational Style**

Slash commands use natural language, NOT CLI-style flags. Users describe what they want in plain English, and the workflow asks follow-up questions as needed.

**Correct:**
```
/policy I need NIST-based security policies for my small healthcare startup
/risk-assessment evaluate security for my 50-person SaaS company
/pentest test our customer portal at portal.example.com
```

**Incorrect (never use):**
```
/policy --framework NIST --organization "Acme" --size small
/risk-assessment --target "company" --scope full
```

### Example 1: Basic Usage

```
/command-name
User: "Brief conversational request describing what they need"

→ Agent routes to appropriate skill workflow
→ Workflow prompts for clarification
→ User provides context
→ Result: Description of output
```

### Example 2: With Context

```
/command-name I need [specific outcome] for [context]

→ Agent routes with provided context
→ Asks follow-up questions as needed
→ Result: Description of alternative output
```

---

## Related Commands

- `/related-1` - Brief description of relationship
- `/related-2` - Brief description of relationship

---

## Security

**Data Privacy:**
- What data stays local
- What goes external (if any)

**Authorization:**
- Required permissions or credentials

---

## Template Notes

**For commands WITH agent routing:**
1. Include `agent:` in frontmatter
2. Keep ⛔ blocking instruction at top
3. Hook `enforce-agent-routing.py` will enforce

**For commands WITHOUT agent routing (direct execution):**
1. Omit `agent:` from frontmatter
2. Remove ⛔ blocking instruction
3. Command executes directly

---

**Version:** 2.0
**Last Updated:** 2025-12-31
**Framework:** Intelligence Adjacent (IA)
