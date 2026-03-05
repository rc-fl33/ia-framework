/**
 * Anti-Rationalization Hook (Stop)
 *
 * Detects when Claude rationalizes incomplete work with deferral phrases
 * like "future improvement" or "out of scope". Forces continuation on first
 * detection; allows stop on second occurrence (cooldown prevents infinite loops).
 *
 * Exit codes: 0 = allow stop, 2 = force continuation
 */

import { existsSync, writeFileSync } from 'fs';

const RATIONALIZATION_PHRASES = [
  'pre-existing issue', 'pre-existing bug',
  'out of scope', 'beyond the scope', 'beyond the current scope', 'outside the scope',
  'left as an exercise', 'future improvement', 'future enhancement',
  'follow-up task', 'follow-up issue', 'separate concern',
  'not part of the current', 'deferred to', 'punt to',
  'address later', 'tackle in a future',
];

const DEFERRAL_SIGNALS = [
  "i'll", "we can", "should", "could", "would", "let's", "recommend",
];

const COOLDOWN_FILE = `/tmp/ia-anti-rationalization-${process.ppid}`;

function isInCodeOrQuoteBlock(lines: string[], lineIndex: number): boolean {
  let inCodeBlock = false;
  for (let i = 0; i <= lineIndex; i++) {
    if (lines[i].trimStart().startsWith('```')) inCodeBlock = !inCodeBlock;
  }
  if (inCodeBlock) return true;
  const trimmed = lines[lineIndex].trimStart();
  return trimmed.startsWith('>') || trimmed.startsWith('|');
}

function isLegitimateReference(line: string): boolean {
  const lower = line.toLowerCase();
  return lower.includes('previously') || lower.includes('was marked as') ||
    lower.includes('had been') || lower.includes('was already');
}

async function main() {
  try {
    const input = await Bun.stdin.text();
    // Stop hooks may not receive JSON input - exit gracefully if no input
    if (!input || input.trim() === '') {
      process.exit(0);
    }
    const data = JSON.parse(input);
    const message: string = data.assistant_message || data.response || '';
    if (!message || existsSync(COOLDOWN_FILE)) {
      process.exit(0);
    }

    const lines = message.split('\n');
    const detectedPhrases: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const lower = lines[i].toLowerCase();
      if (isInCodeOrQuoteBlock(lines, i)) continue;
      if (isLegitimateReference(lines[i])) continue;

      for (const phrase of RATIONALIZATION_PHRASES) {
        if (!lower.includes(phrase)) continue;
        const hasDeferral = DEFERRAL_SIGNALS.some(s => lower.includes(s));
        if (hasDeferral) {
          detectedPhrases.push(`"${phrase}" in: ${lines[i].trim().slice(0, 120)}`);
        }
      }
    }

    if (detectedPhrases.length > 0) {
      writeFileSync(COOLDOWN_FILE, new Date().toISOString());
      console.log('ANTI-RATIONALIZATION: Deferral language detected in your response.');
      console.log('');
      for (const match of detectedPhrases.slice(0, 3)) {
        console.log(`  - ${match}`);
      }
      console.log('');
      console.log('Complete the work now, or explicitly document why it cannot be done');
      console.log('in this session (with specific technical blockers, not vague deferral).');
      process.exit(2);
    }

    process.exit(0);
  } catch (error) {
    // FAIL CLOSED: Log error and block operation
    const err = error as Error;
    console.error('❌ HOOK ERROR - anti-rationalization.ts');
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${err.stack}`);

    // Exit code 1 = soft block with warning (allows override)
    process.exit(1);
  }
}

main();
