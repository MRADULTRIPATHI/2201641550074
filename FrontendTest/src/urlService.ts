import { Log } from '@urlshortener/logging-middleware';
import { ShortenUrlRequest, UrlStatistics, ClickData, DEFAULT_VALIDITY_MINUTES } from './types';

class UrlService {
  private readonly STORAGE_KEY = 'urlShortener_data';
  private readonly BASE_URL = 'http://localhost:3000';
  
  private data: UrlStatistics[] = [];

  constructor() {
    this.loadFromStorage();
    Log('frontend', 'info', 'service', 'URL Service initialized');
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.data = parsed.map((url: any) => ({
          ...url,
          createdAt: new Date(url.createdAt),
          expiresAt: new Date(url.expiresAt),
          clicks: url.clicks?.map((click: any) => ({
            ...click,
            timestamp: new Date(click.timestamp)
          })) || []
        }));
      }
    } catch (error) {
      Log('frontend', 'error', 'service', `Failed to load from storage: ${error}`);
      this.data = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
      Log('frontend', 'debug', 'service', 'Data saved to storage');
    } catch (error) {
      Log('frontend', 'error', 'service', `Failed to save to storage: ${error}`);
    }
  }

  private generateShortcode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async shortenUrl(request: ShortenUrlRequest): Promise<UrlStatistics> {
    await Log('frontend', 'info', 'service', `Shortening URL: ${request.originalUrl}`);
    
    const shortCode = request.customShortcode || this.generateShortcode();
    
    if (this.data.some(url => url.shortCode === shortCode)) {
      throw new Error(`Shortcode '${shortCode}' already exists`);
    }

    const now = new Date();
    const validityMinutes = request.validityMinutes || DEFAULT_VALIDITY_MINUTES;
    const expiresAt = new Date(now.getTime() + validityMinutes * 60 * 1000);

    const newUrl: UrlStatistics = {
      id: `url_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      originalUrl: request.originalUrl.trim(),
      shortCode,
      shortUrl: `${this.BASE_URL}/${shortCode}`,
      createdAt: now,
      expiresAt,
      clickCount: 0,
      clicks: []
    };

    this.data.push(newUrl);
    this.saveToStorage();
    
    await Log('frontend', 'info', 'service', `Successfully created short URL: ${newUrl.shortUrl}`);
    return newUrl;
  }

  async getAllUrls(): Promise<UrlStatistics[]> {
    return [...this.data].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async handleRedirection(shortCode: string): Promise<string | null> {
    await Log('frontend', 'info', 'service', `Handling redirection for: ${shortCode}`);
    
    const url = this.data.find(u => u.shortCode === shortCode);
    if (!url) {
      return null;
    }

    if (new Date() > url.expiresAt) {
      throw new Error('This shortened URL has expired');
    }

    const clickData: ClickData = {
      id: `click_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      timestamp: new Date(),
      source: ['Direct', 'Google', 'Facebook', 'Twitter'][Math.floor(Math.random() * 4)],
      location: ['New York, NY', 'Los Angeles, CA', 'Chicago, IL'][Math.floor(Math.random() * 3)],
      userAgent: navigator.userAgent
    };

    url.clickCount++;
    url.clicks.push(clickData);
    this.saveToStorage();

    await Log('frontend', 'info', 'service', `Click tracked for ${shortCode}. Total clicks: ${url.clickCount}`);
    return url.originalUrl;
  }

  async deleteUrl(shortCode: string): Promise<boolean> {
    const index = this.data.findIndex(u => u.shortCode === shortCode);
    if (index === -1) return false;

    this.data.splice(index, 1);
    this.saveToStorage();
    
    await Log('frontend', 'info', 'service', `Deleted URL: ${shortCode}`);
    return true;
  }
}

export const urlService = new UrlService();
