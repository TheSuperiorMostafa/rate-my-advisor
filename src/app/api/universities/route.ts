import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { universityQuerySchema } from "@/lib/validation";
import { successResponse, errorResponse, rateLimitResponse } from "@/lib/api-response";
import { rateLimitMiddleware } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimit = rateLimitMiddleware(request, {
    maxRequests: 100,
    windowMs: 60000, // 1 minute
  });
  if (rateLimit) return rateLimit;

  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = universityQuerySchema.parse({
      query: searchParams.get("query") || undefined,
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
    });

    const { query, page, limit } = queryParams;
    const skip = (page - 1) * limit;

    const where = query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { location: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [universities, total] = await Promise.all([
      prisma.university.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          location: true,
          _count: {
            select: {
              departments: true,
            },
          },
        },
      }),
      prisma.university.count({ where }),
    ]);

    return successResponse({
      universities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}


