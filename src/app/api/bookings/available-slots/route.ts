import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// All possible time slots
const ALL_TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

// Convert time slot string to hour number
// e.g. "9:00 AM" -> 9, "1:00 PM" -> 13
function timeToHour(timeSlot: string): number {
  const [time, period] = timeSlot.split(" ");
  const [hours] = time.split(":").map(Number);

  return period === "PM" && hours !== 12
    ? hours + 12
    : period === "AM" && hours === 12
    ? 0
    : hours;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    const selectedDate = new Date(dateParam);

    // Check if date is valid
    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Check if the entire day is blocked
    // --------------------------------------------------

    const dayStart = new Date(selectedDate);
    dayStart.setUTCHours(0, 0, 0, 0);

    const blockedDay = await prisma.blockedDay.findUnique({
      where: {
        date: dayStart,
      },
    });

    if (blockedDay) {
      return NextResponse.json({
        availableSlots: [],
        totalSlots: ALL_TIME_SLOTS.length,
        bookedCount: 0,
        blocked: true,
        blockedReason: blockedDay.reason ?? null,
      });
    }

    // --------------------------------------------------
    // Get start and end of selected day
    // --------------------------------------------------

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // --------------------------------------------------
    // Find bookings for this date
    // --------------------------------------------------

    const bookedSlots = await prisma.booking.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
      select: {
        date: true,
      },
    });

    // --------------------------------------------------
    // Extract booked hours
    // --------------------------------------------------

    const bookedHours = new Set<number>();

    for (const booking of bookedSlots) {
      const bookingDate = new Date(booking.date);

      // Use UTC hours because bookings are stored in UTC
      bookedHours.add(bookingDate.getUTCHours());
    }

    // --------------------------------------------------
    // Find available slots
    // --------------------------------------------------

    const availableSlots = ALL_TIME_SLOTS.filter((slot) => {
      // Convert "9:00 AM" -> 9
      const hour = timeToHour(slot);

      // Create date at the selected local time
      const tempDate = new Date(selectedDate);
      tempDate.setHours(hour, 0, 0, 0);

      // Convert local time to UTC hour
      const utcHour = tempDate.getUTCHours();

      return !bookedHours.has(utcHour);
    });

    // --------------------------------------------------
    // Return response
    // --------------------------------------------------

    return NextResponse.json({
      availableSlots,
      totalSlots: ALL_TIME_SLOTS.length,
      bookedCount: bookedHours.size,
      blocked: false,
      blockedReason: null,
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);

    return NextResponse.json(
      { error: "Failed to fetch available slots" },
      { status: 500 }
    );
  }
}