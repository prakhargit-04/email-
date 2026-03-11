import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ROLE_SYSTEM: Record<string, string> = {
    student: `You are a helpful AI assistant for a university student. You specialize in:
- Analyzing email inboxes for academic importance (deadlines, scholarships, campus events)
- Detecting scams targeting students (job scams, loan scams, phishing)
- Helping draft professional academic emails
- Summarizing long email threads
Keep responses concise, friendly, and actionable.`,
    teacher: `You are a helpful AI assistant for a teacher/educator. You specialize in:
- Prioritizing parent communications and admin memos
- Flagging important institutional notices and policy changes
- Helping draft professional replies to parents and administrators
- Summarizing student-related correspondence
Keep responses professional, warm, and efficient.`,
    corporate: `You are a helpful AI assistant for a corporate professional. You specialize in:
- Scoring client email urgency and detecting business email compromise (BEC) fraud
- Prioritizing meeting invites, compliance notices, and internal comms
- Helping draft executive-level email responses
- Analyzing email patterns for efficiency improvements
Keep responses concise, professional, and results-oriented.`,
};

const MAX_RETRIES = 2;

async function callGeminiWithRetry(
    apiKey: string,
    role: string,
    messages: { role: string; content: string }[]
): Promise<string> {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const systemPrompt = ROLE_SYSTEM[role] ?? ROLE_SYSTEM.student;

    const conversationParts = messages.map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
        history: [
            { role: "user", parts: [{ text: `System: ${systemPrompt}` }] },
            { role: "model", parts: [{ text: "Understood! I'm ready to help. What can I do for you?" }] },
            ...conversationParts.slice(0, -1),
        ],
    });

    const lastMessage = messages[messages.length - 1];

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const result = await chat.sendMessage(lastMessage.content);
            return result.response.text();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            const is429 = msg.includes("429") || msg.includes("Too Many Requests");
            const isDailyQuota = msg.includes("limit: 0") || msg.includes("PerDay");

            // If daily quota is exhausted, don't retry — it won't help
            if (is429 && isDailyQuota) {
                throw new Error("QUOTA_EXHAUSTED");
            }

            // For per-minute rate limits, retry after a delay
            if (is429 && attempt < MAX_RETRIES) {
                const delay = (attempt + 1) * 3000; // 3s, 6s
                await new Promise((r) => setTimeout(r, delay));
                continue;
            }

            throw err;
        }
    }

    throw new Error("Max retries exceeded");
}

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "API key not configured. Please add GEMINI_API_KEY to Vercel environment variables and redeploy." },
                { status: 500 }
            );
        }

        const body = await req.json();
        const role = (body.role as string) ?? "student";
        const messages = (body.messages as { role: string; content: string }[]) ?? [];

        if (!messages.length) {
            return NextResponse.json({ error: "No messages provided" }, { status: 400 });
        }

        const reply = await callGeminiWithRetry(apiKey, role, messages);
        return NextResponse.json({ reply });
    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error("Chat API Error:", errMsg);

        // Return user-friendly messages
        if (errMsg === "QUOTA_EXHAUSTED") {
            return NextResponse.json(
                { error: "Daily API quota exhausted. Your free-tier Gemini API limit has been reached. Please try again tomorrow, or create a new API key from a NEW Google Cloud project at aistudio.google.com/apikey and update it in Vercel." },
                { status: 429 }
            );
        }

        if (errMsg.includes("429")) {
            return NextResponse.json(
                { error: "Rate limited — too many requests. Please wait a minute and try again." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: `Something went wrong: ${errMsg.slice(0, 200)}` },
            { status: 500 }
        );
    }
}
