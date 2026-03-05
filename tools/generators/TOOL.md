---
name: generators
type: utility
classification: public
description: Code generation suite - routing gates, prompts (workflow/image/video), workflow validation
version: 3.0.0
last_updated: 2026-02-14
env_required: false
env_keys: []
commands:
  - bun tools/generators/prompt-generator.ts --type workflow --task "Initialize engagement"
  - bun tools/generators/prompt-generator.ts --type image --generator flux --idea "Cyberpunk studio"
  - bun tools/generators/routing-gate-generator.ts --type framework --target CLAUDE.md
  - bun tools/generators/validate-workflow-standard.ts <skill>
related_tools:
  - tools/utils
  - tools/prompt-generators
  - skills/create
---

# Framework Generators

**Type:** Utility
**Classification:** 🌍 PUBLIC
**Status:** ✅ Production Ready

---

## Classification

**PUBLIC** - Code generation utilities for framework development.

**Why Public:**
- Standard code generation patterns
- No proprietary logic - template-based generation
- Useful for framework contributors and skill developers
- Documented templates and standards

---

## Purpose

Suite of code generation utilities for creating routing gates, prompts (workflow/image/video), and validating workflow standards. Automates repetitive development tasks and ensures consistency across the framework.

**Core Capabilities:**
- **Routing gates**: Generate CLAUDE.md, agent, and skill routing gates
- **Workflow prompts**: Task instructions for Claude Code
- **Image prompts**: Flux, DALL-E, Midjourney optimization
- **Video prompts**: Grok Imagine, Runway, Pika animation
- **LLM prompts**: System prompts and few-shot examples
- **Workflow validation**: Verify skill workflows follow standards

**Use Cases:**
- **New skills**: Generate routing gates for skill integration
- **New agents**: Create agent routing logic
- **Framework updates**: Regenerate gates after agent changes
- **Prompt engineering**: Optimize prompts for specific generators
- **Quality assurance**: Validate workflow compliance

---

## Usage

### Routing Gate Generation

**Generate framework routing gate (CLAUDE.md):**
```bash
bun tools/generators/routing-gate-generator.ts --type framework --target CLAUDE.md

# Output:
# 🔄 Generating routing gate for CLAUDE.md...
# ✅ Gate generated (35 lines)
# ✅ Integrated into CLAUDE.md (lines 1-35)
# Cost: $0.0005
```

**Generate agent routing gate:**
```bash
bun tools/generators/routing-gate-generator.ts --type agent --target agents/security.md

# Generates routing logic for security agent
```

**Generate skill routing gate:**
```bash
bun tools/generators/routing-gate-generator.ts --type skill --target skills/write/SKILL.md

# Generates skill routing gate with intent patterns
```

**Regenerate all gates:**
```bash
bun tools/generators/routing-gate-generator.ts --all

# Regenerates:
# - CLAUDE.md (framework gate)
# - All agent gates (agents/*.md)
# - All skill gates (skills/*/SKILL.md)
#
# Cost: ~$0.0012 for all 24 gates (one-time)
```

---

### Workflow Prompts

**Generate task instruction prompt:**
```bash
bun tools/generators/prompt-generator.ts \
  --type workflow \
  --task "Initialize security engagement" \
  --skill security \
  --auto-context

# Output:
# 📝 Generating workflow prompt...
# Task: Initialize security engagement
# Skill: security
# Context: Loaded from skills/pentest/docs/
#
# Generated prompt (245 tokens):
# ─────────────────────────────────────
# You are initializing a security engagement.
#
# Context:
# - Skill: security
# - Available tools: [auto-loaded signatures]
# - Engagement types: pentest, vuln-scan, code-review...
#
# Steps:
# 1. Validate scope (SCOPE.md exists)
# 2. Check authorization
# 3. Initialize session tracking
# ...
# ─────────────────────────────────────
#
# Saved to: prompts/workflow/security-init.md
```

**Manual context:**
```bash
bun tools/generators/prompt-generator.ts \
  --type workflow \
  --task "Create compliance assessment" \
  --context "NIST CSF 2.0, healthcare, HIPAA" \
  --output prompts/compliance-assessment.md
```

---

### Image Prompts

**Flux optimization:**
```bash
bun tools/generators/prompt-generator.ts \
  --type image \
  --generator flux \
  --idea "Developer analyzing algorithm in cyberpunk studio" \
  --style "Late-80s anime OVA, hand-inked"

# Output:
# 🎨 Generating Flux-optimized image prompt...
#
# Generated prompt (optimized for Flux.2):
# ─────────────────────────────────────
# A developer intently studying a complex algorithm diagram
# in a neon-lit cyberpunk studio. Late-80s anime OVA aesthetic,
# hand-inked linework, cel-shaded coloring. Warm key light from
# vintage CRT monitors casting cyan and magenta reflections on
# technical schematics. Atmospheric depth with volumetric fog.
# Detailed mechanical pencil in foreground, coffee mug with
# mathematical notation. 16:9 cinematic composition.
# ─────────────────────────────────────
#
# Flux-specific optimizations applied:
# - Detailed scene description (not just subject)
# - Lighting specified (key light, reflections)
# - Composition guidance (cinematic, 16:9)
# - Atmospheric elements (volumetric fog)
# - Foreground details (pencil, mug)
```

**DALL-E optimization:**
```bash
bun tools/generators/prompt-generator.ts \
  --type image \
  --generator dalle \
  --idea "Abstract data visualization" \
  --style "Minimalist, geometric"

# DALL-E optimizations:
# - Simpler language (DALL-E prefers clarity over detail)
# - Color palette specified
# - Composition simplified
```

**Midjourney optimization:**
```bash
bun tools/generators/prompt-generator.ts \
  --type image \
  --generator midjourney \
  --idea "Futuristic architecture" \
  --style "Brutalist, concrete"

# Midjourney optimizations:
# - Parameter suggestions (--ar 16:9, --stylize 250)
# - Reference tags for style matching
# - Weight modifiers for emphasis
```

---

### Video Prompts

**Grok Imagine:**
```bash
bun tools/generators/prompt-generator.ts \
  --type video \
  --generator grok-imagine \
  --idea "Paintbrushes painting autonomously" \
  --duration "2-3s cycles" \
  --motion slow

# Output:
# 🎬 Generating Grok Imagine video prompt...
#
# Generated prompt:
# ─────────────────────────────────────
# Several paintbrushes suspended in mid-air, painting
# autonomously on a large canvas. Slow, deliberate strokes
# creating abstract patterns. Camera static, focused on
# brush movements. Soft studio lighting. 2-3 second looping
# cycles. Smooth motion, no camera shake.
# ─────────────────────────────────────
#
# Grok Imagine optimizations:
# - Loop-friendly framing (2-3s cycles)
# - Controlled motion (slow, deliberate)
# - Static camera (Grok performs best with fixed perspective)
# - Clear action focus (brush movements)
```

**Runway ML:**
```bash
bun tools/generators/prompt-generator.ts \
  --type video \
  --generator runway \
  --idea "Time-lapse city at night" \
  --motion fast

# Runway optimizations:
# - Camera movement suggestions
# - Motion blur handling
# - Temporal consistency notes
```

---

### Workflow Validation

**Validate skill workflow:**
```bash
bun tools/generators/validate-workflow-standard.ts write

# Output:
# 🔍 Validating workflow: skills/write
#
# ✅ Phase files present:
#   01-research.md
#   02-draft.md
#   03-qa.md
#   04-visuals.md
#   05-output.md
#
# ✅ Routing gate present (SKILL.md lines 1-20)
# ✅ Input/output directories configured
# ✅ Workflow follows 5-phase standard
#
# Score: 100/100
```

**Validation errors:**
```bash
bun tools/generators/validate-workflow-standard.ts custom-skill

# Output:
# 🔍 Validating workflow: skills/custom-skill
#
# ❌ Phase files missing:
#   Expected: 01-phase.md, 02-phase.md, ...
#   Found: phase1.md, phase2.md (wrong naming)
#
# ⚠️  Routing gate outdated (generated >30 days ago)
# ❌ No output/ directory
#
# Score: 45/100
# Fix with: bun tools/generators/routing-gate-generator.ts --type skill --target skills/custom-skill/SKILL.md
```

---

## Configuration

### Templates

**Location:** `library/templates/`

**Available templates:**
- `FRAMEWORK-routing-gate-template.md` - CLAUDE.md routing gate
- `AGENT-routing-gate-template.md` - Agent routing gate
- `SKILL-routing-gate-template.md` - Skill routing gate

**Template variables:**
```markdown
{{agents_list}}              # Comma-separated agent names
{{skill_name}}               # Skill name
{{skill_description}}        # Short description
{{intent_patterns}}          # Intent matching patterns
```

### Generator Settings

**Prompt generator config:**
```typescript
const CONFIG = {
  maxTokens: 2000,
  temperature: 0.7,
  autoContext: true,  // Load skill docs + tool signatures
};
```

**Image generator strengths:**
```typescript
const GENERATORS = {
  flux: {
    strengths: ['detailed scenes', 'lighting', 'composition'],
    weaknesses: ['text rendering', 'precise counts']
  },
  dalle: {
    strengths: ['conceptual art', 'simplicity', 'text integration'],
    weaknesses: ['photorealism', 'complex scenes']
  },
  midjourney: {
    strengths: ['artistic style', 'aesthetics', 'mood'],
    weaknesses: ['precise control', 'technical accuracy']
  }
};
```

---

## API Reference

### Routing Gate Generator

#### `routing-gate-generator.ts --type TYPE --target FILE`

Generate routing gate for specified target.

**Parameters:**
- `--type` - Gate type: `framework` | `agent` | `skill`
- `--target` - Target file path
- `--all` - Regenerate all gates

**Output:** Gate content integrated into target file (lines 1-N)

**Cost:** ~$0.0005 per gate (Haiku generation)

---

### Prompt Generator

#### `prompt-generator.ts --type TYPE [options]`

Generate optimized prompt for specified type and generator.

**Common Parameters:**
- `--type` - Prompt type: `workflow` | `image` | `video` | `llm`
- `--output FILE` - Save to file (default: print to stdout)

**Workflow Parameters:**
- `--task "TASK"` - Task description
- `--skill NAME` - Skill context
- `--context "CONTEXT"` - Manual context
- `--auto-context` - Load skill docs + tool signatures

**Image Parameters:**
- `--generator` - Generator: `flux` | `dalle` | `midjourney`
- `--idea "IDEA"` - Image concept
- `--style "STYLE"` - Art style description

**Video Parameters:**
- `--generator` - Generator: `grok-imagine` | `runway` | `pika`
- `--idea "IDEA"` - Video concept
- `--duration "DURATION"` - Duration/looping (e.g., "2-3s cycles")
- `--motion` - Motion speed: `slow` | `medium` | `fast` | `subtle`

---

### Workflow Validator

#### `validate-workflow-standard.ts SKILL`

Validate skill workflow against framework standards.

**Parameters:**
- `SKILL` - Skill name

**Exit Codes:**
- `0` - Validation passed (score ≥80)
- `1` - Validation failed (score <80)

---

## Architecture

### Routing Gate Generation Flow

```
User runs: routing-gate-generator.ts --type agent --target agents/security.md
   ↓
1. Load template (library/templates/AGENT-routing-gate-template.md)
   ↓
2. Gather context
   ├─ Agent name: "security"
   ├─ Agent domain: "Security testing and vulnerability analysis"
   ├─ Skills list: "pentest, vuln-scan, code-review, ..."
   └─ Tasks: "Penetration testing, security audits, ..."
   ↓
3. Replace template variables
   {{agent_name}} → security
   {{skills_list}} → pentest, vuln-scan, ...
   ↓
4. Send to Haiku for generation
   Prompt: "Generate routing gate using this template and context"
   ↓
5. Parse generated gate
   ↓
6. Integrate into target file
   Replace lines 1-N (gate section)
   ↓
7. Validate integration
   ✅ Gate inserted
   ✅ No syntax errors
   ✅ File written
```

### Prompt Optimization Strategies

**Flux (detailed scenes):**
```
Base idea: "Cyberpunk studio"
   ↓
Add scene details: lighting, reflections, fog
Add composition: 16:9, cinematic
Add foreground elements: pencil, mug
Add atmosphere: neon-lit, vintage CRT
   ↓
Result: 120-token detailed scene description
```

**DALL-E (clarity):**
```
Base idea: "Abstract data visualization"
   ↓
Simplify language: "clean geometric shapes"
Add color palette: "blues, greens, white background"
Specify composition: "centered, symmetrical"
   ↓
Result: 40-token clear, simple description
```

**Midjourney (style matching):**
```
Base idea: "Futuristic architecture"
   ↓
Add style tags: "brutalist, concrete, monolithic"
Add parameters: "--ar 16:9 --stylize 250"
Add references: "::Tadao Ando::"
   ↓
Result: Prompt + parameters for Midjourney bot
```

---

## Scripts

### Batch Gate Generation

**Regenerate all framework gates:**
```bash
#!/bin/bash
# Regenerate after adding new agents/skills

bun tools/generators/routing-gate-generator.ts --all

# Or individually:
# bun tools/generators/routing-gate-generator.ts --type framework --target CLAUDE.md
# bun tools/generators/routing-gate-generator.ts --type agent --target agents/security.md
# ...
```

### Validate All Workflows

```bash
#!/bin/bash
# Validate all skill workflows

for skill in skills/*/; do
  skill_name=$(basename "$skill")
  echo "Validating $skill_name..."
  bun tools/generators/validate-workflow-standard.ts "$skill_name"
done
```

---

## Dependencies

### Runtime

**External:** None (uses Bun built-ins)

**Internal:**
- `tools/utils/path-resolution` - Framework root resolution
- `tools/prompt-generators/image-generator` - Image prompt optimization
- `tools/prompt-generators/video-generator` - Video prompt optimization

### Framework Integration

**Used By:**
- `/create` skill - Generates routing gates for new skills
- Framework maintenance - Regenerate gates after changes

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Skills:**
- `skills/create/` — invokes routing-gate-generator.ts when scaffolding a new skill

No direct TypeScript importers — invoked via CLI by the create skill and developers.

**File Structure:**
```
tools/generators/
├── routing-gate-generator.ts     # Routing gate generation
├── prompt-generator.ts            # Universal prompt generator
├── validate-workflow-standard.ts  # Workflow validation
└── TOOL.md                        # This file
```

---

## Troubleshooting

### "Template not found"

**Cause:** Missing template file in `library/templates/`

**Fix:**
```bash
# Check templates exist
ls -la library/templates/*-routing-gate-template.md

# If missing, restore from framework update
```

### "Failed to gather context"

**Cause:** agents/ or skills/ directory not found

**Fix:**
```bash
# Verify framework root
echo $IA_FRAMEWORK_ROOT

# Check directories exist
ls -la agents/
ls -la skills/
```

### "Gate generation failed"

**Cause:** Haiku API error or rate limit

**Debug:**
```bash
# Check API key
echo $OPENROUTER_API_KEY

# Retry with verbose output
bun tools/generators/routing-gate-generator.ts --type agent --target agents/security.md --verbose
```

### "Workflow validation failed"

**Cause:** Skill doesn't follow 5-phase standard

**Fix:**
```bash
# View specific errors
bun tools/generators/validate-workflow-standard.ts my-skill

# Fix issues:
# 1. Rename phase files (01-phase.md, 02-phase.md, ...)
# 2. Create input/ and output/ directories
# 3. Regenerate routing gate
```

---

## Related Tools

- **tools/utils** - Path resolution, prompt rendering
- **tools/prompt-generators** - Specialized prompt generators
- **skills/create** - Skill creation wizard (uses generators)
- **library/templates** - Gate templates

---

## Version History

### 3.0.0 (2026-01-28)
- ✅ Universal prompt generator (workflow/image/video/LLM)
- ✅ Routing gate generator (framework/agent/skill)
- ✅ Workflow validation
- ✅ Multi-generator optimization (Flux, DALL-E, Midjourney, Grok)
- ✅ Auto-context loading from skill docs
- ✅ Template-based generation

### 2.0.0 (2026-01-20)
- Image and video prompt generation added
- Generator-specific optimization rules

### 1.0.0 (2026-01-15)
- Initial routing gate generator
- Workflow prompt generation

---

## References

- **Flux Documentation:** https://blackforestlabs.ai/flux-2-documentation
- **DALL-E Guide:** https://platform.openai.com/docs/guides/images
- **Midjourney Docs:** https://docs.midjourney.com
- **Grok Imagine:** https://x.ai/blog/grok-imagine
- **Templates:** `library/templates/*-routing-gate-template.md`
