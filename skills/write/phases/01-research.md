---
domain: write
skill: write
agent: writer
model: sonnet
mode: single-agent
complexity: medium
chain_position: first
---

# Phase 1: RESEARCH

## IDENTITY

**Agent:** `agents/writer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Research specialist. Gather, validate, and document credible sources to ensure content accuracy and depth. Build the factual foundation for all subsequent phases.

**Additional constraints:** Minimum 10 sources required — no exceptions. All sources must be accessible and credible. Internal framework files do not count as external sources.

---

## INPUT CONTRACT

**Receives:**
- Topic text (from workflow orchestrator)
- Output directory: `{output_dir}/`

**Prerequisites:**
- Topic is defined
- Output directory exists (created by workflow orchestrator or command)

**Source:** `skills/write/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Gather 10+ validated, accessible sources and compile research notes that will inform the DRAFT phase.

**Success criteria:**
- 10+ sources documented in `{output_dir}/sources.txt`
- All sources have accessible URLs
- All sources are credible and relevant to topic
- Key insights extracted to `{output_dir}/research-notes.md`
- Content angle identified (what makes this content unique)

**Failure criteria:**
- Cannot find 10 credible sources after exhaustive search → broaden topic scope
- All sources paywalled or inaccessible → find open-access alternatives

---

## METHODOLOGY

**Source validation strategy:** Quality over quantity. Each source must be independently accessible, from a credible author or organization, and directly relevant to the topic. Prioritize official documentation, recognized experts, and peer-reviewed content.

**Why 10+ sources:** This threshold ensures sufficient depth to synthesize original insights rather than parroting a single perspective. Multiple sources enable cross-referencing claims and identifying consensus vs. minority viewpoints.

**Research organization:** Group findings by theme to make the DRAFT phase more efficient. Identify the unique angle early — what this content will say that existing content does not.

---

## EXECUTION

### Step 1: Create Output Directory

**Tool:** Bash
**Command:** `mkdir -p private/output/write/{slug}-{YYYY-MM-DD}`

Ensure the per-post output directory exists. All artifacts go flat in this directory — no subfolders.

**Expected output:** Directory created or already exists
**On failure:** Check filesystem permissions

### Step 2: Search for Sources

**Tool:** WebSearch

Execute multiple searches to gather diverse sources:
- Primary topic search (exact topic)
- Related concept searches (supporting topics)
- Expert opinion searches (author-specific)
- Official documentation searches (if technical topic)

**Expected output:** 15-20 candidate URLs (more than needed to allow filtering)
**On failure:** Broaden search terms, try alternative phrasings

### Step 3: Validate Sources

**Tool:** WebFetch (for each candidate source)

For each candidate source, verify:
- URL is accessible (not 404, not paywalled)
- Source is credible (official docs, reputable sites, expert authors)
- Content is relevant to the topic
- Information is current (or historically relevant if needed)

**Source Quality Standards:**

Valid sources:
- Official documentation (framework, library, tool docs)
- Technical blog posts from reputable authors
- Academic papers or research
- Industry reports and whitepapers
- Expert interviews or talks
- Well-maintained GitHub repositories
- Reputable news outlets

Invalid sources:
- Internal framework files (not external sources)
- Unverified or anonymous blogs
- Social media posts (unless from verified experts)
- Paywalled content (inaccessible to readers)
- Broken or dead links

**Expected output:** 10+ validated sources
**On failure:** Continue searching until 10+ valid sources collected

### Step 4: Extract Key Insights

**Tool:** Direct analysis

For each validated source:
- What is new or unique in this source?
- How does it support the content goal?
- What evidence or examples does it provide?

**Expected output:** Insight summary per source
**On failure:** If source lacks actionable insights, replace with better source

### Step 5: Document Research

**Tool:** Write

Create two files:

**`{output_dir}/sources.txt`:**
```
1. [Source Title] - [Full URL]
   Key insight: [What you learned]
   Relevance: [How it supports the content goal]

2. [Source Title] - [Full URL]
   Key insight: [What you learned]
   Relevance: [How it supports the content goal]

... (continue for all 10+ sources)
```

**`{output_dir}/research-notes.md`:**
```markdown
# Research Notes: [Content Topic]

## Theme 1: [Major Topic Area]
[Findings from sources]
Sources: [1, 3, 7]

## Theme 2: [Major Topic Area]
[Findings from sources]
Sources: [2, 5]

## Key Insights
- [Original insight synthesized from sources]
- [What's new that others haven't covered]

## Content Angle
[How this research will inform the unique perspective]
```

**Expected output:** Both files written to private/output/write/{slug}-{YYYY-MM-DD}/
**On failure:** If Write fails, check permissions and retry

### Step 6: Verify Source Count

**Tool:** Read
**Reference:** `{output_dir}/sources.txt`

Count the number of documented sources. Must be 10 or more.

**Expected output:** Source count >= 10
**On failure:** Return to Step 2, gather additional sources

---

## OUTPUT CONTRACT

**Produces:**

| File | Description | Location | Format | Consumed by |
|------|-------------|----------|--------|-------------|
| sources.txt | Validated source list (10+) | `{output_dir}/` | Text | Phase 2 (DRAFT) |
| research-notes.md | Organized research notes | `{output_dir}/` | Markdown | Phase 2 (DRAFT) |

**Quality bar:**
- 10+ sources with accessible URLs
- Each source has key insight and relevance noted
- Research notes organized by theme
- Content angle identified

---

## NEXT

**On success — 10+ sources validated:**

Load: `skills/write/phases/02-draft.md`

Pass forward:
- Research artifacts in `{output_dir}/` (sources.txt, research-notes.md)
- Topic text
- Output directory path (`{output_dir}/`)

**On failure — insufficient sources:**

Loop back to Step 2. Broaden search terms.

If after 3 search iterations still below 10: present what was found, ask user if they want to proceed with fewer sources or provide additional search terms.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] 10+ sources documented in sources.txt
- [ ] All sources validated (accessible, credible, relevant)
- [ ] Research notes compiled in research-notes.md
- [ ] Key insights extracted
- [ ] Content angle identified

**Error recovery:**
- Fewer than 10 sources: Continue gathering until 10+ collected
- Source URL broken: Find alternative source or updated URL
- Source not credible: Replace with credible source
- Topic too narrow: Broaden scope or find related topic sources
- All sources paywalled: Find open-access alternatives

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
