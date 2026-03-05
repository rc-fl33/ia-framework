# Tools

**ALL functional code lives here.** Scripts, API clients, utilities, validators - if it executes, it's in `/tools/`.

---

## Standard Categories

| Category | Contains | Does NOT Contain |
|----------|----------|------------------|
| `api/` | External service API clients (importable modules) | Workflow logic, orchestration |
| `automation/` | Browser, scraping, VPS/SSH, screenshots, deployment | API clients, content workflows |
| `export/` | Format conversion (PDF, DOCX, image, video) | Content generation, workflows |
| `security/` | Validation, sanitization, audit, compliance, schemas | Application servers, content |
| `services/` | Application servers (notmint, monitor), databases | CLI scripts, utilities |
| `framework/` | Setup, env, validation, migration, generators, utils | Skill-specific tools |

---

## Directory Structure

```
tools/
├── api/                    # External service API clients
│   ├── ghost/              #   Ghost CMS Admin API
│   ├── twingate/           #   Twingate GraphQL API
│   ├── openrouter/         #   OpenRouter multi-model LLM
│   ├── grok/               #   Grok image/video/chat generation
│   ├── nvd/                #   NIST National Vulnerability Database
│   ├── context7/           #   Context7 documentation search
│   ├── model-ranker/       #   Model ranking
│   └── index.ts            #   Central exports
│
├── automation/             # Browser, scraping, VPS, SSH, deployment
│
├── export/                 # Document conversion and media
│
├── security/               # Validation, sanitization, audit, compliance
│
├── services/               # Application servers
│
└── framework/              # Setup, env, validation, migration, utilities
    ├── setup/              #   Installation, platform detection
    ├── env-sync/           #   .env management
    ├── validation/         #   Health checks, audits
    ├── sessions/           #   Session management
    ├── update/             #   Framework version updates
    ├── generators/         #   Catalog, prompt, routing gate generators
    ├── utils/              #   Path resolution, QA model config
    └── claude-md-sync/     #   CLAUDE.md merge/backup/rollback
```

---

## Additional Directories

These directories exist at the `/tools/` root level alongside the standard categories:

| Directory | Purpose |
|-----------|---------|
| `flux/` | X (Twitter) automation |
| `git/` | Git workflow utilities |
| `hooks/` | Hook generation tools |
| `ingestion/` | Data ingestion pipelines |
| `markdown/` | Markdown processing |
| `migration/` | Data migration scripts |
| `monitor/` | Monitoring dashboard |
| `n8n/` | n8n workflow integration |
| `notmint/` | Finance dashboard tools |
| `pdf/` | PDF processing |
| `prompt-generators/` | Prompt generation |
| `validation/` | Validation scripts |
| `video-analysis/` | Video analysis |
| `docs/` | Documentation generators |
| `app-downloader/` | Application download utilities |
| `deployment/` | Deployment scripts |
| `setup/` | Setup scripts |
| `manifest/` | Manifest tools |
| `framework-update/` | Framework update tools |

---

## Import Pattern

Skills import tools using `@/` path aliases:

```typescript
import { validateUrl } from '@/tools/security/input-validation';
import { GrokClient } from '@/tools/grok2api/client';
import { exportPdf } from '@/tools/export/export-pdf';
```

---

## Key Principle

**Methodology in /tools/, specific configuration in skills.**

Tools provide the baseline capability. Skills reference tools and define specific configurations for their workflows in SKILL.md.

---

**Last Updated:** 2026-02-13
