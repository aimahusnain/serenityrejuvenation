import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const { date, excludeBookingId } = await request.json();

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const bookingDate = new Date(date);

    // Check for conflicting bookings
    const startOfHour = new Date(bookingDate);
    startOfHour.setMinutes(0, 0, 0);

    const endOfHour = new Date(bookingDate);
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
        ...(excludeBookingId && { id: { not: excludeBookingId } }),
      },
    });

    return NextResponse.json({
      hasConflict: !!conflictingBooking,
      conflictingBooking: conflictingBooking
        ? {
            id: conflictingBooking.id,
            date: conflictingBooking.date,
          }
        : null,
    });
  } catch (error) {
    console.error("Error checking conflicts:", error);
    return NextResponse.json({ error: "Failed to check conflicts" }, { status: 500 });
  }
}
