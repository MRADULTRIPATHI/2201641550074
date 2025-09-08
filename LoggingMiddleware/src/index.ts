/**
 * URL Shortener Logging Middleware
 * 
 * A reusable logging middleware package that makes API calls to a test server
 * for comprehensive application logging and monitoring.
 * 
 * Usage Examples:
 * 
 * Basic logging:
 * ```typescript
 * import { Log } from '@urlshortener/logging-middleware';
 * 
 * // Simple logging call
 * await Log('frontend', 'error', 'component', 'Button component failed to render');
 * await Log('backend', 'info', 'handler', 'User successfully created shortened URL');
 * ```
 * 
 * Advanced usage with configuration:
 * ```typescript
 * import { initializeLogger, getLogger } from '@urlshortener/logging-middleware';
 * 
 * // Initialize with custom configuration
 * const logger = initializeLogger({
 *   enableConsoleLog: true,
 *   retryAttempts: 5
 * });
 * 
 * // Use convenience methods
 * await logger.info('frontend', 'page', 'User navigated to URL shortener page');
 * await logger.error('frontend', 'api', 'Failed to fetch shortened URLs from server');
 * ```
 */

// Export main logging function and utilities
export { Log, Logger, initializeLogger, getLogger } from './logger';

// Export types for TypeScript users
export type { Stack, Level, Package, LogEntry, LoggerConfig, LoggerResponse } from './types';

// Export validation utilities
export { 
  validateLogEntry, 
  isValidStack, 
  isValidLevel, 
  isValidPackage, 
  isPackageCompatibleWithStack 
} from './validator';

// Default export for convenience
export { Log as default } from './logger';
