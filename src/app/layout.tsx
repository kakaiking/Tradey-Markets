import type { Metadata } from "next";
import Script from "next/script";
import { Nunito, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ConsoleCleaner } from "@/components/ConsoleCleaner";
import { ThemeProvider } from "@/lib/theme";

const nunito = Nunito({
    subsets: ["latin"],
    variable: "--font-nunito",
    display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-ibm-plex-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Pipsology — Learn how money markets work",
    description:
        "Short lessons, practice quizzes, and a personal coach. Practice money only — not financial advice.",
    keywords: ["forex", "learn forex", "currency exchange", "trading education", "Pipsology"],
    openGraph: {
        title: "Pipsology — Learn how money markets work",
        description:
            "Short lessons, practice quizzes, and a personal coach. Practice money only — not financial advice.",
        type: "website",
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover" as const,
    themeColor: "#F5F5F5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            className={`scroll-smooth ${nunito.variable} ${ibmPlexMono.variable}`}
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
