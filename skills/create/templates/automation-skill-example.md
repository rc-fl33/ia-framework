# Automation Skill Example

**Template output for automation-oriented skills.**

---

## Example: Git Operations Skill

### Skill Type
Automation & Integration

### Phase Pattern
CONFIGURE → CONNECT → EXECUTE → VERIFY → SYNC

---

## Directory Structure

```
tools/git/
├── SKILL.md                       # Skill definition
├── README.md                      # User documentation
├── STATUS.md                      # Implementation status
├── VERIFY.md                      # Validation checklist
├── commands/
│   ├── git-push.md                # /git-push command
│   ├── git-pull.md                # /git-pull command
│   └── git-public.md              # /git-public command
├── workflows/
│   ├── private-push.md            # Private repo workflow
│   ├── public-push.md             # Public repo workflow
│   └── pull.md                    # Pull workflow
├── scripts/
│   ├── setup.ts                   # Setup wizard
│   ├── push/
│   │   ├── index.ts               # Push orchestrator
│   │   ├── cleanup.ts             # Pre-sync cleanup
│   │   ├── security-scan.ts       # Credential scanning
│   │   └── update-session.ts      # Session tracking
│   ├── pull/
│   │   └── index.ts               # Pull orchestrator
│   └── public/
│       ├── index.ts               # Public sync orchestrator
│       ├── collect-public-files.ts
│       ├── clean-orphans.ts
│       ├── security-scan.ts
│       └── transform-claude-md.ts
├── docs/
│   └── (workflow documentation)
├── input/
│   └── .gitkeep
└── output/
    └── .gitkeep
```

---

## Characteristics

**Automation skills typically:**
- Integrate with external APIs/services
- Require credentials (setup.ts wizard)
- Have multiple operational modes (workflows/)
- Execute predefined sequences
- Focus on reliability over exploration
- Heavy use of scripts/

---

## Phase Breakdown

### Phase 1: CONFIGURE (Pre-flight)
- Verify environment variables set
- Check repository paths
- Validate remote connectivity
- Load configuration

### Phase 2: CONNECT (Connectivity Test)
- Test git remote access
- Verify GitHub authentication
- Check network connectivity
- Validate permissions

### Phase 3: EXECUTE (Main Operation)
- Run cleanup operations
- Execute security scans
- Stage and commit changes
- Push to remote

### Phase 4: VERIFY (Success Confirmation)
- Check git status
- Verify remote updated
- Validate commit hash
- Confirm no errors

### Phase 5: SYNC (Final Steps)
- Update session tracking
- Record operation in logs
- Report success/failure
- Cleanup temporary files

---

## Example Workflow File

**File:** `tools/git/workflows/private-push.md`

```markdown
# git-push Module

**Tier:** Feature
**Status:** Complete
**Version:** 2.1.0

---

## Pre-flight Checklist (MANDATORY)

**STOP! Before executing this module, you MUST complete this checklist:**

- [ ] I have read this MODULE.md completely
- [ ] I understand this is for PRIVATE repo only
- [ ] I will execute ALL 10 steps in order
- [ ] I will NOT skip security scan or cleanup phases

---

## Step 1: Pre-Flight Safety Checks (MANDATORY)

**Action:** Verify correct repository and branch BEFORE any operations.

**Commands:**
```bash
git remote -v
git branch --show-current
```

**Expected:**
- Remote: `origin` pointing to private repository
- Branch: `main`

---

## Step 2: Pre-Sync Cleanup (MANDATORY)

**Action:** Clean regenerable session data and stale files.

**Script:** `scripts/push/cleanup.ts`

**What gets cleaned:**
- `debug/` - Claude Code runtime debug
- `file-history/` - File change tracking
- `shell-snapshots/` - Command output captures

---

[... continues for all 10 steps]
```

---

## Example Script

**File:** `tools/git/scripts/push/security-scan.ts`

```typescript
#!/usr/bin/env bun
/**
 * Security Scanner - Detects hardcoded credentials before commit
 */

import { readFileSync } from 'fs';

interface ScanResult {
  success: boolean;
  violations: Violation[];
  warnings: Warning[];
}

interface Violation {
  file: string;
  line: number;
  pattern: string;
  severity: 'HIGH' | 'MEDIUM';
}

// Credential patterns
const PATTERNS = [
  {
    pattern: /GITHUB_TOKEN\s*=\s*[\"']?gh[ps]_[a-zA-Z0-9_]+/,
    name: 'GitHub token',
    severity: 'HIGH' as const
  },
  {
    pattern: /ANTHROPIC_API_KEY\s*=\s*[\"']?sk-ant-[a-zA-Z0-9_-]+/,
    name: 'Anthropic API key',
    severity: 'HIGH' as const
  }
];

export async function scanForCredentials(files: string[]): Promise<ScanResult> {
  const violations: Violation[] = [];

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { pattern, name, severity } of PATTERNS) {
        if (pattern.test(lines[i])) {
          violations.push({
            file,
            line: i + 1,
            pattern: name,
            severity
          });
        }
      }
    }
  }

  return {
    success: violations.length === 0,
    violations,
    warnings: []
  };
}
```

---

## Example Output (Session Log)

**File:** `sessions/2026-01-19-git-push.md`

```markdown
# Git Push Operation - 2026-01-19

## Summary
- **Status:** ✅ Success
- **Commit:** abc123def
- **Files:** 15 changed
- **Repository:** ia-framework-private
- **Remote:** origin/main

## Pre-flight Checks
✅ Repository: /home/user/.claude
✅ Remote: git@github.com:user/ia-framework-private.git
✅ Branch: main

## Cleanup
✅ Removed 150 debug files
✅ Removed 45 file-history entries
✅ Removed 12 shell-snapshots

## Security Scan
✅ No credentials detected
✅ Scanned 15 files

## Commit
✅ Staged 15 files
✅ Commit: abc123def
✅ Message: "feat: Add new skill structure"

## Push
✅ Pushed to origin/main
✅ Verified remote updated
```

---

## When to Use This Pattern

✅ Use for:
- Git operations
- API integrations (Ghost, n8n, etc.)
- File synchronization
- Database operations
- Deployment workflows
- Backup automation

❌ Don't use for:
- Research tasks (use research pattern)
- Security testing (use testing pattern)
- One-time scripts (use tools/)

---

**Version:** 1.0
**Last Updated:** 2026-01-19
