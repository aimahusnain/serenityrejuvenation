import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createSquarePayment,
  dollarsToCents,
  generateIdempotencyKey,
} from "@/lib/square";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sourceId, amount, bookingId, productId } = body;

    if (!sourceId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: sourceId, amount" },
        { status: 400 }
      );
    }

    // Verify the booking belongs to the user
    let booking;
    if (bookingId) {
      booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { user: true },
      });

      if (!booking || booking.userId !== session.user.id) {
        return NextResponse.json({ error: "Invalid booking" }, { status: 400 });
      }
    }

    // Get product details if productId is provided
    let product;
    if (productId) {
      product = await prisma.product.findUnique({
        where: { id: productId },
      });
    }

    // Create the payment with Square
    const idempotencyKey = generateIdempotencyKey();
    const result = await createSquarePayment({
      sourceId,
      amountMoney: {
        amount: dollarsToCents(amount),
        currency: "USD",
      },
      idempotencyKey,
      // referenceId: bookingId || productId,
      // note: product?.title
      //   ? `Payment for ${product.title}`
      //   : bookingId
      //   ? `Payment for booking ${bookingId}`
      //   : "Service payment",
    });

    if (!result.success) {
      // If payment failed and we have a booking, update its status
      if (bookingId) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: "CANCELLED" },
        });
      }

      return NextResponse.json(
        { error: result.error, details: result.errors },
        { status: 400 }
      );
    }

    // Create or update payment record in database
    const payment = await prisma.payment.upsert({
      where: {
        bookingId: (bookingId || "") as string,
      },
      create: {
        userId: session.user.id,
        bookingId: bookingId || null,
        amount,
        currency: "USD",
        status: "COMPLETED",
        squarePaymentId: result.payment?.id || null,
        squareReceiptUrl: result.payment?.receiptUrl || null,
        metadata: JSON.stringify(result.payment),
      },
      update: {
        status: "COMPLETED",
        squarePaymentId: result.payment?.id || null,
        squareReceiptUrl: result.payment?.receiptUrl || null,
        metadata: JSON.stringify(result.payment),
        error: null,
      },
    });

    // If we have a booking, update it with payment reference and confirm it
    if (bookingId) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          paymentId: payment.id,
          status: "CONFIRMED",
        },
      });
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        squarePaymentId: payment.squarePaymentId,
        receiptUrl: payment.squareReceiptUrl,
      },
      squarePayment: result.payment,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
