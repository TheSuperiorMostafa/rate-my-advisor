"use client";

import { SessionProvider } from "next-auth/react";
import { UniversityContextProvider } from "@/lib/use-university-context";
import { useEffect } from "react";

function SessionRefreshHandler() {
  useEffect(() => {
    // After OAuth callback, force session refresh
    // Check if we just came from OAuth (has code param in URL)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");
    
    if (code || error) {
      // OAuth callback - force session refresh after a short delay
      // This ensures the session is available to the client
      setTimeout(() => {
        // Clear the URL params and reload to get fresh session
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
        window.location.reload();
      }, 1000);
    }
  }, []);
  
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


