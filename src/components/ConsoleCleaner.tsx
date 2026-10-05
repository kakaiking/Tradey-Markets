"use client";

import { useEffect } from "react";

/**
 * ConsoleCleaner - A utility component to suppress specific noisy development logs
 * that are outside our direct control (e.g., browser extensions, dev servers).
 */
export function ConsoleCleaner() {
    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') return;

        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        // Suppress specific log patterns
        console.log = (...args: any[]) => {
            const msg = args.map(a => a?.toString() || "").join(" ");
            if (
                msg.includes("[HMR]") || 
                msg.includes("[Fast Refresh]") || 
                msg.includes("Download the React DevTools")
            ) return;
            originalLog(...args);
        };

        // Suppress specific warning patterns
        console.warn = (...args: any[]) => {
            const msg = args.map(a => a?.toString() || "").join(" ");
            if (
                msg.includes("non-static position") ||
                msg.includes("scroll offset is calculated correctly") ||
                msg.includes("Layout was forced before the page was fully loaded") ||
                msg.includes("Feature Policy")
            ) return;
            originalWarn(...args);
        };

        // Suppress uncontrollable errors (like browser extensions)
        console.error = (...args: any[]) => {
            const msg = args.map(a => a?.toString() || "").join(" ");
            if (
                msg.includes("message channel closed") ||
                msg.includes("asynchronous response") ||
                msg.includes("isExternalMethodAvailable")
            ) return;
            originalError(...args);
        };

        return () => {
            console.log = originalLog;
            console.warn = originalWarn;
            console.error = originalError;
        };
    }, []);

    return null;
}


