export interface ShortenUrlRequest {
  originalUrl: string;
  customShortcode?: string;
  validityMinutes?: number;
}

export interface ShortenUrlResponse {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: Date;
  expiresAt: Date;
  clickCount: number;
}

export interface ClickData {
  id: string;
  timestamp: Date;
  source: string;
  location: string;
  userAgent?: string;
}

export interface UrlStatistics extends ShortenUrlResponse {
  clicks: ClickData[];
}

export const DEFAULT_VALIDITY_MINUTES = 30;
export const MAX_URLS_PER_REQUEST = 5;
