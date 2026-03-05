# Phase Workflow Patterns

**Common 5-phase patterns for different skill types.**

---

## Universal 5-Phase Pattern

All skills follow this structure (with domain-specific names):

```
EXPLORE → PLAN → CODE → QA → COMMIT
```

**Gates between phases prevent progression until criteria met.**

---

## Pattern 1: Research & Analysis

**Use for:** Career analysis, OSINT, threat intelligence, market research

### Phase Names

1. **DISCOVER** - Gather requirements and scope
2. **RESEARCH** - Collect data from sources
3. **ANALYZE** - Process and synthesize findings
4. **VALIDATE** - Verify accuracy and completeness
5. **DELIVER** - Package and present results

### Example: Career Analysis

```
┌──────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ DISCOVER │───▶│RESEARCH │───▶│ ANALYZE │───▶│VALIDATE │───▶│ DELIVER │
└──────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
     │               │              │              │              │
     ▼               ▼              ▼              ▼              ▼
Requirements    Job postings   Skill gaps    Accuracy      Final report
  gathered       collected     identified     verified       delivered
```

**Files:**
- `01-discover.md` - Requirements gathering
- `02-research.md` - Data collection (OSINT, APIs, web scraping)
- `03-analyze.md` - Analysis and synthesis
- `04-validate.md` - Quality verification
- `05-deliver.md` - Report generation and delivery

---

## Pattern 2: Security Testing

**Use for:** Penetration testing, vulnerability scanning, compliance assessment

### Phase Names

1. **EXPLORE** - Reconnaissance and attack surface mapping
2. **PLAN** - Test plan development (requires approval)
3. **CODE** - Execute tests and document findings
4. **QA** - Validate findings and evidence
5. **COMMIT** - Close-loop remediation or report submission

### Example: Penetration Testing

```
┌─────────┐    ┌──────┐    ┌──────┐    ┌─────┐    ┌────────┐
│ EXPLORE │───▶│ PLAN │───▶│ CODE │───▶│ QA  │───▶│ COMMIT │
└─────────┘    └──────┘    └──────┘    └─────┘    └────────┘
     │             │           │          │            │
     ▼             ▼           ▼          ▼            ▼
  Attack       Test plan   Findings   Validated   Remediation
  surface       approved   documented  findings     or report
  mapped
```

**Files:**
- `01-explore.md` - Reconnaissance (passive OSINT, active scanning)
- `02-plan.md` - Test plan generation (MANDATORY approval gate)
- `03-code.md` - Test execution with scope verification
- `04-qa.md` - Findings validation (CVSS, CWE, evidence)
- `05-commit.md` - Close-loop toggle (fix or report)

**Key Feature:** Plan approval gate prevents testing without authorization

---

## Pattern 3: Content Creation

**Use for:** Blog posts, documentation, reports, newsletters

### Phase Names

1. **DISCOVER** - Content requirements and audience
2. **DRAFT** - Initial content creation
3. **REVIEW** - Editorial review and refinement
4. **POLISH** - Final formatting and optimization
5. **PUBLISH** - Deploy and distribute

### Example: Blog Publishing

```
┌──────────┐    ┌───────┐    ┌────────┐    ┌────────┐    ┌─────────┐
│ DISCOVER │───▶│ DRAFT │───▶│ REVIEW │───▶│ POLISH │───▶│ PUBLISH │
└──────────┘    └───────┘    └────────┘    └────────┘    └─────────┘
     │              │            │             │              │
     ▼              ▼            ▼             ▼              ▼
  Topic &        Initial      Editorial     SEO &         Live post
  audience       content        QA         images        on blog
  defined        written      complete    optimized
```

**Files:**
- `01-discover.md` - Topic research, audience analysis
- `02-draft.md` - Content creation with AI assistance
- `03-review.md` - Editorial review, fact-checking
- `04-polish.md` - SEO, images, formatting
- `05-publish.md` - Ghost API publication

---

## Pattern 4: Infrastructure Operations

**Use for:** Server hardening, configuration management, deployment

### Phase Names

1. **AUDIT** - Current state assessment
2. **DESIGN** - Remediation plan
3. **IMPLEMENT** - Apply changes (with rollback)
4. **VALIDATE** - Verify changes effective
5. **DOCUMENT** - Record changes and runbooks

### Example: Server Hardening

```
┌───────┐    ┌────────┐    ┌───────────┐    ┌─────────┐    ┌──────────┐
│ AUDIT │───▶│ DESIGN │───▶│ IMPLEMENT │───▶│VALIDATE │───▶│ DOCUMENT │
└───────┘    └────────┘    └───────────┘    └─────────┘    └──────────┘
    │            │               │               │               │
    ▼            ▼               ▼               ▼               ▼
Baseline    Remediation     Rollback-safe   Compliance    Runbook
captured     plan created   changes applied   verified     updated
```

**Files:**
- `01-audit.md` - Baseline capture, gap analysis
- `02-design.md` - Remediation plan with rollback steps
- `03-implement.md` - POC → batch → verification loop
- `04-validate.md` - Compliance verification
- `05-document.md` - Runbook and change documentation

**Key Feature:** Rollback-first, POC-then-batch safety pattern

---

## Pattern 5: Skill Creation (Meta)

**Use for:** Creating new skills, scaffolding, templates

### Phase Names

1. **DISCOVER** - Requirements gathering
2. **DESIGN** - Structure planning
3. **GENERATE** - File creation from templates
4. **VALIDATE** - Structure and content verification
5. **HANDOFF** - User education and customization

### Example: /create

```
┌──────────┐    ┌────────┐    ┌──────────┐    ┌─────────┐    ┌─────────┐
│ DISCOVER │───▶│ DESIGN │───▶│ GENERATE │───▶│VALIDATE │───▶│ HANDOFF │
└──────────┘    └────────┘    └──────────┘    └─────────┘    └─────────┘
     │              │              │              │              │
     ▼              ▼              ▼              ▼              ▼
Requirements   Structure      Files created   All checks   User ready
  captured      planned       from templates    passed     to customize
```

**Files:**
- `01-discover.md` - AskUserQuestion for requirements
- `02-design.md` - Structure validation, template selection
- `03-generate.md` - File creation (SKILL.md, phases, etc.)
- `04-validate.md` - Frontmatter, line counts, structure checks
- `05-handoff.md` - Next steps guide, customization instructions

---

## Pattern 6: Automation & Integration

**Use for:** API integrations, workflow automation, data sync

### Phase Names

1. **CONFIGURE** - Setup and credentials
2. **CONNECT** - Test connectivity
3. **EXECUTE** - Run automation
4. **VERIFY** - Check results
5. **SYNC** - Finalize and record

### Example: Git Operations

```
┌───────────┐    ┌─────────┐    ┌─────────┐    ┌────────┐    ┌──────┐
│ CONFIGURE │───▶│ CONNECT │───▶│ EXECUTE │───▶│ VERIFY │───▶│ SYNC │
└───────────┘    └─────────┘    └─────────┘    └────────┘    └──────┘
      │              │              │              │            │
      ▼              ▼              ▼              ▼            ▼
  Pre-flight      Remote        Changes        Status       Success
   checks        verified       committed      confirmed    recorded
```

**Files:**
- `01-configure.md` - Environment validation, pre-flight
- `02-connect.md` - Remote connectivity test
- `03-execute.md` - Main operation (commit, push, etc.)
- `04-verify.md` - Success verification
- `05-sync.md` - Final confirmation, session update

---

## Phase File Structure

Each phase file follows this template:

```markdown
# Phase N: [PHASE-NAME]

**Maps to Universal Phase:** [EXPLORE/PLAN/CODE/QA/COMMIT]

**Purpose:** [What this phase accomplishes]

**Success Criteria Mutation:** [How progress is tracked]

---

## Gate Question

> "[Question that must be answered YES to proceed]"

**Pass Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

**If NO:** [Recovery actions]

---

## Workflow

### Step 1: [Action Name]

[Detailed instructions]

**Commands/Tools:**
```bash
[Example commands]
```

### Step 2: [Action Name]

[Detailed instructions]

---

## Verification Checklist

**Before proceeding to next phase:**
- [ ] All steps completed
- [ ] Gate criteria met
- [ ] Output validated

---

## Error Recovery

| Error | Recovery |
|-------|----------|
| [Error] | [Solution] |

---
```

---

## Choosing the Right Pattern

| Skill Type | Pattern | Key Phases | Example |
|------------|---------|------------|---------|
| Research | Research & Analysis | DISCOVER → RESEARCH → ANALYZE | Career, threat-intel |
| Security | Security Testing | EXPLORE → PLAN → CODE | Pentest, vuln-scan |
| Content | Content Creation | DISCOVER → DRAFT → PUBLISH | Blog, newsletter |
| Infra | Infrastructure Ops | AUDIT → DESIGN → IMPLEMENT | Hardening, deployment |
| Meta | Skill Creation | DISCOVER → DESIGN → GENERATE | /create |
| Automation | Integration | CONFIGURE → CONNECT → EXECUTE | Git, n8n, Ghost |

---

## Common Gates Between Phases

### EXPLORE → PLAN
**Gate Question:** "Do I understand the scope and requirements?"
- All requirements gathered
- Scope boundaries defined
- Authorization verified (if security testing)

### PLAN → CODE
**Gate Question:** "Is the plan approved and complete?"
- Plan reviewed
- User approval obtained (if required)
- All dependencies verified

### CODE → QA
**Gate Question:** "Is execution complete?"
- All steps executed
- Output captured
- Evidence collected

### QA → COMMIT
**Gate Question:** "Is quality verified?"
- All validations passed
- No critical issues
- Deliverables meet standards

---

## Anti-Patterns

### ❌ WRONG: Generic phase names

**Bad:**
```
01-phase1.md
02-phase2.md
03-phase3.md
04-phase4.md
05-phase5.md
```

**Good:**
```
01-discover.md
02-research.md
03-analyze.md
04-validate.md
05-deliver.md
```

**Why:** Domain-specific names improve clarity and routing

---

### ❌ WRONG: Skipping gates

**Bad:**
```python
# Phase 2
if requirements_gathered:
    # Proceed to Phase 3 automatically
    execute_phase_3()
```

**Good:**
```python
# Phase 2
if not requirements_gathered:
    raise GateError("Cannot proceed - requirements incomplete")

# Explicit gate check before Phase 3
# User must confirm plan before execution
```

**Why:** Gates prevent premature progression and errors

---

### ❌ WRONG: Combining unrelated actions

**Bad:**
```
03-analyze-and-publish.md  # Does two phases at once
```

**Good:**
```
03-analyze.md  # Analysis only
04-validate.md # QA before publishing
05-publish.md  # Publishing after validation
```

**Why:** Separation of concerns, proper gates between phases

---

**Version:** 1.0
**Last Updated:** 2026-01-19
