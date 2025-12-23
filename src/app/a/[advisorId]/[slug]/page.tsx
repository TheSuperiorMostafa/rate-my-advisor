import { Metadata } from "next";
import { notFound } from "next/navigation";
import { RatingSummary } from "@/components/rating/RatingSummary";
import { ReviewCard } from "@/components/review/ReviewCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAdvisorRatings } from "@/lib/ratings";
import { User, GraduationCap, MapPin, PenSquare, MessageSquare } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    advisorId: string;
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getAdvisor(advisorId: string) {
  try {
    const advisor = await prisma.advisor.findUnique({
      where: { id: advisorId },
      include: {
        department: {
          include: {
            university: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!advisor) return null;

    const ratings = await getAdvisorRatings(advisorId);

    return {
      advisor: {
        id: advisor.id,
        firstName: advisor.firstName,
        lastName: advisor.lastName,
        slug: advisor.slug,
        title: advisor.title,
        isActive: advisor.isActive,
        department: advisor.department,
      },
      ratings,
    };
  } catch {
    return null;
  }
}

async function getReviews(advisorId: string, sort: string = "newest") {
  try {
    const allReviews = await prisma.review.findMany({
      where: {
        advisorId,
        status: "approved",
      },
      include: {
        ratings: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Calculate overall rating for each review
    const reviewsWithOverall = allReviews.map((review) => {
      const overallRating =
        review.ratings.length === 6
          ? review.ratings.reduce((sum, r) => sum + r.rating, 0) / review.ratings.length
          : 0;
      return {
        ...review,
        overallRating,
      };
    });

    // Sort based on sort parameter
    let sortedReviews = [...reviewsWithOverall];
    if (sort === "newest") {
      sortedReviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (sort === "helpful") {
      sortedReviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
    } else if (sort === "highest") {
      sortedReviews.sort((a, b) => b.overallRating - a.overallRating);
    } else if (sort === "lowest") {
      sortedReviews.sort((a, b) => a.overallRating - b.overallRating);
    }

    return {
      reviews: sortedReviews.map((review) => ({
        id: review.id,
        text: review.text,
        meetingType: review.meetingType,
        timeframe: review.timeframe,
        isVerified: review.isVerified,
        helpfulCount: review.helpfulCount,
        createdAt: review.createdAt.toISOString(),
        ratings: review.ratings.reduce(
          (acc, r) => ({ ...acc, [r.category]: r.rating }),
          {} as Record<string, number>
        ),
        tags: review.tags.map((rt) => ({
          id: rt.tag.id,
          name: rt.tag.name,
          slug: rt.tag.slug,
        })),
      })),
      pagination: {
        total: sortedReviews.length,
      },
    };
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
  const breadcrumbs = [
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

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "helpful", label: "Most Helpful" },
    { value: "highest", label: "Highest Rated" },
    { value: "lowest", label: "Lowest Rated" },
  ];

  // Calculate key metrics
  const wouldMeetAgain = ratings.advocacy >= 4.0 ? Math.round((ratings.advocacy / 5) * 100) : 0;
  const avgResponsiveness = ratings.responsiveness;
  const avgAccuracy = ratings.accuracy;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6 md:py-8">
          <Breadcrumbs items={breadcrumbs} className="mb-6" />

          {/* Hero Block: Rating + Identity */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-3 bg-[#F5F0FF] rounded-xl flex-shrink-0">
                <User className="w-8 h-8 text-[#5B2D8B]" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {name}
                </h1>
                {advisor.title && (
                  <p className="text-lg text-gray-600 mb-3">{advisor.title}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    <span>{advisor.department.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{advisor.department.university.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Large Rating Display */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  "text-5xl md:text-6xl font-bold",
                  ratings.overall >= 4.5 ? "text-[#16A34A]" :
                  ratings.overall >= 4.0 ? "text-[#5B2D8B]" :
                  ratings.overall >= 3.5 ? "text-[#F59E0B]" :
                  "text-[#DC2626]"
                )}>
                  {ratings.overall.toFixed(1)}
                </span>
                <span className="text-2xl text-gray-400 font-medium">/ 5.0</span>
              </div>
              <StarRating rating={ratings.overall} size="xl" />
              <p className="text-sm text-gray-600 font-medium">
                {ratings.totalReviews} {ratings.totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section - Full Width Grid */}
      <div className="container-custom py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Summary + Distribution + Categories (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Key Metrics */}
            {ratings.totalReviews > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card variant="elevated" className="p-6">
                  <div className="text-sm font-medium text-gray-600 mb-2">Would Meet Again</div>
                  <div className="text-3xl font-bold text-[#5B2D8B] mb-1">{wouldMeetAgain}%</div>
                  <div className="text-xs text-gray-500">Based on advocacy rating</div>
                </Card>
                <Card variant="elevated" className="p-6">
                  <div className="text-sm font-medium text-gray-600 mb-2">Avg Responsiveness</div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl font-bold text-[#5B2D8B]">{avgResponsiveness.toFixed(1)}</span>
                    <StarRating rating={avgResponsiveness} size="sm" />
                  </div>
                  <div className="text-xs text-gray-500">Out of 5.0</div>
                </Card>
                <Card variant="elevated" className="p-6">
                  <div className="text-sm font-medium text-gray-600 mb-2">Avg Accuracy</div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl font-bold text-[#5B2D8B]">{avgAccuracy.toFixed(1)}</span>
                    <StarRating rating={avgAccuracy} size="sm" />
                  </div>
                  <div className="text-xs text-gray-500">Out of 5.0</div>
                </Card>
              </div>
            )}

            {/* Rating Summary Components */}
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

            {/* Reviews Section */}
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Reviews
                  {ratings.totalReviews > 0 && (
                    <span className="text-gray-500 font-normal ml-2">
                      ({ratings.totalReviews})
                    </span>
                  )}
                </h2>
                {reviews.length > 0 && (
                  <SortDropdown
                    currentSort={sortBy}
                    options={sortOptions}
                  />
                )}
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
                <Card variant="elevated" className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Be the first to review this advisor
                  </p>
                  <Link href={`/a/${advisorId}/${advisor.slug}/review`}>
                    <Button size="lg">
                      <PenSquare className="w-5 h-5 mr-2" />
                      Write a Review
                    </Button>
                  </Link>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column: CTA + Quick Actions (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Write Review CTA */}
              <Card variant="elevated" className="p-6 bg-gradient-to-br from-[#F5F0FF] to-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Share Your Experience
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Help other students by writing an honest review about your experience with this advisor.
                </p>
                <Link href={`/a/${advisorId}/${advisor.slug}/review`}>
                  <Button size="lg" className="w-full">
                    <PenSquare className="w-5 h-5 mr-2" />
                    Write a Review
                  </Button>
                </Link>
              </Card>

              {/* Quick Stats Summary */}
              {ratings.totalReviews > 0 && (
                <Card variant="elevated" className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Overall Rating</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#5B2D8B]">
                          {ratings.overall.toFixed(1)}
                        </span>
                        <StarRating rating={ratings.overall} size="sm" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Reviews</span>
                      <span className="text-lg font-bold text-gray-900">
                        {ratings.totalReviews}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Helpfulness</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#5B2D8B]">
                          {ratings.helpfulness.toFixed(1)}
                        </span>
                        <StarRating rating={ratings.helpfulness} size="sm" />
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
        <Link href={`/a/${advisorId}/${advisor.slug}/review`} className="block">
          <Button size="lg" className="w-full flex items-center justify-center gap-2">
            <PenSquare className="w-5 h-5" />
            Write a Review
          </Button>
        </Link>
      </div>
    </div>
  );
}
