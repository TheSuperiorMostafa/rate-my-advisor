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
    const query = searchParams.get("q") || searchParams.get("query") || "";
    const type = searchParams.get("type") || "all"; // all, university, department, advisor
    const universityId = searchParams.get("universityId") || undefined;

    // Allow empty query for top universities
    const searchTerm = query.trim().toLowerCase();
    const results: any = {
      universities: [],
      departments: [],
      advisors: [],
    };

    // If universityId is provided, only search advisors and departments (not universities)
    // If no universityId, only search universities
    if (!universityId && (type === "all" || type === "university")) {
      const where = query.trim().length >= 2
        ? {
            OR: [
              { name: { contains: searchTerm, mode: "insensitive" as const } },
              { slug: { contains: searchTerm, mode: "insensitive" as const } },
              { location: { contains: searchTerm, mode: "insensitive" as const } },
            ],
          }
        : {};

      const universities = await prisma.university.findMany({
        where,
        take: 8, // Limit for nav search
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          location: true,
        },
      });

      results.universities = universities.map((u) => ({
        id: u.id,
        name: u.name,
        slug: u.slug,
        location: u.location,
      }));
    }

    // Search departments (only if query is 2+ chars, and if universityId is provided or type includes department)
    if ((type === "all" || type === "department") && query.trim().length >= 2 && universityId) {
      const departments = await prisma.department.findMany({
        where: {
          AND: [
            { universityId: universityId },
            {
              OR: [
                { name: { contains: searchTerm, mode: "insensitive" as const } },
                { slug: { contains: searchTerm, mode: "insensitive" as const } },
              ],
            },
          ],
        },
        take: 8, // Limit for nav search
        orderBy: { name: "asc" },
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

      results.departments = departments.map((d) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        university: {
          id: d.university.id,
          name: d.university.name,
          slug: d.university.slug,
        },
      }));
    }

    // Search advisors (only if query is 2+ chars, and if universityId is provided or type includes advisor)
    if ((type === "all" || type === "advisor") && query.trim().length >= 2 && universityId) {
      const advisors = await prisma.advisor.findMany({
        where: {
          AND: [
            { isActive: true },
            {
              department: {
                universityId: universityId,
              },
            },
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
        take: 8, // Limit for nav search
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
        },
      });

      results.advisors = advisors.map((a) => ({
        id: a.id,
        name: `${a.firstName} ${a.lastName}`,
        slug: a.slug,
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
      }));
    }

    return successResponse(results);
  } catch (error) {
    console.error("Search error:", error);
    return errorResponse("Internal server error", 500);
  }
}
