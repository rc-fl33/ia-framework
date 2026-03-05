---
name: n8n
type: infrastructure
classification: public
description: n8n workflow automation setup and update checking - configure and manage your own self-hosted n8n instance
version: 1.0
last_updated: 2026-02-17
env_required: true
env_keys:
  - N8N_URL
  - N8N_API_KEY
commands: []
related_tools:
  - tools/monitor
---

> **FOR AI AGENTS:** n8n instance setup, validation, and update checking.
> Load when: Setting up or checking the status of YOUR OWN n8n workflow automation instance.

---

# n8n Tool

**Setup and management utilities for your self-hosted n8n workflow automation instance**

Validates your n8n environment configuration, tests connectivity to your instance, and checks for available n8n version updates. Works with any self-hosted n8n deployment.

This tool contains **no access to anyone's workflows or data** — it only reads the URL and API key you provide in your own `.env`.

---

## Classification

**Type:** infrastructure
**Visibility:** public
**Commands:** none

**Why Public:**
- Generic n8n management utilities — works with any n8n instance
- No private workflows or data embedded
- Useful to any framework user running their own n8n instance
- All connection details come from your own `.env`

---

## Purpose

Two utilities for n8n instance management:

1. **setup.ts** - Validates your n8n environment (URL + API key), tests connectivity, guides initial configuration
2. **check-update.ts** - Compares your running n8n version against the latest release, reports if an update is available

---

## Setup

```bash
# Add your n8n instance details to .env
N8N_URL=https://your-n8n.example.com    # YOUR n8n instance URL
N8N_API_KEY=your-api-key                # YOUR n8n API key

# Validate your setup
bun tools/n8n/setup.ts

# Check if an update is available
bun tools/n8n/check-update.ts
```

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

No direct importers — invoked directly via CLI for instance setup and health checks. No other framework tools depend on this utility.

---

## File Structure

```
tools/n8n/
├── setup.ts          # Environment validation and connectivity test
├── check-update.ts   # Version update checker
└── TOOL.md           # This file
```

---

## Related Tools

- **tools/monitor** - Monitors your n8n instance health alongside other services

---

**Framework:** Intelligence Adjacent (IA)
