/**
 * Observability Skill - File Watcher
 *
 * Watches for file changes and emits events.
 */

import { watch, existsSync, statSync } from 'fs';
import { join, relative } from 'path';
import type { ServerConfig } from './types';

export type WatchEventType = 'file_change' | 'session_change' | 'new_events';

export interface WatchEvent {
  type: WatchEventType;
  path: string;
  modified: string;
}

export type WatchCallback = (event: WatchEvent) => void;

export class FileWatcher {
  private watchers: Map<string, ReturnType<typeof watch>> = new Map();
  private debounceTimers: Map<string, Timer> = new Map();
  private callbacks: WatchCallback[] = [];
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.config = config;
  }

  /**
   * Register a callback for watch events
   */
  onEvent(callback: WatchCallback): void {
    this.callbacks.push(callback);
  }

  /**
   * Emit event to all callbacks
   */
  private emit(event: WatchEvent): void {
    for (const callback of this.callbacks) {
      try {
        callback(event);
      } catch (err) {
        console.error('Watch callback error:', err);
      }
    }
  }

  /**
   * Debounced emit to prevent event flood
   */
  private debouncedEmit(path: string, event: WatchEvent): void {
    const existing = this.debounceTimers.get(path);
    if (existing) {
      clearTimeout(existing);
    }

    const timer = setTimeout(() => {
      this.debounceTimers.delete(path);
      this.emit(event);
    }, this.config.watchDebounceMs);

    this.debounceTimers.set(path, timer);
  }

  /**
   * Watch a directory for changes
   */
  watchDirectory(dirPath: string, eventType: WatchEventType): void {
    if (!existsSync(dirPath)) {
      console.log(`Watch directory does not exist: ${dirPath}`);
      return;
    }

    if (this.watchers.has(dirPath)) {
      return; // Already watching
    }

    try {
      const watcher = watch(dirPath, { recursive: true }, (eventKind, filename) => {
        if (!filename) return;

        const fullPath = join(dirPath, filename);
        let modified = new Date().toISOString();

        try {
          if (existsSync(fullPath)) {
            const stats = statSync(fullPath);
            modified = stats.mtime.toISOString();
          }
        } catch {
          // File may have been deleted
        }

        const relativePath = relative(this.config.claudeDir, fullPath);

        this.debouncedEmit(fullPath, {
          type: eventType,
          path: relativePath,
          modified,
        });
      });

      // Add error listener to prevent crashes on file system errors
      watcher.on('error', (err) => {
        console.error(`Watcher error for ${dirPath}:`, err);
        // Don't crash - just log and continue
      });

      this.watchers.set(dirPath, watcher);
      console.log(`Watching: ${dirPath}`);
    } catch (err) {
      console.error(`Failed to watch ${dirPath}:`, err);
    }
  }

  /**
   * Watch the sessions directory
   */
  watchSessions(): void {
    const sessionsDir = join(this.config.claudeDir, 'sessions');
    this.watchDirectory(sessionsDir, 'session_change');
  }

  /**
   * Watch common framework directories
   */
  watchFramework(): void {
    const dirs = ['skills', 'agents', 'commands', 'docs', 'hooks', 'library', 'methodologies', 'plans', 'private', 'standards', 'tools'];
    for (const dir of dirs) {
      const path = join(this.config.claudeDir, dir);
      if (existsSync(path)) {
        this.watchDirectory(path, 'file_change');
      }
    }
  }

  /**
   * Start all watchers
   */
  startAll(): void {
    this.watchSessions();
    this.watchFramework();
  }

  /**
   * Stop all watchers
   */
  stopAll(): void {
    for (const [path, watcher] of this.watchers) {
      watcher.close();
      console.log(`Stopped watching: ${path}`);
    }
    this.watchers.clear();

    // Clear debounce timers
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
  }
}
