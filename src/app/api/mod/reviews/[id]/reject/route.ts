import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewParamsSchema, moderationRejectSchema } from "@/lib/validation";
import { successResponse, errorResponse, notFoundResponse, unauthorizedResponse, rateLimitResponse } from "@/lib/api-response";
import { rateLimitMiddleware } from "@/lib/rate-limit";
import { isAdmin, getUserId } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting
  const rateLimit = rateLimitMiddleware(request, {
    maxRequests: 100,
    windowMs: 60000,
  });
  if (rateLimit) return rateLimit;

  // Check admin access
  const admin = await isAdmin(request);
  if (!admin) {
    return unauthorizedResponse("Admin access required");
  }

  try {
    const { id } = reviewParamsSchema.parse(await params);
    const body = await request.json();
    const data = moderationRejectSchema.parse(body);
    const userId = await getUserId(request);

    if (!userId) {
      return unauthorizedResponse("User ID required");
    }

    // Verify review exists
    const review = await prisma.review.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!review) {
      return notFoundResponse("Review not found");
    }

    // Update review status
    await prisma.$transaction([
      prisma.review.update({
        where: { id },
        data: {
          status: "rejected",
          reviewedAt: new Date(),
          reviewedBy: userId,
        },
      }),
      prisma.adminAction.create({
        data: {
          reviewId: id,
          userId,
          action: "reject",
          reason: data.reason,
          notes: data.notes || null,
        },
      }),
    ]);

    return successResponse({
      message: "Review rejected successfully",
      reviewId: id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

