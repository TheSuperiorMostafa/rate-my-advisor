import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { ModerationDashboard } from "@/components/moderation/ModerationDashboard";

export const metadata: Metadata = {
  title: "Moderation Dashboard - Rate My Advisor",
  description: "Admin moderation dashboard for reviewing and managing user reviews",
};

// Allowed emails for moderation (temporary until OAuth is fixed)
const ALLOWED_MODERATOR_EMAILS = ["superiormostafa@gmail.com"];

export default async function ModerationPage() {
  const session = await getServerSession();

  // Check if user is signed in
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  // Allow specific emails OR admin role
  const isAllowedEmail = ALLOWED_MODERATOR_EMAILS.includes(session.user.email);
  const isAdmin = session.user.role === "ADMIN";

  if (!isAllowedEmail && !isAdmin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Moderation Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">Review and manage user-submitted reviews</p>
              </div>
              <div className="flex gap-4">
                <a
                  href="/admin/manage"
                  className="text-sm text-[#5B2D8B] hover:text-purple-900"
                >
                  Manage Content →
                </a>
                <a
                  href="/"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  ← Back to Site
                </a>
              </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <ModerationDashboard />
      </div>
    </div>
  );
}

