<div align="center">

<br />

```
██████╗ ██████╗ ██╗██╗ ██████╗ ███╗   ██╗
██╔══██╗██╔══██╗██║██║██╔═══██╗████╗  ██║
██████╔╝██████╔╝██║██║██║   ██║██╔██╗ ██║
██╔═══╝ ██╔══██╗██║██║██║   ██║██║╚██╗██║
██║     ██║  ██║██║██║╚██████╔╝██║ ╚████║
╚═╝     ╚═╝  ╚═╝╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝
```

### **AI-Powered Inbox Intelligence**
#### *121 emails a day. You shouldn't have to read them all.*

<br />

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gemini 2.5 Flash](https://img.shields.io/badge/Gemini_2.5_Flash-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-latest-ff69b4?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

<br />

[![Live Demo](https://img.shields.io/badge/▶_Live_Demo-email--4m6b.vercel.app-6366f1?style=for-the-badge)](https://email-git-main-prakhargit-04s-projects.vercel.app/)

<br />

> **PRIION** connects to your Gmail, sends every email through Gemini 2.5 Flash,
> and returns a scored, ranked, scam-flagged inbox — in seconds.
> No storage. No snooping. Just signal over noise.

<br />

![PRIION Dashboard](https://placehold.co/960x500/0f172a/818cf8?text=PRIION+%E2%80%94+AI+Inbox+Dashboard)

</div>

---

## 📑 Table of Contents

- [Why PRIION?](#-why-priion)
- [Features at a Glance](#-features-at-a-glance)
- [Tech Stack](#-tech-stack)
- [How It Works](#-how-it-works)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone & Install](#1-clone--install)
  - [Google Cloud Setup](#2-google-cloud-setup)
  - [Environment Variables](#3-environment-variables)
  - [Run the App](#4-run-the-app)
- [Project Structure](#-project-structure)
- [Core Modules](#-core-modules)
- [Role-Based Intelligence](#-role-based-intelligence)
- [Scam & Phishing Detection](#-scam--phishing-detection)
- [Analytics Panel](#-analytics-panel)
- [Gemini Chat](#-gemini-chat)
- [Security & Privacy](#-security--privacy)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧠 Why PRIION?

The average professional receives **121 emails per day.** Most clients give every email equal weight — a cold sales pitch sits right next to an urgent message from your dean about financial aid. You do all the triage work yourself.

**PRIION flips this.** Before you open your inbox, Gemini 2.5 Flash has already:

- Read every email
- Scored it 0–100 for priority
- Classified it by category
- Flagged anything that looks like a scam
- Tailored all of the above to your specific role

You open PRIION and see what matters. Everything else is noise — handled.

---

## ✨ Features at a Glance

| # | Feature | Description |
|---|---|---|
| 1 | **Gmail Integration** | Pulls all inbox emails via OAuth 2.0 with `gmail.readonly` scope |
| 2 | **AI Importance Scoring** | Gemini 2.5 Flash scores each email 0–100 for priority |
| 3 | **Role-Based Prioritization** | Scoring algorithm adapts to Student / Teacher / Corporate profiles |
| 4 | **Scam & Phishing Detection** | Flags BEC fraud, spoofed domains, urgency manipulation with visual alerts |
| 5 | **Analytics Dashboard** | Recharts-powered pie + bar charts of your inbox health |
| 6 | **Gemini Chat** | Ask conversational questions about your inbox in natural language |
| 7 | **Dark / Light Mode** | Glassmorphism UI with animated theme transitions via Framer Motion |
| 8 | **Zero Data Storage** | All analysis is real-time; no emails ever touch a database |
| 9 | **Turbopack Dev Server** | Next.js 16 with instant hot reload for a fast development loop |
| 10 | **TypeScript Throughout** | Full type safety across routes, components, and API integrations |

---

## 🖥️ Tech Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│                          PRIION STACK                               │
├──────────────────────┬──────────────────────────────────────────────┤
│  Framework           │  Next.js 16  (App Router + Turbopack)        │
│  Language            │  TypeScript 5                                │
│  Styling             │  Tailwind CSS 4 + Custom Glassmorphism CSS   │
│  AI Engine           │  Google Gemini 2.5 Flash                     │
│  Auth                │  NextAuth.js v4  (Google OAuth 2.0)          │
│  Email API           │  Gmail API  via googleapis                   │
│  Animations          │  Framer Motion                               │
│  Charts              │  Recharts                                    │
│  Icons               │  Lucide React                                │
│  Deployment          │  Vercel                                      │
└──────────────────────┴──────────────────────────────────────────────┘
```

---

## ⚙️ How It Works

```
  ┌─────────────┐     OAuth 2.0      ┌──────────────────┐
  │    User     │ ────────────────▶  │   Google Auth    │
  │  (Browser)  │ ◀────────────────  │  (gmail.readonly) │
  └─────────────┘    Session token   └──────────────────┘
         │
         │  POST /api/pulse  { role }
         ▼
  ┌─────────────────────────────────────────────────────┐
  │               Next.js API Route                     │
  │                                                     │
  │  1. gmail.ts   →  fetch inbox via Gmail API         │
  │  2. gemini.ts  →  send each email to Gemini 2.5     │
  │                   Flash with a role-aware prompt    │
  │  3. Parse AI response:                              │
  │       • importanceScore  (0–100)                    │
  │       • category label                              │
  │       • isScam flag + reasoning                     │
  │       • summary                                     │
  │  4. Return scored ScoredEmail[] to client           │
  └─────────────────────────────────────────────────────┘
         │
         ▼
  ┌─────────────────────────────────────────────────────┐
  │               Dashboard  (Client)                   │
  │                                                     │
  │  • Email feed sorted by importanceScore desc        │
  │  • Scam cards: pulsing red glow + SCAM badge        │
  │  • AnalyticsPanel: priority pie + category bar      │
  │  • GeminiChat: natural-language inbox Q&A           │
  └─────────────────────────────────────────────────────┘
```

> **Nothing is persisted.** Emails are fetched, analyzed in memory, and streamed to the client. The server never writes email data to disk or a database.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and **npm**
- A **Google Cloud Console** project
- A **Gemini API Key** — free at [Google AI Studio](https://aistudio.google.com/apikey)

---

### 1. Clone & Install

```bash
git clone https://github.com/prakhargit-04/email-.git
cd email-/gemini-pulse
npm install
```

---

### 2. Google Cloud Setup

**Step 1 — Create a project**
Go to [Google Cloud Console](https://console.cloud.google.com/) → New Project.

**Step 2 — Enable the Gmail API**
`APIs & Services` → `Library` → search **Gmail API** → Enable.

**Step 3 — Create OAuth 2.0 credentials**
`APIs & Services` → `Credentials` → `+ Create Credentials` → `OAuth client ID`
- Application type: **Web application**
- Authorized redirect URI:
  ```
  http://localhost:3000/api/auth/callback/google
  ```
  Add your production URL too when deploying to Vercel.

**Step 4 — Configure OAuth consent screen**
Add the scope: `https://www.googleapis.com/auth/gmail.readonly`

---

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# ── NextAuth ───────────────────────────────────────────────────────
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""           # Generate: openssl rand -base64 32

# ── Google OAuth ───────────────────────────────────────────────────
# Source: Google Cloud Console → APIs & Services → Credentials
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# ── Gemini API ─────────────────────────────────────────────────────
# Source: https://aistudio.google.com/apikey
GEMINI_API_KEY="your-gemini-api-key"
```

> ⚠️ `.env.local` is gitignored by default — never commit real secrets.

---

### 4. Run the App

**Development**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) → pick your role → sign in with Google → PRIION analyzes your inbox.

**Production build**
```bash
npm run build
npm start
```

**Type check**
```bash
npx tsc --noEmit
```

---

## 📁 Project Structure

```
gemini-pulse/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts        ← NextAuth catch-all handler
│   │   │   ├── chat/
│   │   │   │   └── route.ts            ← POST: Gemini conversational chat
│   │   │   └── pulse/
│   │   │       └── route.ts            ← POST: Gmail fetch + AI scoring pipeline
│   │   │
│   │   ├── dashboard/
│   │   │   ├── page.tsx                ← Main dashboard — scored email feed
│   │   │   ├── AnalyticsPanel.tsx      ← Recharts charts (pie + bar)
│   │   │   ├── GeminiChat.tsx          ← Conversational AI sidebar
│   │   │   └── ThemeToggle.tsx         ← Dark/light mode switch
│   │   │
│   │   ├── auth-error/
│   │   │   └── page.tsx                ← OAuth error fallback page
│   │   │
│   │   ├── globals.css                 ← Design system: glassmorphism, glows, keyframes
│   │   ├── layout.tsx                  ← Root layout, fonts, global metadata
│   │   ├── page.tsx                    ← Landing page: role selection
│   │   └── providers.tsx               ← NextAuth <SessionProvider> wrapper
│   │
│   ├── lib/
│   │   ├── auth.ts                     ← NextAuth config: Google provider, callbacks
│   │   ├── gemini.ts                   ← Gemini AI: role-aware prompts, score parser
│   │   └── gmail.ts                    ← Gmail API: auth, inbox fetch, body decode
│   │
│   └── types/
│       └── index.ts                    ← Shared types: ScoredEmail, Role, etc.
│
├── .env.example
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔬 Core Modules

### 📧 Gmail Integration — `src/lib/gmail.ts`

Handles all Gmail API communication:

- Authenticates using the user's OAuth access token from NextAuth
- Fetches inbox message IDs and retrieves full message payloads
- Decodes base64-encoded email bodies (plain text + HTML)
- Extracts headers: `From`, `To`, `Subject`, `Date`
- Returns a clean `ParsedEmail[]` array ready for AI analysis

### 🤖 Gemini AI Analysis — `src/lib/gemini.ts`

The core intelligence layer:

- Initializes `@google/generative-ai` with `gemini-2.5-flash`
- Builds **role-aware system prompts** — different instructions for Student, Teacher, and Corporate
- Sends each email's subject + sender + body snippet to Gemini
- Parses structured JSON from the response:

```ts
interface ScoredEmail {
  id: string;
  from: string;
  subject: string;
  date: string;
  importanceScore: number;   // 0–100
  category: string;          // "Work" | "Finance" | "Social" | ...
  isScam: boolean;
  scamReason?: string;       // AI reasoning when isScam is true
  summary: string;           // 1–2 sentence digest
}
```

### 🛣️ API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth OAuth flow + session management |
| `/api/pulse` | POST | Fetches Gmail + runs Gemini scoring pipeline |
| `/api/chat` | POST | Sends inbox context + question to Gemini, returns answer |

### 📊 Dashboard — `src/app/dashboard/page.tsx`

- Calls `/api/pulse` on mount with the user's role
- Renders `ScoredEmail` cards sorted by `importanceScore` descending
- Scam cards get a distinct treatment: pulsing red border, SCAM badge, AI reasoning shown inline
- Passes email data to `<AnalyticsPanel />` and `<GeminiChat />`
- `<ThemeToggle />` switches dark/light mode with a Framer Motion animation

---

## 🎓 Role-Based Intelligence

PRIION's scoring adapts to the role you select at login. Gemini receives a different system prompt for each:

### 🎒 Student
Gemini prioritizes: scholarship and financial aid notices, assignment deadlines, messages from professors or advisors, campus emergency and housing alerts.

Deprioritized: promotional newsletters, social event invites, unrelated cold outreach.

### 📚 Teacher
Gemini prioritizes: parent/guardian communications, admin memos with action items, grade submission deadlines, HR and payroll notices.

Deprioritized: vendor pitches, unrelated subscriptions.

### 💼 Corporate
Gemini prioritizes: client emails with urgency signals, meeting invitations, contract and invoice emails, internal escalations, and **BEC (Business Email Compromise) fraud patterns** — impersonation attempts, wire transfer requests, spoofed executive domains.

---

## 🛡️ Scam & Phishing Detection

When Gemini flags a suspicious email, PRIION responds visually and informatively:

```
┌─────────────────────────────────────────────────────────┐  ← Pulsing red glow
│  🔴  SCAM ALERT                                         │
│                                                         │
│  From: accounts@paypa1-secure.net                       │
│  Subject: Urgent: Verify your account now               │
│                                                         │
│  ⚠ AI Reasoning:                                        │
│  Domain "paypa1-secure.net" mimics PayPal using a       │
│  lookalike numeral. Creates artificial urgency and       │
│  requests credential verification — classic phishing.   │
└─────────────────────────────────────────────────────────┘
```

Gemini looks for: domain spoofing with lookalike characters, urgency manipulation ("act now", "account suspended"), unexpected wire transfer requests, and credential harvesting patterns.

---

## 📊 Analytics Panel

The `<AnalyticsPanel />` gives you a bird's-eye view of your inbox:

```
  Priority Distribution             Email Categories
  ─────────────────────────         ───────────────────────────────────
      High  ██████  42%             Work        ████████████  60
    Medium  ████    31%             Finance     █████         25
       Low  ███     27%             Social      ███           15
                                   Promotions  ██            10
```

Built with **Recharts** — responsive, animated, and theme-aware.

---

## 💬 Gemini Chat

The `<GeminiChat />` panel provides a conversational interface into your inbox. Your scored emails are injected as context, so Gemini can answer:

```
You → "What are my most urgent emails today?"
You → "Are there any emails about the Q3 deadline?"
You → "Summarize what my manager sent this week."
You → "Do I have anything suspicious I should flag to IT?"
You → "Which emails can I safely archive?"
```

Every message calls `/api/chat` with full email context. Nothing is retained between sessions.

---

## 🔐 Security & Privacy

| Principle | Implementation |
|---|---|
| **Zero email storage** | Emails are analyzed in-memory; never written to disk or database |
| **Minimal OAuth scope** | Only `gmail.readonly` — PRIION cannot send, delete, or modify email |
| **Server-side AI calls** | Gemini API key never leaves the server; never exposed to the browser |
| **Secret isolation** | All credentials live in `.env.local`, included in `.gitignore` |
| **Signed sessions** | NextAuth uses encrypted, signed JWTs — sessions cannot be forged |
| **No third-party tracking** | No analytics pixels, ad SDKs, or data brokers |

---

## 🤝 Contributing

Bug fixes, new features, and better Gemini prompt strategies are all welcome.

```bash
# 1. Fork the repo on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/email-.git
cd email-/gemini-pulse

# 3. Install dependencies
npm install

# 4. Create a feature branch
git checkout -b feat/your-feature-name

# 5. Make your changes, then verify types compile
npx tsc --noEmit

# 6. Commit with a conventional message
git commit -m "feat: add email thread grouping"

# 7. Push and open a Pull Request
git push origin feat/your-feature-name
```

**Commit conventions:**
`feat:` new feature · `fix:` bug fix · `docs:` documentation · `refactor:` cleanup · `chore:` tooling

---

## 📝 License

Released under the [MIT License](LICENSE). Free to use, fork, and build on.

---

<div align="center">

<br />

Built with ❤️ using **Next.js 16** · **Google Gemini 2.5 Flash** · **TypeScript**

<br />

[🌐 Live Demo](https://email-4m6b.vercel.app) &nbsp;·&nbsp; [🐛 Report a Bug](https://github.com/prakhargit-04/email-/issues/new?labels=bug) &nbsp;·&nbsp; [💡 Request a Feature](https://github.com/prakhargit-04/email-/issues/new?labels=enhancement)

<br />

⭐ **If PRIION saved you from inbox hell, a star goes a long way.** ⭐

<br />

</div>
