import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { ManageContent } from "@/components/admin/ManageContent";

export const metadata: Metadata = {
  title: "Manage Content - Rate My Advisor",
  description: "Admin panel for managing universities, departments, and advisors",
};

export default async function ManagePage() {
  const session = await getServerSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Content</h1>
              <p className="text-sm text-gray-600 mt-1">Add, edit, and delete universities, departments, and advisors</p>
            </div>
            <div className="flex gap-4">
              <a
                href="/admin/moderation"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Moderation
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
        <ManageContent />
      </div>
    </div>
  );
}

