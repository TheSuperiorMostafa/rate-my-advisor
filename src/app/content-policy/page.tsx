import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Content Policy - Rate My Advisor",
  description: "Content policy and guidelines for submitting reviews on Rate My Advisor.",
};

export default function ContentPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Content Policy</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-sm text-gray-600 mb-8">
            <strong>Last Updated:</strong> [Date]
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-gray-700">
              Rate My Advisor provides a platform for students to share honest, constructive feedback about academic advisors. We maintain strict content policies to ensure a safe and respectful environment for all users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What's Allowed</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-green-900 mb-2">✅ Professional Feedback</h3>
              <ul className="list-disc list-inside text-green-800 space-y-1 text-sm">
                <li>Honest assessments of advisor performance</li>
                <li>Specific examples of positive or negative interactions</li>
                <li>Constructive criticism about advising services</li>
                <li>Recommendations or warnings based on experience</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">✅ Ratings & Categories</h3>
              <ul className="list-disc list-inside text-green-800 space-y-1 text-sm">
                <li>Accuracy, Responsiveness, Helpfulness</li>
                <li>Availability, Advocacy, Clarity</li>
                <li>Meeting type and timeframe information</li>
                <li>Tags describing advisor characteristics</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What's Not Allowed</h2>
            
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">❌ Personal Information</h3>
                <p className="text-red-800 text-sm">Email addresses, phone numbers, physical addresses, or any identifying contact information</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">❌ Threats & Violence</h3>
                <p className="text-red-800 text-sm">Threats of harm, violence, or explicit threats against anyone</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">❌ Medical Information</h3>
                <p className="text-red-800 text-sm">Medical diagnoses, health details, or information about medical conditions</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">❌ Criminal Accusations</h3>
                <p className="text-red-800 text-sm">Accusations of illegal activity or unsubstantiated criminal claims</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">❌ Hate Speech</h3>
                <p className="text-red-800 text-sm">Profanity, slurs, discriminatory language, or content targeting protected characteristics</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">❌ Off-Topic Content</h3>
                <p className="text-red-800 text-sm">Reviews not about advising services, personal attacks unrelated to performance, spam, or promotional content</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Enforcement</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>All reviews are moderated before publication</li>
              <li>Violations result in review rejection</li>
              <li>Repeated violations may result in account restrictions</li>
              <li>Severe violations may result in legal action</li>
              <li>Appeals can be submitted via support channels</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reporting</h2>
            <p className="text-gray-700 mb-4">
              If you see content that violates this policy, use the "Report" button on any review. Reports are reviewed within 24 hours.
            </p>
            <p className="text-gray-700">
              For policy questions, contact: <a href="mailto:content@ratemyadvisor.com" className="text-[#5B2D8B] hover:underline">content@ratemyadvisor.com</a>
            </p>
          </section>

          <section className="mb-8 bg-[#F5F0FF] border border-violet-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-purple-900 mb-3">Remember</h2>
            <p className="text-[#4A2375]">
              Reviews are opinions about advisor performance. Be honest, constructive, and respectful. Focus on your experience with the advisor's professional services, not personal matters.
            </p>
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


