import Link from "next/link";

type Props = {
  searchParams?: { error?: string };
};

const ERROR_HINTS: Record<string, string> = {
  OAuthSignin:
    "Your Google OAuth config is missing/invalid. Most commonly: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set in .env.local, or redirect URI not added in Google Cloud Console.",
  OAuthCallback:
    "Callback failed. Check that NEXTAUTH_URL is http://localhost:3000 and the Google redirect URI is http://localhost:3000/api/auth/callback/google.",
  Configuration:
    "Server configuration error. Ensure .env.local has NEXTAUTH_SECRET and Google OAuth variables.",
};

export default function AuthErrorPage({ searchParams }: Props) {
  const code = searchParams?.error ?? "Unknown";
  const hint = ERROR_HINTS[code] ?? "Check your .env.local and server logs for details.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-50">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-16">
        <div className="glass rounded-3xl p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Sign-in error</h1>
          <p className="mt-2 text-sm text-zinc-200/80">
            Error code: <span className="font-mono">{code}</span>
          </p>
          <p className="mt-4 text-sm text-zinc-200/80">{hint}</p>

          <div className="mt-6 grid gap-2 text-sm text-zinc-200/80">
            <div className="font-semibold text-zinc-100">Quick checklist</div>
            <ul className="list-disc pl-5">
              <li>
                Create <span className="font-mono">.env.local</span> (same folder as{" "}
                <span className="font-mono">package.json</span>)
              </li>
              <li>
                Set <span className="font-mono">GOOGLE_CLIENT_ID</span> and{" "}
                <span className="font-mono">GOOGLE_CLIENT_SECRET</span>
              </li>
              <li>
                Set <span className="font-mono">NEXTAUTH_URL=http://localhost:3000</span>
              </li>
              <li>
                Generate <span className="font-mono">NEXTAUTH_SECRET</span> with{" "}
                <span className="font-mono">npx auth secret</span>
              </li>
              <li>
                In Google Console add redirect URI{" "}
                <span className="font-mono">
                  http://localhost:3000/api/auth/callback/google
                </span>
              </li>
              <li>Restart the dev server after editing env vars</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/api/auth/signin"
              className="glass rounded-full px-4 py-2 text-sm font-medium hover:bg-white/10"
            >
              Back to sign in
            </Link>
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-sm text-zinc-300 hover:text-white"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

