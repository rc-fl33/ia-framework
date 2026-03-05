---
domain: gap-analysis
skill: gap-analysis
agent: advisor
model: sonnet
mode: single-agent
complexity: medium
chain_position: first
---

# Phase 1: INTAKE (Engagement Setup & Framework Acquisition)

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Gather engagement details, verify framework resources, acquire missing frameworks, merge questions across frameworks, launch background OSINT research, and generate the assessment questionnaire. This is the entry point for all gap analysis assessments.

**Additional constraints:** Do not begin assessment questions until all frameworks are verified and questionnaire is generated. Framework acquisition may require manual user action for restricted frameworks (ISO, PCI-DSS).

---

## INPUT CONTRACT

**Receives:**
- User's gap analysis request (from `/gap-analysis` command)
- Optional: specific framework names (e.g., "HIPAA and NIST CSF")
- Optional: client name, assessor name
- Output directory: `private/output/gap-analysis/{client}-{YYYY-MM}/`

**Prerequisites:**
- User has invoked `/gap-analysis`
- Framework directory accessible: `standards/frameworks/`
- Scripts accessible: `tools/standards/`

**Source:** `skills/gap-analysis/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Establish the engagement, verify all required frameworks are available, generate the merged assessment questionnaire, and prepare for the ASSESS phase.

**Success criteria:**
- Organization name, assessor, and framework list confirmed
- All frameworks verified (manifest, questions, reference materials)
- Missing frameworks acquired or flagged for manual acquisition
- Merged questionnaire generated (multi-framework deduplication)
- OSINT background research launched
- Assessment scope selected (full or specific domains)

**Failure criteria:**
- Required framework unavailable and user declines to acquire manually
- User cancels engagement setup

---

## METHODOLOGY

**Intake establishes the assessment foundation.** Every subsequent phase depends on the questionnaire generated here. A poorly scoped intake leads to gaps in coverage and wasted effort.

**Framework verification priority:**
1. Check manifest exists (minimum viable framework)
2. Check questions exist (enables structured interview)
3. Check reference materials exist (enables detailed control mapping)
4. Missing resources degrade gracefully: no questions means generic NIST CSF questions; no reference means less detailed control mapping

**Multi-framework handling:** When multiple frameworks are selected, the question merger (`tools/standards/question-merger.ts`) deduplicates questions by shared control domain. This reduces interview burden significantly (e.g., HIPAA + NIST CSF + PCI-DSS: 60 questions deduplicated to approximately 23).

**OSINT is launched in parallel** to save time. Background research runs while the user confirms engagement details and framework readiness.

---

## EXECUTION

### Step 1: Gather Engagement Details

**Tool:** Direct interaction (ask user)

Gather basic information:

1. What organization is being assessed? → `{organization_name}`
2. Who is conducting this assessment? → Internal team / Third-party assessor: `{assessor_name}`
3. What compliance framework(s) does this engagement require? → `{framework_list}`

Examples: "HIPAA and NIST CSF", "PCI-DSS v4.0.1", "FedRAMP Moderate", "SOC 2 Type II", "ISO 27001"

**Expected output:** Organization name, assessor, framework list confirmed
**On failure:** If user unsure about frameworks, load `standards/mappings/industry-frameworks.yaml` and suggest based on industry

### Step 2: Create Engagement Folder

**Tool:** Bash (directory creation)

Create output directory structure:

```
private/output/gap-analysis/{client-slug}-{YYYY-MM}/
├── metadata.yaml
├── intake/
├── assessment/
├── deliverables/
└── evidence/
```

**Expected output:** Directory structure created
**On failure:** Check permissions, try alternate path

### Step 3: Collect Assessment Context

**Tool:** Read, Write, Direct interaction (ask user)

Collect context variables for all templates:

- Organization name, short name, URL, industry
- Primary contact (name, title, email)
- CISO/security lead (name, title, email)
- Legal contact (name, title, email)
- Assessment date and scope type

Write populated values to `output/{client}/00-engagement/context.yaml`.

**Expected output:** Populated `context.yaml` in output directory
**On failure:** Proceed with available values; user can update manually

### Step 4: Framework Resource Check

**Tool:** Glob
**Pattern:** `standards/frameworks/{framework}/manifest.yaml`

For each requested framework, check:
- `standards/frameworks/{name}/manifest.yaml` exists
- `standards/frameworks/{name}/questions.yaml` exists
- `standards/frameworks/{name}/reference/` has content

Report framework status to user:
```
Framework Resource Check:

[OK] HIPAA
   - Manifest: Found (v45 CFR 164)
   - Questions: 18 questions loaded
   - Reference: 12 PDF chunks available

[MISSING] SOC 2
   - Manifest: Found
   - Questions: NOT FOUND - using generic questions
   - Reference: NOT FOUND - need to acquire
```

**Expected output:** Framework status report
**On failure:** Proceed to Step 5 for acquisition

### Step 5: Framework Acquisition (If Missing)

**Tool:** Bash (for downloads), WebFetch (for GitHub-hosted frameworks)

For missing frameworks, follow acquisition based on source type:

| Framework | Official Source | Format |
|-----------|----------------|--------|
| NIST CSF | https://www.nist.gov/cyberframework | PDF |
| NIST 800-53 | https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final | PDF |
| FedRAMP | https://github.com/GSA/fedramp-automation | OSCAL (JSON/YAML) |
| PCI-DSS | https://www.pcisecuritystandards.org/ | PDF (requires account) |
| HIPAA | https://www.hhs.gov/hipaa/ | PDF |
| ISO 27001 | https://www.iso.org/ | PDF (purchase required) |
| SOC 2 | https://www.aicpa.org/ | Guidance docs |
| GDPR | https://gdpr.eu/ | Text/PDF |

For restricted frameworks, notify user of manual acquisition steps.

After acquisition, generate manifest:
```bash
bun run tools/standards/generate-manifest.ts --framework {framework}
```

**Expected output:** All frameworks ready or flagged for manual acquisition

### Step 6: Confirm Framework Readiness

**Tool:** Direct interaction (ask user)

Present readiness summary and get confirmation before proceeding.

**Expected output:** User confirms readiness

### Step 7: Merge Questions (Multi-Framework)

**Tool:** Bash
**Reference:** `tools/standards/question-merger.ts`

If multiple frameworks selected:

```bash
bun run tools/standards/question-merger.ts \
  --frameworks {framework1},{framework2} \
  --output private/output/gap-analysis/{client}/intake/merged-questionnaire.yaml
```

For single framework, load questions directly:
```bash
cat standards/frameworks/{framework}/questions.yaml
```

**Expected output:** Assessment questionnaire generated

### Step 8: Launch Background Research (OSINT)

**Tool:** Task (background)

```
Task(subagent_type="advisor", run_in_background=true,
  prompt="OSINT research for {organization}:
    1. Company profile, size, locations
    2. Recent security incidents
    3. Regulatory filings
    4. Technology stack
    5. Leadership (CISO, CTO)

    Output: private/output/gap-analysis/{client}/intake/osint-summary.md")
```

**Expected output:** OSINT research initiated
**On failure:** Skip OSINT, proceed without (non-blocking)

### Step 9: Select Assessment Scope

**Tool:** Direct interaction (ask user)

```
What should this assessment cover?

1. Full Assessment - All controls for selected frameworks
2. Specific control domains - Select below:
   [ ] Governance & Policies
   [ ] Asset Management & Risk Assessment
   [ ] Access Control & Identity
   [ ] Data Protection & Encryption
   [ ] Monitoring & Detection
   [ ] Incident Response
   [ ] Business Continuity & Recovery
```

**Expected output:** Assessment scope confirmed

### Step 10: Write Intake Summary

**Tool:** Write

Write intake summary to `private/output/gap-analysis/{client}/intake/metadata.yaml`:

```yaml
engagement:
  organization: {name}
  assessor: {assessor}
  date: {date}

frameworks:
  - name: hipaa
    version: "45 CFR 164"
    questions: 18
    native_categories: [164.308, 164.310, 164.312, 164.314, 164.316]

scope:
  domains: [governance, asset_management, access_control, data_protection, monitoring, incident_response, business_continuity]
  merged_questions: 23

next_step: phases/02-assess.md
```

**Expected output:** Metadata written, ready for Phase 2

---

## OUTPUT CONTRACT

**Produces:**
- `private/output/gap-analysis/{client}/intake/metadata.yaml`
- `private/output/gap-analysis/{client}/intake/merged-questionnaire.yaml`
- `private/output/gap-analysis/{client}/intake/osint-summary.md` (async)
- `private/output/gap-analysis/{client}/00-engagement/context.yaml`

---

## NEXT

**On success:** Load `skills/gap-analysis/phases/02-assess.md`

**On partial (missing frameworks):** Proceed with available frameworks, note gaps in metadata

**On failure:** STOP. Guide user on framework acquisition.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Organization name, assessor, and framework list confirmed
- [ ] Engagement folder created with proper structure
- [ ] Assessment context collected and written to context.yaml
- [ ] All frameworks verified (manifest exists at minimum)
- [ ] Assessment questionnaire generated (merged or single-framework)
- [ ] Assessment scope selected
- [ ] Intake metadata written to `intake/metadata.yaml`

**Error recovery:**
- If framework missing: Follow acquisition workflow, notify user of manual steps
- If question merger fails: Fall back to loading questions directly from framework YAML
- If OSINT fails: Proceed without background research (non-blocking)
- If user unsure about industry: Use `standards/mappings/industry-frameworks.yaml` to suggest

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
