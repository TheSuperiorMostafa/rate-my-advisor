import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - Rate My Advisor",
  description: "Terms of Service for Rate My Advisor. Read our terms and conditions for using the platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-sm text-gray-600 mb-8">
            <strong>Last Updated:</strong> [Date]<br />
            <strong>Effective Date:</strong> [Date]
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing or using Rate My Advisor ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. You must be at least 13 years old to use this Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700">
              Rate My Advisor is a platform that allows students to share reviews and ratings of academic advisors. The Service includes user-generated content that is moderated before publication.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Account creation is optional but may be required for certain features</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must provide accurate information when creating an account</li>
              <li>You may not share your account with others</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Conduct</h2>
            <p className="text-gray-700 mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Submit false, misleading, or fraudulent information</li>
              <li>Impersonate any person or entity</li>
              <li>Spam, abuse, or harass other users</li>
              <li>Attempt to hack, disrupt, or interfere with the Service</li>
              <li>Violate our Content Policy (see Content Policy page)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. User-Generated Content</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>You retain ownership of content you submit</li>
              <li>You grant us a license to display, modify, and distribute your content on the Service</li>
              <li>You are solely responsible for the accuracy of your content</li>
              <li>We reserve the right to moderate, edit, or remove content at any time</li>
              <li>We do not guarantee that your content will be published</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Moderation & Content Removal</h2>
            <p className="text-gray-700">
              All user-generated content is subject to moderation. We may remove content that violates our Content Policy or Terms of Service at any time, without notice. Decisions regarding content removal are final, though you may appeal through our support channels.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Disclaimers</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Reviews are opinions and not verified facts</li>
              <li>We do not verify the accuracy of user-submitted reviews</li>
              <li>The Service is provided "as is" without warranties of any kind</li>
              <li>We do not guarantee uninterrupted or error-free service</li>
              <li>Use the Service at your own risk</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700">
              To the maximum extent permitted by law, Rate My Advisor shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Indemnification</h2>
            <p className="text-gray-700">
              You agree to indemnify and hold harmless Rate My Advisor from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service, your violation of these Terms, or your violation of any rights of another party.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
            <p className="text-gray-700">
              We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties. You may delete your account at any time through your account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on this page. Your continued use of the Service after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact</h2>
            <p className="text-gray-700">
              For questions about these Terms, contact us:
            </p>
            <ul className="list-none text-gray-700 mt-2 space-y-1">
              <li>Legal: <a href="mailto:legal@ratemyadvisor.com" className="text-[#5B2D8B] hover:underline">legal@ratemyadvisor.com</a></li>
              <li>General: <a href="mailto:support@ratemyadvisor.com" className="text-[#5B2D8B] hover:underline">support@ratemyadvisor.com</a></li>
            </ul>
          </section>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link href="/" className="text-[#5B2D8B] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

