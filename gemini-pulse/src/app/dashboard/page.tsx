"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
    ShieldAlert,
    Sparkles,
    RefreshCw,
    Mail,
    LogOut,
    GraduationCap,
    BookOpen,
    Briefcase,
    ArrowLeft,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock,
    ChevronDown,
} from "lucide-react";
import GeminiChat from "./GeminiChat";
import ThemeToggle from "./ThemeToggle";
import AnalyticsPanel from "./AnalyticsPanel";

type PulseEmail = {
    id: string;
    subject: string;
    from: string;
    snippet: string;
    analysis: {
        score: number;
        category: "Scam" | "High Priority" | "Neutral" | "Low";
        summary: string;
        reason: string;
    };
};

const ROLE_CONFIG: Record<
    string,
    {
        label: string;
        icon: typeof GraduationCap;
        emoji: string;
        accent: string;
        badgeClass: string;
        glowClass: string;
        gradient: string;
        subtitle: string;
        widgets: { label: string; icon: typeof Clock; value: string }[];
    }
> = {
    student: {
        label: "Student",
        icon: GraduationCap,
        emoji: "🎓",
        accent: "var(--student-accent)",
        badgeClass: "role-badge-student",
        glowClass: "glow-student",
        gradient: "from-sky-500/20 to-cyan-500/10",
        subtitle: "Campus Inbox Intelligence",
        widgets: [
            { label: "Scholarships", icon: TrendingUp, value: "Scan inbox" },
            { label: "Deadlines", icon: Clock, value: "Check emails" },
            { label: "Scam Alerts", icon: AlertTriangle, value: "Protected" },
        ],
    },
    teacher: {
        label: "Teacher",
        icon: BookOpen,
        emoji: "📚",
        accent: "var(--teacher-accent)",
        badgeClass: "role-badge-teacher",
        glowClass: "glow-teacher",
        gradient: "from-violet-500/20 to-purple-500/10",
        subtitle: "Educator Priority Hub",
        widgets: [
            { label: "Parent Emails", icon: Mail, value: "Prioritized" },
            { label: "Admin Notices", icon: AlertTriangle, value: "Flagged" },
            { label: "Grading", icon: CheckCircle, value: "Reminders" },
        ],
    },
    corporate: {
        label: "Corporate",
        icon: Briefcase,
        emoji: "💼",
        accent: "var(--corporate-accent)",
        badgeClass: "role-badge-corporate",
        glowClass: "glow-corporate",
        gradient: "from-amber-500/20 to-orange-500/10",
        subtitle: "Enterprise Inbox Intelligence",
        widgets: [
            { label: "Client Urgency", icon: TrendingUp, value: "Scored" },
            { label: "Fraud Detection", icon: ShieldAlert, value: "Active" },
            { label: "Meetings", icon: Clock, value: "Prioritized" },
        ],
    },
};

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [role, setRole] = useState("student");
    const [loading, setLoading] = useState(false);
    const [emails, setEmails] = useState<PulseEmail[]>([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<PulseEmail | null>(null);

    const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.student;
    const Icon = config.icon;

    const topHit = useMemo(
        () => emails.find((e) => e.analysis.score >= 80),
        [emails]
    );

    const stats = useMemo(() => {
        const scams = emails.filter((e) => e.analysis.category === "Scam").length;
        const high = emails.filter((e) => e.analysis.category === "High Priority").length;
        return { scams, high };
    }, [emails]);

    const displayedEmails = useMemo(() => emails.slice(0, visibleCount), [emails, visibleCount]);

    useEffect(() => {
        const savedRole = localStorage.getItem("gemini-pulse-role");
        if (savedRole && ROLE_CONFIG[savedRole]) {
            setRole(savedRole);
        }
    }, []);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    async function refresh() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/pulse?role=${role}`, { cache: "no-store" });
            if (res.status === 401) {
                setError("Session expired. Redirecting to sign in...");
                setTimeout(() => signOut({ callbackUrl: "/" }), 1500);
                return;
            }
            if (!res.ok) throw new Error(await res.text());
            const data = (await res.json()) as {
                emails: PulseEmail[];
                notify: PulseEmail[];
            };
            setEmails(data.emails ?? []);
            const first = (data.notify ?? [])[0] ?? null;
            if (first) setToast(first);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to fetch pulse.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (status === "authenticated") void refresh();
    }, [status, role]);

    function handleSwitchRole() {
        localStorage.removeItem("gemini-pulse-role");
        router.push("/");
    }

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950">
                <div className="animate-pulse text-zinc-500">Loading…</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-50">
            <div className="pointer-events-none absolute inset-0 opacity-40">
                <div
                    className="absolute left-[20%] top-[5%] h-[500px] w-[500px] rounded-full blur-[140px] animate-float"
                    style={{
                        background: `radial-gradient(circle, color-mix(in oklab, ${config.accent} 30%, transparent), transparent 70%)`,
                    }}
                />
            </div>

            <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSwitchRole}
                        className="glass flex h-10 w-10 items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
                        title="Switch role"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-3">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`glass-strong flex h-11 w-11 items-center justify-center rounded-2xl`}
                        >
                            <Icon className="h-5 w-5" style={{ color: config.accent }} />
                        </motion.div>
                        <div>
    <div className="text-xl font-extrabold tracking-widest text-zinc-900 dark:text-white">
        PRIION
    </div>
    <div className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
        Prioritise what matters
    </div>
</div>
                    </div>
                    <div className={`role-badge ${config.badgeClass}`}>
                        {config.emoji} {config.label}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    {session?.user?.name && (
                        <span className="text-sm text-zinc-400 hidden sm:block">
                            {session.user.name}
                        </span>
                    )}
                    <button
                        onClick={refresh}
                        className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
                        disabled={loading}
                    >
                        <RefreshCw
                            className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"}
                        />
                        Scan
                    </button>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Sign out</span>
                    </button>
                </div>
            </header>

            <main className="relative mx-auto w-full max-w-6xl px-6 pb-24">
                <div className="grid gap-4 sm:grid-cols-3 mb-6">
                    {config.widgets.map((w, i) => {
                        const WIcon = w.icon;
                        return (
                            <motion.div
                                key={w.label}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass rounded-2xl p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                                        style={{
                                            background: `color-mix(in oklab, ${config.accent} 12%, transparent)`,
                                        }}
                                    >
                                        <WIcon
                                            className="h-5 w-5"
                                            style={{ color: config.accent }}
                                        />
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-400 uppercase tracking-wider">
                                            {w.label}
                                        </div>
                                        <div className="text-sm font-semibold mt-0.5">{w.value}</div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {emails.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-6"
                    >
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-zinc-400" />
                            <span className="text-sm text-zinc-300">
                                <span className="font-semibold text-white">{emails.length}</span> emails
                                scanned
                            </span>
                        </div>
                        {stats.scams > 0 && (
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="h-4 w-4 text-red-400" />
                                <span className="text-sm text-red-300">
                                    <span className="font-semibold">{stats.scams}</span> scam
                                    {stats.scams > 1 ? "s" : ""} detected
                                </span>
                            </div>
                        )}
                        {stats.high > 0 && (
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-400" />
                                <span className="text-sm text-amber-300">
                                    <span className="font-semibold">{stats.high}</span> high
                                    priority
                                </span>
                            </div>
                        )}
                    </motion.div>
                )}

                <section className="glass rounded-3xl p-6 md:p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-2xl">
                            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                                Priority Sorter Dashboard
                            </h1>
                            <p className="mt-2 text-sm text-zinc-300/80">
                                Showing {displayedEmails.length} of {emails.length} unread messages — scored and summarized by Gemini.
                            </p>
                            {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
                        </div>

                        <div className="glass rounded-2xl p-4">
                            <div className="text-xs uppercase tracking-widest text-zinc-400">
                                Top signal
                            </div>
                            <div className="mt-2 flex items-center gap-3">
                                <div className="glass flex h-10 w-10 items-center justify-center rounded-2xl">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">
                                        {topHit
                                            ? `${topHit.analysis.score} • ${topHit.analysis.category}`
                                            : "—"}
                                    </div>
                                    <div className="text-xs text-zinc-300/70">
                                        {topHit
                                            ? topHit.analysis.summary
                                            : "Scan to find high priority email"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4">
                        {emails.length === 0 && !loading ? (
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300/80">
                                {status === "authenticated"
                                    ? "No unread emails found."
                                    : "Sign in to connect Gmail."}
                            </div>
                        ) : (
                            displayedEmails.map((e, i) => {
                                const glow =
                                    e.analysis.category === "Scam"
                                        ? "glow-scam"
                                        : e.analysis.category === "High Priority" || e.analysis.score >= 80
                                            ? "glow-high"
                                            : "";
                                
                                const scoreColor = e.analysis.score >= 80 
                                    ? "text-red-500 dark:text-red-400" 
                                    : e.analysis.score >= 50 
                                        ? "text-amber-500 dark:text-amber-400" 
                                        : "text-emerald-500 dark:text-emerald-400";

                                return (
                                    <motion.div
                                        key={e.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`glass rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden group ${glow}`}
                                    >
                                        {/* PERFECTLY SYMMETRIC ROW NO OVERFLOW */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                                            
                                            {/* LEFT: TEXT (Truncates instead of pushing out) */}
                                            <div className="min-w-0 flex-1 sm:pr-6 sm:border-r border-slate-200 dark:border-white/10">
                                                <div className="truncate text-base font-bold group-hover:text-[var(--primary)] transition-colors">{e.subject}</div>
                                                <div className="mt-1 truncate text-xs font-semibold text-zinc-500">{e.from}</div>
                                                <div className="mt-3 line-clamp-2 text-sm text-zinc-400 leading-relaxed">{e.snippet}</div>
                                            </div>
                                            
                                            {/* RIGHT: SCORE (Centered in a bounded column) */}
                                            <div className="flex shrink-0 flex-row sm:flex-col items-center justify-center gap-2 sm:w-[130px] pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-white/10">
                                                <div className={`text-4xl font-black tracking-tighter ${scoreColor}`}>{e.analysis.score}</div>
                                                <div className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">{e.analysis.category}</div>
                                            </div>

                                        </div>

                                        {/* AI FOOTER */}
                                        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10 flex items-start gap-2 text-xs font-medium text-zinc-400">
                                            <Sparkles className="mt-0.5 h-4 w-4 shrink-0" style={{ color: config.accent }} />
                                            <span className="leading-relaxed"><span className="font-bold text-zinc-900 dark:text-zinc-200">Gemini:</span> {e.analysis.summary}</span>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>

                    {/* Load More Button */}
                    {emails.length > visibleCount && (
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => setVisibleCount(prev => prev + 5)}
                                className="glass flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors"
                            >
                                <ChevronDown className="h-4 w-4" />
                                Load More Emails
                            </button>
                        </div>
                    )}
                </section>

                {emails.length > 0 && (
                    <div className="mt-8">
                        <AnalyticsPanel emails={emails} accent={config.accent} />
                    </div>
                )}

                <AnimatePresence>
                    {toast && (
                        <motion.div
                            initial={{ x: 420, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 420, opacity: 0 }}
                            className="fixed right-6 top-24 z-40 w-[340px]"
                        >
                            <div className={`glass rounded-2xl p-4 ${toast.analysis.category === "Scam" ? "glow-scam" : "glow-high"}`}>
                                <div className="flex items-start gap-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-semibold">{toast.analysis.category} • {toast.analysis.score}</div>
                                        <div className="mt-2 text-sm">{toast.analysis.summary}</div>
                                        <button onClick={() => setToast(null)} className="mt-3 text-xs text-zinc-300/70 hover:text-white">Dismiss</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <GeminiChat userRole={role} />
        </div>
    );
}