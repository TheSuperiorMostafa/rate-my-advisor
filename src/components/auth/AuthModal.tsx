"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "signin" | "signup";
  onModeChange?: (mode: "signin" | "signup") => void;
}

export function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<"signin" | "signup">(mode);
  
  // Update current mode when prop changes
  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      // Sign in with Google - will redirect to Google OAuth
      // After OAuth, user will be redirected back to callbackUrl
      // When redirect: true, signIn doesn't return, so we don't check for errors here
      await signIn("google", { 
        callbackUrl: "/",
        redirect: true, // Allow redirect to Google
      });
      
      // This code won't execute if redirect is successful
      setIsLoading(false);
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMessage(
        err instanceof Error 
          ? err.message 
          : "Failed to initiate authentication. Please try again."
      );
      setIsLoading(false);
    }
  };

  const isSignUp = currentMode === "signup";
  
  const switchMode = (newMode: "signin" | "signup") => {
    setCurrentMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={currentMode === "signup" ? "Create Your Account" : "Sign In"}
    >
      <div className="space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-3 bg-[#F5F0FF] rounded-xl">
            <GraduationCap className="w-8 h-8 text-[#5B2D8B]" />
          </div>
        </div>

        {/* Description */}
        <p className="text-center text-gray-600">
          {isSignUp
            ? "Join Rate My Advisor to share your experiences and help other students"
            : "Sign in to your account to continue"}
        </p>

        {/* Google Auth Button */}
        <Button
          onClick={handleGoogleAuth}
          disabled={isLoading}
          isLoading={isLoading}
          size="lg"
          className="w-full flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {isLoading
            ? isSignUp
              ? "Signing up..."
              : "Signing in..."
            : isSignUp
            ? "Sign up with Google"
            : "Sign in with Google"}
        </Button>

        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* Switch Mode */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => switchMode("signin")}
                  className="font-medium text-[#5B2D8B] hover:text-[#5B2D8B] transition-colors"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => switchMode("signup")}
                  className="font-medium text-[#5B2D8B] hover:text-[#5B2D8B] transition-colors"
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </div>

        {/* Terms */}
        <div className="text-xs text-gray-500 text-center space-y-2">
          <p>
            By {isSignUp ? "signing up" : "signing in"}, you agree to our{" "}
              <Link
                href="/terms"
                className="text-[#5B2D8B] hover:underline"
                onClick={onClose}
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-[#5B2D8B] hover:underline"
                onClick={onClose}
              >
                Privacy Policy
              </Link>
          </p>
          {isSignUp && (
            <div className="bg-[#F5F0FF] border border-violet-200 rounded-lg p-3">
              <p className="text-xs text-[#4A2375]">
                <strong>Note:</strong> Signing up with Google will create your account
                automatically. If you already have an account, you can sign in instead.
              </p>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}

