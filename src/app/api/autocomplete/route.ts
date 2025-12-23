import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, rateLimitResponse } from "@/lib/api-response";
import { rateLimitMiddleware } from "@/lib/rate-limit";

/**
 * Normalize string for search (lowercase, remove punctuation)
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();
}

/**
 * Calculate relevance score for a match
 */
function calculateScore(query: string, text: string): number {
  const normalizedQuery = normalizeString(query);
  const normalizedText = normalizeString(text);
  
  // Exact match
  if (normalizedText === normalizedQuery) return 100;
  
  // Starts with query
  if (normalizedText.startsWith(normalizedQuery)) return 80;
  
  // Includes query
  if (normalizedText.includes(normalizedQuery)) return 60;
  
  // Word starts with query
  const words = normalizedText.split(/\s+/);
  const wordMatch = words.some((word) => word.startsWith(normalizedQuery));
  if (wordMatch) return 40;
  
  return 0;
}

/**
 * Check if query looks like a person name
 */
function looksLikePersonName(query: string): boolean {
  const words = query.trim().split(/\s+/);
  if (words.length < 2) return false;
  
  const firstWord = words[0];
  const secondWord = words[1];
  
  return (
    firstWord.length > 0 &&
    secondWord.length > 0 &&
    firstWord[0] === firstWord[0].toUpperCase() &&
    secondWord[0] === secondWord[0].toUpperCase() &&
    /^[A-Z]/.test(firstWord) &&
    /^[A-Z]/.test(secondWord)
  );
}

/**
 * Check if query suggests a department (engineering, cs, etc.)
 */
function suggestsDepartment(query: string): boolean {
  const normalized = normalizeString(query);
  const departmentKeywords = [
    "engineering",
    "computer science",
    "cs",
    "math",
    "physics",
    "chemistry",
    "biology",
    "business",
    "economics",
    "psychology",
    "history",
    "english",
    "department",
    "dept",
  ];
  
  return departmentKeywords.some((keyword) => normalized.includes(keyword));
}

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimit = rateLimitMiddleware(request, {
    maxRequests: 100,
    windowMs: 60000,
  });
  if (rateLimit) return rateLimit;

  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const universityId = searchParams.get("universityId") || undefined;
    const departmentId = searchParams.get("departmentId") || undefined;

    if (!query || query.trim().length < 1) {
      return successResponse({
        universities: [],
        departments: [],
        advisors: [],
      });
    }

    const searchTerm = query.trim();
    const isPersonName = looksLikePersonName(searchTerm);
    const isDepartmentQuery = suggestsDepartment(searchTerm);

    const results: any = {
      universities: [],
      departments: [],
      advisors: [],
    };

    // Search universities (only if not in department context)
    if (!departmentId) {
      const universities = await prisma.university.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" as const } },
            { slug: { contains: searchTerm, mode: "insensitive" as const } },
            { location: { contains: searchTerm, mode: "insensitive" as const } },
          ],
        },
        take: 6,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          location: true,
        },
      });

      // Score and sort universities
      const scored = universities
        .map((u) => ({
          ...u,
          score: Math.max(
            calculateScore(searchTerm, u.name),
            calculateScore(searchTerm, u.location || "")
          ),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

      results.universities = scored.map((u) => ({
        id: u.id,
        name: u.name,
        slug: u.slug,
        location: u.location,
      }));
    }

    // Search departments
    const departmentWhere: any = {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" as const } },
        { slug: { contains: searchTerm, mode: "insensitive" as const } },
      ],
    };

    if (universityId) {
      departmentWhere.universityId = universityId;
    }

    const departments = await prisma.department.findMany({
      where: departmentWhere,
      take: 6,
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
      },
    });

    // Score and sort departments (boost if department query)
    const scoredDepartments = departments
      .map((d) => ({
        ...d,
        score: calculateScore(searchTerm, d.name) + (isDepartmentQuery ? 20 : 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    results.departments = scoredDepartments.map((d) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      university: {
        id: d.university.id,
        name: d.university.name,
        slug: d.university.slug,
      },
    }));

    // Search advisors
    let advisorWhere: any;
    
    if (departmentId) {
      // In department context: get university ID first, then search all advisors in university
      // We'll sort by departmentId to prioritize current department
      const department = await prisma.department.findUnique({
        where: { id: departmentId },
        select: { universityId: true },
      });
      
      if (department) {
        advisorWhere = {
          AND: [
            { isActive: true },
            {
              department: {
                universityId: department.universityId,
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
        };
      } else {
        advisorWhere = {
          AND: [
            { isActive: true },
            {
              OR: [
                { firstName: { contains: searchTerm, mode: "insensitive" as const } },
                { lastName: { contains: searchTerm, mode: "insensitive" as const } },
                { slug: { contains: searchTerm, mode: "insensitive" as const } },
                { title: { contains: searchTerm, mode: "insensitive" as const } },
              ],
            },
          ],
        };
      }
    } else if (universityId) {
      // In university context: filter to that university
      advisorWhere = {
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
      };
    } else {
      // Global context
      advisorWhere = {
        AND: [
          { isActive: true },
          {
            OR: [
              { firstName: { contains: searchTerm, mode: "insensitive" as const } },
              { lastName: { contains: searchTerm, mode: "insensitive" as const } },
              { slug: { contains: searchTerm, mode: "insensitive" as const } },
              { title: { contains: searchTerm, mode: "insensitive" as const } },
            ],
          },
        ],
      };
    }

    const advisors = await prisma.advisor.findMany({
      where: advisorWhere,
      take: departmentId ? 20 : 6, // Fetch more if in department context to allow sorting
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
      },
    });

    // Score and sort advisors (boost if person name)
    const scoredAdvisors = advisors
      .map((a) => ({
        ...a,
        score:
          Math.max(
            calculateScore(searchTerm, a.firstName),
            calculateScore(searchTerm, a.lastName),
            calculateScore(searchTerm, `${a.firstName} ${a.lastName}`)
          ) + (isPersonName ? 30 : 0),
        isCurrentDepartment: departmentId ? a.department.id === departmentId : false,
      }))
      .sort((a, b) => {
        // In department context, prioritize current department
        if (departmentId) {
          if (a.isCurrentDepartment && !b.isCurrentDepartment) return -1;
          if (!a.isCurrentDepartment && b.isCurrentDepartment) return 1;
        }
        return b.score - a.score;
      })
      .slice(0, departmentId ? 10 : 6);

    results.advisors = scoredAdvisors.map((a) => ({
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

    return successResponse(results);
  } catch (error) {
    console.error("Autocomplete error:", error);
    return errorResponse("Internal server error", 500);
  }
}

