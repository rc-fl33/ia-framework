---
name: write-research
description: Topic discovery and suggestion engine - find topics then redirect to /write
domain: write
skill: write
agent: writer
model: sonnet
complexity: low
mode: single-agent
chain_position: first
classification: public
---

# /write-research — Topic Discovery & Research Preparation

## IDENTITY

**Agent:** Base Claude (orchestrator — delegates to writer agent)

**Role:** Topic discovery and suggestion engine. Generate topic suggestions within a user-selected category, present options, and redirect the selected topic to `/write` for the full 5-phase workflow.

**Note:** This command does NOT execute the writing workflow. It discovers topics and redirects to `/write`.

---

## INPUT CONTRACT

**Receives:**
- User invocation: `/write-research [category]`
- Category must be one of: `ai`, `security`, `infrastructure`, `productivity`, `career`, `development`, `data`, `culture`

**Prerequisites:**
- User has invoked `/write-research`
- Category provided (inline or via follow-up prompt)

**Source:** User invocation (slash command)

**Category aliases:**
- `ai` or `ai-systems` — Artificial intelligence, machine learning, LLMs
- `security` or `cyber` — Cybersecurity, security tools, best practices
- `infrastructure` or `devops` — Cloud, DevOps, containers, Kubernetes
- `productivity` or `tools` — Developer tools, workflows, automation
- `career` or `hiring` — Career development, hiring, leadership
- `development` or `programming` — Software development, languages, patterns
- `data` or `databases` — Data engineering, databases, SQL
- `culture` or `management` — Team dynamics, culture, management

---

## OBJECTIVE

**Goal:** Generate topic suggestions within the selected category and redirect the user's chosen topic to `/write`.

**Success criteria:**
- 5-10 topic suggestions generated for the category
- Each suggestion includes title, difficulty level, trending indicator, and description
- User selects a topic
- Redirect message provided with `/write` command

**Failure criteria:**
- Category not recognized → show supported categories
- No topics generated → suggest using `/write` directly
- User declines all suggestions → offer alternatives or stop

---

## METHODOLOGY

**Category-based topic discovery.** For each category, generate suggestions based on:
- Current trends and relevance
- Difficulty level (introductory, intermediate, advanced)
- Depth potential (how much content the topic supports)
- Audience interest patterns

The output is a curated list, not an exhaustive search. Quality of suggestions matters more than quantity.

---

## EXECUTION

### Step 1: Validate Category

**Tool:** Direct analysis

If user provided category inline: match to supported list.
If no category: ask user to select from supported categories.
If unrecognized category: show supported categories with aliases.

**Expected output:** Validated category
**On failure:** Display supported categories list

### Step 2: Generate Suggestions

**Tool:** Direct analysis + optional WebSearch

Generate 5-10 topic suggestions for the category:
- Title (clear, descriptive)
- Level (Introductory / Intermediate / Advanced)
- Trending indicator (Yes / No)
- Depth rating (1-5)
- Description (1-2 sentences)

**Expected output:** Formatted topic list
**On failure:** Reduce to 3-5 suggestions if generation is limited

### Step 3: Present to User

**Tool:** Direct output

Display formatted topic list:

```
Topic Suggestions for [Category]

1. [Title]
   Level: [Level] | Trending: [Yes/No] | Depth: [X/5]
   Description: [1-2 sentence description]

2. [Title]
   ...

Select topic number (1-N) or type a custom topic:
```

**Expected output:** User selects a topic number or provides custom topic

### Step 4: Redirect to /write

**Tool:** Direct output

After user selects a topic, provide redirect:

```
Topic selected: "[Selected Topic Title]"

NEXT: Use this command to start the full content workflow:
/write "[Selected Topic Title]"

This will execute:
1. RESEARCH - Gather 10+ authoritative sources
2. DRAFT - Write comprehensive guide with templates
3. QA - Multi-phase validation (5.0/5.0 gate)
4. VISUALS - Optional image generation
5. OUTPUT - Export to markdown/HTML/etc.
```

**Expected output:** User has clear next step
**On failure:** If user wants different suggestions, return to Step 2

---

## OUTPUT CONTRACT

**Produces:**
- Topic suggestions displayed to user (no files created)
- Selected topic string passed via redirect command

**Format:** Interactive text output (no file artifacts)

**Consumed by:** `/write` command (via user re-invocation)

---

## NEXT

**On success:** → Redirect user to `/write [selected topic]`
  User re-invokes with the selected topic

**On failure:** → STOP
  If category invalid: show supported categories
  If no suggestions: suggest `/write` with custom topic

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Category validated against supported list
- [ ] 5-10 topic suggestions generated
- [ ] User selected a topic
- [ ] Redirect message displayed with `/write` command

**Error recovery:**
- If category not recognized: Display supported categories with aliases
- If no topics generated: "No suggestions found. Use `/write [your topic]` instead."
- If user selection invalid: "Please enter a number 1-N or type a custom topic"

---

## Usage

```bash
/write-research ai
/write-research security
/write-research infrastructure
/write-research career
```

## When to Use

**Use /write-research when:**
- Not sure what to write about
- Want topic suggestions in a specific domain
- Want trending topic discovery
- Want difficulty-appropriate suggestions

**Use /write instead when:**
- Already have a specific topic in mind
- Want to skip topic discovery

## Related Commands

| Command | Description |
|---------|-------------|
| `/write` | Full 5-phase content workflow |

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
