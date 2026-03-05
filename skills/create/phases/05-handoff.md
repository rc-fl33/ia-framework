---
domain: framework
skill: create-skill
agent: engineer
model: sonnet
mode: single-agent
complexity: low
chain_position: last
---

# Phase 5: HANDOFF (User Guidance)

## IDENTITY

**Agent:** `agents/engineer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Present the user with a summary of everything created, provide clear next steps for customization, and ensure they know how to invoke and test the new skill or tool.

**Additional constraints:** Be specific about what the user needs to do next. Generic "customize your files" isn't helpful — tell them exactly which files to edit and what to add.

---

## INPUT CONTRACT

**Receives:**

| Data | Source | Format |
|------|--------|--------|
| Validation report (all passed) | Phase 4 | In-context |
| All generated file paths | Phase 3 | In-context |
| Requirements bundle | Phase 1 | In-context |

**Prerequisites:**
- [ ] Phase 4 completed — all validation checks passed

**Source:** `skills/create/phases/04-validate.md`

**What happens if input is missing:** Can still present summary from file paths.

---

## OBJECTIVE

**Goal:** Ensure the user understands what was created and how to customize, test, and use the new skill or tool.

**Success criteria:**
- User sees complete file summary
- Next steps clearly communicated (which files to edit, what to add)
- User knows how to invoke the component
- Post-creation reminders given (manifest updates, registration)

**Failure criteria:**
- None — this phase should always succeed

---

## METHODOLOGY

Handoff is user-facing communication, not technical execution. Present information clearly and specifically. The user just went through a multi-phase wizard — don't make them figure out what to do next.

**Skill handoff:** Emphasizes phase editing, domain knowledge, agent registration.
**Tool handoff:** Emphasizes script implementation, workflow docs, manifest registration under tools.

---

## EXECUTION

### Step 1: Present File Summary

**Tool:** Direct output

**If component_type is SKILL:**

```
✅ SKILL CREATED SUCCESSFULLY

Skill: {name}
Location: skills/{name}/

Files Created:
├── SKILL.md              ✅ Main skill definition (routing gate + chain map)
├── README.md             ✅ User overview
├── VERIFY.md             ✅ Definition of Done checklist
├── STATUS.md             ✅ Status tracking
├── phases/
│   ├── 00-workflow.md    ✅ Workflow orchestrator
│   ├── 01-{phase1}.md    ✅ {Phase 1 name}
│   ├── 02-{phase2}.md    ✅ {Phase 2 name}
│   ├── 03-{phase3}.md    ✅ {Phase 3 name}
│   ├── 04-{phase4}.md    ✅ {Phase 4 name}
│   └── 05-{phase5}.md    ✅ {Phase 5 name}
├── commands/{cmd}.md     ✅ User-facing command
├── commands/{name}-setup.md ✅ Setup command (if generated)
├── docs/                 📁 Add domain knowledge here
├── input/                📁 User-provided data
└── output/               📁 Skill-generated output
```

**If component_type is TOOL:**

```
✅ TOOL CREATED SUCCESSFULLY

Tool: {name}
Location: tools/{name}/

Files Created:
├── README.md             ✅ Tool overview with Quick Start
├── VERIFY.md             ✅ Validation checklist
├── STATUS.md             ✅ Status tracking
├── commands/{cmd}.md     ✅ User-facing command (if applicable)
├── commands/{name}-setup.md ✅ Setup command (if generated)
├── scripts/              📁 Add implementation scripts here
├── docs/                 📁 Add documentation here (optional)
└── data/                 📁 Runtime data (optional, gitignored)
```

### Step 2: Provide Specific Next Steps

**Tool:** Direct output

**If component_type is SKILL:**

```
## Next Steps

{if env_required:}
### 0. Run Setup (FIRST)
/{name}-setup
This validates credentials and dependencies before you start customizing.
{endif}

### 1. Edit Phase Files (most important)
The generated phases have UPS structure but placeholder content.
Fill in domain-specific logic:
- skills/{name}/phases/01-{phase1}.md → Add actual workflow steps
- skills/{name}/phases/02-{phase2}.md → Add actual workflow steps
- etc.

### 2. Add Domain Knowledge
Put reference materials in docs/:
- Standards and frameworks
- Best practices
- Example outputs

### 3. Create Output Templates (optional)
If your skill produces formatted output, add templates:
- templates/report-template.md
- templates/output-format.md

### 4. Test the Skill
/{command-name}
/{command-name} [with arguments]
```

**If component_type is TOOL:**

```
## Next Steps

{if env_required:}
### 0. Run Setup (FIRST)
/{name}-setup
This validates credentials and dependencies before you start customizing.
{endif}

### 1. Add Implementation Scripts (most important)
Add your TypeScript scripts to scripts/:
- tools/{name}/scripts/main.ts → Primary logic
- tools/{name}/scripts/utils/ → Helper functions

### 2. Add Documentation (optional)
Put operational docs in docs/:
- API documentation
- Configuration reference
- Troubleshooting guide

### 3. Test the Tool
/{command-name}
Or run scripts directly: bun tools/{name}/scripts/main.ts
```

### Step 3: Post-Creation Reminders

**Tool:** Direct output

**If component_type is SKILL:**

```
## Reminders

- [ ] Update STATUS.md after any skill changes
{if agent != "none":}
- [ ] Add skill to agents/{agent}.md skills list
{endif}
{if classification == "public":}
- [ ] Add to .framework-manifest.yaml under skills.include
- [ ] Run /git-public to sync to public repo
{endif}
{if env_required:}
- [ ] Review private/docs/{name}-env-setup.md for credential setup
- [ ] Add credentials to .env
- [ ] Run: /{name}-setup
{endif}
```

**If component_type is TOOL:**

```
## Reminders

- [ ] Update STATUS.md after any tool changes
- [ ] Add to .framework-manifest.yaml under framework.tools.include
{if classification == "public":}
- [ ] Run /git-public to sync to public repo
{endif}
{if env_required:}
- [ ] Review private/docs/{name}-env-setup.md for credential setup
- [ ] Add credentials to .env
- [ ] Run: /{name}-setup
{endif}
```

### Step 4: Show How to Invoke

**Tool:** Direct output

```
## How to Use

### Via Command
/{command-name}
/{command-name} [arguments]

### Via Direct Request
"Use the {name} {skill|tool} to [do something]"
```

### Step 5: Ask for Feedback

**Tool:** AskUserQuestion

Ask:
- Does the structure look correct?
- Any files or features missing?
- Questions about customization?

---

## OUTPUT CONTRACT

**Produces:**

| Data | Format | Consumed by |
|------|--------|-------------|
| File summary | Displayed to user | User |
| Next steps | Displayed to user | User |
| Post-creation reminders | Displayed to user | User |

---

## NEXT

**On success:** → Workflow complete.

```
Component: {name}
Type: {skill|tool}
Command: /{command-name}
Agent: {agent} (skill only)
Status: Created — ready for customization

Next: Edit {skills/{name}/phases/ | tools/{name}/scripts/} to add your logic.
Test: /{command-name}
```

**On failure:** → Should not fail. If user wants changes, edit files directly.

---

## CHECKPOINTS

- [ ] File summary presented
- [ ] Next steps communicated (specific, not generic)
- [ ] User knows how to invoke component
- [ ] Post-creation reminders given
- [ ] User feedback collected (optional)

**Error recovery:**
- User confused → Offer to explain any section
- Missing something → Return to Phase 3 to add
- User wants changes → Edit files as requested

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
