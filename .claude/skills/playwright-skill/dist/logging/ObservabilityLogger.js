/**
 * Observability Logger for Playwright Skill
 *
 * Logs cache access patterns for optimization analysis.
 * Writes JSONL format for easy processing.
 */
import * as fs from 'fs';
import * as path from 'path';
export class ObservabilityLogger {
    logPath;
    initialized = false;
    constructor(options) {
        this.logPath = path.join(options.sessionDir, options.sessionName, 'logs', 'cache-access.jsonl');
    }
    /**
     * Ensure the log directory exists
     */
    async ensureDir() {
        if (this.initialized) {
            return;
        }
        const dir = path.dirname(this.logPath);
        await fs.promises.mkdir(dir, { recursive: true });
        this.initialized = true;
    }
    /**
     * Log a cache access event
     */
    async logCacheAccess(requestId, cacheId, dataType, hitOrMiss, reason) {
        await this.ensureDir();
        const entry = {
            timestamp: new Date().toISOString(),
            requestId,
            cacheId,
            dataType,
            hitOrMiss,
            ...(reason && { reason }),
        };
        const line = JSON.stringify(entry) + '\n';
        await fs.promises.appendFile(this.logPath, line, 'utf-8');
    }
    /**
     * Log a cache hit (agent found what it needed in trimmed response)
     */
    async logCacheHit(requestId, cacheId, dataType) {
        await this.logCacheAccess(requestId, cacheId, dataType, 'hit');
    }
    /**
     * Log a cache dive (agent needed to query full context from cache)
     * The reason helps us understand why trimmed response was insufficient
     */
    async logCacheDive(requestId, cacheId, dataType, reason) {
        await this.logCacheAccess(requestId, cacheId, dataType, 'miss', reason);
    }
    /**
     * Read all cache access logs for analysis
     */
    async readLogs() {
        try {
            const content = await fs.promises.readFile(this.logPath, 'utf-8');
            return content
                .split('\n')
                .filter((line) => line.trim())
                .map((line) => JSON.parse(line));
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }
    /**
     * Get cache dive statistics for optimization
     */
    async getStats() {
        const logs = await this.readLogs();
        const stats = {
            totalAccesses: logs.length,
            hits: 0,
            misses: 0,
            hitRate: 0,
            byDataType: {},
            byCommand: {},
        };
        for (const log of logs) {
            if (log.hitOrMiss === 'hit') {
                stats.hits++;
            }
            else {
                stats.misses++;
            }
            // By data type
            if (!stats.byDataType[log.dataType]) {
                stats.byDataType[log.dataType] = { hits: 0, misses: 0 };
            }
            stats.byDataType[log.dataType][log.hitOrMiss === 'hit' ? 'hits' : 'misses']++;
        }
        if (stats.totalAccesses > 0) {
            stats.hitRate = stats.hits / stats.totalAccesses;
        }
        return stats;
    }
    /**
     * Clear the log file
     */
    async clear() {
        try {
            await fs.promises.unlink(this.logPath);
            this.initialized = false;
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }
    /**
     * Get the path to the log file
     */
    getLogPath() {
        return this.logPath;
    }
}
// Factory function for creating observability loggers
export function createObservabilityLogger(sessionDir, sessionName) {
    return new ObservabilityLogger({ sessionDir, sessionName });
}
//# sourceMappingURL=ObservabilityLogger.js.map