"use client";

import { usePathname } from "next/navigation";

export interface SearchContext {
  universityId?: string;
  departmentId?: string;
  universityName?: string;
}

/**
 * Hook to detect if we're on a context page (for header search)
 * Returns empty context - pages should pass explicit context
 */
export function useSearchContext(): SearchContext {
  // Header search is always global - pages pass their own context
  // This hook is kept for future enhancements (e.g., localStorage context)
  return {};
}

