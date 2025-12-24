"use client";

import { SessionProvider } from "next-auth/react";
import { UniversityContextProvider } from "@/lib/use-university-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={0} 
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      <UniversityContextProvider>
        {children}
      </UniversityContextProvider>
    </SessionProvider>
  );
}


