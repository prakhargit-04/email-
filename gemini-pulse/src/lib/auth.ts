import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name} in .env.local`);
  return v;
}

/**
 * Refresh an expired Google access token using the refresh token.
 */
async function refreshAccessToken(token: {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: number;
  [key: string]: unknown;
}) {
  try {
    const url = "https://oauth2.googleapis.com/token";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: requiredEnv("GOOGLE_CLIENT_ID"),
        client_secret: requiredEnv("GOOGLE_CLIENT_SECRET"),
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshed = await response.json();

    if (!response.ok) {
      console.error("Token refresh failed:", refreshed);
      throw new Error(refreshed.error || "Failed to refresh access token");
    }

    console.log("Access token refreshed successfully.");

    return {
      ...token,
      accessToken: refreshed.access_token,
      accessTokenExpiresAt: Date.now() + refreshed.expires_in * 1000,
      // Google may or may not return a new refresh token
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    error: "/auth-error",
  },
  providers: [
    Google({
      clientId: requiredEnv("GOOGLE_CLIENT_ID"),
      clientSecret: requiredEnv("GOOGLE_CLIENT_SECRET"),
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/gmail.readonly",
          ].join(" "),
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      // On initial sign-in, save tokens from the account
      if (account) {
        console.log("Initial sign-in — storing tokens.");
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpiresAt: account.expires_at
            ? account.expires_at * 1000
            : Date.now() + 3600 * 1000,
        };
      }

      // If token hasn't expired yet, return it as-is
      const expiresAt = (token.accessTokenExpiresAt as number) ?? 0;
      if (Date.now() < expiresAt - 60_000) {
        // 60s buffer
        return token;
      }

      // Token has expired — attempt refresh
      console.log("Access token expired, refreshing...");
      return await refreshAccessToken(token as Parameters<typeof refreshAccessToken>[0]);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.accessTokenExpiresAt = token.accessTokenExpiresAt as
        | number
        | undefined;
      // Pass refresh error to the client so it can prompt re-login
      if ((token as { error?: string }).error) {
        (session as unknown as Record<string, unknown>).error = (token as { error?: string }).error;
      }
      return session;
    },
  },
};
