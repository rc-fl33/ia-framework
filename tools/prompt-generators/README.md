# Prompt Generators

Specialized prompt engineering modules for different generation targets.

## Overview

The universal prompt generator (`../framework/generators/prompt-generator.ts`) routes to these specialized generators based on prompt type:

```
tools/
├── framework/generators/
│   └── prompt-generator.ts     # Main router/CLI (moved from tools/ root)
└── prompt-generators/          # Specialized generators
    ├── image-generator.ts      # Flux, DALL-E, Midjourney
    ├── video-generator.ts      # Grok Imagine, Runway, Pika
    └── README.md               # This file
```

**Note:** `tools/prompt-qa.ts` was removed (stale/unused).

## Image Generator

**Supported generators:**
- **Flux.1** (via Grok Imagine) - Best for photorealism, natural language, text integration
- **DALL-E 3** - Best for creative interpretations, artistic styles
- **Midjourney** - Best for stylized imagery, fantasy art

**Example:**

```bash
bun run tools/generators/prompt-generator.ts \
  --type image \
  --generator flux \
  --idea "Developer analyzing algorithm in cyberpunk studio" \
  --style "Late-80s anime OVA aesthetic, hand-inked with heavy cross-hatching"
```

**Input:**
```
IDEA: Developer analyzing algorithm in cyberpunk studio
STYLE: Late-80s anime OVA aesthetic, hand-inked with heavy cross-hatching
```

**Output (optimized prompt):**
```
Late-80s anime OVA aesthetic, hand-inked with heavy cross-hatching, cyberpunk.

Developer analyzing X's algorithm source code on massive holographic displays
showing weighted pathways branching in different directions—some paths glow
brightly with thick data flows (conversation signals), others appear as thin,
faint streams (passive engagement). Character has bob-style hair, dark hoodie,
expressive eyes behind glasses, studying the architectural differences with
intense focus. Binary code and engagement metrics float around the scene as
glowing fragments.
```

**Key optimizations:**
- Art style locked at beginning (consistency)
- Hierarchical structure (foreground → background)
- Descriptive adjectives for vivid imagery
- Natural language (no weights like `(keyword:1.5)`)
- Concise but detailed (2-4 sentences)

## Video Generator

**Supported generators:**
- **Grok Imagine** - Best for anime-style animation, slow subtle movements, 2-4s cycles
- **Runway Gen-2** - Best for photorealistic video, camera movements, longer clips
- **Pika Labs** - Best for creative animations, style transformations

**Example:**

```bash
bun run tools/generators/prompt-generator.ts \
  --type video \
  --generator grok-imagine \
  --idea "Developer studying algorithm code, nodding in agreement" \
  --style "80s cyberpunk aesthetic, hand-inked" \
  --duration "2-3 second cycles" \
  --motion slow
```

**Input:**
```
IDEA: Developer studying algorithm code, nodding in agreement
STYLE: 80s cyberpunk aesthetic, hand-inked
DURATION: 2-3 second cycles
MOTION: slow
```

**Output (optimized prompt):**
```
No sound. Consistent design and style, high self-similarity, slow, subtle.
Focuses intently on source code analysis while nodding her head in agreement
and clarity of what the algorithm is telling her. Urgent deliberate movements,
hand gestures studying the terminal, eyes tracking the code. 2-3 second cycles
minimum cycles, hand-inked animation frames. 80s cyberpunk aesthetic.
```

**Key optimizations:**
- Motion speed explicitly stated (slow, subtle, 2-3s cycles)
- Consistency emphasized (high self-similarity)
- Specific movement patterns (nodding, hand gestures, eye tracking)
- Loopable animation structure
- Style preservation (hand-inked frames)

## Workflow Generator

**Purpose:** Generate step-by-step task instructions for Claude Code

**Example:**

```bash
bun run tools/generators/prompt-generator.ts \
  --type workflow \
  --task "Initialize security engagement" \
  --skill security \
  --auto-context
```

**Output:** Structured workflow with:
- Step-by-step instructions
- Tool call syntax (AskUserQuestion, Bash, Task, etc.)
- Verification checklists
- Error handling
- Recovery actions

## Optimization Principles

### Image Prompts

1. **Lock style first** - Art style at beginning ensures consistency
2. **Hierarchical structure** - Foreground → middle → background
3. **Natural language** - No weights, no keyword spam
4. **Descriptive adjectives** - Vivid, specific, evocative
5. **Avoid ambiguity** - Every element clearly described

### Video Prompts

1. **Specify motion type** - slow/subtle/fast/dynamic
2. **Define timing** - 2-3s cycles, continuous, looped
3. **Emphasize consistency** - High self-similarity, style preservation
4. **Describe movement patterns** - What animates, how it moves
5. **Loopability** - Ensure seamless repeat if needed

### Workflow Prompts

1. **Clear steps** - 3-5 discrete actions
2. **Tool calls** - Use actual tool names (not pseudo-commands)
3. **Verification** - Checkboxes after each step
4. **Error handling** - "If failed:" recovery actions
5. **Simple language** - Direct, not overly formal

## Usage Patterns

### Ghost Blog Hero Images

```bash
# 1. Generate image prompt
bun run tools/generators/prompt-generator.ts \
  --type image \
  --generator flux \
  --idea "Developer analyzing X algorithm architecture on holographic displays" \
  --style "Late-80s anime OVA aesthetic, hand-inked with heavy cross-hatching, cyberpunk" \
  --output private/output/ghost/posts/YYYY-MM-DD-slug/hero-prompt.md

# 2. Use prompt with Grok Imagine to generate image
# (manual step - copy-paste prompt)

# 3. Convert to WebP if needed
tools/api/grok/convert-mp4-to-webp.sh private/output/ghost/posts/YYYY-MM-DD-slug/hero.mp4
```

### Ghost Blog Hero Videos

```bash
# 1. Generate video prompt
bun run tools/generators/prompt-generator.ts \
  --type video \
  --generator grok-imagine \
  --idea "Developer studying code, nodding in understanding" \
  --style "80s cyberpunk aesthetic, hand-inked" \
  --duration "2-3 second cycles" \
  --motion slow \
  --output private/output/ghost/posts/YYYY-MM-DD-slug/hero-video-prompt.txt

# 2. Use prompt with Grok Imagine video generator
# (manual step - copy-paste prompt)
```

## Testing

Run examples:

```bash
# Test image prompt generation
bun run tools/prompt-generators/image-generator.ts

# Test video prompt generation
bun run tools/prompt-generators/video-generator.ts
```

## Development

To add a new generator type:

1. Create `tools/prompt-generators/[type]-generator.ts`
2. Define generator profiles with strengths and optimization rules
3. Implement `generate[Type]Prompt(config)` function
4. Export default with generator functions
5. Update `tools/generators/prompt-generator.ts` to route to new type
6. Add CLI arguments and help text

## References

- **Flux.1 strengths**: [Grok Imagine docs](https://grok.x.ai/imagine)
- **Prompt engineering best practices**: See examples in this directory
- **Ghost hero image workflow**: `skills/ghost/phases/04-visuals.md`
