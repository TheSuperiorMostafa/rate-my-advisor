"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      // Sign in with Google - if it's a new user, NextAuth will create the account automatically
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      console.error("Sign up error:", err);
      setErrorMessage("Failed to initiate sign-up. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card variant="elevated" className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-[#F5F0FF] rounded-xl">
                <GraduationCap className="w-8 h-8 text-[#5B2D8B]" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Join Rate My Advisor to share your experiences and help other students
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleGoogleSignUp}
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
              {isLoading ? "Signing up..." : "Sign up with Google"}
            </Button>

            {errorMessage && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="font-medium text-[#5B2D8B] hover:text-[#5B2D8B] transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-6 space-y-3 text-xs text-gray-500">
              <p className="text-center">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-[#5B2D8B] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#5B2D8B] hover:underline">
                  Privacy Policy
                </Link>
              </p>
              <div className="bg-[#F5F0FF] border border-violet-200 rounded-lg p-3">
                <p className="text-xs text-[#4A2375]">
                  <strong>Note:</strong> Signing up with Google will create your account automatically. 
                  If you already have an account, you can sign in instead.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

