import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

export const PrioritySortSchema = z.object({
  score: z.number().int().min(1).max(100),
  category: z.enum(["Scam", "High Priority", "Neutral", "Low"]),
  summary: z.string().max(140),
  reason: z.string().min(1),
});

export type PrioritySortResult = z.infer<typeof PrioritySortSchema>;

// ─── Role-Specific Prompt Blocks (Deeply Tuned) ───
const ROLE_PROMPTS: Record<string, string> = {
  student: `You are an expert email analyst for a UNIVERSITY STUDENT. You MUST score emails based on real academic impact.

CRITICAL SCORING RULES — follow exactly:
• Google Classroom notifications (new material, assignments, quizzes, announcements) → score 70-85, category "High Priority"
• Assignment deadlines, exam schedules, submission reminders → score 85-95, category "High Priority"
• Scholarship deadlines, financial aid updates, fee payment reminders → score 90-100, category "High Priority"
• Professor/TA direct emails, lab schedules, project updates → score 70-85, category "High Priority"
• Campus events, club updates, placement drives, hackathons → score 55-70, category "Neutral"
• Library notices, campus infrastructure updates → score 50-65, category "Neutral"
• University official announcements (holidays, closures, policy) → score 60-75, category "Neutral" or "High Priority" if time-sensitive
• Job scams, loan scams, "you've won" emails, fake internships, phishing → score 90-100, category "Scam"
• Marketing spam, promotional "Bootcamps", social media notifications, generic newsletters → score 10-25, category "Low"
• Generic automated notifications with no action needed → score 20-35, category "Low"

IMPORTANT: Promotional emails selling "Early Bird Registrations" for "Bootcamps", even if related to tech/DSA, are MARKETING SPAM and MUST be scored "Low" (10-25), NEVER "High Priority".
IMPORTANT: Academic content (new material, assignments, class updates) is NEVER "Low". It is at minimum "Neutral" (60+) and usually "High Priority" (70+).
IMPORTANT: When you see "Classroom" or "new material" or "assignment" or "quiz" or "deadline" in subject or sender, score it 70+ minimum.`,

  teacher: `You are an expert email analyst for a TEACHER/EDUCATOR. Score based on real educational workflow impact.

CRITICAL SCORING RULES — follow exactly:
• Parent/guardian communications about student welfare → score 85-95, category "High Priority"
• School admin memos, principal directives, policy changes → score 80-90, category "High Priority"
• IEP meetings, student conduct reports, special needs updates → score 85-95, category "High Priority"
• Grading deadlines, report card submissions, exam paper coordination → score 75-85, category "High Priority"
• Professional development, training workshops, certification renewals → score 60-75, category "Neutral"
• Department meetings, staff announcements → score 65-80, category "High Priority"
• Student assignment submissions via platforms (Google Classroom, etc.) → score 70-80, category "High Priority"
• Phishing via fake student/parent accounts, fake admin emails → score 90-100, category "Scam"
• EdTech vendor spam, marketing, old newsletters → score 10-25, category "Low"

IMPORTANT: Any email from parents, school admin, or about student welfare is ALWAYS "High Priority" (80+), never "Neutral".`,

  corporate: `You are an expert email analyst for a CORPORATE EMPLOYEE. Score based on real business impact.

CRITICAL SCORING RULES — follow exactly:
• Direct client emails, client escalations, SLA breaches → score 85-100, category "High Priority"
• CEO/executive/VP direct messages, board communications → score 90-100, category "High Priority"
• Compliance notices, legal documents, audit requests → score 85-95, category "High Priority"
• Project deadlines, sprint blockers, production incidents → score 80-95, category "High Priority"
• Meeting invites with key stakeholders, quarterly reviews → score 65-80, category "High Priority"
• Team standup updates, internal FYI threads → score 40-55, category "Neutral"
• Business Email Compromise (BEC), fake invoices, CEO fraud, wire transfer scams → score 95-100, category "Scam"
• Domain spoofing, credential phishing, fake IT support → score 90-100, category "Scam"
• HR newsletters, company social events, vendor cold outreach → score 10-25, category "Low"
• Automated build notifications, CI/CD alerts → score 35-50, category "Neutral" (unless failure: 70+)

IMPORTANT: Client emails and executive messages are ALWAYS 85+, never "Neutral". BEC attempts are ALWAYS "Scam" (95+).`,
};

// ─── Role-Specific Keyword Fallback Rules ───
type KeywordRule = { keywords: string[]; score: number; category: PrioritySortResult["category"]; reason: string };

const SHARED_RULES: KeywordRule[] = [
  // Scam (all roles)
  { keywords: ["you've won", "lottery", "claim your prize", "wire transfer", "urgent action required", "account suspended", "verify your account", "click here immediately", "password expired"], score: 92, category: "Scam", reason: "Contains common scam/phishing keywords." },
  // Low (all roles)
  { keywords: ["unsubscribe", "newsletter", "promotion", "sale", "discount", "marketing", "special offer", "early bird", "bootcamp registration"], score: 18, category: "Low", reason: "Marketing/promotional email — low priority." },
  { keywords: ["social media", "facebook", "instagram", "twitter", "linkedin notification"], score: 15, category: "Low", reason: "Social media notification — low priority." },
];

const ROLE_KEYWORD_RULES: Record<string, KeywordRule[]> = {
  student: [
    { keywords: ["assignment", "deadline", "submission", "quiz", "exam", "test", "graded", "due date", "marks", "grade"], score: 78, category: "High Priority", reason: "Contains academic deadline/grading keywords — important for your studies." },
    { keywords: ["new material", "new announcement", "classroom", "google classroom", "course update", "lecture", "posted"], score: 72, category: "High Priority", reason: "New academic material or classroom update — relevant for coursework." },
    { keywords: ["scholarship", "financial aid", "fee payment", "tuition", "enrollment", "registration"], score: 88, category: "High Priority", reason: "Financial/enrollment related — time-sensitive for students." },
    { keywords: ["professor", "faculty", "ta ", "teaching assistant", "advisor"], score: 70, category: "High Priority", reason: "Direct communication from faculty — likely important." },
    { keywords: ["library", "campus", "holiday", "closure", "infrastructure", "maintenance"], score: 62, category: "Neutral", reason: "University institutional notice — informational." },
    { keywords: ["placement", "internship", "career", "hackathon", "workshop", "seminar", "recruitment"], score: 68, category: "Neutral", reason: "Career/professional development opportunity." },
    { keywords: ["hostel", "mess", "transport", "bus", "sports", "gym"], score: 55, category: "Neutral", reason: "Campus services notice." },
  ],
  teacher: [
    { keywords: ["parent", "guardian", "mother", "father", "parent-teacher", "pta", "meeting with parent"], score: 88, category: "High Priority", reason: "Parent/guardian communication — top priority for educators." },
    { keywords: ["principal", "vice principal", "admin memo", "school administration", "policy change", "directive"], score: 85, category: "High Priority", reason: "School administration directive — requires immediate attention." },
    { keywords: ["iep", "special education", "student conduct", "disciplinary", "behavior report", "counselor"], score: 82, category: "High Priority", reason: "Student welfare/conduct issue — critical for educator responsibility." },
    { keywords: ["grading deadline", "report card", "grade submission", "exam paper", "evaluation", "assessment"], score: 78, category: "High Priority", reason: "Grading/assessment deadline — time-sensitive academic duty." },
    { keywords: ["department meeting", "staff meeting", "faculty council", "committee"], score: 72, category: "High Priority", reason: "Staff/department meeting — professional obligation." },
    { keywords: ["classroom", "google classroom", "new material", "assignment submitted", "student submission"], score: 70, category: "High Priority", reason: "Student academic activity — needs teacher review." },
    { keywords: ["professional development", "training", "certification", "workshop", "conference"], score: 62, category: "Neutral", reason: "Professional development opportunity." },
    { keywords: ["textbook", "curriculum", "syllabus", "course planning"], score: 65, category: "Neutral", reason: "Curriculum/teaching materials — planning relevant." },
  ],
  corporate: [
    { keywords: ["client", "customer", "account manager", "key account", "client escalation"], score: 88, category: "High Priority", reason: "Client communication — direct business impact." },
    { keywords: ["ceo", "cfo", "cto", "vp ", "vice president", "executive", "board", "c-suite", "director"], score: 90, category: "High Priority", reason: "Executive/leadership communication — top business priority." },
    { keywords: ["compliance", "legal", "audit", "regulatory", "gdpr", "sox", "data breach"], score: 85, category: "High Priority", reason: "Compliance/legal matter — mandatory attention." },
    { keywords: ["deadline", "milestone", "deliverable", "sprint", "release", "production", "outage", "incident", "p1", "critical"], score: 82, category: "High Priority", reason: "Project deadline or production issue — urgent." },
    { keywords: ["invoice", "payment", "purchase order", "contract", "proposal", "budget", "forecast"], score: 75, category: "High Priority", reason: "Financial document — business-critical." },
    { keywords: ["meeting invite", "calendar", "standup", "sync", "1:1", "one-on-one"], score: 65, category: "Neutral", reason: "Meeting coordination — scheduling priority." },
    { keywords: ["quarterly", "review", "performance", "kpi", "okr"], score: 70, category: "High Priority", reason: "Performance/business review — professionally important." },
    { keywords: ["team update", "fyi", "internal", "announcement", "all-hands"], score: 55, category: "Neutral", reason: "Internal team communication — informational." },
    { keywords: ["onboarding", "hr ", "human resources", "benefits", "payroll", "leave"], score: 60, category: "Neutral", reason: "HR/administrative matter." },
  ],
};

function smartFallback(subject: string, from: string, snippet: string, role: string): PrioritySortResult {
  const combined = `${subject} ${from} ${snippet}`.toLowerCase();

  const roleRules = ROLE_KEYWORD_RULES[role] ?? ROLE_KEYWORD_RULES.student;
  const allRules = [...roleRules, ...SHARED_RULES];

  for (const rule of allRules) {
    if (rule.keywords.some((kw) => combined.includes(kw))) {
      return {
        score: rule.score,
        category: rule.category,
        summary: subject.slice(0, 60) || "Email analyzed via smart keyword matching.",
        reason: rule.reason,
      };
    }
  }

  return {
    score: 60,
    category: "Neutral",
    summary: subject.slice(0, 60) || "Could not fully analyze this email.",
    reason: "AI unavailable — scored conservatively. May need manual review.",
  };
}

function extractJson(text: string) {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      const slice = cleaned.slice(start, end + 1);
      return JSON.parse(slice);
    }
    throw new Error("No JSON object found in Gemini response.");
  }
}

export async function classifyEmailWithGemini(params: {
  subject: string;
  from: string;
  snippet: string;
  userRole?: string;
}): Promise<PrioritySortResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY.");

  const genAI = new GoogleGenerativeAI(apiKey);

  // FIX: Use stable GA model
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const role = params.userRole ?? "student";
  const roleBlock = ROLE_PROMPTS[role] ?? ROLE_PROMPTS.student;

  const prompt = `
${roleBlock}

Your task — analyze THIS email and return a JSON score:
- Evaluate urgency and importance using the CRITICAL SCORING RULES above.
- Detect scams/phishing using known patterns.
- Think about what this email means for the user's daily life in their specific role.
- Output ONLY a valid JSON object (no markdown fences, no extra text):
  {"score": <1-100>, "category": "<Scam|High Priority|Neutral|Low>", "summary": "<max 20 words>", "reason": "<why this score>"}

Email to analyze:
From: ${params.from}
Subject: ${params.subject}
Snippet: ${params.snippet}
`.trim();

  try {
    const res = await model.generateContent(prompt);
    const text = res.response.text();
    const obj = extractJson(text);
    const parsed = PrioritySortSchema.safeParse(obj);

    if (!parsed.success) {
      throw new Error(`Gemini returned invalid JSON shape: ${parsed.error.message}`);
    }

    const words = parsed.data.summary.trim().split(/\s+/).filter(Boolean);
    if (words.length > 20) {
      parsed.data.summary = words.slice(0, 20).join(" ");
    }

    return parsed.data;
  } catch (error) {
    console.error("Gemini Classification Error:", error);
    return smartFallback(params.subject, params.from, params.snippet, role);
  }
}