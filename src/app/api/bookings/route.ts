import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { serviceId, date, notes, status, paymentId } = await request.json();
    if (!serviceId || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const bookingDate = new Date(date);

    // Check for conflicting existing bookings (same date and hour)
    // Use UTC methods to avoid timezone issues
    const startOfHour = new Date(Date.UTC(
      bookingDate.getUTCFullYear(),
      bookingDate.getUTCMonth(),
      bookingDate.getUTCDate(),
      bookingDate.getUTCHours(),
      0, 0, 0
    ));

    const endOfHour = new Date(Date.UTC(
      bookingDate.getUTCFullYear(),
      bookingDate.getUTCMonth(),
      bookingDate.getUTCDate(),
      bookingDate.getUTCHours(),
      59, 59, 999
    ));

    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        date: {
          gte: startOfHour,
          lte: endOfHour,
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        {
          error: "This time slot is already booked. Please choose a different time.",
          conflictingTime: conflictingBooking.date,
        },
        { status: 409 } // 409 Conflict
      );
    }

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        serviceId,
        date: bookingDate,
        notes: notes ?? null,
        status: status || "PENDING",
        paymentId: paymentId || null,
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, status } = await request.json();
    if (!bookingId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
