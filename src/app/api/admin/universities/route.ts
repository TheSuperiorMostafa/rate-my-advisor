import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { z } from "zod";

// Create university (admin only)
const createUniversitySchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().max(5000).optional(),
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
    const data = createUniversitySchema.parse(body);

    // Check if slug already exists
    const existing = await prisma.university.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A university with this slug already exists" },
        { status: 400 }
      );
    }

    const university = await prisma.university.create({
      data: {
        name: data.name,
        slug: data.slug,
        location: data.location,
        website: data.website || null,
        description: data.description,
      },
    });

    return NextResponse.json(university, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating university:", error);
    return NextResponse.json(
      { error: "Failed to create university" },
      { status: 500 }
    );
  }
}

// Get all universities (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const universities = await prisma.university.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });

    return NextResponse.json(universities);
  } catch (error) {
    console.error("Error fetching universities:", error);
    return NextResponse.json(
      { error: "Failed to fetch universities" },
      { status: 500 }
    );
  }
}

