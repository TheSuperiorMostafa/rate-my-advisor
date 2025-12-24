"use client";

import { SessionProvider } from "next-auth/react";
import { UniversityContextProvider } from "@/lib/use-university-context";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function SessionRefreshHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // After OAuth callback, force session refresh
    // Check if we just came from OAuth (has code param or just redirected)
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    
    if (code || error) {
      // OAuth callback - force session refresh after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }, [pathname, searchParams]);
  
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={0} 
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      <SessionRefreshHandler />
      <UniversityContextProvider>
        {children}
      </UniversityContextProvider>
    </SessionProvider>
  );
}


