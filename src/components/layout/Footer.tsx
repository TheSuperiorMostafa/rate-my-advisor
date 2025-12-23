import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    "About": [
      { label: "How It Works", href: "/#how-it-works" },
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    "Legal": [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Content Policy", href: "/content-policy" },
      { label: "DMCA Policy", href: "/dmca" },
    ],
    "Resources": [
      { label: "Moderation Policy", href: "/moderation-policy" },
      { label: "For Universities", href: "/universities" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-white hover:text-[#A78BFA] transition-colors mb-4"
            >
              <GraduationCap className="w-6 h-6 text-[#A78BFA]" />
              Rate My Advisor
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Find and review academic advisors at universities nationwide. Help students make informed decisions.
            </p>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} Rate My Advisor. All rights reserved.
            </p>
            <p className="text-xs text-gray-600">
              Built for students, by students.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
