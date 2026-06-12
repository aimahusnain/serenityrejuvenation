"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface SquarePaymentFormProps {
  amount: number;
  bookingId?: string;
  productId?: string;
  onSuccess?: (payment: any) => void;
  onError?: (error: string) => void;
  serviceTitle?: string;
}

// Square Web Payments SDK types
interface SquarePayments {
  card: (options: any) => Promise<SquareCard>;
}

interface SquareCard {
  attach: (elementId: string) => Promise<void>;
  tokenize: () => Promise<{ status: string; token?: string; errors?: any[] }>;
}

declare global {
  interface Window {
    Square: {
      payments: (config: {
        locationId: string;
        applicationId: string;
      }) => SquarePayments;
    };
  }
}

export function SquarePaymentForm({
  amount,
  bookingId,
  productId,
  onSuccess,
  onError,
  serviceTitle = "Service",
}: SquarePaymentFormProps) {
  const [card, setCard] = useState<SquareCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let scriptElement: HTMLScriptElement | null = null;

    async function initializeSquare() {
      try {
        // Load Square Web Payments SDK
        const script = document.createElement("script");
        script.src = process.env.SQUARE_ENVIRONMENT === "production"
          ? "https://web.squarecdn.com/v1/square.js"
          : "https://sandbox.web.squarecdn.com/v1/square.js";
        script.async = true;

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
          scriptElement = script;
        });

        if (!window.Square) {
          throw new Error("Failed to load Square SDK");
        }

        // Get config values
        const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
        const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;


        // Validate config before initializing
        if (!applicationId || applicationId === "undefined" || applicationId.trim() === "") {
          throw new Error("Square Application ID is missing. Please check your .env file for NEXT_PUBLIC_SQUARE_APPLICATION_ID");
        }

        if (!locationId || locationId === "undefined" || locationId.trim() === "") {
          throw new Error("Square Location ID is missing. Please check your .env file for NEXT_PUBLIC_SQUARE_LOCATION_ID");
        }

        const payments = window.Square.payments({
          locationId,
          applicationId,
        });

        const cardInstance = await payments.card({
          style: {
            ".input-container": {
              borderColor: "#ccc",
              borderRadius: "8px",
            },
            ".input-container.is-focus": {
              borderColor: "#4a90e2",
            },
            ".input-container.is-invalid": {
              borderColor: "#e74c3c",
            },
            "input": {
              backgroundColor: "#fff",
              color: "#333",
              fontSize: "16px",
            },
          },
        });

        await cardInstance.attach("#card-container");

        if (isMounted) {
          setCard(cardInstance);
          setLoading(false);
        }
      } catch (err) {
        console.error("Square initialization error:", err);
        if (isMounted) {
          setError("Failed to initialize payment form. Please refresh and try again.");
          setLoading(false);
          onError?.("Failed to initialize payment form");
        }
      }
    }

    initializeSquare();

    return () => {
      isMounted = false;
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, [onError]);

  const handlePayment = async () => {
    if (!card) return;

    setProcessing(true);
    setError(null);

    try {
      // Tokenize the card
      const tokenResult = await card.tokenize();

      if (tokenResult.status === "OK") {
        // Create payment via our API
        const response = await fetch("/api/square/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceId: tokenResult.token,
            amount,
            bookingId,
            productId,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setSuccess(true);
          onSuccess?.(result);
        } else {
          setError(result.error || "Payment failed");
          onError?.(result.error || "Payment failed");
        }
      } else {
        const error = tokenResult.errors?.[0]?.message || "Tokenization failed";
        setError(error);
        onError?.(error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment processing error";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (success) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
          <p className="text-muted-foreground">
            Your booking has been confirmed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Complete your payment for {serviceTitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-baseline justify-between">
          <span className="text-muted-foreground">Total Amount</span>
          <span className="text-2xl font-bold">${amount.toFixed(2)}</span>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Card Information</label>
          <div id="card-container" className="min-h-[44px] rounded-lg border" />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handlePayment}
          disabled={processing}
          className="w-full"
          size="lg"
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Secured by Square Payments
        </p>
      </CardContent>
    </Card>
  );
}
