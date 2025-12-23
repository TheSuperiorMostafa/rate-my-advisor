import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewParamsSchema, moderationActionSchema } from "@/lib/validation";
import { successResponse, errorResponse, notFoundResponse, unauthorizedResponse, rateLimitResponse } from "@/lib/api-response";
import { rateLimitMiddleware } from "@/lib/rate-limit";
import { isAdmin, getUserId, getSession } from "@/lib/auth";

// Allowed emails for moderation (temporary until OAuth is fixed)
const ALLOWED_MODERATOR_EMAILS = ["superiormostafa@gmail.com"];

async function canModerate(request: NextRequest): Promise<boolean> {
  const session = await getSession(request);
  if (!session?.user?.email) return false;
  
  const isAllowedEmail = ALLOWED_MODERATOR_EMAILS.includes(session.user.email);
  const admin = await isAdmin(request);
  
  return isAllowedEmail || admin;
}

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

  // Check moderation access
  if (!(await canModerate(request))) {
    return unauthorizedResponse("Moderation access required");
  }

  try {
    const { id } = reviewParamsSchema.parse(await params);
    const body = await request.json().catch(() => ({}));
    const data = moderationActionSchema.parse(body);
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
          status: "approved",
          reviewedAt: new Date(),
          reviewedBy: userId,
        },
      }),
      prisma.adminAction.create({
        data: {
          reviewId: id,
          userId,
          action: "approve",
          notes: data.notes || null,
        },
      }),
    ]);

    return successResponse({
      message: "Review approved successfully",
      reviewId: id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

