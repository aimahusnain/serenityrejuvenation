import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/bookings/[id] - Get single booking details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}

// PATCH /api/admin/bookings/[id] - Update booking (reschedule)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const { date, status } = await request.json();

    if (!date && !status) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // If rescheduling, check for conflicts
    if (date) {
      const newDate = new Date(date);

      const startOfHour = new Date(newDate);
      startOfHour.setMinutes(0, 0, 0);

      const endOfHour = new Date(newDate);
      endOfHour.setMinutes(59, 59, 999);

      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          date: {
            gte: startOfHour,
            lte: endOfHour,
          },
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
          id: { not: id }, // Exclude current booking
        },
      });

      if (conflictingBooking) {
        return NextResponse.json(
          {
            error: "This time slot is already booked. Please choose a different time.",
            hasConflict: true,
          },
          { status: 409 }
        );
      }
    }

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        ...(date && { date: new Date(date) }),
        ...(status && { status }),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

// DELETE /api/admin/bookings/[id] - Delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check for API key authentication first
    const apiKey = request.headers.get('x-api-key');
    let isAdmin = false;
    let userId = null;

    if (apiKey === process.env.ADMIN_API_KEY) {
      // API key has full admin access
      isAdmin = true;
    } else {
      // Fall back to session authentication
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      isAdmin = session.user.role === "ADMIN";
      userId = session.user.id;
    }

    const { id } = await params;

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Allow users to delete their own PENDING bookings, or admins to delete any booking
    const isOwner = userId === existingBooking.userId;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow deleting PENDING bookings (for non-admins)
    if (!isAdmin && existingBooking.status !== "PENDING") {
      return NextResponse.json(
        { error: "Can only delete pending bookings" },
        { status: 400 }
      );
    }

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
