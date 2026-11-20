"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    BookOpen, Wrench, Users, Bell,
    Menu, X, ChevronDown, Star, LogIn
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { cachedJson, invalidateClientCache } from "@/lib/clientCache";

interface NavItem {
    label: string;
    icon: any;
    href?: string;
    children?: {
        label: string;
        href: string;
        desc: string;
    }[];
}

const navItems: NavItem[] = [
    {
        label: "Learn",
        icon: BookOpen,
        children: [
            { label: "Tradey Market", href: "/quizzes", desc: "Complete forex curriculum" },
            { label: "Learning Paths", href: "/paths", desc: "Personalized curriculum" },
            { label: "Forexpedia", href: "/forexpedia", desc: "Trading glossary" },
        ],
    },
    {
        label: "Tools",
        icon: Wrench,
        children: [
            { label: "Calendar", href: "/calendar", desc: "Economic & community events" },
            { label: "Live Charts", href: "/charts", desc: "Real-time market analysis" },
            { label: "News Feed", href: "/news", desc: "Latest market updates" },
            { label: "Webinars", href: "/webinars", desc: "Live education sessions" },
        ],
    },
    {
        label: "Community",
        icon: Users,
        children: [
            { label: "Social Feed", href: "/social", desc: "Connect with other traders" },
            { label: "About Us", href: "/about", desc: "Our mission & team" },
        ],
    },
];

export function Navbar() {
    const [open, setOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [avatarOpen, setAvatarOpen] = useState(false);

    const [notifOpen, setNotifOpen] = useState(false);
    const [recentLessons, setRecentLessons] = useState<any[]>([]);
    const [readLessonIds, setReadLessonIds] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("read_lesson_ids");
        if (stored) {
            try {
                setReadLessonIds(JSON.parse(stored));
            } catch (e) {
                console.error("Error reading read_lesson_ids from localStorage:", e);
            }
        }

        async function fetchUser() {
            try {
                const data = await cachedJson<{ user: any } | null>("auth-me", "/api/auth/me", 120_000);
                setUser(data?.user ?? null);
            } catch (err) {
                console.error("Failed to fetch session:", err);
            } finally {
                setLoading(false);
            }
        }

        async function fetchNotifications() {
            try {
                const data = await cachedJson<{ lessons?: any[] }>("notifications", "/api/notifications", 60_000);
                setRecentLessons(data.lessons || []);
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            }
        }

        fetchUser();
        fetchNotifications();

        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement;
            if (!target.closest("#notif-dropdown-container") && !target.closest("#notif-btn")) {
                setNotifOpen(false);
            }
            if (!target.closest("#avatar-dropdown-container") && !target.closest("#avatar-btn")) {
                setAvatarOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setAvatarOpen(false);
        setNotifOpen(false);
    }, [pathname]);

    const markAllAsRead = () => {
        const allIds = recentLessons.map(l => l.id);
        setReadLessonIds(allIds);
        localStorage.setItem("read_lesson_ids", JSON.stringify(allIds));
    };

    const markAsRead = (id: string) => {
        if (!readLessonIds.includes(id)) {
            const updated = [...readLessonIds, id];
            setReadLessonIds(updated);
            localStorage.setItem("read_lesson_ids", JSON.stringify(updated));
        }
    };

    const unreadCount = recentLessons.filter(l => !readLessonIds.includes(l.id)).length;

    function formatRelativeTime(dateString: string) {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffMins < 1) return "Just now";
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays === 1) return "Yesterday";
            return `${diffDays}d ago`;
        } catch {
            return "";
        }
    }

    function handleSignIn(e: any) {
        e?.preventDefault?.();
        router.push("/account/signin");
    }

    async function handleSignOut() {
        try {
            await fetch("/api/auth/signout", { method: "POST" });
            invalidateClientCache();
            setUser(null);
            setAvatarOpen(false);
            router.push("/");
            router.refresh();
            window.location.reload();
        } catch (err) {
            console.error("Failed to sign out:", err);
        }
    }

    const initial = user?.username?.trim()?.[0]?.toUpperCase() ?? "U";

    if (pathname?.startsWith("/admin") || pathname?.startsWith("/learn")) {
        return null;
    }

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-black/8">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
                    <BrandLogo href="/" size="md" priority />

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <button
                                id="notif-btn"
                                onClick={() => {
                                    setNotifOpen(!notifOpen);
                                    setAvatarOpen(false);
                                }}
                                className="flex relative w-9 h-9 items-center justify-center rounded-[0.35rem] bg-black/[0.03] hover:bg-black/[0.06] transition-all text-black/55 hover:text-black border border-black/8"
                                aria-label="Notifications"
                            >
                                <Bell size={18} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-500 rounded-full border-2 border-white" />
                                )}
                            </button>

                            {notifOpen && (
                                <div
                                    id="notif-dropdown-container"
                                    className="absolute right-0 mt-2 w-80 sm:w-96 z-[110]"
                                >
                                    <div className="bg-white border border-black/10 rounded-[0.45rem] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.12)] animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="flex items-center justify-between pb-3 border-b border-black/8 mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm text-black">Notifications</span>
                                                {unreadCount > 0 && (
                                                    <span className="px-2 py-0.5 rounded-[0.3rem] text-[10px] font-bold bg-brand-50 text-brand-600 border border-brand-200">
                                                        {unreadCount} New
                                                    </span>
                                                )}
                                            </div>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors hover:underline"
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>

                                        <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                            {recentLessons.length === 0 ? (
                                                <div className="py-8 flex flex-col items-center justify-center text-center">
                                                    <div className="w-12 h-12 rounded-[0.45rem] bg-black/[0.04] flex items-center justify-center text-black/30 mb-3">
                                                        <Bell size={20} className="opacity-40" />
                                                    </div>
                                                    <p className="text-sm font-semibold text-black/70">All caught up!</p>
                                                    <p className="text-xs text-black/40 mt-1 max-w-[200px]">
                                                        When the admin adds a new lesson, it will appear here.
                                                    </p>
                                                </div>
                                            ) : (
                                                recentLessons.map((lesson) => {
                                                    const isUnread = !readLessonIds.includes(lesson.id);
                                                    return (
                                                        <Link
                                                            key={lesson.id}
                                                            href="/quizzes"
                                                            onClick={() => {
                                                                markAsRead(lesson.id);
                                                                setNotifOpen(false);
                                                            }}
                                                            className={`flex items-start gap-3 p-3 rounded-[0.35rem] border transition-all text-left ${
                                                                isUnread
                                                                    ? "bg-brand-50 border-brand-100 hover:bg-brand-100/70 hover:border-brand-200"
                                                                    : "bg-black/[0.01] border-black/5 hover:bg-black/[0.03] hover:border-black/10"
                                                            }`}
                                                        >
                                                            <div className="w-8 h-8 rounded-[0.3rem] bg-brand-50 flex items-center justify-center text-brand-500 border border-brand-100 shrink-0 mt-0.5">
                                                                <BookOpen size={15} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <span className="text-[10px] font-bold text-brand-500 uppercase tracking-[0.18em]">
                                                                        New Lesson Added
                                                                    </span>
                                                                    {isUnread && (
                                                                        <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                                                                    )}
                                                                </div>
                                                                <p className="text-sm font-bold text-black truncate mt-0.5">
                                                                    {lesson.title}
                                                                </p>
                                                                <p className="text-xs text-black/40 mt-0.5">
                                                                    Added to {lesson.grade?.title || lesson.gradeId}
                                                                </p>
                                                                <span className="text-[10px] text-black/30 mt-1.5 block">
                                                                    {formatRelativeTime(lesson.createdAt)}
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {user ? (
                            <div className="relative">
                                <button
                                    id="avatar-btn"
                                    onClick={() => {
                                        setAvatarOpen(!avatarOpen);
                                        setNotifOpen(false);
                                    }}
                                    className="w-9 h-9 rounded-[0.35rem] bg-black text-sm font-bold text-white hover:bg-black/85 transition animate-in fade-in"
                                    aria-label="Account menu"
                                >
                                    {initial}
                                </button>

                                {avatarOpen && (
                                    <div
                                        id="avatar-dropdown-container"
                                        className="absolute right-0 mt-2 w-64 z-[110]"
                                    >
                                        <div className="bg-white border border-black/10 rounded-[0.45rem] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.12)] animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-[0.35rem] bg-brand-500 flex items-center justify-center font-bold text-white">{initial}</div>
                                                    <div>
                                                        <div className="text-sm font-bold text-black">{user.username}</div>
                                                        <div className="text-xs text-black/40">{user.tier === "PREMIUM" ? "Pro Member" : "Free Member"}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="py-2 border-t border-black/8">
                                                <div className="grid grid-cols-2 gap-2 mb-2">
                                                    <div className="flex items-center gap-2 px-1 py-2">
                                                        <span className="text-xl">🔥</span>
                                                        <div>
                                                            <div className="text-sm font-bold text-brand-500">{user.currentStreak ?? 0}</div>
                                                            <div className="text-xs text-black/40 uppercase tracking-tighter">Day Streak</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 px-1 py-2">
                                                        <Star size={16} className="text-brand-500" />
                                                        <div>
                                                            <div className="text-sm font-bold text-brand-500">{(user.totalXP ?? 0).toLocaleString()}</div>
                                                            <div className="text-xs text-black/40">XP</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-3 grid gap-2">
                                                    {user.tier !== "PREMIUM" && (
                                                        <Link href="/premium" className="py-2 rounded-[0.35rem] text-sm font-bold text-white bg-brand-500 text-center hover:bg-brand-600 transition-colors">
                                                            Pro
                                                        </Link>
                                                    )}
                                                    <button
                                                        onClick={handleSignOut}
                                                        className="w-full py-2 rounded-[0.35rem] text-sm font-bold bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/15 transition-all text-center"
                                                    >
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            !loading && (
                                <button
                                    onClick={handleSignIn}
                                    className="flex items-center gap-2 px-5 py-2 rounded-[0.35rem] text-xs font-bold uppercase tracking-[0.14em] bg-brand-500 hover:bg-brand-600 transition-all text-white"
                                >
                                    <LogIn size={14} className="hidden sm:block" />
                                    <span className="hidden sm:block">Sign In</span>
                                    <span className="sm:hidden text-xs">Login</span>
                                </button>
                            )
                        )}

                        <button onClick={() => setOpen(!open)} className="w-9 h-9 flex items-center justify-center rounded-[0.35rem] border border-black/10 text-black/70 hover:text-black hover:bg-black/[0.04] transition-colors">
                            <Menu size={18} />
                        </button>
                    </div>
                </div>
            </nav>

            {open && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] animate-in fade-in transition-all"
                        onClick={() => setOpen(false)}
                    />
                    <div className="fixed top-0 right-0 h-full w-80 bg-white border-l border-black/10 z-[210] p-6 overflow-y-auto animate-in slide-in-from-right shadow-2xl">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/10">
                            <BrandLogo href={null} size="sm" />
                            <button onClick={() => setOpen(false)} className="close-x" aria-label="Close menu">
                                <X size={18} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="space-y-6 pb-20">
                            {navItems.map((item) => (
                                <div key={item.label} className="space-y-3">
                                    {item.href ? (
                                        <Link href={item.href} onClick={() => setOpen(false)} className="flex items-center gap-3 text-base font-semibold text-black hover:text-brand-500 transition-colors bg-black/[0.03] p-3 rounded-[0.35rem] border border-black/5">
                                            <item.icon size={18} className="text-brand-500" />
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <div className="bg-black/[0.02] border border-black/5 rounded-[0.35rem] overflow-hidden transition-all">
                                            <button
                                                onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                                                className="w-full flex items-center justify-between p-4 text-left hover:bg-black/[0.03] transition-colors"
                                            >
                                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-black/40">
                                                    <item.icon size={14} />
                                                    {item.label}
                                                </div>
                                                <ChevronDown size={14} className={`text-black/40 transition-transform ${activeDropdown === item.label ? "rotate-180" : ""}`} />
                                            </button>

                                            {activeDropdown === item.label && (
                                                <div className="flex flex-col gap-1 px-4 pb-4 animate-in slide-in-from-top-2 fade-in duration-200">
                                                    {item.children?.map((c) => (
                                                        <Link key={c.href} href={c.href} onClick={() => setOpen(false)} className="text-sm font-medium text-black/70 hover:text-brand-500 py-2 px-3 rounded-[0.3rem] hover:bg-black/[0.03] transition-colors">
                                                            {c.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
