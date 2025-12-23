"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function EduVerification() {
  const { data: session, update } = useSession();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"request" | "confirm" | "success">("request");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (session?.user?.eduVerified) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
        <p className="text-sm text-green-800">
          ✓ Your .edu email is verified. Your reviews will show a "Verified Student" badge.
        </p>
      </div>
    );
  }

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/edu-verify/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send verification code");
        return;
      }

      setStep("confirm");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/edu-verify/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid verification code");
        return;
      }

      setStep("success");
      await update(); // Refresh session
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-[#F5F0FF] border border-violet-200 rounded-md">
      <h3 className="text-sm font-medium text-purple-900 mb-2">
        Verify Your Student Email
      </h3>
      <p className="text-xs text-[#5B2D8B] mb-4">
        Verify your .edu email to get a "Verified Student" badge on your reviews.
      </p>

      {step === "request" && (
        <form onSubmit={handleRequestCode} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@university.edu"
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
          />
          <Button type="submit" disabled={isLoading} size="sm">
            {isLoading ? "Sending..." : "Send Verification Code"}
          </Button>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </form>
      )}

      {step === "confirm" && (
        <form onSubmit={handleConfirmCode} className="space-y-2">
          <p className="text-xs text-[#5B2D8B] mb-2">
            Enter the 6-digit code sent to {email}
          </p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md text-center text-lg tracking-widest"
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} size="sm">
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setStep("request");
                setCode("");
              }}
            >
              Change Email
            </Button>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </form>
      )}

      {step === "success" && (
        <p className="text-sm text-green-800">
          ✓ Email verified successfully! Your reviews will now show a "Verified Student" badge.
        </p>
      )}
    </div>
  );
}


