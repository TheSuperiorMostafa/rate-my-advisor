"use client";

import { useState, useEffect, useCallback } from "react";

interface University {
  id: string;
  name: string;
  slug: string;
}

const STORAGE_KEY = "rate-my-advisor-selected-university";

/**
 * Hook to manage selected university context across the app
 * Persists to localStorage and provides methods to set/clear
 */
export function useUniversityContext() {
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSelectedUniversity(parsed);
      }
    } catch (error) {
      console.error("Error loading university context:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set selected university
  const setUniversity = useCallback((university: University | null) => {
    setSelectedUniversity(university);
    if (university) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(university));
      } catch (error) {
        console.error("Error saving university context:", error);
      }
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error("Error clearing university context:", error);
      }
    }
  }, []);

  // Clear selected university
  const clearUniversity = useCallback(() => {
    setUniversity(null);
  }, [setUniversity]);

  return {
    selectedUniversity,
    setUniversity,
    clearUniversity,
    isLoading,
  };
}

