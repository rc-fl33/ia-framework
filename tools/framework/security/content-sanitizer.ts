/**
 * Content Sanitizer for External Sources
 *
 * Sanitizes untrusted content from external sources (WebFetch, WebSearch, API responses)
 * to prevent prompt injection attacks.
 *
 * Based on CLAWDBOT Security Hardening: "Wrap untrusted content in untrusted tags"
 *
 * Usage:
 *   import { sanitizeUntrustedContent, markAsUntrusted } from './content-sanitizer';
 *
 *   const webContent = await fetch(url);
 *   const safe = sanitizeUntrustedContent(webContent);
 */

/**
 * Wraps untrusted content in XML-style tags to signal to the model
 * that this content should be treated with caution
 */
export function markAsUntrusted(content: string, source: string): string {
  return `<untrusted source="${source}">
${content}
</untrusted>`;
}

/**
 * Sanitizes content by:
 * 1. Wrapping in untrusted tags
 * 2. Removing potential prompt injection patterns
 * 3. Escaping special characters that could break out of context
 */
export function sanitizeUntrustedContent(
  content: string,
  options: {
    source?: string;
    removePromptInjection?: boolean;
    maxLength?: number;
  } = {}
): string {
  const {
    source = 'external',
    removePromptInjection = true,
    maxLength = 50000
  } = options;

  let sanitized = content;

  // Truncate if too long
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength) + '\n[...truncated]';
  }

  // Remove common prompt injection patterns
  if (removePromptInjection) {
    sanitized = removePromptInjectionPatterns(sanitized);
  }

  // Wrap in untrusted tags
  return markAsUntrusted(sanitized, source);
}

/**
 * Removes common prompt injection patterns
 */
function removePromptInjectionPatterns(content: string): string {
  // Remove attempts to break out of context
  const patterns = [
    // Ignore previous instructions patterns
    /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/gi,
    /disregard\s+(all\s+)?(previous|prior|above)\s+(instructions?|context)/gi,

    // System prompt override attempts
    /you\s+are\s+now\s+a/gi,
    /new\s+instructions?:/gi,
    /system\s+prompt:/gi,

    // Role switching attempts
    /act\s+as\s+(?:a\s+)?(?:different|new)/gi,
    /pretend\s+(?:to\s+be|you\s+are)/gi,

    // XML/tag injection attempts (but preserve our own untrusted tags)
    /<\/untrusted>/gi, // Don't allow nested closing tags
    /<system>/gi,
    /<\/system>/gi,
    /<human>/gi,
    /<\/human>/gi
  ];

  let sanitized = content;
  for (const pattern of patterns) {
    sanitized = sanitized.replace(pattern, '[REMOVED: POTENTIAL INJECTION]');
  }

  return sanitized;
}

/**
 * Sanitizes API responses (JSON or text)
 */
export function sanitizeAPIResponse(
  response: unknown,
  apiName: string
): string {
  if (typeof response === 'string') {
    return sanitizeUntrustedContent(response, {
      source: `api:${apiName}`,
      removePromptInjection: true
    });
  }

  if (typeof response === 'object' && response !== null) {
    const jsonString = JSON.stringify(response, null, 2);
    return sanitizeUntrustedContent(jsonString, {
      source: `api:${apiName}`,
      removePromptInjection: true
    });
  }

  return sanitizeUntrustedContent(String(response), {
    source: `api:${apiName}`,
    removePromptInjection: true
  });
}

/**
 * Sanitizes web search results
 */
export function sanitizeWebSearchResults(
  results: Array<{ title: string; snippet: string; url: string }>,
  query: string
): string {
  const formatted = results.map((result, i) => {
    return `Result ${i + 1}:
Title: ${result.title}
URL: ${result.url}
Snippet: ${result.snippet}
`;
  }).join('\n---\n');

  return sanitizeUntrustedContent(formatted, {
    source: `websearch:${query}`,
    removePromptInjection: true
  });
}

/**
 * Checks if content appears to be trustworthy based on source
 */
export function isTrustedSource(source: string): boolean {
  const trustedDomains = [
    'github.com',
    'docs.anthropic.com',
    'openrouter.ai',
    'nodejs.org',
    'developer.mozilla.org',
    'stackoverflow.com' // Generally trustworthy for code
  ];

  return trustedDomains.some(domain => source.includes(domain));
}

/**
 * Example usage patterns
 */
export const examples = {
  webFetch: `
// Before (vulnerable):
const content = await webFetch(url);
const prompt = \`Summarize this: \${content}\`;

// After (secure):
import { sanitizeUntrustedContent } from './content-sanitizer';
const content = await webFetch(url);
const safe = sanitizeUntrustedContent(content, { source: url });
const prompt = \`Summarize this: \${safe}\`;
`,

  apiResponse: `
// Before (vulnerable):
const data = await api.call();
const prompt = \`Process this data: \${JSON.stringify(data)}\`;

// After (secure):
import { sanitizeAPIResponse } from './content-sanitizer';
const data = await api.call();
const safe = sanitizeAPIResponse(data, 'myapi');
const prompt = \`Process this data: \${safe}\`;
`,

  webSearch: `
// Before (vulnerable):
const results = await webSearch(query);
const formatted = results.map(r => r.snippet).join('\\n');
const prompt = \`Answer based on: \${formatted}\`;

// After (secure):
import { sanitizeWebSearchResults } from './content-sanitizer';
const results = await webSearch(query);
const safe = sanitizeWebSearchResults(results, query);
const prompt = \`Answer based on: \${safe}\`;
`
};
