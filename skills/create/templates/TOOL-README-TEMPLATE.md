# {tool-name} - Quick Start

> **Type:** Infrastructure tool (not a skill — operational lifecycle, not deliverable-producing phases)

**{description}**

---

## Quick Start

```bash
/{command-name}
```

---

## Overview

{description}

**What it does:**
- [Describe primary function]
- [Describe secondary function]
- [Describe tertiary function]

---

## Commands

| Command | Purpose | Pre-requisite |
|---------|---------|---------------|
| `/{command-name}` | Primary operation | [requirements] |

---

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/main.ts` | Primary implementation |

**Running scripts directly:**
```bash
bun tools/{tool-name}/scripts/main.ts
```

---

## Configuration

**Environment Variables (if applicable):**

| Variable | Required | Description |
|----------|----------|-------------|
| `EXAMPLE_KEY` | No | Example configuration |

**Setup:**
```bash
# Add to .env
EXAMPLE_KEY=your-value
```

---

## Directory Structure

```
tools/{tool-name}/
├── README.md             # This file
├── STATUS.md             # Development status
├── VERIFY.md             # Validation checklist
├── commands/             # Slash commands (optional)
│   └── {command-name}.md
├── scripts/              # Implementation
│   └── main.ts
├── docs/                 # Documentation (optional)
└── data/                 # Runtime data (optional, gitignored)
```

---

## Troubleshooting

**"Command not found"**
→ Run `bun tools/git/scripts/push/sync-symlinks.ts` to refresh symlinks

**"Missing configuration"**
→ Check `.env` file for required variables

---

**For complete documentation**, see `tools/{tool-name}/docs/`

**Version:** 1.0
**Last Updated:** {date}
