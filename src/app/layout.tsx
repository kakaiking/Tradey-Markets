import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ConsoleCleaner } from "@/components/ConsoleCleaner";
import { ThemeProvider } from "@/lib/theme";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
    display: "swap",
});

const dmSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-dm-sans",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Tradey Market — Learn how money markets work",
    description:
        "Short lessons, practice quizzes, and a personal coach. Practice money only — not financial advice.",
    keywords: ["forex", "learn forex", "currency exchange", "trading education", "Tradey Market"],
    openGraph: {
        title: "Tradey Market — Learn how money markets work",
        description:
            "Short lessons, practice quizzes, and a personal coach. Practice money only — not financial advice.",
        type: "website",
    },
    icons: {
        icon: "/favicon.svg",
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover" as const,
    themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            className={`scroll-smooth ${spaceGrotesk.variable} ${dmSans.variable}`}
            data-scroll-behavior="smooth"
            data-theme="chalk"
            data-appearance="system"
            suppressHydrationWarning
        >
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <Script src="/theme-init.js" strategy="beforeInteractive" />
            </head>
            <body className="antialiased">
                <ThemeProvider>
                    <ConsoleCleaner />
                    <AppShell>{children}</AppShell>
                </ThemeProvider>
            </body>
        </html>
    );
}
