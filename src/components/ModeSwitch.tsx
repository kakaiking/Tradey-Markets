"use client";

import { motion, useReducedMotion } from "framer-motion";

type Option<T extends string> = readonly [T, string];

type ModeSwitchProps<T extends string> = {
    label: string;
    value: T;
    options: readonly Option<T>[];
    onChange: (value: T) => void;
    variant?: "tabs" | "pressed";
    tabId?: (id: T) => string;
    tabPanelId?: (id: T) => string;
};

export function ModeSwitch<T extends string>({
    label,
    value,
    options,
    onChange,
    variant = "pressed",
    tabId = (id) => `tab-${id}`,
    tabPanelId = (id) => `panel-${id}`,
}: ModeSwitchProps<T>) {
    const index = options.findIndex(([id]) => id === value);
    const reduced = useReducedMotion();
    const isTabs = variant === "tabs";

    return (
        <div
            className="modes"
            style={{ ["--mode-count" as string]: String(options.length) }}
            role={isTabs ? "tablist" : "group"}
            aria-label={label}
        >
            <motion.span
                className="mode-pill"
                aria-hidden="true"
                initial={false}
                animate={{ x: `${Math.max(index, 0) * 100}%` }}
                transition={
                    reduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 320, damping: 28 }
                }
            />
            {options.map(([id, name]) => (
                <button
                    key={id}
                    type="button"
                    className="mode"
                    {...(isTabs
                        ? {
                              role: "tab" as const,
                              id: tabId(id),
                              "aria-selected": value === id,
                              "aria-controls": tabPanelId(id),
                          }
                        : { "aria-pressed": value === id })}
                    onClick={() => onChange(id)}
                >
                    <span className="mode-name">{name}</span>
                </button>
            ))}
        </div>
    );
}
