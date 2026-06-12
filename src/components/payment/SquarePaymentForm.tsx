"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Lock, CreditCard } from "lucide-react";

interface SquarePaymentFormProps {
  amount: number;
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
      payments: (applicationId: string, locationId: string) => SquarePayments;
    };
  }
}

export function SquarePaymentForm({
  amount,
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
  const [containerReady, setContainerReady] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const initAttemptedRef = useRef(false);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      console.log("Container mounted in DOM");
      setContainerReady(true);
    }
  }, []);

  useEffect(() => {
    if (sdkLoaded || initAttemptedRef.current) return;
    initAttemptedRef.current = true;

    let scriptElement: HTMLScriptElement | null = null;

    const script = document.createElement("script");
    script.src = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === "production"
      ? "https://web.squarecdn.com/v1/square.js"
      : "https://sandbox.web.squarecdn.com/v1/square.js";
    script.async = true;

    script.onload = () => {
      console.log("Square SDK loaded");
      setSdkLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load Square SDK");
      setError("Failed to load payment provider. Please refresh and try again.");
      setLoading(false);
    };

    document.head.appendChild(script);
    scriptElement = script;

    return () => {
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, [sdkLoaded]);

  useEffect(() => {
    if (!sdkLoaded || !containerReady || card) return;

    let isMounted = true;

    async function initializeSquare() {
      try {
        if (!window.Square) {
          throw new Error("Square SDK not available");
        }

        const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
        const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

        if (!applicationId || applicationId === "undefined" || applicationId.trim() === "") {
          throw new Error("Square Application ID is missing from environment");
        }

        if (!locationId || locationId === "undefined" || locationId.trim() === "") {
          throw new Error("Square Location ID is missing from environment");
        }

        const payments = window.Square.payments(applicationId, locationId);

        // Detect dark mode
        const darkMode = document.documentElement.classList.contains('dark');
        setIsDarkMode(darkMode);

        const cardInstance = await payments.card();

        if (!isMounted) return;

        await cardInstance.attach("#card-container");

        if (isMounted) {
          setCard(cardInstance);
          setLoading(false);
        }
      } catch (err) {
        console.error("Square initialization error:", err);
        if (isMounted) {
          const errorMsg = err instanceof Error ? err.message : "Failed to initialize payment form";
          setError(errorMsg);
          setLoading(false);
        }
      }
    }

    initializeSquare();

    return () => {
      isMounted = false;
    };
  }, [sdkLoaded, containerReady, card]);

  const handlePayment = async () => {
    if (!card) return;

    setProcessing(true);
    setError(null);

    try {
      const tokenResult = await card.tokenize();

      if (tokenResult.status === "OK") {
        const response = await fetch("/api/square/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceId: tokenResult.token,
            amount,
            productId,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setSuccess(true);
          onSuccess?.(result);
        } else {
          let errorMessage = result.error || "Payment failed";

          if (result.details?.[0]?.code === "INVALID_EXPIRATION") {
            errorMessage = "Invalid card expiration date. Use a valid future date.";
          } else if (result.details?.[0]?.code === "CARD_DECLINED") {
            errorMessage = "Card was declined. Please try a different card.";
          } else if (result.details?.[0]?.detail) {
            errorMessage = result.details[0].detail;
          }

          setError(errorMessage);
          onError?.(errorMessage);
        }
      } else {
        const errorDetail = tokenResult.errors?.[0]?.detail || tokenResult.errors?.[0]?.message || "Tokenization failed";
        const errorCode = tokenResult.errors?.[0]?.code;

        let userMessage = errorDetail;
        if (errorCode === "INVALID_EXPIRATION") {
          userMessage = "Invalid card expiration date. Use a valid future date.";
        }

        setError(userMessage);
        onError?.(userMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment processing error";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-6 shadow-lg">
          <CheckCircle className="h-10 w-10 text-white" strokeWidth={2.5} />
        </div>
        <h3 className="text-2xl font-semibold mb-2 text-[#271024]">Payment Successful!</h3>
        <p className="text-muted-foreground">
          Your booking has been confirmed. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Amount Display - Clean & Modern */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Amount</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">Secure payment</p>
          </div>
          <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            ${amount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Card Input - Clean Container */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Payment Information
        </label>
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-1 shadow-sm">
          <div
            ref={containerRef}
            id="card-container"
            className="min-h-[56px]"
          />
        </div>
        {loading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Submit Button - Modern & Clean */}
      <Button
        onClick={handlePayment}
        disabled={processing || loading || !card}
        className="w-full h-13 text-base font-semibold rounded-xl bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 shadow-xl shadow-gray-900/10 dark:shadow-white/5 transition-all duration-200 disabled:opacity-50"
        size="lg"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-5 w-5" />
            Pay ${amount.toFixed(2)}
          </>
        )}
      </Button>

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 pt-1">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
          <Lock className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Secured by Square
          </span>
        </div>
      </div>
    </div>
  );
}
