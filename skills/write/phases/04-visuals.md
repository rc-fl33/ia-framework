---
domain: write
skill: write
agent: writer
model: sonnet
mode: single-agent
complexity: low
chain_position: middle
---

# Phase 4: VISUALS (Optional)

## IDENTITY

**Agent:** `agents/writer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Visual content specialist. This is an optional phase — ask the user whether images are needed. If yes, generate images using the OpenRouter API following the image style template. If no, skip and advance to OUTPUT.

**Additional constraints:** Never generate images without user confirmation. Never proceed with generation if API key is missing. This phase can be fully skipped at the user's choice.

---

## INPUT CONTRACT

**Receives:**
- Approved draft from Phase 3: `{output_dir}/draft.md`
- QA results: `{output_dir}/qa-review.json` (showing approved: true)
- Image style template: `templates/image-style-custom.md` (or `image-style-template.md`)

**Prerequisites:**
- Phase 3 (QA) gate passed (5.0/5.0 rating achieved)
- draft.md approved in output directory

**Source:** `skills/write/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Generate images to enhance content if the user requests them, or skip this phase if images are not needed.

**Success criteria (if generating):**
- User confirms images are wanted
- OPENROUTER_API_KEY verified
- Images generated following style template
- Images saved to `{output_dir}/` as `{concept}-{index}.png`

**Success criteria (if skipping):**
- User confirms images are not needed
- Phase marked as skipped

**Failure criteria:**
- API key missing and user wants images → guide to env-setup docs
- Image generation API fails → offer to skip or retry

---

## METHODOLOGY

**User-driven decision.** Always ask before generating. Image generation uses API credits and time — never assume the user wants images.

**Style template application.** When generating, read the image style template first to ensure visual consistency. All images should use the same aesthetic, color palette, and composition guidelines.

**Image generation script.** Use the dedicated CLI script for all image generation:
```
bun run skills/write/scripts/image-generate.ts --help
```
This script wires up the OpenRouter API client and the prompt optimizer into a single command. It supports topic-based generation (auto-optimized prompts), exact prompt passthrough, style overrides, model selection, and analysis-only mode. See the script's `--help` output for full documentation.

**Why this is optional:** Not all content benefits from images. Technical documentation may need diagrams (which are better created manually), while blog posts may benefit from generated hero images. Let the user decide.

---

## EXECUTION

### Step 1: Ask User

**Tool:** Direct question to user

Ask: "Do you want to generate images for this content?"
- Yes, generate images
- No, skip images

**Expected output:** User's decision
**On failure:** Default to skip if no response

### Step 2 (Skip Path): Advance to OUTPUT

If user chose "No":
- Note that VISUALS phase was skipped by user choice
- Proceed directly to Phase 5

**Expected output:** Phase skipped acknowledgment
**On failure:** N/A

### Step 3 (Generate Path): Verify API Key

**Tool:** Bash
**Command:** Check that OPENROUTER_API_KEY is set in environment

**Expected output:** API key confirmed available
**On failure:** Guide user to `../../../private/docs/infrastructure-inventory.md` for credential setup. Offer to skip phase instead.

### Step 4 (Generate Path): Read Style Template

**Tool:** Read
**Reference:** `skills/write/templates/image-style-custom.md` (if exists, else `image-style-template.md`)

Extract:
- **Aesthetic** — Visual style (minimalist, technical, illustrative, photorealistic)
- **Color palette** — Primary and secondary colors
- **Composition** — Layout preferences, perspective, framing
- **Technical specs** — Resolution, aspect ratio, file format

**Expected output:** Style guidelines loaded
**On failure:** Use sensible defaults (minimalist, professional aesthetic)

### Step 5 (Generate Path): Analyze Content for Image Opportunities

**Tool:** Direct analysis

Read the approved draft and identify:
- Key concepts that benefit from visualization
- Optimal number of images (typically 1-3)
- Image subjects and compositions

**Image opportunity types:**
- Architecture diagrams (technical documentation)
- Concept visualizations (abstract ideas)
- Hero images (blog posts, articles)
- Process diagrams (instructional content)

**Expected output:** Image plan (subjects, count, descriptions)
**On failure:** Reduce to 1-2 images if generation is limited

### Step 6 (Generate Path): Generate Images

**Tool:** Bash
**Command:**
```bash
# For each planned image, run the image generation script:
bun run skills/write/scripts/image-generate.ts \
  --topic "[concept from Step 5]" \
  --output "{output_dir}/{concept}-{index}.png" \
  --aspect-ratio 16:9

# Or with a custom style override:
bun run skills/write/scripts/image-generate.ts \
  --topic "[concept]" \
  --style "[style from template]" \
  --output "{output_dir}/{concept}-{index}.png" \
  --aspect-ratio 16:9

# To preview the optimized prompt before generating (no API call):
bun run skills/write/scripts/image-generate.ts \
  --topic "[concept]" \
  --analyze
```

For each planned image:
1. Run `--analyze` first to preview the optimized prompt (optional, no credits used)
2. Run the generation command with `--topic` and `--output`
3. Verify the image was saved to `{output_dir}/{concept}-{index}.png`

**Script options reference:**
- `--topic` — Topic/concept (prompt auto-optimized via Flux profile)
- `--prompt` — Exact prompt text (no optimization, use instead of --topic)
- `--output` — Output file path or directory
- `--style` — Style override (otherwise reads from `templates/image-style-custom.md`)
- `--model` — Model override (default: `black-forest-labs/flux.2-max`)
- `--aspect-ratio` — `1:1`, `16:9`, `9:16`, `4:3`, `3:4` (default: `16:9`)
- `--analyze` — Preview prompt analysis without generating
- `--help` — Full help with examples

**Expected output:** Images generated and saved to `{output_dir}/`
**On failure:** Check error output from script. Retry with `--analyze` to inspect prompt, adjust topic, or try a different `--model`. If persistent failure, offer to skip.

### Step 7 (Generate Path): Validate and Save

**Tool:** Read + Write

Verify:
- Images saved to `{output_dir}/` as `{concept}-{index}.png`
- Images align with style template

Optionally update draft with image references:
```markdown
![Description](./images/filename.png)
*Caption: Brief explanation*
```

**Expected output:** Images validated, draft optionally updated
**On failure:** Skip image integration in draft, keep images as separate deliverables

---

## OUTPUT CONTRACT

**Produces (if generating):**

| File | Description | Location | Format | Consumed by |
|------|-------------|----------|--------|-------------|
| {concept}-{index}.png | Generated images | `{output_dir}/` | PNG | Phase 5 (OUTPUT) |

**Produces (if skipping):**
- No files. Phase marked as skipped.

**Consumed by:** Phase 5 (OUTPUT) — images included in final deliverable package

---

## NEXT

**On success (images generated):** → Load `skills/write/phases/05-output.md`
  Pass: Approved draft + generated images

**On success (phase skipped):** → Load `skills/write/phases/05-output.md`
  Pass: Approved draft (no images)

**On failure (API issues):** → Offer user choice: retry or skip
  If skip → proceed to Phase 5 without images

---

## CHECKPOINTS

**Exit criteria (ONE path must be complete):**

**Path A — Images Generated:**
- [ ] User confirmed images wanted
- [ ] API key verified
- [ ] Images generated successfully
- [ ] Images saved to `{output_dir}/`
- [ ] Images match style template

**Path B — Phase Skipped:**
- [ ] User confirmed images not needed
- [ ] Documented skip reason

**Error recovery:**
- API key missing: Guide to env-setup docs, offer to skip
- Image generation fails: Retry with different prompt or skip phase
- Image does not match style: Regenerate with adjusted prompt
- Storage error: Check directory permissions, create directory

---

## Environment Requirements

**Required (for generation only):**
- `OPENROUTER_API_KEY` set in `.env`

**If missing:** See `../../../private/docs/infrastructure-inventory.md` for credential setup.

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
