import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - Rate My Advisor",
  description: "Privacy Policy for Rate My Advisor. Learn how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-sm text-gray-600 mb-8">
            <strong>Last Updated:</strong> [Date]<br />
            <strong>Effective Date:</strong> [Date]
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Rate My Advisor ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Email addresses (for authentication via magic link)</li>
              <li>.edu email addresses (for verification, stored as hash)</li>
              <li>IP addresses (for rate limiting and security purposes)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">User-Generated Content</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Reviews and ratings submitted by users</li>
              <li>Reports submitted for moderation</li>
              <li>Moderation actions (admin users only)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Usage analytics (via Vercel Analytics)</li>
              <li>Error logs and performance metrics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Information</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide and improve our services</li>
              <li>Authenticate users and manage accounts</li>
              <li>Moderate content and prevent abuse</li>
              <li>Prevent spam and fraudulent activity</li>
              <li>Comply with legal obligations</li>
              <li>Analyze usage patterns to improve user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Service Providers:</strong> With trusted service providers (Vercel, Supabase/Neon) who assist in operating our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
              <li><strong>With Your Consent:</strong> When you explicitly consent to sharing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>All data transmitted over HTTPS (encrypted in transit)</li>
              <li>Passwords hashed using bcrypt</li>
              <li>.edu email addresses hashed before storage</li>
              <li>Secure database connections with SSL</li>
              <li>Regular security audits and updates</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Reviews:</strong> Retained indefinitely unless deleted by user or removed for policy violations</li>
              <li><strong>User Accounts:</strong> Retained while account is active; deleted upon account deletion request</li>
              <li><strong>Logs:</strong> Retained for 90 days for security and debugging purposes</li>
              <li><strong>Backups:</strong> Retained according to backup retention policy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Access your personal data</li>
              <li>Request deletion of your account and data</li>
              <li>Request export of your data</li>
              <li>Opt out of analytics tracking</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise these rights, contact us at: <a href="mailto:privacy@ratemyadvisor.com" className="text-blue-600 hover:underline">privacy@ratemyadvisor.com</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700">
              Our service is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify users of any material changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of the service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
            <p className="text-gray-700">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none text-gray-700 mt-2 space-y-1">
              <li>Email: <a href="mailto:privacy@ratemyadvisor.com" className="text-blue-600 hover:underline">privacy@ratemyadvisor.com</a></li>
              <li>Data Requests: <a href="mailto:data@ratemyadvisor.com" className="text-blue-600 hover:underline">data@ratemyadvisor.com</a></li>
            </ul>
          </section>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

