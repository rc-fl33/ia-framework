#!/usr/bin/env bun
/**
 * Video Prompt Generator
 *
 * Specialized prompt engineering for video/animation generation:
 * - Grok Imagine (animated content)
 * - Runway Gen-2
 * - Pika Labs
 *
 * Video-specific considerations:
 * - Motion and timing (2-3s cycles, slow vs fast)
 * - Animation style (smooth, subtle, jarring)
 * - Consistency requirements (character design, style)
 * - Loopability for short clips
 *
 * @version 1.0
 * @created 2026-01-28
 */

export interface VideoPromptConfig {
  idea: string;
  generator: 'grok-imagine' | 'runway' | 'pika';
  style?: string;
  duration?: string;
  motion?: 'slow' | 'medium' | 'fast' | 'subtle';
  loopable?: boolean;
}

export interface VideoGeneratorProfile {
  name: string;
  strengths: string[];
  optimizationRules: string[];
  motionGuidelines: string[];
  avoidPatterns: string[];
}

/**
 * Video generator-specific optimization profiles
 */
export const VIDEO_GENERATOR_PROFILES: Record<string, VideoGeneratorProfile> = {
  'grok-imagine': {
    name: 'Grok Imagine (Animated)',
    strengths: [
      'Anime-style animation frames',
      'Slow, subtle movements',
      'High self-similarity (consistent style)',
      '2-4 second cycle animations',
      'Hand-inked aesthetic preservation',
      'Cyberpunk and stylized content'
    ],
    optimizationRules: [
      'Specify animation speed explicitly (slow, subtle, 2-3s cycles)',
      'Emphasize consistency and self-similarity',
      'Use "hand-inked animation frames" for anime style',
      'Describe motion pattern (pulses, flows, gentle shifts)',
      'Avoid jarring or flashy movements',
      'Keep character movements minimal and deliberate',
      'Specify no sound if audio-free'
    ],
    motionGuidelines: [
      'Slow movements: 2-4 second cycles minimum',
      'Subtle: gentle pulses, slow data flows, minimal character shifts',
      'Deliberate: purposeful gestures, not random motion',
      'Loopable: ensure motion can seamlessly repeat'
    ],
    avoidPatterns: [
      'Fast or jarring movements',
      'Flashy effects or rapid transitions',
      'Complex multi-character choreography',
      'Inconsistent style between frames'
    ]
  },
  runway: {
    name: 'Runway Gen-2',
    strengths: [
      'Photorealistic video generation',
      'Camera movements and transitions',
      'Natural scene dynamics',
      'Longer duration clips (up to 18 seconds)'
    ],
    optimizationRules: [
      'Specify camera movement (pan, zoom, static)',
      'Describe motion direction and speed',
      'Use reference images when possible',
      'Keep descriptions concise for better coherence'
    ],
    motionGuidelines: [
      'Camera: Specify static, pan left/right, zoom in/out',
      'Subject motion: Walk, gesture, turn',
      'Environment: Wind, water flow, ambient movement'
    ],
    avoidPatterns: [
      'Complex scene changes mid-clip',
      'Multiple subjects with independent motion',
      'Overly long or complex descriptions'
    ]
  },
  pika: {
    name: 'Pika Labs',
    strengths: [
      'Creative and artistic animations',
      'Style transformations',
      'Text-to-video from descriptions',
      'Animation from static images'
    ],
    optimizationRules: [
      'Use motion parameters (camera, speed, etc.)',
      'Describe style evolution if transforming',
      'Keep motion simple for consistency',
      'Leverage negative prompts to avoid unwanted effects'
    ],
    motionGuidelines: [
      'Motion: -motion 1 (subtle) to -motion 3 (dynamic)',
      'Camera: -camera pan, zoom, rotate',
      'Describe timing and pacing explicitly'
    ],
    avoidPatterns: [
      'Ambiguous motion descriptions',
      'Expecting smooth style changes without guidance'
    ]
  }
};

/**
 * Analyze video idea for motion and timing requirements
 */
export function analyzeVideoIdea(idea: string, style?: string, duration?: string): {
  sceneDescription: string;
  motionType: string;
  timing: string;
  consistency: string[];
  gaps: string[];
} {
  const analysis = {
    sceneDescription: '',
    motionType: '',
    timing: duration || '2-3 seconds',
    consistency: [] as string[],
    gaps: [] as string[]
  };

  // Extract motion keywords
  const motionKeywords = {
    slow: ['slow', 'gentle', 'subtle', 'gradual'],
    fast: ['fast', 'quick', 'rapid', 'sudden'],
    deliberate: ['deliberate', 'purposeful', 'intentional'],
    continuous: ['continuous', 'flowing', 'streaming']
  };

  for (const [type, keywords] of Object.entries(motionKeywords)) {
    if (keywords.some(kw => idea.toLowerCase().includes(kw))) {
      analysis.motionType = type;
      break;
    }
  }

  // Check for consistency requirements
  if (style && style.includes('anime')) {
    analysis.consistency.push('Hand-inked animation frames');
    analysis.consistency.push('High self-similarity between frames');
  }
  if (idea.includes('cyberpunk') || style?.includes('cyberpunk')) {
    analysis.consistency.push('Consistent neon color palette');
    analysis.consistency.push('Atmospheric fog/glow effects');
  }

  // Identify gaps
  if (!analysis.motionType) {
    analysis.gaps.push('Motion speed not specified - suggest adding "slow", "fast", or "subtle"');
  }
  if (!duration) {
    analysis.gaps.push('Duration not specified - defaulting to 2-3 seconds');
  }
  if (!idea.toLowerCase().includes('movement') && !idea.toLowerCase().includes('motion')) {
    analysis.gaps.push('No explicit movement described - suggest what should animate');
  }

  return analysis;
}

/**
 * Generate optimized video prompt
 *
 * Pattern: Specify motion requirements first, then scene description with animation details
 */
export async function generateVideoPrompt(config: VideoPromptConfig): Promise<string> {
  let optimizedPrompt = '';

  // 1. Start with technical requirements for Grok Imagine
  if (config.generator === 'grok-imagine') {
    optimizedPrompt += 'No sound. Consistent design and style, high self-similarity, slow, subtle. ';
  }

  // 2. Describe what's happening with motion emphasis
  optimizedPrompt += config.idea;

  // 3. Add timing/cycle information
  if (config.duration) {
    optimizedPrompt += ` ${config.duration} minimum cycles`;
  } else {
    optimizedPrompt += ' 2-3 second cycles minimum';
  }

  // 4. Add style with animation frame specification
  if (config.style) {
    if (config.style.includes('anime') || config.style.includes('hand-inked')) {
      optimizedPrompt += ', hand-inked animation frames';
    }
    optimizedPrompt += `. ${config.style}`;
  }

  return optimizedPrompt.trim();
}

/**
 * Example usage for testing
 */
export const EXAMPLE_VIDEO_CONFIGS: VideoPromptConfig[] = [
  {
    idea: 'Developer studying algorithm code, nodding in agreement as they understand patterns',
    generator: 'grok-imagine',
    style: '80s cyberpunk aesthetic, hand-inked',
    duration: '2-3 second cycles',
    motion: 'slow',
    loopable: true
  },
  {
    idea: 'Paintbrushes floating and painting by themselves',
    generator: 'grok-imagine',
    style: 'Realistic with magical elements',
    motion: 'subtle'
  }
];

// Export for use in main prompt-generator.ts
export default { generateVideoPrompt, analyzeVideoIdea, VIDEO_GENERATOR_PROFILES };
