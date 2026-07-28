import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/staff - List all staff
export async function GET(request: NextRequest) {
  try {
    // Check for API key authentication first
    const apiKey = request.headers.get('x-api-key');
    if (apiKey === process.env.ADMIN_API_KEY) {
      // API key is valid, proceed with request
    } else {
      // Fall back to session authentication
      const session = await auth();
      if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const staff = await prisma.staff.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ staff });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

// POST /api/admin/staff - Create new staff member
export async function POST(request: NextRequest) {
  try {
    // Check for API key authentication first
    const apiKey = request.headers.get('x-api-key');
    if (apiKey === process.env.ADMIN_API_KEY) {
      // API key is valid, proceed with request
    } else {
      // Fall back to session authentication
      const session = await auth();
      if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await request.json();
    const { name, role, email, phone, rating } = body;

    // Validation
    if (!name || !role) {
      return NextResponse.json({ error: "Name and role are required" }, { status: 400 });
    }

    const staff = await prisma.staff.create({
      data: {
        name,
        role,
        email: email || null,
        phone: phone || null,
        rating: rating || 0,
        isActive: true,
        clientsServed: 0,
        revenueGenerated: 0,
      },
    });

    return NextResponse.json({ success: true, staff });
  } catch (error) {
    console.error("Error creating staff:", error);
    return NextResponse.json({ error: "Failed to create staff" }, { status: 500 });
  }
}

// PATCH /api/admin/staff - Update staff member
export async function PATCH(request: NextRequest) {
  try {
    // Check for API key authentication first
    const apiKey = request.headers.get('x-api-key');
    if (apiKey === process.env.ADMIN_API_KEY) {
      // API key is valid, proceed with request
    } else {
      // Fall back to session authentication
      const session = await auth();
      if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await request.json();
    const { id, name, role, email, phone, rating, isActive, clientsServed, revenueGenerated } = body;

    if (!id) {
      return NextResponse.json({ error: "Staff ID is required" }, { status: 400 });
    }

    const updated = await prisma.staff.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(email !== undefined && { email: email || null }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(rating !== undefined && { rating }),
        ...(isActive !== undefined && { isActive }),
        ...(clientsServed !== undefined && { clientsServed }),
        ...(revenueGenerated !== undefined && { revenueGenerated }),
      },
    });

    return NextResponse.json({ success: true, staff: updated });
  } catch (error) {
    console.error("Error updating staff:", error);
    return NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
  }
}

// DELETE /api/admin/staff - Delete staff member
export async function DELETE(request: NextRequest) {
  try {
    // Check for API key authentication first
    const apiKey = request.headers.get('x-api-key');
    if (apiKey === process.env.ADMIN_API_KEY) {
      // API key is valid, proceed with request
    } else {
      // Fall back to session authentication
      const session = await auth();
      if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Staff ID is required" }, { status: 400 });
    }

    await prisma.staff.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting staff:", error);
    return NextResponse.json({ error: "Failed to delete staff" }, { status: 500 });
  }
}
