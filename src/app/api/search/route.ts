import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, rateLimitResponse } from "@/lib/api-response";
import { rateLimitMiddleware } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimit = rateLimitMiddleware(request, {
    maxRequests: 100,
    windowMs: 60000,
  });
  if (rateLimit) return rateLimit;

  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all"; // all, university, department, advisor

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters" },
        { status: 400 }
      );
    }

    const searchTerm = query.trim().toLowerCase();
    const results: any = {
      universities: [],
      departments: [],
      advisors: [],
    };

    // Search universities
    if (type === "all" || type === "university") {
      const universities = await prisma.university.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { slug: { contains: searchTerm, mode: "insensitive" } },
            { location: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        take: 20,
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: {
              departments: true,
            },
          },
        },
      });

      results.universities = universities.map((u) => ({
        id: u.id,
        name: u.name,
        slug: u.slug,
        location: u.location,
        departmentCount: u._count.departments,
      }));
    }

    // Search departments
    if (type === "all" || type === "department") {
      const departments = await prisma.department.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { slug: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        take: 20,
        orderBy: [
          { university: { name: "asc" } },
          { name: "asc" },
        ],
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

    // Search advisors
    if (type === "all" || type === "advisor") {
      const advisors = await prisma.advisor.findMany({
        where: {
          AND: [
            { isActive: true },
            {
              OR: [
                { firstName: { contains: searchTerm, mode: "insensitive" } },
                { lastName: { contains: searchTerm, mode: "insensitive" } },
                { slug: { contains: searchTerm, mode: "insensitive" } },
                { title: { contains: searchTerm, mode: "insensitive" } },
              ],
            },
          ],
        },
        take: 20,
        orderBy: [
          { department: { university: { name: "asc" } } },
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
    console.error("Search error:", error);
    return errorResponse("Internal server error", 500);
  }
}

