# Session Schema Definition

Framework session tracking with learning signals for file placement compliance monitoring.

---

## Session Structure (YAML)

```yaml
# Session Identification
id: YYYY-MM-DD-HHMM-{8-char-uuid}
claudeSessionId: {uuid}
date: YYYY-MM-DD
startedAt: ISO-8601 timestamp
endedAt: ISO-8601 timestamp
status: active|completed|archived

# Execution Context
cwd: {working-directory}
transcriptPath: {path-to-jsonl-transcript}

# File Tracking
filesRead:
  - {absolute-path}
  - ...
filesModified:
  - {absolute-path}
  - ...

# Git Integration
gitCommits:
  - {commit-hash}
  - ...

# Tool Usage Statistics
toolCalls:
  Bash: N
  Read: N
  Write: N
  Edit: N
  # ... other tools

# Work Tracking
objectives: []
decisions: []
ideas: []
tags:
  - {category}
  - ...

# Learning Signals (NEW)
learning_signals:
  file_placements:
    - path: {file-path}
      expected_location: {correct-directory}
      actual_location: {where-it-was}
      compliant: boolean
      corrected: boolean
  structure_violations:
    - rule: {DOCS-001|PRIV-001|...}
      file: {file-path}
      action: error|warning

# Metadata
duration_minutes: N
endReason: {completion-reason}
```

---

## Learning Signals Detail

### file_placements

Capture each file placement decision for compliance analysis:

```yaml
file_placements:
  - path: /home/groves/ia-framework-private/docs/new-standard.md
    expected_location: /docs/standards/
    actual_location: /docs/
    compliant: false
    corrected: true  # Was corrected before commit

  - path: /home/groves/ia-framework-private/private/input/pentest/targets.md
    expected_location: /private/input/pentest/
    actual_location: /private/input/pentest/
    compliant: true
    corrected: false
```

**Fields:**
- `path`: Absolute file path in repo
- `expected_location`: Per file-location-standards.md (the correct place)
- `actual_location`: Where file was initially created/found
- `compliant`: Boolean — was file placed correctly initially?
- `corrected`: Boolean — was violation caught and corrected before commit?

### structure_violations

Record validation errors caught by pre-commit hooks:

```yaml
structure_violations:
  - rule: DOCS-001
    file: /docs/new-standard.md
    action: error  # error = blocks commit, warning = allows with caution

  - rule: PRIV-001
    file: /private/docs/working-notes.md
    action: error

  - rule: SKILL-001
    file: /skills/pentest/output/findings.md
    action: error
```

**Violation Codes:**
- `DOCS-001`: Root files in /docs/ (must be in subdirs)
- `PRIV-001`: Root files in /private/docs/ (only active-tracker.md allowed)
- `BOOKS-001`: PDFs outside /private/books/
- `SKILL-001`: input/output dirs inside skills/
- `SYMLINK-001`: Regular dir where symlink expected

---

## Compliance Metrics (Derived)

From learning_signals, framework calculates:

```
Files Created This Session: N
├── Compliant (correct location): N (%X)
├── Non-compliant (corrected): N (%Y)
└── Non-compliant (not corrected): N (%Z)

Violations by Type:
├── DOCS-001: N occurrences
├── PRIV-001: N occurrences
├── SKILL-001: N occurrences
└── ...

Correction Rate: %X+%Y / (total files created)
```

---

## How Signals Are Captured

### During Execution

Agents/tools that create files log placement decisions:

```typescript
// When writing file
const placement = {
  path: absolutePath,
  expected_location: determineCorrectLocation(absolutePath),
  actual_location: dirname(absolutePath),
  compliant: expected_location === actual_location,
  corrected: false
};
```

### Before Commit

Pre-commit hook validates and updates:

```typescript
// If violation caught and fixed before commit
if (corrected) {
  signal.corrected = true;  // User moved file to correct location
}
```

### Session Recording

Session file captures signals at session end:

```yaml
learning_signals:
  file_placements:
    - ... # All files created this session
  structure_violations:
    - ... # All validation errors
```

---

## Analysis and Learning

Framework periodically analyzes learning_signals across all sessions:

```bash
# Which file placement errors occur most frequently?
grep -h "compliant: false" private/sessions/*.yaml | wc -l

# Which categories have correction rates < 80%?
# (indicates areas where guidance needs improvement)

# Are certain skills/agents more compliant than others?
# (suggests training needs)
```

This feeds back into:
- Documentation improvements (unclear guidance)
- Pre-commit hook refinements (catch new violation patterns)
- Agent training (specific areas of weakness)

---

## Migration for Existing Sessions

Add learning_signals section to existing session files:

```bash
# For sessions that need augmentation
sessions:
  - {session}.yaml
    # Add:
    learning_signals: {}  # Empty if not tracked during original session
```

New sessions automatically capture signals going forward.

---

## Reference

- **File Placement Standards:** `docs/standards/file-location-standards.md`
- **Pre-commit Hook:** `hooks/pre-commit/validate-file-placement.ts`
- **CLAUDE.md Decision Tree:** `CLAUDE.md` → "File Placement Decision Tree"

---

**Version:** 1.0
**Status:** Active (new schema extended 2026-02-17)
**Last Updated:** 2026-02-17
