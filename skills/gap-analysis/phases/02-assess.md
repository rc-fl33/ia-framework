---
domain: gap-analysis
skill: gap-analysis
agent: advisor
model: sonnet
mode: multi-agent
agents: [advisor, engineer, security]
complexity: medium
chain_position: middle
---

# Phase 2: ASSESS (Framework-Native Assessment Interview)

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Framework-native assessment conductor. Loads each selected framework's native control structure and conducts a structured interview organized by that framework's own categories. Produces one findings file per selected framework named `{framework-id}-findings.md`. Delegates access_control and data_protection domain questions to engineer; delegates incident_response domain questions to security.

**Additional constraints:** Questions are asked once per topic (deduplicated by domain). The answer is recorded in every framework's findings file where that control applies. Output is organized strictly by framework-native categories — never by NIST CSF phase names unless NIST CSF was a selected framework.

---

## INPUT CONTRACT

**Receives:**
- Engagement metadata from `intake/metadata.yaml`
- Merged questionnaire from `intake/merged-questionnaire.yaml`
- OSINT findings from `intake/osint-summary.md` (if available)
- Framework control structures from `standards/frameworks/{id}/` (manifest, questions, reference)

**Prerequisites:**
- Phase 1 (Intake) complete — `intake/metadata.yaml` exists
- At least one framework is listed in metadata
- Merged questionnaire exists or single-framework questions available

**Source:** `skills/gap-analysis/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Conduct assessment interview and produce per-framework findings files organized by each framework's native category structure.

**Success criteria:**
- One `{framework-id}-findings.md` file produced per selected framework
- All controls in each framework's scope are scored (Full / Partial / Gap / Requires Evidence)
- Evidence checklist reviewed for each finding
- No NIST CSF section headers appear in output unless NIST CSF was a selected framework

**Failure criteria:**
- No frameworks listed in metadata
- Questionnaire unavailable and cannot be loaded from framework files

---

## METHODOLOGY

**Questions are asked once per control domain.** The domain field (`governance`, `access_control`, `data_protection`, `monitoring`, `incident_response`, `business_continuity`) is the deduplication key. When the same topic applies to multiple frameworks, the question is asked once and the answer is recorded in every relevant framework's findings file.

**Agent routing is by control domain (work-type routing keys — not NIST CSF phase names):**

| Domain | Agent |
|--------|-------|
| governance | advisor (execute directly) |
| asset_management | advisor (execute directly) |
| monitoring | advisor (execute directly) |
| business_continuity | advisor (execute directly) |
| access_control | engineer (delegate via Task) |
| data_protection | engineer (delegate via Task) |
| incident_response | security (delegate via Task) |

> **Framework category note:** Domain-based delegation applies to security and regulatory frameworks.
> For `quality_management` (ISO 9001, ISO 13485), `ai_governance` (ISO 42001, AIUC-1), and
> `audit_methodology` (ISO 19011) frameworks, advisor handles ALL domain questions directly.
> These frameworks have no access_control or incident_response controls to delegate.

**Output files use framework-native category structure.** For each selected framework, the findings file is organized by that framework's own categories as listed in `manifest.yaml` under `native_categories:`. Examples:
- SOC 2: organized by CC1, CC2, CC3, CC4, CC5, CC6, CC7, CC8, CC9, A, PI, C, P
- ISO 27001: organized by A.5, A.6, A.7, A.8
- HIPAA: organized by 164.308, 164.310, 164.312, 164.314, 164.316
- NIST CSF: organized by GV, ID, PR, DE, RS, RC
- PCI-DSS: organized by Req-1 through Req-12

---

## EXECUTION

### Step 1: Load Framework List

**Tool:** Read
**File:** `intake/metadata.yaml`

Load the list of selected frameworks and their native categories. For each framework not yet assessed (no `{id}-findings.md` exists in `assessment/`), proceed to assessment.

**Expected output:** List of frameworks to assess

### Step 2: Load Framework Control Structures

**Tool:** Read
**Files:** `standards/frameworks/{id}/manifest.yaml` for each pending framework

Load native categories from each framework's manifest. These categories become the section headers in the findings file.

**Expected output:** Framework native categories loaded

### Step 3: Load Assessment Questionnaire

**Tool:** Read
**File:** `intake/merged-questionnaire.yaml` (multi-framework) or `standards/frameworks/{id}/questions.yaml` (single)

Load the question set. Questions are grouped by domain for routing purposes. Note which questions map to which frameworks.

**Expected output:** Questions loaded with framework mapping

### Step 4: Conduct Domain Interviews

**Tool:** Direct conversation (advisor domains), Task delegation (engineer/security domains)

Work through each control domain with the user. For each question:

1. Ask the question in plain language
2. Record the user's response
3. Assess completeness of evidence
4. Score: `Full` / `Partial` / `Gap` / `Requires Evidence`

**Scoring definitions:**
- **Full:** Control is implemented with documented evidence
- **Partial:** Control is partially implemented or informally practiced
- **Gap:** Control is not implemented — finding identified
- **Requires Evidence:** Implementation may exist but evidence not yet provided

**Delegate by domain:**

```
For access_control and data_protection questions:
Task(subagent_type="engineer", prompt="Conduct gap assessment for access_control and
  data_protection domains. Questions: {question_list}. Context: {org_name}.
  Produce findings in scoring format: Full/Partial/Gap/Requires Evidence with evidence notes.")

For incident_response questions:
Task(subagent_type="security", prompt="Conduct gap assessment for incident_response domain.
  Questions: {question_list}. Context: {org_name}.
  Produce findings in scoring format: Full/Partial/Gap/Requires Evidence with evidence notes.")
```

**Expected output:** All domain questions answered with scores

### Step 5: Write Findings File Per Framework

**Tool:** Write
**File:** `assessment/{framework-id}-findings.md`

For each selected framework, produce one findings file organized by the framework's native categories:

```markdown
# {Framework Name} — Gap Analysis Findings

**Organization:** {org_name}
**Assessment Date:** {date}
**Assessor:** {assessor}
**Framework:** {framework_name} {version}
**Controls Assessed:** {count}
**Compliant:** {count} | **Partial:** {count} | **Gaps:** {count} | **Requires Evidence:** {count}
**Overall Score:** {percentage}%

---

## {Native Category 1} — {Category Title}

### {Control ID}: {Control Title}

**Status:** Full / Partial / Gap / Requires Evidence
**Evidence:** {evidence provided or "None provided"}
**Notes:** {assessment notes}
**Recommendation:** {specific gap closure action if status is Gap or Partial}

---

### {Control ID}: {Control Title}

...

---

## {Native Category 2} — {Category Title}

...
```

**Expected output:** One `{framework-id}-findings.md` per selected framework

### Step 6: Verify All Frameworks Assessed

**Tool:** Glob
**Pattern:** `assessment/{framework-id}-findings.md`

Confirm that a findings file exists for every framework in `intake/metadata.yaml`.

**Expected output:** Gate criteria confirmed
**On failure:** Return to Step 4 for missing frameworks

---

## OUTPUT CONTRACT

**Produces:**
- `assessment/{framework-id}-findings.md` — one per selected framework, organized by native categories

**Format:** Markdown. Section headers use framework-native category identifiers (CC1, A.5, 164.308, GV, Req-1, etc.)

---

## NEXT

**On success:** Load `skills/gap-analysis/phases/03-deliverables.md`
  Pass: Engagement metadata, all findings files

**On partial (some frameworks incomplete):** Proceed to deliverables, note incomplete frameworks

**On failure:** Return to Step 4 with specific missing frameworks

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] All selected frameworks have a `{framework-id}-findings.md` in `assessment/`
- [ ] All controls in scope are scored (Full/Partial/Gap/Requires Evidence)
- [ ] No NIST CSF section headers in output unless NIST CSF was selected
- [ ] Evidence notes recorded for all scored controls
- [ ] Ready to proceed to Phase 3 (DELIVERABLES)

**Error recovery:**
- If domain delegation fails: Advisor conducts those domain questions directly
- If questions missing for a framework: Use generic questions from comparable framework
- If user declines to answer: Score as "Requires Evidence", note in findings

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
