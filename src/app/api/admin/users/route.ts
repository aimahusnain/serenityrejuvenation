import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/admin/users - Update user role or delete user
export async function PATCH(request: NextRequest) {
  try {
    // Check for API key authentication first
    const apiKey = request.headers.get('x-api-key');
    let currentUserId = null;

    if (apiKey === process.env.ADMIN_API_KEY) {
      // API key is valid, proceed with request
    } else {
      // Fall back to session authentication
      const session = await auth();
      if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      currentUserId = session.user.id;
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (role !== "USER" && role !== "ADMIN") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Prevent admin from changing their own role (only applies to session auth)
    if (currentUserId && userId === currentUserId) {
      return NextResponse.json({ error: "Cannot modify your own role" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE /api/admin/users - Delete a user
export async function DELETE(request: NextRequest) {
  try {
    // Check for API key authentication first
    const apiKey = request.headers.get('x-api-key');
    let currentUserId = null;

    if (apiKey === process.env.ADMIN_API_KEY) {
      // API key is valid, proceed with request
    } else {
      // Fall back to session authentication
      const session = await auth();
      if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      currentUserId = session.user.id;
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Prevent admin from deleting themselves (only applies to session auth)
    if (currentUserId && userId === currentUserId) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    // Delete user and related data
    await prisma.$transaction([
      // Delete user preferences
      prisma.userPreferences.deleteMany({
        where: { userId },
      }),
      // Delete user bookings
      prisma.booking.deleteMany({
        where: { userId },
      }),
      // Delete user sessions
      prisma.session.deleteMany({
        where: { userId },
      }),
      // Delete user accounts
      prisma.account.deleteMany({
        where: { userId },
      }),
      // Delete user
      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User deletion error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
