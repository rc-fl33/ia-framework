# Requirements Gathering Questions

**Detailed question templates for Phase 1: DISCOVER**

Use **AskUserQuestion** to collect all required information for skill or tool creation.

---

## Question 0: Component Type

```
Question: "What are you creating?"
Options:
- Skill (Recommended) - Multi-phase workflow producing deliverables (e.g., career analysis, security testing)
- Tool - Infrastructure utility for framework operations (e.g., git operations, monitoring)
```

**Note:** If `--tool` flag was passed via `/create --tool`, skip this question and set `component_type: tool`.

---

## Question 1: Identity

```
Question: "What should this be called and what does it do?"
Options:
- Folder name (lowercase-with-dashes)
  - Skill: goes under skills/
  - Tool: goes under tools/
- One-line description
```

---

## Question 2: Problem & Solution

```
Question: "What problem does this solve?"
Options:
- Problem statement (pain point)
- Solution approach (how it solves it)
```

---

## Question 3: Workflows/Modes (SKIP for tools)

```
Question: "What workflows or modes will this skill have?"
Options:
- List of modes (comma-separated)
- Primary workflow description
```

**SKIP this question if component_type is tool.** Tools don't have phase-based workflows.

---

## Question 4: Agent Routing (SKIP for tools)

```
Question: "Which agent should execute this skill?"
Options:
- security (pentesting, code review, vulnerability assessment)
- engineer (infrastructure, remediation, hardening)
- writer (blog, docs, reports)
- advisor (research, career, QA)
- legal (compliance, legal analysis)
- none (base Claude executes directly)
```

**SKIP this question if component_type is tool.** Tools operate as infrastructure and don't require agent routing.

---

## Question 5: User-Facing Command

```
Question: "Should this be a user-invocable slash command?"
Options:
- Yes (default) - Create /command for users
- No - Claude-internal only
```

---

## Question 6: Command Name (if user-facing)

```
Question: "What should the command be called?"
Note: MUST differ from skill folder name
Examples:
- Skill: security-testing → Command: /pentest
- Skill: code-security → Command: /code-review
- Tool: git → Command: /git-push
```

---

## Question 7: Visibility

```
Question: "Should this be public or private?"
Options:
- Private (default) - Test thoroughly before making public
- Public - Only after testing and approval
```

**Note:** All new components default to `classification: private`. Only change to public after:
- Component is fully tested and working
- No sensitive/personal information
- Ready for community use

---

## Question 8: ENV/Credential Requirements

```
Question: "Does this require API keys, credentials, or external integrations?"
Options:
- No external APIs - uses internal resources only
- Yes, requires credentials (I'll document what's needed)
- Yes, multiple API integrations (complex)
- Unsure - will determine during implementation
```

If "Yes" → Collect list of required APIs/services for ENV documentation generation.

---

## Question 9: Library/API Dependencies

**CRITICAL: Check existing tools BEFORE implementing new API clients**

```
Question: "Does this need external API integrations (NVD, Context7, OpenRouter, etc.)?"
Options:
- No - Internal resources only
- Yes - External APIs needed (check library first)
- Unsure - Need to explore requirements
```

**If "Yes" or "Unsure":**

1. **Check Tool Catalog First:**
   ```bash
   # Read the catalog
   cat docs/catalogs/tool-catalog.md
   ```

2. **Search for existing API clients:**
   - `tools/nvd/` - CVE vulnerability database
   - `tools/api/context7/` - Library documentation search
   - `tools/api/openrouter/` - Multi-model LLM access
   - `tools/api/grok/` - Image/video generation

3. **Before creating new API client, ask:**
   - Is this API already implemented in `tools/api/`?
   - Could an existing client be extended instead?
   - Is this truly shared (used by 2+ skills) or skill-specific?

**Decision tree:**
- Shared API (used by multiple skills) → Create in `tools/api/[api-name]/`
- Skill-specific API (only this skill uses it) → Create in `skills/[skill-name]/scripts/api/`
- Duplicate implementation → Use existing `tools/api/` client

**Framework philosophy:** Solve once, reuse forever.

---

## Requirements Checklist

- [ ] Component type selected (skill or tool)
- [ ] Folder name (lowercase-with-dashes)
- [ ] One-line description
- [ ] Problem statement
- [ ] Solution approach
- [ ] Workflows/modes list (skill only)
- [ ] Agent selection (skill only)
- [ ] User-facing command decision
- [ ] Command name (if applicable)
- [ ] Public/private visibility
- [ ] ENV/credential requirements assessed
- [ ] **Library/API dependencies checked** (tool-catalog.md reviewed)
- [ ] **Existing library clients identified** (no duplicate implementations)

---

**Referenced by:** `skills/create/SKILL.md` → Phase 1: DISCOVER
