# Routing Gate Template - Comprehensive Guide

**Purpose:** Master template for all routing gates in IA Framework
**Created:** 2026-01-22
**Version:** 1.0.0

---

## Overview

Routing gates enforce the orchestrator pattern by ensuring:
1. **Base Claude** routes specialized work to agents (doesn't execute it)
2. **Agents** verify identity before executing skills
3. **Skills** verify agent identity before allowing execution

This creates a **three-layer defense** against incorrect routing.

---

## Three Types of Routing Gates

### 1. Framework Routing Gate (CLAUDE.md)
**Location:** `CLAUDE.md` (lines 0-20)
**Purpose:** Define Base Claude as orchestrator, not executor

```markdown
> **⛔ YOUR PRIMARY ROLE - READ THIS FIRST**
>
> **You are BASE CLAUDE - the ORCHESTRATOR.**
>
> **BEFORE delegating ANY request:**
>
> 1. **Enrich user input** via intent enrichment layer
>    ```typescript
>    const enriched = await enrichUserIntent(userRequest);
>    ```
>
> 2. **Check routing decision tree:**
>    ```
>    Is this basic file/git operations?
>        ↓ YES → Handle directly (Read, Write, Bash)
>        ↓ NO → Continue
>        ↓
>    Is this specialized work? (security, content, implementation, legal, advisory)
>        ↓ YES → DELEGATE to appropriate agent via Task()
>        ↓ NO → Continue
>        ↓
>    Are there 3+ independent tasks with no dependencies?
>        ↓ YES → SPAWN PARALLEL AGENTS (single message, multiple Task calls)
>        ↓ NO → Spawn single agent
>    ```
>
> 3. **Delegate with ENRICHED prompt:**
>    ```typescript
>    // User says: "Write a blog post"
>    // You send enriched prompt with: topic, phases, QA threshold, output path
>
>    Task(subagent_type=enriched.agent, prompt=enriched.explicitPrompt)
>    ```
>
> **Available agents:** engineer, legal, writer, security, advisor
>
> **DO NOT execute these directly:**
> - Security testing → Task(subagent_type="security")
> - Content writing → Task(subagent_type="writer")
> - Infrastructure implementation → Task(subagent_type="engineer")
> - Advisory work → Task(subagent_type="advisor")
> - Legal/compliance → Task(subagent_type="legal")
>
> **YOU ONLY handle:**
> - File operations (Read, Write, Edit)
> - Git operations (status, diff, log)
> - Navigation (Glob, Grep)
> - Routing and delegation
> - Quality validation
>
> **STOP executing specialized work. ENRICH and DELEGATE NOW.**
```

### 2. Agent Routing Gate (agents/*.md)
**Location:** `agents/{agent}.md` (lines 0-30)
**Purpose:** Verify agent identity, ensure skill match

```markdown
> **⛔ AGENT IDENTITY - READ THIS FIRST**
>
> **You are the {agent_name} agent.**
>
> **Domain:** {agent_domain}
>
> **BEFORE executing ANY task:**
>
> 1. **Verify identity match:**
>    ```
>    Does this request match my domain?
>        ↓ YES → Proceed to load skill
>        ↓ NO → STOP and explain mismatch
>    ```
>
> 2. **Check request clarity:**
>    ```
>    Does the request include complete context?
>        ↓ YES → Proceed
>        ↓ NO → Request clarification or suggest re-enrichment
>    ```
>
> 3. **Load appropriate skill:**
>    ```typescript
>    // Read skill SKILL.md to get workflow
>    const skill = Read(`skills/{skill_name}/SKILL.md`);
>
>    // Verify skill requires this agent
>    if (skill.agent !== "{agent_name}") {
>      // Mismatch - route to correct agent
>      Task(subagent_type=skill.agent, prompt=userRequest)
>    }
>    ```
>
> **YOU HANDLE:**
> - {list of tasks this agent handles}
>
> **YOU DO NOT HANDLE:**
> - {list of tasks this agent does NOT handle}
>
> **Available skills:**
> - {list of skills for this agent}
>
> **If domain mismatch:**
> - STOP execution
> - Explain which agent should handle this
> - DELEGATE: `Task(subagent_type="correct-agent", prompt=userRequest)`
>
> **If unclear request:**
> - STOP execution
> - Request missing context
> - Suggest base Claude re-enrich the request
>
> **VERIFY IDENTITY BEFORE PROCEEDING. DELEGATE IF MISMATCHED.**
```

### 3. Skill Routing Gate (skills/*/SKILL.md)
**Location:** `skills/{skill}/SKILL.md` (lines 0-20)
**Purpose:** Force immediate delegation if wrong agent

```markdown
> **⛔ ROUTING GATE - READ THIS FIRST**
>
> **This skill requires the `{agent_name}` agent.**
>
> **Identity check:** If you are NOT the `{agent_name}` agent → STOP and delegate:
>
> ```typescript
> Task(subagent_type="{agent_name}", prompt="Execute {skill_name} skill. Request: {user_request}")
> ```
>
> **DO NOT:**
> - Read files beyond this SKILL.md
> - Search web or external resources
> - Create todos or project files
> - Execute workflows or scripts
> - Load other skills
>
> **STOP HERE. DELEGATE NOW.**
>
> **If you ARE the {agent_name} agent:**
> - ✅ Proceed to read this SKILL.md
> - ✅ Load workflow phases below
> - ✅ Execute with provided context
```

---

## Language Requirements

All routing gates MUST use **forceful, imperative language**:

### Command Verbs (REQUIRED)
- STOP
- DELEGATE
- VERIFY
- PROCEED
- ENRICH (framework only)

### Imperatives (REQUIRED)
- DO NOT
- MUST
- ONLY
- ALWAYS
- NEVER

### Identity Checks (REQUIRED)
- "If you are NOT the X agent"
- "Does this match my domain?"
- "You are BASE CLAUDE"
- "You are the {agent} agent"

### Code Examples (REQUIRED)
- Show exact `Task()` syntax
- Include prompt parameter
- Show decision trees with arrows (→)

---

## Validation Rules

### Position Rules
| Type | Location | Lines | Before |
|------|----------|-------|--------|
| Framework | CLAUDE.md | 0-30 | All content |
| Agent | agents/*.md | 0-40 | All content |
| Skill | skills/*/SKILL.md | 0-25 | YAML frontmatter |

### Format Rules
- ✅ Blockquote formatting (>)
- ✅ Emoji (⛔)
- ✅ Section headers in bold
- ✅ Code blocks with syntax highlighting
- ✅ Decision trees with arrows
- ✅ Clear "DO NOT" prohibition lists
- ✅ Clear "YOU ONLY/HANDLE" permission lists

### Content Rules
- ✅ Identity statement (who is reading this)
- ✅ Verification step (how to check identity)
- ✅ Delegation code (how to route if wrong)
- ✅ Prohibition list (what NOT to do)
- ✅ Permission list (what TO do)
- ✅ Double command (e.g., "STOP HERE. DELEGATE NOW.")

---

## Pre-Commit Validation

Routing gates are validated by `hooks/validate-routing-gates.ts`:

### Checks
1. **Position** - Gate in correct line range
2. **Format** - Blockquote, emoji, bold headers
3. **Language** - Command verbs present
4. **Content** - All required sections present
5. **Syntax** - Valid code examples
6. **Agent match** - Skill agent matches frontmatter

### Exit Codes
- `0` - All gates valid
- `2` - Validation failed (blocks commit)

---

## Generator Tool

Use `tools/generators/routing-gate-generator.ts` to:
- Generate routing gates from frontmatter
- Update existing gates to match template
- Validate gate compliance

```bash
# Generate gates for all skills
bun tools/generators/routing-gate-generator.ts --all

# Generate gate for specific skill
bun tools/generators/routing-gate-generator.ts --skill security

# Validate without modifying
bun tools/generators/routing-gate-generator.ts --validate
```

---

## Template Variables

### Skill Routing Gate
- `{skill_name}` - Skill directory name
- `{agent_name}` - Required agent from frontmatter
- `{skill_description}` - Brief description

### Agent Routing Gate
- `{agent_name}` - Agent name (security, writer, etc.)
- `{agent_domain}` - Domain description
- `{agent_tasks}` - Tasks handled
- `{agent_not_tasks}` - Tasks NOT handled
- `{skills_list}` - Available skills

### Framework Routing Gate
- `{agents_list}` - All available agents
- `{parallel_threshold}` - Task count for parallel (default: 3)

---

## Examples

### Good Routing Gate (Security Skill)
```markdown
> **⛔ ROUTING GATE - READ THIS FIRST**
>
> **This skill requires the `security` agent.**
>
> **Identity check:** If you are NOT the `security` agent → STOP and delegate:
>
> ```typescript
> Task(subagent_type="security", prompt="Execute security skill. Request: {user_request}")
> ```
>
> **DO NOT:**
> - Read files beyond this SKILL.md
> - Use WebSearch for scope discovery
> - Create todos or project files
> - Execute workflows or scripts
>
> **STOP HERE. DELEGATE NOW.**
>
> **If you ARE the security agent:**
> - ✅ Proceed to read this SKILL.md
> - ✅ Load workflow phases below
> - ✅ Execute with provided context
```

### Bad Routing Gate (Too Weak)
```markdown
> Note: This skill works best with the security agent.
>
> If you're not the security agent, you might want to delegate.
```

**Problems:**
- ❌ No emoji
- ❌ Weak language ("works best", "might want")
- ❌ No code example
- ❌ No prohibition list
- ❌ No command verbs (STOP, DELEGATE)

---

## Common Mistakes

### 1. Weak Language
❌ "You might want to delegate"
✅ "STOP and delegate"

### 2. Missing Code Example
❌ Just describing delegation
✅ Show exact `Task()` syntax

### 3. Wrong Position
❌ Routing gate after frontmatter
✅ Routing gate before frontmatter

### 4. No Prohibition List
❌ Only saying what to do
✅ Explicit DO NOT list

### 5. No Identity Check
❌ Assuming agent identity
✅ Explicit "If you are NOT..." check

---

## Integration with Orchestration Engine

Routing gates work with the orchestration layer to:
1. **Detect routing violations** - Base Claude executing specialized work
2. **Force delegation** - Intercept and redirect
3. **Track routing decisions** - Log routing choices
4. **Validate agent identity** - Verify correct agent loaded

---

## Testing

Test routing gates with `tools/validation/test-routing-gates.ts`:

```bash
# Test all routing gates
bun tools/validation/test-routing-gates.ts

# Test specific skill
bun tools/validation/test-routing-gates.ts --skill security

# Show detailed errors
bun tools/validation/test-routing-gates.ts --verbose
```

---

## Maintenance

### When to Update Gates
- New agent added
- Agent responsibilities change
- Skill changes agent requirement
- Framework routing logic changes

### How to Update Gates
1. Update template in `docs/templates/`
2. Run generator: `bun tools/generators/routing-gate-generator.ts --all`
3. Review changes in git diff
4. Test with validation tool
5. Commit changes

---

## References

- **Implementation Plan:** `plans/framework-orchestration-validation-complete.md`
- **Orchestrator Design:** `docs/ORCHESTRATOR-ROLE-UPDATE.md`
- **Parallel Orchestration:** `docs/guides/patterns/parallel-orchestration.md`
- **Agent Format Standards:** `docs/standards/agent-format-standards.md`

---

**Status:** Complete and enforced via pre-commit hooks
**Framework:** Intelligence Adjacent (IA) v2.0
