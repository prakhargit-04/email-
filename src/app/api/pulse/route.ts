import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { fetchEmails } from "@/lib/gmail";
import { classifyEmailWithGemini } from "@/lib/gemini";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Check for refresh token error — tell client to re-login
  if ((session as unknown as Record<string, unknown>)?.error === "RefreshAccessTokenError") {
    return NextResponse.json(
      { error: "Session expired. Please sign out and sign back in." },
      { status: 401 }
    );
  }

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "Not signed in. Please sign in with Google first." },
      { status: 401 }
    );
  }

  // Read role and count from query params
  const role = req.nextUrl.searchParams.get("role") ?? "student";
  const count = Math.min(
    parseInt(req.nextUrl.searchParams.get("count") ?? "50", 10) || 50,
    100 // hard cap at 100
  );

  console.log("Fetching emails for role:", role, "count:", count);
  console.log("Access token present:", !!session.accessToken);

  let emails;
  try {
    emails = await fetchEmails({
      accessToken: session.accessToken,
      maxResults: count,
      query: "in:inbox",
    });
    console.log(`Fetched ${emails.length} emails successfully.`);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("Error in fetchEmails:", errMsg);

    // If it's an auth error, tell the user to re-login
    if (errMsg.includes("invalid authentication") || errMsg.includes("401") || errMsg.includes("Invalid Credentials")) {
      return NextResponse.json(
        { error: "Gmail authentication expired. Please sign out and sign back in to refresh your token." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch emails from Gmail.", details: errMsg },
      { status: 500 }
    );
  }

  // ─── ANTI-RATE-LIMIT CHUNKING SYSTEM ───
  // Process emails in small batches to avoid 429 Too Many Requests
  const CHUNK_SIZE = 5; 
  const DELAY_MS = 1000; // 1-second pause between chunks
  const scored = [];

  for (let i = 0; i < emails.length; i += CHUNK_SIZE) {
    const chunk = emails.slice(i, i + CHUNK_SIZE);
    
    // Process current chunk concurrently
    const chunkResults = await Promise.all(
      chunk.map(async (e) => {
        try {
          const analysis = await classifyEmailWithGemini({
            subject: e.subject,
            from: e.from,
            snippet: e.snippet,
            userRole: role,
          });
          return { ...e, analysis };
        } catch (err) {
          return {
            ...e,
            analysis: {
              score: 60,
              category: "Neutral" as const,
              summary: e.subject.slice(0, 60) || "Could not analyze.",
              reason: err instanceof Error ? err.message : "Unknown Gemini error.",
            },
          };
        }
      })
    );

    scored.push(...chunkResults);

    // If there are more chunks to process, wait before firing the next batch
    if (i + CHUNK_SIZE < emails.length) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
  }

  // Sort from HIGHEST priority to LOWEST
  scored.sort((a, b) => b.analysis.score - a.analysis.score);

  return NextResponse.json({
    count: scored.length,
    emails: scored,
    notify: scored.filter((x) => x.analysis.score >= 80).slice(0, 3),
  });
}