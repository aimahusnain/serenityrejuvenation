"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SquarePaymentForm } from "./SquarePaymentForm";
import { CheckCircle } from "lucide-react";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  bookingId?: string;
  productId?: string;
  serviceTitle?: string;
  onSuccess?: () => void;
}

export function PaymentModal({
  open,
  onClose,
  amount,
  bookingId,
  productId,
  serviceTitle,
  onSuccess,
}: PaymentModalProps) {
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handlePaymentSuccess = () => {
    setPaymentCompleted(true);
    setTimeout(() => {
      onSuccess?.();
      onClose();
      setPaymentCompleted(false);
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => {
        // Prevent closing when payment is processing
        e.preventDefault();
      }}>
        <DialogHeader>
          <DialogTitle>Secure Payment</DialogTitle>
          <DialogDescription>
            Complete your payment to confirm your booking
          </DialogDescription>
        </DialogHeader>

        {paymentCompleted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground">
              Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <SquarePaymentForm
            amount={amount}
            bookingId={bookingId}
            productId={productId}
            serviceTitle={serviceTitle}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
