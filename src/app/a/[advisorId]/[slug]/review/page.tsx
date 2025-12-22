import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewForm } from "@/components/review/ReviewForm";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    advisorId: string;
    slug: string;
  }>;
}

async function getAdvisor(advisorId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/advisors/${advisorId}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

async function getTags() {
  try {
    // You'll need to create this endpoint or fetch from reviews
    // For now, return empty array - tags can be fetched from existing reviews
    return [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { advisorId } = await params;
  const advisorData = await getAdvisor(advisorId);

  if (!advisorData) {
    return {
      title: "Advisor Not Found",
    };
  }

  const advisor = advisorData.advisor;
  const name = `${advisor.firstName} ${advisor.lastName}`;

  return {
    title: `Write a Review for ${name} | Rate My Advisor`,
    description: `Share your experience with ${name} at ${advisor.department.university.name}.`,
  };
}

export default async function WriteReviewPage({ params }: PageProps) {
  const { advisorId, slug } = await params;
  const advisorData = await getAdvisor(advisorId);

  if (!advisorData) {
    notFound();
  }

  const advisor = advisorData.advisor;
  const name = `${advisor.firstName} ${advisor.lastName}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/u/${advisor.department.university.id}/${advisor.department.university.slug}`}
              className="hover:text-gray-700"
            >
              {advisor.department.university.name}
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/d/${advisor.department.id}/${advisor.department.slug}`}
              className="hover:text-gray-700"
            >
              {advisor.department.name}
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/a/${advisorId}/${slug}`}
              className="hover:text-gray-700"
            >
              {name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Write Review</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Write a Review for {name}
          </h1>
          <p className="text-lg text-gray-600">
            {advisor.title || "Academic Advisor"} • {advisor.department.name}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <ReviewForm advisorId={advisorId} advisorSlug={slug} advisorName={name} />
      </div>
    </div>
  );
}

