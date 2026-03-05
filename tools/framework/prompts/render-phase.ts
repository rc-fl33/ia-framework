/**
 * Phase Renderer — Reads a UPS phase file and injects dynamic PROGRESS
 * TRACKING from the EXECUTION steps at render time.
 *
 * Phase files stay as pure content. This script adds the presentation layer.
 *
 * Usage:
 *   bun run tools/framework/prompts/render-phase.ts <phase-file> [--mode <mode>] [--effort <effort>]
 *
 * Output: The rendered phase with PROGRESS TRACKING injected to stdout.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { parseMarkdownSections, findSection } from '../markdown/section-parser';
import type { MarkdownSection } from '../markdown/section-parser';

interface ExecutionStep {
  number: string;       // "0", "0.5", "1a", "1b", "2", etc.
  title: string;        // Step title text
  appliesTo?: string;   // Mode restriction if any
  effort?: string;      // Minimum effort level if any
}

interface RenderContext {
  mode?: string;
  effort?: string;
}

/**
 * Extract execution steps from sections following ## EXECUTION.
 * The section parser splits ### Step headings into their own sections,
 * so we find all level-3 sections after EXECUTION and before the next
 * level-2 section.
 */
function extractExecutionSteps(sections: MarkdownSection[]): ExecutionStep[] {
  // Find the index of the EXECUTION section
  const execIdx = sections.findIndex(
    s => s.level === 2 && s.title.toUpperCase().includes('EXECUTION')
  );
  if (execIdx === -1) return [];

  const steps: ExecutionStep[] = [];

  // Collect all level-3 sections after EXECUTION until the next level-2
  for (let i = execIdx + 1; i < sections.length; i++) {
    const s = sections[i];
    if (s.level <= 2) break; // Hit next ## section — stop

    // Match "Step N: Title" in the section title
    const match = s.title.match(/^Step\s+([\d.]+[a-z]?):\s+(.+)$/);
    if (!match) continue;

    const step: ExecutionStep = {
      number: match[1],
      title: match[2].trim(),
    };

    // Check for mode/effort markers in parentheses
    const modeMatch = step.title.match(/\((\w+)\s+(?:posts?\s+)?only\)/i);
    if (modeMatch) {
      step.appliesTo = modeMatch[1].toLowerCase();
    }

    steps.push(step);
  }

  return steps;
}

/** Filter steps by mode and effort context. */
function filterSteps(steps: ExecutionStep[], ctx: RenderContext): ExecutionStep[] {
  return steps.filter(step => {
    if (step.appliesTo && ctx.mode) {
      if (step.appliesTo !== ctx.mode.toLowerCase()) return false;
    }
    if (step.effort && ctx.effort) {
      const levels = ['quick', 'standard', 'extended'];
      const required = levels.indexOf(step.effort.toLowerCase());
      const current = levels.indexOf(ctx.effort.toLowerCase());
      if (current < required) return false;
    }
    return true;
  });
}

/** Infer phase-type metrics from the phase title and step content. */
function inferMetrics(phaseTitle: string, steps: ExecutionStep[]): string[] {
  const lower = phaseTitle.toLowerCase();

  if (lower.includes('research'))
    return ['Sources found', 'Files created'];
  if (lower.includes('draft') || lower.includes('write'))
    return ['Sections written', 'Word count'];
  if (lower.includes('qa') || lower.includes('review') || lower.includes('verify'))
    return ['Issues found', 'Issues resolved'];
  if (lower.includes('intake') || lower.includes('assess'))
    return ['Items evaluated', 'Files created'];
  if (lower.includes('recommend'))
    return ['Recommendations generated', 'Frameworks referenced'];
  if (lower.includes('deliver') || lower.includes('output') || lower.includes('publish'))
    return ['Deliverables produced', 'Files verified'];
  if (lower.includes('analyze') || lower.includes('identify'))
    return ['Components analyzed', 'Findings identified'];

  // Generic fallback
  return ['Items processed', 'Files created'];
}

/** Generate the PROGRESS TRACKING markdown block. */
function generateProgressTracking(
  phaseTitle: string,
  steps: ExecutionStep[],
): string {
  const metrics = inferMetrics(phaseTitle, steps);
  const stepList = steps.map(s => `- ${s.title}`).join('\n');
  const metricsBlock = metrics.map(m => `- ${m}: [tracked during execution]`).join('\n');

  return `## PROGRESS TRACKING

**Display a running checklist to the user as you work through this phase.**

**Steps in this phase:**
${stepList}

**After completing each step:**
1. Mark completed step as ✓
2. Mark next step as ▸ with brief status
3. Update metrics with actual values
4. Display updated checklist to user

**Format:**
\`\`\`
PHASE: ${phaseTitle}
────────────────────────────────
✓ [Completed step]
▸ [Current step] — [brief status]
□ [Pending step]

Metrics: [key]: [insert key] | [key]: [insert key]
Progress: X/${steps.length} steps
\`\`\`

**At phase end:** All ✓, final metrics, "Ready for next phase →"

**Metrics to track:**
${metricsBlock}`;
}

/** Rebuild the phase markdown with PROGRESS TRACKING injected. */
function renderPhase(content: string, ctx: RenderContext): string {
  const parsed = parseMarkdownSections(content);

  const allSteps = extractExecutionSteps(parsed.sections);
  const steps = filterSteps(allSteps, ctx);

  // Find the phase title from the document
  const phaseTitle = parsed.title ?? 'UNKNOWN PHASE';

  const progressBlock = generateProgressTracking(phaseTitle, steps);

  // Rebuild: frontmatter + sections, replacing or injecting PROGRESS TRACKING
  const lines = content.split('\n');
  const output: string[] = [];
  let injected = false;
  let skippingExistingProgress = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect existing PROGRESS TRACKING section — skip it
    if (line.match(/^##\s+PROGRESS\s+TRACKING/i)) {
      skippingExistingProgress = true;
      continue;
    }

    // Stop skipping when we hit the next ## section
    if (skippingExistingProgress && line.match(/^##\s+/) && !line.match(/^##\s+PROGRESS/i)) {
      skippingExistingProgress = false;
    }

    if (skippingExistingProgress) continue;

    // Inject PROGRESS TRACKING right before EXECUTION
    if (!injected && line.match(/^##\s+EXECUTION/i)) {
      output.push(progressBlock);
      output.push('');
      output.push('---');
      output.push('');
      injected = true;
    }

    output.push(line);
  }

  return output.join('\n');
}

// --------------- CLI Entry Point ---------------
if (import.meta.path === Bun.main || process.argv[1]?.endsWith('render-phase.ts')) {
  const args = process.argv.slice(2);
  let filePath = '';
  let mode = '';
  let effort = '';

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--mode': case '-m': mode = args[++i] ?? ''; break;
      case '--effort': case '-e': effort = args[++i] ?? ''; break;
      default:
        if (!args[i].startsWith('-')) filePath = args[i];
    }
  }

  if (!filePath) {
    console.error('Usage: render-phase <phase-file> [--mode <mode>] [--effort <effort>]');
    process.exit(1);
  }

  const absPath = resolve(filePath);
  const content = readFileSync(absPath, 'utf-8');
  const rendered = renderPhase(content, { mode, effort });
  console.log(rendered);
}

export { renderPhase, extractExecutionSteps, filterSteps, generateProgressTracking };
