"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    BookOpen, TrendingUp, BarChart3, Wrench, Users, Bell,
    Crown, Menu, X, ChevronDown, Flame, Star, LogIn
} from "lucide-react";

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
            { label: "Pipsology", href: "/learn", desc: "Complete forex curriculum" },
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

    // Actual user auth state
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [avatarOpen, setAvatarOpen] = useState(false);

    // Notifications & Recent Lessons Dropdown state
    const [notifOpen, setNotifOpen] = useState(false);
    const [recentLessons, setRecentLessons] = useState<any[]>([]);
    const [readLessonIds, setReadLessonIds] = useState<string[]>([]);

    useEffect(() => {
        // Load read lesson IDs from localStorage
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
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (err) {
                console.error("Failed to fetch session:", err);
            } finally {
                setLoading(false);
            }
        }

        async function fetchNotifications() {
            try {
                const res = await fetch("/api/notifications");
                if (res.ok) {
                    const data = await res.json();
                    setRecentLessons(data.lessons || []);
                }
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            }
        }

        fetchUser();
        fetchNotifications();

        // Refresh notifications every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    // Handle click outside dropdowns to close them
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

    // Close dropdowns on path changes
    useEffect(() => {
        setAvatarOpen(false);
        setNotifOpen(false);
    }, [pathname]);

    // Mark all notifications as read
    const markAllAsRead = () => {
        const allIds = recentLessons.map(l => l.id);
        setReadLessonIds(allIds);
        localStorage.setItem("read_lesson_ids", JSON.stringify(allIds));
    };

    // Mark a single notification as read
    const markAsRead = (id: string) => {
        if (!readLessonIds.includes(id)) {
            const updated = [...readLessonIds, id];
            setReadLessonIds(updated);
            localStorage.setItem("read_lesson_ids", JSON.stringify(updated));
        }
    };

    const unreadCount = recentLessons.filter(l => !readLessonIds.includes(l.id)).length;

    // Helper to format relative study time
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
            <nav
                className="fixed top-0 left-0 right-0 z-[100] bg-[#0a0f0d]/80 backdrop-blur-xl border-b border-white/5"
            >
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg glow-green-sm">
                            <TrendingUp size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-lg font-display tracking-tight">
                            <span className="text-white/90">Pipsology</span>
                        </span>
                    </Link>



                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Notifications — click triggers dropdown */}
                        <div className="relative">
                            <button
                                id="notif-btn"
                                onClick={() => {
                                    setNotifOpen(!notifOpen);
                                    setAvatarOpen(false);
                                }}
                                className="flex relative w-9 h-9 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all text-white/60 hover:text-white border border-white/5"
                                aria-label="Notifications"
                            >
                                <Bell size={18} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-green-500 rounded-full border-2 border-[#0a0f0d]" />
                                )}
                            </button>

                            {notifOpen && (
                                <div 
                                    id="notif-dropdown-container" 
                                    className="absolute right-0 mt-2 w-80 sm:w-96 z-[110]"
                                >
                                    <div className="bg-[#111714] border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm text-white/90">Notifications</span>
                                                {unreadCount > 0 && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                                        {unreadCount} New
                                                    </span>
                                                )}
                                            </div>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-xs font-semibold text-green-400 hover:text-green-300 transition-colors hover:underline"
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>

                                        <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                            {recentLessons.length === 0 ? (
                                                <div className="py-8 flex flex-col items-center justify-center text-center">
                                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/30 mb-3">
                                                        <Bell size={20} className="opacity-40" />
                                                    </div>
                                                    <p className="text-sm font-semibold text-white/70">All caught up!</p>
                                                    <p className="text-xs text-white/40 mt-1 max-w-[200px]">
                                                        When the admin adds a new lesson, it will appear here.
                                                    </p>
                                                </div>
                                            ) : (
                                                recentLessons.map((lesson) => {
                                                    const isUnread = !readLessonIds.includes(lesson.id);
                                                    return (
                                                        <Link
                                                            key={lesson.id}
                                                            href={`/learn/${lesson.gradeId}/${lesson.slug}`}
                                                            onClick={() => {
                                                                markAsRead(lesson.id);
                                                                setNotifOpen(false);
                                                            }}
                                                            className={`flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${
                                                                isUnread
                                                                    ? "bg-green-500/[0.03] border-green-500/10 hover:bg-green-500/[0.06] hover:border-green-500/20"
                                                                    : "bg-white/[0.01] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                                                            }`}
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20 shrink-0 mt-0.5">
                                                                <BookOpen size={15} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">
                                                                        New Lesson Added
                                                                    </span>
                                                                    {isUnread && (
                                                                        <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                                                                    )}
                                                                </div>
                                                                <p className="text-sm font-bold text-white/90 truncate mt-0.5">
                                                                    {lesson.title}
                                                                </p>
                                                                <p className="text-xs text-white/40 mt-0.5">
                                                                    Added to {lesson.grade?.title || lesson.gradeId}
                                                                </p>
                                                                <span className="text-[10px] text-white/30 mt-1.5 block">
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
                                    className="w-9 h-9 rounded-full bg-white/6 flex items-center justify-center text-sm font-bold text-white/90 hover:bg-white/10 transition animate-in fade-in"
                                    aria-label="Account menu"
                                >
                                    {initial}
                                </button>

                                {avatarOpen && (
                                    <div 
                                        id="avatar-dropdown-container"
                                        className="absolute right-0 mt-2 w-64 z-[110]"
                                    >
                                        <div className="bg-[#111714] border border-white/10 rounded-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center font-bold text-black">{initial}</div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white/90">{user.username}</div>
                                                        <div className="text-xs text-white/40">{user.tier === "PREMIUM" ? "Pro Member" : "Free Member"}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="py-2 border-t border-white/5">
                                                <div className="grid grid-cols-2 gap-2 mb-2">
                                                    <div className="flex items-center gap-2 px-1 py-2">
                                                        <span className="text-xl">🔥</span>
                                                        <div>
                                                            <div className="text-sm font-bold text-green-400">{user.currentStreak ?? 0}</div>
                                                            <div className="text-xs text-white/40 uppercase tracking-tighter">Day Streak</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 px-1 py-2">
                                                        <Star size={16} className="text-yellow-400" />
                                                        <div>
                                                            <div className="text-sm font-bold text-yellow-400">{(user.totalXP ?? 0).toLocaleString()}</div>
                                                            <div className="text-xs text-white/40">XP</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-3 grid gap-2">
                                                    {user.tier !== "PREMIUM" && (
                                                        <Link href="/premium" className="py-2 rounded-lg text-sm font-bold text-black bg-gradient-to-r from-yellow-500 to-amber-600 text-center hover:opacity-90 transition-opacity">
                                                            Pro
                                                        </Link>
                                                    )}
                                                    <button 
                                                        onClick={handleSignOut}
                                                        className="w-full py-2 rounded-lg text-sm font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-center"
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
                            <button
                                onClick={handleSignIn}
                                className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider glass hover:bg-white/8 transition-all text-white/90 border border-white/10"
                            >
                                <LogIn size={14} className="hidden sm:block" />
                                <span className="hidden sm:block">Sign In</span>
                                <span className="sm:hidden text-xs">Login</span>
                            </button>
                        )}

                        {/* Hamburger button (Always visible, triggering off-canvas) */}
                        <button onClick={() => setOpen(!open)} className="w-9 h-9 flex items-center justify-center rounded-lg glass text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                            <Menu size={18} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Offcanvas menu */}
            {open && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] animate-in fade-in transition-all"
                        onClick={() => setOpen(false)}
                    />
                    <div className="fixed top-0 right-0 h-full w-80 bg-[#0a0f0d] border-l border-white/10 z-[210] p-6 overflow-y-auto animate-in slide-in-from-right shadow-2xl">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                            <span className="font-bold text-lg font-display text-white/90 tracking-tight">Navigation</span>
                            <button onClick={() => setOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-lg glass text-white/70 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-6 pb-20">
                            {navItems.map((item) => (
                                <div key={item.label} className="space-y-3">
                                    {item.href ? (
                                        <Link href={item.href} onClick={() => setOpen(false)} className="flex items-center gap-3 text-base font-semibold text-white/90 hover:text-green-400 transition-colors bg-white/5 p-3 rounded-xl border border-white/5">
                                            <item.icon size={18} className="text-green-400" />
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden transition-all">
                                            <button
                                                onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                                                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                                            >
                                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
                                                    <item.icon size={14} />
                                                    {item.label}
                                                </div>
                                                <ChevronDown size={14} className={`text-white/40 transition-transform ${activeDropdown === item.label ? "rotate-180" : ""}`} />
                                            </button>

                                            {activeDropdown === item.label && (
                                                <div className="flex flex-col gap-1 px-4 pb-4 animate-in slide-in-from-top-2 fade-in duration-200">
                                                    {item.children?.map((c) => (
                                                        <Link key={c.href} href={c.href} onClick={() => setOpen(false)} className="text-sm font-medium text-white/70 hover:text-green-400 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
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
            )
            }
        </>
    );
}


