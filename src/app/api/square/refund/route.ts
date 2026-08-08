import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createRefund,
  dollarsToCents,
  generateIdempotencyKey,
} from "@/lib/square";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can process refunds
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { paymentId, amount, reason } = body;

    if (!paymentId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: paymentId, amount" },
        { status: 400 }
      );
    }

    // Get the payment record
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { 
        user: true,
        bookings: true,
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (!payment.squarePaymentId) {
      return NextResponse.json(
        { error: "No Square payment associated with this record" },
        { status: 400 }
      );
    }

    if (payment.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Can only refund completed payments" },
        { status: 400 }
      );
    }

    // Create the refund with Square
    const idempotencyKey = generateIdempotencyKey();
    const result = await createRefund({
      paymentId: payment.squarePaymentId,
      amountMoney: {
        amount: dollarsToCents(amount),
        currency: "USD",
      },
      idempotencyKey,
      reason: reason || "Refund requested",
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Update payment status to refunded
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "REFUNDED",
        metadata: JSON.stringify(result.refund),
      },
    });

    // Also update the booking status if applicable
    if (payment.bookings && payment.bookings.length > 0) {
      for (const booking of payment.bookings) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "CANCELLED" },
        });
      }
    }

    return NextResponse.json({
      success: true,
      refund: {
        id: result.refund?.id,
        amount: result.refund?.amountMoney?.amount,
        status: result.refund?.status,
      },
    });
  } catch (error) {
    console.error("Refund processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
