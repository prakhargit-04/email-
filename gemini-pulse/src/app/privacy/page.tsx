"use client";

import Link from "next/link";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-200">
            <div className="max-w-3xl mx-auto px-6 py-16">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 mb-8 transition-colors"
                >
                    ← Back to Home
                </Link>

                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    Privacy Policy
                </h1>
                <p className="text-gray-400 mb-10 text-sm">
                    Last updated: March 7, 2026
                </p>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            1. Introduction
                        </h2>
                        <p>
                            Priion (&quot;we&quot;, &quot;our&quot;, or &quot;the App&quot;) is an AI-powered
                            email prioritization tool built by Prakhar Bhardwaj. This Privacy
                            Policy explains how we collect, use, and protect your information
                            when you use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            2. Information We Access
                        </h2>
                        <p className="mb-3">
                            When you sign in with Google, we request <strong>read-only</strong>{" "}
                            access to your Gmail inbox using the{" "}
                            <code className="bg-gray-800 px-1.5 py-0.5 rounded text-blue-300 text-sm">
                                gmail.readonly
                            </code>{" "}
                            scope. This allows us to:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Read email subject lines, senders, and body content</li>
                            <li>Analyze emails for priority scoring and scam detection</li>
                        </ul>
                        <p className="mt-3 font-semibold text-green-400">
                            ✅ We NEVER modify, delete, send, or compose emails on your behalf.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            3. How We Use Your Data
                        </h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>
                                <strong>Real-time analysis only:</strong> Your email content is
                                sent to the Google Gemini AI API for priority scoring and scam
                                detection. This happens in real-time during your session.
                            </li>
                            <li>
                                <strong>No storage:</strong> We do <strong>not</strong> store
                                your email content, subject lines, sender info, or any email
                                body text on our servers or in any database.
                            </li>
                            <li>
                                <strong>No sharing:</strong> We do <strong>not</strong> sell,
                                share, or transfer your email data to any third party beyond the
                                Google Gemini API for analysis.
                            </li>
                            <li>
                                <strong>Session-based:</strong> All data is processed in-memory
                                during your active session and discarded when you leave or sign
                                out.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            4. Third-Party Services
                        </h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>
                                <strong>Google OAuth 2.0:</strong> Used for secure
                                authentication. We only receive your email address and basic
                                profile info.
                            </li>
                            <li>
                                <strong>Gmail API:</strong> Used with{" "}
                                <code className="bg-gray-800 px-1.5 py-0.5 rounded text-blue-300 text-sm">
                                    gmail.readonly
                                </code>{" "}
                                scope to fetch your emails. No write access is requested.
                            </li>
                            <li>
                                <strong>Google Gemini AI:</strong> Email content is sent to
                                Gemini for AI-based priority analysis. Google&apos;s privacy policy
                                governs how Gemini handles this data.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            5. Data Retention
                        </h2>
                        <p>
                            We retain <strong>zero</strong> email data. No email content is
                            ever written to disk, stored in a database, or cached beyond your
                            active browser session. Your Google OAuth tokens are stored
                            securely in an encrypted session cookie and are deleted when you
                            sign out.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            6. Data Security
                        </h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>All communication is encrypted via HTTPS/TLS</li>
                            <li>OAuth tokens are stored in secure, HTTP-only session cookies</li>
                            <li>API keys and secrets are stored as server-side environment variables, never exposed to the client</li>
                            <li>No email data is persisted to any storage medium</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            7. Your Rights
                        </h2>
                        <p className="mb-3">You have the right to:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>
                                <strong>Revoke access</strong> at any time by visiting your{" "}
                                <a
                                    href="https://myaccount.google.com/permissions"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                >
                                    Google Account Permissions
                                </a>
                            </li>
                            <li>
                                <strong>Request deletion</strong> of any data (though we store
                                none)
                            </li>
                            <li>
                                <strong>Contact us</strong> with any privacy concerns
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            8. Children&apos;s Privacy
                        </h2>
                        <p>
                            Priion is not intended for use by children under 13. We do
                            not knowingly collect information from children under 13.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            9. Changes to This Policy
                        </h2>
                        <p>
                            We may update this Privacy Policy from time to time. Any changes
                            will be posted on this page with an updated revision date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            10. Contact Us
                        </h2>
                        <p>
                            If you have any questions about this Privacy Policy, please
                            contact us at:{" "}
                            <a
                                href="mailto:prakhargit04@gmail.com"
                                className="text-blue-400 hover:underline"
                            >
                                prakhargit04@gmail.com
                            </a>
                        </p>
                    </section>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} Priion. All rights reserved.
                </div>
            </div>
        </div>
    );
}
