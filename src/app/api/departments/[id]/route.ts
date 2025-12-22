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

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!department) {
      return notFoundResponse("Department not found");
    }

    return successResponse(department);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Invalid department ID", 400);
    }
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}

