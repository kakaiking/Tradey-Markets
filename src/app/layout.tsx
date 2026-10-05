import type { Metadata } from "next";
import { Syne, Figtree, Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ConsoleCleaner } from "@/components/ConsoleCleaner";

const syne = Syne({
    subsets: ["latin"],
    variable: "--font-syne",
    display: "swap",
});

const figtree = Figtree({
    subsets: ["latin"],
    variable: "--font-figtree",
    display: "swap",
});

const sourceSerif = Source_Serif_4({
    subsets: ["latin"],
    variable: "--font-source-serif",
    display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-ibm-plex-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Tradey Markets — New to forex?",
    description: "Forex school with a structured curriculum, practice cards, and a live market calendar.",
    keywords: ["forex trading", "learn forex", "trading education", "cryptocurrency", "trading journal"],
    openGraph: {
        title: "Tradey Markets — New to forex?",
        description: "Forex school with a structured curriculum, practice cards, and a live market calendar.",
        type: "website",
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            className={`scroll-smooth ${syne.variable} ${figtree.variable} ${sourceSerif.variable} ${ibmPlexMono.variable}`}
            data-scroll-behavior="smooth"
        >
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            </head>
            <body className="antialiased">
                <ConsoleCleaner />
                <AppShell>{children}</AppShell>
            </body>
        </html>
    );
}
