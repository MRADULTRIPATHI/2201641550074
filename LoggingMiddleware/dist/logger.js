"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
exports.initializeLogger = initializeLogger;
exports.getLogger = getLogger;
exports.Log = Log;
const axios_1 = __importDefault(require("axios"));
const validator_1 = require("./validator");
/**
 * Default configuration for the logger
 */
const DEFAULT_CONFIG = {
    apiUrl: 'http://29.244.56.144/evaluation-service/logs',
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
    enableConsoleLog: false
};
/**
 * Logger class that handles API calls to the test server
 */
class Logger {
    constructor(config) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }
    /**
     * Updates the logger configuration
     */
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
    /**
     * Main logging function that validates inputs and makes API calls
     */
    async log(stack, level, pkg, message) {
        const timestamp = new Date().toISOString();
        try {
            // Validate input parameters
            const validation = (0, validator_1.validateLogEntry)(stack, level, pkg, message);
            if (!validation.isValid) {
                const errorMsg = `Log validation failed: ${validation.errors.join(', ')}`;
                if (this.config.enableConsoleLog) {
                    console.error(`[${timestamp}] LOGGING ERROR:`, errorMsg);
                }
                return { success: false, error: errorMsg };
            }
            const logEntry = { stack, level, package: pkg, message };
            if (this.config.enableConsoleLog) {
                console.log(`[${timestamp}] [${stack.toUpperCase()}] [${level.toUpperCase()}] [${pkg}]:`, message);
            }
            // Attempt to send log to API with retry logic
            const response = await this.sendLogWithRetry(logEntry);
            return { success: true };
        }
        catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
            if (this.config.enableConsoleLog) {
                console.error(`[${timestamp}] LOGGING ERROR:`, errorMsg);
            }
            return { success: false, error: errorMsg };
        }
    }
    /**
     * Sends log entry to the API with retry logic
     */
    async sendLogWithRetry(logEntry, attempt = 1) {
        try {
            const response = await axios_1.default.post(this.config.apiUrl, logEntry, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000, // 10 second timeout
            });
            return response;
        }
        catch (error) {
            if (attempt < this.config.retryAttempts) {
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempt));
                return this.sendLogWithRetry(logEntry, attempt + 1);
            }
            throw error;
        }
    }
    /**
     * Convenience methods for different log levels
     */
    async debug(stack, pkg, message) {
        return this.log(stack, 'debug', pkg, message);
    }
    async info(stack, pkg, message) {
        return this.log(stack, 'info', pkg, message);
    }
    async warn(stack, pkg, message) {
        return this.log(stack, 'warn', pkg, message);
    }
    async error(stack, pkg, message) {
        return this.log(stack, 'error', pkg, message);
    }
    async fatal(stack, pkg, message) {
        return this.log(stack, 'fatal', pkg, message);
    }
}
exports.Logger = Logger;
// Singleton instance
let loggerInstance = null;
/**
 * Initializes the logger with configuration
 */
function initializeLogger(config) {
    loggerInstance = new Logger(config);
    return loggerInstance;
}
/**
 * Gets the current logger instance
 */
function getLogger() {
    if (!loggerInstance) {
        loggerInstance = new Logger();
    }
    return loggerInstance;
}
/**
 * Main Log function as specified in requirements
 * Log(stack, level, package, message)
 */
async function Log(stack, level, pkg, message) {
    const logger = getLogger();
    return logger.log(stack, level, pkg, message);
}
__exportStar(require("./types"), exports);
__exportStar(require("./validator"), exports);
//# sourceMappingURL=logger.js.map