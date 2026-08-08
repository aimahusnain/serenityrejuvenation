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

    const [service, bookingUser] = await Promise.all([
      prisma.product.findUnique({
        where: { id: serviceId },
        select: { title: true },
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          name: true,
          email: true,
          preferences: {
            select: { phone: true },
          },
        },
      }),
    ]);

    const emailUrl = new URL("/api/sendemail", request.url).toString();
    console.log("=== SENDING APPOINTMENT EMAILS ===");
    console.log("Booking ID:", booking.id);
    console.log("User email:", bookingUser?.email || session.user.email);
    console.log("Service:", service?.title);
    console.log("Appointment date:", booking.date);
    
    const emailResponse = await fetch(emailUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "appointment",
        name: bookingUser?.name || session.user.name || "Customer",
        email: bookingUser?.email || session.user.email || "",
        service: service?.title || "Selected service",
        appointmentDate: booking.date,
        notes: booking.notes || "",
        phone: bookingUser?.preferences?.phone || null,
      }),
    });

    if (!emailResponse.ok) {
      const responseBody = await emailResponse.json().catch(() => ({}));
      console.error("=== APPOINTMENT EMAIL FAILED ===");
      console.error("Status:", emailResponse.status);
      console.error("Response:", responseBody);
      console.error("===============================");
    } else {
      console.log("=== APPOINTMENT EMAILS SENT SUCCESSFULLY ===");
    }

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
