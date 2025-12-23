"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "./Select";
import { ArrowUpDown } from "lucide-react";

interface SortDropdownProps {
  currentSort: string;
  options: Array<{ value: string; label: string }>;
  paramName?: string;
  className?: string;
}

export function SortDropdown({
  currentSort,
  options,
  paramName = "sort",
  className,
}: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "newest") {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={className}>
      <Select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="min-w-[180px]"
        aria-label="Sort reviews"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
