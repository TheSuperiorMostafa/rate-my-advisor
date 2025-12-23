"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/ui/SearchBar";
import Link from "next/link";

interface SearchResult {
  universities: Array<{
    id: string;
    name: string;
    slug: string;
    location: string | null;
    departmentCount: number;
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
    advisorCount: number;
  }>;
  advisors: Array<{
    id: string;
    name: string;
    slug: string;
    title: string | null;
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
    reviewCount: number;
  }>;
}

interface SearchResultsProps {
  query: string;
  type: string;
}

export function SearchResults({ query: initialQuery, type: initialType }: SearchResultsProps) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim().length >= 2) {
      performSearch(query, type);
    } else {
      setResults(null);
    }
  }, [query, type]);

  const performSearch = async (searchQuery: string, searchType: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`);
      
      if (!res.ok) {
        throw new Error("Search failed");
      }

      const data = await res.json();
      setResults(data.data || { universities: [], departments: [], advisors: [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    // Update URL without reload
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", newQuery);
    window.history.pushState({}, "", `/search?${params.toString()}`);
  };

  const totalResults =
    (results?.universities.length || 0) +
    (results?.departments.length || 0) +
    (results?.advisors.length || 0);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <SearchBar
          placeholder="Search universities, departments, or advisors..."
          initialValue={query}
          onSearch={handleSearch}
        />
      </div>

      {/* Type Filter */}
      <div className="flex gap-2">
        {(["all", "university", "department", "advisor"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              type === t
                ? "bg-[#5B2D8B] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Searching...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && query.trim().length < 2 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Enter at least 2 characters to search</p>
        </div>
      )}

      {!loading && !error && query.trim().length >= 2 && totalResults === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No results found for "{query}"</p>
        </div>
      )}

      {!loading && !error && results && totalResults > 0 && (
        <div className="space-y-8">
          {/* Universities */}
          {(type === "all" || type === "university") && results.universities.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Universities ({results.universities.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.universities.map((university) => (
                  <Link
                    key={university.id}
                    href={`/u/${university.id}/${university.slug}`}
                    className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-violet-300 hover:shadow-md transition-all"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {university.name}
                    </h3>
                    {university.location && (
                      <p className="text-sm text-gray-600 mb-2">{university.location}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {university.departmentCount} {university.departmentCount === 1 ? "department" : "departments"}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Departments */}
          {(type === "all" || type === "department") && results.departments.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Departments ({results.departments.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.departments.map((department) => (
                  <Link
                    key={department.id}
                    href={`/d/${department.id}/${department.slug}`}
                    className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-violet-300 hover:shadow-md transition-all"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {department.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {department.university.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {department.advisorCount} {department.advisorCount === 1 ? "advisor" : "advisors"}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Advisors */}
          {(type === "all" || type === "advisor") && results.advisors.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Advisors ({results.advisors.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.advisors.map((advisor) => (
                  <Link
                    key={advisor.id}
                    href={`/a/${advisor.id}/${advisor.slug}`}
                    className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-violet-300 hover:shadow-md transition-all"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {advisor.name}
                    </h3>
                    {advisor.title && (
                      <p className="text-sm text-gray-600 mb-1">{advisor.title}</p>
                    )}
                    <p className="text-sm text-gray-600 mb-2">
                      {advisor.department.name} - {advisor.university.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {advisor.reviewCount} {advisor.reviewCount === 1 ? "review" : "reviews"}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

