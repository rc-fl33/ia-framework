/**
 * ZDR Model Ranker - Model ID Mapper
 *
 * Cross-references model IDs between OpenRouter, Artificial Analysis, and LMArena.
 * Three-phase approach: canonical key → alias table → fuzzy fallback.
 */

// ─── Canonical Key Generation ────────────────────────────────────────────────

/**
 * Generate a canonical key from any model identifier.
 * Strips provider prefix, lowercases, normalizes separators.
 *
 * Examples:
 *   "anthropic/claude-sonnet-4.5" → "claude-sonnet-4-5"
 *   "x-ai/grok-4-fast" → "grok-4-fast"
 *   "Google Gemini 2.0 Flash" → "google-gemini-2-0-flash"
 */
export function toCanonicalKey(modelId: string): string {
  let key = modelId.toLowerCase();

  // Strip provider prefix (e.g., "anthropic/", "x-ai/", "google/")
  const slashIndex = key.indexOf('/');
  if (slashIndex !== -1) {
    key = key.substring(slashIndex + 1);
  }

  // Strip common suffixes that vary across services
  key = key.replace(/:free$/, '');
  key = key.replace(/:beta$/, '');

  // Strip date suffixes common in LMArena (e.g., "-2025-04-14", "-20250414")
  key = key.replace(/-\d{4}-\d{2}-\d{2}$/, '');
  key = key.replace(/-\d{8}$/, '');

  // Normalize separators: dots, underscores, spaces → hyphens
  key = key.replace(/[\._\s]+/g, '-');

  // Remove consecutive hyphens
  key = key.replace(/-+/g, '-');

  // Trim leading/trailing hyphens
  key = key.replace(/^-+|-+$/g, '');

  return key;
}

// ─── Alias Table ─────────────────────────────────────────────────────────────

/**
 * Static map for known mismatches that normalization can't resolve.
 * Maps from variant canonical keys to the authoritative OpenRouter canonical key.
 * Manually maintained — add entries when fuzzy matching logs warnings.
 */
const ALIAS_TABLE: Record<string, string> = {
  // Grok variants
  'grok-4': 'grok-4',
  'grok4': 'grok-4',
  'grok-4-fast': 'grok-4-fast',
  'grok4-fast': 'grok-4-fast',
  'grok-3': 'grok-3',
  'grok-3-fast': 'grok-3-fast',

  // Gemini variants
  'gemini-2-0-flash': 'gemini-2-0-flash-001',
  'gemini-2-0-flash-001': 'gemini-2-0-flash-001',
  'gemini-3-flash': 'gemini-3-flash',
  'gemini-2-5-flash': 'gemini-2-5-flash-preview-05-20',
  'gemini-2-5-pro': 'gemini-2-5-pro-preview-05-06',

  // GPT variants
  'gpt-4o': 'gpt-4o',
  'gpt-4o-mini': 'gpt-4o-mini',
  'gpt-4-1': 'gpt-4-1',
  'gpt-4-1-mini': 'gpt-4-1-mini',
  'gpt-4-1-nano': 'gpt-4-1-nano',
  'o3': 'o3',
  'o3-mini': 'o3-mini',
  'o4-mini': 'o4-mini',

  // Claude variants (for completeness in cross-referencing, even though we filter them)
  'claude-sonnet-4-5': 'claude-sonnet-4-5',
  'claude-opus-4-6': 'claude-opus-4-6',
  'claude-4-sonnet': 'claude-sonnet-4-5',
  'claude-haiku-4-5': 'claude-haiku-4-5',

  // Llama variants
  'llama-4-maverick': 'llama-4-maverick',
  'llama-4-scout': 'llama-4-scout',

  // Command R variants
  'command-r-plus': 'command-r-plus',
  'command-r': 'command-r',
  'command-a': 'command-a',

  // LMArena-specific naming patterns
  'chatgpt-4o-latest': 'gpt-4o',
  'gpt-4-5-preview': 'gpt-4-5-preview',
  'grok-3-preview': 'grok-3',
  'early-grok-3': 'grok-3',
  'o3': 'o3',
  'o4-mini': 'o4-mini',
  'gemini-2-0-flash': 'gemini-2-0-flash-001',
  'gemini-2-0-flash-exp': 'gemini-2-0-flash-001',
  'gemini-2-5-pro-preview': 'gemini-2-5-pro-preview-05-06',
  'gemini-2-5-flash-preview': 'gemini-2-5-flash-preview-05-20',
  'gemini-3-flash-preview': 'gemini-3-flash-preview',
};

// ─── Levenshtein Distance ────────────────────────────────────────────────────

/**
 * Compute Levenshtein edit distance between two strings.
 */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }

  return dp[m][n];
}

// ─── Mapper Class ────────────────────────────────────────────────────────────

export interface MapperWarning {
  sourceKey: string;
  matchedKey: string;
  distance: number;
  source: string;
}

export class ModelMapper {
  private canonicalIndex: Map<string, string> = new Map();
  private warnings: MapperWarning[] = [];

  /**
   * Build the canonical index from OpenRouter model IDs (the authoritative source).
   */
  buildIndex(openRouterModelIds: string[]): void {
    this.canonicalIndex.clear();
    this.warnings = [];

    for (const id of openRouterModelIds) {
      const canonical = toCanonicalKey(id);
      this.canonicalIndex.set(canonical, id);
    }
  }

  /**
   * Resolve an external model identifier to an OpenRouter model ID.
   * Three-phase: canonical match → alias table → fuzzy fallback.
   */
  resolve(externalId: string, source: string): string | null {
    const externalCanonical = toCanonicalKey(externalId);

    // Phase 1: Direct canonical match
    const directMatch = this.canonicalIndex.get(externalCanonical);
    if (directMatch) return directMatch;

    // Phase 2: Alias table
    const aliasCanonical = ALIAS_TABLE[externalCanonical];
    if (aliasCanonical) {
      const aliasMatch = this.canonicalIndex.get(aliasCanonical);
      if (aliasMatch) return aliasMatch;
    }

    // Phase 3: Fuzzy fallback (only for keys > 12 chars, threshold <= 2)
    // Tighter threshold reduces false positives (e.g., gemma-2-2b matching gemma-2-27b)
    if (externalCanonical.length > 12) {
      let bestMatch: string | null = null;
      let bestDistance = Infinity;

      for (const [canonical, orId] of this.canonicalIndex) {
        // Only compare keys of similar length (within 30%)
        const lenRatio = Math.min(externalCanonical.length, canonical.length) /
          Math.max(externalCanonical.length, canonical.length);
        if (lenRatio < 0.7) continue;

        const distance = levenshtein(externalCanonical, canonical);
        if (distance < bestDistance && distance <= 2) {
          bestDistance = distance;
          bestMatch = orId;
        }
      }

      if (bestMatch) {
        this.warnings.push({
          sourceKey: externalId,
          matchedKey: bestMatch,
          distance: bestDistance,
          source,
        });
        return bestMatch;
      }
    }

    return null;
  }

  /**
   * Get all warnings from fuzzy matching for manual review.
   */
  getWarnings(): MapperWarning[] {
    return [...this.warnings];
  }
}
