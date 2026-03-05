---
domain: risk-assess
skill: risk-assess
agent: advisor
model: sonnet
mode: single-agent
complexity: medium
chain_position: first
---

# Phase 1: SCOPE (Framework Selection, Org Context, Asset Boundary)

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Gather organizational context, select the risk assessment framework,
define asset boundary, and set up the engagement. This phase produces scope.md and creates
the output directory. All framework selection is done inline — no external manifests loaded.

**Additional constraints:** Do not begin asset identification or risk analysis in this phase.
Focus entirely on understanding the organization, selecting the framework, and defining scope.
If context is insufficient, ask — do not assume.

---

## INPUT CONTRACT

**Receives:**
- User request and optional org name from `/risk-assess` command
- Optional: framework preference, asset descriptions, regulatory context
- Output directory path: `private/output/risk-assess/{org}-{YYYY-MM}/`

**Prerequisites:**
- User has invoked `/risk-assess`
- Org name available or will be gathered in this phase

**Source:** `skills/risk-assess/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Establish engagement scope, select assessment framework, define asset boundary, and
create the output directory with scope.md.

**Success criteria:**
- Org name confirmed
- Assessment framework selected from the 7 supported options
- Asset boundary defined (what is in scope vs out of scope)
- Engagement context documented (industry, size, regulatory environment)
- scope.md written to output directory
- Output directory created

**Failure criteria:**
- User provides no org name and declines to provide one → STOP
- User cannot define any asset boundary → STOP with guidance

---

## METHODOLOGY

**Phase 1 is about understanding the organization, not analyzing risks.** Resist the urge to
identify threats or score likelihoods here. A well-scoped engagement produces a focused,
actionable risk register rather than an exhaustive but unusable one.

**Framework selection is the key decision.** The selected framework shapes the threat taxonomy,
asset categorization approach, and risk rating methodology throughout the assessment. Present
the options clearly and guide the user to the best fit for their regulatory environment.

---

## EXECUTION

### Step 1: Gather Org Context

**Tool:** Direct conversation

Collect the following — ask only for what was not provided at invocation:

- **Org name** — required for output directory and report headers
- **Industry** — healthcare, financial, government, technology, retail, critical infrastructure, other
- **Org size** — number of employees or size category (small <100, mid 100-1000, enterprise 1000+)
- **Regulatory environment** — any applicable regulations or standards (HIPAA, PCI DSS, FedRAMP,
  SOX, GDPR, state privacy laws)
- **Assessment driver** — what is prompting this risk assessment (audit, board requirement,
  regulatory mandate, proactive program, incident response)

**Expected output:** Org context gathered
**On failure:** Ask targeted questions; do not proceed until org name is confirmed

### Step 2: Present Framework Options

**Tool:** Direct conversation

Present the 7 supported frameworks inline and ask the user to select one:

```
1. NIST CSF 2.0 — Govern/Identify/Protect/Detect/Respond/Recover functions as risk lens.
   Best for: Organizations wanting a comprehensive, widely recognized framework.

2. ISO 27001 — Annex A control-based risk assessment using ISO 27005 methodology.
   Best for: Organizations pursuing ISO 27001 certification or operating internationally.

3. PCI DSS — Cardholder data environment risk focus, aligned with SAQ methodology.
   Best for: Organizations that process, store, or transmit payment card data.

4. HIPAA — PHI/ePHI risk analysis per §164.308(a)(1), required by regulation.
   Best for: Healthcare covered entities and business associates.

5. FedRAMP — FIPS 199/800-30 methodology, ATO-aligned risk categorization.
   Best for: Cloud service providers pursuing or maintaining federal authorization.

6. AIUC-1 — AI system risk assessment covering model risk, data lineage, adversarial threats.
   Best for: Organizations deploying or operating AI/ML systems.

7. General — Framework-agnostic likelihood × impact matrix with standard risk register.
   Best for: Organizations without a mandated framework seeking practical risk management.
```

If the user already specified a framework at invocation, confirm it and skip the selection
dialog. If a regulatory requirement was identified in Step 1, recommend the corresponding
framework (e.g., HIPAA → option 4, PCI DSS → option 3).

**Expected output:** Framework selected and confirmed
**On failure:** Default to General (option 7) with a note that it can be changed later

### Step 3: Define Asset Boundary

**Tool:** Direct conversation

Define what is in scope for this risk assessment:

- **Asset types to include:** Which categories of assets will be assessed?
  - Data assets (databases, file stores, backups, PII, financial records)
  - Systems and infrastructure (servers, cloud services, endpoints, network devices)
  - Applications (web apps, APIs, internal tools, third-party SaaS)
  - People and processes (staff roles, business processes, third-party vendors)
  - Physical assets (data centers, offices, hardware)

- **Specific inclusions:** Key systems, data stores, or processes explicitly in scope
- **Explicit exclusions:** What will NOT be assessed (legacy systems, acquired entities,
  out-of-scope subsidiaries)
- **Depth:** Full org-wide assessment vs. a specific business unit or system

If the user cannot enumerate assets yet, define the boundary categories now. Phase 2
(Identify) will enumerate specific assets within the boundary.

**Expected output:** Asset boundary defined with inclusions and exclusions documented
**On failure:** Define the broadest reasonable boundary; Phase 2 will refine it

### Step 4: Gather Engagement Parameters

**Tool:** Direct conversation

Collect remaining engagement context:

- **Timeline:** Is there a deadline for the assessment (audit date, board meeting, regulatory
  submission)?
- **Existing controls:** Are there existing security controls, policies, or prior risk assessments
  to incorporate?
- **Key stakeholders:** Who will receive the deliverables (CISO, board, regulator, auditor)?
- **Output preferences:** Does the executive summary need to be non-technical?

**Expected output:** Engagement parameters documented
**On failure:** Use reasonable defaults; note any unknowns in scope.md

### Step 5: Create Output Directory and Write scope.md

**Tool:** Bash (mkdir), Write

Create the output directory:
```bash
mkdir -p private/output/risk-assess/{org}-{YYYY-MM}
```

Write `scope.md` to the output directory:

```markdown
# Risk Assessment Scope

**Org:** {org name}
**Framework:** {selected framework}
**Date:** {YYYY-MM-DD}
**Assessment Driver:** {audit / regulatory mandate / proactive / other}

---

## Org Context

**Industry:** {industry}
**Size:** {size}
**Regulatory Environment:** {regulations}

## Asset Boundary

### In Scope
- {asset type 1}: {description}
- {asset type 2}: {description}
- ...

### Out of Scope
- {exclusion 1}
- {exclusion 2}

## Engagement Parameters

**Timeline:** {deadline or N/A}
**Stakeholders:** {list}
**Output Format:** {technical / executive / both}
**Existing Controls:** {yes/no — brief description}

## Framework Notes

{Framework-specific methodology notes based on selection}
```

**Expected output:** scope.md written to `private/output/risk-assess/{org}-{YYYY-MM}/scope.md`
**On failure:** If directory creation fails, check path and permissions

### Step 6: Verify Readiness

**Tool:** Direct analysis

Confirm all prerequisites for Phase 2 are met:

- Org name confirmed
- Framework selected
- Asset boundary defined
- scope.md written
- Output directory exists

**Expected output:** Readiness confirmed, completion checklist displayed to user
**On failure:** Loop back to the specific step that is incomplete

---

## OUTPUT CONTRACT

**Produces:**
- `scope.md` → `private/output/risk-assess/{org}-{YYYY-MM}/scope.md`
- Output directory created at `private/output/risk-assess/{org}-{YYYY-MM}/`

**Format:** Markdown scope document with org context, framework selection, asset boundary,
and engagement parameters.

---

## NEXT

**On success:** → Proceed to Phase 2 (Identify):

Load `skills/risk-assess/phases/02-identify.md` with:
- Org context and framework selection from this phase
- Asset boundary (inclusions and exclusions)
- Output directory path

**On failure (missing context):** → Ask user for missing information, retry this phase

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Org name confirmed
- [ ] Framework selected (one of 7 supported options)
- [ ] Asset boundary defined with inclusions and at least one explicit category
- [ ] Engagement parameters documented
- [ ] scope.md written to output directory
- [ ] Output directory exists and is writable
- [ ] Ready to proceed to Phase 2 (IDENTIFY)

**Error recovery:**
- If org name not provided: Ask directly — do not default to a placeholder
- If framework unclear: Walk through the 7 options and recommend based on regulatory context
- If asset boundary too vague: Define category types; Phase 2 will enumerate specifics
- If output directory creation fails: Check path; verify `private/output/risk-assess/` exists

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
