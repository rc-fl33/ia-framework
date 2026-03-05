#!/usr/bin/env bun
/**
 * Image Generation CLI — Write Skill
 *
 * Generates images using the OpenRouter API (Flux models) with optional
 * AI-powered prompt optimization via the image prompt generator.
 *
 * ============================================================================
 * HOW THIS SCRIPT FITS INTO THE PIPELINE
 * ============================================================================
 *
 * This script is the CLI entry point for Phase 4 (VISUALS) of the write skill.
 * It connects two existing pieces of infrastructure:
 *
 *   1. tools/prompt-generators/image-generator.ts
 *      - Analyzes a topic idea and crafts an optimized prompt
 *      - Applies generator-specific optimization rules (Flux, DALL-E, etc.)
 *
 *   2. tools/api/openrouter/client.ts
 *      - Sends the prompt to OpenRouter's image generation API
 *      - Handles retries, error recovery, and file output
 *
 * The flow is:
 *   --topic "idea" --> analyzeIdea() --> generateImagePrompt() --> OpenRouterClient.generateImageToFile()
 *   --prompt "text" --> (skip analysis) --> OpenRouterClient.generateImageToFile()
 *
 * ============================================================================
 * USAGE EXAMPLES
 * ============================================================================
 *
 *   # Show full help with all options and examples:
 *   bun run skills/write/scripts/image-generate.ts --help
 *
 *   # Generate from a topic (prompt is auto-optimized):
 *   bun run skills/write/scripts/image-generate.ts --topic "cybersecurity blog header"
 *
 *   # Generate with style and aspect ratio:
 *   bun run skills/write/scripts/image-generate.ts --topic "API architecture diagram" --style "minimalist technical" --aspect-ratio 16:9
 *
 *   # Generate from an exact prompt (no optimization):
 *   bun run skills/write/scripts/image-generate.ts --prompt "A glowing circuit board in deep blue tones, isometric view, 4K detail"
 *
 *   # Analyze a topic without generating (see what the optimizer produces):
 *   bun run skills/write/scripts/image-generate.ts --topic "zero trust security model" --analyze
 *
 *   # Specify output path:
 *   bun run skills/write/scripts/image-generate.ts --topic "cloud infrastructure" --output ./my-image.png
 *
 * ============================================================================
 * PREREQUISITES
 * ============================================================================
 *
 *   1. OPENROUTER_API_KEY must be set in the framework .env file
 *      - Get a key at https://openrouter.ai
 *      - Add to .env: OPENROUTER_API_KEY=[insert key]
 *      - Verify: bun run skills/write/scripts/setup.ts validate
 *
 *   2. Bun runtime (https://bun.sh)
 *
 * @version 1.0.0
 * @created 2026-02-08
 */

import { resolve, join, dirname } from 'path';
import { existsSync, readFileSync } from 'fs';
import { mkdir } from 'fs/promises';
import { OpenRouterClient } from '@/tools/openrouter/client';
import { generateImagePrompt, analyzeIdea, GENERATOR_PROFILES } from '../../../tools/prompt-generators/image-generator';
import type { ImageGenerationOptions } from '@/tools/openrouter/types';

// =============================================================================
// CONSTANTS
// =============================================================================

const SCRIPT_DIR = import.meta.dir;
const SKILL_ROOT = resolve(SCRIPT_DIR, '..');
const FRAMEWORK_ROOT = resolve(SCRIPT_DIR, '../../..');
const DEFAULT_OUTPUT_DIR = join(SKILL_ROOT, 'output', 'images');
const STYLE_CUSTOM_PATH = join(SKILL_ROOT, 'templates', 'image-style-custom.md');
const STYLE_TEMPLATE_PATH = join(SKILL_ROOT, 'templates', 'image-style-template.md');

const DEFAULT_MODEL = 'black-forest-labs/flux.2-max';
const DEFAULT_ASPECT_RATIO = '16:9';

const AVAILABLE_MODELS = [
  { id: 'black-forest-labs/flux.2-max',   desc: 'Highest quality (default)' },
  { id: 'black-forest-labs/flux.2-pro',   desc: 'Professional grade' },
  { id: 'black-forest-labs/flux.2-klein', desc: 'Balanced speed/quality' },
  { id: 'black-forest-labs/flux.2-flex',  desc: 'Flexible, fast iteration' },
];

const VALID_ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4'] as const;

// =============================================================================
// CLI ARGUMENT PARSING
// =============================================================================

interface ParsedArgs {
  topic?: string;
  prompt?: string;
  output?: string;
  style?: string;
  model?: string;
  aspectRatio?: string;
  analyze: boolean;
  help: boolean;
}

function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2);
  const parsed: ParsedArgs = { analyze: false, help: false };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case '--topic':
      case '-t':
        if (!next || next.startsWith('-')) { exitWithError('--topic requires a value'); }
        parsed.topic = next;
        i++;
        break;

      case '--prompt':
      case '-p':
        if (!next || next.startsWith('-')) { exitWithError('--prompt requires a value'); }
        parsed.prompt = next;
        i++;
        break;

      case '--output':
      case '-o':
        if (!next || next.startsWith('-')) { exitWithError('--output requires a value'); }
        parsed.output = next;
        i++;
        break;

      case '--style':
      case '-s':
        if (!next || next.startsWith('-')) { exitWithError('--style requires a value'); }
        parsed.style = next;
        i++;
        break;

      case '--model':
      case '-m':
        if (!next || next.startsWith('-')) { exitWithError('--model requires a value'); }
        parsed.model = next;
        i++;
        break;

      case '--aspect-ratio':
      case '--ar':
      case '-a':
        if (!next || next.startsWith('-')) { exitWithError('--aspect-ratio requires a value'); }
        parsed.aspectRatio = next;
        i++;
        break;

      case '--analyze':
        parsed.analyze = true;
        break;

      case '--help':
      case '-h':
        parsed.help = true;
        break;

      default:
        exitWithError(`Unknown argument: ${arg}\nRun with --help to see usage.`);
    }
  }

  return parsed;
}

// =============================================================================
// HELP TEXT
// =============================================================================

function printHelp(): void {
  console.log(`
IMAGE GENERATION CLI — Write Skill (Phase 4: VISUALS)
=====================================================

Generates images using the OpenRouter API with Flux models.
Optionally uses the AI prompt optimizer for better results.

USAGE
-----

  bun run skills/write/scripts/image-generate.ts [OPTIONS]

  You MUST provide either --topic or --prompt (not both).

OPTIONS
-------

  --topic, -t <text>         A topic/concept to generate an image for.
                             The prompt optimizer will analyze this topic and
                             craft an optimized prompt automatically.
                             Example: --topic "cybersecurity threat landscape"

  --prompt, -p <text>        An exact, pre-written prompt to send directly to
                             the image model. No optimization is applied.
                             Example: --prompt "A neon-lit server room, wide angle"

  --output, -o <path>        Where to save the generated image.
                             Can be a directory (image named automatically) or
                             a full file path ending in .png.
                             Default: private/output/write/images/{slug}-{timestamp}.png

  --style, -s <text>         Style description to apply to the prompt.
                             If omitted, reads from the custom style template:
                               templates/image-style-custom.md
                             If that file does not exist, falls back to:
                               templates/image-style-template.md
                             Example: --style "minimalist technical illustration"

  --model, -m <model-id>     OpenRouter model ID to use for generation.
                             Default: ${DEFAULT_MODEL}

  --aspect-ratio, --ar, -a   Aspect ratio for the generated image.
                             Valid values: ${VALID_ASPECT_RATIOS.join(', ')}
                             Default: ${DEFAULT_ASPECT_RATIO}

  --analyze                  ANALYSIS ONLY mode. When used with --topic, prints
                             the prompt analysis (subjects, actions, setting,
                             mood, gaps) without generating any image.
                             Useful for previewing what the optimizer will produce.

  --help, -h                 Show this help message and exit.

AVAILABLE MODELS
----------------

${AVAILABLE_MODELS.map(m => `  ${m.id.padEnd(38)} ${m.desc}`).join('\n')}

  You can also specify any other image-capable model on OpenRouter.
  See: https://openrouter.ai/models?modality=image

EXAMPLES
--------

  1. GENERATE FROM TOPIC (auto-optimized prompt):

     bun run skills/write/scripts/image-generate.ts \\
       --topic "cybersecurity blog header" \\
       --aspect-ratio 16:9

     This analyzes "cybersecurity blog header", generates an optimized
     prompt using the Flux profile, and creates the image.

  2. GENERATE WITH CUSTOM STYLE:

     bun run skills/write/scripts/image-generate.ts \\
       --topic "API architecture overview" \\
       --style "clean technical diagram, blue and gray palette" \\
       --aspect-ratio 16:9

  3. GENERATE FROM EXACT PROMPT (no optimization):

     bun run skills/write/scripts/image-generate.ts \\
       --prompt "Isometric view of a cloud data center, soft gradients, \\
       blue and purple tones, minimalist style, white background" \\
       --output ./private/output/write/images/datacenter-hero.png

  4. ANALYZE TOPIC WITHOUT GENERATING:

     bun run skills/write/scripts/image-generate.ts \\
       --topic "zero trust security model" \\
       --analyze

     Output shows: subjects, actions, setting, mood, and identified gaps.
     No API call is made. No credits are used.

  5. USE A DIFFERENT MODEL:

     bun run skills/write/scripts/image-generate.ts \\
       --topic "abstract network topology" \\
       --model black-forest-labs/flux.2-pro

  6. SPECIFY OUTPUT DIRECTORY (auto-named file):

     bun run skills/write/scripts/image-generate.ts \\
       --topic "encryption concept art" \\
       --output ./private/output/write/images/

  7. DURING PHASE 4 OF WRITE SKILL:

     bun run skills/write/scripts/image-generate.ts \\
       --topic "your blog post concept" \\
       --output "private/output/write/images/concept-1.png" \\
       --aspect-ratio 16:9

ENVIRONMENT
-----------

  OPENROUTER_API_KEY    Required. Set in the framework .env file.

  To set up:
    1. Get an API key at https://openrouter.ai
    2. Add to .env file:  OPENROUTER_API_KEY=[insert key]
    3. Verify:  bun run skills/write/scripts/setup.ts validate

FILES
-----

  Style templates (read automatically if --style is not provided):
    skills/write/templates/image-style-custom.md   (preferred, user-customized)
    skills/write/templates/image-style-template.md  (fallback, generic)

  Prompt optimizer:
    tools/prompt-generators/image-generator.ts

  OpenRouter client:
    tools/api/openrouter/client.ts

  Default output directory:
    private/output/write/images/
`);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function exitWithError(message: string, code: number = 1): never {
  console.error(`\nERROR: ${message}\n`);
  process.exit(code);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

function timestamp(): string {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
}

function resolveOutputPath(parsed: ParsedArgs, topicOrPrompt: string): string {
  if (parsed.output) {
    // If output ends with / or is a directory, auto-name the file inside it
    if (parsed.output.endsWith('/') || parsed.output.endsWith('\\')) {
      const slug = slugify(topicOrPrompt);
      return resolve(parsed.output, `${slug}-${timestamp()}.png`);
    }
    // If output has no extension, treat as directory
    if (!parsed.output.includes('.')) {
      const slug = slugify(topicOrPrompt);
      return resolve(parsed.output, `${slug}-${timestamp()}.png`);
    }
    // Full file path provided
    return resolve(parsed.output);
  }

  // Default: private/output/write/images/{slug}-{timestamp}.png
  const slug = slugify(topicOrPrompt);
  return join(DEFAULT_OUTPUT_DIR, `${slug}-${timestamp()}.png`);
}

function readStyleTemplate(): string | undefined {
  // Try custom template first
  if (existsSync(STYLE_CUSTOM_PATH)) {
    try {
      const content = readFileSync(STYLE_CUSTOM_PATH, 'utf-8');
      // Extract the Visual Aesthetic section or return a summary
      const styleMatch = content.match(/## Visual Aesthetic[\s\S]*?(?=\n## |$)/);
      if (styleMatch) {
        return styleMatch[0].trim();
      }
      return undefined;
    } catch {
      // Fall through to template
    }
  }

  // Try generic template
  if (existsSync(STYLE_TEMPLATE_PATH)) {
    try {
      const content = readFileSync(STYLE_TEMPLATE_PATH, 'utf-8');
      const styleMatch = content.match(/## Visual Aesthetic[\s\S]*?(?=\n## |$)/);
      if (styleMatch) {
        return styleMatch[0].trim();
      }
      return undefined;
    } catch {
      return undefined;
    }
  }

  return undefined;
}

// =============================================================================
// CORE FUNCTIONS
// =============================================================================

function runAnalysis(topic: string, style?: string): void {
  console.log('\n--- TOPIC ANALYSIS ---\n');
  console.log(`Topic: "${topic}"`);
  if (style) {
    console.log(`Style: "${style}"`);
  }

  const analysis = analyzeIdea(topic, style);

  console.log('\nSubjects found:');
  if (analysis.subjects.length > 0) {
    analysis.subjects.forEach(s => console.log(`  - ${s}`));
  } else {
    console.log('  (none detected)');
  }

  console.log('\nActions found:');
  if (analysis.actions.length > 0) {
    analysis.actions.forEach(a => console.log(`  - ${a}`));
  } else {
    console.log('  (none detected)');
  }

  console.log(`\nSetting: ${analysis.setting || '(not detected)'}`);
  console.log(`Mood:    ${analysis.mood || '(not detected)'}`);

  if (analysis.gaps.length > 0) {
    console.log('\nGaps / Suggestions:');
    analysis.gaps.forEach(g => console.log(`  * ${g}`));
  } else {
    console.log('\nNo gaps detected - topic is well-specified.');
  }

  console.log('\n--- Flux Generator Profile ---\n');
  const profile = GENERATOR_PROFILES['flux'];
  console.log(`Generator: ${profile.name}`);
  console.log(`Strengths: ${profile.strengths.join(', ')}`);
  console.log(`\nOptimization rules:`);
  profile.optimizationRules.forEach(r => console.log(`  - ${r}`));

  console.log('\n--- END ANALYSIS ---');
  console.log('\nNo image was generated. Remove --analyze to generate.');
}

async function buildPrompt(topic: string, style?: string): Promise<string> {
  const effectiveStyle = style || readStyleTemplate() || undefined;

  const prompt = await generateImagePrompt({
    idea: topic,
    generator: 'flux',
    style: effectiveStyle,
    constraints: {
      length: 'detailed',
    },
  });

  return prompt;
}

async function generateImage(
  finalPrompt: string,
  outputPath: string,
  model: string,
  aspectRatio: string,
): Promise<void> {
  console.log('\n--- IMAGE GENERATION ---\n');
  console.log(`Model:        ${model}`);
  console.log(`Aspect ratio: ${aspectRatio}`);
  console.log(`Output:       ${outputPath}`);
  console.log(`Prompt:       ${finalPrompt.substring(0, 200)}${finalPrompt.length > 200 ? '...' : ''}`);
  console.log('\nSending request to OpenRouter API...');

  // Ensure output directory exists
  const outDir = dirname(outputPath);
  await mkdir(outDir, { recursive: true });

  let client: OpenRouterClient;
  try {
    client = new OpenRouterClient();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('OPENROUTER_API_KEY')) {
      console.error('\nERROR: OPENROUTER_API_KEY is not set.\n');
      console.error('To fix this:');
      console.error('  1. Get an API key at https://openrouter.ai');
      console.error('  2. Add to your .env file:');
      console.error('       OPENROUTER_API_KEY=[insert key]');
      console.error('  3. Verify setup:');
      console.error('       bun run skills/write/scripts/setup.ts validate');
      process.exit(1);
    }
    throw error;
  }

  const options: ImageGenerationOptions & { outputPath: string } = {
    prompt: finalPrompt,
    model,
    aspect_ratio: aspectRatio as ImageGenerationOptions['aspect_ratio'],
    outputPath,
    retries: 3,
  };

  const startTime = Date.now();
  const result = await client.generateImageToFile(options);
  const elapsed = Date.now() - startTime;

  if (result.status === 'success') {
    console.log('\n--- RESULT: SUCCESS ---\n');
    console.log(`Image saved: ${result.imagePath || outputPath}`);
    console.log(`Latency:     ${result.latency_ms || elapsed}ms`);
    if (result.cost !== undefined) {
      console.log(`Est. cost:   $${result.cost.toFixed(4)}`);
    }
    console.log(`Timestamp:   ${result.timestamp}`);
    console.log('');
  } else {
    console.error('\n--- RESULT: FAILED ---\n');
    console.error(`Error: ${result.error}`);
    console.error('');
    console.error('Suggestions:');
    console.error('  - Check that your OPENROUTER_API_KEY is valid and has credits');
    console.error('  - Try a different model with --model');
    console.error('  - Simplify the prompt');
    console.error('  - Retry the command (transient API errors are common)');
    console.error('');
    process.exit(1);
  }
}

// =============================================================================
// MAIN
// =============================================================================

async function main(): Promise<void> {
  const parsed = parseArgs(process.argv);

  // --help: show help and exit
  if (parsed.help) {
    printHelp();
    process.exit(0);
  }

  // Validate: must have --topic or --prompt
  if (!parsed.topic && !parsed.prompt) {
    console.error('\nERROR: You must provide either --topic or --prompt.\n');
    console.error('Quick examples:');
    console.error('  bun run skills/write/scripts/image-generate.ts --topic "cybersecurity blog header"');
    console.error('  bun run skills/write/scripts/image-generate.ts --prompt "A glowing circuit board"');
    console.error('\nRun with --help for full usage information.');
    process.exit(1);
  }

  // Validate: cannot have both --topic and --prompt
  if (parsed.topic && parsed.prompt) {
    exitWithError('Cannot use both --topic and --prompt. Choose one.\n  --topic: auto-optimizes the prompt\n  --prompt: uses your exact text');
  }

  // Validate: --analyze only works with --topic
  if (parsed.analyze && !parsed.topic) {
    exitWithError('--analyze requires --topic. It analyzes a topic before prompt generation.');
  }

  // Validate aspect ratio
  if (parsed.aspectRatio && !VALID_ASPECT_RATIOS.includes(parsed.aspectRatio as any)) {
    exitWithError(`Invalid aspect ratio: "${parsed.aspectRatio}"\nValid values: ${VALID_ASPECT_RATIOS.join(', ')}`);
  }

  // --analyze mode: print analysis and exit
  if (parsed.analyze && parsed.topic) {
    runAnalysis(parsed.topic, parsed.style);
    process.exit(0);
  }

  // Build the final prompt
  let finalPrompt: string;

  if (parsed.topic) {
    console.log(`\nOptimizing prompt for topic: "${parsed.topic}"`);
    finalPrompt = await buildPrompt(parsed.topic, parsed.style);
    console.log(`Optimized prompt: "${finalPrompt}"`);
  } else {
    // --prompt: use exact text
    finalPrompt = parsed.prompt!;
  }

  // Resolve output path
  const outputPath = resolveOutputPath(parsed, parsed.topic || parsed.prompt!);

  // Resolve model and aspect ratio
  const model = parsed.model || DEFAULT_MODEL;
  const aspectRatio = parsed.aspectRatio || DEFAULT_ASPECT_RATIO;

  // Generate the image
  await generateImage(finalPrompt, outputPath, model, aspectRatio);
}

main().catch((error) => {
  console.error('\nUnexpected error:', error instanceof Error ? error.message : String(error));
  console.error('\nIf this persists, check:');
  console.error('  - Network connectivity');
  console.error('  - API key validity: bun run skills/write/scripts/setup.ts validate');
  console.error('  - OpenRouter status: https://status.openrouter.ai');
  process.exit(1);
});
