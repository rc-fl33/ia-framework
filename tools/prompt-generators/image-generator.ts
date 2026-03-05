#!/usr/bin/env bun
/**
 * Image Prompt Generator
 *
 * Specialized prompt engineering for image generation models:
 * - Flux.1 (via Grok Imagine)
 * - DALL-E 3
 * - Midjourney
 *
 * Follows expert prompt engineering patterns:
 * 1. Analyze user idea step-by-step
 * 2. Break down elements (subjects, actions, setting, mood)
 * 3. Identify gaps and ambiguities
 * 4. Align with generator strengths
 * 5. Craft optimized natural-language prompt
 *
 * @version 1.0
 * @created 2026-01-28
 */

export interface ImagePromptConfig {
  idea: string;
  generator: 'flux' | 'dalle' | 'midjourney';
  style?: string;
  constraints?: {
    aspectRatio?: string;
    quality?: 'standard' | 'hd';
    length?: 'concise' | 'detailed';
  };
}

export interface GeneratorProfile {
  name: string;
  strengths: string[];
  optimizationRules: string[];
  avoidPatterns: string[];
}

/**
 * Generator-specific optimization profiles
 */
export const GENERATOR_PROFILES: Record<string, GeneratorProfile> = {
  flux: {
    name: 'Flux.1 (via Grok Imagine)',
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
      'Use contrasts and transitions for depth',
      'Avoid weights like (keyword:1.5) - use natural language',
      'Keep prompt detailed but concise (2-4 sentences max)'
    ],
    avoidPatterns: [
      'Keyword spam (e.g., "cyberpunk, neon, dark, futuristic, tech")',
      'Weight syntax (e.g., "(neon:1.5)")',
      'Overly long phrases (3+ sentences per element)',
      'Vague descriptors ("nice", "cool", "interesting")'
    ]
  },
  dalle: {
    name: 'DALL-E 3',
    strengths: [
      'Creative interpretations',
      'Artistic styles and aesthetics',
      'Text rendering',
      'Conceptual imagery',
      'Consistent style across variations'
    ],
    optimizationRules: [
      'Focus on overall concept and mood',
      'Specify artistic style clearly',
      'Use natural, conversational language',
      'Avoid technical jargon',
      'Keep prompts under 400 characters for best results'
    ],
    avoidPatterns: [
      'Over-specification of details',
      'Technical camera parameters',
      'Complex multi-part compositions'
    ]
  },
  midjourney: {
    name: 'Midjourney',
    strengths: [
      'Artistic and stylized imagery',
      'Fantasy and concept art',
      'Color harmony',
      'Dramatic compositions',
      'Style references (e.g., "in the style of...")'
    ],
    optimizationRules: [
      'Use style references explicitly',
      'Focus on mood and atmosphere',
      'Leverage aspect ratio parameters',
      'Use version-specific features',
      'Combine natural language with parameters'
    ],
    avoidPatterns: [
      'Photorealistic expectations without --style raw',
      'Extremely detailed technical specifications'
    ]
  }
};

/**
 * Analyze user idea step-by-step
 */
export function analyzeIdea(idea: string, style?: string): {
  subjects: string[];
  actions: string[];
  setting: string;
  mood: string;
  gaps: string[];
} {
  const analysis = {
    subjects: [] as string[],
    actions: [] as string[],
    setting: '',
    mood: '',
    gaps: [] as string[]
  };

  // Extract subjects (nouns)
  const commonSubjects = ['character', 'person', 'developer', 'hacker', 'artist', 'robot', 'building', 'landscape'];
  commonSubjects.forEach(subject => {
    if (idea.toLowerCase().includes(subject)) {
      analysis.subjects.push(subject);
    }
  });

  // Extract actions (verbs)
  const commonActions = ['analyzing', 'coding', 'painting', 'running', 'flying', 'studying', 'working'];
  commonActions.forEach(action => {
    if (idea.toLowerCase().includes(action)) {
      analysis.actions.push(action);
    }
  });

  // Identify setting
  const settings = {
    'studio': 'artist studio or workspace',
    'cyberpunk': 'cyberpunk city or environment',
    'office': 'modern office',
    'laboratory': 'scientific laboratory',
    'outdoor': 'outdoor natural setting'
  };
  for (const [keyword, description] of Object.entries(settings)) {
    if (idea.toLowerCase().includes(keyword)) {
      analysis.setting = description;
      break;
    }
  }

  // Identify mood
  const moods = {
    'dramatic': 'dramatic and intense',
    'calm': 'calm and peaceful',
    'energetic': 'energetic and dynamic',
    'mysterious': 'mysterious and enigmatic',
    'futuristic': 'futuristic and high-tech'
  };
  for (const [keyword, description] of Object.entries(moods)) {
    if (idea.toLowerCase().includes(keyword)) {
      analysis.mood = description;
      break;
    }
  }

  // Identify gaps
  if (analysis.subjects.length === 0) {
    analysis.gaps.push('No clear subject specified - suggest adding main character or object');
  }
  if (analysis.actions.length === 0) {
    analysis.gaps.push('No action specified - suggest adding what the subject is doing');
  }
  if (!analysis.setting) {
    analysis.gaps.push('Setting unclear - suggest specifying location or environment');
  }
  if (!analysis.mood) {
    analysis.gaps.push('Mood not specified - suggest adding atmosphere or emotional tone');
  }

  return analysis;
}

/**
 * Generate optimized image prompt
 *
 * Pattern: Style on first line, then enhanced scene description
 */
export async function generateImagePrompt(config: ImagePromptConfig): Promise<string> {
  let optimizedPrompt = '';

  // 1. Lock style first (if provided)
  if (config.style) {
    optimizedPrompt += `${config.style}.\n\n`;
  }

  // 2. Add the scene description directly
  // For now, use the idea as-is since it's already well-formed
  // In future, could enhance with more details via LLM
  optimizedPrompt += config.idea;

  return optimizedPrompt.trim();
}

/**
 * Example usage for testing
 */
export const EXAMPLE_CONFIGS: ImagePromptConfig[] = [
  {
    idea: 'Developer analyzing X algorithm in cyberpunk studio',
    generator: 'flux',
    style: 'Late-80s anime OVA aesthetic, hand-inked with heavy cross-hatching'
  },
  {
    idea: 'Paintbrushes painting by themselves, creating a masterpiece that changes from realistic to abstract',
    generator: 'flux'
  },
  {
    idea: 'A cozy coffee shop on a rainy day',
    generator: 'dalle'
  }
];

// Export for use in main prompt-generator.ts
export default { generateImagePrompt, analyzeIdea, GENERATOR_PROFILES };
