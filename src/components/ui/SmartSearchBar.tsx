"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchDropdown } from "@/components/search/SearchDropdown";

interface SearchResult {
  universities: any[];
  departments: any[];
  advisors: any[];
}

interface SmartSearchBarProps {
  placeholder?: string;
  initialValue?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  autoFocus?: boolean;
  helperText?: string;
  context?: "home" | "university";
  universityId?: string;
  topUniversities?: Array<{
    id: string;
    name: string;
    slug: string;
    location?: string;
  }>;
}

export function SmartSearchBar({
  placeholder = "Search a university, department, or advisor...",
  initialValue = "",
  className,
  size = "md",
  autoFocus = false,
  helperText,
  context = "home",
  universityId,
  topUniversities = [],
}: SmartSearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "universities" | "departments" | "advisors">("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Perform search
  useEffect(() => {
    if (query.trim().length < 2 && query.trim().length > 0) {
      setResults(null);
      setIsOpen(true);
      return;
    }

    if (query.trim().length < 1) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      setIsOpen(true);

      try {
        const searchType = activeFilter === "all" ? "all" : activeFilter;
        const url = context === "university" && universityId
          ? `/api/universities/${universityId}/search?q=${encodeURIComponent(query)}&type=${searchType}`
          : `/api/search?q=${encodeURIComponent(query)}&type=${searchType}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setResults(data.data || { universities: [], departments: [], advisors: [] });
        } else {
          setResults({ universities: [], departments: [], advisors: [] });
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults({ universities: [], departments: [], advisors: [] });
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, activeFilter, context, universityId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query)}&type=${activeFilter}`);
      setIsOpen(false);
    }
  };

  const handleChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(0);
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSelect = () => {
    setIsOpen(false);
    setQuery("");
  };

  const getResultsCount = () => {
    if (query.trim().length <= 2 && topUniversities.length > 0) {
      return topUniversities.length + 1; // +1 for "Browse all" link
    }
    if (!results) return 0;
    return (
      (results.universities?.length || 0) +
      (results.departments?.length || 0) +
      (results.advisors?.length || 0)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const resultsCount = getResultsCount();
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < resultsCount - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : resultsCount - 1));
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "Enter" && resultsCount > 0 && selectedIndex >= 0) {
      e.preventDefault();
      // Navigation will be handled by the form submit or link click
      // The selected item will be clicked programmatically
      const selectedElement = document.querySelector(
        `[role="option"][aria-selected="true"] a`
      ) as HTMLAnchorElement;
      if (selectedElement) {
        selectedElement.click();
      }
    }
  };

  const sizes = {
    sm: "py-2 text-sm pl-10 pr-10",
    md: "py-3 text-base pl-12 pr-12",
    lg: "py-4 text-lg pl-14 pr-14",
  };

  const flattenedResults = results
    ? [
        ...(results.universities || []),
        ...(results.departments || []),
        ...(results.advisors || []),
      ]
    : [];

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.trim().length > 0 || topUniversities.length > 0) {
                setIsOpen(true);
              }
            }}
            placeholder={placeholder}
            className={cn(
              "w-full border border-gray-300 rounded-xl",
              "focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent",
              "placeholder:text-gray-400",
              query ? "pr-12" : "pr-4",
              sizes[size]
            )}
            aria-label={placeholder}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            role="combobox"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {helperText && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}

      {/* Filter Chips */}
      <div className="flex items-center gap-2 mt-3">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={cn(
            "px-3 py-1 text-sm font-medium rounded-full transition-colors",
            activeFilter === "all"
              ? "bg-[#5B2D8B] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("universities")}
          className={cn(
            "px-3 py-1 text-sm font-medium rounded-full transition-colors",
            activeFilter === "universities"
              ? "bg-[#5B2D8B] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          Universities
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("departments")}
          className={cn(
            "px-3 py-1 text-sm font-medium rounded-full transition-colors",
            activeFilter === "departments"
              ? "bg-[#5B2D8B] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          Departments
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("advisors")}
          className={cn(
            "px-3 py-1 text-sm font-medium rounded-full transition-colors",
            activeFilter === "advisors"
              ? "bg-[#5B2D8B] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          Advisors
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <SearchDropdown
          query={query}
          results={results}
          loading={loading}
          activeFilter={activeFilter}
          onSelect={handleSelect}
          topUniversities={topUniversities}
          selectedIndex={selectedIndex}
        />
      )}
    </div>
  );
}

