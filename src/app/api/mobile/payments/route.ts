// /api/mobile/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a payment record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, bookingId, squarePaymentId, squareReceiptUrl } = body;

    // Validate required fields
    if (!userId || !amount) {
      return NextResponse.json(
        { error: 'userId and amount are required' },
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

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: parseFloat(amount),
        currency: 'USD',
        status: 'COMPLETED',
        squarePaymentId: squarePaymentId || null,
        squareReceiptUrl: squareReceiptUrl || null,
        bookingId: bookingId || null,
      },
    });

    // If bookingId is provided, update booking status
    if (bookingId) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
          paymentId: payment.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        squareReceiptUrl: payment.squareReceiptUrl,
      },
      message: 'Payment processed successfully',
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

// Get payment status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'paymentId parameter is required' },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          select: {
            id: true,
            date: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      payment,
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment' },
      { status: 500 }
    );
  }
}