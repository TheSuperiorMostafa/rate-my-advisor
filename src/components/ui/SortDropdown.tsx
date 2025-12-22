"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface SortDropdownProps {
  currentSort: string;
  advisorId: string;
  slug: string;
}

export function SortDropdown({ currentSort, advisorId, slug }: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    router.push(`/a/${advisorId}/${slug}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm text-gray-600">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="newest">Most Recent</option>
        <option value="highest">Highest Rated</option>
        <option value="lowest">Lowest Rated</option>
        <option value="helpful">Most Helpful</option>
      </select>
    </div>
  );
}

