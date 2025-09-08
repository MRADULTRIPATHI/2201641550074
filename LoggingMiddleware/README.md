# URL Shortener Logging Middleware

A reusable TypeScript logging middleware package that provides comprehensive logging capabilities for the URL Shortener application. This middleware makes API calls to a test server for centralized log collection and monitoring.

## Features

- ✅ **Type-safe logging** with TypeScript support
- ✅ **Validation** of log parameters (stack, level, package, message)
- ✅ **Retry logic** for failed API calls
- ✅ **Stack-aware package validation** (backend/frontend compatibility)
- ✅ **Convenience methods** for different log levels
- ✅ **Configurable** retry attempts, delays, and console logging
- ✅ **Error handling** with detailed error messages

## Installation

```bash
npm install @urlshortener/logging-middleware
```

## Usage

### Basic Logging

```typescript
import { Log } from '@urlshortener/logging-middleware';

// Basic logging calls
await Log('frontend', 'error', 'component', 'Button component failed to render');
await Log('backend', 'info', 'handler', 'User successfully created shortened URL');
await Log('frontend', 'debug', 'api', 'Making request to shorten URL endpoint');
```

### Advanced Usage with Configuration

```typescript
import { initializeLogger, getLogger } from '@urlshortener/logging-middleware';

// Initialize with custom configuration
const logger = initializeLogger({
  enableConsoleLog: true,  // Also log to console for development
  retryAttempts: 5,        // Retry failed API calls up to 5 times
  retryDelay: 2000         // Wait 2 seconds between retries
});

// Use convenience methods
await logger.info('frontend', 'page', 'User navigated to URL shortener page');
await logger.warn('frontend', 'component', 'URL input validation warning');
await logger.error('frontend', 'api', 'Failed to fetch shortened URLs from server');
await logger.fatal('backend', 'db', 'Database connection lost - critical failure');
```

## API Reference

### Log Function

The main logging function that matches the required signature:

```typescript
Log(stack: Stack, level: Level, package: Package, message: string): Promise<LoggerResponse>
```

### Parameters

#### Stack
Valid values: `'backend'` | `'frontend'`

#### Level  
Valid values: `'debug'` | `'info'` | `'warn'` | `'error'` | `'fatal'`

#### Package
**Backend-only packages:**
- `'cache'`, `'controller'`, `'cron_job'`, `'db'`, `'domain'`, `'handler'`, `'repository'`, `'route'`, `'service'`

**Frontend-only packages:**
- `'api'`, `'component'`, `'hook'`, `'page'`, `'state'`, `'style'`

**Shared packages (both stacks):**
- `'auth'`, `'config'`, `'middleware'`

#### Message
Any descriptive string that provides context about the log event.

### Configuration Options

```typescript
interface LoggerConfig {
  apiUrl?: string;           // API endpoint (default: test server URL)
  retryAttempts?: number;    // Number of retry attempts (default: 3)
  retryDelay?: number;       // Delay between retries in ms (default: 1000)
  enableConsoleLog?: boolean; // Also log to console (default: false)
}
```

## Examples

### Error Logging
```typescript
// Backend error
await Log('backend', 'error', 'db', 'Failed to connect to database - connection timeout');

// Frontend error  
await Log('frontend', 'error', 'component', 'URL shortener form validation failed');
```

### Info Logging
```typescript
// Backend success
await Log('backend', 'info', 'handler', 'Successfully created short URL: abc123');

// Frontend navigation
await Log('frontend', 'info', 'page', 'User accessed statistics page');
```

### Debug Logging
```typescript
// API request logging
await Log('frontend', 'debug', 'api', 'Sending POST request to /api/shorten with 3 URLs');

// Processing logging
await Log('backend', 'debug', 'service', 'Processing URL shortening request for user session xyz');
```

## Validation

The middleware automatically validates:
- ✅ All parameters are provided and are strings
- ✅ Stack, level, and package values are from allowed lists
- ✅ Package compatibility with stack (e.g., 'component' only works with 'frontend')
- ✅ Message is not empty

Invalid logs will return an error response without making API calls.

## Error Handling

The middleware handles various error scenarios:
- **Validation errors**: Invalid parameters return descriptive error messages
- **Network errors**: Automatic retry with exponential backoff
- **API errors**: Graceful degradation with error response
- **Timeout errors**: Configurable timeout with retry logic

## Requirements Compliance

This middleware fully complies with the project requirements:
- ✅ Reusable function with `Log(stack, level, package, message)` signature
- ✅ Makes API calls to `http://29.244.56.144/evaluation-service/logs`
- ✅ Validates all constraint values (lowercase only)
- ✅ Supports all required stack, level, and package values
- ✅ Proper package-stack compatibility validation
- ✅ TypeScript implementation for frontend/backend compatibility
