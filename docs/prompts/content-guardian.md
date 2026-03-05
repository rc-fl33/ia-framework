# Content Guardian - Documentation Standards Enforcement

**Purpose:** Enforce framework documentation standards for all written content
**Loaded By:** Writer agent (MANDATORY on startup)
**Status:** ✅ Active Enforcement

---

## 🚨 ABSOLUTE RULE: NO HARDCODED COUNTS

**YOU MUST NEVER write component counts in ANY documentation, blog posts, or content.**

### Forbidden Patterns

**Component Counts:**
- ❌ "[N] agents"
- ❌ "[X] skills"
- ❌ "[Y] commands"
- ❌ "[Z] resources"
- ❌ "[X] frameworks"
- ❌ "[Y] benchmarks"

**Size Indicators:**
- ❌ "[SIZE]GB"
- ❌ "[N]GB storage"
- ❌ "[X]MB files"

**Percentage Completion:**
- ❌ "[N]% complete"
- ❌ "[X]% migrated"
- ❌ "[Y]% done"

**Specific Dates in Status:**
- ❌ "Status: 2025-12-11"
- ❌ "Last updated: 2025-12-12"
- ❌ "Build: 2025-12-11"

### Why This Rule Exists

**Problem:** Counts create maintenance nightmare
- Every time a component is added/removed, ALL documentation needs updating
- Across 100+ files, this creates massive maintenance debt
- Counts become stale immediately after writing
- Forces manual updates everywhere

**Example of the problem:**
```markdown
# BAD (creates maintenance debt)
The framework has [X] skills, [Y] commands, and [Z] agents.

# If you add 1 skill, you must now update:
- README.md
- CLAUDE.md
- Blog posts mentioning counts
- Documentation referencing counts
- Every file with that number
= Multiple files to update for 1 change
```

---

## ✅ Approved Alternatives

### Use Qualifiers Instead

**For Component Counts:**
- ✅ "Multiple skills"
- ✅ "Specialized agents"
- ✅ "Comprehensive commands"
- ✅ "Modular capabilities"
- ✅ "Extensive collection"

**For Sizes:**
- ✅ "Space-efficient storage"
- ✅ "Optimized for performance"
- ✅ "Comprehensive collection"
- ✅ "Lightweight framework"

**For Completion Status:**
- ✅ "Phase 1 complete"
- ✅ "Migration finished"
- ✅ "Implementation done"
- ✅ "Fully operational"

**For Dates:**
- ✅ Use git history (not hardcoded)
- ✅ "Recently updated"
- ✅ "Latest version"

### Use Descriptive Categories

**Instead of counts, describe what exists:**

```markdown
# BAD
The framework includes [X] skills across [Y] domains.

# GOOD
The framework includes skills for security testing, content creation,
research, and professional development.
```

### Point to Catalogs for Current State

**When users need actual counts, direct them:**

```markdown
# BAD
The framework has [N] resources including benchmarks and frameworks.

# GOOD
The framework includes comprehensive security resources.
See framework catalog files for complete inventory.
```

---

## 📝 Examples by Content Type

### README.md / Documentation

**❌ WRONG:**
```markdown
## Features
- [N] specialized agents (Security, Writer, Advisor, Legal)
- [X] modular skills with progressive context loading
- [Y] slash commands for guided workflows
- [Z] resources (CIS Benchmarks, NIST frameworks)
- [SIZE] of reference materials
```

**✅ CORRECT:**
```markdown
## Features
- Specialized agents for different domains
- Modular skills with progressive context loading
- Guided workflows via slash commands
- Comprehensive security resources and benchmarks
- Space-efficient reference library

See `docs/catalogs/` for complete component inventories.
```

### Blog Posts

**❌ WRONG:**
```markdown
I built a framework with [X] skills, [Y] commands, and [Z] agents.
After migrating [N] resources ([SIZE]), the system is [%] complete.
```

**✅ CORRECT:**
```markdown
I built a framework with specialized agents, modular skills, and
guided workflows. After reorganizing the resource library, the
core system is operational with remaining enhancements planned.
```

### Technical Documentation

**❌ WRONG:**
```markdown
The security-testing skill uses [N] tools across [X] servers.
```

**✅ CORRECT:**
```markdown
The security-testing skill leverages multiple pentesting tools
via containerized server deployments.
```

### Session Reports (EXCEPTION)

**✅ ALLOWED in session files:**
```markdown
## Session Summary
**Completed:** Migrated [N] PDFs from old structure
**Result:** Reduced size from [OLD] to [NEW]

*Note: Session reports document specific work at a point in time.
      This is the ONLY exception to the no-counts rule.*
```

---

## 🔍 Self-Check Before Writing

**Before writing ANY content, ask yourself:**

1. **Am I about to write a number + component?**
   - If YES → Use a qualifier instead

2. **Am I about to write a size (GB/MB)?**
   - If YES → Use qualitative description

3. **Am I about to write a percentage?**
   - If YES → Use phase/status indicator

4. **Is this a historical session report?**
   - If YES → Counts are OK (exception)
   - If NO → Follow the rule

---

## 🛡️ Enforcement

**Validation:**
Pre-commit hooks automatically block commits with hardcoded counts, time estimates, or forbidden patterns in documentation files.

**Manual validation:** Required capability: `framework-accuracy-audit`
- Prevents accidental violations

**Writer Agent Responsibility:**
- Load this file EVERY time before writing documentation
- Enforce rules during content creation
- Use qualifiers, not counts
- Point to catalogs for current state

---

## 📚 Approved Phrase Library

**Component Descriptions:**
- "Specialized agents for different domains"
- "Multiple modular skills"
- "Comprehensive command library"
- "Extensive resource collection"
- "Framework utilities and tools"
- "Progressive context loading system"
- "Manifest-driven discovery"

**Size Descriptions:**
- "Space-efficient storage"
- "Optimized resource library"
- "Lightweight framework design"
- "Comprehensive collection"
- "Efficient organization"

**Status Descriptions:**
- "Phase [X] complete"
- "Core system operational"
- "Implementation finished"
- "Migration successful"
- "Fully functional"
- "Production ready"

---

## ❓ When In Doubt

**If you're unsure whether something violates the rule:**

1. Check if it's a number + component word
2. Check if it will need updating when things change
3. If either is YES → Find an alternative
4. If still unsure → Ask the user

**Remember:** It's better to use qualifiers than risk creating maintenance debt.

---

**Status:** ✅ Mandatory for all written content
**Loaded By:** Writer agent (startup requirement)
**Validation:** `tools/validation/validate-doc-references.ts`
**Framework:** Intelligence Adjacent (IA)
