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

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Chat API Error: GEMINI_API_KEY is not set");
            return NextResponse.json({ error: "Missing GEMINI_API_KEY — please add it to your environment variables." }, { status: 500 });
        }

        const body = await req.json();
        const role = (body.role as string) ?? "student";
        const messages = (body.messages as { role: string; content: string }[]) ?? [];

        if (!messages.length) {
            return NextResponse.json({ error: "No messages provided" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const systemPrompt = ROLE_SYSTEM[role] ?? ROLE_SYSTEM.student;

        // Build conversation history for Gemini
        const conversationParts = messages.map((m) => ({
            role: m.role === "user" ? "user" as const : "model" as const,
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
        const result = await chat.sendMessage(lastMessage.content);
        const reply = result.response.text();

        return NextResponse.json({ reply });
    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error("Chat API Error:", errMsg);
        return NextResponse.json(
            { error: `Gemini chat failed: ${errMsg}` },
            { status: 500 }
        );
    }
}
