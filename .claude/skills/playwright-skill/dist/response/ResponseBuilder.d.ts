/**
 * Response Builder
 *
 * Builds trimmed responses (~200 tokens) while storing full context in cache.
 * Handles auth status detection and error formatting.
 */
import type { TrimmedResponse, PageState, AuthStatus, ErrorInfo, ConsoleMessage, NetworkRequest, Cookie, TabSnapshot } from '../types.js';
import { CacheStore } from '../cache/CacheStore.js';
export interface ResponseBuilderOptions {
    cache: CacheStore;
    sessionName: string;
}
export interface BuildOptions {
    command: string;
    success: boolean;
    action: string;
    result?: unknown;
    error?: Error | string;
    snapshot?: TabSnapshot;
    html?: string;
    screenshot?: Buffer;
    consoleMessages?: ConsoleMessage[];
    networkRequests?: NetworkRequest[];
    cookies?: Cookie[];
    suggestions?: string[];
}
export declare class ResponseBuilder {
    private readonly cache;
    private readonly sessionName;
    private requestCounter;
    constructor(options: ResponseBuilderOptions);
    /**
     * Generate a unique request ID
     */
    private generateRequestId;
    /**
     * Detect auth status from page state
     */
    detectAuthStatus(url: string, cookies: Cookie[], html?: string): AuthStatus;
    /**
     * Check if there are console errors
     */
    private hasErrors;
    /**
     * Format an error for response
     */
    formatError(error: Error | string): ErrorInfo;
    /**
     * Build page state from snapshot and cookies
     */
    buildPageState(url: string, title: string, cookies: Cookie[], html?: string, consoleMessages?: ConsoleMessage[]): PageState;
    /**
     * Store full context in cache and return reference
     */
    private storeFullContext;
    /**
     * Build a trimmed response
     */
    build(options: BuildOptions): Promise<TrimmedResponse>;
    /**
     * Build a success response
     */
    success(command: string, action: string, options: Omit<BuildOptions, 'command' | 'success' | 'action'>): Promise<TrimmedResponse>;
    /**
     * Build an error response
     */
    error(command: string, error: Error | string, options?: Partial<Omit<BuildOptions, 'command' | 'success' | 'error'>>): Promise<TrimmedResponse>;
    /**
     * Get the underlying cache store
     */
    getCache(): CacheStore;
    /**
     * Get session name
     */
    getSessionName(): string;
}
/**
 * Create a response builder instance
 */
export declare function createResponseBuilder(cache: CacheStore, sessionName: string): ResponseBuilder;
//# sourceMappingURL=ResponseBuilder.d.ts.map