---
name: code-review
type: utility
classification: public
description: Code security review utilities — PoC generation, coverage analysis, standard selection for OWASP/CWE assessments
version: 1.0
last_updated: 2026-02-17
env_required: false
commands: []
---

# Code Review Tool

**Purpose:** Code review automation utilities for security assessments. Supports PoC generation
from findings, coverage analysis against security frameworks, and security standard selection.

## Key Scripts

| Script | Purpose |
|--------|---------|
| `poc-generator.ts` | Generate proof-of-concept code from vulnerability findings |
| `coverage-analyzer.ts` | Analyze finding coverage against OWASP Top 10 / CWE Top 25 frameworks |
| `standard-selector.ts` | Select applicable security standards based on project context |

## Usage

These scripts are imported and used by `skills/code-review/` during the code security review workflow.
They may also be invoked directly from `skills/advisory/` when running in CODE-REVIEW mode.

```typescript
// Example: select standards for a project
import { selectStandards } from '@/tools/code-review/standard-selector';

// Example: analyze finding coverage
import { analyzeCoverage } from '@/tools/code-review/coverage-analyzer';

// Example: generate PoC from finding
import { generatePoC } from '@/tools/code-review/poc-generator';
```

## Related Tools

- `tools/nvd/` — CVE research and NVD API integration (used during Phase 1 intake research)
- `tools/research/` — Web research utilities for technology stack discovery

---
**Framework:** Intelligence Adjacent (IA)
