---
name: gap-analysis
description: Framework gap analysis — multi-framework, framework-native output with compliance matrix, gap findings, and remediation roadmap
domain: gap-analysis
skill: gap-analysis
agent: advisor
model: sonnet
complexity: high
mode: multi-agent
chain_position: standalone
---

# /gap-analysis -- Framework Gap Analysis

## IDENTITY

**Agent:** `advisor` (orchestrator — delegates to engineer/security per phase, with legal QA gate)

**Role:** Gap analysis workflow router. Validate user input, detect existing engagement work, gather framework preferences, and load the gap analysis workflow orchestrator.

**Note:** This command routes to `phases/00-workflow.md`, which handles multi-agent delegation across the 3-phase pipeline (advisor, engineer, security, legal QA).

---

## INPUT CONTRACT

**Receives:**
- User invocation: `/gap-analysis [optional: framework names]`
- Optional: client name, assessor details

**Prerequisites:**
- User has invoked `/gap-analysis`
- Framework resources accessible: `standards/frameworks/`

**Source:** User invocation (slash command)

---

## OBJECTIVE

**Goal:** Route user's gap analysis request to the 3-phase workflow.

**Success criteria:**
- Framework preferences identified (or user prompted to select)
- Existing engagement work detected (if any)
- Workflow loaded from `skills/gap-analysis/phases/00-workflow.md`

**Failure criteria:**
- No framework selected and user declines to choose
- Framework resources inaccessible

---

## METHODOLOGY

Check for existing work first. If `private/output/gap-analysis/` contains a directory matching this client, the user may be resuming a prior assessment. Ask before overwriting.

For fresh starts: create output directory as `{client-slug}-{YYYY-MM}` (lowercase-hyphen, e.g., `acme-healthcare-2026-02`).

If user specifies frameworks inline (e.g., `/gap-analysis HIPAA, NIST CSF`), skip framework selection prompt. If no frameworks specified, the intake phase will handle framework selection via industry auto-routing.

---

## EXECUTION

### Step 1: Parse User Input

**Tool:** Direct analysis

If user provided framework names, extract them.
If user provided client name, extract it.
If neither, prepare to prompt during intake phase.

**Expected output:** Parsed framework list and/or client name
**On failure:** Proceed to workflow; intake phase will gather details

### Step 2: Check for Existing Work

**Tool:** Glob
**Pattern:** `private/output/gap-analysis/*`

Check if output directory already exists for a matching client.

**Expected output:** Fresh start or resume decision
**On failure:** Default to fresh start

### Step 3: Load Workflow

**Tool:** Read
**Reference:** `skills/gap-analysis/phases/00-workflow.md`

Load the gap analysis workflow orchestrator with:
- Framework preferences (if provided)
- Client name (if provided)
- Resume state (if existing work found)

**Expected output:** Workflow loaded, Phase 1 begins

---

## OUTPUT CONTRACT

**Produces:**
- Workflow execution initiated (no files created by command itself)
- Output directory will be created by Phase 1 (Intake): `private/output/gap-analysis/{client}-{YYYY-MM}/`

**Final output (after workflow completes):**
```
private/output/gap-analysis/{client}-{YYYY-MM}/
├── intake/
│   ├── metadata.yaml
│   ├── merged-questionnaire.yaml
│   └── osint-summary.md
├── assessment/
│   ├── {framework-id}-findings.md   (one per selected framework)
│   └── ...
├── deliverables/
│   ├── compliance-matrix.md
│   ├── gap-analysis.md
│   ├── remediation-roadmap.md
│   └── qa-report.md
└── evidence/
```

---

## NEXT

**On success:** Load `skills/gap-analysis/phases/00-workflow.md`
  Pass: Framework preferences, client name, resume state

**On resume (existing work):** Load `skills/gap-analysis/phases/00-workflow.md`
  Workflow will detect current phase from existing files

**On failure:** STOP. Guide user on what is needed.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] User input parsed (frameworks and/or client name)
- [ ] Existing work checked
- [ ] Workflow prompt loaded from `phases/00-workflow.md`

**Error recovery:**
- If no frameworks specified: Intake phase will handle via industry auto-routing
- If existing output found: Ask user if resuming or starting fresh
- If framework resources missing: Intake phase will trigger acquisition workflow

---

## Usage

```bash
/gap-analysis
/gap-analysis HIPAA, NIST CSF
/gap-analysis PCI-DSS v4.0.1
/gap-analysis ISO 27001
```

## When to Use

**Use /gap-analysis when:**
- You need a full compliance gap assessment against one or more frameworks
- You want to evaluate compliance posture per selected framework's native control structure
- You need a compliance matrix showing status per framework
- You want gap analysis with remediation roadmap

**Do not use if:**
- Need risk assessment and scoring only → use `/risk-assess`
- Need infrastructure hardening only → use `/harden`
- Need incident response → use `/incident`
- Need penetration testing → use `/pentest`

## Available Frameworks

NIST CSF 2.0, NIST 800-53 Rev 5, PCI-DSS v4.0.1, HIPAA, ISO 27001, ISO 42001, ISO 9001, ISO 13485, CIS Controls v8.1, SOC 2, GDPR, FedRAMP, FFIEC, DSA

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
