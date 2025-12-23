import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { z } from "zod";

// Create advisor (admin only)
const createAdvisorSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  departmentId: z.string().uuid(),
  title: z.string().max(200).optional(),
  email: z.string().email().optional().or(z.literal("")),
  bio: z.string().max(5000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = createAdvisorSchema.parse(body);

    // Verify department exists
    const department = await prisma.department.findUnique({
      where: { id: data.departmentId },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    // Check if slug already exists for this department
    const existing = await prisma.advisor.findFirst({
      where: {
        slug: data.slug,
        departmentId: data.departmentId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An advisor with this slug already exists in this department" },
        { status: 400 }
      );
    }

    const advisor = await prisma.advisor.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        slug: data.slug,
        departmentId: data.departmentId,
        title: data.title,
        email: data.email || null,
        bio: data.bio,
      },
      include: {
        department: {
          include: {
            university: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(advisor, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating advisor:", error);
    return NextResponse.json(
      { error: "Failed to create advisor" },
      { status: 500 }
    );
  }
}

// Get all advisors (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const advisors = await prisma.advisor.findMany({
      orderBy: [
        { department: { university: { name: "asc" } } },
        { department: { name: "asc" } },
        { name: "asc" },
      ],
      include: {
        department: {
          include: {
            university: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    return NextResponse.json(advisors);
  } catch (error) {
    console.error("Error fetching advisors:", error);
    return NextResponse.json(
      { error: "Failed to fetch advisors" },
      { status: 500 }
    );
  }
}

