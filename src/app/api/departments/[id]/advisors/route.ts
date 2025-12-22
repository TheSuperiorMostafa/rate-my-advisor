import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { advisorQuerySchema } from "@/lib/validation";
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
    const searchParams = request.nextUrl.searchParams;
    const queryParams = advisorQuerySchema.parse({
      query: searchParams.get("query") || undefined,
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
    });

    // Verify department exists
    const department = await prisma.department.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!department) {
      return notFoundResponse("Department not found");
    }

    const { query, page, limit } = queryParams;
    const skip = (page - 1) * limit;

    const where = {
      departmentId: id,
      isActive: true,
      ...(query && {
        OR: [
          { firstName: { contains: query, mode: "insensitive" as const } },
          { lastName: { contains: query, mode: "insensitive" as const } },
        ],
      }),
    };

    const [advisors, total] = await Promise.all([
      prisma.advisor.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
        select: {
          id: true,
          firstName: true,
          lastName: true,
          slug: true,
          title: true,
          _count: {
            select: {
              reviews: {
                where: {
                  status: "approved",
                },
              },
            },
          },
        },
      }),
      prisma.advisor.count({ where }),
    ]);

    return successResponse({
      advisors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
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

