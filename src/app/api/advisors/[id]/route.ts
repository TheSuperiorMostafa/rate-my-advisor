import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { advisorParamsSchema } from "@/lib/validation";
import { successResponse, errorResponse, notFoundResponse, rateLimitResponse } from "@/lib/api-response";
import { rateLimitMiddleware } from "@/lib/rate-limit";
import { getAdvisorRatings } from "@/lib/ratings";

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

    const advisor = await prisma.advisor.findUnique({
      where: { id },
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

    if (!advisor) {
      return notFoundResponse("Advisor not found");
    }

    // Get aggregated ratings
    const ratings = await getAdvisorRatings(id);

    return successResponse({
      advisor: {
        id: advisor.id,
        firstName: advisor.firstName,
        lastName: advisor.lastName,
        slug: advisor.slug,
        title: advisor.title,
        isActive: advisor.isActive,
        department: {
          id: advisor.department.id,
          name: advisor.department.name,
          slug: advisor.department.slug,
          university: advisor.department.university,
        },
      },
      ratings,
    });
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}


