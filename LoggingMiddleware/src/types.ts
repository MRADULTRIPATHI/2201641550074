/**
 * Valid stack values for logging
 */
export type Stack = 'backend' | 'frontend';

/**
 * Valid log levels
 */
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * Valid package values - some are specific to backend/frontend, others are shared
 */
export type Package = 
  // Backend only packages
  | 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler' | 'repository' | 'route' | 'service'
  // Frontend only packages  
  | 'api' | 'component' | 'hook' | 'page' | 'state' | 'style'
  // Shared packages
  | 'auth' | 'config' | 'middleware';

/**
 * Log entry interface for API calls
 */
export interface LogEntry {
  stack: Stack;
  level: Level;
  package: Package;
  message: string;
}

/**
 * Configuration interface for the logger
 */
export interface LoggerConfig {
  apiUrl: string;
  retryAttempts?: number;
  retryDelay?: number;
  enableConsoleLog?: boolean;
}

/**
 * Logger response interface
 */
export interface LoggerResponse {
  success: boolean;
  error?: string;
}
