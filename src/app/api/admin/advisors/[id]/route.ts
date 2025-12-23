import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

// Delete advisor (admin only)
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

    // Check if advisor has reviews
    const advisor = await prisma.advisor.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!advisor) {
      return NextResponse.json(
        { error: "Advisor not found" },
        { status: 404 }
      );
    }

    if (advisor._count.reviews > 0) {
      return NextResponse.json(
        { error: "Cannot delete advisor with existing reviews. Reviews must be deleted first." },
        { status: 400 }
      );
    }

    await prisma.advisor.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting advisor:", error);
    return NextResponse.json(
      { error: "Failed to delete advisor" },
      { status: 500 }
    );
  }
}


