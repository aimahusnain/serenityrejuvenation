import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPaymentDetails } from "@/lib/square";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { squarePaymentId } = body;

    if (!squarePaymentId) {
      return NextResponse.json(
        { error: "Missing squarePaymentId" },
        { status: 400 }
      );
    }

    // Get payment details from Square
    const result = await getPaymentDetails(squarePaymentId);

    if (!result.success || !result.payment) {
      return NextResponse.json(
        { error: result.error || "Failed to get payment details" },
        { status: 400 }
      );
    }

    const squarePayment = result.payment;

    // Find the payment record in our database
    const payment = await prisma.payment.findUnique({
      where: { squarePaymentId },
      include: { booking: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Verify ownership
    if (payment.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update payment status based on Square status
    const statusMap: Record<string, "COMPLETED" | "FAILED" | "REFUNDED"> = {
      APPROVED: "COMPLETED",
      COMPLETED: "COMPLETED",
      FAILED: "FAILED",
      CANCELED: "FAILED",
      REFUNDED: "REFUNDED",
    };

    const newStatus = statusMap[squarePayment.status!] || payment.status;

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: newStatus,
        metadata: JSON.stringify(squarePayment),
      },
    });

    // If payment is completed and has a booking, confirm the booking
    if (newStatus === "COMPLETED" && payment.booking) {
      await prisma.booking.update({
        where: { id: payment.bookingId! },
        data: { status: "CONFIRMED" },
      });
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: newStatus,
        amount: payment.amount,
        squarePaymentId: payment.squarePaymentId,
        receiptUrl: payment.squareReceiptUrl,
      },
      squarePayment,
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
