"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export type Appearance =
    | "system"
    | "chalk"
    | "night"
    | "slate"
    | "ledger"
    | "meadow";

export type ResolvedTheme = Exclude<Appearance, "system">;

const KEY = "pipsology-appearance";

const APPEARANCES: Appearance[] = [
    "system",
    "chalk",
    "night",
    "slate",
    "ledger",
    "meadow",
];

export type ThemeCard = {
    id: Appearance;
    name: string;
    note: string;
    stage: {
        bg: string;
        bar: string;
        ink: string;
        mute: string;
        accent: string;
        dock: string;
    };
};

/** Miniatures and the live shell share these values. CSS in globals.css mirrors them. */
export const THEMES: ThemeCard[] = [
    {
        id: "system",
        name: "Phone",
        note: "Follows this phone.",
        stage: {
            bg: "linear-gradient(90deg, #f5f5f5 0 50%, #121212 50% 100%)",
            bar: "#111111",
            ink: "#111111",
            mute: "#6b6b6b",
            accent: "#3cb878",
            dock: "#ffffff",
        },
    },
    {
        id: "chalk",
        name: "Chalk",
        note: "Paper desk, green mark.",
        stage: {
            bg: "#f5f5f5",
            bar: "#111111",
            ink: "#111111",
            mute: "#6b6b6b",
            accent: "#3cb878",
            dock: "#ffffff",
        },
    },
    {
        id: "night",
        name: "Night desk",
        note: "Same chalk, darker room.",
        stage: {
            bg: "#121212",
            bar: "#0a0a0a",
            ink: "#f4f4f4",
            mute: "#b0b0b0",
            accent: "#4fd492",
            dock: "#1c1c1c",
        },
    },
    {
        id: "slate",
        name: "Slate",
        note: "Cool board, blue ink.",
        stage: {
            bg: "#e8eef4",
            bar: "#1a2a3a",
            ink: "#132033",
            mute: "#5a6b7c",
            accent: "#2f6fed",
            dock: "#ffffff",
        },
    },
    {
        id: "ledger",
        name: "Ledger",
        note: "Night glass, gold pen.",
        stage: {
            bg: "#14161c",
            bar: "#252830",
            ink: "#f5f0e6",
            mute: "#9a9588",
            accent: "#f5c518",
            dock: "#1c1f28",
        },
    },
    {
        id: "meadow",
        name: "Meadow",
        note: "Soft green practice field.",
        stage: {
            bg: "#e6f2ea",
            bar: "#1a3d2e",
            ink: "#123024",
            mute: "#4a6b5a",
            accent: "#2d9a5c",
            dock: "#ffffff",
        },
    },
];

const THEME_COLORS: Record<ResolvedTheme, string> = {
    chalk: "#F5F5F5",
    night: "#121212",
    slate: "#E8EEF4",
    ledger: "#14161C",
    meadow: "#E6F2EA",
};

type ThemeContextValue = {
    appearance: Appearance;
    setAppearance: (next: Appearance) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isAppearance(value: string): value is Appearance {
    return APPEARANCES.includes(value as Appearance);
}

function resolve(appearance: Appearance): ResolvedTheme {
    if (appearance !== "system") return appearance;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "night"
        : "chalk";
}

function apply(appearance: Appearance): void {
    const theme = resolve(appearance);
    document.documentElement.setAttribute("data-appearance", appearance);
    document.documentElement.setAttribute("data-theme", theme);
    document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", THEME_COLORS[theme]);
}

function readAppearance(): Appearance {
    if (typeof window === "undefined") return "system";
    const stored = localStorage.getItem(KEY);
    if (stored === null) return "system";
    return isAppearance(stored) ? stored : "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [appearance, setAppearanceState] = useState<Appearance>("system");
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const next = readAppearance();
        setAppearanceState(next);
        apply(next);
        setReady(true);
    }, []);

    useEffect(() => {
        if (!ready) return;
        apply(appearance);
        if (appearance !== "system") return;
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = (): void => {
            apply("system");
        };
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, [appearance, ready]);

    const value = useMemo<ThemeContextValue>(
        () => ({
            appearance,
            setAppearance: (next) => {
                localStorage.setItem(KEY, next);
                setAppearanceState(next);
            },
        }),
        [appearance]
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    const value = useContext(ThemeContext);
    if (value === null) throw new Error("ThemeProvider is missing");
    return value;
}
