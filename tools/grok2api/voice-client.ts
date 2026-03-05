/**
 * Grok2API Voice / LiveKit Client
 *
 * Voice generation and LiveKit real-time audio via grok2api.
 * Lower priority - no framework skill currently uses voice.
 */

import type { VoiceConfig, LiveKitConnection } from './types';
import { GROK2API_BASE_URL } from './types';

/**
 * Get a LiveKit voice token for real-time audio
 *
 * @param options - Voice configuration (voice, personality, speed)
 * @returns LiveKit connection details (url, token, participant, room)
 */
export async function getVoiceToken(
  options: VoiceConfig = {},
): Promise<LiveKitConnection> {
  const {
    voice = 'ara',
    personality = 'assistant',
    speed = 1.0,
  } = options;

  const response = await fetch(`${GROK2API_BASE_URL}/v1/audio/speech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ voice, personality, speed }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Voice API error: ${response.status} ${error}`);
  }

  const data = await response.json();

  return {
    url: data.url || data.livekit_url || '',
    token: data.token || data.livekit_token || '',
    participantName: data.participant_name || data.participantName || 'user',
    roomName: data.room_name || data.roomName || 'grok-voice',
  };
}
