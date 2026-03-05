#!/usr/bin/env bun
/**
 * Universal Prompt Generator
 *
 * Multi-purpose prompt engineering tool supporting:
 * - Workflow prompts (task instructions for Claude Code)
 * - Image prompts (Flux, DALL-E, Midjourney optimization)
 * - Video prompts (Grok Imagine, Runway, Pika animation)
 * - LLM prompts (system prompts, few-shot examples)
 *
 * Purpose: Expert prompt engineering for different generation targets
 * using specialized optimization rules and generator-specific strengths.
 *
 * Usage Examples:
 *
 *   # Workflow prompts (original functionality)
 *   bun run tools/framework/generators/prompt-generator.ts \
 *     --type workflow \
 *     --task "Initialize security engagement" \
 *     --skill security \
 *     --auto-context
 *
 *   # Image prompts
 *   bun run tools/framework/generators/prompt-generator.ts \
 *     --type image \
 *     --generator flux \
 *     --idea "Developer analyzing algorithm in cyberpunk studio" \
 *     --style "Late-80s anime OVA, hand-inked"
 *
 *   # Video prompts
 *   bun run tools/framework/generators/prompt-generator.ts \
 *     --type video \
 *     --generator grok-imagine \
 *     --idea "Paintbrushes painting autonomously" \
 *     --duration "2-3s cycles" \
 *     --motion slow
 *
 * @version 3.0
 * @created 2026-01-28
 */

// Import specialized generators
import imageGen from '../../prompt-generators/image-generator.ts';
import videoGen from '../../prompt-generators/video-generator.ts';

type PromptType = 'workflow' | 'image' | 'video' | 'llm';

interface BaseConfig {
  type: PromptType;
  outputFile?: string;
}

interface WorkflowConfig extends BaseConfig {
  type: 'workflow';
  task: string;
  context?: string;
  skill?: string;
  workflow?: string;
  autoContext?: boolean;
}

interface ImageConfig extends BaseConfig {
  type: 'image';
  idea: string;
  generator: 'flux' | 'dalle' | 'midjourney';
  style?: string;
}

interface VideoConfig extends BaseConfig {
  type: 'video';
  idea: string;
  generator: 'grok-imagine' | 'runway' | 'pika';
  style?: string;
  duration?: string;
  motion?: 'slow' | 'medium' | 'fast' | 'subtle';
}

type PromptGeneratorConfig = WorkflowConfig | ImageConfig | VideoConfig;

/**
 * Load context files for auto-context mode
 */
async function loadAutoContext(skill?: string): Promise<string> {
  let context = "";

  // 1. Load tool signatures (always)
  try {
    const toolSigs = await Bun.file("tools/framework/utils/tool-signatures.json").text();
    context += `\n## Available Framework Tools\n\n${toolSigs}\n\n`;
  } catch (error) {
    console.warn("⚠️  Could not load tool-signatures.json");
  }

  // 2. Load skill docs if specified
  if (skill) {
    const skillDocsPath = `skills/${skill}/docs`;
    try {
      const files = await Array.fromAsync(
        new Bun.Glob("**/*.{md,yaml}").scan({ cwd: skillDocsPath })
      );

      if (files.length > 0) {
        context += `\n## ${skill.toUpperCase()} Skill Documentation\n\n`;
        for (const file of files) {
          const content = await Bun.file(`${skillDocsPath}/${file}`).text();
          context += `### ${file}\n\n${content}\n\n`;
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not load docs for skill: ${skill}`);
    }
  }

  // 3. Load tool catalog
  try {
    const catalog = await Bun.file("docs/catalogs/tool-catalog.md").text();
    context += `\n## Tool Catalog\n\n${catalog}\n\n`;
  } catch (error) {
    console.warn("⚠️  Could not load tool-catalog.md");
  }

  return context;
}

/**
 * Route to appropriate specialized generator based on type
 */
async function generatePrompt(config: PromptGeneratorConfig): Promise<string> {
  console.log(`\n🤖 Generating ${config.type} prompt...`);

  switch (config.type) {
    case 'image':
      return generateImagePrompt(config as ImageConfig);
    case 'video':
      return generateVideoPrompt(config as VideoConfig);
    case 'workflow':
      return generateWorkflowPrompt(config as WorkflowConfig);
    default:
      throw new Error(`Unknown prompt type: ${config.type}`);
  }
}

/**
 * Generate image prompt using specialized generator
 */
async function generateImagePrompt(config: ImageConfig): Promise<string> {
  console.log(`🎨 Generator: ${config.generator}`);
  console.log(`💡 Idea: ${config.idea}`);
  if (config.style) console.log(`🎭 Style: ${config.style}`);

  const imageConfig = {
    idea: config.idea,
    generator: config.generator,
    style: config.style
  };

  return await imageGen.generateImagePrompt(imageConfig);
}

/**
 * Generate video prompt using specialized generator
 */
async function generateVideoPrompt(config: VideoConfig): Promise<string> {
  console.log(`🎬 Generator: ${config.generator}`);
  console.log(`💡 Idea: ${config.idea}`);
  if (config.style) console.log(`🎭 Style: ${config.style}`);
  if (config.duration) console.log(`⏱️  Duration: ${config.duration}`);
  if (config.motion) console.log(`🏃 Motion: ${config.motion}`);

  const videoConfig = {
    idea: config.idea,
    generator: config.generator,
    style: config.style,
    duration: config.duration,
    motion: config.motion
  };

  return await videoGen.generateVideoPrompt(videoConfig);
}

/**
 * Generate workflow prompt (original functionality)
 */
async function generateWorkflowPrompt(config: WorkflowConfig): Promise<string> {
  console.log(`📋 Task: ${config.task}`);
  if (config.skill) console.log(`🎯 Skill: ${config.skill}`);
  if (config.workflow) console.log(`⚙️  Workflow: ${config.workflow}`);

  // Load auto-context if enabled
  let contextSection = config.context || "";
  if (config.autoContext) {
    console.log(`\n📚 Loading auto-context files...`);
    const autoCtx = await loadAutoContext(config.skill);
    contextSection = autoCtx + "\n" + contextSection;
    console.log(`✅ Context loaded\n`);
  }

  // Build prompt for Haiku
  const prompt = `CRITICAL INSTRUCTIONS:
- DO NOT create any files
- DO NOT use Write, Edit, or Bash tools
- ONLY generate text output and return it
- Keep output to approximately 100-150 lines total
- Generate a SINGLE workflow document, not multiple files

---

You are an expert prompt engineer creating step-by-step instructions for Base Claude.

${contextSection}

---

Generate a workflow for this task:

**Task:** ${config.task}

**Required format:**

## [Workflow Name]

**FOR: Base Claude (or specify agent if needed)**

### Step 1: [Action Name]

Use [ToolName] tool to [action]:
- [Specific details]

**Verify:**
- [ ] [Expected outcome 1]
- [ ] [Expected outcome 2]

**If failed:** [Recovery action]

### Step 2: [Next Action]

[Continue with 3-5 steps maximum]

**Requirements:**
- Use ONLY tools from the Available Framework Tools section above
- Include exact tool call syntax (AskUserQuestion, Bash, Task, Read, Write, Edit)
- Add verification checklists after each step
- Include error handling for common failures
- Keep language simple and direct (not overly formal)
- Reference domain knowledge from skill documentation when relevant

Generate the workflow now (text only, no files):`;

  console.log(`📤 Sending to Haiku...\n`);
  console.log("=" .repeat(80));
  console.log("NOTE: This is a placeholder. In actual implementation, this would:");
  console.log("1. Use Task({ subagent_type: 'general-purpose', model: 'haiku', ... })");
  console.log("2. Capture Haiku's text output");
  console.log("3. Return it to Base Claude for QA validation");
  console.log("=" .repeat(80));

  // For now, return the prompt that would be sent to Haiku
  // In real implementation, this would call Task and return its output
  return `[Placeholder: Would call Haiku here with this prompt]\n\n${prompt}`;
}

/**
 * Save generated prompt to file
 */
async function savePrompt(prompt: string, filename: string): Promise<void> {
  const outputPath = `docs/prompts/generated/${filename}`;
  await Bun.write(outputPath, prompt);
  console.log(`\n💾 Prompt saved to: ${outputPath}`);
}

/**
 * CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);

  const getArg = (flag: string): string | undefined => {
    const index = args.indexOf(flag);
    return index >= 0 && index + 1 < args.length ? args[index + 1] : undefined;
  };

  const hasFlag = (flag: string): boolean => args.includes(flag);

  if (args.length === 0 || hasFlag("--help") || hasFlag("-h")) {
    console.log(`
Universal Prompt Generator - Multi-Purpose Prompt Engineering Tool

Usage:
  bun run tools/framework/generators/prompt-generator.ts --type <type> [options]

Required:
  --type <string>        Prompt type: workflow | image | video | llm

WORKFLOW PROMPTS (task instructions for Claude Code):
  --task <string>        The task to generate instructions for
  --skill <name>         Skill name to load docs from
  --workflow <name>      Workflow name (for reference)
  --auto-context         Auto-load tool signatures and skill docs
  --output <filename>    Save to docs/prompts/generated/<filename>

IMAGE PROMPTS (Flux, DALL-E, Midjourney):
  --idea <string>        Image concept/description
  --generator <name>     flux | dalle | midjourney
  --style <string>       Art style or aesthetic
  --output <filename>    Save optimized prompt

VIDEO PROMPTS (Grok Imagine, Runway, Pika):
  --idea <string>        Video concept/description
  --generator <name>     grok-imagine | runway | pika
  --style <string>       Visual style or aesthetic
  --duration <string>    Duration or cycle time (e.g., "2-3s cycles")
  --motion <string>      slow | medium | fast | subtle
  --output <filename>    Save optimized prompt

Examples:

  # Workflow prompt (original functionality)
  bun run tools/framework/generators/prompt-generator.ts \\
    --type workflow \\
    --task "Initialize security engagement" \\
    --skill security \\
    --auto-context

  # Image prompt for Flux
  bun run tools/framework/generators/prompt-generator.ts \\
    --type image \\
    --generator flux \\
    --idea "Developer analyzing algorithm in cyberpunk studio" \\
    --style "Late-80s anime OVA aesthetic, hand-inked" \\
    --output hero-prompt.md

  # Video prompt for Grok Imagine
  bun run tools/framework/generators/prompt-generator.ts \\
    --type video \\
    --generator grok-imagine \\
    --idea "Paintbrushes painting autonomously" \\
    --style "Realistic with magical elements" \\
    --duration "2-3s cycles" \\
    --motion slow \\
    --output hero-video-prompt.txt
`);
    process.exit(0);
  }

  const type = (getArg("--type") || 'workflow') as PromptType;
  const outputFile = getArg("--output");

  let config: PromptGeneratorConfig;

  // Parse type-specific arguments
  switch (type) {
    case 'workflow': {
      const task = getArg("--task");
      const context = getArg("--context");
      const skill = getArg("--skill");
      const workflow = getArg("--workflow");
      const autoContext = hasFlag("--auto-context");

      if (!task) {
        console.error("❌ Error: --task is required for workflow prompts");
        process.exit(1);
      }

      if (!autoContext && !context) {
        console.error("❌ Error: Either --context or --auto-context is required for workflow prompts");
        process.exit(1);
      }

      config = {
        type: 'workflow',
        task,
        context,
        skill,
        workflow,
        autoContext,
        outputFile
      };
      break;
    }

    case 'image': {
      const idea = getArg("--idea");
      const generator = getArg("--generator") as 'flux' | 'dalle' | 'midjourney';
      const style = getArg("--style");

      if (!idea) {
        console.error("❌ Error: --idea is required for image prompts");
        process.exit(1);
      }

      if (!generator) {
        console.error("❌ Error: --generator is required for image prompts (flux | dalle | midjourney)");
        process.exit(1);
      }

      config = {
        type: 'image',
        idea,
        generator,
        style,
        outputFile
      };
      break;
    }

    case 'video': {
      const idea = getArg("--idea");
      const generator = getArg("--generator") as 'grok-imagine' | 'runway' | 'pika';
      const style = getArg("--style");
      const duration = getArg("--duration");
      const motion = getArg("--motion") as 'slow' | 'medium' | 'fast' | 'subtle' | undefined;

      if (!idea) {
        console.error("❌ Error: --idea is required for video prompts");
        process.exit(1);
      }

      if (!generator) {
        console.error("❌ Error: --generator is required for video prompts (grok-imagine | runway | pika)");
        process.exit(1);
      }

      config = {
        type: 'video',
        idea,
        generator,
        style,
        duration,
        motion,
        outputFile
      };
      break;
    }

    default:
      console.error(`❌ Error: Unknown prompt type: ${type}`);
      console.error("   Valid types: workflow | image | video");
      process.exit(1);
  }

  try {
    const prompt = await generatePrompt(config);

    // Print the generated prompt
    console.log("\n" + "=".repeat(80));
    console.log("GENERATED PROMPT:");
    console.log("=".repeat(80));
    console.log(prompt);
    console.log("=".repeat(80));

    if (outputFile) {
      await savePrompt(prompt, outputFile);
    }

    console.log(`\n✨ ${type.charAt(0).toUpperCase() + type.slice(1)} prompt generation complete!`);

    if (type === 'workflow') {
      console.log("\nNext steps:");
      console.log("1. Review generated prompt above");
      console.log("2. Actually call Haiku (not yet implemented in this tool)");
      console.log("3. Run QA validation (manual review; prompt-qa.ts was removed)");
    } else {
      console.log("\nGenerated prompt is ready to copy-paste into your generator.");
    }
  } catch (error) {
    console.error("\n💥 Prompt generation failed:", error);
    process.exit(1);
  }
}

// Run CLI if executed directly
if (import.meta.main) {
  main();
}

export { generatePrompt, type PromptGeneratorConfig };
