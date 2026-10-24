"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, Twitter, Youtube, Github, Heart } from "lucide-react";

const footerLinks = {
    Learn: [
        { label: "Pipsology", href: "/learn" },
        // { label: "Crypto", href: "/crypto" },
        { label: "Learning Paths", href: "/paths" },
        { label: "Forexpedia", href: "/forexpedia" },
        // { label: "Psychology Hub", href: "/psychology" },
    ],
    /*
    Markets: [
        { label: "Market News", href: "/news" },
        { label: "Trading Insights", href: "/trading" },
        { label: "Analysis", href: "/analysis" },
        { label: "Economic Calendar", href: "/calendar" },
        { label: "Social Feed", href: "/social" },
        { label: "Live Webinars", href: "/webinars" },
    ],
    Tools: [
        { label: "All Calculators", href: "/tools" },
        { label: "MarketVision™", href: "/marketvision" },
        { label: "Backtester", href: "/backtester" },
        { label: "Trade Journal", href: "/journal" },
        { label: "Chart Classroom", href: "/charts" },
        { label: "Price Alerts", href: "/alerts" },
    ],
    */
    Company: [
        { label: "About Pipsology", href: "/about" },
        // { label: "Premium", href: "/premium" },
        // { label: "Broker Reviews", href: "/brokers" },
        // { label: "Forum", href: "/forum" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
    ],
};

export function Footer() {
    const pathname = usePathname();

    // Hide footer on learn pages as they have their own sidebar and layout
    if (pathname?.startsWith("/learn") || pathname?.startsWith("/admin")) {
        return null;
    }

    return (
        <footer className="border-t border-white/5 bg-[#080d0b] mt-20">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 pr-8">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.2)] group-hover:scale-110 transition-transform">
                                <TrendingUp size={20} className="text-white" />
                            </div>
                            <span className="font-bold text-2xl font-display tracking-tight">
                                <span className="text-white/90">Pipsology</span>
                            </span>
                        </Link>
                        <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-sm font-medium">
                            The world&apos;s most comprehensive forex & crypto trading education platform. Learn, practice, and analyze with AI-powered tools.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Youtube, Github].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/30 hover:text-green-400 hover:border-green-400/30 hover:bg-green-500/5 transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([section, links]) => (
                        <div key={section}>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-6">{section}</h4>
                            <ul className="space-y-3.5">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-sm text-white/40 hover:text-green-400 transition-all hover:translate-x-1 inline-block font-medium">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-white/30">
                        © 2026 Pipsology. Not financial advice. Trading involves significant risk.
                    </p>
                    <p className="text-xs text-white/20 flex items-center gap-1">
                        Made with <Heart size={10} className="text-red-400" /> for traders worldwide
                    </p>
                </div>
            </div>
        </footer>
    );
}


