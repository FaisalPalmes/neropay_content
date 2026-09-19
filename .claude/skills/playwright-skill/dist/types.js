/**
 * Shared Types for Playwright Skill
 *
 * Core type definitions and Zod schemas for runtime validation.
 */
import { z } from 'zod';
// ============================================================================
// Auth Status
// ============================================================================
export const AuthStatusSchema = z.enum(['authenticated', 'unauthenticated', 'unknown']);
// ============================================================================
// Browser Types
// ============================================================================
export const BrowserTypeSchema = z.enum(['chromium', 'firefox', 'webkit']);
export const ViewportSchema = z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
}).nullable();
// ============================================================================
// Console & Modal Types
// ============================================================================
export const ConsoleMessageTypeSchema = z.enum([
    'log', 'debug', 'info', 'error', 'warning', 'dir', 'dirxml',
    'table', 'trace', 'clear', 'startGroup', 'startGroupCollapsed',
    'endGroup', 'assert', 'profile', 'profileEnd', 'count', 'timeEnd'
]);
export const ConsoleMessageSchema = z.object({
    type: ConsoleMessageTypeSchema,
    text: z.string(),
    timestamp: z.string(),
    location: z.object({
        url: z.string().optional(),
        lineNumber: z.number().optional(),
        columnNumber: z.number().optional(),
    }).optional(),
});
// ModalState/DialogType removed in v2 — dialog race condition fixed by @playwright/cli.
// ============================================================================
// Cookie Type
// ============================================================================
export const CookieSameSiteSchema = z.enum(['Strict', 'Lax', 'None']);
export const CookieSchema = z.object({
    name: z.string(),
    value: z.string(),
    domain: z.string(),
    path: z.string(),
    expires: z.number(),
    httpOnly: z.boolean(),
    secure: z.boolean(),
    sameSite: CookieSameSiteSchema,
});
// ============================================================================
// Network Types
// ============================================================================
export const NetworkRequestSchema = z.object({
    url: z.string(),
    method: z.string(),
    status: z.number().optional(),
    statusText: z.string().optional(),
    resourceType: z.string(),
    timestamp: z.string(),
    duration: z.number().optional(),
});
// Session and AuthProfile types removed in v2.
// Session lifecycle is managed by @playwright/cli.
// Auth profiles use playwright-cli state-save/state-load (storageState format).
// ============================================================================
// Tab Snapshot
// ============================================================================
export const TabSnapshotSchema = z.object({
    url: z.string(),
    title: z.string(),
    ariaSnapshot: z.string(),
    ariaSnapshotDiff: z.string().optional(),
    consoleMessages: z.array(ConsoleMessageSchema),
});
// ============================================================================
// Cache Types
// ============================================================================
export const CacheDataTypeSchema = z.enum(['snapshot', 'html', 'screenshot', 'console', 'network']);
export const TimingSchema = z.object({
    commandStart: z.number(),
    commandEnd: z.number(),
    snapshotTime: z.number(),
});
export const FullContextSchema = z.object({
    snapshot: z.string(),
    html: z.string(),
    screenshot: z.string().optional(),
    console: z.array(ConsoleMessageSchema),
    network: z.array(NetworkRequestSchema),
    cookies: z.array(CookieSchema),
    timing: TimingSchema,
});
export const CacheEntrySchema = z.object({
    id: z.string(),
    timestamp: z.string(),
    command: z.string(),
    context: FullContextSchema,
});
export const CacheIndexEntrySchema = z.object({
    id: z.string(),
    command: z.string(),
    timestamp: z.string(),
    size: z.number(),
});
export const CacheIndexSchema = z.object({
    entries: z.array(CacheIndexEntrySchema),
    totalSize: z.number(),
    lastEviction: z.string().optional(),
});
// ============================================================================
// Response Types
// ============================================================================
export const PageStateSchema = z.object({
    url: z.string(),
    title: z.string(),
    authStatus: AuthStatusSchema,
    hasErrors: z.boolean(),
});
export const CacheRefSchema = z.object({
    id: z.string(),
    available: z.array(CacheDataTypeSchema),
});
export const ErrorInfoSchema = z.object({
    message: z.string(),
    suggestion: z.string().optional(),
});
export const TrimmedResponseSchema = z.object({
    id: z.string(),
    command: z.string(),
    success: z.boolean(),
    action: z.string(),
    result: z.any().optional(),
    error: ErrorInfoSchema.optional(),
    pageState: PageStateSchema,
    cacheRef: CacheRefSchema,
    suggestions: z.array(z.string()).optional(),
});
// ============================================================================
// Observability Types
// ============================================================================
export const CacheAccessLogSchema = z.object({
    timestamp: z.string(),
    requestId: z.string(),
    cacheId: z.string(),
    dataType: CacheDataTypeSchema,
    hitOrMiss: z.enum(['hit', 'miss']),
    reason: z.string().optional(),
});
//# sourceMappingURL=types.js.map