/**
 * Observability Logger for Playwright Skill
 *
 * Logs cache access patterns for optimization analysis.
 * Writes JSONL format for easy processing.
 */
import type { CacheDataType, CacheAccessLog } from '../types.js';
export interface ObservabilityLoggerOptions {
    sessionDir: string;
    sessionName: string;
}
export declare class ObservabilityLogger {
    private logPath;
    private initialized;
    constructor(options: ObservabilityLoggerOptions);
    /**
     * Ensure the log directory exists
     */
    private ensureDir;
    /**
     * Log a cache access event
     */
    logCacheAccess(requestId: string, cacheId: string, dataType: CacheDataType, hitOrMiss: 'hit' | 'miss', reason?: string): Promise<void>;
    /**
     * Log a cache hit (agent found what it needed in trimmed response)
     */
    logCacheHit(requestId: string, cacheId: string, dataType: CacheDataType): Promise<void>;
    /**
     * Log a cache dive (agent needed to query full context from cache)
     * The reason helps us understand why trimmed response was insufficient
     */
    logCacheDive(requestId: string, cacheId: string, dataType: CacheDataType, reason?: string): Promise<void>;
    /**
     * Read all cache access logs for analysis
     */
    readLogs(): Promise<CacheAccessLog[]>;
    /**
     * Get cache dive statistics for optimization
     */
    getStats(): Promise<{
        totalAccesses: number;
        hits: number;
        misses: number;
        hitRate: number;
        byDataType: Record<string, {
            hits: number;
            misses: number;
        }>;
        byCommand: Record<string, {
            hits: number;
            misses: number;
        }>;
    }>;
    /**
     * Clear the log file
     */
    clear(): Promise<void>;
    /**
     * Get the path to the log file
     */
    getLogPath(): string;
}
export declare function createObservabilityLogger(sessionDir: string, sessionName: string): ObservabilityLogger;
//# sourceMappingURL=ObservabilityLogger.d.ts.map