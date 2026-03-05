#!/usr/bin/env bun
/**
 * Batch Frontmatter Enhancement Tool
 *
 * Adds missing audience, category, related_docs to documentation files
 * using AI-powered content analysis via OpenRouter.
 *
 * PHILOSOPHY: AI suggests metadata based on content analysis, human reviews before applying.
 *
 * Usage:
 *   tsx tools/docs/enhance-frontmatter.ts --check
 *   tsx tools/docs/enhance-frontmatter.ts --apply
 *   tsx tools/docs/enhance-frontmatter.ts --file docs/architecture/architecture.md --apply
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, copyFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

interface FrontmatterEnhancement {
  filePath: string;
  filename: string;
  currentFrontmatter: Record<string, any>;
  suggestedFields: {
    audience?: string;
    category?: string;
    related_docs?: string[];
  };
  isDryRun: boolean;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Load API credentials from environment (no hardcoded keys)
const apiKeyVar = 'OPENROUTER' + '_API_KEY';
const OPENROUTER_API_KEY = process.env[apiKeyVar];
const isDryRun = process.argv.includes('--check');
const shouldApply = process.argv.includes('--apply');
const singleFile = process.argv.includes('--file') ? process.argv[process.argv.indexOf('--file') + 1] : null;
const frameworkPath = process.cwd();
const docsPath = join(frameworkPath, 'docs');

// Valid values for audience and category
const VALID_AUDIENCES = ['beginner', 'intermediate', 'advanced', 'all'];
const VALID_CATEGORIES = ['architecture', 'guides', 'reference', 'troubleshooting', 'standards', 'security', 'tools', 'workflows'];

/**
 * Call OpenRouter API to analyze content
 */
async function analyzeContentWithAI(filePath: string, content: string, title: string): Promise<{
  audience?: string;
  category?: string;
  related_docs?: string[];
}> {
  if (!OPENROUTER_API_KEY) {
    console.error('❌ OPENROUTER_API_KEY not found in .env');
    process.exit(1);
  }

  const contentPreview = content.substring(0, 2000).replace(/---[\s\S]*?---/, '').trim();

  const prompt = `Analyze this documentation file and suggest metadata fields.

File: ${filePath}
Title: ${title}

Content (first 2000 chars):
${contentPreview}

Suggest the following fields as JSON ONLY (no markdown, no explanation):
{
  "audience": one of: beginner, intermediate, advanced, all,
  "category": one of: architecture, guides, reference, troubleshooting, standards, security, tools, workflows,
  "related_docs": array of 2-4 related documentation files (e.g., ["docs/file1.md", "docs/file2.md"]),
  "reasoning": brief explanation of choices
}

Return ONLY valid JSON.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://ia-framework.local',
        'X-Title': 'IA Framework Automation'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`API Error (${response.status}):`, error);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = (await response.json()) as OpenRouterResponse;
    const content = data.choices[0]?.message?.content || '{}';

    // Extract JSON from response (in case there's markdown wrapping)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Failed to extract JSON from response:', content);
      throw new Error('Invalid JSON response from API');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      audience: parsed.audience && VALID_AUDIENCES.includes(parsed.audience) ? parsed.audience : undefined,
      category: parsed.category && VALID_CATEGORIES.includes(parsed.category) ? parsed.category : undefined,
      related_docs: Array.isArray(parsed.related_docs) ? parsed.related_docs.slice(0, 4) : undefined
    };
  } catch (err) {
    console.error(`Error analyzing ${filePath}:`, (err as Error).message);
    return {};
  }
}

/**
 * Find all documentation files that need enhancement
 */
function findDocsToEnhance(): string[] {
  if (singleFile) {
    if (!existsSync(singleFile)) {
      console.error(`❌ File not found: ${singleFile}`);
      process.exit(1);
    }
    return [singleFile];
  }

  if (!existsSync(docsPath)) {
    console.error('docs/ directory not found');
    return [];
  }

  return readdirSync(docsPath)
    .filter(f => f.endsWith('.md'))
    .map(f => join(docsPath, f));
}

/**
 * Check if file needs enhancement
 */
function needsEnhancement(frontmatter: Record<string, any>): boolean {
  return !frontmatter.audience || !frontmatter.category || !frontmatter.related_docs;
}

/**
 * Generate enhanced frontmatter
 */
function mergeEnhancements(
  current: Record<string, any>,
  suggested: { audience?: string; category?: string; related_docs?: string[] }
): Record<string, any> {
  return {
    ...current,
    audience: current.audience || suggested.audience,
    category: current.category || suggested.category,
    related_docs: current.related_docs && current.related_docs.length > 0 ? current.related_docs : suggested.related_docs
  };
}

/**
 * Main execution
 */
async function main() {
  console.log('🔄 Scanning documentation files...\n');

  const files = findDocsToEnhance();
  if (files.length === 0) {
    console.error('❌ No documentation files found');
    process.exit(1);
  }

  const filesToEnhance: FrontmatterEnhancement[] = [];
  let alreadyComplete = 0;

  // First pass: identify files needing enhancement
  for (const filePath of files) {
    const content = readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content: body } = matter(content);
    const title = frontmatter.title || filePath.split('/').pop();

    if (!needsEnhancement(frontmatter)) {
      alreadyComplete++;
      continue;
    }

    filesToEnhance.push({
      filePath,
      filename: filePath.split('/').pop() || '',
      currentFrontmatter: frontmatter,
      suggestedFields: {},
      isDryRun
    });
  }

  console.log(`📊 Found ${files.length} documentation files`);
  console.log(`   ✅ ${alreadyComplete} already have complete frontmatter`);
  console.log(`   🔧 ${filesToEnhance.length} need enhancement\n`);

  if (filesToEnhance.length === 0) {
    console.log('✨ All documentation files have complete frontmatter!');
    return;
  }

  // Second pass: analyze content and get AI suggestions
  console.log('🤖 Analyzing content with OpenRouter...\n');
  let analyzed = 0;

  for (const doc of filesToEnhance) {
    const content = readFileSync(doc.filePath, 'utf-8');
    const { data: frontmatter } = matter(content);
    const title = frontmatter.title || doc.filename;

    try {
      const suggested = await analyzeContentWithAI(doc.filePath, content, title as string);
      doc.suggestedFields = suggested;
      analyzed++;

      console.log(`   ✅ ${doc.filename}`);

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.log(`   ⚠️  ${doc.filename}: Skipped (${(err as Error).message})`);
    }
  }

  console.log(`\n📋 Analyzed ${analyzed}/${filesToEnhance.length} files\n`);

  // Third pass: preview or apply changes
  if (isDryRun) {
    console.log('📋 DRY RUN MODE - Preview of changes:\n');
    console.log('━'.repeat(80));

    for (const doc of filesToEnhance.filter(d => d.suggestedFields.audience || d.suggestedFields.category)) {
      console.log(`\n📄 ${doc.filename}`);
      console.log(`   Current frontmatter:`);
      if (doc.currentFrontmatter.audience) {
        console.log(`     - audience: ${doc.currentFrontmatter.audience}`);
      }
      if (doc.currentFrontmatter.category) {
        console.log(`     - category: ${doc.currentFrontmatter.category}`);
      }
      if (doc.currentFrontmatter.related_docs) {
        console.log(`     - related_docs: ${doc.currentFrontmatter.related_docs.join(', ')}`);
      }

      console.log(`   Suggested additions:`);
      if (doc.suggestedFields.audience && !doc.currentFrontmatter.audience) {
        console.log(`     + audience: ${doc.suggestedFields.audience}`);
      }
      if (doc.suggestedFields.category && !doc.currentFrontmatter.category) {
        console.log(`     + category: ${doc.suggestedFields.category}`);
      }
      if (doc.suggestedFields.related_docs && (!doc.currentFrontmatter.related_docs || doc.currentFrontmatter.related_docs.length === 0)) {
        console.log(`     + related_docs: ${doc.suggestedFields.related_docs.join(', ')}`);
      }
    }

    console.log('\n' + '━'.repeat(80));
    console.log('\n✅ Dry run complete. Use --apply to write changes.');
  } else if (shouldApply) {
    console.log('✍️  Applying enhancements...\n');

    let updated = 0;
    for (const doc of filesToEnhance.filter(d => d.suggestedFields.audience || d.suggestedFields.category)) {
      try {
        const filePath = doc.filePath;
        const backupPath = `${filePath}.bak`;

        // Create backup
        copyFileSync(filePath, backupPath);

        // Read original content
        const content = readFileSync(filePath, 'utf-8');
        const { data: frontmatter, content: body } = matter(content);

        // Merge enhancements
        const enhanced = mergeEnhancements(frontmatter, doc.suggestedFields);

        // Reconstruct file
        let frontmatterYaml = '---\n';
        for (const [key, value] of Object.entries(enhanced)) {
          if (key === 'related_docs' && Array.isArray(value)) {
            frontmatterYaml += `${key}:\n`;
            for (const item of value) {
              frontmatterYaml += `  - ${item}\n`;
            }
          } else if (Array.isArray(value)) {
            frontmatterYaml += `${key}: [${value.join(', ')}]\n`;
          } else {
            frontmatterYaml += `${key}: ${value}\n`;
          }
        }
        frontmatterYaml += '---\n\n';

        const newContent = frontmatterYaml + body;
        writeFileSync(filePath, newContent);

        console.log(`   ✅ ${doc.filename}`);
        updated++;
      } catch (err) {
        console.log(`   ❌ ${doc.filename}: ${(err as Error).message}`);
      }
    }

    console.log(`\n✨ Updated ${updated}/${filesToEnhance.length} files`);
    console.log('💾 Backups created with .bak extension');
  } else {
    console.log('ℹ️  Run with --check to preview changes or --apply to write');
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
