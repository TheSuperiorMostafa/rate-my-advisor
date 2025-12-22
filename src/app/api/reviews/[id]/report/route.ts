import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewParamsSchema, reviewReportSchema } from "@/lib/validation";
import { successResponse, errorResponse, notFoundResponse, rateLimitResponse } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIP } from "@/lib/auth";
import { getUserId } from "@/lib/auth";
import { generateFingerprint } from "@/lib/abuse-prevention";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Enhanced rate limiting with fingerprinting
  const ip = getClientIP(request);
  const fingerprint = generateFingerprint(request);
  
  // Rate limit by IP
  const ipRateLimit = checkRateLimit(ip, {
    maxRequests: 5,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    keyPrefix: "review_report_ip",
  });

  // Rate limit by fingerprint
  const fingerprintRateLimit = checkRateLimit(fingerprint, {
    maxRequests: 10,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    keyPrefix: "review_report_fp",
  });

  if (!ipRateLimit.allowed) {
    return rateLimitResponse(ipRateLimit.resetAt);
  }

  if (!fingerprintRateLimit.allowed) {
    return rateLimitResponse(fingerprintRateLimit.resetAt);
  }

  try {
    const { id } = reviewParamsSchema.parse(await params);
    const body = await request.json();
    const data = reviewReportSchema.parse(body);

    // Verify review exists
    const review = await prisma.review.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!review) {
      return notFoundResponse("Review not found");
    }

    const userId = await getUserId(request);
    const ipAddress = getClientIP(request);

    // Create report
    const report = await prisma.reviewReport.create({
      data: {
        reviewId: id,
        userId: userId || null,
        reason: data.reason,
        details: data.details || null,
        ipAddress: userId ? null : ipAddress,
        status: "pending",
      },
    });

    // If multiple reports (>3), auto-flag the review
    const reportCount = await prisma.reviewReport.count({
      where: {
        reviewId: id,
        status: "pending",
      },
    });

    if (reportCount >= 3) {
      await prisma.review.update({
        where: { id },
        data: {
          status: "flagged",
        },
      });
    }

    return successResponse(
      {
        reportId: report.id,
        message: "Report submitted successfully",
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

