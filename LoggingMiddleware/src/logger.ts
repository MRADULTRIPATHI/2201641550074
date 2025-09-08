import axios, { AxiosResponse } from 'axios';
import { Stack, Level, Package, LogEntry, LoggerConfig, LoggerResponse } from './types';
import { validateLogEntry } from './validator';

/**
 * Default configuration for the logger
 */
const DEFAULT_CONFIG: Required<LoggerConfig> = {
  apiUrl: 'http://29.244.56.144/evaluation-service/logs',
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  enableConsoleLog: false
};

/**
 * Logger class that handles API calls to the test server
 */
class Logger {
  private config: Required<LoggerConfig>;

  constructor(config?: Partial<LoggerConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Updates the logger configuration
   */
  public updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Main logging function that validates inputs and makes API calls
   */
  public async log(stack: Stack, level: Level, pkg: Package, message: string): Promise<LoggerResponse> {
    const timestamp = new Date().toISOString();
    
    try {
      // Validate input parameters
      const validation = validateLogEntry(stack, level, pkg, message);
      if (!validation.isValid) {
        const errorMsg = `Log validation failed: ${validation.errors.join(', ')}`;
        if (this.config.enableConsoleLog) {
          console.error(`[${timestamp}] LOGGING ERROR:`, errorMsg);
        }
        return { success: false, error: errorMsg };
      }

      const logEntry: LogEntry = { stack, level, package: pkg, message };
      
      if (this.config.enableConsoleLog) {
        console.log(`[${timestamp}] [${stack.toUpperCase()}] [${level.toUpperCase()}] [${pkg}]:`, message);
      }

      // Attempt to send log to API with retry logic
      const response = await this.sendLogWithRetry(logEntry);
      return { success: true };

    } catch (error) {
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
  private async sendLogWithRetry(logEntry: LogEntry, attempt: number = 1): Promise<AxiosResponse> {
    try {
      const response = await axios.post(this.config.apiUrl, logEntry, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });
      return response;
    } catch (error) {
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
  public async debug(stack: Stack, pkg: Package, message: string): Promise<LoggerResponse> {
    return this.log(stack, 'debug', pkg, message);
  }

  public async info(stack: Stack, pkg: Package, message: string): Promise<LoggerResponse> {
    return this.log(stack, 'info', pkg, message);
  }

  public async warn(stack: Stack, pkg: Package, message: string): Promise<LoggerResponse> {
    return this.log(stack, 'warn', pkg, message);
  }

  public async error(stack: Stack, pkg: Package, message: string): Promise<LoggerResponse> {
    return this.log(stack, 'error', pkg, message);
  }

  public async fatal(stack: Stack, pkg: Package, message: string): Promise<LoggerResponse> {
    return this.log(stack, 'fatal', pkg, message);
  }
}

// Singleton instance
let loggerInstance: Logger | null = null;

/**
 * Initializes the logger with configuration
 */
export function initializeLogger(config?: Partial<LoggerConfig>): Logger {
  loggerInstance = new Logger(config);
  return loggerInstance;
}

/**
 * Gets the current logger instance
 */
export function getLogger(): Logger {
  if (!loggerInstance) {
    loggerInstance = new Logger();
  }
  return loggerInstance;
}

/**
 * Main Log function as specified in requirements
 * Log(stack, level, package, message)
 */
export async function Log(stack: Stack, level: Level, pkg: Package, message: string): Promise<LoggerResponse> {
  const logger = getLogger();
  return logger.log(stack, level, pkg, message);
}

// Export the Logger class and types for advanced usage
export { Logger };
export * from './types';
export * from './validator';
