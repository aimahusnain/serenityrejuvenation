import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/square";

// Square webhook event types
const SQUARE_WEBHOOK_SIGNATURE = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-square-hmacsha256-signature");

    // Verify webhook signature
    if (SQUARE_WEBHOOK_SIGNATURE && signature) {
      const isValid = verifyWebhookSignature(
        body,
        signature,
        SQUARE_WEBHOOK_SIGNATURE
      );

      if (!isValid) {
        console.error("Invalid webhook signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const event = JSON.parse(body);
    const { type, data } = event;

    // Handle different webhook events
    switch (type) {
      case "payment.created":
      case "payment.updated": {
        const payment = data.object?.payment;
        if (!payment) break;

        // Find the payment record by squarePaymentId
        const existingPayment = await prisma.payment.findUnique({
          where: { squarePaymentId: payment.id },
          include: { bookings: true },
        });

        if (existingPayment) {
          // Update payment status
          const statusMap: Record<string, "COMPLETED" | "FAILED" | "REFUNDED"> =
            {
              APPROVED: "COMPLETED",
              COMPLETED: "COMPLETED",
              FAILED: "FAILED",
              CANCELED: "FAILED",
              REFUNDED: "REFUNDED",
            };

          const newStatus = statusMap[payment.status!] || existingPayment.status;

          await prisma.payment.update({
            where: { id: existingPayment.id },
            data: {
              status: newStatus,
              metadata: JSON.stringify(payment),
            },
          });

          // If payment is completed and has bookings, confirm them
          if (newStatus === "COMPLETED" && existingPayment.bookings && existingPayment.bookings.length > 0) {
            for (const booking of existingPayment.bookings) {
              await prisma.booking.update({
                where: { id: booking.id },
                data: { status: "CONFIRMED" },
              });
            }
          }
        }
        break;
      }

      case "refund.created":
      case "refund.updated": {
        const refund = data.object?.refund;
        if (!refund) break;

        // Find the payment by squarePaymentId (refund references payment)
        const payment = await prisma.payment.findUnique({
          where: { squarePaymentId: refund.paymentId },
        });

        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "REFUNDED",
              metadata: JSON.stringify(refund),
            },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled webhook event type: ${type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
