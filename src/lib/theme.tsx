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

const KEY = "tradey-markets-appearance";

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
            bg: "linear-gradient(90deg, #ffffff 0 50%, #0b0d10 50% 100%)",
            bar: "#000000",
            ink: "#000000",
            mute: "#5a5a5a",
            accent: "#0581d5",
            dock: "#ffffff",
        },
    },
    {
        id: "chalk",
        name: "Market",
        note: "White desk, blue mark.",
        stage: {
            bg: "#ffffff",
            bar: "#000000",
            ink: "#000000",
            mute: "#5a5a5a",
            accent: "#0581d5",
            dock: "#ffffff",
        },
    },
    {
        id: "night",
        name: "Night tape",
        note: "Dark board, blue ink.",
        stage: {
            bg: "#0b0d10",
            bar: "#000000",
            ink: "#f5f7fa",
            mute: "#9aa3ad",
            accent: "#2f9ef0",
            dock: "#14181d",
        },
    },
    {
        id: "slate",
        name: "Slate",
        note: "Cool board, market blue.",
        stage: {
            bg: "#f0f5fa",
            bar: "#0c1520",
            ink: "#0c1520",
            mute: "#4a5d70",
            accent: "#0581d5",
            dock: "#ffffff",
        },
    },
    {
        id: "ledger",
        name: "Ledger",
        note: "Night glass, blue pen.",
        stage: {
            bg: "#10131a",
            bar: "#181d27",
            ink: "#eef3f8",
            mute: "#a7b0bd",
            accent: "#0581d5",
            dock: "#181d27",
        },
    },
    {
        id: "meadow",
        name: "Sky desk",
        note: "Soft blue practice field.",
        stage: {
            bg: "#eef7fc",
            bar: "#0a1c2b",
            ink: "#0a1c2b",
            mute: "#3d5f74",
            accent: "#0581d5",
            dock: "#ffffff",
        },
    },
];

const THEME_COLORS: Record<ResolvedTheme, string> = {
    chalk: "#FFFFFF",
    night: "#0B0D10",
    slate: "#F0F5FA",
    ledger: "#10131A",
    meadow: "#EEF7FC",
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
