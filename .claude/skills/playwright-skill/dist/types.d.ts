/**
 * Shared Types for Playwright Skill
 *
 * Core type definitions and Zod schemas for runtime validation.
 */
import { z } from 'zod';
export declare const AuthStatusSchema: z.ZodEnum<["authenticated", "unauthenticated", "unknown"]>;
export type AuthStatus = z.infer<typeof AuthStatusSchema>;
export declare const BrowserTypeSchema: z.ZodEnum<["chromium", "firefox", "webkit"]>;
export type BrowserType = z.infer<typeof BrowserTypeSchema>;
export declare const ViewportSchema: z.ZodNullable<z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    width: number;
    height: number;
}, {
    width: number;
    height: number;
}>>;
export type Viewport = z.infer<typeof ViewportSchema>;
export declare const ConsoleMessageTypeSchema: z.ZodEnum<["log", "debug", "info", "error", "warning", "dir", "dirxml", "table", "trace", "clear", "startGroup", "startGroupCollapsed", "endGroup", "assert", "profile", "profileEnd", "count", "timeEnd"]>;
export type ConsoleMessageType = z.infer<typeof ConsoleMessageTypeSchema>;
export declare const ConsoleMessageSchema: z.ZodObject<{
    type: z.ZodEnum<["log", "debug", "info", "error", "warning", "dir", "dirxml", "table", "trace", "clear", "startGroup", "startGroupCollapsed", "endGroup", "assert", "profile", "profileEnd", "count", "timeEnd"]>;
    text: z.ZodString;
    timestamp: z.ZodString;
    location: z.ZodOptional<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        lineNumber: z.ZodOptional<z.ZodNumber>;
        columnNumber: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        url?: string | undefined;
        lineNumber?: number | undefined;
        columnNumber?: number | undefined;
    }, {
        url?: string | undefined;
        lineNumber?: number | undefined;
        columnNumber?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd";
    text: string;
    timestamp: string;
    location?: {
        url?: string | undefined;
        lineNumber?: number | undefined;
        columnNumber?: number | undefined;
    } | undefined;
}, {
    type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd";
    text: string;
    timestamp: string;
    location?: {
        url?: string | undefined;
        lineNumber?: number | undefined;
        columnNumber?: number | undefined;
    } | undefined;
}>;
export type ConsoleMessage = z.infer<typeof ConsoleMessageSchema>;
export declare const CookieSameSiteSchema: z.ZodEnum<["Strict", "Lax", "None"]>;
export type CookieSameSite = z.infer<typeof CookieSameSiteSchema>;
export declare const CookieSchema: z.ZodObject<{
    name: z.ZodString;
    value: z.ZodString;
    domain: z.ZodString;
    path: z.ZodString;
    expires: z.ZodNumber;
    httpOnly: z.ZodBoolean;
    secure: z.ZodBoolean;
    sameSite: z.ZodEnum<["Strict", "Lax", "None"]>;
}, "strip", z.ZodTypeAny, {
    value: string;
    path: string;
    name: string;
    domain: string;
    expires: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite: "Strict" | "Lax" | "None";
}, {
    value: string;
    path: string;
    name: string;
    domain: string;
    expires: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite: "Strict" | "Lax" | "None";
}>;
export type Cookie = z.infer<typeof CookieSchema>;
export declare const NetworkRequestSchema: z.ZodObject<{
    url: z.ZodString;
    method: z.ZodString;
    status: z.ZodOptional<z.ZodNumber>;
    statusText: z.ZodOptional<z.ZodString>;
    resourceType: z.ZodString;
    timestamp: z.ZodString;
    duration: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    url: string;
    method: string;
    resourceType: string;
    status?: number | undefined;
    statusText?: string | undefined;
    duration?: number | undefined;
}, {
    timestamp: string;
    url: string;
    method: string;
    resourceType: string;
    status?: number | undefined;
    statusText?: string | undefined;
    duration?: number | undefined;
}>;
export type NetworkRequest = z.infer<typeof NetworkRequestSchema>;
export declare const TabSnapshotSchema: z.ZodObject<{
    url: z.ZodString;
    title: z.ZodString;
    ariaSnapshot: z.ZodString;
    ariaSnapshotDiff: z.ZodOptional<z.ZodString>;
    consoleMessages: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["log", "debug", "info", "error", "warning", "dir", "dirxml", "table", "trace", "clear", "startGroup", "startGroupCollapsed", "endGroup", "assert", "profile", "profileEnd", "count", "timeEnd"]>;
        text: z.ZodString;
        timestamp: z.ZodString;
        location: z.ZodOptional<z.ZodObject<{
            url: z.ZodOptional<z.ZodString>;
            lineNumber: z.ZodOptional<z.ZodNumber>;
            columnNumber: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            url?: string | undefined;
            lineNumber?: number | undefined;
            columnNumber?: number | undefined;
        }, {
            url?: string | undefined;
            lineNumber?: number | undefined;
            columnNumber?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd";
        text: string;
        timestamp: string;
        location?: {
            url?: string | undefined;
            lineNumber?: number | undefined;
            columnNumber?: number | undefined;
        } | undefined;
    }, {
        type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd";
        text: string;
        timestamp: string;
        location?: {
            url?: string | undefined;
            lineNumber?: number | undefined;
            columnNumber?: number | undefined;
        } | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    url: string;
    title: string;
    ariaSnapshot: string;
    consoleMessages: {
        type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd";
        text: string;
        timestamp: string;
        location?: {
            url?: string | undefined;
            lineNumber?: number | undefined;
            columnNumber?: number | undefined;
        } | undefined;
    }[];
    ariaSnapshotDiff?: string | undefined;
}, {
    url: string;
    title: string;
    ariaSnapshot: string;
    consoleMessages: {
        type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd";
        text: string;
        timestamp: string;
        location?: {
            url?: string | undefined;
            lineNumber?: number | undefined;
            columnNumber?: number | undefined;
        } | undefined;
    }[];
    ariaSnapshotDiff?: string | undefined;
}>;
export type TabSnapshot = z.infer<typeof TabSnapshotSchema>;
export declare const CacheDataTypeSchema: z.ZodEnum<["snapshot", "html", "screenshot", "console", "network"]>;
export type CacheDataType = z.infer<typeof CacheDataTypeSchema>;
export declare const TimingSchema: z.ZodObject<{
    commandStart: z.ZodNumber;
    commandEnd: z.ZodNumber;
    snapshotTime: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    commandStart: number;
    commandEnd: number;
    snapshotTime: number;
}, {
    commandStart: number;
    commandEnd: number;
    snapshotTime: number;
}>;
export type Timing = z.infer<typeof TimingSchema>;
export declare const FullContextSchema: z.ZodObject<{
    snapshot: z.ZodString;
    html: z.ZodString;
    screenshot: z.ZodOptional<z.ZodString>;
    console: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["log", "debug", "info", "error", "warning", "dir", "dirxml", "table", "trace", "clear", "startGroup", "startGroupCollapsed", "endGroup", "assert", "profile", "profileEnd", "count", "timeEnd"]>;
        text: z.ZodString;
        timestamp: z.ZodString;
        location: z.ZodOptional<z.ZodObject<{
            url: z.ZodOptional<z.ZodString>;
            lineNumber: z.ZodOptional<z.ZodNumber>;
            columnNumber: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            url?: string | undefined;
            lineNumber?: number | undefined;
            columnNumber?: number | undefined;
        }, {
            url?: string | undefined;
            lineNumber?: number | undefined;
            columnNumber?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd";
        text: string;
        timestamp: string;
        location?: {
            url?: string | undefined;
            lineNumber?: number | undefined;
            columnNumber?: number | undefined;
        } | undefined;
    }, {
        type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd";
        text: string;
        timestamp: string;
        location?: {
            url?: string | undefined;
            lineNumber?: number | undefined;
            columnNumber?: number | undefined;
        } | undefined;
    }>, "many">;
    network: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        method: z.ZodString;
        status: z.ZodOptional<z.ZodNumber>;
        statusText: z.ZodOptional<z.ZodString>;
        resourceType: z.ZodString;
        timestamp: z.ZodString;
        duration: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        timestamp: string;
        url: string;
        method: string;
        resourceType: string;
        status?: number | undefined;
        statusText?: string | undefined;
        duration?: number | undefined;
    }, {
        timestamp: string;
        url: string;
        method: string;
        resourceType: string;
        status?: number | undefined;
        statusText?: string | undefined;
        duration?: number | undefined;
    }>, "many">;
    cookies: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodString;
        domain: z.ZodString;
        path: z.ZodString;
        expires: z.ZodNumber;
        httpOnly: z.ZodBoolean;
        secure: z.ZodBoolean;
        sameSite: z.ZodEnum<["Strict", "Lax", "None"]>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        path: string;
        name: string;
        domain: string;
        expires: number;
        httpOnly: boolean;
        secure: boolean;
        sameSite: "Strict" | "Lax" | "None";
    }, {
        value: string;
        path: string;
        name: string;
        domain: string;
        expires: number;
        httpOnly: boolean;
        secure: boolean;
        sameSite: "Strict" | "Lax" | "None";
    }>, "many">;
    timing: z.ZodObject<{
        commandStart: z.ZodNumber;
        commandEnd: z.ZodNumber;
        snapshotTime: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        commandStart: number;
        commandEnd: number;
        snapshotTime: number;
    }, {
        commandStart: number;
        commandEnd: number;
        snapshotTime: number;
    }>;
}, "strip", z.ZodTypeAny, {
    snapshot: string;
    html: string;
    console: {
        type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd";
        text: string;
        timestamp: string;
        location?: {
            url?: string | undefined;
            lineNumber?: number | undefined;
            columnNumber?: number | undefined;
        } | undefined;
    }[];
    network: {
        timestamp: string;
        url: string;
        method: string;
        resourceType: string;
        status?: number | undefined;
        statusText?: string | undefined;
        duration?: number | undefined;
    }[];
    cookies: {
        value: string;
        path: string;
        name: string;
        domain: string;
        expires: number;
        httpOnly: boolean;
        secure: boolean;
        sameSite: "Strict" | "Lax" | "None";
    }[];
    timing: {
        commandStart: number;
        commandEnd: number;
        snapshotTime: number;
    };
    screenshot?: string | undefined;
}, {
    snapshot: string;
    html: string;
    console: {
        type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd";
        text: string;
        timestamp: string;
        location?: {
            url?: string | undefined;
            lineNumber?: number | undefined;
            columnNumber?: number | undefined;
        } | undefined;
    }[];
    network: {
        timestamp: string;
        url: string;
        method: string;
        resourceType: string;
        status?: number | undefined;
        statusText?: string | undefined;
        duration?: number | undefined;
    }[];
    cookies: {
        value: string;
        path: string;
        name: string;
        domain: string;
        expires: number;
        httpOnly: boolean;
        secure: boolean;
        sameSite: "Strict" | "Lax" | "None";
    }[];
    timing: {
        commandStart: number;
        commandEnd: number;
        snapshotTime: number;
    };
    screenshot?: string | undefined;
}>;
export type FullContext = z.infer<typeof FullContextSchema>;
export declare const CacheEntrySchema: z.ZodObject<{
    id: z.ZodString;
    timestamp: z.ZodString;
    command: z.ZodString;
    context: z.ZodObject<{
        snapshot: z.ZodString;
        html: z.ZodString;
        screenshot: z.ZodOptional<z.ZodString>;
        console: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["log", "debug", "info", "error", "warning", "dir", "dirxml", "table", "trace", "clear", "startGroup", "startGroupCollapsed", "endGroup", "assert", "profile", "profileEnd", "count", "timeEnd"]>;
            text: z.ZodString;
            timestamp: z.ZodString;
            location: z.ZodOptional<z.ZodObject<{
                url: z.ZodOptional<z.ZodString>;
                lineNumber: z.ZodOptional<z.ZodNumber>;
                columnNumber: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                url?: string | undefined;
                lineNumber?: number | undefined;
                columnNumber?: number | undefined;
            }, {
                url?: string | undefined;
                lineNumber?: number | undefined;
                columnNumber?: number | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd";
            text: string;
            timestamp: string;
            location?: {
                url?: string | undefined;
                lineNumber?: number | undefined;
                columnNumber?: number | undefined;
            } | undefined;
        }, {
            type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd";
            text: string;
            timestamp: string;
            location?: {
                url?: string | undefined;
                lineNumber?: number | undefined;
                columnNumber?: number | undefined;
            } | undefined;
        }>, "many">;
        network: z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            method: z.ZodString;
            status: z.ZodOptional<z.ZodNumber>;
            statusText: z.ZodOptional<z.ZodString>;
            resourceType: z.ZodString;
            timestamp: z.ZodString;
            duration: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            timestamp: string;
            url: string;
            method: string;
            resourceType: string;
            status?: number | undefined;
            statusText?: string | undefined;
            duration?: number | undefined;
        }, {
            timestamp: string;
            url: string;
            method: string;
            resourceType: string;
            status?: number | undefined;
            statusText?: string | undefined;
            duration?: number | undefined;
        }>, "many">;
        cookies: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
            domain: z.ZodString;
            path: z.ZodString;
            expires: z.ZodNumber;
            httpOnly: z.ZodBoolean;
            secure: z.ZodBoolean;
            sameSite: z.ZodEnum<["Strict", "Lax", "None"]>;
        }, "strip", z.ZodTypeAny, {
            value: string;
            path: string;
            name: string;
            domain: string;
            expires: number;
            httpOnly: boolean;
            secure: boolean;
            sameSite: "Strict" | "Lax" | "None";
        }, {
            value: string;
            path: string;
            name: string;
            domain: string;
            expires: number;
            httpOnly: boolean;
            secure: boolean;
            sameSite: "Strict" | "Lax" | "None";
        }>, "many">;
        timing: z.ZodObject<{
            commandStart: z.ZodNumber;
            commandEnd: z.ZodNumber;
            snapshotTime: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            commandStart: number;
            commandEnd: number;
            snapshotTime: number;
        }, {
            commandStart: number;
            commandEnd: number;
            snapshotTime: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        snapshot: string;
        html: string;
        console: {
            type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd";
            text: string;
            timestamp: string;
            location?: {
                url?: string | undefined;
                lineNumber?: number | undefined;
                columnNumber?: number | undefined;
            } | undefined;
        }[];
        network: {
            timestamp: string;
            url: string;
            method: string;
            resourceType: string;
            status?: number | undefined;
            statusText?: string | undefined;
            duration?: number | undefined;
        }[];
        cookies: {
            value: string;
            path: string;
            name: string;
            domain: string;
            expires: number;
            httpOnly: boolean;
            secure: boolean;
            sameSite: "Strict" | "Lax" | "None";
        }[];
        timing: {
            commandStart: number;
            commandEnd: number;
            snapshotTime: number;
        };
        screenshot?: string | undefined;
    }, {
        snapshot: string;
        html: string;
        console: {
            type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd";
            text: string;
            timestamp: string;
            location?: {
                url?: string | undefined;
                lineNumber?: number | undefined;
                columnNumber?: number | undefined;
            } | undefined;
        }[];
        network: {
            timestamp: string;
            url: string;
            method: string;
            resourceType: string;
            status?: number | undefined;
            statusText?: string | undefined;
            duration?: number | undefined;
        }[];
        cookies: {
            value: string;
            path: string;
            name: string;
            domain: string;
            expires: number;
            httpOnly: boolean;
            secure: boolean;
            sameSite: "Strict" | "Lax" | "None";
        }[];
        timing: {
            commandStart: number;
            commandEnd: number;
            snapshotTime: number;
        };
        screenshot?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    command: string;
    context: {
        snapshot: string;
        html: string;
        console: {
            type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd";
            text: string;
            timestamp: string;
            location?: {
                url?: string | undefined;
                lineNumber?: number | undefined;
                columnNumber?: number | undefined;
            } | undefined;
        }[];
        network: {
            timestamp: string;
            url: string;
            method: string;
            resourceType: string;
            status?: number | undefined;
            statusText?: string | undefined;
            duration?: number | undefined;
        }[];
        cookies: {
            value: string;
            path: string;
            name: string;
            domain: string;
            expires: number;
            httpOnly: boolean;
            secure: boolean;
            sameSite: "Strict" | "Lax" | "None";
        }[];
        timing: {
            commandStart: number;
            commandEnd: number;
            snapshotTime: number;
        };
        screenshot?: string | undefined;
    };
}, {
    timestamp: string;
    id: string;
    command: string;
    context: {
        snapshot: string;
        html: string;
        console: {
            type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd";
            text: string;
            timestamp: string;
            location?: {
                url?: string | undefined;
                lineNumber?: number | undefined;
                columnNumber?: number | undefined;
            } | undefined;
        }[];
        network: {
            timestamp: string;
            url: string;
            method: string;
            resourceType: string;
            status?: number | undefined;
            statusText?: string | undefined;
            duration?: number | undefined;
        }[];
        cookies: {
            value: string;
            path: string;
            name: string;
            domain: string;
            expires: number;
            httpOnly: boolean;
            secure: boolean;
            sameSite: "Strict" | "Lax" | "None";
        }[];
        timing: {
            commandStart: number;
            commandEnd: number;
            snapshotTime: number;
        };
        screenshot?: string | undefined;
    };
}>;
export type CacheEntry = z.infer<typeof CacheEntrySchema>;
export declare const CacheIndexEntrySchema: z.ZodObject<{
    id: z.ZodString;
    command: z.ZodString;
    timestamp: z.ZodString;
    size: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    command: string;
    size: number;
}, {
    timestamp: string;
    id: string;
    command: string;
    size: number;
}>;
export type CacheIndexEntry = z.infer<typeof CacheIndexEntrySchema>;
export declare const CacheIndexSchema: z.ZodObject<{
    entries: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        command: z.ZodString;
        timestamp: z.ZodString;
        size: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        timestamp: string;
        id: string;
        command: string;
        size: number;
    }, {
        timestamp: string;
        id: string;
        command: string;
        size: number;
    }>, "many">;
    totalSize: z.ZodNumber;
    lastEviction: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    entries: {
        timestamp: string;
        id: string;
        command: string;
        size: number;
    }[];
    totalSize: number;
    lastEviction?: string | undefined;
}, {
    entries: {
        timestamp: string;
        id: string;
        command: string;
        size: number;
    }[];
    totalSize: number;
    lastEviction?: string | undefined;
}>;
export type CacheIndex = z.infer<typeof CacheIndexSchema>;
export declare const PageStateSchema: z.ZodObject<{
    url: z.ZodString;
    title: z.ZodString;
    authStatus: z.ZodEnum<["authenticated", "unauthenticated", "unknown"]>;
    hasErrors: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    url: string;
    title: string;
    authStatus: "authenticated" | "unauthenticated" | "unknown";
    hasErrors: boolean;
}, {
    url: string;
    title: string;
    authStatus: "authenticated" | "unauthenticated" | "unknown";
    hasErrors: boolean;
}>;
export type PageState = z.infer<typeof PageStateSchema>;
export declare const CacheRefSchema: z.ZodObject<{
    id: z.ZodString;
    available: z.ZodArray<z.ZodEnum<["snapshot", "html", "screenshot", "console", "network"]>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    available: ("snapshot" | "html" | "screenshot" | "console" | "network")[];
}, {
    id: string;
    available: ("snapshot" | "html" | "screenshot" | "console" | "network")[];
}>;
export type CacheRef = z.infer<typeof CacheRefSchema>;
export declare const ErrorInfoSchema: z.ZodObject<{
    message: z.ZodString;
    suggestion: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    suggestion?: string | undefined;
}, {
    message: string;
    suggestion?: string | undefined;
}>;
export type ErrorInfo = z.infer<typeof ErrorInfoSchema>;
export declare const TrimmedResponseSchema: z.ZodObject<{
    id: z.ZodString;
    command: z.ZodString;
    success: z.ZodBoolean;
    action: z.ZodString;
    result: z.ZodOptional<z.ZodAny>;
    error: z.ZodOptional<z.ZodObject<{
        message: z.ZodString;
        suggestion: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        suggestion?: string | undefined;
    }, {
        message: string;
        suggestion?: string | undefined;
    }>>;
    pageState: z.ZodObject<{
        url: z.ZodString;
        title: z.ZodString;
        authStatus: z.ZodEnum<["authenticated", "unauthenticated", "unknown"]>;
        hasErrors: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        url: string;
        title: string;
        authStatus: "authenticated" | "unauthenticated" | "unknown";
        hasErrors: boolean;
    }, {
        url: string;
        title: string;
        authStatus: "authenticated" | "unauthenticated" | "unknown";
        hasErrors: boolean;
    }>;
    cacheRef: z.ZodObject<{
        id: z.ZodString;
        available: z.ZodArray<z.ZodEnum<["snapshot", "html", "screenshot", "console", "network"]>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        available: ("snapshot" | "html" | "screenshot" | "console" | "network")[];
    }, {
        id: string;
        available: ("snapshot" | "html" | "screenshot" | "console" | "network")[];
    }>;
    suggestions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    command: string;
    success: boolean;
    action: string;
    pageState: {
        url: string;
        title: string;
        authStatus: "authenticated" | "unauthenticated" | "unknown";
        hasErrors: boolean;
    };
    cacheRef: {
        id: string;
        available: ("snapshot" | "html" | "screenshot" | "console" | "network")[];
    };
    error?: {
        message: string;
        suggestion?: string | undefined;
    } | undefined;
    result?: any;
    suggestions?: string[] | undefined;
}, {
    id: string;
    command: string;
    success: boolean;
    action: string;
    pageState: {
        url: string;
        title: string;
        authStatus: "authenticated" | "unauthenticated" | "unknown";
        hasErrors: boolean;
    };
    cacheRef: {
        id: string;
        available: ("snapshot" | "html" | "screenshot" | "console" | "network")[];
    };
    error?: {
        message: string;
        suggestion?: string | undefined;
    } | undefined;
    result?: any;
    suggestions?: string[] | undefined;
}>;
export type TrimmedResponse = z.infer<typeof TrimmedResponseSchema>;
export declare const CacheAccessLogSchema: z.ZodObject<{
    timestamp: z.ZodString;
    requestId: z.ZodString;
    cacheId: z.ZodString;
    dataType: z.ZodEnum<["snapshot", "html", "screenshot", "console", "network"]>;
    hitOrMiss: z.ZodEnum<["hit", "miss"]>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    requestId: string;
    cacheId: string;
    dataType: "snapshot" | "html" | "screenshot" | "console" | "network";
    hitOrMiss: "hit" | "miss";
    reason?: string | undefined;
}, {
    timestamp: string;
    requestId: string;
    cacheId: string;
    dataType: "snapshot" | "html" | "screenshot" | "console" | "network";
    hitOrMiss: "hit" | "miss";
    reason?: string | undefined;
}>;
export type CacheAccessLog = z.infer<typeof CacheAccessLogSchema>;
export interface CommandResult<T = unknown> {
    success: boolean;
    data?: T;
    error?: Error;
}
//# sourceMappingURL=types.d.ts.map