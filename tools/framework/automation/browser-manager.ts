/**
 * BrowserManager - Singleton for managing Playwright browser lifecycle
 * Reuses browser instance across all scrapers for performance
 */

import { chromium, type Browser, type BrowserContext } from 'playwright';

export class BrowserManager {
  private static instance: BrowserManager | null = null;
  private browser: Browser | null = null;
  private contexts: Map<string, BrowserContext> = new Map();

  private constructor() {}

  static getInstance(): BrowserManager {
    if (!BrowserManager.instance) {
      BrowserManager.instance = new BrowserManager();
    }
    return BrowserManager.instance;
  }

  async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-blink-features=AutomationControlled',
        ],
      });
    }
    return this.browser;
  }

  async getContext(name: string = 'default'): Promise<BrowserContext> {
    if (!this.contexts.has(name)) {
      const browser = await this.getBrowser();
      const context = await browser.newContext({
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 },
        locale: 'en-US',
        timezoneId: 'America/New_York',
        extraHTTPHeaders: {
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });
      this.contexts.set(name, context);
    }
    return this.contexts.get(name)!;
  }

  async closeContext(name: string): Promise<void> {
    const context = this.contexts.get(name);
    if (context) {
      await context.close();
      this.contexts.delete(name);
    }
  }

  async close(): Promise<void> {
    // Close all contexts
    for (const [name, context] of this.contexts.entries()) {
      await context.close();
    }
    this.contexts.clear();

    // Close browser
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  isOpen(): boolean {
    return this.browser !== null;
  }
}
