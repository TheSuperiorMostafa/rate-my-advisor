import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Rate My Advisor</h3>
            <p className="text-sm">
              Helping students find the best academic advisors through honest, verified reviews.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="hover:text-white">
                  DMCA Policy
                </Link>
              </li>
              <li>
                <Link href="/content-policy" className="hover:text-white">
                  Content Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/moderation-policy" className="hover:text-white">
                  Moderation Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Content Policy</h4>
            <p className="text-xs text-gray-400 mb-2">
              Reviews must focus on advisor performance only. No personal information, threats, medical details, or hate speech. All reviews are moderated.
            </p>
            <Link href="/content-policy" className="text-xs text-blue-400 hover:text-blue-300">
              View Full Policy →
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {currentYear} Rate My Advisor. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2 md:mt-0">
            Version 1.0.0
          </p>
        </div>
      </div>
    </footer>
  );
}

