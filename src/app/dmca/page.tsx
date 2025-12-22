import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DMCA Policy - Rate My Advisor",
  description: "Digital Millennium Copyright Act (DMCA) policy and takedown procedures for Rate My Advisor.",
};

export default function DMCAPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">DMCA Takedown Policy</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-sm text-gray-600 mb-8">
            <strong>Last Updated:</strong> [Date]
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Overview</h2>
            <p className="text-gray-700">
              Rate My Advisor respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA). This policy outlines our procedures for handling copyright infringement claims.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Reporting Copyright Infringement</h2>
            <p className="text-gray-700 mb-4">
              To file a DMCA takedown notice, you must provide the following information:
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li><strong>Identification of Copyrighted Work:</strong> Description of the copyrighted material and location of the original work</li>
              <li><strong>Identification of Infringing Material:</strong> Specific URL(s) of the allegedly infringing content</li>
              <li><strong>Contact Information:</strong> Your name, address, phone number, and email address</li>
              <li><strong>Good Faith Statement:</strong> Statement that you have a good faith belief that the use is not authorized</li>
              <li><strong>Accuracy Statement:</strong> Statement that the information is accurate and you are authorized to act on behalf of the copyright owner</li>
              <li><strong>Signature:</strong> Physical or electronic signature of the copyright owner or authorized agent</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Where to Send Notice</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-700 font-semibold mb-2">DMCA Agent:</p>
              <ul className="list-none text-gray-700 space-y-1">
                <li>Email: <a href="mailto:dmca@ratemyadvisor.com" className="text-blue-600 hover:underline">dmca@ratemyadvisor.com</a></li>
                <li>Subject Line: "DMCA Takedown Request"</li>
                <li>Response Time: 48 hours</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Counter-Notification</h2>
            <p className="text-gray-700 mb-4">
              If your content was removed due to a DMCA notice, you may file a counter-notification if you believe the removal was in error. Your counter-notification must include:
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Identification of the removed content</li>
              <li>Statement of good faith belief that content was removed by mistake</li>
              <li>Consent to jurisdiction of federal court</li>
              <li>Your contact information</li>
              <li>Your signature</li>
            </ol>
            <p className="text-gray-700 mt-4">
              Upon receipt of a valid counter-notification, we will forward it to the original complainant. Content may be restored 10-14 business days after counter-notification unless we receive notice of court action.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Repeat Infringers</h2>
            <p className="text-gray-700">
              In accordance with the DMCA, we maintain a policy of terminating accounts of users who are repeat infringers. A user who receives three valid DMCA takedown notices may have their account terminated.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. False Claims</h2>
            <p className="text-gray-700">
              Knowingly filing a false DMCA claim may result in liability for damages, including costs and attorney's fees. False statements in a DMCA notice may constitute perjury.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Process Timeline</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li><strong>Receipt:</strong> DMCA notice received and logged (within 24 hours)</li>
              <li><strong>Review:</strong> Notice verified for completeness (within 24 hours)</li>
              <li><strong>Action:</strong> Content removed if notice is valid (within 48 hours)</li>
              <li><strong>Notification:</strong> User notified of removal</li>
              <li><strong>Counter-Notice:</strong> User may file counter-notice (10-14 days to restore)</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact</h2>
            <p className="text-gray-700">
              For DMCA-related inquiries:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mt-2">
              <p className="text-gray-700">
                <strong>DMCA Agent</strong><br />
                Email: <a href="mailto:dmca@ratemyadvisor.com" className="text-blue-600 hover:underline">dmca@ratemyadvisor.com</a><br />
                Subject: "DMCA Takedown Request" or "DMCA Counter-Notification"
              </p>
            </div>
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

