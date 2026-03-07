"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { GraduationCap, BookOpen, Briefcase, Sparkles, Zap, Shield, Mail, AlertTriangle, ShieldAlert, TrendingUp } from "lucide-react";
import ThemeToggle from "./dashboard/ThemeToggle";

const ROLES = [
  {
    id: "student",
    label: "Student",
    icon: GraduationCap,
    emoji: "🎓",
    accent: "var(--student-accent)",
    glowClass: "glow-student",
    badgeClass: "role-badge-student",
    gradient: "from-sky-400/20 via-cyan-400/10 to-blue-500/20",
    border: "border-sky-400/30",
    description: "Smart inbox for campus life",
    features: ["Scholarship alerts", "Assignment deadlines", "Scam protection"],
    idLabel: "Student ID",
    idFormat: "STU-2026-XXXX",
  },
  {
    id: "teacher",
    label: "Teacher",
    icon: BookOpen,
    emoji: "📚",
    accent: "var(--teacher-accent)",
    glowClass: "glow-teacher",
    badgeClass: "role-badge-teacher",
    gradient: "from-violet-400/20 via-purple-400/10 to-fuchsia-500/20",
    border: "border-violet-400/30",
    description: "Priority hub for educators",
    features: ["Parent comms first", "Admin notices", "Grade reminders"],
    idLabel: "Faculty ID",
    idFormat: "FAC-2026-XXXX",
  },
  {
    id: "corporate",
    label: "Corporate",
    icon: Briefcase,
    emoji: "💼",
    accent: "var(--corporate-accent)",
    glowClass: "glow-corporate",
    badgeClass: "role-badge-corporate",
    gradient: "from-amber-400/20 via-orange-400/10 to-yellow-500/20",
    border: "border-amber-400/30",
    description: "Enterprise inbox intelligence",
    features: ["Client urgency scoring", "BEC fraud detection", "Meeting priority"],
    idLabel: "Employee ID",
    idFormat: "EMP-2026-XXXX",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 },
  },
};

const MOCK_EMAILS = [
  {
    from: "Prof. Sarah Chen",
    subject: "Final Project Deadline Extended",
    score: 92,
    category: "High Priority" as const,
    color: "text-red-300",
    icon: AlertTriangle,
    accent: "bg-red-500/20",
    border: "border-red-500/30",
  },
  {
    from: "Scholarship Board",
    subject: "🎉 Congratulations! You've been selected",
    score: 88,
    category: "High Priority" as const,
    color: "text-amber-300",
    icon: TrendingUp,
    accent: "bg-amber-500/20",
    border: "border-amber-500/30",
  },
  {
    from: "noreply@prince-offer.cc",
    subject: "You've won $1,000,000! Click now",
    score: 15,
    category: "Scam" as const,
    color: "text-red-400",
    icon: ShieldAlert,
    accent: "bg-red-500/20",
    border: "border-red-500/40",
  },
  {
    from: "Campus Updates",
    subject: "Library hours changed this week",
    score: 35,
    category: "Low" as const,
    color: "text-emerald-300",
    icon: Mail,
    accent: "bg-emerald-500/20",
    border: "border-emerald-500/30",
  },
];

const notifVariants: Variants = {
  hidden: { opacity: 0, x: 60, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: 0.8 + i * 0.25,
      type: "spring" as const,
      stiffness: 180,
      damping: 18,
    },
  }),
};

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      const savedRole = localStorage.getItem("priion-role");
      if (savedRole) {
        router.push("/dashboard");
      }
    }
  }, [status, router]);

  function handleRoleSelect(roleId: string) {
    localStorage.setItem("priion-role", roleId);
    if (status === "authenticated") {
      router.push("/dashboard");
    } else {
      signIn("google", { callbackUrl: "/dashboard" });
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-50">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute left-[10%] top-[5%] h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-[120px] animate-float" />
        <div className="absolute right-[15%] top-[20%] h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[120px] animate-float-delay" />
        <div className="absolute bottom-[10%] left-[40%] h-[450px] w-[450px] rounded-full bg-amber-500/8 blur-[120px] animate-float-delay-2" />
      </div>

      {/* Floating grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Header */}
      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="glass-strong flex h-11 w-11 items-center justify-center rounded-2xl">
            <Sparkles className="h-5 w-5 text-sky-300" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight">Priion</div>
            <div className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
              AI-Powered Inbox Intelligence
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <ThemeToggle />
          <Zap className="h-3.5 w-3.5" />
          <span>Powered by Gemini 2.5 Flash</span>
        </div>
      </header>

      {/* Hero */}
      <main className="relative mx-auto w-full max-w-6xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 mb-6">
            <Shield className="h-3.5 w-3.5" />
            Smart email triage for every role
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Your inbox,{" "}
            <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-amber-400 bg-clip-text text-transparent animate-gradient">
              supercharged
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400 leading-relaxed">
            Gemini AI reads, scores, and prioritizes your emails based on{" "}
            <span className="text-zinc-200 font-medium">who you are</span>.
            Choose your role to begin.
          </p>
        </motion.div>

        {/* Role Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isHovered = hoveredRole === role.id;
            return (
              <motion.button
                key={role.id}
                variants={cardVariants}
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
                onClick={() => handleRoleSelect(role.id)}
                className={`group relative overflow-hidden rounded-3xl p-[1px] text-left transition-all duration-500 ${isHovered ? role.glowClass : ""
                  }`}
              >
                {/* Gradient border */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${role.gradient} opacity-60 transition-opacity duration-500 group-hover:opacity-100`} />

                {/* Card body */}
                <div className="relative rounded-3xl bg-zinc-950/80 p-6 backdrop-blur-xl h-full">
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 rounded-3xl shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Top row */}
                  <div className="relative flex items-center justify-between mb-6">
                    <motion.div
                      animate={isHovered ? { scale: 1.1, rotate: -5 } : { scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${role.gradient}`}
                      style={{ border: `1px solid color-mix(in oklab, ${role.accent} 30%, transparent)` }}
                    >
                      <Icon className="h-7 w-7" style={{ color: role.accent }} />
                    </motion.div>
                    <span className="text-3xl">{role.emoji}</span>
                  </div>

                  {/* Title */}
                  <div className="relative">
                    <h2 className="text-xl font-bold tracking-tight">{role.label}</h2>
                    <p className="mt-1 text-sm text-zinc-400">{role.description}</p>
                  </div>

                  {/* Features */}
                  <div className="relative mt-5 space-y-2">
                    {role.features.map((f, i) => (
                      <motion.div
                        key={f}
                        initial={false}
                        animate={isHovered ? { x: 0, opacity: 1 } : { x: -4, opacity: 0.6 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-2 text-sm text-zinc-300"
                      >
                        <div
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: role.accent }}
                        />
                        {f}
                      </motion.div>
                    ))}
                  </div>

                  {/* ID Badge preview */}
                  <div className="relative mt-6 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-zinc-500">{role.idLabel}</div>
                        <div className="mt-0.5 font-mono text-xs text-zinc-400">{role.idFormat}</div>
                      </div>
                      <div className={`role-badge ${role.badgeClass}`}>
                        {role.label}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <motion.div
                    className="relative mt-5 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors"
                    style={{
                      background: isHovered
                        ? `color-mix(in oklab, ${role.accent} 15%, transparent)`
                        : "color-mix(in oklab, white 5%, transparent)",
                      color: isHovered ? role.accent : "rgb(161 161 170)",
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    {status === "authenticated" ? "Enter Dashboard" : "Sign in with Google"}
                  </motion.div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Bottom tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center text-xs text-zinc-600"
        >
          🔒 Your data stays in your browser. Emails are analyzed in real-time, never stored.
        </motion.div>

        {/* Footer with Privacy & Terms */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 mb-8 flex items-center justify-center gap-6 text-xs text-zinc-500"
        >
          <a href="/privacy" className="hover:text-zinc-300 transition-colors">
            Privacy Policy
          </a>
          <span className="text-zinc-700">•</span>
          <a href="/terms" className="hover:text-zinc-300 transition-colors">
            Terms of Service
          </a>
          <span className="text-zinc-700">•</span>
          <a href="mailto:prakhargit04@gmail.com" className="hover:text-zinc-300 transition-colors">
            Contact
          </a>
        </motion.footer>
      </main>
    </div>
  );
}
