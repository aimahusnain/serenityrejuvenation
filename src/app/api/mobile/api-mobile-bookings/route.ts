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
        { error: 'userId, serviceId, and date are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if service exists
    const service = await prisma.product.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId,
        date: new Date(date),
        notes: notes || null,
        paymentId: paymentId || null,
        status: 'PENDING',
      },
    });

    // Update booking with confirmation details
    const updatedBooking = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Get user phone from preferences if needed
    const userPreferences = await prisma.userPreferences.findUnique({
      where: { userId },
      select: { phone: true },
    });

    const responseBooking = updatedBooking ? {
      ...updatedBooking,
      user: updatedBooking.user ? {
        ...updatedBooking.user,
        phone: userPreferences?.phone || null,
      } : null,
    } : null;

    return NextResponse.json({
      success: true,
      booking: responseBooking,
      message: 'Booking created successfully',
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
        userId,
      },
      include: {
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
            squareReceiptUrl: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Get service details for each booking
    const bookingsWithServices = await Promise.all(
      bookings.map(async (booking) => {
        const service = await prisma.product.findUnique({
          where: { id: booking.serviceId },
          select: {
            id: true,
            title: true,
            price: true,
            description: true,
            image: true,
          },
        });

        return {
          ...booking,
          service,
        };
      })
    );

    return NextResponse.json({
      bookings: bookingsWithServices,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}