import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { moderationQuerySchema } from "@/lib/validation";
import { successResponse, errorResponse, unauthorizedResponse, rateLimitResponse } from "@/lib/api-response";
import { rateLimitMiddleware } from "@/lib/rate-limit";
import { isAdmin, getSession } from "@/lib/auth";

// Allowed emails for moderation (temporary until OAuth is fixed)
const ALLOWED_MODERATOR_EMAILS = ["superiormostafa@gmail.com"];

async function canModerate(request: NextRequest): Promise<boolean> {
  const session = await getSession(request);
  if (!session?.user?.email) return false;
  
  const isAllowedEmail = ALLOWED_MODERATOR_EMAILS.includes(session.user.email);
  const admin = await isAdmin(request);
  
  return isAllowedEmail || admin;
}

export async function GET(request: NextRequest) {
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
    const searchParams = request.nextUrl.searchParams;
    const queryParams = moderationQuerySchema.parse({
      status: searchParams.get("status") || "pending",
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
    });

    const { status, page, limit } = queryParams;
    const skip = (page - 1) * limit;

    const where =
      status === "all"
        ? {}
        : status === "reported"
        ? {
            reports: {
              some: {
                status: "pending",
              },
            },
            status: {
              not: "rejected", // Show pending/approved reviews that have reports
            },
          }
        : {
            status,
          };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { createdAt: "desc" },
        ],
        include: {
          advisor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              slug: true,
              department: {
                include: {
                  university: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          ratings: true,
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              reports: {
                where: {
                  status: "pending",
                },
              },
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return successResponse({
      reviews: reviews.map((review) => ({
        id: review.id,
        text: review.text,
        meetingType: review.meetingType,
        timeframe: review.timeframe,
        status: review.status,
        isVerified: review.isVerified || false,
        createdAt: review.createdAt.toISOString(),
        advisor: {
          id: review.advisor.id,
          name: `${review.advisor.firstName} ${review.advisor.lastName}`,
          slug: review.advisor.slug,
          department: review.advisor.department.name,
          university: review.advisor.department.university.name,
        },
        ratings: review.ratings.reduce(
          (acc, r) => ({ ...acc, [r.category]: r.rating }),
          {} as Record<string, number>
        ),
        tags: review.tags.map((rt) => rt.tag.name),
        reportCount: review._count.reports,
      })),
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

