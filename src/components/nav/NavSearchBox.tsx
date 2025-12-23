"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavAutocompleteDropdown } from "./NavAutocompleteDropdown";

interface NavSearchBoxProps {
  selectedUniversity: {
    id: string;
    name: string;
    slug: string;
  } | null;
  onSelectResult?: () => void;
  onUniversitySelect?: (university: { id: string; name: string; slug: string }) => void;
}

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

export function NavSearchBox({
  selectedUniversity,
  onSelectResult,
  onUniversitySelect,
}: NavSearchBoxProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

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

        if (selectedUniversity) {
          params.set("universityId", selectedUniversity.id);
        }

        const res = await fetch(`/api/search?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.data || {});
        } else {
          setResults({});
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults({});
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, selectedUniversity]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 1) {
      const flattened = getFlattenedResults();
      if (flattened.length > 0 && selectedIndex >= 0 && selectedIndex < flattened.length) {
        const selectedResult = flattened[selectedIndex];
        
        // If selecting a university and we have the callback, set it in context
        if (!selectedUniversity && results?.universities && selectedIndex < results.universities.length) {
          const university = results.universities[selectedIndex];
          if (onUniversitySelect) {
            onUniversitySelect(university);
          }
        }
        
        router.push(selectedResult.href);
        setIsOpen(false);
        setQuery("");
        if (onSelectResult) onSelectResult();
      } else {
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
    if (onSelectResult) onSelectResult();
  };

  const getFlattenedResults = () => {
    if (!results) return [];
    
    const items: Array<{ href: string }> = [];

    if (selectedUniversity) {
      // Advisor mode: advisors first, then departments
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
      // University mode: universities only
      if (results.universities) {
        results.universities.forEach((uni) => {
          items.push({ href: `/u/${uni.id}/${uni.slug}` });
        });
      }
    }

    return items;
  };

  const getResultsCount = () => {
    if (!results) return 0;
    if (selectedUniversity) {
      return (results.advisors?.length || 0) + (results.departments?.length || 0);
    }
    return results.universities?.length || 0;
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
      const flattened = getFlattenedResults();
      if (flattened.length > 0 && selectedIndex < flattened.length) {
        const selectedResult = flattened[selectedIndex];
        
        // If selecting a university and we have the callback, set it in context
        if (!selectedUniversity && results?.universities && selectedIndex < results.universities.length) {
          const university = results.universities[selectedIndex];
          if (onUniversitySelect) {
            onUniversitySelect(university);
          }
        }
        
        router.push(selectedResult.href);
        setIsOpen(false);
        setQuery("");
        if (onSelectResult) onSelectResult();
      }
    }
  };

  const placeholder = selectedUniversity
    ? `Search an advisor at ${selectedUniversity.name}...`
    : "Search your university...";

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" aria-hidden="true" />
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
              "w-full border border-gray-300 rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent",
              "placeholder:text-gray-400",
              query ? "pr-10" : "pr-3",
              "pl-10 py-2 text-sm"
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
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <NavAutocompleteDropdown
          query={query}
          results={results}
          loading={loading}
          selectedIndex={selectedIndex}
          selectedUniversity={selectedUniversity}
          onSelect={handleSelect}
          onUniversitySelect={onUniversitySelect}
        />
      )}
    </div>
  );
}

