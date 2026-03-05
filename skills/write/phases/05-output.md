---
domain: write
skill: write
agent: writer
model: sonnet
mode: single-agent
complexity: low
chain_position: last
---

# Phase 5: OUTPUT

## IDENTITY

**Agent:** `agents/writer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Content delivery specialist. Export the approved content to the user's requested format, generate workflow metadata, and present the complete deliverable package with summary.

**Additional constraints:** This is the final phase. All prior gates must have passed. The user must receive a clear summary of what was produced and where to find it.

---

## INPUT CONTRACT

**Receives:**
- Approved draft from Phase 3: `{output_dir}/draft.md`
- QA results: `{output_dir}/qa-review.json`
- Optional images from Phase 4: `{output_dir}/`
- Research artifacts: `{output_dir}/sources.txt`, `{output_dir}/research-notes.md`

**Prerequisites:**
- Phase 3 (QA) gate passed (5.0/5.0 rating achieved)
- Phase 4 (VISUALS) gate passed (images generated OR user skipped)
- All prior deliverables exist in output directory

**Source:** `skills/write/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Export content to the user's requested format, generate metadata, and deliver the complete package.

**Success criteria:**
- User's format preference identified
- Content exported to final file: `{output_dir}/{slug}-{YYYY-MM-DD}.{ext}`
- metadata.json created with workflow summary
- User receives clear output summary with file locations

**Failure criteria:**
- Format conversion fails → use markdown as fallback
- Draft missing → STOP, return to Phase 2

---

## METHODOLOGY

**Format selection.** Ask the user which format they want. Default to markdown if no preference stated. Support markdown, HTML, and plain text natively.

**Metadata generation.** Record what the workflow produced — phases completed, QA rating, source count, image count. This provides traceability and enables future reference.

**Why ask format last:** The user may have changed their mind about the target format during the writing process. Asking at the end respects that.

---

## EXECUTION

### Step 1: Ask Format Preference

**Tool:** Direct question to user

Ask: "What format would you like for the final output?"
- Markdown (.md) — Recommended
- Branded HTML (.html) — Styled with IA brand system (requires brand files)
- Plain HTML (.html) — Basic web styling
- Plain text (.txt)
- Other (specify)

**Expected output:** Format preference
**On failure:** Default to markdown

### Step 2: Construct Filename

**Tool:** Direct analysis

Build the output filename:
- Extract topic slug (lowercase, hyphenated)
- Get current date (YYYY-MM-DD)
- Combine: `{slug}-{YYYY-MM-DD}.{ext}`
- Example: `installation-guide-2026-02-08.md`
- Output path: `{output_dir}/{slug}-{YYYY-MM-DD}.{ext}`

**Expected output:** Filename string
**On failure:** Use sanitized topic name, remove special characters

### Step 3: Export Content

**Tool:** Read + Write

Read `{output_dir}/draft.md` (approved content).

Convert to requested format:
- **Markdown:** Copy as-is (no conversion needed)
- **Branded HTML:** Keep as markdown — render-article.ts handles conversion (see Step 3b)
- **Plain HTML:** Convert markdown to HTML with basic styling
- **Plain text:** Strip markdown formatting, maintain readability with spacing

**Expected output:** Content in target format (or markdown source for Branded HTML)
**On failure:** Use markdown as fallback

### Step 3b: Render Branded HTML (Branded HTML only)

**Tool:** Bash
**Condition:** Only when user selected "Branded HTML" in Step 1

```bash
bun tools/quarto/scripts/render-article.ts \
  --input {output_dir}/draft.md \
  --title "{Article Title}" \
  --output {output_dir}/{slug}-{YYYY-MM-DD}.html
```

This produces a self-contained HTML file with `private/brand/assets/styles.css` and
`theme-light.scss` applied. Falls back to cosmo theme if brand files are absent.

**Expected output:** `{output_dir}/{slug}-{YYYY-MM-DD}.html` created
**On failure:** Log the error, fall back to Plain HTML in Step 3; continue workflow

### Step 4: Save Final Output

**Tool:** Write
**Reference:** `{output_dir}/{slug}-{YYYY-MM-DD}.{ext}`
**Condition:** Skip for Branded HTML (already written by render-article.ts in Step 3b)

Write the final content file for Markdown, Plain HTML, and Plain text formats.

**Expected output:** Final file saved
**On failure:** Check permissions, retry with different filename

### Step 5: Create Metadata

**Tool:** Write
**Reference:** `{output_dir}/metadata.json`

Generate workflow metadata:

```json
{
  "topic": "{topic-slug}",
  "title": "{Topic Title}",
  "created": "YYYY-MM-DDTHH:MM:SSZ",
  "final_format": "{format}",
  "output_file": "{output_dir}/{slug}-{YYYY-MM-DD}.{ext}",
  "workflow": {
    "phases_completed": ["research", "draft", "qa", "visuals", "output"],
    "qa_rating": 5.0,
    "sources_count": 0,
    "images_generated": 0
  },
  "templates_used": {
    "brand_voice": "templates/brand-voice-custom.md or private/input/write/brand-voice-{name}.md",
    "content_standards": "templates/content-standards-custom.md",
    "qa_criteria": "templates/qa-criteria-custom.md"
  }
}
```

**Expected output:** metadata.json written
**On failure:** Non-critical — workflow can complete without metadata

### Step 6: Present to User

**Tool:** Direct output

Display completion summary:

```
Content creation complete.

Output: private/output/write/{filename}

Deliverables:
- Branded HTML: {slug}-{YYYY-MM-DD}.html  [if branded HTML was selected]
- Final content: {filename}
- Research sources: sources.txt ({N} sources)
- QA validation: qa-review.json (Rating: 5.0/5.0)
- Images: {N} images generated [if applicable]

Workflow Summary:
- Research: {N} sources validated
- Draft: Brand voice applied consistently
- QA: 5.0/5.0 rating achieved
- Visuals: {N} images generated [or "Skipped"]
- Output: Exported to {format}

Next Steps:
- Review the final content
- Customize templates for future content (see docs/template-customization.md)
- Update brand: bun tools/quarto/scripts/manage.sh start → /report-builder-start
```

**Expected output:** User informed of all deliverables
**On failure:** At minimum, provide the output file path

### Step 7: Capture Learnings (Optional)

**Tool:** Direct analysis

Brief reflection:
- What worked well in this workflow?
- Any template adjustments needed?
- Any process improvements to note?

**Expected output:** Optional notes for future improvement
**On failure:** Non-critical — skip if not useful

---

## OUTPUT CONTRACT

**Produces:**

| File | Description | Location | Format | Consumed by |
|------|-------------|----------|--------|-------------|
| {slug}-{date}.{ext} | Final content | `{output_dir}/` | User's choice | User (deliverable) |
| {slug}-{date}.html | Branded HTML (optional) | `{output_dir}/` | Self-contained HTML | User (deliverable) |
| metadata.json | Workflow metadata | `{output_dir}/` | JSON | Reference only |

**Complete deliverable package (all flat, no subfolders):**
```
private/output/write/{slug}-{YYYY-MM-DD}/
├── {slug}-{YYYY-MM-DD}.html      # Branded HTML (if selected) — primary deliverable
├── {slug}-{YYYY-MM-DD}.{ext}    # Final content (markdown/txt if not branded HTML)
├── draft.md                      # Working draft
├── qa-review.json                # QA validation results
├── metadata.json                 # Workflow metadata
├── sources.txt                   # Validated sources
├── research-notes.md             # Research compilation
└── *.png                         # Generated images (optional)
```

---

## NEXT

**On success:** → Workflow complete. Present results to user.

This is the FINAL phase. No further phases to load.

**On failure:** → Use markdown fallback. Present whatever was produced.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Format preference confirmed
- [ ] Content exported to final format
- [ ] Output file created and validated
- [ ] metadata.json created
- [ ] All deliverables accessible
- [ ] Output location communicated to user
- [ ] Workflow marked as COMPLETE

**Error recovery:**
- Format conversion fails: Use markdown fallback
- File write error: Check permissions, retry with different location
- Invalid filename: Sanitize topic name, remove special characters
- Missing draft.md: Return to Phase 2
- User cannot access file: Provide absolute path, check permissions

---

## Quality Validation

**Before marking complete, verify:**
- [ ] **File exists** — Output file created successfully
- [ ] **Readable** — File opens and displays correctly
- [ ] **Complete** — All content from draft included
- [ ] **Formatted** — Proper format for selected type
- [ ] **Sources included** — Research sources listed
- [ ] **Accessible** — User can locate and open file

---

## Workflow Completion

**Mark workflow COMPLETE when:**
- All exit criteria satisfied
- User has been presented with deliverable summary
- All files accessible in output directory

**End of Write Skill Workflow.**

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
