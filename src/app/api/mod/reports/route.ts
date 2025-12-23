import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
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
    const status = searchParams.get("status") || "pending";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const skip = (page - 1) * limit;

    const where =
      status === "all"
        ? {}
        : {
            status,
          };

    const [reports, total] = await Promise.all([
      prisma.reviewReport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          review: {
            include: {
              advisor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
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
            },
          },
        },
      }),
      prisma.reviewReport.count({ where }),
    ]);

    return successResponse({
      reports: reports.map((report) => ({
        id: report.id,
        reviewId: report.reviewId,
        reason: report.reason,
        details: report.details,
        status: report.status,
        createdAt: report.createdAt,
        review: {
          id: report.review.id,
          text: report.review.text,
          advisor: {
            id: report.review.advisor.id,
            name: `${report.review.advisor.firstName} ${report.review.advisor.lastName}`,
            department: report.review.advisor.department.name,
            university: report.review.advisor.department.university.name,
          },
        },
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

