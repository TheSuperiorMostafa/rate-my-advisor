import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewParamsSchema } from "@/lib/validation";
import { successResponse, errorResponse, notFoundResponse, rateLimitResponse } from "@/lib/api-response";
import { rateLimitMiddleware } from "@/lib/rate-limit";
import { getClientIP } from "@/lib/auth";
import { getUserId } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting
  const rateLimit = rateLimitMiddleware(request, {
    maxRequests: 50,
    windowMs: 60000,
  });
  if (rateLimit) return rateLimit;

  try {
    const { id } = reviewParamsSchema.parse(await params);

    // Verify review exists and is approved
    const review = await prisma.review.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!review) {
      return notFoundResponse("Review not found");
    }

    if (review.status !== "approved") {
      return errorResponse("Can only vote on approved reviews", 400);
    }

    const userId = await getUserId(request);
    const ipAddress = getClientIP(request);

    // Check for existing vote
    const existingVote = await prisma.reviewVote.findFirst({
      where: {
        reviewId: id,
        ...(userId ? { userId } : { ipAddress }),
      },
    });

    if (existingVote) {
      return errorResponse("Already voted on this review", 400);
    }

    // Create vote
    await prisma.reviewVote.create({
      data: {
        reviewId: id,
        userId: userId || null,
        ipAddress: userId ? null : ipAddress,
        userAgent: request.headers.get("user-agent") || null,
      },
    });

    // Update helpful count
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        helpfulCount: {
          increment: 1,
        },
      },
      select: {
        helpfulCount: true,
      },
    });

    return successResponse({
      helpfulCount: updatedReview.helpfulCount,
    });
  } catch (error) {
    if (error instanceof Error) {
      // Handle unique constraint violation
      if (error.message.includes("Unique constraint")) {
        return errorResponse("Already voted on this review", 400);
      }
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

