import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, rateLimitResponse } from "@/lib/api-response";
import { rateLimitMiddleware } from "@/lib/rate-limit";
import { z } from "zod";

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
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all";

    // Verify university exists
    const university = await prisma.university.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!university) {
      return errorResponse("University not found", 404);
    }

    const searchTerm = query.trim().toLowerCase();
    const results: any = {
      departments: [],
      advisors: [],
    };

    // Search departments at this university
    if ((type === "all" || type === "department") && query.trim().length >= 2) {
      const departments = await prisma.department.findMany({
        where: {
          AND: [
            { universityId: id },
            {
              OR: [
                { name: { contains: searchTerm, mode: "insensitive" as const } },
                { slug: { contains: searchTerm, mode: "insensitive" as const } },
              ],
            },
          ],
        },
        take: 20,
        orderBy: { name: "asc" },
        include: {
          university: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              advisors: true,
            },
          },
        },
      });

      results.departments = departments.map((d) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        university: {
          id: d.university.id,
          name: d.university.name,
          slug: d.university.slug,
        },
        advisorCount: d._count.advisors,
      }));
    }

    // Search advisors at this university (prioritized)
    if ((type === "all" || type === "advisor") && query.trim().length >= 2) {
      const advisors = await prisma.advisor.findMany({
        where: {
          AND: [
            { isActive: true },
            { department: { universityId: id } },
            {
              OR: [
                { firstName: { contains: searchTerm, mode: "insensitive" as const } },
                { lastName: { contains: searchTerm, mode: "insensitive" as const } },
                { slug: { contains: searchTerm, mode: "insensitive" as const } },
                { title: { contains: searchTerm, mode: "insensitive" as const } },
              ],
            },
          ],
        },
        take: 20,
        orderBy: [
          { department: { name: "asc" } },
          { lastName: "asc" },
          { firstName: "asc" },
        ],
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
      });

      results.advisors = advisors.map((a) => ({
        id: a.id,
        name: `${a.firstName} ${a.lastName}`,
        slug: a.slug,
        title: a.title,
        department: {
          id: a.department.id,
          name: a.department.name,
          slug: a.department.slug,
        },
        university: {
          id: a.department.university.id,
          name: a.department.university.name,
          slug: a.department.university.slug,
        },
        reviewCount: a._count.reviews,
      }));
    }

    return successResponse(results);
  } catch (error) {
    console.error("University search error:", error);
    return errorResponse("Internal server error", 500);
  }
}


