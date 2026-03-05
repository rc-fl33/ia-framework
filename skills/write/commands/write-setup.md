---
name: write-setup
description: Validate and configure content writing skill environment
skill: write
agent: base
classification: public
---

# /write-setup - Setup Write Skill

**Validate environment and credentials for the content writing skill.**

> **Type:** Setup command

## Default Action

**Run validation first, then interactive setup if issues found:**

```bash
bun skills/write/scripts/setup.ts validate
```

If validation fails, run the interactive wizard:

```bash
bun skills/write/scripts/setup.ts
```

## Sub-commands

| Sub-command | Action |
|-------------|--------|
| *(default)* | Interactive setup wizard |
| `validate` | Quick check — exits 0 if configured |
| `test` | Test OpenRouter API connectivity |
| `configure` | Apply default configuration template to `.env` |

## Prerequisites

- **OpenRouter account** — Sign up at [openrouter.ai](https://openrouter.ai) for multi-model access used in research and QA phases

## Required Environment Keys

| Key | Purpose | Where to Get |
|-----|---------|--------------|
| `OPENROUTER_API_KEY` | Multi-model API access for research and QA | [openrouter.ai/keys](https://openrouter.ai/keys) |

## Troubleshooting

If setup fails:
1. Verify `.env` file exists at framework root
2. Check that `OPENROUTER_API_KEY` is present and non-empty
3. Run `bun skills/write/scripts/setup.ts` for interactive diagnosis
4. See `skills/write/README.md` for detailed documentation

## Related Commands

- `/write` — Content writing command router
- `/write-research` — Topic discovery and research
