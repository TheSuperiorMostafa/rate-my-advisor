import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Moderation Policy - Rate My Advisor",
  description: "Moderation policy and process for Rate My Advisor reviews.",
};

export default function ModerationPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Moderation Policy</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-sm text-gray-600 mb-8">
            <strong>Last Updated:</strong> [Date]<br />
            <strong>Version:</strong> 1.0
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-700">
              Rate My Advisor is committed to maintaining a safe, respectful, and constructive environment for students to share their experiences with academic advisors. All reviews are moderated to ensure compliance with our content guidelines.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Review Guidelines</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-green-900 mb-2">✅ Allowed Content</h3>
              <ul className="list-disc list-inside text-green-800 space-y-1 text-sm">
                <li>Honest feedback about advisor performance</li>
                <li>Specific examples of positive or negative interactions</li>
                <li>Constructive criticism about advising services</li>
                <li>Recommendations or warnings based on experience</li>
                <li>Ratings for: Accuracy, Responsiveness, Helpfulness, Availability, Advocacy, Clarity</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">❌ Prohibited Content</h3>
              <ol className="list-decimal list-inside text-red-800 space-y-1 text-sm">
                <li><strong>Personal Information:</strong> Email addresses, phone numbers, physical addresses, any contact information</li>
                <li><strong>Threats & Violence:</strong> Threats of harm or violence, explicit threats</li>
                <li><strong>Medical Information:</strong> Medical diagnoses or health information</li>
                <li><strong>Criminal Accusations:</strong> Accusations of illegal activity, unsubstantiated claims</li>
                <li><strong>Hate Speech & Discrimination:</strong> Profanity, slurs, discriminatory language</li>
                <li><strong>Off-Topic Content:</strong> Reviews not about advising services, personal attacks, spam</li>
                <li><strong>False Information:</strong> Knowingly false statements, fabricated experiences</li>
              </ol>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Moderation Process</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li><strong>Automatic Filtering:</strong> Reviews are automatically scanned for prohibited content and flagged if violations are detected</li>
              <li><strong>Manual Review:</strong> All reviews are reviewed by human moderators who approve, reject, or flag for further review</li>
              <li><strong>Appeal Process:</strong> Users can contact support to appeal moderation decisions. Appeals are reviewed within 48 hours</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Review Status</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Pending:</strong> Awaiting moderation review</li>
              <li><strong>Approved:</strong> Published and visible on advisor profile</li>
              <li><strong>Rejected:</strong> Violates guidelines, not published</li>
              <li><strong>Flagged:</strong> Requires additional review</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Enforcement</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>First violation:</strong> Review rejected</li>
              <li><strong>Repeated violations:</strong> User may be blocked from submitting reviews</li>
              <li><strong>Severe violations:</strong> Immediate blocking and potential legal action</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reporting Reviews</h2>
            <p className="text-gray-700">
              Users can report reviews that violate guidelines using the "Report" button on any review. Reports are reviewed within 24 hours by our moderation team.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-700">
              For moderation questions or appeals:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mt-2">
              <p className="text-gray-700">
                Email: <a href="mailto:moderation@ratemyadvisor.com" className="text-[#5B2D8B] hover:underline">moderation@ratemyadvisor.com</a><br />
                Response time: 24-48 hours
              </p>
            </div>
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

