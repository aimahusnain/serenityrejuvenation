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
    const { sourceId, amount, productId } = body;

    if (!sourceId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: sourceId, amount" },
        { status: 400 }
      );
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
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, details: result.errors },
        { status: 400 }
      );
    }

    // Create payment record in database
    // Convert BigInt to string for JSON serialization
    const paymentMetadata = JSON.stringify(result.payment, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );

    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        // bookingId omitted - will be linked after booking is created
        amount,
        currency: "USD",
        status: "COMPLETED",
        squarePaymentId: result.payment?.id || null,
        squareReceiptUrl: result.payment?.receiptUrl || null,
        metadata: paymentMetadata,
      },
    });

    // Convert BigInt to string for JSON serialization
    const serializeBigInt = (obj: any): any => {
      if (typeof obj === 'bigint') {
        return obj.toString();
      }
      if (Array.isArray(obj)) {
        return obj.map(serializeBigInt);
      }
      if (obj && typeof obj === 'object') {
        const serialized: any = {};
        for (const key in obj) {
          serialized[key] = serializeBigInt(obj[key]);
        }
        return serialized;
      }
      return obj;
    };

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        squarePaymentId: payment.squarePaymentId,
        receiptUrl: payment.squareReceiptUrl,
      },
      squarePayment: serializeBigInt(result.payment),
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
