import { Metadata } from "next";
import { notFound } from "next/navigation";
import { RatingSummary } from "@/components/rating/RatingSummary";
import { ReviewCard } from "@/components/review/ReviewCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SortSelect } from "@/components/ui/SortSelect";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{
    advisorId: string;
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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

async function getReviews(advisorId: string, sort: string = "newest") {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/advisors/${advisorId}/reviews`
    );
    url.searchParams.set("sort", sort);

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return { reviews: [], pagination: { total: 0 } };
    const data = await res.json();
    return data.data;
  } catch {
    return { reviews: [], pagination: { total: 0 } };
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
  const ratings = advisorData.ratings;

  return {
    title: `${name} - ${advisor.department.university.name} | Rate My Advisor`,
    description: `${name} - ${advisor.title || "Academic Advisor"} at ${advisor.department.name}, ${advisor.department.university.name}. Overall rating: ${ratings.overall}/5.0 from ${ratings.totalReviews} reviews.`,
    openGraph: {
      title: `${name} - Rate My Advisor`,
      description: `${ratings.overall}/5.0 rating from ${ratings.totalReviews} reviews`,
    },
  };
}

export default async function AdvisorPage({ params, searchParams }: PageProps) {
  const { advisorId } = await params;
  const { sort } = await searchParams;
  const sortBy = typeof sort === "string" ? sort : "newest";

  const advisorData = await getAdvisor(advisorId);

  if (!advisorData) {
    notFound();
  }

  const advisor = advisorData.advisor;
  const ratings = advisorData.ratings;
  const reviewsData = await getReviews(advisorId, sortBy);
  const reviews = reviewsData.reviews || [];

  const name = `${advisor.firstName} ${advisor.lastName}`;
  const breadcrumbPath = [
    { label: "Home", href: "/" },
    {
      label: advisor.department.university.name,
      href: `/u/${advisor.department.university.id}/${advisor.department.university.slug}`,
    },
    {
      label: advisor.department.name,
      href: `/d/${advisor.department.id}/${advisor.department.slug}`,
    },
    { label: name },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <nav className="text-sm text-gray-500 mb-4">
            {breadcrumbPath.map((item, index) => (
              <span key={index}>
                {index > 0 && <span className="mx-2">/</span>}
                {item.href ? (
                  <Link href={item.href} className="hover:text-gray-700">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-900">{item.label}</span>
                )}
              </span>
            ))}
          </nav>

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
              {advisor.title && (
                <p className="text-lg text-gray-600 mb-2">{advisor.title}</p>
              )}
              <p className="text-sm text-gray-500">
                {advisor.department.name} • {advisor.department.university.name}
              </p>
            </div>
            <Link href={`/a/${advisorId}/${advisor.slug}/review`}>
              <Button>Write a Review</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <RatingSummary
            overall={ratings.overall}
            accuracy={ratings.accuracy}
            responsiveness={ratings.responsiveness}
            helpfulness={ratings.helpfulness}
            availability={ratings.availability}
            advocacy={ratings.advocacy}
            clarity={ratings.clarity}
            totalReviews={ratings.totalReviews}
            ratingDistribution={ratings.ratingDistribution}
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Reviews ({ratings.totalReviews})
            </h2>
            <SortSelect currentSort={sortBy} advisorId={advisorId} slug={advisor.slug} />
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review: any) => (
              <ReviewCard
                key={review.id}
                id={review.id}
                text={review.text}
                meetingType={review.meetingType}
                timeframe={review.timeframe}
                isVerified={review.isVerified}
                helpfulCount={review.helpfulCount}
                createdAt={review.createdAt}
                ratings={review.ratings}
                tags={review.tags}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
            <p className="mt-1 text-sm text-gray-500">Be the first to review this advisor</p>
            <div className="mt-6">
              <Link
                href={`/a/${advisorId}/${advisor.slug}/review`}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Write a Review
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

