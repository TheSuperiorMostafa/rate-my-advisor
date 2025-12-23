"use client";

import { useEffect, useRef } from "react";
import { AutocompleteResultRow } from "./AutocompleteResultRow";
import { GraduationCap, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AutocompleteResult {
  universities: Array<{
    id: string;
    name: string;
    slug: string;
    location?: string;
  }>;
  departments: Array<{
    id: string;
    name: string;
    slug: string;
    university: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  advisors: Array<{
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

interface AutocompleteDropdownProps {
  query: string;
  results: AutocompleteResult | null;
  loading: boolean;
  selectedIndex: number;
  onSelect?: () => void;
  context?: {
    universityId?: string;
    departmentId?: string;
    universityName?: string;
  };
}

export function AutocompleteDropdown({
  query,
  results,
  loading,
  selectedIndex,
  onSelect,
  context,
}: AutocompleteDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedRef.current) {
      const linkElement = selectedRef.current.querySelector('a');
      if (linkElement) {
        linkElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
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

    // In university/department context: prioritize advisors, then departments
    if (context?.universityId || context?.departmentId) {
      // Advisors first
      if (results.advisors) {
        results.advisors.forEach((advisor) => {
          const isCurrentDept = context?.departmentId === advisor.department.id;
          items.push({
            type: "advisor",
            data: advisor,
            href: `/a/${advisor.id}/${advisor.slug}`,
            subtitle: `${advisor.department.name} • ${advisor.university.name}`,
            index: currentIndex++,
          });
        });
      }

      // Departments second
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
      // Global context: universities first, then departments, then advisors
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

      if (results.advisors) {
        results.advisors.forEach((advisor) => {
          items.push({
            type: "advisor",
            data: advisor,
            href: `/a/${advisor.id}/${advisor.slug}`,
            subtitle: `${advisor.department.name} • ${advisor.university.name}`,
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
        className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto"
        role="listbox"
        aria-label="Search results"
      >
        <div className="p-4">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-5 h-5 bg-gray-200 rounded flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
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
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg"
          role="listbox"
        >
          <div className="p-4 text-center text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No results found for "{query}"</p>
            {context?.universityId && (
              <p className="text-sm mt-2">
                Try searching for advisors or departments at {context.universityName}
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
      className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto"
      role="listbox"
      aria-label="Search results"
    >
      <div className="p-2">
        {grouped.universities.length > 0 && (
          <div>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Universities ({grouped.universities.length})
            </div>
            {grouped.universities.map((item) => (
              <div
                key={item.data.id}
                ref={item.index === selectedIndex ? selectedRef : null}
              >
                <AutocompleteResultRow
                  type={item.type}
                  id={item.data.id}
                  name={item.data.name}
                  slug={item.data.slug}
                  subtitle={item.subtitle}
                  href={item.href}
                  isSelected={item.index === selectedIndex}
                  onClick={onSelect}
                />
              </div>
            ))}
          </div>
        )}

        {grouped.departments.length > 0 && (
          <div className={grouped.universities.length > 0 ? "mt-2" : ""}>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Departments ({grouped.departments.length})
            </div>
            {grouped.departments.map((item) => (
              <div
                key={item.data.id}
                ref={item.index === selectedIndex ? selectedRef : null}
              >
                <AutocompleteResultRow
                  type={item.type}
                  id={item.data.id}
                  name={item.data.name}
                  slug={item.data.slug}
                  subtitle={item.subtitle}
                  href={item.href}
                  isSelected={item.index === selectedIndex}
                  onClick={onSelect}
                />
              </div>
            ))}
          </div>
        )}

        {grouped.advisors.length > 0 && (
          <div className={grouped.departments.length > 0 || grouped.universities.length > 0 ? "mt-2" : ""}>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Advisors ({grouped.advisors.length})
            </div>
            {grouped.advisors.map((item) => (
              <div
                key={item.data.id}
                ref={item.index === selectedIndex ? selectedRef : null}
              >
                <AutocompleteResultRow
                  type={item.type}
                  id={item.data.id}
                  name={item.data.name}
                  slug={item.data.slug}
                  subtitle={item.subtitle}
                  href={item.href}
                  isSelected={item.index === selectedIndex}
                  onClick={onSelect}
                />
              </div>
            ))}
          </div>
        )}

        {/* Search another university option (only in university/department context) */}
        {(context?.universityId || context?.departmentId) && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div
              ref={flattenedResults.length === selectedIndex ? selectedRef : null}
            >
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors",
                  "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:ring-offset-1",
                  flattenedResults.length === selectedIndex && "bg-gray-50 ring-2 ring-[#A78BFA] ring-offset-1",
                  "text-[#5B2D8B]"
                )}
                onClick={onSelect}
              >
                <GraduationCap className="w-4 h-4" />
                Search another university...
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

