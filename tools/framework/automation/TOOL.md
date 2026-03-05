---
name: automation
type: utility
classification: public
description: Playwright browser automation - singleton browser manager for scraper performance
version: 1.0
last_updated: 2026-02-17
env_required: false
env_keys: []
commands: []
related_tools:
  - tools/monitor
---

> **FOR AI AGENTS:** Playwright browser lifecycle management for web scraping and automation.
> Load when: A tool needs browser automation or scraping and asks about BrowserManager.

---

# Automation Tool

**Playwright browser singleton for reusable browser context management**

Provides a `BrowserManager` class that maintains a single Chromium browser instance across multiple scrapers, avoiding the overhead of launching a new browser per request.

---

## Classification

**Type:** utility
**Visibility:** public
**Commands:** none (library, not standalone)

---

## Purpose

Manages Playwright browser lifecycle for web automation tasks:

- **Singleton pattern** - One browser instance reused across all scrapers
- **Context isolation** - Named browser contexts per scraper (no state leakage)
- **Lifecycle management** - Controlled startup/shutdown
- **Performance** - Avoids cold-start cost of launching browser per operation

**Why it exists:** Web scraping tools need to handle multiple requests efficiently. Launching a new browser per request is slow. `BrowserManager` reuses a single Chromium instance with isolated contexts per scraper to reduce overhead.

---

## Usage

```typescript
import { BrowserManager } from '@/tools/automation/browser-manager';

const manager = BrowserManager.getInstance();
const context = await manager.getContext('my-scraper');
const page = await context.newPage();

// Use page...
await page.goto('https://example.com');

// Cleanup when done
await manager.closeContext('my-scraper');
await manager.close();
```

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Tools:**
- Any tool requiring web scraping via Playwright

No direct TypeScript importers from hooks or skills — utilities use this library directly.

---

## File Structure

```
tools/automation/
├── browser-manager.ts    # Singleton Playwright browser manager
└── TOOL.md               # This file
```

---

## Dependencies

**Runtime:**
- Bun
- playwright (`chromium`)

**Used By:**
- Any tool requiring web scraping via Playwright

---

## Related Tools

- **tools/monitor** - May use for monitoring page checks

---

**Framework:** Intelligence Adjacent (IA)
