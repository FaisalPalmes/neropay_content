/**
 * Logger for Playwright Skill
 *
 * Outputs to stderr to keep stdout clean for JSON responses.
 * Supports debug, info, warn, error levels with ISO timestamps.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface LoggerOptions {
    level?: LogLevel;
    debug?: boolean;
    prefix?: string;
    useColors?: boolean;
}
export declare class Logger {
    private level;
    private prefix;
    private useColors;
    constructor(options?: LoggerOptions);
    private shouldLog;
    private formatMessage;
    private log;
    debug(message: string, data?: unknown): void;
    info(message: string, data?: unknown): void;
    warn(message: string, data?: unknown): void;
    error(message: string, data?: unknown): void;
    /**
     * Create a child logger with a different prefix
     */
    child(prefix: string): Logger;
    /**
     * Set the log level dynamically
     */
    setLevel(level: LogLevel): void;
    /**
     * Check if a specific log level is enabled
     */
    isLevelEnabled(level: LogLevel): boolean;
}
/**
 * Get or create the default logger instance
 */
export declare function getLogger(options?: LoggerOptions): Logger;
/**
 * Initialize the default logger with options
 */
export declare function initLogger(options: LoggerOptions): Logger;
//# sourceMappingURL=Logger.d.ts.map