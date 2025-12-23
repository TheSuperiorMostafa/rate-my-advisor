"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AutocompleteDropdown } from "./AutocompleteDropdown";

interface AutocompleteSearchProps {
  placeholder?: string;
  initialValue?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  autoFocus?: boolean;
  helperText?: string;
  context?: {
    universityId?: string;
    departmentId?: string;
    universityName?: string;
  };
}

interface AutocompleteResult {
  universities: any[];
  departments: any[];
  advisors: any[];
}

export function AutocompleteSearch({
  placeholder = "Search universities, departments, advisors...",
  initialValue = "",
  className,
  size = "md",
  autoFocus = false,
  helperText,
  context,
}: AutocompleteSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<AutocompleteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);

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

  // Perform autocomplete search
  useEffect(() => {
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
        const params = new URLSearchParams({
          query: query.trim(),
        });

        if (context?.universityId) {
          params.set("universityId", context.universityId);
        }
        if (context?.departmentId) {
          params.set("departmentId", context.departmentId);
        }

        const res = await fetch(`/api/autocomplete?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.data || { universities: [], departments: [], advisors: [] });
        } else {
          setResults({ universities: [], departments: [], advisors: [] });
        }
      } catch (error) {
        console.error("Autocomplete error:", error);
        setResults({ universities: [], departments: [], advisors: [] });
      } finally {
        setLoading(false);
      }
    }, 250); // 250ms debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, context]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 1) {
      const flattened = getFlattenedResults();
      const resultsCount = getResultsCount();
      
      // If a result is selected, navigate to it
      if (flattened.length > 0 && selectedIndex >= 0 && selectedIndex < flattened.length) {
        router.push(flattened[selectedIndex].href);
        setIsOpen(false);
        setQuery("");
      } else if (context?.universityId && selectedIndex === flattened.length) {
        // "Search another university" link selected
        router.push("/");
        setIsOpen(false);
        setQuery("");
      } else {
        // Navigate to search page
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setIsOpen(false);
      }
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

  const getFlattenedResults = () => {
    if (!results) return [];
    
    const items: Array<{ href: string }> = [];

    // In university/department context: advisors first, then departments
    if (context?.universityId || context?.departmentId) {
      if (results.advisors) {
        results.advisors.forEach((advisor) => {
          items.push({ href: `/a/${advisor.id}/${advisor.slug}` });
        });
      }
      if (results.departments) {
        results.departments.forEach((dept) => {
          items.push({ href: `/d/${dept.id}/${dept.slug}` });
        });
      }
    } else {
      // Global context: universities, departments, advisors
      if (results.universities) {
        results.universities.forEach((uni) => {
          items.push({ href: `/u/${uni.id}/${uni.slug}` });
        });
      }
      if (results.departments) {
        results.departments.forEach((dept) => {
          items.push({ href: `/d/${dept.id}/${dept.slug}` });
        });
      }
      if (results.advisors) {
        results.advisors.forEach((advisor) => {
          items.push({ href: `/a/${advisor.id}/${advisor.slug}` });
        });
      }
    }

    return items;
  };

  const getResultsCount = () => {
    if (!results) return 0;
    const baseCount =
      (results.universities?.length || 0) +
      (results.departments?.length || 0) +
      (results.advisors?.length || 0);
    // Add 1 for "Search another university" link if in university/department context
    return baseCount + ((context?.universityId || context?.departmentId) ? 1 : 0);
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
    } else if (e.key === "Enter") {
      // Enter key is handled by form submit
      // Don't prevent default here to allow form submission
    }
  };

  const sizes = {
    sm: "py-2 text-sm pl-10 pr-10",
    md: "py-3 text-base pl-12 pr-12",
    lg: "py-4 text-lg pl-14 pr-14",
  };

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
              if (query.trim().length > 0 || results) {
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

      {/* Dropdown */}
      {isOpen && (
        <AutocompleteDropdown
          query={query}
          results={results}
          loading={loading}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
          context={context}
        />
      )}
    </div>
  );
}

