"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, ArrowLeft } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error) {
      // Map NextAuth error codes to user-friendly messages
      const errorMessages: Record<string, string> = {
        Configuration: "Server configuration error. Please contact support.",
        AccessDenied: "Access denied. Please try again.",
        Verification: "Verification error. Please try again.",
        CredentialsSignin: "Invalid username or password.",
        OAuthSignin: "Error initiating OAuth sign-in. Please check your OAuth configuration.",
        OAuthCallback: "Error processing OAuth callback. Please try again.",
        OAuthCreateAccount: "Could not create OAuth account. Please try again.",
        EmailCreateAccount: "Could not create email account. Please try again.",
        Callback: "Error in OAuth callback. Please try again.",
        OAuthAccountNotLinked: "An account with this email already exists. Please sign in with your original method.",
        EmailSignin: "Error sending email. Please try again.",
        Default: "An error occurred during sign-in. Please try again.",
      };
      setErrorMessage(errorMessages[error] || errorMessages.Default);
      
      // Log detailed error for debugging
      console.error("Sign-in error:", error);
    }
  }, [error]);

  const handleGoogleSignIn = async () => {
    try {
      setErrorMessage(null);
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      console.error("Sign in error:", err);
      setErrorMessage("Failed to initiate sign-in. Please try again.");
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      console.log("Attempting admin login...");
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl: "/admin/moderation",
      });

      console.log("Sign in result:", result);

      if (result?.error) {
        console.error("Login error:", result.error);
        setErrorMessage("Invalid username or password.");
        setIsLoading(false);
        return;
      }

      // If successful, redirect
      if (result?.ok || !result?.error) {
        console.log("Login successful, redirecting...");
        // Use router.push with refresh to ensure session is loaded
        router.push("/admin/moderation");
        router.refresh();
        // Also try window.location as fallback
        setTimeout(() => {
          if (window.location.pathname === "/auth/signin") {
            window.location.href = "/admin/moderation";
          }
        }, 1000);
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setErrorMessage("Login failed. Please try again.");
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
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to continue
            </p>
          </div>
          <div className="space-y-4">
            {!showAdminLogin ? (
              <>
                <Button
                  onClick={handleGoogleSignIn}
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
                  Sign in with Google
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or</span>
                  </div>
                </div>
                <Button
                  onClick={() => setShowAdminLogin(true)}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Admin Login
                </Button>
              </>
            ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  isLoading={isLoading}
                  size="lg"
                  className="w-full"
                >
                  {isLoading ? "Signing in..." : "Sign In as Admin"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setShowAdminLogin(false);
                    setUsername("");
                    setPassword("");
                    setErrorMessage(null);
                  }}
                  className="w-full"
                >
                  Back to Google Sign In
                </Button>
              </form>
            )}
            {errorMessage && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{errorMessage}</p>
                {error && (
                  <p className="text-xs text-red-600 mt-1">Error code: {error}</p>
                )}
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="font-medium text-[#5B2D8B] hover:text-[#5B2D8B] transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-6">
              <p className="text-xs text-gray-500 text-center">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-[#5B2D8B] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#5B2D8B] hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

