import { Stack, Level, Package, LoggerConfig, LoggerResponse } from './types';
/**
 * Logger class that handles API calls to the test server
 */
declare class Logger {
    private config;
    constructor(config?: Partial<LoggerConfig>);
    /**
     * Updates the logger configuration
     */
    updateConfig(config: Partial<LoggerConfig>): void;
    /**
     * Main logging function that validates inputs and makes API calls
     */
    log(stack: Stack, level: Level, pkg: Package, message: string): Promise<LoggerResponse>;
    /**
     * Sends log entry to the API with retry logic
     */
    private sendLogWithRetry;
    /**
     * Convenience methods for different log levels
     */
    debug(stack: Stack, pkg: Package, message: string): Promise<LoggerResponse>;
    info(stack: Stack, pkg: Package, message: string): Promise<LoggerResponse>;
    warn(stack: Stack, pkg: Package, message: string): Promise<LoggerResponse>;
    error(stack: Stack, pkg: Package, message: string): Promise<LoggerResponse>;
    fatal(stack: Stack, pkg: Package, message: string): Promise<LoggerResponse>;
}
/**
 * Initializes the logger with configuration
 */
export declare function initializeLogger(config?: Partial<LoggerConfig>): Logger;
/**
 * Gets the current logger instance
 */
export declare function getLogger(): Logger;
/**
 * Main Log function as specified in requirements
 * Log(stack, level, package, message)
 */
export declare function Log(stack: Stack, level: Level, pkg: Package, message: string): Promise<LoggerResponse>;
export { Logger };
export * from './types';
export * from './validator';
//# sourceMappingURL=logger.d.ts.map