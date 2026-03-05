---
domain: write
skill: write
agent: writer
model: sonnet
mode: single-agent
complexity: medium
chain_position: middle
---

# Phase 2: DRAFT

## IDENTITY

**Agent:** `agents/writer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Content writer. Transform research into polished content following brand voice templates and content standards. Produce a complete draft with integrated source citations.

**Additional constraints:** Brand voice template must be applied. No placeholder content (TODO, TBD) allowed in the final draft. All research sources must be integrated naturally.

---

## INPUT CONTRACT

**Receives:**
- Research artifacts from Phase 1:
  - `{output_dir}/sources.txt` (10+ validated sources)
  - `{output_dir}/research-notes.md` (organized findings)
- Topic text
- Output directory: `private/output/write/{slug}-{YYYY-MM-DD}/` (referred to as `{output_dir}`)

**Prerequisites:**
- Phase 1 (RESEARCH) gate passed (10+ sources validated)
- Research files exist in {output_dir}/

**Source:** `skills/write/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Write complete content following brand voice and content standards templates, integrating research sources naturally throughout.

**Success criteria:**
- `{output_dir}/draft.md` exists and is complete
- Brand voice template guidance applied consistently
- Content standards template requirements met
- Research sources integrated with proper citations
- No placeholder content remaining

**Failure criteria:**
- Brand voice template not found → use sensible defaults, note in output
- Research files missing → STOP, return to Phase 1

---

## METHODOLOGY

**Template-driven writing.** Read brand voice and content standards templates first, then write with those guidelines internalized. This produces consistent output across different topics and sessions.

**Source integration strategy:** Weave sources naturally into the narrative. Use a mix of direct quotes (sparingly, for authority), paraphrasing (rewritten in your voice), synthesis (combining multiple sources), and evidence (data and examples). Every factual claim should trace to a source.

**Why this approach:** Templates ensure brand consistency without requiring the writer to reinvent voice decisions each time. Source integration ensures credibility and depth.

---

## EXECUTION

### Step 1: Read Templates

**Tool:** Read

**Brand voice resolution order:**
1. If `--brand [name]` was specified: use `private/docs/write/brand-voice-{name}.md`
2. Else if `skills/write/templates/brand-voice-custom.md` exists: use it
3. Else: use `skills/write/templates/brand-voice-template.md`

**Note:** Client brand guides live in `private/docs/write/` — tracked in the private repo but never synced to public. The default IA brand guide stays in `skills/write/templates/`.

Read guidance templates:
- Brand voice guide (resolved per above)
- `skills/write/templates/content-standards-custom.md` (if exists, else `content-standards-template.md`)

Extract:
- **Tone** — Professional, conversational, authoritative, friendly, etc.
- **Perspective** — First-person, second-person, third-person
- **Style** — Sentence structure, vocabulary level, formatting preferences
- **Structure** — Required sections, organization patterns
- **Length** — Target word count or content depth

**Expected output:** Voice and standards guidelines internalized
**On failure:** If brand-specific template not found → warn and fall back to custom/default. If custom templates missing, use template defaults.

### Step 2: Review Research

**Tool:** Read
**Reference:** `{output_dir}/sources.txt` and `research-notes.md`

Review all research materials:
- Key insights and themes
- Content angle identified in research phase
- Source citations for reference during writing

**Expected output:** Research context loaded
**On failure:** If research files missing → STOP, return to Phase 1

### Step 3: Write Content

**Tool:** Direct generation

Write the complete content following this structure:

```markdown
# [Title]

**[One-line summary or value proposition]**

---

## Introduction
[Hook: question, bold statement, or problem framing]
[Context: why this matters]
[Preview: what the content covers]

---

## [Main Section 1]
[Content with research integration]
**Key insight:** [Original analysis based on research]

---

## [Main Section 2]
[Content with research integration]
**Example:** [Practical application or case study]

---

## [Additional Sections as needed]

---

## Conclusion
[Summary of key points]
[Call to action or next steps]

---

## Sources
1. [Source 1 Title] - [URL]
2. [Source 2 Title] - [URL]
... (reference all sources from research phase)
```

Apply brand voice consistently:
- Opening matches voice guidelines
- Body maintains consistent tone
- Transitions feel natural
- Conclusion reinforces brand message

**Expected output:** Complete content draft
**On failure:** If section is difficult, write rough version and refine

### Step 4: Save Draft

**Tool:** Write
**Reference:** `{output_dir}/draft.md`

Save the complete draft to {output_dir}/draft.md.

**Expected output:** draft.md written successfully
**On failure:** Check permissions, retry

### Step 5: Self-Review

**Tool:** Direct analysis

Review the draft against templates:
- **Hook test** — Does opening grab attention?
- **Flow test** — Do sections connect logically?
- **Voice test** — Is tone consistent throughout?
- **Value test** — Does each section provide insight?
- **Source test** — Are research sources integrated naturally?
- **Clarity test** — Is content accessible to target audience?
- **Completeness test** — No TODO/TBD/placeholder content?

**Expected output:** Self-review passed or issues identified
**On failure:** Revise draft to address issues, re-save

### Step 6: Validate Completeness

**Tool:** Read
**Reference:** `{output_dir}/draft.md`

Verify:
- File exists and is non-empty
- No placeholder content (search for TODO, TBD, FIXME, [placeholder])
- All sections present per content structure
- Sources section includes references

**Expected output:** Draft validated as complete
**On failure:** Fix remaining issues, re-save

---

## OUTPUT CONTRACT

**Produces:**

| File | Description | Location | Format | Consumed by |
|------|-------------|----------|--------|-------------|
| draft.md | Complete content draft | `{output_dir}/` | Markdown | Phase 3 (QA) |

**Quality bar:**
- Brand voice applied consistently
- Content standards met
- Research sources integrated with citations
- No placeholder content
- Complete sections (intro through conclusion)

---

## NEXT

**On success — draft complete and validated:**

Load: `skills/write/phases/03-qa.md`

Pass forward:
- Draft at `{output_dir}/draft.md`
- Research artifacts in `{output_dir}/`

**On failure — draft incomplete:**

Loop back to Step 3. Address specific gaps.

If research insufficient for the draft: return to Phase 1 for additional sources.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Draft exists at `{output_dir}/draft.md`
- [ ] Content is complete (no placeholders)
- [ ] Brand voice applied consistently
- [ ] Content standards met
- [ ] Research sources integrated
- [ ] Self-review passed

**Error recovery:**
- Brand voice inconsistent: Review template, rewrite affected sections
- Content standards not met: Review template, add missing elements
- Placeholders remaining: Complete all TODO/TBD sections
- Sources not integrated: Add citations and source references
- Structure unclear: Reorganize using content structure guide

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
