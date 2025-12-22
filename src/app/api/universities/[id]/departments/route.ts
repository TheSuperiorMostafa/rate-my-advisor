import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { successResponse, errorResponse, notFoundResponse, rateLimitResponse } from "@/lib/api-response";
import { rateLimitMiddleware } from "@/lib/rate-limit";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

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
    const { id } = paramsSchema.parse(await params);

    // Verify university exists
    const university = await prisma.university.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!university) {
      return notFoundResponse("University not found");
    }

    const departments = await prisma.department.findMany({
      where: { universityId: id },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            advisors: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return successResponse({ departments });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Invalid university ID", 400);
    }
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

