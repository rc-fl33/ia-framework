---
name: prompt-generators
type: utility
classification: public
description: Specialized prompt engineering for image/video generation - Flux, DALL-E, Midjourney, Grok Imagine, Runway optimizations
version: 1.0.0
last_updated: 2026-02-14
env_required: false
env_keys: []
commands:
  - bun tools/prompt-generators/image-generator.ts
  - bun tools/prompt-generators/video-generator.ts
related_tools:
  - tools/generators/prompt-generator
  - tools/api/grok
  - skills/ghost
---

# Prompt Generators

**Type:** Utility
**Classification:** 🌍 PUBLIC
**Status:** ✅ Production Ready

---

## Classification

**PUBLIC** - Specialized prompt engineering utilities.

**Why Public:**
- Standard prompt optimization patterns (no proprietary logic)
- Generator-specific best practices (Flux, DALL-E, Midjourney)
- Useful for content creators using AI image/video generation
- Well-documented optimization principles

---

## Purpose

Specialized prompt engineering modules for different generation targets. Provides generator-specific optimization profiles and prompt construction patterns to maximize image and video generation quality across Flux, DALL-E, Midjourney, Grok Imagine, Runway, and Pika Labs.

**Core Capabilities:**
- **Image prompt optimization**: Flux.1, DALL-E 3, Midjourney
- **Video prompt optimization**: Grok Imagine, Runway Gen-2, Pika Labs
- **Generator profiles**: Strengths, optimization rules, avoid patterns
- **Step-by-step analysis**: Break down ideas into elements
- **Natural language construction**: No weight syntax, descriptive adjectives

**Use Cases:**
- **Ghost blog hero images**: Generate optimized Flux prompts for blog posts
- **Ghost blog hero videos**: Create Grok Imagine prompts for animated headers
- **Content creation**: Optimize prompts for any image/video generator
- **Workflow automation**: Integrate prompt generation into content pipelines

---

## Usage

### Image Prompt Generation

**Flux.1 (photorealism, natural language):**
```bash
bun run tools/generators/prompt-generator.ts \
  --type image \
  --generator flux \
  --idea "Developer analyzing algorithm in cyberpunk studio" \
  --style "Late-80s anime OVA aesthetic, hand-inked with heavy cross-hatching"

# Output:
# Late-80s anime OVA aesthetic, hand-inked with heavy cross-hatching.
#
# Developer analyzing X's algorithm source code on massive holographic displays
# showing weighted pathways branching in different directions—some paths glow
# brightly with thick data flows (conversation signals), others appear as thin,
# faint streams (passive engagement). Character has bob-style hair, dark hoodie,
# expressive eyes behind glasses, studying the architectural differences with
# intense focus. Binary code and engagement metrics float around the scene as
# glowing fragments.
```

**DALL-E 3 (creative interpretations, artistic styles):**
```bash
bun run tools/generators/prompt-generator.ts \
  --type image \
  --generator dalle \
  --idea "Abstract data visualization with geometric shapes" \
  --style "Minimalist, clean lines"

# Optimization: Simpler language, clear concept, artistic focus
```

**Midjourney (stylized imagery, fantasy art):**
```bash
bun run tools/generators/prompt-generator.ts \
  --type image \
  --generator midjourney \
  --idea "Futuristic city at sunset" \
  --style "Cyberpunk, neon lights, dramatic composition"

# Includes parameter suggestions: --ar 16:9 --stylize 250
```

---

### Video Prompt Generation

**Grok Imagine (anime animation, 2-4s cycles):**
```bash
bun run tools/generators/prompt-generator.ts \
  --type video \
  --generator grok-imagine \
  --idea "Developer studying code, nodding in understanding" \
  --style "80s cyberpunk aesthetic, hand-inked" \
  --duration "2-3 second cycles" \
  --motion slow

# Output:
# No sound. Consistent design and style, high self-similarity, slow, subtle.
# Focuses intently on source code analysis while nodding her head in agreement
# and clarity of what the algorithm is telling her. Urgent deliberate movements,
# hand gestures studying the terminal, eyes tracking the code. 2-3 second cycles
# minimum cycles, hand-inked animation frames. 80s cyberpunk aesthetic.
```

**Runway Gen-2 (photorealistic video, camera movements):**
```bash
bun run tools/generators/prompt-generator.ts \
  --type video \
  --generator runway \
  --idea "Camera panning across futuristic cityscape at sunset" \
  --motion medium

# Optimization: Camera movement, natural dynamics, longer duration
```

**Pika Labs (creative animations, style transformations):**
```bash
bun run tools/generators/prompt-generator.ts \
  --type video \
  --generator pika \
  --idea "Paintbrushes painting by themselves" \
  --style "Realistic with magical elements" \
  --motion subtle

# Includes motion parameters: -motion 1 (subtle)
```

---

### Programmatic Usage

**Image generation:**
```typescript
import { generateImagePrompt } from '@/tools/prompt-generators/image-generator';

const prompt = await generateImagePrompt({
  idea: "Developer analyzing algorithm in cyberpunk studio",
  generator: 'flux',
  style: "Late-80s anime OVA aesthetic, hand-inked",
  constraints: {
    aspectRatio: "16:9",
    length: "detailed"
  }
});

console.log(prompt);
```

**Video generation:**
```typescript
import { generateVideoPrompt } from '@/tools/prompt-generators/video-generator';

const prompt = await generateVideoPrompt({
  idea: "Developer studying code, nodding in understanding",
  generator: 'grok-imagine',
  style: "80s cyberpunk aesthetic, hand-inked",
  duration: "2-3 second cycles",
  motion: "slow",
  loopable: true
});

console.log(prompt);
```

**Idea analysis:**
```typescript
import { analyzeIdea } from '@/tools/prompt-generators/image-generator';

const analysis = analyzeIdea(
  "Developer analyzing algorithm in cyberpunk studio",
  "Late-80s anime OVA aesthetic"
);

console.log('Subjects:', analysis.subjects);    // ['developer']
console.log('Actions:', analysis.actions);      // ['analyzing']
console.log('Setting:', analysis.setting);      // 'cyberpunk city or environment'
console.log('Gaps:', analysis.gaps);            // Missing elements to enhance
```

---

## Configuration

### Generator Profiles

**Flux.1 (via Grok Imagine):**
```typescript
{
  name: 'Flux.1',
  strengths: [
    'Photorealism and natural scenes',
    'Text integration within images',
    'Natural language understanding',
    'Hierarchical composition (foreground to background)',
    'Lighting and atmosphere',
    'Detailed textures and materials'
  ],
  optimizationRules: [
    'Use descriptive adjectives for vivid imagery',
    'Structure: foreground → middle → background',
    'Specify lighting sources and mood',
    'Add camera specs for photorealism (e.g., "35mm lens, f/2.8")',
    'Avoid weights like (keyword:1.5) - use natural language',
    'Keep prompt detailed but concise (2-4 sentences max)'
  ],
  avoidPatterns: [
    'Keyword spam (e.g., "cyberpunk, neon, dark, futuristic, tech")',
    'Weight syntax (e.g., "(neon:1.5)")',
    'Overly long phrases (3+ sentences per element)'
  ]
}
```

**DALL-E 3:**
```typescript
{
  name: 'DALL-E 3',
  strengths: [
    'Creative interpretations',
    'Artistic styles and aesthetics',
    'Text rendering',
    'Conceptual imagery'
  ],
  optimizationRules: [
    'Focus on overall concept and mood',
    'Specify artistic style clearly',
    'Use natural, conversational language',
    'Keep prompts under 400 characters for best results'
  ],
  avoidPatterns: [
    'Over-specification of details',
    'Technical camera parameters',
    'Complex multi-part compositions'
  ]
}
```

**Midjourney:**
```typescript
{
  name: 'Midjourney',
  strengths: [
    'Artistic and stylized imagery',
    'Fantasy and concept art',
    'Color harmony',
    'Style references (e.g., "in the style of...")'
  ],
  optimizationRules: [
    'Use style references explicitly',
    'Focus on mood and atmosphere',
    'Leverage aspect ratio parameters (--ar)',
    'Combine natural language with parameters'
  ]
}
```

---

### Video Generator Profiles

**Grok Imagine (Animated):**
```typescript
{
  name: 'Grok Imagine',
  strengths: [
    'Anime-style animation frames',
    'Slow, subtle movements',
    'High self-similarity (consistent style)',
    '2-4 second cycle animations',
    'Hand-inked aesthetic preservation'
  ],
  optimizationRules: [
    'Specify animation speed explicitly (slow, subtle, 2-3s cycles)',
    'Emphasize consistency and self-similarity',
    'Use "hand-inked animation frames" for anime style',
    'Describe motion pattern (pulses, flows, gentle shifts)',
    'Specify no sound if audio-free'
  ],
  motionGuidelines: [
    'Slow movements: 2-4 second cycles minimum',
    'Subtle: gentle pulses, slow data flows, minimal character shifts',
    'Loopable: ensure motion can seamlessly repeat'
  ]
}
```

**Runway Gen-2:**
```typescript
{
  name: 'Runway Gen-2',
  strengths: [
    'Photorealistic video generation',
    'Camera movements and transitions',
    'Natural scene dynamics',
    'Longer duration clips (up to 18 seconds)'
  ],
  optimizationRules: [
    'Specify camera movement (pan, zoom, static)',
    'Describe motion direction and speed',
    'Keep descriptions concise for coherence'
  ]
}
```

**Pika Labs:**
```typescript
{
  name: 'Pika Labs',
  strengths: [
    'Creative and artistic animations',
    'Style transformations',
    'Animation from static images'
  ],
  optimizationRules: [
    'Use motion parameters (camera, speed)',
    'Keep motion simple for consistency',
    'Leverage negative prompts to avoid unwanted effects'
  ]
}
```

---

## API Reference

### generateImagePrompt()

#### `async generateImagePrompt(config: ImagePromptConfig): Promise<string>`

Generate optimized image prompt for specified generator.

**Parameters:**
```typescript
interface ImagePromptConfig {
  idea: string;                         // Core concept/scene
  generator: 'flux' | 'dalle' | 'midjourney';
  style?: string;                       // Art style description
  constraints?: {
    aspectRatio?: string;               // "16:9", "1:1", etc.
    quality?: 'standard' | 'hd';
    length?: 'concise' | 'detailed';
  };
}
```

**Returns:** Optimized prompt string

**Pattern:**
1. Lock style first (if provided)
2. Enhanced scene description
3. Hierarchical structure (foreground → background)
4. Natural language, no weight syntax

---

### generateVideoPrompt()

#### `async generateVideoPrompt(config: VideoPromptConfig): Promise<string>`

Generate optimized video prompt for specified generator.

**Parameters:**
```typescript
interface VideoPromptConfig {
  idea: string;                         // Core concept/action
  generator: 'grok-imagine' | 'runway' | 'pika';
  style?: string;                       // Animation style
  duration?: string;                    // "2-3 second cycles"
  motion?: 'slow' | 'medium' | 'fast' | 'subtle';
  loopable?: boolean;
}
```

**Returns:** Optimized prompt string

**Pattern (Grok Imagine):**
1. Technical requirements (no sound, consistency)
2. Scene description with motion emphasis
3. Timing/cycle information
4. Style with animation frame specification

---

### analyzeIdea()

#### `analyzeIdea(idea: string, style?: string): IdeaAnalysis`

Analyze user idea step-by-step to identify gaps.

**Parameters:**
- `idea` - User-provided concept
- `style` - Optional art style

**Returns:**
```typescript
interface IdeaAnalysis {
  subjects: string[];      // Main characters/objects
  actions: string[];       // Verbs/activities
  setting: string;         // Location/environment
  mood: string;            // Atmosphere/emotional tone
  gaps: string[];          // Missing elements to enhance
}
```

---

### analyzeVideoIdea()

#### `analyzeVideoIdea(idea: string, style?: string, duration?: string): VideoAnalysis`

Analyze video idea for motion and timing requirements.

**Parameters:**
- `idea` - User-provided concept
- `style` - Optional animation style
- `duration` - Optional duration specification

**Returns:**
```typescript
interface VideoAnalysis {
  sceneDescription: string;
  motionType: string;              // 'slow', 'fast', 'deliberate'
  timing: string;                  // Default "2-3 seconds"
  consistency: string[];           // Style consistency requirements
  gaps: string[];                  // Missing motion/timing elements
}
```

---

## Architecture

### Prompt Construction Flow

```
User provides: idea + generator + style
   ↓
1. Load generator profile
   GENERATOR_PROFILES[generator]
   → strengths, optimizationRules, avoidPatterns
   ↓
2. Analyze idea (optional)
   analyzeIdea(idea, style)
   → subjects, actions, setting, mood, gaps
   ↓
3. Build prompt structure
   IMAGE:
     - Style first (lock consistency)
     - Enhanced scene description
     - Hierarchical elements
     - Natural language
   VIDEO:
     - Technical requirements (no sound, consistency)
     - Scene + motion emphasis
     - Timing specification
     - Animation style
   ↓
4. Apply optimization rules
   - Descriptive adjectives
   - Lighting/atmosphere details
   - Camera specs (if photorealistic)
   - Motion patterns (if video)
   - Avoid keyword spam
   - Natural language (no weights)
   ↓
5. Return optimized prompt
   2-4 sentences (image) or structured multi-line (video)
```

---

### Optimization Principles

**Image Prompts:**
1. **Lock style first** - Art style at beginning ensures consistency
2. **Hierarchical structure** - Foreground → middle → background
3. **Natural language** - No weights, no keyword spam
4. **Descriptive adjectives** - Vivid, specific, evocative
5. **Avoid ambiguity** - Every element clearly described

**Video Prompts:**
1. **Specify motion type** - slow/subtle/fast/dynamic
2. **Define timing** - 2-3s cycles, continuous, looped
3. **Emphasize consistency** - High self-similarity, style preservation
4. **Describe movement patterns** - What animates, how it moves
5. **Loopability** - Ensure seamless repeat if needed

---

## Scripts

### Ghost Blog Hero Image Workflow

```bash
#!/bin/bash
# Generate optimized Flux prompt for blog hero image

POST_DIR="private/output/ghost/posts/2026-02-14-my-post"
IDEA="Developer analyzing algorithm architecture on holographic displays"
STYLE="Late-80s anime OVA aesthetic, hand-inked with heavy cross-hatching, cyberpunk"

# Step 1: Generate optimized prompt
bun run tools/generators/prompt-generator.ts \
  --type image \
  --generator flux \
  --idea "$IDEA" \
  --style "$STYLE" \
  --output "$POST_DIR/hero-prompt.txt"

echo "✓ Prompt saved to $POST_DIR/hero-prompt.txt"
echo "→ Copy prompt to Grok Imagine: https://grok.x.ai/imagine"

# Step 2 (manual): Paste prompt into Grok Imagine, download MP4
# Step 3 (after download): Convert to WebP
# tools/api/grok/convert-mp4-to-webp.sh $POST_DIR/hero.mp4
```

---

### Ghost Blog Hero Video Workflow

```bash
#!/bin/bash
# Generate optimized Grok Imagine video prompt

POST_DIR="private/output/ghost/posts/2026-02-14-my-post"
IDEA="Developer studying code, nodding in understanding as patterns emerge"
STYLE="80s cyberpunk aesthetic, hand-inked"

# Generate video prompt
bun run tools/generators/prompt-generator.ts \
  --type video \
  --generator grok-imagine \
  --idea "$IDEA" \
  --style "$STYLE" \
  --duration "2-3 second cycles" \
  --motion slow \
  --output "$POST_DIR/hero-video-prompt.txt"

echo "✓ Prompt saved to $POST_DIR/hero-video-prompt.txt"
echo "→ Copy prompt to Grok Imagine video: https://grok.x.ai/imagine"
```

---

### Batch Image Prompt Generation

```bash
#!/bin/bash
# Generate multiple image prompts for A/B testing

IDEAS=(
  "Developer analyzing algorithm:Late-80s anime, cyberpunk"
  "Code flowing through neural network:Minimalist, clean lines"
  "Hacker in dark room:Film noir, dramatic lighting"
)

for item in "${IDEAS[@]}"; do
  IFS=: read -r IDEA STYLE <<< "$item"

  FILENAME=$(echo "$IDEA" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')

  bun run tools/generators/prompt-generator.ts \
    --type image \
    --generator flux \
    --idea "$IDEA" \
    --style "$STYLE" \
    --output "output/prompts/${FILENAME}.txt"

  echo "✓ Generated: $FILENAME.txt"
done
```

---

## Dependencies

### Runtime

**External:** None (pure JavaScript)

**Internal:**
- Bun runtime
- Node.js `path` module

### Framework Integration

**Used By:**
- `tools/generators/prompt-generator.ts` - Main router/CLI
- `skills/ghost/phases/04-visuals.md` - Hero image/video generation
- Content creation workflows

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Tools:**
- `tools/generators/prompt-generator.ts` — main entry point that calls into image-generator.ts and video-generator.ts based on --type flag

**Skills:**
- `skills/ghost/phases/04-visuals.md` — instructs agent to use prompt-generators for hero image and video prompt creation

---

**File Structure:**
```
tools/prompt-generators/
├── image-generator.ts          # Image prompt optimization
├── video-generator.ts          # Video prompt optimization
├── README.md                   # Original documentation
└── TOOL.md                     # This file
```

---

## Troubleshooting

### Generated prompt too generic

**Cause:** Insufficient detail in idea or style

**Fix:**
```bash
# Add more specific details
bun run tools/generators/prompt-generator.ts \
  --type image \
  --generator flux \
  --idea "Developer with bob-cut hair, dark hoodie, glasses, analyzing holographic code displays showing weighted pathways" \
  --style "Late-80s anime OVA, hand-inked with heavy cross-hatching, neon cyan and magenta lighting, cyberpunk studio"

# NOT:
# --idea "Developer working"  # Too vague
# --style "Anime style"       # Too generic
```

---

### Flux generates inconsistent style

**Cause:** Style not locked at beginning of prompt

**Current behavior:** Style is placed first automatically

**Verify:**
```bash
# Check generated prompt starts with style
cat output/hero-prompt.txt | head -1
# Should show: "Late-80s anime OVA aesthetic..."
```

---

### Grok Imagine video too jarring/fast

**Cause:** Missing motion speed specification

**Fix:**
```bash
# Explicitly specify slow, subtle motion
bun run tools/generators/prompt-generator.ts \
  --type video \
  --generator grok-imagine \
  --idea "Developer nodding slowly while studying code" \
  --motion slow \  # ← Critical for Grok Imagine
  --duration "2-3 second cycles"

# Prompt will include: "slow, subtle" at beginning
```

---

### Video doesn't loop smoothly

**Cause:** Motion doesn't return to starting position

**Fix:**
```bash
# Describe cyclic motion explicitly
--idea "Developer studying code, nodding once, returning to neutral position"  # ✓ Loopable
# NOT:
--idea "Developer walking across room"  # ✗ Not loopable
```

---

### Midjourney parameters not working

**Cause:** Parameters not added by generator

**Current limitation:** Midjourney parameter suggestion is documented but not auto-added

**Manual workaround:**
```bash
# Generate prompt
bun run tools/generators/prompt-generator.ts \
  --type image \
  --generator midjourney \
  --idea "Futuristic city" \
  --style "Cyberpunk"

# Manually add parameters:
# <generated-prompt> --ar 16:9 --stylize 250 --v 6
```

---

## Related Tools

- **tools/generators/prompt-generator** - Main router/CLI
- **tools/api/grok** - Grok Imagine Docker service
- **skills/ghost** - Blog writing workflow (hero images/videos)
- **Flux.1 Documentation**: https://grok.x.ai/imagine
- **DALL-E Guide**: https://platform.openai.com/docs/guides/images
- **Midjourney Docs**: https://docs.midjourney.com

---

## Version History

### 1.0.0 (2026-01-28)
- ✅ Image prompt generator (Flux, DALL-E, Midjourney)
- ✅ Video prompt generator (Grok Imagine, Runway, Pika)
- ✅ Generator-specific optimization profiles
- ✅ Idea analysis (subjects, actions, setting, mood, gaps)
- ✅ Natural language construction (no weight syntax)
- ✅ Hierarchical composition patterns
- ✅ Motion and timing specifications for video
- ✅ Integration with Ghost blog workflow

---

## References

- **Flux.1 strengths**: https://grok.x.ai/imagine
- **DALL-E 3 best practices**: https://platform.openai.com/docs/guides/images/prompting
- **Midjourney prompt guide**: https://docs.midjourney.com/docs/prompts
- **Grok Imagine video**: https://grok.x.ai/imagine (video tab)
- **Runway Gen-2**: https://runwayml.com/gen-2/
- **Pika Labs**: https://pika.art/
- **Ghost hero image workflow**: `skills/ghost/phases/04-visuals.md`
