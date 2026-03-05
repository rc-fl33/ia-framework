/**
 * Observability Skill - Event Store
 *
 * JSONL-based event storage with ring buffer for in-memory cache.
 */

import { existsSync, mkdirSync, appendFileSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import type { ToolEvent, DEFAULT_CONFIG } from './types';

export class EventStore {
  private eventsDir: string;
  private maxEvents: number;
  private ringBuffer: ToolEvent[] = [];
  private lastReadPosition: Map<string, number> = new Map();

  constructor(config: typeof DEFAULT_CONFIG) {
    this.eventsDir = config.eventsDir;
    this.maxEvents = config.maxEvents;

    // Ensure events directory exists
    if (!existsSync(this.eventsDir)) {
      mkdirSync(this.eventsDir, { recursive: true });
    }
  }

  /**
   * Get today's JSONL filename
   */
  private getTodayFile(): string {
    const today = new Date().toISOString().split('T')[0];
    return join(this.eventsDir, `${today}.jsonl`);
  }

  /**
   * Append an event to today's JSONL file
   */
  appendEvent(event: ToolEvent): void {
    const file = this.getTodayFile();
    const line = JSON.stringify(event) + '\n';

    try {
      appendFileSync(file, line, 'utf-8');

      // Add to ring buffer
      this.ringBuffer.push(event);
      if (this.ringBuffer.length > this.maxEvents) {
        this.ringBuffer.shift();
      }
    } catch (err) {
      console.error('Failed to append event:', err);
    }
  }

  /**
   * Add event directly from HTTP POST (in-memory only)
   */
  addEvent(event: ToolEvent): void {
    this.ringBuffer.push(event);
    if (this.ringBuffer.length > this.maxEvents) {
      this.ringBuffer.shift();
    }
  }

  /**
   * Get recent events from ring buffer
   */
  getRecentEvents(limit: number = 100): ToolEvent[] {
    return this.ringBuffer.slice(-limit);
  }

  /**
   * Get events since a timestamp
   */
  getEventsSince(since: string): ToolEvent[] {
    const sinceDate = new Date(since);
    return this.ringBuffer.filter(e => new Date(e.timestamp) > sinceDate);
  }

  /**
   * Load events from JSONL files (for initial load)
   */
  loadFromDisk(days: number = 1): void {
    try {
      const files = readdirSync(this.eventsDir)
        .filter(f => f.endsWith('.jsonl'))
        .sort()
        .slice(-days);

      for (const file of files) {
        const path = join(this.eventsDir, file);
        const content = readFileSync(path, 'utf-8');
        const lines = content.trim().split('\n').filter(l => l);

        for (const line of lines) {
          try {
            const event = JSON.parse(line) as ToolEvent;
            this.ringBuffer.push(event);
          } catch {
            // Skip invalid lines
          }
        }
      }

      // Trim to max events
      if (this.ringBuffer.length > this.maxEvents) {
        this.ringBuffer = this.ringBuffer.slice(-this.maxEvents);
      }
    } catch (err) {
      console.error('Failed to load events from disk:', err);
    }
  }

  /**
   * Read new events from today's file (for file watcher)
   */
  readNewEvents(): ToolEvent[] {
    const file = this.getTodayFile();
    if (!existsSync(file)) return [];

    const newEvents: ToolEvent[] = [];
    const lastPos = this.lastReadPosition.get(file) || 0;

    try {
      const content = readFileSync(file, 'utf-8');
      const newContent = content.slice(lastPos);
      this.lastReadPosition.set(file, content.length);

      if (newContent) {
        const lines = newContent.trim().split('\n').filter(l => l);
        for (const line of lines) {
          try {
            const event = JSON.parse(line) as ToolEvent;
            newEvents.push(event);

            // Add to ring buffer
            this.ringBuffer.push(event);
            if (this.ringBuffer.length > this.maxEvents) {
              this.ringBuffer.shift();
            }
          } catch {
            // Skip invalid lines
          }
        }
      }
    } catch (err) {
      console.error('Failed to read new events:', err);
    }

    return newEvents;
  }

  /**
   * Get total event count
   */
  get count(): number {
    return this.ringBuffer.length;
  }

  /**
   * Get the current events file path
   */
  get currentFile(): string {
    return this.getTodayFile();
  }
}
