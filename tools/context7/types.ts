/**
 * Context7 TypeScript Type Definitions
 *
 * Re-exports from official SDK with framework-specific extensions
 */

// Re-export official SDK types
export type { Context7Error } from '@upstash/context7-sdk';

/**
 * Library search result from Context7
 */
export interface Context7Library {
  id: string;              // Library identifier (e.g., "/facebook/react")
  title: string;           // Display name
  description?: string;    // Library description
  branch?: string;         // Git branch
  lastUpdateDate?: string; // ISO timestamp
  state?: string;          // Library state
  totalTokens?: number;    // Total documentation tokens
  totalSnippets?: number;  // Total code snippets
  stars?: number;          // GitHub stars
  trustScore?: number;     // 0-10 trust score
  benchmarkScore?: number; // 0-100 benchmark score
  versions?: string[];     // Available versions
}

/**
 * Documentation snippet from Context7
 */
export interface Context7Snippet {
  title: string;    // Snippet title
  content: string;  // Documentation content
  url?: string;     // Source URL
  score?: number;   // Relevance score
}

/**
 * Context7 client options
 */
export interface Context7Options {
  apiKey?: string;  // Optional API key (defaults to CONTEXT7_API_KEY env var)
}

/**
 * Get context options
 */
export interface GetContextOptions {
  type?: 'json' | 'txt';  // Output format (default: json)
  topic?: string;         // Optional topic filter
  tokens?: number;        // Maximum tokens to return
}
