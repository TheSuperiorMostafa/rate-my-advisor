"use client";

import { useEffect, useRef } from "react";
import { NavResultRow } from "./NavResultRow";
import { GraduationCap, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SearchResult {
  universities?: Array<{
    id: string;
    name: string;
    slug: string;
    location?: string;
  }>;
  departments?: Array<{
    id: string;
    name: string;
    slug: string;
    university: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  advisors?: Array<{
    id: string;
    name: string;
    slug: string;
    department: {
      id: string;
      name: string;
      slug: string;
    };
    university: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

interface NavAutocompleteDropdownProps {
  query: string;
  results: SearchResult | null;
  loading: boolean;
  selectedIndex: number;
  selectedUniversity: {
    id: string;
    name: string;
    slug: string;
  } | null;
  onSelect?: () => void;
  onUniversitySelect?: (university: { id: string; name: string; slug: string }) => void;
}

export function NavAutocompleteDropdown({
  query,
  results,
  loading,
  selectedIndex,
  selectedUniversity,
  onSelect,
  onUniversitySelect,
}: NavAutocompleteDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLAnchorElement>(null);
  const router = useRouter();

  const handleResultClick = (href: string, isUniversity: boolean, university?: any) => {
    if (isUniversity && !selectedUniversity && university && onUniversitySelect) {
      onUniversitySelect(university);
    }
    router.push(href);
    if (onSelect) onSelect();
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  // Flatten results in priority order
  const flattenedResults = (() => {
    if (!results) return [];
    
    const items: Array<{
      type: "university" | "department" | "advisor";
      data: any;
      href: string;
      subtitle: string;
      index: number;
    }> = [];

    let currentIndex = 0;

    if (selectedUniversity) {
      // Advisor mode: advisors first, then departments
      if (results.advisors) {
        results.advisors.forEach((advisor) => {
          items.push({
            type: "advisor",
            data: advisor,
            href: `/a/${advisor.id}/${advisor.slug}`,
            subtitle: advisor.department.name,
            index: currentIndex++,
          });
        });
      }

      if (results.departments) {
        results.departments.forEach((dept) => {
          items.push({
            type: "department",
            data: dept,
            href: `/d/${dept.id}/${dept.slug}`,
            subtitle: dept.university.name,
            index: currentIndex++,
          });
        });
      }
    } else {
      // University mode: universities only
      if (results.universities) {
        results.universities.forEach((uni) => {
          items.push({
            type: "university",
            data: uni,
            href: `/u/${uni.id}/${uni.slug}`,
            subtitle: uni.location || "",
            index: currentIndex++,
          });
        });
      }
    }

    return items;
  })();

  if (loading) {
    return (
      <div
        ref={containerRef}
        className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
        role="listbox"
        aria-label="Search results"
      >
        <div className="p-3">
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-4 h-4 bg-gray-200 rounded flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-3.5 bg-gray-200 rounded w-3/4 mb-1.5" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!results || flattenedResults.length === 0) {
    if (query.trim().length >= 1) {
      return (
        <div
          ref={containerRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
          role="listbox"
        >
          <div className="p-4 text-center text-gray-500">
            <Search className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No results found for "{query}"</p>
            {selectedUniversity && (
              <p className="text-xs mt-1 text-gray-400">
                Try searching for advisors or departments at {selectedUniversity.name}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  }

  // Group results for display
  const grouped = {
    universities: flattenedResults.filter((r) => r.type === "university"),
    departments: flattenedResults.filter((r) => r.type === "department"),
    advisors: flattenedResults.filter((r) => r.type === "advisor"),
  };

  const hasResults = Object.values(grouped).some((g) => g.length > 0);

  if (!hasResults) return null;

  return (
    <div
      ref={containerRef}
      className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
      role="listbox"
      aria-label="Search results"
    >
      <div className="p-2">
        {grouped.universities.length > 0 && (
          <div>
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Universities ({grouped.universities.length})
            </div>
            {grouped.universities.map((item) => (
              <div
                key={item.data.id}
                ref={item.index === selectedIndex ? selectedRef : null}
              >
                <NavResultRow
                  type={item.type}
                  id={item.data.id}
                  name={item.data.name}
                  slug={item.data.slug}
                  subtitle={item.subtitle}
                  href={item.href}
                  isSelected={item.index === selectedIndex}
                  onClick={() => handleResultClick(item.href, true, item.data)}
                />
              </div>
            ))}
            {!selectedUniversity && (
              <Link
                href="/search?type=universities"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-xs font-medium text-[#5B2D8B] transition-colors"
                onClick={onSelect}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Browse all universities
              </Link>
            )}
          </div>
        )}

        {grouped.advisors.length > 0 && (
          <div className={grouped.universities.length > 0 ? "mt-1" : ""}>
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Advisors ({grouped.advisors.length})
            </div>
            {grouped.advisors.map((item) => (
              <div
                key={item.data.id}
                ref={item.index === selectedIndex ? selectedRef : null}
              >
                <NavResultRow
                  type={item.type}
                  id={item.data.id}
                  name={item.data.name}
                  slug={item.data.slug}
                  subtitle={item.subtitle}
                  href={item.href}
                  isSelected={item.index === selectedIndex}
                  onClick={() => handleResultClick(item.href, false)}
                />
              </div>
            ))}
          </div>
        )}

        {grouped.departments.length > 0 && (
          <div className={grouped.advisors.length > 0 || grouped.universities.length > 0 ? "mt-1" : ""}>
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Departments ({grouped.departments.length})
            </div>
            {grouped.departments.map((item) => (
              <div
                key={item.data.id}
                ref={item.index === selectedIndex ? selectedRef : null}
              >
                <NavResultRow
                  type={item.type}
                  id={item.data.id}
                  name={item.data.name}
                  slug={item.data.slug}
                  subtitle={item.subtitle}
                  href={item.href}
                  isSelected={item.index === selectedIndex}
                  onClick={() => handleResultClick(item.href, false)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

