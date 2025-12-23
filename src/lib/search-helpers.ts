/**
 * Helper functions for search query parsing and ranking
 */

/**
 * Check if a query looks like a person's name (two capitalized words)
 */
export function looksLikePersonName(query: string): boolean {
  const trimmed = query.trim();
  const words = trimmed.split(/\s+/);
  
  if (words.length < 2) return false;
  
  // Check if first two words are capitalized (likely a name)
  const firstWord = words[0];
  const secondWord = words[1];
  
  return (
    firstWord.length > 0 &&
    secondWord.length > 0 &&
    firstWord[0] === firstWord[0].toUpperCase() &&
    secondWord[0] === secondWord[0].toUpperCase() &&
    /^[A-Z]/.test(firstWord) &&
    /^[A-Z]/.test(secondWord)
  );
}

/**
 * Determine result group priority based on query
 */
export function getResultPriority(
  query: string,
  activeFilter: "all" | "universities" | "departments" | "advisors"
): ("universities" | "departments" | "advisors")[] {
  // If a specific filter is active, prioritize that
  if (activeFilter !== "all") {
    const order: ("universities" | "departments" | "advisors")[] = [activeFilter];
    if (activeFilter === "universities") {
      order.push("departments", "advisors");
    } else if (activeFilter === "departments") {
      order.push("universities", "advisors");
    } else {
      order.push("universities", "departments");
    }
    return order;
  }

  // Short queries (0-2 chars): prioritize universities
  if (query.trim().length <= 2) {
    return ["universities", "departments", "advisors"];
  }

  // If query looks like a person name, prioritize advisors
  if (looksLikePersonName(query)) {
    return ["advisors", "universities", "departments"];
  }

  // Default: universities first
  return ["universities", "departments", "advisors"];
}

/**
 * Check if query is short enough to show top universities
 */
export function shouldShowTopUniversities(query: string): boolean {
  return query.trim().length <= 2;
}

