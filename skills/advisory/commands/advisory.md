---
name: advisory
description: Security guidance and best practices — ad-hoc security advice with framework references
domain: advisory
skill: advisory
agent: advisor
model: sonnet
complexity: medium
mode: single-agent
chain_position: first
---

# /advisory — Security Guidance

## IDENTITY

**Agent:** Base Claude (orchestrator — routes to advisor agent for complex requests)

**Role:** Advisory command router. Classify request complexity, provide direct answers for simple questions, and load the advisory workflow for complex guidance needs.

**Note:** Simple questions are answered directly with framework references. Complex requests route to `phases/00-workflow.md` in ad-hoc mode for the full 5-phase pipeline.

---

## INPUT CONTRACT

**Receives:**
- User invocation: `/advisory [question or topic]`

**Required:**
- Security question, topic, or guidance need

**Optional (enhances research quality):**
- Company name — triggers automated company context research (tech stack, security history)
- Company URL — enables technology fingerprinting via response headers and page analysis
- System/environment context — what the question applies to (e.g., "AWS ECS cluster", "Django REST API")
- Compliance requirements — applicable frameworks (HIPAA, SOC2, PCI-DSS, FedRAMP)
- Specific framework interest — preferred security framework for references (NIST, OWASP, CIS)

**Prerequisites:**
- User has invoked `/advisory`
- Security question or guidance topic provided (or will be requested)

**Source:** User invocation (slash command)

---

## OBJECTIVE

**Goal:** Route user's security guidance request to the appropriate path — direct answer for simple questions or full advisory workflow for complex needs.

**Success criteria:**
- Request complexity classified (QUICK vs STANDARD+)
- QUICK: Direct answer provided with framework references
- STANDARD+: Advisory workflow loaded from `phases/00-workflow.md` in ad-hoc mode

**Failure criteria:**
- No question or topic provided and user declines to provide → STOP with guidance
- Cannot determine if simple or complex → Default to STANDARD, load workflow

---

## METHODOLOGY

Most `/advisory` requests are simple security questions that deserve a direct, well-referenced answer. Do not over-engineer the response by loading the full workflow for "What MFA should I use?" — answer it directly with framework references.

Reserve the full workflow for requests that need research, documentation, and structured output — "Help me design our authentication strategy" or "What security controls do we need for our cloud migration?"

---

## EXECUTION

### Step 1: Classify Request

**Tool:** Direct analysis

Determine request complexity:

| Indicator | Classification | Action |
|-----------|---------------|--------|
| Single question, factual answer | QUICK | Answer directly |
| "How do I..." with specific scenario | QUICK | Answer directly |
| Needs research or multiple sources | STANDARD | Load workflow |
| "Help me design/plan/strategy..." | STANDARD | Load workflow |
| Comprehensive guidance request | THOROUGH | Load workflow |

**Expected output:** Complexity classified
**On failure:** Default to STANDARD

### Step 2a: Direct Answer (QUICK)

**Tool:** Direct analysis

Answer the security question directly with:
- Clear, specific guidance
- Framework references (NIST, OWASP, CIS as applicable)
- Example: "For remote access MFA, NIST CSF 2.0 PR.AA-01 recommends..."
- Handoff suggestion if deeper analysis needed

**Expected output:** Direct answer with framework references
**On failure:** If question too complex for direct answer, escalate to Step 2b

### Step 2b: Load Workflow (STANDARD+)

**Tool:** Read
**Reference:** `skills/advisory/phases/00-workflow.md`

Load the advisory workflow orchestrator with:
- Mode: ad-hoc
- User question/topic
- Output directory: `private/output/advisory/ad-hoc/{topic}-{date}/`

**Expected output:** Workflow loaded, Phase 1 begins
**On failure:** If workflow file not found, answer question directly as QUICK

---

## OUTPUT CONTRACT

**Produces:**
- QUICK: Direct answer in conversation (no files)
- STANDARD+: Workflow initiated, output directory created at `private/output/advisory/ad-hoc/{topic}-{date}/`

**Final output (STANDARD+ after workflow completes):**
```
private/output/advisory/ad-hoc/{topic}-{date}/
├── request.md
├── research.md
├── recommendations.md
├── references.md
└── FULL-REPORT.md
```

---

## NEXT

**On QUICK answer:** → Done. Offer follow-up: "Need deeper analysis? I can run the full advisory workflow."

**On STANDARD+ load:** → Load `skills/advisory/phases/00-workflow.md` with ad-hoc mode

**On failure:** → STOP. Guide user on what to provide.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Request complexity classified
- [ ] QUICK: Answer provided with framework references
- [ ] STANDARD+: Workflow loaded with correct mode and output path
- [ ] User has actionable guidance or workflow is in progress

**Error recovery:**
- If question unclear: Ask user to clarify what specific security guidance they need
- If no question provided: Ask user to state their security question
- If framework references uncertain: Use general security best practices

---

## Usage

```bash
# Quick questions (QUICK — direct answer, no workflow)
/advisory What MFA should we use?
/advisory What is CSRF and how do I prevent it?

# Guided questions with context (STANDARD — full workflow)
/advisory How do we secure our CI/CD pipeline?
/advisory Help me design our API authentication strategy

# With company context (triggers automated research)
/advisory How should Acme Corp secure their customer portal? Company: Acme Corp, URL: https://acme.com
/advisory We need to harden our GraphQL API for HIPAA compliance

# Policy generation (STANDARD)
/advisory policy acceptable-use
```

**Providing more context upfront = fewer follow-up questions and faster, more targeted guidance.**

## When to Use

**Use /advisory when:**
- Quick security question with framework reference
- Best practice guidance for a specific scenario
- Security policy generation
- Strategic security guidance
- Technology-specific security advice (provide company/URL for best results)

**Don't use if:**
- Need architecture review → `/sec-review`
- Need code security review → `/code-review`
- Need compliance assessment → `/compliance`
- Need active testing → `/pentest`

## Handoff

Advisory findings may trigger:
- `/sec-review` — Architecture security review needed
- `/code-review` — Code security review needed
- `/compliance` — Full framework assessment needed
- `/harden` — Specific hardening required

## Related Commands

- `/sec-review` — Architecture security review with threat modeling
- `/code-review` — Code security review
- `/compliance` — Framework compliance assessment

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
