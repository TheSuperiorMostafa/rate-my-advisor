import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Review Submitted - Rate My Advisor",
  description: "Thank you for submitting your review. It is pending moderation.",
};

export default async function ReviewSuccessPage({
  params,
}: {
  params: Promise<{ advisorId: string }>;
}) {
  const { advisorId } = await params;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You for Your Review!
          </h1>

          <p className="text-lg text-gray-600 mb-2">
            Your review has been submitted successfully.
          </p>

          <p className="text-sm text-gray-500 mb-8">
            It is currently pending moderation and will be published once approved by our team.
            This usually takes 24-48 hours.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href={`/a/${advisorId}`}>
              <Button>View Advisor Profile</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

