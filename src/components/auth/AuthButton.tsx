"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { AuthModal } from "./AuthModal";
import { User, LogOut, LogIn } from "lucide-react";

export function AuthButton() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-20 h-9 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 font-medium">
              {session.user?.name || session.user?.email?.split("@")[0]}
            </span>
          </div>
          {session.user?.role === "ADMIN" && (
            <Badge variant="error" size="sm">Admin</Badge>
          )}
          {session.user?.eduVerified && (
            <Badge variant="success" size="sm">Verified</Badge>
          )}
        </div>
        <Button 
          onClick={() => signOut()} 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => {
            setAuthMode("signup");
            setAuthModalOpen(true);
          }}
          size="sm"
          className="hidden sm:flex items-center gap-2"
        >
          Sign Up
        </Button>
        <Button
          onClick={() => {
            setAuthMode("signin");
            setAuthModalOpen(true);
          }}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:inline">Sign In</span>
          <span className="sm:hidden">Sign In</span>
        </Button>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={(newMode) => setAuthMode(newMode)}
      />
    </>
  );
}

