---
name: {name}-setup
description: Validate and configure {display-name} {tool|skill} environment
{tool|skill}: {name}
agent: {agent}
classification: {classification}
---

# /{name}-setup - Setup {display-name}

**Validate environment, dependencies, and credentials for the {display-name} {tool|skill}.**

> **Type:** Setup command

## Default Action

**Run validation first, then interactive setup if issues found:**

```bash
bun {tools|skills}/{name}/scripts/setup.ts validate
```

If validation fails, run the interactive wizard:

```bash
bun {tools|skills}/{name}/scripts/setup.ts
```

## Sub-commands

| Sub-command | Action |
|-------------|--------|
| *(default)* | Interactive setup wizard |
| `validate` | Quick check — exits 0 if configured |
| `test` | Test connectivity to external services |
| `configure` | Apply default configuration template to `.env` |

## Prerequisites

{PREREQUISITE_SECTION}

## Required Environment Keys

{REQUIRED_KEYS_TABLE}

## Troubleshooting

If setup fails:
1. Verify `.env` file exists at framework root
2. Check that required keys are present and non-empty
3. Run `bun {tools|skills}/{name}/scripts/setup.ts` for interactive diagnosis
4. See `{tools|skills}/{name}/README.md` for detailed documentation

## Related Commands

- `/{name}` commands — Requires setup to be complete first
