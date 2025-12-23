import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

// Delete university (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check if university has departments
    const university = await prisma.university.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });

    if (!university) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    if (university._count.departments > 0) {
      return NextResponse.json(
        { error: "Cannot delete university with existing departments. Please delete departments first." },
        { status: 400 }
      );
    }

    await prisma.university.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting university:", error);
    return NextResponse.json(
      { error: "Failed to delete university" },
      { status: 500 }
    );
  }
}

