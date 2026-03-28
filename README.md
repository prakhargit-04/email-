<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/Gemini_2.5_Flash-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

# ✨ PRIION— AI-Powered Inbox Intelligence

> **Smart email triage for Students, Teachers, and Corporate professionals.** Gemini Pulse connects to your Gmail, reads and scores every email using Google's Gemini 2.5 Flash AI, and surfaces what matters most — based on *who you are*.

---

## 🎯 What It Does

PRIION is an AI-powered email dashboard that:

- 📬 **Fetches all emails** from your Gmail inbox via Google OAuth
- 🤖 **Analyzes each email** with Gemini 2.5 Flash AI for importance scoring
- 🎓 **Role-based prioritization** — different scoring for Students, Teachers, and Corporate users
- 🛡️ **Scam & phishing detection** — flags suspicious emails with visual warnings
- 📊 **Analytics panel** — visual breakdown of email categories and priority distribution
- 💬 **Gemini Chat** — ask AI questions about your emails in a conversational interface
- 🌗 **Dark / Light mode** — gorgeous glassmorphism UI with smooth theme transitions

---

## 🖥️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + Custom Glassmorphism CSS |
| **AI Engine** | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| **Auth** | NextAuth.js v4 (Google OAuth 2.0) |
| **Email API** | Gmail API via `googleapis` |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Icons** | Lucide React |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- A **Google Cloud Console** project with:
  - OAuth 2.0 credentials (Client ID + Secret)
  - Gmail API enabled
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/prakhargit-04/email-.git
cd email-
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# Google OAuth (Google Cloud Console → Credentials)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Gemini API Key (https://aistudio.google.com/apikey)
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — select your role, sign in with Google, and let Gemini analyze your inbox!

### 5. Production Build

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
gemini-pulse/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/        # NextAuth API route
│   │   │   ├── chat/        # Gemini chat API endpoint
│   │   │   └── pulse/       # Email fetch & AI analysis endpoint
│   │   ├── dashboard/
│   │   │   ├── page.tsx           # Main dashboard with email feed
│   │   │   ├── AnalyticsPanel.tsx # Charts & category breakdown
│   │   │   ├── GeminiChat.tsx     # Conversational AI panel
│   │   │   └── ThemeToggle.tsx    # Dark/light mode toggle
│   │   ├── auth-error/      # OAuth error handling page
│   │   ├── globals.css      # Design system (glassmorphism, glows, animations)
│   │   ├── layout.tsx       # Root layout with fonts & metadata
│   │   ├── page.tsx         # Landing page with role selection
│   │   └── providers.tsx    # NextAuth session provider
│   ├── lib/
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── gemini.ts        # Gemini AI analysis logic
│   │   └── gmail.ts         # Gmail API integration
│   └── types/               # TypeScript type definitions
├── .env.example             # Environment variable template
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🎨 Features in Detail

### 🎓 Role-Based Scoring
Each role has a tailored scoring algorithm:
- **Student** — Prioritizes scholarships, assignments, deadlines, and campus alerts
- **Teacher** — Surfaces parent communications, admin notices, and grade deadlines
- **Corporate** — Highlights client urgency, meeting invites, and BEC fraud detection

### 🛡️ Scam Detection
Emails flagged as potentially fraudulent get:
- A red pulsing glow effect
- A "SCAM ALERT" badge
- Detailed AI reasoning on why it's suspicious

### 📊 Analytics Dashboard
- Priority distribution pie chart
- Category breakdown bar chart
- Real-time scoring statistics
- Role-specific insight cards

### 💬 Gemini Chat
Ask questions like:
- *"What are my most urgent emails today?"*
- *"Summarize the email from my professor"*
- *"Are there any suspicious emails I should watch out for?"*

---

## 🔐 Security & Privacy

- **No emails are stored** — all analysis happens in real-time
- **OAuth 2.0** — secure Google sign-in with scoped Gmail read access
- **Server-side AI** — Gemini API calls happen on the server, never exposing your API key
- **Environment variables** — all secrets are kept in `.env.local` (gitignored)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using <strong>Next.js</strong> + <strong>Gemini AI</strong>
</p>
