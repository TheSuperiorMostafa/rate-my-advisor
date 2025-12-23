"use client";

import { useEffect } from "react";
import { useUniversityContext } from "@/lib/use-university-context";

interface UniversityContextSyncProps {
  university: {
    id: string;
    name: string;
    slug: string;
  };
}

/**
 * Client component to sync university context when on a university page
 * This ensures the nav shows the correct state when navigating to a university page
 */
export function UniversityContextSync({ university }: UniversityContextSyncProps) {
  const { setUniversity, selectedUniversity } = useUniversityContext();

  useEffect(() => {
    // Only set if it's different (avoid unnecessary updates)
    if (!selectedUniversity || selectedUniversity.id !== university.id) {
      setUniversity(university);
    }
  }, [university, selectedUniversity, setUniversity]);

  return null; // This component doesn't render anything
}


