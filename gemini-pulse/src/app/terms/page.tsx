"use client";

import Link from "next/link";

export default function TermsOfService() {
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
                    Terms of Service
                </h1>
                <p className="text-gray-400 mb-10 text-sm">
                    Last updated: March 7, 2026
                </p>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By accessing or using Priion (&quot;the App&quot;), you agree to be
                            bound by these Terms of Service. If you do not agree to these
                            terms, please do not use the App.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            2. Description of Service
                        </h2>
                        <p>
                            Priion is a free, AI-powered email prioritization and scam
                            detection tool. It connects to your Gmail account via Google OAuth
                            2.0 with read-only access, analyzes your emails using Google
                            Gemini AI, and provides priority scores and safety insights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            3. Google API Usage
                        </h2>
                        <p className="mb-3">
                            Priion&apos;s use and transfer of information received from
                            Google APIs adheres to the{" "}
                            <a
                                href="https://developers.google.com/terms/api-services-user-data-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                            >
                                Google API Services User Data Policy
                            </a>
                            , including the Limited Use requirements.
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>
                                We only request the{" "}
                                <code className="bg-gray-800 px-1.5 py-0.5 rounded text-blue-300 text-sm">
                                    gmail.readonly
                                </code>{" "}
                                scope — we cannot modify, send, or delete your emails.
                            </li>
                            <li>
                                Email data is used exclusively for AI-based priority analysis
                                and scam detection.
                            </li>
                            <li>
                                No email data is stored, cached, or shared with third parties
                                beyond what is necessary for AI analysis.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            4. User Accounts
                        </h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>
                                You must sign in using a valid Google account to use the App.
                            </li>
                            <li>
                                You are responsible for maintaining the security of your Google
                                account.
                            </li>
                            <li>
                                You may revoke the App&apos;s access at any time from your{" "}
                                <a
                                    href="https://myaccount.google.com/permissions"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                >
                                    Google Account Permissions
                                </a>
                                .
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            5. Acceptable Use
                        </h2>
                        <p className="mb-3">You agree NOT to:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Use the App for any unlawful purpose</li>
                            <li>Attempt to reverse-engineer or exploit the App</li>
                            <li>Use automated tools to scrape or abuse the App</li>
                            <li>
                                Interfere with or disrupt the App&apos;s infrastructure
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            6. AI Analysis Disclaimer
                        </h2>
                        <p>
                            The AI-powered priority scores and scam detection results are
                            provided for <strong>informational purposes only</strong>. Gemini
                            Pulse does not guarantee the accuracy of its analysis. You should
                            exercise your own judgment when acting on email priority
                            suggestions or scam warnings. We are not responsible for any
                            actions taken based on the App&apos;s analysis.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            7. Limitation of Liability
                        </h2>
                        <p>
                            Priion is provided &quot;as is&quot; without warranties of any kind.
                            To the fullest extent permitted by law, we disclaim all
                            warranties, express or implied. We shall not be liable for any
                            indirect, incidental, or consequential damages arising from the
                            use of the App.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            8. Modifications
                        </h2>
                        <p>
                            We reserve the right to modify these Terms at any time. Continued
                            use of the App after changes constitutes acceptance of the new
                            terms. We will update the &quot;Last updated&quot; date at the top of this
                            page.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            9. Termination
                        </h2>
                        <p>
                            We may suspend or terminate your access to the App at any time,
                            for any reason, without prior notice. You may stop using the App
                            and revoke access at any time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            10. Contact
                        </h2>
                        <p>
                            For questions about these Terms, contact us at:{" "}
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
