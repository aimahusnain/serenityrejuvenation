// app/api/mobile/process-card-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  createSquarePayment,
  dollarsToCents,
  generateIdempotencyKey,
} from "@/lib/square";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      cardDetails,
      amount,
      bookingId,
    } = body;

    // Validate required fields
    if (!cardDetails || !amount) {
      return NextResponse.json(
        { error: "Missing cardDetails or amount" },
        { status: 400 }
      );
    }

    // Validate card details
    const {
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
      postalCode,
    } = cardDetails;

    if (!cardNumber || !expiryMonth || !expiryYear || !cvv || !postalCode) {
      return NextResponse.json(
        { error: "Missing required card details" },
        { status: 400 }
      );
    }

    // Get user from token (you'll need to implement auth verification)
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify token and get userId (implement based on your auth system)
    // This is a placeholder - you'll need to implement your actual token verification
    const userId = await verifyTokenAndGetUserId(token);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Tokenize card using Square (you'll need to implement this in your square lib)
    // This converts raw card details to a secure sourceId
    const sourceId = await tokenizeCardWithSquare(cardDetails);
    
    if (!sourceId) {
      return NextResponse.json(
        { error: "Failed to tokenize card details" },
        { status: 400 }
      );
    }

    // Process payment using the tokenized card
    const result = await createSquarePayment({
      sourceId,
      amountMoney: {
        amount: dollarsToCents(amount),
        currency: "USD"
      },
      idempotencyKey: generateIdempotencyKey()
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Payment failed" },
        { status: 400 }
      );
    }

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        currency: "USD",
        status: "COMPLETED",
        squarePaymentId: result.payment?.id ?? null,
        squareReceiptUrl: result.payment?.receiptUrl ?? null,
        metadata: JSON.stringify(result.payment)
      }
    });

    // If bookingId is provided, update booking status
    if (bookingId) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "CONFIRMED",
          paymentId: payment.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      squarePaymentId: result.payment?.id,
      squareReceiptUrl: result.payment?.receiptUrl,
      amount: payment.amount,
      status: payment.status,
    });

  } catch (error) {
    console.error("Error processing card payment:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}

// Helper function to verify token and get userId
// Implement this based on your authentication system
async function verifyTokenAndGetUserId(token: string): Promise<string | null> {
  try {
    // Example implementation - adjust based on your auth system
    // You might use JWT verification, database lookup, etc.
    
    // If you're using JWT:
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // return decoded.userId;
    
    // If you're using a database token lookup:
    // const session = await prisma.session.findUnique({
    //   where: { token }
    // });
    // return session?.userId || null;
    
    // For now, return null to indicate this needs implementation
    console.warn("Token verification not implemented");
    return null;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

// Helper function to tokenize card with Square
// Add this to your @/lib/square file or implement here
async function tokenizeCardWithSquare(cardDetails: {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  postalCode: string;
}): Promise<string | null> {
  try {
    // You'll need to implement Square card tokenization
    // This typically involves calling Square's API to convert card details to a nonce/sourceId
    
    // Example implementation (add to your square lib):
    // const { Client } = require('@square/connect');
    // const client = new Client({
    //   environment: process.env.SQUARE_ENVIRONMENT,
    //   accessToken: process.env.SQUARE_ACCESS_TOKEN,
    // });
    // 
    // const response = await client.cardsApi.tokenizeCard({
    //   card: {
    //     cardNumber: cardDetails.cardNumber,
    //     expirationMonth: cardDetails.expiryMonth,
    //     expirationYear: cardDetails.expiryYear,
    //     cvv: cardDetails.cvv,
    //     postalCode: cardDetails.postalCode,
    //   },
    // });
    // 
    // return response.result.token;

    console.warn("Card tokenization not implemented");
    return null;
  } catch (error) {
    console.error("Card tokenization failed:", error);
    return null;
  }
}