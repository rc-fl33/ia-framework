# [Skill Name]

**[One-line description of what this skill does]**

---

## Problem

**What problem does this skill solve?**

[2-3 sentences describing the pain point or challenge this skill addresses. Be specific about who has this problem and why it matters.]

---

## Solution

**How does this skill solve it?**

[2-3 sentences describing the approach. Focus on the unique value - what makes this skill's approach effective?]

---

## Quick Start

```bash
# Primary command
/[command-name]

# With arguments
/[command-name] [typical-argument]

# Example
/[command-name] [real-world-example]
```

---

## Commands

| Command | Description | Effort |
|---------|-------------|--------|
| `/[command-1]` | [What it does] | STANDARD |
| `/[command-2]` | [What it does] | THOROUGH |

---

## Workflow Overview

```
[Phase 1 Name] → [Phase 2 Name] → [Phase 3 Name] → [Phase 4 Name] → [Phase 5 Name]
     │               │                │                │                │
     ▼               ▼                ▼                ▼                ▼
[Output 1]     [Output 2]        [Output 3]       [Output 4]       [Output 5]
```

**Phases:**
1. **[Phase 1]** - [Brief description]
2. **[Phase 2]** - [Brief description]
3. **[Phase 3]** - [Brief description]
4. **[Phase 4]** - [Brief description]
5. **[Phase 5]** - [Brief description]

---

## Output

**What you get:**

- `private/output/{skill-name}/[file-1]` - [Description]
- `private/output/{skill-name}/[file-2]` - [Description]
- `private/output/{skill-name}/[file-3]` - [Description]

---

## Requirements

**Before using this skill:**

- [ ] [Prerequisite 1 - e.g., input file exists]
- [ ] [Prerequisite 2 - e.g., API key configured]
- [ ] [Prerequisite 3 - e.g., agent available]

**Input location:** `input/[domain]/`

---

## Setup & Configuration

{{#if env_required}}
### Required Credentials

This skill requires the following API keys/credentials to function:

| Credential | Service | Instructions |
|-----------|---------|--------------|
| `{KEY_NAME_1}` | {Service 1} | [Setup Guide](../../private/docs/env-setup.md#service-1) |
| `{KEY_NAME_2}` | {Service 2} | [Setup Guide](../../private/docs/env-setup.md#service-2) |

### Environment Setup

1. **Get credentials** - Follow links in table above to obtain API keys
2. **Update `.env.structure.yaml`** - Add the section from `docs/ENV-SETUP.md`
3. **Update `.env`** - Add actual credential values:
   ```bash
   {KEY_NAME_1}=[insert key]
   {KEY_NAME_2}=your-token-here
   ```
4. **Verify** - Test that credentials load:
   ```bash
   source .env
   echo ${KEY_NAME_1}  # Should show your key value
   ```

**Security:** Never commit credentials to git. Keep `.env` file secure and only share with authorized team members.

See `../../../docs/standards/credential-handling-enforcement.md` for security best practices.

{{/if}}

---

## Agent

**Executed by:** `[agent-name]` agent

This skill requires the specialized context and capabilities of the [agent-name] agent. Base Claude will automatically delegate when this skill is invoked.

---

## Examples

### Example 1: [Use Case Name]

```bash
/[command] [example-input]
```

**Result:** [What the user gets]

### Example 2: [Use Case Name]

```bash
/[command] [example-input]
```

**Result:** [What the user gets]

---

## Related Skills

- `/[related-command-1]` - [Relationship to this skill]
- `/[related-command-2]` - [Relationship to this skill]

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| [Common issue 1] | [How to fix] |
| [Common issue 2] | [How to fix] |

---

**Version:** 1.0
**Last Updated:** YYYY-MM-DD
