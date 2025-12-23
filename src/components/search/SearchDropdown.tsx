"use client";

import { useEffect, useRef, useState } from "react";
import { SearchResultRow } from "./SearchResultRow";
import { getResultPriority, shouldShowTopUniversities } from "@/lib/search-helpers";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SearchResult {
  universities: Array<{
    id: string;
    name: string;
    slug: string;
    location?: string;
    departmentCount?: number;
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
    title?: string;
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
    reviewCount?: number;
  }>;
}

interface SearchDropdownProps {
  query: string;
  results: SearchResult | null;
  loading: boolean;
  activeFilter: "all" | "universities" | "departments" | "advisors";
  onSelect?: () => void;
  topUniversities?: Array<{
    id: string;
    name: string;
    slug: string;
    location?: string;
  }>;
  selectedIndex?: number;
}

export function SearchDropdown({
  query,
  results,
  loading,
  activeFilter,
  onSelect,
  topUniversities = [],
  selectedIndex = 0,
}: SearchDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);

  // Flatten and order results based on priority
  const flattenedResults = (() => {
    if (!results) return [];
    
    const priority = getResultPriority(query, activeFilter);
    const items: Array<{
      type: "university" | "department" | "advisor";
      data: any;
      href: string;
      secondaryLabel: string;
    }> = [];

    priority.forEach((type) => {
      if (type === "universities" && results.universities) {
        results.universities.forEach((uni) => {
          items.push({
            type: "university",
            data: uni,
            href: `/u/${uni.id}/${uni.slug}`,
            secondaryLabel: uni.location || `${uni.departmentCount || 0} departments`,
          });
        });
      } else if (type === "departments" && results.departments) {
        results.departments.forEach((dept) => {
          items.push({
            type: "department",
            data: dept,
            href: `/d/${dept.id}/${dept.slug}`,
            secondaryLabel: dept.university.name,
          });
        });
      } else if (type === "advisors" && results.advisors) {
        results.advisors.forEach((advisor) => {
          items.push({
            type: "advisor",
            data: advisor,
            href: `/a/${advisor.id}/${advisor.slug}`,
            secondaryLabel: `${advisor.department.name} • ${advisor.university.name}`,
          });
        });
      }
    });

    return items;
  })();


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

  // Show top universities for short queries
  const showTopUniversities = shouldShowTopUniversities(query) && topUniversities.length > 0;

  if (loading) {
    return (
      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto">
        <div className="p-4 text-center text-gray-500">Searching...</div>
      </div>
    );
  }

  if (showTopUniversities) {
    return (
      <div
        ref={containerRef}
        className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto"
        role="listbox"
        aria-label="Search results"
      >
        <div className="p-2">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Top Universities
          </div>
          {topUniversities.map((uni, idx) => (
            <div
              key={uni.id}
              ref={idx === selectedIndex ? selectedRef : null}
            >
              <SearchResultRow
                type="university"
                id={uni.id}
                name={uni.name}
                slug={uni.slug}
                secondaryLabel={uni.location}
                href={`/u/${uni.id}/${uni.slug}`}
                isSelected={idx === selectedIndex}
                onClick={onSelect}
              />
            </div>
          ))}
          <div
            ref={topUniversities.length === selectedIndex ? selectedRef : null}
          >
            <Link
              href="/search?type=universities"
              className={cn(
                "flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors",
                "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:ring-offset-1",
                topUniversities.length === selectedIndex && "bg-gray-50 ring-2 ring-[#A78BFA] ring-offset-1",
                "text-[#5B2D8B]"
              )}
              onClick={onSelect}
            >
              <GraduationCap className="w-4 h-4" />
              Browse all universities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!results || flattenedResults.length === 0) {
    if (query.trim().length >= 2) {
      return (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
          <div className="p-4 text-center text-gray-500">
            No results found for "{query}"
          </div>
        </div>
      );
    }
    return null;
  }

  // Group results by type for display
  const groupedResults = {
    universities: flattenedResults.filter((r) => r.type === "university"),
    departments: flattenedResults.filter((r) => r.type === "department"),
    advisors: flattenedResults.filter((r) => r.type === "advisor"),
  };

  const hasResults = Object.values(groupedResults).some((group) => group.length > 0);

  if (!hasResults) return null;

  return (
    <div
      ref={containerRef}
      className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto"
      role="listbox"
      aria-label="Search results"
    >
      <div className="p-2">
        {groupedResults.universities.length > 0 && (
          <div>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Universities ({groupedResults.universities.length})
            </div>
            {groupedResults.universities.map((item) => {
              const globalIdx = flattenedResults.findIndex((r) => r === item);
              return (
                <div
                  key={item.data.id}
                  ref={globalIdx === selectedIndex ? selectedRef : null}
                >
                  <SearchResultRow
                    type={item.type}
                    id={item.data.id}
                    name={item.data.name}
                    slug={item.data.slug}
                    secondaryLabel={item.secondaryLabel}
                    href={item.href}
                    isSelected={globalIdx === selectedIndex}
                    onClick={onSelect}
                  />
                </div>
              );
            })}
          </div>
        )}

        {groupedResults.departments.length > 0 && (
          <div className="mt-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Departments ({groupedResults.departments.length})
            </div>
            {groupedResults.departments.map((item) => {
              const globalIdx = flattenedResults.findIndex((r) => r === item);
              return (
                <div
                  key={item.data.id}
                  ref={globalIdx === selectedIndex ? selectedRef : null}
                >
                  <SearchResultRow
                    type={item.type}
                    id={item.data.id}
                    name={item.data.name}
                    slug={item.data.slug}
                    secondaryLabel={item.secondaryLabel}
                    href={item.href}
                    isSelected={globalIdx === selectedIndex}
                    onClick={onSelect}
                  />
                </div>
              );
            })}
          </div>
        )}

        {groupedResults.advisors.length > 0 && (
          <div className="mt-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Advisors ({groupedResults.advisors.length})
            </div>
            {groupedResults.advisors.map((item) => {
              const globalIdx = flattenedResults.findIndex((r) => r === item);
              return (
                <div
                  key={item.data.id}
                  ref={globalIdx === selectedIndex ? selectedRef : null}
                >
                  <SearchResultRow
                    type={item.type}
                    id={item.data.id}
                    name={item.data.name}
                    slug={item.data.slug}
                    secondaryLabel={item.secondaryLabel}
                    href={item.href}
                    isSelected={globalIdx === selectedIndex}
                    onClick={onSelect}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


