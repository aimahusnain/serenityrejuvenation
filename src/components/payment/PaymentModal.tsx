"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { SquarePaymentForm } from "./SquarePaymentForm";
import { CheckCircle, CreditCard } from "lucide-react";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  productId?: string;
  serviceTitle?: string;
  onSuccess?: (paymentResult: any) => void;
}

export function PaymentModal({
  open,
  onClose,
  amount,
  productId,
  serviceTitle,
  onSuccess,
}: PaymentModalProps) {
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handlePaymentSuccess = (paymentResult: any) => {
    setPaymentCompleted(true);
    setTimeout(() => {
      onSuccess?.(paymentResult);
      onClose();
      setPaymentCompleted(false);
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    if (!error.includes("Failed to initialize")) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] gap-0 p-0 overflow-hidden shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        {/* Header - Clean Modern */}
        <div className="px-7 py-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white dark:text-gray-900" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Secure Payment</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete payment to confirm booking
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-7 py-6 bg-white dark:bg-gray-900">
          {paymentCompleted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Payment Successful!</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Redirecting to your dashboard...
              </p>
            </div>
          ) : (
            <div key={`payment-${productId || amount}`}>
              <SquarePaymentForm
                amount={amount}
                productId={productId}
                serviceTitle={serviceTitle}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-4 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-800 flex items-center justify-center gap-2">
          <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" className="opacity-30"/>
            <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
            Secured by Square
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
