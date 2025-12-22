import { prisma } from "./prisma";

export interface AdvisorRatings {
  overall: number;
  accuracy: number;
  responsiveness: number;
  helpfulness: number;
  availability: number;
  advocacy: number;
  clarity: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

/**
 * Calculate aggregated ratings for an advisor
 */
export async function getAdvisorRatings(advisorId: string): Promise<AdvisorRatings> {
  // Get all approved reviews for this advisor
  const reviews = await prisma.review.findMany({
    where: {
      advisorId,
      status: "approved",
    },
    include: {
      ratings: true,
    },
  });

  if (reviews.length === 0) {
    return {
      overall: 0,
      accuracy: 0,
      responsiveness: 0,
      helpfulness: 0,
      availability: 0,
      advocacy: 0,
      clarity: 0,
      totalReviews: 0,
      ratingDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    };
  }

  // Aggregate ratings by category
  const categoryTotals: Record<string, { sum: number; count: number }> = {
    accuracy: { sum: 0, count: 0 },
    responsiveness: { sum: 0, count: 0 },
    helpfulness: { sum: 0, count: 0 },
    availability: { sum: 0, count: 0 },
    advocacy: { sum: 0, count: 0 },
    clarity: { sum: 0, count: 0 },
  };

  // Calculate per-review averages and aggregate
  reviews.forEach((review) => {
    const reviewRatings = review.ratings;
    if (reviewRatings.length === 6) {
      // Calculate average for this review
      const reviewAvg =
        reviewRatings.reduce((sum, r) => sum + r.rating, 0) / reviewRatings.length;

      // Add to category totals
      reviewRatings.forEach((rating) => {
        const category = rating.category as keyof typeof categoryTotals;
        if (categoryTotals[category]) {
          categoryTotals[category].sum += rating.rating;
          categoryTotals[category].count += 1;
        }
      });
    }
  });

  // Calculate averages
  const accuracy = categoryTotals.accuracy.count > 0
    ? categoryTotals.accuracy.sum / categoryTotals.accuracy.count
    : 0;
  const responsiveness = categoryTotals.responsiveness.count > 0
    ? categoryTotals.responsiveness.sum / categoryTotals.responsiveness.count
    : 0;
  const helpfulness = categoryTotals.helpfulness.count > 0
    ? categoryTotals.helpfulness.sum / categoryTotals.helpfulness.count
    : 0;
  const availability = categoryTotals.availability.count > 0
    ? categoryTotals.availability.sum / categoryTotals.availability.count
    : 0;
  const advocacy = categoryTotals.advocacy.count > 0
    ? categoryTotals.advocacy.sum / categoryTotals.advocacy.count
    : 0;
  const clarity = categoryTotals.clarity.count > 0
    ? categoryTotals.clarity.sum / categoryTotals.clarity.count
    : 0;

  // Calculate overall rating distribution (1-5 stars)
  // Overall rating per review = average of its 6 category ratings
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  reviews.forEach((review) => {
    const reviewRatings = review.ratings;
    if (reviewRatings.length === 6) {
      // Calculate overall rating for this review (average of 6 categories)
      const reviewOverall =
        reviewRatings.reduce((sum, r) => sum + r.rating, 0) / reviewRatings.length;
      
      // Round to nearest integer (1-5)
      const rounded = Math.round(reviewOverall);
      const starRating = Math.max(1, Math.min(5, rounded)) as 1 | 2 | 3 | 4 | 5;
      distribution[starRating]++;
    }
  });

  // Overall is average of all category averages
  const overall =
    (accuracy + responsiveness + helpfulness + availability + advocacy + clarity) / 6;

  return {
    overall: Math.round(overall * 10) / 10, // Round to 1 decimal
    accuracy: Math.round(accuracy * 10) / 10,
    responsiveness: Math.round(responsiveness * 10) / 10,
    helpfulness: Math.round(helpfulness * 10) / 10,
    availability: Math.round(availability * 10) / 10,
    advocacy: Math.round(advocacy * 10) / 10,
    clarity: Math.round(clarity * 10) / 10,
    totalReviews: reviews.length,
    ratingDistribution: distribution,
  };
}

