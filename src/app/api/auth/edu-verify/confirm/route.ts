import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { successResponse, errorResponse, unauthorizedResponse, rateLimitResponse } from "@/lib/api-response";
import { rateLimitMiddleware } from "@/lib/rate-limit";
import crypto from "crypto";

const confirmSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

/**
 * Hash email for storage
 */
function hashEmail(email: string): string {
  return crypto.createHash("sha256").update(email.toLowerCase()).digest("hex");
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimit = rateLimitMiddleware(request, {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyPrefix: "edu_verify_confirm",
  });
  if (rateLimit) return rateLimit;

  // Check authentication
  const session = await getSession(request);
  if (!session?.user?.id) {
    return unauthorizedResponse("Must be signed in to verify email");
  }

  try {
    const body = await request.json();
    const { code } = confirmSchema.parse(body);

    // Find verification record
    const verification = await prisma.eduVerification.findFirst({
      where: {
        userId: session.user.id,
        code,
        verifiedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!verification) {
      return errorResponse("Invalid or expired verification code", 400);
    }

    // Update user as verified
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          eduVerified: true,
          eduEmail: hashEmail(verification.email),
        },
      }),
      prisma.eduVerification.update({
        where: { id: verification.id },
        data: {
          verifiedAt: new Date(),
        },
      }),
    ]);

    return successResponse({
      message: "Email verified successfully",
      verified: true,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.issues[0]?.message || "Validation error", 400);
    }
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

