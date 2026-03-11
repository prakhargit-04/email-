"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Bot, User } from "lucide-react";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function GeminiChat({ userRole }: { userRole: string }) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: `Hey there! 👋 I'm your Gemini AI assistant, tuned for your **${userRole}** role. Ask me anything about your emails — summaries, scam checks, draft replies, or anything else!`,
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    async function handleSend() {
        const text = input.trim();
        if (!text || loading) return;
        setInput("");

        const userMsg: Message = { role: "user", content: text };
        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role: userRole,
                    messages: [...messages, userMsg].map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: res.statusText }));
                throw new Error(errorData.error || `Request failed (${res.status})`);
            }
            const data = await res.json();

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: data.reply },
            ]);
        } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : "Unknown error";
            console.error("GeminiChat error:", errMsg);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: `⚠️ Error: ${errMsg}. Please try again.`,
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    const roleColors: Record<string, string> = {
        student: "from-sky-500 to-cyan-500",
        teacher: "from-violet-500 to-purple-500",
        corporate: "from-amber-500 to-orange-500",
    };
    const gradientClass = roleColors[userRole] ?? roleColors.student;

    return (
        <>
            {/* Floating trigger button */}
            <AnimatePresence>
                {!open && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setOpen(true)}
                        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${gradientClass} shadow-lg shadow-black/40`}
                    >
                        <MessageCircle className="h-6 w-6 text-white" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/95 shadow-2xl shadow-black/60 backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div
                            className={`flex items-center justify-between bg-gradient-to-r ${gradientClass} px-5 py-4`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">Gemini Brain</div>
                                    <div className="text-[10px] font-medium text-white/70 uppercase tracking-wider">
                                        {userRole} Assistant
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {m.role === "assistant" && (
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 mt-1">
                                            <Bot className="h-4 w-4 text-zinc-400" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[75%] px-3.5 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "chat-bubble-user text-zinc-100" : "chat-bubble-ai text-zinc-300"
                                            }`}
                                    >
                                        {m.content}
                                    </div>
                                    {m.role === "user" && (
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 mt-1">
                                            <User className="h-4 w-4 text-zinc-400" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2 text-xs text-zinc-500"
                                >
                                    <Bot className="h-4 w-4" />
                                    <span className="animate-pulse">Gemini is thinking…</span>
                                </motion.div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="border-t border-white/5 p-3">
                            <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Ask Gemini anything…"
                                    className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
                                    disabled={loading}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={loading || !input.trim()}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${gradientClass} text-white disabled:opacity-30 transition-opacity`}
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
