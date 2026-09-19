/**
 * Cache Store
 *
 * Manages full context cache with LRU eviction.
 * Stores snapshots, HTML, screenshots, console logs, and network activity.
 */
import type { FullContext, CacheEntry, CacheIndexEntry, CacheDataType } from '../types.js';
export interface CacheStoreOptions {
    cacheDir: string;
    maxEntries?: number;
}
export declare class CacheStore {
    private readonly cacheDir;
    private readonly maxEntries;
    private readonly indexPath;
    private index;
    constructor(options: CacheStoreOptions);
    /**
     * Ensure cache directory exists
     */
    private ensureDir;
    /**
     * Generate a unique cache entry ID
     */
    generateId(): string;
    /**
     * Load the cache index
     */
    private loadIndex;
    /**
     * Save the cache index
     */
    private saveIndex;
    /**
     * Get path to a cache entry file
     */
    private getEntryPath;
    /**
     * Store a full context entry
     */
    store(command: string, context: FullContext): Promise<string>;
    /**
     * Evict old entries if over limit
     */
    private evictIfNeeded;
    /**
     * Get a cache entry by ID
     */
    get(id: string): Promise<CacheEntry | null>;
    /**
     * Query specific data from a cache entry
     */
    query(id: string, dataType: CacheDataType): Promise<string | null>;
    /**
     * List all cache entries
     */
    list(): Promise<CacheIndexEntry[]>;
    /**
     * Get cache statistics
     */
    getStats(): Promise<{
        entryCount: number;
        totalSize: number;
        maxEntries: number;
        lastEviction?: string;
    }>;
    /**
     * Clear a specific cache entry
     */
    delete(id: string): Promise<boolean>;
    /**
     * Clear all cache entries
     */
    clear(): Promise<void>;
    /**
     * Search cache entries by command
     */
    search(commandPattern: string): Promise<CacheIndexEntry[]>;
    /**
     * Get the most recent entry
     */
    getLatest(): Promise<CacheEntry | null>;
    /**
     * Get cache directory path
     */
    getCacheDir(): string;
}
/**
 * Create a cache store instance
 */
export declare function createCacheStore(cacheDir: string, maxEntries?: number): CacheStore;
//# sourceMappingURL=CacheStore.d.ts.map