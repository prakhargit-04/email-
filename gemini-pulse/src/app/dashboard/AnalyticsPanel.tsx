"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import {
    Mail,
    ShieldAlert,
    AlertTriangle,
    CheckCircle,
    TrendingDown,
    BarChart3,
    PieChart as PieIcon,
    Users,
    Clock,
} from "lucide-react";

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

const CATEGORY_COLORS: Record<string, string> = {
    "Scam": "#ef4444",
    "High Priority": "#f59e0b",
    "Neutral": "#6366f1",
    "Low": "#22c55e",
};

const CATEGORY_ICONS: Record<string, typeof ShieldAlert> = {
    "Scam": ShieldAlert,
    "High Priority": AlertTriangle,
    "Neutral": CheckCircle,
    "Low": TrendingDown,
};

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass rounded-xl px-3 py-2 text-xs">
            <div className="font-semibold text-zinc-100 dark:text-zinc-100">{label || payload[0].name}</div>
            <div className="text-zinc-400">{payload[0].value}</div>
        </div>
    );
}

export default function AnalyticsPanel({
    emails,
    accent,
}: {
    emails: PulseEmail[];
    accent: string;
}) {
    const pieData = useMemo(() => {
        const counts: Record<string, number> = {};
        emails.forEach((e) => {
            counts[e.analysis.category] = (counts[e.analysis.category] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({
            name,
            value,
            color: CATEGORY_COLORS[name] || "#6b7280",
        }));
    }, [emails]);

    const barData = useMemo(() => {
        const buckets = [
            { range: "1-20", min: 1, max: 20, count: 0 },
            { range: "21-40", min: 21, max: 40, count: 0 },
            { range: "41-60", min: 41, max: 60, count: 0 },
            { range: "61-80", min: 61, max: 80, count: 0 },
            { range: "81-100", min: 81, max: 100, count: 0 },
        ];
        emails.forEach((e) => {
            const b = buckets.find((b) => e.analysis.score >= b.min && e.analysis.score <= b.max);
            if (b) b.count++;
        });
        return buckets.map((b) => ({ name: b.range, count: b.count }));
    }, [emails]);

    const topSenders = useMemo(() => {
        const senderMap: Record<string, { count: number; avgScore: number; totalScore: number }> = {};
        emails.forEach((e) => {
            const sender = e.from.replace(/<.*?>/, "").trim().slice(0, 30);
            if (!senderMap[sender]) senderMap[sender] = { count: 0, avgScore: 0, totalScore: 0 };
            senderMap[sender].count++;
            senderMap[sender].totalScore += e.analysis.score;
        });
        return Object.entries(senderMap)
            .map(([name, data]) => ({
                name,
                count: data.count,
                avgScore: Math.round(data.totalScore / data.count),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [emails]);

    const stats = useMemo(() => {
        const scams = emails.filter((e) => e.analysis.category === "Scam").length;
        const maxScore = emails.length ? Math.max(...emails.map((e) => e.analysis.score)) : 0;
        return { scams, maxScore, total: emails.length };
    }, [emails]);

    if (emails.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
        >
            <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: accent }} />
                <h2 className="text-lg font-bold tracking-tight">Inbox Analytics</h2>
            </div>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                {[
                    { label: "Total Emails", value: stats.total, icon: Mail, color: accent },
                    { label: "Highest Priority", value: stats.maxScore, icon: AlertTriangle, color: "#f59e0b" },
                    { label: "Scams Detected", value: stats.scams, icon: ShieldAlert, color: "#ef4444" },
                ].map((s, i) => {
                    const SIcon = s.icon;
                    return (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            className="glass rounded-2xl p-4"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <SIcon className="h-4 w-4" style={{ color: s.color }} />
                                <span className="text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-400">{s.label}</span>
                            </div>
                            <div className="text-2xl font-bold">{s.value}</div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="glass rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <PieIcon className="h-4 w-4" style={{ color: accent }} />
                        <span className="text-sm font-semibold">Category Breakdown</span>
                    </div>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<ChartTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 justify-center">
                        {pieData.map((entry) => {
                            const CIcon = CATEGORY_ICONS[entry.name] || CheckCircle;
                            return (
                                <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                                    <CIcon className="h-3 w-3" style={{ color: entry.color }} />
                                    <span className="text-zinc-300 dark:text-zinc-300">
                                        {entry.name}
                                    </span>
                                    <span className="font-semibold" style={{ color: entry.color }}>
                                        {entry.value}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="glass rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="h-4 w-4" style={{ color: accent }} />
                        <span className="text-sm font-semibold">Score Distribution</span>
                    </div>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} barCategoryGap="20%">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip content={<ChartTooltip />} />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                    {barData.map((entry, i) => {
                                        const colors = ["#22c55e", "#6366f1", "#a78bfa", "#f59e0b", "#ef4444"];
                                        return <Cell key={i} fill={colors[i]} />;
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2 text-center text-[10px] text-zinc-500 dark:text-zinc-500">
                        Priority Score Range →
                    </div>
                </div>
            </div>

            <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="h-4 w-4" style={{ color: accent }} />
                    <span className="text-sm font-semibold">Top Senders</span>
                    <span className="text-[10px] text-zinc-500 ml-auto">
                        <Clock className="h-3 w-3 inline mr-1" />
                        Based on last scan
                    </span>
                </div>
                <div className="space-y-2">
                    {topSenders.map((sender, i) => {
                        const barWidth = stats.total > 0 ? (sender.count / stats.total) * 100 : 0;
                        const scoreColor =
                            sender.avgScore >= 80 ? "#ef4444" : sender.avgScore >= 50 ? "#f59e0b" : "#22c55e";
                        return (
                            <motion.div
                                key={sender.name}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.05 }}
                                className="flex items-center gap-3"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-zinc-400">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="truncate text-sm text-zinc-200 dark:text-zinc-200">{sender.name}</div>
                                    <div className="mt-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${barWidth}%` }}
                                            transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                                            className="h-full rounded-full"
                                            style={{ background: accent }}
                                        />
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="text-xs text-zinc-400">{sender.count} email{sender.count > 1 ? "s" : ""}</div>
                                    <div className="text-xs font-semibold" style={{ color: scoreColor }}>
                                        avg {sender.avgScore}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}