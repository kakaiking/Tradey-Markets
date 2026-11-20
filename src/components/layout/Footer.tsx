"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Twitter, Youtube, Github, Heart } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

const footerLinks = {
    Learn: [
        { label: "Tradey Market", href: "/quizzes" },
        { label: "Learning Paths", href: "/paths" },
        { label: "Forexpedia", href: "/forexpedia" },
    ],
    Company: [
        { label: "About Tradey Market", href: "/about" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
    ],
};

export function Footer() {
    const pathname = usePathname();

    if (pathname?.startsWith("/learn") || pathname?.startsWith("/admin")) {
        return null;
    }

    return (
        <footer className="border-t border-black/8 bg-white mt-20">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
                    <div className="col-span-2 pr-8">
                        <div className="mb-6">
                            <BrandLogo href="/" size="lg" />
                        </div>
                        <p className="text-black/45 text-sm leading-relaxed mb-6 max-w-sm font-medium">
                            Learn how money markets work — short lessons, practice tools, and a personal coach. Practice money only.
                        </p>
                        <div className="flex gap-3">
                            {[Twitter, Youtube, Github].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-[0.35rem] border border-black/10 flex items-center justify-center text-black/35 hover:text-brand-500 hover:border-brand-300 hover:bg-brand-50 transition-all"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {Object.entries(footerLinks).map(([section, links]) => (
                        <div key={section}>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/30 mb-6">{section}</h4>
                            <ul className="space-y-3.5">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-sm text-black/45 hover:text-brand-500 transition-all hover:translate-x-1 inline-block font-medium">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-black/8 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-black/35">
                        © 2026 Tradey Market. Not financial advice. Trading involves significant risk.
                    </p>
                    <p className="text-xs text-black/25 flex items-center gap-1">
                        Made with <Heart size={10} className="text-brand-500" /> for traders worldwide
                    </p>
                </div>
            </div>
        </footer>
    );
}
