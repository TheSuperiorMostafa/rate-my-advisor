import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { z } from "zod";

// Create department (admin only)
const createDepartmentSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  universityId: z.string().uuid(),
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
    const data = createDepartmentSchema.parse(body);

    // Verify university exists
    const university = await prisma.university.findUnique({
      where: { id: data.universityId },
    });

    if (!university) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    // Check if slug already exists for this university
    const existing = await prisma.department.findFirst({
      where: {
        slug: data.slug,
        universityId: data.universityId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A department with this slug already exists in this university" },
        { status: 400 }
      );
    }

    const department = await prisma.department.create({
      data: {
        name: data.name,
        slug: data.slug,
        universityId: data.universityId,
      },
      include: {
        university: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating department:", error);
    return NextResponse.json(
      { error: "Failed to create department" },
      { status: 500 }
    );
  }
}

// Get all departments (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const departments = await prisma.department.findMany({
      orderBy: [
        { university: { name: "asc" } },
        { name: "asc" },
      ],
      include: {
        university: {
          select: {
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

    return NextResponse.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

