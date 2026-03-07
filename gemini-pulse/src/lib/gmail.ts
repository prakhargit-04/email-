import { google } from "googleapis";

export type GmailEmail = {
  id: string;
  threadId?: string;
  subject: string;
  from: string;
  snippet: string;
  internalDate?: string;
};

function getHeader(headers: { name?: string; value?: string }[], name: string) {
  const h = headers.find((x) => (x.name ?? "").toLowerCase() === name);
  return h?.value ?? "";
}

/**
 * Fetch emails from Gmail.
 * - query: Gmail search query (default: all inbox mail)
 * - maxResults: how many to fetch (default: 50)
 */
export async function fetchEmails(params: {
  accessToken: string;
  maxResults?: number;
  query?: string;
}): Promise<GmailEmail[]> {
  const { accessToken, maxResults = 50, query = "in:inbox" } = params;

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth });

  try {
    const list = await gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults,
    });

    const ids = (list.data.messages ?? []).map((m) => m.id).filter(Boolean) as string[];
    if (!ids.length) {
      console.log("No messages found in Gmail.");
      return [];
    }

    console.log(`Found ${ids.length} message IDs. Fetching metadata...`);

    // Fetch in batches of 10 to avoid overwhelming the API
    const batchSize = 10;
    const allMessages = [];
    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map((id) =>
          gmail.users.messages.get({
            userId: "me",
            id,
            format: "metadata",
            metadataHeaders: ["Subject", "From", "Date"],
          }),
        ),
      );
      allMessages.push(...results);
    }

    return allMessages.map((m) => {
      const headers = (m.data.payload?.headers ?? []) as { name?: string; value?: string }[];
      return {
        id: m.data.id ?? "",
        threadId: m.data.threadId ?? undefined,
        subject: getHeader(headers, "subject") || "(no subject)",
        from: getHeader(headers, "from") || "(unknown sender)",
        snippet: m.data.snippet ?? "",
        internalDate: m.data.internalDate ?? undefined,
      };
    });
  } catch (err) {
    console.error("Gmail API Error in fetchEmails:", err);
    throw err;
  }
}
