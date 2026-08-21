// /api/mobile/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, serviceId, date, notes, paymentId } = body;

    // Validate required fields
    if (!userId || !serviceId || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, serviceId, date' },
        { status: 400 }
      );
    }

    // Parse the booking date
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Extract date part for checking blocked days
    const dateOnly = new Date(bookingDate);
    dateOnly.setHours(0, 0, 0, 0);

    // Check if the date is blocked
    const blockedDay = await prisma.blockedDay.findUnique({
      where: { date: dateOnly }
    });

    if (blockedDay) {
      // Entire day is blocked
      return NextResponse.json(
        { 
          error: 'This date is not available for booking',
          reason: blockedDay.reason || 'Date blocked by admin'
        },
        { status: 409 }
      );
    }

    // Check for existing booking at the same date and time
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: bookingDate,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    });

    if (existingBooking) {
      const existingTime = `${bookingDate.getHours().toString().padStart(2, '0')}:${bookingDate.getMinutes().toString().padStart(2, '0')}`;
      return NextResponse.json(
        { 
          error: 'This time slot is already booked',
          message: `Time slot ${existingTime} is already taken. Please select a different time.`,
          existingBookingId: existingBooking.id
        },
        { status: 409 }
      );
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId,
        date: bookingDate,
        notes,
        paymentId,
        status: 'PENDING'
      }
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        date: booking.date,
        status: booking.status
      },
      message: 'Booking created successfully'
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// Get user's bookings
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId
      },
      include: {
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json({
      bookings,
      total: bookings.length
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}