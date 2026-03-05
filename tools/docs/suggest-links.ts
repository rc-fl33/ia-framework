#!/usr/bin/env bun
/**
 * Bidirectional Link Suggestion Tool
 *
 * Analyzes documentation files and suggests cross-references using AI.
 * Helps improve documentation discoverability through intelligent linking.
 *
 * PHILOSOPHY: AI suggests related content based on semantic similarity.
 *
 * Usage:
 *   tsx tools/docs/suggest-links.ts
 *   tsx tools/docs/suggest-links.ts --threshold 0.7
 *   tsx tools/docs/suggest-links.ts --output suggestions.json
 *   tsx tools/docs/suggest-links.ts --apply (EXPERIMENTAL)
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

interface LinkSuggestion {
  sourceFile: string;
  targetFile: string;
  relevanceScore: number;
  reason: string;
  bidirectional: boolean;
  existingInSource?: boolean;
}

interface DocumentAnalysis {
  filePath: string;
  filename: string;
  title: string;
  topics: string[];
  keywords: string[];
  existingLinks: string[];
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
const thresholdIndex = process.argv.indexOf('--threshold');
const threshold = thresholdIndex !== -1 ? parseFloat(process.argv[thresholdIndex + 1]) : 0.6;
const outputIndex = process.argv.indexOf('--output');
const outputFile = outputIndex !== -1 ? process.argv[outputIndex + 1] : null;
const shouldApply = process.argv.includes('--apply');

const frameworkPath = process.cwd();
const docsPath = join(frameworkPath, 'docs');

/**
 * Extract key topics and keywords from document
 */
function analyzeDocumentLocally(filePath: string, content: string, title: string): DocumentAnalysis {
  const { data: frontmatter } = matter(content);
  const body = content.split('---').slice(2).join('---');

  // Extract existing links
  const linkPattern = /\[([^\]]+)\]\(([^\)]+)\)/g;
  const relatedDocsArray = frontmatter.related_docs || [];
  const existingLinks = [...Array.from(body.matchAll(linkPattern)).map(m => m[2]), ...relatedDocsArray];

  // Extract keywords from title and headings
  const headings = body.match(/^#+\s+(.+)$/gm) || [];
  const keywords = [
    title,
    ...headings.map(h => h.replace(/^#+\s+/, ''))
  ].filter(Boolean);

  // Extract topics based on filename and content patterns
  const topics = [
    ...(frontmatter.category ? [frontmatter.category] : []),
    ...(frontmatter.audience ? [frontmatter.audience] : [])
  ];

  return {
    filePath,
    filename: filePath.split('/').pop() || '',
    title,
    topics,
    keywords,
    existingLinks
  };
}

/**
 * Use AI to analyze semantic similarity and suggest links
 */
async function suggestLinksWithAI(
  sourceDoc: DocumentAnalysis,
  targetDocs: DocumentAnalysis[]
): Promise<LinkSuggestion[]> {
  if (!OPENROUTER_API_KEY) {
    console.error('❌ OPENROUTER_API_KEY not found in .env');
    process.exit(1);
  }

  const docsList = targetDocs
    .filter(d => d.filename !== sourceDoc.filename)
    .map(d => `- ${d.filename}: ${d.title}`)
    .join('\n');

  const prompt = `You are a documentation linking expert. Analyze these documents and suggest which ones are most relevant to the source document.

SOURCE DOCUMENT:
Name: ${sourceDoc.filename}
Title: ${sourceDoc.title}
Category: ${sourceDoc.topics.join(', ')}
Existing Links: ${sourceDoc.existingLinks.join(', ') || 'none'}

OTHER DOCUMENTS:
${docsList}

Suggest 2-4 most relevant documents to link from the source. For each suggestion, provide:
1. Target filename
2. Relevance score (0.0-1.0)
3. Brief reason for relevance
4. Whether bidirectional link makes sense (true/false)

Return as JSON only (no markdown):
{
  "suggestions": [
    {
      "target": "filename.md",
      "score": 0.85,
      "reason": "brief reason",
      "bidirectional": true
    }
  ]
}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://ia-framework.local',
        'X-Title': 'IA Framework Documentation Linker'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = (await response.json()) as OpenRouterResponse;
    const content = data.choices[0]?.message?.content || '{}';

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from API');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const suggestions: LinkSuggestion[] = [];

    for (const suggestion of parsed.suggestions || []) {
      const targetDoc = targetDocs.find(d => d.filename === suggestion.target);
      if (targetDoc && suggestion.score >= threshold) {
        suggestions.push({
          sourceFile: sourceDoc.filename,
          targetFile: suggestion.target,
          relevanceScore: suggestion.score,
          reason: suggestion.reason,
          bidirectional: suggestion.bidirectional,
          existingInSource: sourceDoc.existingLinks.includes(targetDoc.filePath)
        });
      }
    }

    return suggestions;
  } catch (err) {
    console.error(`Error analyzing ${sourceDoc.filename}:`, (err as Error).message);
    return [];
  }
}

/**
 * Generate markdown report
 */
function generateReport(allSuggestions: LinkSuggestion[]): string {
  let report = `# Documentation Cross-Reference Suggestions

Generated: ${new Date().toISOString()}
Threshold: ${threshold}
Total Suggestions: ${allSuggestions.length}

---

## Summary

### By Relevance Score

`;

  // Group by score ranges
  const highScore = allSuggestions.filter(s => s.relevanceScore >= 0.8);
  const mediumScore = allSuggestions.filter(s => s.relevanceScore >= 0.6 && s.relevanceScore < 0.8);
  const lowScore = allSuggestions.filter(s => s.relevanceScore < 0.6);

  report += `- **High Priority (>= 0.8):** ${highScore.length} suggestions\n`;
  report += `- **Medium Priority (0.6-0.79):** ${mediumScore.length} suggestions\n`;
  report += `- **Lower Priority (< 0.6):** ${lowScore.length} suggestions\n\n`;

  // Detailed suggestions
  report += `---\n\n## High Priority Suggestions (Score >= 0.8)\n\n`;

  for (const s of highScore) {
    report += `### ${s.sourceFile} → ${s.targetFile}\n`;
    report += `- **Relevance:** ${(s.relevanceScore * 100).toFixed(0)}%\n`;
    report += `- **Reason:** ${s.reason}\n`;
    report += `- **Bidirectional:** ${s.bidirectional ? 'Yes' : 'No'}\n`;
    report += `- **Already Linked:** ${s.existingInSource ? 'Yes' : 'No'}\n\n`;
  }

  report += `---\n\n## Medium Priority Suggestions (Score 0.6-0.79)\n\n`;

  for (const s of mediumScore) {
    report += `- **${s.sourceFile}** → **${s.targetFile}** (${(s.relevanceScore * 100).toFixed(0)}%): ${s.reason}\n`;
  }

  report += `\n---\n\n## Implementation Guide\n\n`;
  report += `1. Review high-priority suggestions first\n`;
  report += `2. Add to \`related_docs\` in YAML frontmatter\n`;
  report += `3. Consider bidirectional linking where suggested\n`;
  report += `4. Run validation after making changes\n`;

  return report;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔄 Scanning documentation files...\n');

  if (!existsSync(docsPath)) {
    console.error('docs/ directory not found');
    process.exit(1);
  }

  const docFiles = readdirSync(docsPath).filter(f => f.endsWith('.md'));
  if (docFiles.length === 0) {
    console.error('No documentation files found');
    process.exit(1);
  }

  console.log(`📊 Found ${docFiles.length} documentation files\n`);
  console.log('🤖 Analyzing documents...\n');

  // Analyze all documents locally
  const analyses: DocumentAnalysis[] = [];
  for (const file of docFiles) {
    const filePath = join(docsPath, file);
    const content = readFileSync(filePath, 'utf-8');
    const { data: frontmatter } = matter(content);
    const title = frontmatter.title || file;

    analyses.push(analyzeDocumentLocally(filePath, content, title));
  }

  console.log('🔗 Getting AI suggestions...\n');

  // Get AI suggestions for each document
  const allSuggestions: LinkSuggestion[] = [];
  let processed = 0;

  for (const sourceDoc of analyses) {
    try {
      const suggestions = await suggestLinksWithAI(sourceDoc, analyses);
      allSuggestions.push(...suggestions);
      processed++;

      if (processed % 5 === 0) {
        console.log(`   ${processed}/${analyses.length} files analyzed`);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      console.log(`   ⚠️  ${sourceDoc.filename}: ${(err as Error).message}`);
    }
  }

  console.log(`\n✅ Analysis complete\n`);

  // Generate and display report
  const report = generateReport(allSuggestions);

  console.log(report);

  // Save to file if requested
  if (outputFile) {
    writeFileSync(outputFile, report);
    console.log(`\n💾 Report saved to ${outputFile}`);
  }

  // JSON output
  const jsonReport = {
    timestamp: new Date().toISOString(),
    threshold,
    totalDocuments: analyses.length,
    totalSuggestions: allSuggestions.length,
    suggestions: allSuggestions.sort((a, b) => b.relevanceScore - a.relevanceScore)
  };

  console.log(`\n📊 JSON Summary:`);
  console.log(JSON.stringify(jsonReport, null, 2));

  if (shouldApply) {
    console.log('\n⚠️  EXPERIMENTAL: --apply mode not yet implemented');
    console.log('Please manually review suggestions and add to related_docs in frontmatter');
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
