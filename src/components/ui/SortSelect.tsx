"use client";

interface SortSelectProps {
  currentSort: string;
  advisorId: string;
  slug: string;
}

export function SortSelect({ currentSort, advisorId, slug }: SortSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    window.location.href = `/a/${advisorId}/${slug}?sort=${newSort}`;
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm text-gray-600">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={handleChange}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A78BFA] bg-white"
      >
        <option value="newest">Most Recent</option>
        <option value="highest">Highest Rated</option>
        <option value="lowest">Lowest Rated</option>
        <option value="helpful">Most Helpful</option>
      </select>
    </div>
  );
}


