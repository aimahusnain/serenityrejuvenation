// /api/mobile/available-slots/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get available time slots for a specific date
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Parse the date
    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

    // Check if the entire day is blocked
    const blockedDay = await prisma.blockedDay.findUnique({
      where: { date: startOfDay }
    });

    if (blockedDay) {
      // Entire day is blocked
      return NextResponse.json({
        availableSlots: [],
        bookedSlots: [],
        date: date,
        message: blockedDay.reason || 'This date is not available for booking'
      });
    }

    // Get all bookings for this date
    const bookedSlots = await prisma.booking.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      select: {
        date: true,
      },
    });

    // Generate all possible time slots (9 AM - 6 PM)
    const allSlots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        allSlots.push(timeSlot);
      }
    }

    // Filter out booked slots
    const bookedTimes = bookedSlots.map(booking => {
      const bookingDate = new Date(booking.date);
      return `${bookingDate.getHours().toString().padStart(2, '0')}:${bookingDate.getMinutes().toString().padStart(2, '0')}`;
    });

    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

    return NextResponse.json({
      availableSlots,
      bookedSlots: bookedTimes,
      date: date,
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    );
  }
}