# Support Skill Pattern

**Pattern for skills that provide HOW (methodology) while calling skills define WHAT (requirements)**

**Example:** osint-research skill (provides OSINT methodology for other skills)

---

## When to Use Support Skill Pattern

**Use this pattern when:**
- Skill provides reusable methodology (not domain-specific content)
- Multiple skills need the same capability with different requirements
- You want to centralize methodology while keeping requirements contextual
- The skill doesn't make sense as a standalone workflow

**Example Use Cases:**
- **osint-research** - OSINT methodology (dual-source, citations, fast/deep modes)
- Future: **data-analysis** - Data analysis methodology (visualization, statistics, insights)
- Future: **compliance-audit** - Audit methodology (checklist execution, evidence collection)

---

## Support Skill vs Regular Skill

### Regular Skill (Standalone)

**Example:** pentest

- Has its own slash command (`/pentest`)
- User can invoke directly
- Self-contained workflows
- Defines both WHAT and HOW

```markdown
User → /pentest → pentest SKILL.md → Execute pentest workflow
```

---

### Support Skill (Delegated)

**Example:** osint-research

- NO slash command (not standalone)
- Only invoked by other skills
- Provides methodology, receives requirements
- Calling skill defines WHAT, support skill provides HOW

```markdown
User → /career → career SKILL.md →
  Delegates to osint-research (with research plan) →
  osint-research executes dual-source methodology →
  Returns findings to career
```

---

## Support Skill Architecture

### 1. SKILL.md Structure

```markdown
---
name: support-skill-name
description: Support skill providing [methodology] for other skills. Not standalone - always invoked with caller context.
---

# Support Skill Name (Support Skill)

**Support skill loaded by: skill-a, skill-b, skill-c**

Provides [methodology description].

**Core Philosophy:** This skill provides HOW to [do thing] - calling skills define WHAT to [do].

---

## 🚨 Critical Rules

**This is a SUPPORT SKILL - not standalone:**

1. **Always Called with Context** - Caller provides: [context requirements]
2. **Caller-Specific Output** - Return findings to caller's specified directory
3. [Other rules specific to this support skill]

---

## Support Skill Architecture

**How delegation works:**

```
Calling Skill → Defines WHAT to do → support-skill executes HOW

Example:
  skill-a needs: "Specific requirement 1, 2, 3"
  support-skill executes: Methodology, returns results
```

**Caller Context Required:**
- **Calling skill:** Who invoked this skill
- **Requirements:** What the caller needs
- **Mode/Options:** How to execute
- **Output location:** Where to save results

---

## Decision Tree: Caller Detection

**Level 1: Who is calling this skill?**

### Caller 1: skill-a

**Context:** [What skill-a is doing]

**Requirements (from caller):**
- Specific requirement 1
- Specific requirement 2
- Specific requirement 3

**Mode:** [execution mode]

**Output:** [where to save results for skill-a]

**Methodology:** [how support-skill executes for this caller]

---

### Caller 2: skill-b

[Same structure for each calling skill]

---

## Delegation Examples

### Example 1: skill-a → support-skill

**Caller context:**
```markdown
# From skill-a/workflows/workflow-name.md

### Phase N: [Task Name]

**DELEGATE to support-skill:**

**Caller:** skill-a
**Mode:** [mode option]
**Requirements:**
  - Requirement 1 (details)
  - Requirement 2 (details)
  - Requirement 3 (details)

**Output:** [specific output location for skill-a]

support-skill executes [methodology] and returns findings.
```

---

[Repeat for each calling skill]

---

## Version History

**v1.0 (YYYY-MM-DD)** - Initial support skill creation
- Describe what changed

---

**Version:** 1.0
**Last Updated:** YYYY-MM-DD
**Status:** Support skill (delegated by skill-a, skill-b, skill-c)
```

---

### 2. Calling Skill Workflow Updates

**Each calling skill must have explicit delegation block:**

```markdown
## Phase N: [Task Requiring Support Skill]

**DELEGATE to [support-skill]:**

**Caller:** [calling-skill-name]
**Mode:** [execution mode]

**Requirements:**
  - Specific requirement 1 (contextual to this calling skill)
  - Specific requirement 2
  - Specific requirement 3

**Output:** [caller-specific output location]

[support-skill] executes [methodology] with caller's requirements.
```

**Key points:**
- Caller provides specific requirements (WHAT to do)
- Support skill receives context and executes methodology (HOW to do it)
- Results returned to caller's specified location
- Calling skill continues with its workflow using support skill's results

---

## Enforcement Mechanisms

**Automated validation via pre-commit hook:**

```bash
hooks/pre-commit/validate-support-skills.sh
```

**Hook validates:**
1. ✅ Support skills must NOT have slash commands
2. ✅ Support skills must have "Support skill" in frontmatter description
3. ✅ Support skills must document calling skills ("Support skill loaded by:")
4. ⚠️ Soft check for delegation blocks in calling skills (warnings only)

**Run manually:**
```bash
bash hooks/pre-commit/validate-support-skills.sh
```

**Integration:** Automatically runs on `git commit` via `.git/hooks/pre-commit`

---

## Implementation Checklist

When converting a skill to support skill pattern:

### Phase 1: Analysis
- [ ] Confirm skill provides methodology (not domain content)
- [ ] Identify all skills that should use this methodology
- [ ] Document what calling skills need (requirements/context)
- [ ] Verify support skill doesn't need standalone access

### Phase 2: Restructure Support Skill
- [ ] Update frontmatter description (add "Support skill..." text)
- [ ] Remove standalone mode detection
- [ ] Add caller context section
- [ ] Create caller-specific delegation examples
- [ ] Document caller detection decision tree
- [ ] Update version history

### Phase 3: Update Calling Skills
- [ ] Add delegation blocks to each calling skill's workflow
- [ ] Specify caller-specific requirements
- [ ] Define output locations per caller
- [ ] Test delegation flow conceptually

### Phase 4: Remove Standalone Access
- [ ] Delete slash command file (if exists)
- [ ] Remove from hooks/detect-commands.py
- [ ] Update README command list
- [ ] Document removal in changelog

### Phase 5: Documentation
- [ ] Create support-skill-pattern.md (this file)
- [ ] Update skill's SKILL.md with support skill architecture
- [ ] Document in session file (if major change)
- [ ] Add recovery plan in case rollback needed

---

## Real-World Example: osint-research

**Before (Standalone):**
- Had `/advisory` command
- Users invoked directly
- Generic "fast vs deep" mode detection
- No caller-specific context

**After (Support Skill):**
- No slash command
- Only invoked by: career, pentest, write
- Each caller has specific methodology needs
- Caller-specific output locations
- Support skill provides methodology, callers define requirements

**Benefits:**
- Centralized research methodology
- Each skill gets customized research (not one-size-fits-all)
- Clear separation: WHAT to research (caller) vs HOW to research
- Reduced duplication (multiple skills share one methodology)

**Delegation Example:**

```markdown
# career delegates for job application research:

**DELEGATE to advisory:**
**Caller:** career
**Research Plan:**
  - Company culture and values
  - Leadership backgrounds
  - Technology stack
**Output:** output/career/job-opportunities/{Company}/01-company-intelligence.md

# pentest delegates for reconnaissance:

**DELEGATE to advisory:**
**Caller:** pentest
**Research Plan:**
  - Organization profile
  - Technology stack
  - Attack surface mapping
  - Known vulnerabilities
**Output:** output/engagements/pentest/{target}/01-scope-and-reconnaissance/intel/
```

Notice how each caller has different requirements, but both use the same methodology.

---

## Anti-Patterns (Don't Do This)

### ❌ Anti-Pattern 1: Support Skill with Slash Command

**Problem:** Support skills shouldn't be standalone

```markdown
# BAD: Support skill has its own command
/support-skill → User invokes directly

# GOOD: Support skill only via delegation
skill-a → delegates to support-skill
```

### ❌ Anti-Pattern 2: Support Skill Defines Requirements

**Problem:** Support skill shouldn't know domain-specific needs

```markdown
# BAD: Support skill has hardcoded requirements
advisory: "Always research: company profile, tech stack, vulns"

# GOOD: Calling skill defines requirements
career: "Research: culture, leadership, tech stack"
pentest: "Research: org profile, attack surface, vulns"
```

### ❌ Anti-Pattern 3: Calling Skill Duplicates Methodology

**Problem:** Defeats purpose of support skill

```markdown
# BAD: Each skill implements own research methodology
career: WebSearch + Grok + citations
pentest: WebSearch + Grok + citations
write: WebSearch + Grok + citations

# GOOD: Delegate to support skill
career → advisory (with requirements)
pentest → advisory (with requirements)
write → advisory (with requirements)
```

### ❌ Anti-Pattern 4: No Caller Context

**Problem:** Support skill can't customize for caller needs

```markdown
# BAD: Generic delegation
"Use advisory skill"

# GOOD: Explicit caller context
**DELEGATE to advisory:**
**Caller:** pentest
**Mode:** fast
**Research Plan:** [specific requirements]
**Output:** [specific location]
```

---

## Future Support Skill Candidates

**Skills that might benefit from this pattern:**

1. **data-analysis** (methodology: visualization, statistics, insights)
   - Called by: pentest (finding analysis), write (blog metrics), compliance (quality metrics)
   - Provides HOW: Data visualization, statistical analysis
   - Callers define WHAT: Specific datasets and analysis requirements

2. **compliance-audit** (methodology: checklist execution, evidence collection)
   - Called by: advisory (framework audits), harden (CIS/STIG validation)
   - Provides HOW: Audit methodology, evidence documentation
   - Callers define WHAT: Which standards, which controls

3. **report-synthesis** (methodology: executive summaries, technical details, recommendations)
   - Called by: pentest (pentest reports), write (technical docs)
   - Provides HOW: Report structure, synthesis methodology
   - Callers define WHAT: Findings to synthesize, audience level

---

## Session Backup and Recovery

**Before implementing support skill pattern:**

1. **Create session file:** `sessions/YYYY-MM-DD-skill-name-restructure.md`
2. **Document current state:**
   - What files will change
   - Current architecture
   - Calling skills affected
3. **Create recovery plan:**
   - How to restore if needed
   - Git commit before changes
   - Backup of deleted files (like slash command)

**See:** `sessions/2025-12-16-osint-skill-restructure.md` for example

---

## Testing Support Skill Pattern

**Conceptual testing (before full implementation):**

1. **Verify caller coverage:** All skills that need methodology are documented
2. **Check delegation blocks:** Each calling skill has explicit delegation
3. **Validate requirements:** Caller requirements are specific and actionable
4. **Confirm outputs:** Each caller has appropriate output location
5. **Review methodology:** Support skill has clear execution steps

**Runtime testing (after implementation):**

1. Invoke calling skill with task requiring support skill
2. Verify calling skill delegates correctly
3. Confirm support skill receives caller context
4. Check support skill executes with caller requirements
5. Validate results returned to caller's output location

---

## References

**Example Implementation:**
- `skills/advisory/SKILL.md` - Support skill structure
- `skills/career/SKILL.md` - Calling skill
- `skills/pentest/workflows/pentest-init.md` - Delegation block
- `skills/write/workflows/blog-content.md` - Delegation block

**Related Patterns:**
- `docs/guides/hierarchical-context-loading.md` - Progressive disclosure
- `docs/architecture/agent-routing-architecture.md` - Agent delegation patterns

---

**Version:** 1.0
**Last Updated:** 2025-12-16
**Pattern Status:** Template pattern for future implementation
**Future Candidates:** data-analysis, compliance-audit, report-synthesis
