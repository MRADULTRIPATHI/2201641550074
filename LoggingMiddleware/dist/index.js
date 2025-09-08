"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.isPackageCompatibleWithStack = exports.isValidPackage = exports.isValidLevel = exports.isValidStack = exports.validateLogEntry = exports.getLogger = exports.initializeLogger = exports.Logger = exports.Log = void 0;
// Export main logging function and utilities
var logger_1 = require("./logger");
Object.defineProperty(exports, "Log", { enumerable: true, get: function () { return logger_1.Log; } });
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return logger_1.Logger; } });
Object.defineProperty(exports, "initializeLogger", { enumerable: true, get: function () { return logger_1.initializeLogger; } });
Object.defineProperty(exports, "getLogger", { enumerable: true, get: function () { return logger_1.getLogger; } });
// Export validation utilities
var validator_1 = require("./validator");
Object.defineProperty(exports, "validateLogEntry", { enumerable: true, get: function () { return validator_1.validateLogEntry; } });
Object.defineProperty(exports, "isValidStack", { enumerable: true, get: function () { return validator_1.isValidStack; } });
Object.defineProperty(exports, "isValidLevel", { enumerable: true, get: function () { return validator_1.isValidLevel; } });
Object.defineProperty(exports, "isValidPackage", { enumerable: true, get: function () { return validator_1.isValidPackage; } });
Object.defineProperty(exports, "isPackageCompatibleWithStack", { enumerable: true, get: function () { return validator_1.isPackageCompatibleWithStack; } });
// Default export for convenience
var logger_2 = require("./logger");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return logger_2.Log; } });
//# sourceMappingURL=index.js.map