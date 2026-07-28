import { SquareClient, SquareEnvironment, SquareError } from "square";

const config = {
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
};

export const squareClient = new SquareClient({
  token: config.token,
  environment: config.environment,
});

// Get the API clients (lowercase, getter methods)
export const paymentsClient = squareClient.payments;
export const bookingsClient = squareClient.bookings;
export const ordersClient = squareClient.orders;
export const locationsClient = squareClient.locations;
export const refundsClient = squareClient.refunds;

// Get location ID from env
export const LOCATION_ID = process.env.SQUARE_LOCATION_ID;

/**
 * Create a payment with Square
 */
export async function createSquarePayment(params: {
  sourceId: string;
  amountMoney: {
    amount: number;
    currency: string;
  };
  idempotencyKey: string;
  customerId?: string;
  referenceId?: string;
  note?: string;
}) {
  try {
    const result = await paymentsClient.create({
      sourceId: params.sourceId,
      idempotencyKey: params.idempotencyKey,
      locationId: LOCATION_ID!,
      acceptPartialAuthorization: false,
      autocomplete: true,
      amountMoney: {
        amount: BigInt(params.amountMoney.amount),
        currency: params.amountMoney.currency as "USD",
      },
      ...(params.customerId && { customerId: params.customerId }),
      ...(params.referenceId && { referenceId: params.referenceId }),
      ...(params.note && { note: params.note }),
    });

    return { success: true, payment: result.payment };
  } catch (error) {
    if (error instanceof SquareError) {
      console.error("Square Payment Error:", error);
      return {
        success: false,
        error: error.message || "Payment failed",
        errors: error.errors,
      };
    }
    throw error;
  }
}

/**
 * Get payment details by ID
 */
export async function getPaymentDetails(paymentId: string) {
  try {
    const result = await paymentsClient.get({ paymentId });
    return { success: true, payment: result.payment };
  } catch (error) {
    if (error instanceof SquareError) {
      return {
        success: false,
        error: error.message || "Failed to get payment",
      };
    }
    throw error;
  }
}

/**
 * Create a refund
 */
export async function createRefund(params: {
  paymentId: string;
  amountMoney: {
    amount: number;
    currency: string;
  };
  idempotencyKey: string;
  reason?: string;
}) {
  try {
    const result = await refundsClient.refundPayment({
      paymentId: params.paymentId,
      idempotencyKey: params.idempotencyKey,
      locationId: LOCATION_ID!,
      amountMoney: {
        amount: BigInt(params.amountMoney.amount),
        currency: params.amountMoney.currency as any,
      },
      ...(params.reason && { reason: params.reason }),
    });

    return { success: true, refund: result.refund };
  } catch (error) {
    if (error instanceof SquareError) {
      return {
        success: false,
        error: error.message || "Refund failed",
      };
    }
    throw error;
  }
}

/**
 * Verify webhook signature using Square's WebhooksHelper
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  webhookSignatureKey: string
): boolean {
  try {
    const { WebhooksHelper } = require("square");
    return WebhooksHelper.isValidWebhookEvent(
      body,
      signature,
      webhookSignatureKey
    );
  } catch (error) {
    console.error("Webhook verification error:", error);
    return false;
  }
}

/**
 * Format amount in cents to dollars
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/**
 * Format dollars to cents (Square uses cents)
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Generate idempotency key for Square requests
 */
export function generateIdempotencyKey(): string {
  return `idempotency-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
