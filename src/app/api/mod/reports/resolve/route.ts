import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { successResponse, errorResponse, unauthorizedResponse, rateLimitResponse } from "@/lib/api-response";
import { rateLimitMiddleware } from "@/lib/rate-limit";
import { isAdmin, getUserId } from "@/lib/auth";

const resolveSchema = z.object({
  reviewId: z.string().uuid(),
  action: z.enum(["dismiss", "remove"]),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const { reviewId, action, notes } = resolveSchema.parse(body);
    const userId = await getUserId(request);

    if (!userId) {
      return unauthorizedResponse("User ID required");
    }

    if (action === "dismiss") {
      // Mark all pending reports for this review as resolved
      await prisma.reviewReport.updateMany({
        where: {
          reviewId,
          status: "pending",
        },
        data: {
          status: "resolved",
          resolvedAt: new Date(),
          resolvedBy: userId,
        },
      });
    } else if (action === "remove") {
      // Reject the review and resolve reports
      await prisma.$transaction([
        prisma.review.update({
          where: { id: reviewId },
          data: {
            status: "rejected",
            reviewedAt: new Date(),
            reviewedBy: userId,
          },
        }),
        prisma.reviewReport.updateMany({
          where: {
            reviewId,
            status: "pending",
          },
          data: {
            status: "resolved",
            resolvedAt: new Date(),
            resolvedBy: userId,
          },
        }),
        prisma.adminAction.create({
          data: {
            reviewId,
            userId,
            action: "reject",
            reason: "Removed due to reports",
            notes: notes || null,
          },
        }),
      ]);
    }

    return successResponse({
      message: `Reports ${action === "dismiss" ? "dismissed" : "resolved"} successfully`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Invalid request data", 400);
    }
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

