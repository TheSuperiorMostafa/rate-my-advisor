"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Button disabled>Loading...</Button>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {session.user?.name || session.user?.email}
          {session.user?.role === "ADMIN" && (
            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
              Admin
            </span>
          )}
          {session.user?.eduVerified && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Verified Student
            </span>
          )}
        </span>
        <Button onClick={() => signOut()} variant="outline">
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => signIn()}>Sign In</Button>
  );
}

