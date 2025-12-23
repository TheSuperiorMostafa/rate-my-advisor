"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthButton } from "@/components/auth/AuthButton";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useUniversityContext } from "@/lib/use-university-context";
import { NavSearchBox } from "@/components/nav/NavSearchBox";
import { UniversityContextPill } from "@/components/nav/UniversityContextPill";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { selectedUniversity, setUniversity, clearUniversity, isLoading } = useUniversityContext();
  const isHomePage = pathname === "/";
  const isAuthPage = pathname === "/auth/signin" || pathname === "/auth/signup";

  // When a university is selected from search, set it in context
  const handleUniversitySelect = (university: { id: string; name: string; slug: string }) => {
    setUniversity(university);
  };

  // Handle result selection
  const handleSelectResult = () => {
    // Navigation will happen automatically via the link
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl md:text-2xl font-bold text-gray-900 hover:text-[#5B2D8B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:ring-offset-2 rounded flex-shrink-0"
            aria-label="Rate My Advisor - Home"
          >
            <GraduationCap className="w-6 h-6 md:w-7 md:h-7 text-[#5B2D8B]" />
            <span className="hidden sm:inline">Rate My Advisor</span>
            <span className="sm:hidden">RMA</span>
          </Link>

          {/* Desktop Search Area */}
          {!isHomePage && !isLoading && (
            <div className="hidden md:flex flex-1 items-center gap-3 max-w-2xl mx-4 min-w-0">
              {/* University Pill */}
              {selectedUniversity && (
                <UniversityContextPill
                  universityName={selectedUniversity.name}
                  onClear={clearUniversity}
                  className="flex-shrink-0"
                />
              )}
              
              {/* Search Box */}
              <div className="flex-1 min-w-0">
                <NavSearchBox
                  selectedUniversity={selectedUniversity}
                  onSelectResult={handleSelectResult}
                  onUniversitySelect={handleUniversitySelect}
                />
              </div>
            </div>
          )}

          {/* Desktop Auth */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center gap-4 flex-shrink-0">
              <AuthButton />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#A78BFA] flex-shrink-0"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Search Area */}
        {!isHomePage && !isLoading && (
          <div className="md:hidden pb-4 space-y-3">
            {/* University Pill */}
            {selectedUniversity && (
              <UniversityContextPill
                universityName={selectedUniversity.name}
                onClear={clearUniversity}
              />
            )}
            
            {/* Search Box */}
            <NavSearchBox
              selectedUniversity={selectedUniversity}
              onSelectResult={handleSelectResult}
              onUniversitySelect={handleUniversitySelect}
            />
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && !isAuthPage && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-4">
              <AuthButton />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
