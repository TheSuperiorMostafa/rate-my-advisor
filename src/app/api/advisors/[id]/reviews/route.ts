import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { advisorParamsSchema, createReviewSchema } from "@/lib/validation";
import { successResponse, errorResponse, notFoundResponse, rateLimitResponse } from "@/lib/api-response";
import { rateLimitMiddleware, checkRateLimit } from "@/lib/rate-limit";
import { analyzeText } from "@/lib/sanitize";
import { getClientIP } from "@/lib/auth";
import { generateFingerprint, detectSpam } from "@/lib/abuse-prevention";
import { verifyCaptcha } from "@/lib/captcha";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting
  const rateLimit = rateLimitMiddleware(request, {
    maxRequests: 100,
    windowMs: 60000,
  });
  if (rateLimit) return rateLimit;

  try {
    const { id } = advisorParamsSchema.parse(await params);
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const sort = searchParams.get("sort") || "newest"; // newest, helpful, highest, lowest
    const skip = (page - 1) * limit;

    // Verify advisor exists
    const advisor = await prisma.advisor.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!advisor) {
      return notFoundResponse("Advisor not found");
    }

    // Get all reviews first to calculate overall ratings for sorting
    const allReviews = await prisma.review.findMany({
      where: {
        advisorId: id,
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

    // Calculate overall rating for each review and add to data
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

    // Apply pagination
    const paginatedReviews = sortedReviews.slice(skip, skip + limit);
    const total = sortedReviews.length;

    return successResponse({
      reviews: paginatedReviews.map((review) => ({
        id: review.id,
        text: review.text,
        meetingType: review.meetingType,
        timeframe: review.timeframe,
        isVerified: review.isVerified,
        helpfulCount: review.helpfulCount,
        createdAt: review.createdAt,
        overallRating: review.overallRating,
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
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Enhanced rate limiting with fingerprinting
  const ip = getClientIP(request);
  const fingerprint = generateFingerprint(request);
  
  // Rate limit by IP
  const ipRateLimit = checkRateLimit(ip, {
    maxRequests: 3,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    keyPrefix: "review_submit_ip",
  });

  // Rate limit by fingerprint (catches VPN/proxy users)
  const fingerprintRateLimit = checkRateLimit(fingerprint, {
    maxRequests: 5,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    keyPrefix: "review_submit_fp",
  });

  if (!ipRateLimit.allowed) {
    return rateLimitResponse(ipRateLimit.resetAt);
  }

  if (!fingerprintRateLimit.allowed) {
    return rateLimitResponse(fingerprintRateLimit.resetAt);
  }

  try {
    const { id } = advisorParamsSchema.parse(await params);
    const body = await request.json();
    const data = createReviewSchema.parse(body);

    // CAPTCHA verification (if enabled)
    if (process.env.ENABLE_CAPTCHA === "true" && body.captchaToken) {
      const captchaSecret = process.env.HCAPTCHA_SECRET_KEY || process.env.RECAPTCHA_SECRET_KEY;
      if (captchaSecret) {
        const captchaResult = await verifyCaptcha(
          body.captchaToken,
          captchaSecret
        );
        if (!captchaResult.success) {
          return errorResponse(`CAPTCHA verification failed: ${captchaResult.error}`, 400);
        }
      }
    }

    // Spam detection
    const spamDetection = detectSpam(data.text);
    if (spamDetection.isSpam) {
      return errorResponse(
        `Review rejected: ${spamDetection.reasons.join(", ")}`,
        400
      );
    }

    // Verify advisor exists
    const advisor = await prisma.advisor.findUnique({
      where: { id },
      select: { id: true, isActive: true },
    });

    if (!advisor) {
      return notFoundResponse("Advisor not found");
    }

    if (!advisor.isActive) {
      return errorResponse("Cannot review inactive advisor", 400);
    }

    // Analyze and sanitize text (remove all URLs for safety)
    const textAnalysis = analyzeText(data.text, { allowSafeUrls: false });
    const sanitizedText = textAnalysis.sanitized;

    // Determine status based on flags and spam score
    let status: "pending" | "flagged" = "pending";
    if (textAnalysis.flags.length > 0 || textAnalysis.hasThreats || spamDetection.score > 0.3) {
      status = "flagged";
    }

    // Get user session for verification status
    const { getSession } = await import("@/lib/auth");
    const session = await getSession(request);
    const isVerified = session?.user?.eduVerified || false;

    // Create review
    const review = await prisma.review.create({
      data: {
        advisorId: id,
        userId: session?.user?.id || null,
        text: sanitizedText,
        meetingType: data.meetingType,
        timeframe: data.timeframe,
        status,
        isVerified, // Use user's .edu verification status
        ratings: {
          create: [
            { category: "accuracy", rating: data.ratings.accuracy },
            { category: "responsiveness", rating: data.ratings.responsiveness },
            { category: "helpfulness", rating: data.ratings.helpfulness },
            { category: "availability", rating: data.ratings.availability },
            { category: "advocacy", rating: data.ratings.advocacy },
            { category: "clarity", rating: data.ratings.clarity },
          ],
        },
        ...(data.tags && data.tags.length > 0 && {
          tags: {
            create: data.tags.map((tagId) => ({ tagId })),
          },
        }),
      },
    });

    // If email provided, create verification record
    if (data.email) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

      await prisma.emailVerification.create({
        data: {
          reviewId: review.id,
          email: data.email, // In production, hash this
          expiresAt,
        },
      });

      // TODO: Send verification email
    }

    return successResponse(
      {
        reviewId: review.id,
        status: review.status,
        ...(data.email && { verificationRequired: true }),
      },
      201
    );
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

