# Skill Structure Standards

**Required directory structure for all skills.**

---

## Complete Structure

```
skills/[skill-name]/
├── SKILL.md              # Skill definition (YAML frontmatter, chain map)
├── README.md             # User-facing documentation
├── STATUS.md             # Implementation status tracking
├── VERIFY.md             # Validation checklist
├── commands/             # Slash commands (symlinked to /commands/)
│   └── [command].md      # Command definition (universal prompt structure)
├── phases/               # Workflow execution (universal prompt structure)
│   ├── 00-workflow.md    # Workflow orchestrator prompt
│   ├── 01-[phase1].md
│   ├── 02-[phase2].md
│   ├── 03-[phase3].md
│   ├── 04-[phase4].md
│   └── 05-[phase5].md
├── prompts/              # OPTIONAL: Technique prompts (universal prompt structure)
│   ├── shared/           # Reusable components (@include)
│   └── {category}/       # Domain-specific technique prompts
                          # Note: shared methodologies live at repo root methodologies/
├── docs/                 # Domain knowledge base
│   └── *.md              # Reference documentation
├── templates/            # Output templates
│   └── *.md              # Report templates, formats
├── scripts/              # Automation (TypeScript/Python)
│   └── *.ts              # Skill-specific scripts
├── input/                # SYMLINK to /private/input/[skill]/
└── output/               # SYMLINK to /private/output/[skill]/

# ACTUAL DATA LOCATIONS (NOT inside skills/):
/private/
├── input/[skill-name]/   # User-provided data
│   └── .gitkeep          # Preserves directory in git
├── output/[skill-name]/  # Skill-generated deliverables
│   └── .gitkeep          # Preserves directory in git
└── books/[topic]/        # Reference PDFs (shared across all skills)
    └── [reference].pdf
```

**Key Point:** `skills/{skill}/input/` and `skills/{skill}/output/` are SYMLINKS to `/private/input/{skill}/` and `/private/output/{skill}/` for convenience. This keeps skill folders lightweight while giving scripts easy access to data.

**All files that instruct agents follow the universal prompt structure:**
`docs/guides/universal-prompt-structure.md`

This includes commands, workflow orchestrators (00-workflow.md), phase files, and technique prompts. Every prompt has: METADATA, IDENTITY, INPUT CONTRACT, OBJECTIVE, METHODOLOGY, EXECUTION, OUTPUT CONTRACT, NEXT, CHECKPOINTS.

**IDENTITY is lightweight — it references the agent file, not duplicates it.**
The `agent:` field in METADATA loads `agents/[agent].md` automatically. The IDENTITY section in each prompt adds ONLY phase-specific context (1-3 lines). Agent identity (expertise, constraints, methodology, tool priority) lives in the agent file as the single source of truth.

**Available agents:** `advisor`, `researcher`, `writer`, `security`, `engineer`, `legal`

**SKILL.md includes a chain map** — an ASCII diagram showing how commands → workflows → phases → outputs connect AND which agent executes each phase. Every prompt explicitly defines:
- **INPUT CONTRACT:** What data/files it receives (from the previous prompt in the chain)
- **OUTPUT CONTRACT:** What data/files it produces (for the next prompt in the chain)
- **NEXT:** Exact file path and conditions for what executes after it

---

## Prompt Chaining and I/O Contracts

Every skill is a chain of prompts. Commands → Workflows → Phases → Outputs. Each prompt in the chain:

1. **Receives input** (INPUT CONTRACT) — exact file paths and data from the previous prompt
2. **Defines what it produces** (OUTPUT CONTRACT) — exact file paths and format
3. **Tells base Claude what's next** (NEXT) — the exact file path of the next prompt and what conditions trigger it

**Example: Career Skill Chain**
```
User: /career-search
  ↓
commands/career-search.md (routing prompt)
  INPUT: User query + resume path
  OUTPUT: Job discovery results → private/output/career/discovered-jobs.md
  NEXT: Load phases/00-workflow.md with discovered-jobs.md
  ↓
phases/00-workflow.md (orchestration prompt)
  INPUT: discovered-jobs.md from career-search
  CHECKS: Career gate criteria
  OUTPUT: Assessment data → private/output/career/assessment.md
  NEXT: Load phases/01-assess.md with assessment.md
  ↓
phases/01-assess.md (phase execution prompt)
  INPUT: assessment.md from workflow + user resume
  OUTPUT: Career assessment → private/output/career/assessment-complete.md
  NEXT: Load phases/02-research.md with assessment-complete.md
  ↓
phases/02-research.md → ... → phases/05-deliver.md
```

**Key principle:** No guessing. No hunting for files. No hoping base Claude figures out routing. Every NEXT section makes the chain explicit.

---

## Prompt Specification Standards

Every prompt (commands, workflows, phases, techniques) specifies:

1. **EXACT tools to use** — Not "do some research" but "Use WebSearch for X, Y, Z queries"
2. **EXACT documents to reference** — Not "format it nicely" but "Read templates/resume-template.md for output format"
3. **EXACT models/services if needed** — Not "check social media" but "Use OpenRouter grok-3 for real-time sentiment"
4. **Observable success criteria** — What completion looks like (checkpoints), not subjective estimates

Two tool patterns:

**Pattern 1: Open-ended tools**
- Point to `tools/REGISTRY.json` for available options
- "Select the appropriate tool from REGISTRY for [purpose]"
- Use when multiple valid approaches exist

**Pattern 2: Specific tool steps**
- "Use WebSearch with query [specific query]"
- "Load prompts/web-api/injection/sqli-mysql-error-based.md for detailed execution"
- Don't inline all bash commands in phase files — delegate to technique prompts
- This keeps phases concise (orchestration) and detail in technique prompts (reusable instructions)

---

## Multi-Agent Orchestration

**Each prompt executes with a specific agent (advisor, engineer, security, writer, legal).** The METADATA frontmatter specifies which agent should execute each prompt. Skills should deliberately route different work to appropriate agents:

**Default pattern: Single agent per skill**
- Career uses `advisor` for all phases (assessment, analysis, strategy)
- Security uses `security` for all phases (testing, scanning, analysis)
- Ghost uses `writer` for all phases (research, draft, QA)

**Advanced pattern: Multi-agent orchestration**
- Some skills benefit from delegating specific work to specialized agents
- Each EXECUTION step can specify the OPTIMAL agent for that work
- NEXT section can route to different agents based on work type

**Example: Career skill with multi-agent orchestration**

Current: All phases use advisor
```
Phase 1 (assess) → advisor ✅
Phase 2 (research) → advisor ❌ Could be researcher
Phase 3 (interview prep) → advisor ✅
Phase 4 (write resume + cover letter) → advisor ❌ Could be writer
Phase 5 (submission strategy) → advisor ✅
```

Optimized:
```
Phase 1 (assess) → advisor (decision-making)
Phase 2 (research) → researcher (information gathering, source evaluation)
Phase 3 (interview prep) → advisor (strategy development)
Phase 4a (write resume) → writer (content creation)
Phase 4b (write cover letter) → writer (content creation)
Phase 5 (submission strategy) → advisor (guidance)
```

**IDENTITY is NOT duplicated across prompts.** Each prompt's IDENTITY section references
the agent file and adds only phase-specific context (1-3 lines):
```
## IDENTITY
Agent: agents/researcher.md
Phase-specific role: Gather company intelligence across 6 categories for career interview prep.
```

Agent identity (expertise, methodology, tools, constraints) lives in `agents/[agent].md`.
Change it once → every prompt using that agent inherits the update.

**When to use multi-agent delegation:**

| Situation | Delegate? | Why |
|-----------|-----------|-----|
| Information gathering, source evaluation, synthesis | ✅ YES → `researcher` | Researcher agent: systematic gathering, source credibility, citation |
| Content creation (writing, blog posts, documentation) | ✅ YES → `writer` | Writer agent: voice, tone, structure, formatting |
| Security testing, vulnerability assessment | ✅ YES → `security` | Security agent: penetration testing, vulnerability analysis |
| Infrastructure setup, deployment, remediation | ✅ YES → `engineer` | Engineer agent: systems, deployment, hardening |
| Legal/compliance analysis | ✅ YES → `legal` | Legal agent: regulatory frameworks, case law, citations |
| Analysis, assessment, decision-making, strategy | ✅ YES → `advisor` | Advisor agent: decision support, coaching, strategy |
| Orchestration/routing between work | ⚠️ NO | Base Claude handles orchestration (no delegation needed) |

**How to implement multi-agent in NEXT section:**

Instead of:
```
## NEXT
**On success:** → Load `skills/career/phases/04-generate.md`
```

Use:
```
## NEXT
**On success:** → Task(subagent_type="writer", prompt="Write resume and cover letter")
  Pass files: [from-phase-3]
  Expect: resume.md and cover-letter.md in output/
  Then: Load Phase 5 (advisor) for submission strategy
```

**Agent selection affects:**
- Model tier (advisor might use haiku; writer might use sonnet for quality)
- Tool availability (security agent has access to security-specific tools)
- Output quality (writer agent produces better prose; security agent finds real vulnerabilities)
- Cost optimization (route expensive work to specialized agents, cheaper work to base claude)

**Documentation in SKILL.md:**

Include an agent boundary diagram in the chain map:

```
/career → phases/00-workflow.md (advisor)
            ├→ Phase 1: assess.md (advisor)
            ├→ Phase 2: research.md (advisor)
            ├→ Phase 3: prepare.md (advisor)
            ├→ Phase 4a: write resume (DELEGATE → writer agent)
            ├→ Phase 4b: write cover letter (DELEGATE → writer agent)
            └→ Phase 5: deliver.md (advisor)
```

This tells skill users: "Phases 1, 2, 3, 5 run under advisor. Phases 4a and 4b delegate to writer for best output quality."

---

## Required Files

### 1. SKILL.md (REQUIRED)

**Purpose:** Skill definition, entry point, and chain map (including agent boundaries)

**Location:** `skills/[skill-name]/SKILL.md`

**Requirements:**
- YAML frontmatter with: name, description, agent, version, classification, last_updated
- **Chain map** — ASCII diagram showing how commands → workflows → phases connect AND which agent executes each phase
- Pre-flight checklist
- USE WHEN section (routing triggers)
- 5-phase workflow overview
- Well-structured with clear sections (no hard line limit)

**Chain Map Example (single agent):**
```
/career-search command
  ↓ (routes to job discovery)
phases/00-workflow.md (advisor)
  ↓ (validates + gates)
phases/01-assess.md (advisor)
  ↓
phases/02-research.md (advisor)
  ↓
phases/03-prepare.md (advisor)
  ↓
phases/04-generate.md (advisor)
  ↓
phases/05-deliver.md (advisor)
  ↓ (final output to user)
```

**Chain Map Example (multi-agent with delegation):**
```
/career command
  ↓
phases/00-workflow.md (advisor - orchestrator)
  ├→ phases/01-assess.md (advisor)
  ├→ phases/02-research.md (advisor)
  ├→ phases/03-prepare.md (advisor)
  ├→ DELEGATE to writer agent ← KEY BOUNDARY
  │  ├→ Write resume.md
  │  └→ Write cover-letter.md
  ├→ Resume in advisor (returns from writer)
  └→ phases/05-deliver.md (advisor)
     ↓ (final output to user)
```

The chain map is the ENTRY POINT. When a user invokes the skill, this diagram explains:
- The full execution path (what happens in what order)
- Agent boundaries (which agent executes each phase)
- Delegation points (where work delegates to specialized agents)

**Template:** `skills/create/templates/SKILL-TEMPLATE.md`

---

### 2. README.md (REQUIRED)

**Purpose:** User-facing documentation

**Location:** `skills/[skill-name]/README.md`

**Requirements:**
- Quick Start section
- Usage examples
- Configuration (if needed)
- Output description
- Troubleshooting

**Template:** `skills/create/templates/README-TEMPLATE.md`

---

### 3. STATUS.md (REQUIRED)

**Purpose:** Implementation status tracking

**Location:** `skills/[skill-name]/STATUS.md`

**Requirements:**
- Current implementation status
- Testing status
- Known issues/blockers
- Recent updates log
- Public/Private release status

**Template:** `skills/create/templates/STATUS-TEMPLATE.md`

---

### 4. VERIFY.md (REQUIRED)

**Purpose:** Validation checklist

**Location:** `skills/[skill-name]/VERIFY.md`

**Requirements:**
- Pre-execution checks
- Post-execution validation
- Output quality verification
- Testing checklist

**Template:** `skills/create/templates/VERIFY-TEMPLATE.md`

---

## Required Directories

### 1. phases/ (REQUIRED)

**Purpose:** 5-phase workflow execution files — full execution prompts

**Structure:**
```
phases/
├── 00-workflow.md         # Orchestration prompt (routes between 01-05)
├── 01-[discover].md       # Discovery/exploration execution
├── 02-[design].md         # Design/planning execution
├── 03-[generate].md       # Generation/execution implementation
├── 04-[validate].md       # Validation/QA execution
└── 05-[deliver].md        # Delivery/handoff execution
```

**All phase files follow the universal prompt structure completely:**
- **METADATA:** Domain, agent, model, complexity
- **IDENTITY:** Role and expertise (e.g., "You are a career assessment analyst...")
- **INPUT CONTRACT:** Exact files/data received from previous phase
- **OBJECTIVE:** What to accomplish, success criteria
- **METHODOLOGY:** Strategic reasoning and decision framework
- **EXECUTION:** Explicit steps with EXACT tools and documents to use
- **OUTPUT CONTRACT:** Exact files produced and format
- **NEXT:** Exact file path of next phase, conditions for proceeding
- **CHECKPOINTS:** Observable completion markers, exit criteria

**Phase 0 is special:** `00-workflow.md` is the orchestration prompt that chains 01-05. It validates gates, ensures all phases execute in sequence, and handles conditional branching.

**Phase Template:** `skills/create/templates/PHASE-TEMPLATE.md`

**Naming:** Use domain-specific names (not generic Phase 1-5)

**Tool specification:** Each step specifies EXACT tools. For complex techniques:
- **Option A (Simple):** Inline the commands
- **Option B (Recommended):** "For [technique], load prompts/[category]/[technique].md and execute steps 1-5 from that prompt"
- This keeps phase files concise and lets technique prompts be independently reusable

---

### 2. commands/ (REQUIRED if user-facing)

**Purpose:** Slash command definitions — lightweight routing prompts

**Structure:**
```
commands/
└── [command-name].md
```

**Command files are prompts too.** They follow the universal prompt structure but are lightweight:
- **IDENTITY:** What this command does (routing role)
- **INPUT CONTRACT:** What user provides (CLI arguments, query)
- **NEXT:** Exact file path of the next prompt (workflow or phase)
- **OUTPUT CONTRACT:** What user gets back

Commands don't need extensive METHODOLOGY — they're routing prompts. Their job is routing to the right workflow and defining what data flows forward.

**Symlink:** `/commands/[command-name].md` → `../skills/[skill-name]/commands/[command-name].md`

**When to create:**
- Skill has user-invocable entry point
- User types `/[command-name]` to invoke

**When to skip:**
- Skill is internal only (invoked by other skills)
- Skill has no direct user interface

**Template:** `skills/create/templates/COMMAND-TEMPLATE.md`

---

### 3. docs/ (REQUIRED)

**Purpose:** Domain knowledge base and skill documentation

**Required Files:**
- `adding-credentials.md` - Instructions for adding credentials to this skill (REQUIRED for all skills)
- `env-setup.md` - Credential setup instructions (REQUIRED if env_required=true)

**Optional Contents:**
- Domain-specific reference documentation
- API documentation
- Process guides
- Standards and specifications
- Research and analysis

**Examples:**
- `skills/clifton/docs/cliftonstrengths-themes.md` - CliftonStrengths reference
- `skills/career/docs/osint/` - OSINT resources

**Template:** `skills/create/templates/adding-credentials-template.md`

---

### 4. templates/ (OPTIONAL but recommended)

**Purpose:** Output format templates

**Contents:**
- Report templates
- Document formats
- Output structures
- Response templates

**Examples:**
- Assessment report templates
- Analysis output formats
- Deliverable structures

**When to create:**
- Skill produces formatted output
- Multiple output types supported
- Consistent structure needed

---

### 5. prompts/ (OPTIONAL)

**Purpose:** Domain-specific technique prompts — atomic, reusable, self-contained instruction sets

**Technique prompts are the DETAIL layer.** Phases orchestrate. Technique prompts execute specific procedures.

**Structure:**
```
prompts/
├── shared/                           # Reusable components (@include)
│   ├── authorization-check.md
│   ├── scope-validation.md
│   └── evidence-capture.md
└── {category}/                       # One level of nesting only
    ├── {technique-name}.md           # Atomic technique prompt
    ├── {related-technique}.md        # Another technique in same category
    └── [more techniques in category]
```

**Shared prompts** are included via `@include()` directive in phase/technique files. They're reusable components: authorization checks, scope validation, evidence capture patterns, error handling templates.

**All prompts follow the universal prompt structure:** `docs/guides/universal-prompt-structure.md`

Each prompt includes: METADATA, IDENTITY, INPUT CONTRACT, OBJECTIVE, METHODOLOGY, EXECUTION, OUTPUT CONTRACT, NEXT, CHECKPOINTS.

**Technique Prompt Principle:** Every technique prompt is complete. A phase says "load prompts/web-api/injection/sqli-mysql-error-based.md and execute it" — that technique prompt contains EVERYTHING needed: exact sqlmap commands, expected outputs, what success looks like, what to do on failure. The phase doesn't need to contain those details.

**When to create:**
- Skill has many similar-but-distinct procedures (50+ possible variations)
- Phases need to delegate to specialized execution (security testing, compliance checks)
- Domain benefits from reusable technique libraries
- Cross-skill technique sharing helps (e.g., authentication checks used in multiple skills)

**When to skip:**
- Simple skills where phases contain all needed detail (phases can be a few hundred lines)
- No technique-level decomposition needed
- Procedures aren't complex enough to warrant separate technique files

**Examples:**
- `skills/pentest/prompts/web-api/injection/sqli-mysql-error-based.md` (196 lines, specific sqlmap execution)
- `skills/pentest/prompts/shared/authorization-check.md` (included in multiple technique prompts)

**Naming:** `{category}/{technique-name}.md` — kebab-case, one level deep

**Pattern: Phases reference technique prompts**
- Phase file: "For SQL injection testing, load `prompts/web-api/injection/sqli-mysql-error-based.md` and execute"
- Technique prompt: Contains full execution with exact tools, commands, expected outputs, error handling
- Result: Phase stays concise. Technique prompt is reusable. Detail lives in the right place

---

### 6. Shared Methodologies (repo root `methodologies/`)

**Purpose:** Shared reference documentation used across multiple skills — domain knowledge, standards, frameworks.
Methodologies are NOT per-skill subdirectories. They live at **`methodologies/`** at the repo root.

**Methodologies are NOT executable prompts.** They are REFERENCE DOCUMENTATION that inform prompt creation.

**Contents:**
- Framework documents (OWASP, NIST, PTES methodology breakdowns)
- Domain knowledge bases (techniques, procedures, standards)
- Research materials that explain WHY certain techniques matter
- Comprehensive technique catalogs with academic references

**Key distinction:**
- **Methodologies:** Reference documentation. Static knowledge. Why this matters.
- **Prompts:** Executable instructions. Dynamic reasoning. What to do right now.

Methodologies answer: "What are ALL the injection techniques that exist?" Prompts answer: "How do I test SQL injection on THIS system right now?"

**How prompts reference methodologies:**
- Technique prompt includes: "See methodologies/web-api/framework.md sections 3.2-3.5 for the theoretical background"
- Prompts cite methodology but contain executable instructions, not just references

**When to add a methodology:**
- Domain is shared across multiple skills (pentest, bug-bounty, vuln-scan)
- Large body of domain knowledge (100+ techniques, standards, frameworks)
- Prompts should be traceable to methodology sections

**Examples:**
- `methodologies/web-api/framework.md` (2,898 lines) — comprehensive web API attack surface, all techniques, academic citations
- `methodologies/network/framework.md` — network penetration testing framework

**Size guidance:** Methodologies can be large (1000+ lines) because they're comprehensive reference docs, not agent instructions. Organization is key — clear sections, table of contents, cross-references

---

### 7. scripts/ (REQUIRED for setup.ts)

**Purpose:** Automation and tooling

**Contents:**
- TypeScript/Python automation scripts
- API integrations
- Data processing tools
- Validation utilities

**Structure:**
```
scripts/
├── [function]/
│   └── index.ts
└── setup.ts           # Setup script (REQUIRED for all skills)
```

**setup.ts is REQUIRED for ALL skills:**
- Skills WITH credentials: Full setup wizard with REQUIRED_KEYS, testConnections(), interactive flow
- Skills WITHOUT credentials: Minimal setup with validation framework, empty REQUIRED_KEYS

**See:** `skills/create/docs/env-management-patterns.md` for full vs minimal patterns

**Examples:**

**Additional scripts (when needed):**
- `tools/git/scripts/push/` - Git push automation
- `tools/git/scripts/public/` - Public repo sync
- `skills/clifton/scripts/` - CliftonStrengths analysis

**When to add additional scripts:**
- Skill requires API calls
- Complex data processing needed
- Automation possible

---

### 6. Data Directories (In /private/)

**Purpose:** Centralized skill data storage outside skills/ directory

**User Input:**
- Location: `/private/input/{skill-name}/`
- Created on first skill use
- Not in skills/ directory
- Example: `/private/input/career/chris_resume.md`

**Skill Output:**
- Location: `/private/output/{skill-name}/`
- Created on first skill execution
- Not in skills/ directory
- Example: `/private/output/ghost/posts/`

**Reference Materials:**
- Location: `/private/books/{domain}/`
- Shared across related skills
- Examples: `/private/books/security/`, `/private/books/career-development/`

**Why separate?**
- Keeps skills/ lightweight (code only)
- Private/ contains large data (books: 1.3GB, outputs: growing)
- Easier to gitignore and manage access
- Clearer separation of concerns
- Supports shared reference materials across skills

---

## Optional Files

### ../../private/docs/env-setup.md (If credentials required)

**Purpose:** Environment variable documentation

**When to create:**
- Skill requires API keys or credentials
- External service authentication needed
- Configuration via .env required

**Requirements:**
- Lists all required ENV variables
- Includes setup instructions
- Provides .env.structure.yaml template section
- Documents verification steps

**Template:** `skills/create/templates/env-section-template.md`

**Frontmatter:** Set `env_required: true` in SKILL.md

---

## Size Guidance

**No hard line limits on SKILL.md or other documentation files.** Clarity and completeness are more important than brevity. A well-structured 1000-line SKILL.md that agents follow consistently is better than a compressed 400-line version that causes hallucination.

**If a file becomes unwieldy:**
- Move domain knowledge to docs/
- Move detailed workflows to phases/
- Move templates to templates/
- Extract technique details to prompts/
- Keep files well-structured with clear sections

---

## Naming Conventions

**Skill Names:**
- Format: `lowercase-with-dashes`
- Examples: `create-skill`, `career`, `clifton`, `git`

**Command Names:**
- Format: `lowercase-with-dashes`
- Examples: `create-skill`, `git-push`, `git-pull`

**Phase Files:**
- Format: `01-domain-name.md` (not `01-phase1.md`)
- Examples: `01-discover.md`, `02-design.md`, `03-generate.md`

**Documentation Files:**
- Format: `kebab-case.md`
- Examples: `env-setup.md`, `skill-structure-standards.md`

---

## Classification

**Set in SKILL.md frontmatter:**

```yaml
classification: public  # or private
```

**Public skills:**
- Safe for public GitHub repository
- No proprietary content
- No large dependencies (>50MB)
- Well-documented and tested

**Private skills:**
- Contains proprietary information
- Large dependencies (compliance/security books)
- Client-specific implementations
- Personal integrations (blog, n8n)

---

## Validation

**Pre-commit hooks check:**
- SKILL.md exists and has valid frontmatter
- SKILL.md well-structured with required sections
- Skills/ directory clean (no input/ or output/)
- No hardcoded credentials
- No hardcoded counts in documentation

**Framework health check validates:**
- Skills with env_required: true have setup.ts with REQUIRED_KEYS
- setup.ts exports validateSetup() and testConnections()

**Manual validation:**
```bash
bun run tools/validation/full-framework-audit.ts
```

---

**Version:** 2.2
**Last Updated:** 2026-02-08
**Related:** `docs/guides/universal-prompt-structure.md`

**Key additions (2.2):**
- Multi-agent orchestration section (advisor, researcher, writer, security, engineer, legal)
- Researcher agent for information gathering, source evaluation, synthesis
- IDENTITY references agent files — NOT duplicated in every prompt
- Chain maps show agent boundaries and delegation points
- SKILL.md examples show both single-agent and multi-agent patterns

**Key additions (2.1):**
- Prompt chaining and I/O contracts section
- Prompt specification standards (exact tools, documents, models)
- Chain map requirement in SKILL.md with example
- Command files are routing prompts (lightweight NEXT-focused)
- Phase files must follow complete universal prompt structure
- Technique prompts are the detail layer (phases delegate to them)
- Methodologies are reference docs, not executable prompts
